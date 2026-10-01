<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

namespace core\router\middleware;

use core\api\repository\idempotency_key_repository;
use core\exception\api\idempotency\invalid_key_exception;
use core\exception\api\idempotency\key_in_progress_exception;
use core\exception\api\idempotency\key_mismatch_exception;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Proof-of-concept middleware to support Idempotency Keys on the REST API.
 *
 * Clients may supply an `Idempotency-Key` header on unsafe requests (POST/PATCH/PUT/DELETE).
 * The first request with a given key is processed as normal and its response is captured. Any
 * subsequent request reusing the same key (for the same user, route, and request body) will
 * short-circuit and replay the original response, rather than repeating the underlying action.
 *
 * This protects clients who retry requests after a timeout or connection failure (where they
 * cannot tell whether the original request succeeded) from accidentally duplicating the effect
 * of a non-idempotent operation (e.g. creating the same resource twice).
 *
 * Captured responses can contain sensitive data (e.g. the full content of whatever resource was
 * created), so they are persisted in the database rather than MUC: cache stores are liable to be
 * purged at any time (e.g. by an administrator, or a store evicting under memory pressure)
 * without notice, which would otherwise silently defeat the replay protection this middleware is
 * meant to provide. Responses are encrypted at rest using {@see \core\encryption}.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class idempotency_key_middleware implements MiddlewareInterface {
    /** @var string The name of the header used to supply the Idempotency Key. */
    protected const HEADER_NAME = 'Idempotency-Key';

    /** @var int The maximum length of a supplied key. */
    protected const MAX_KEY_LENGTH = 255;

    /** @var string[] The list of HTTP methods for which idempotency keys are honoured. */
    protected const APPLICABLE_METHODS = ['POST', 'PATCH', 'PUT', 'DELETE'];

    /**
     * @var int How long a 'processing' record is retained for if it is never completed (e.g.
     * because the server crashed mid-request). This is intentionally short: it exists only to
     * self-heal an abandoned record, not to bound how long a healthy request is allowed to take.
     */
    protected const PROCESSING_TTL_SECONDS = 300;

    /** @var int How long a captured response is retained for, and so can be replayed. */
    protected const COMPLETE_TTL_SECONDS = 86400; // 24 hours.

    /**
     * Constructor for the Idempotency Key Middleware.
     *
     * @param ResponseFactoryInterface $responsefactory Used to reconstruct cached/error responses.
     * @param idempotency_key_repository $repository Persists captured responses.
     */
    public function __construct(
        protected readonly ResponseFactoryInterface $responsefactory,
        protected readonly idempotency_key_repository $repository,
    ) {
    }

    #[\Override]
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface {
        if (!in_array(strtoupper($request->getMethod()), self::APPLICABLE_METHODS, true)) {
            // Idempotency keys are only relevant for unsafe (non-idempotent) HTTP methods.
            return $handler->handle($request);
        }

        if (!$request->hasHeader(self::HEADER_NAME)) {
            // Idempotency support is opt-in. Clients which do not send the header get the legacy behaviour.
            return $handler->handle($request);
        }

        $key = trim($request->getHeaderLine(self::HEADER_NAME));
        if ($key === '' || strlen($key) > self::MAX_KEY_LENGTH) {
            throw new invalid_key_exception(
                sprintf(
                    'The %s header must be a non-empty string of no more than %d characters.',
                    self::HEADER_NAME,
                    self::MAX_KEY_LENGTH,
                ),
            );
        }

        $requesthash = $this->hash_request($request);
        $keyhash = $this->get_key_hash($request, $key);

        $existing = $this->repository->find_by_keyhash($keyhash);
        if ($existing !== null) {
            return $this->handle_existing_record($existing, $requesthash);
        }

        $userid = $request->getAttribute('user')->id ?? 0;
        $record = $this->repository->begin_processing($keyhash, $requesthash, $userid, self::PROCESSING_TTL_SECONDS);
        if ($record === null) {
            // We lost a race with a concurrent request using the same key. Re-fetch and defer to it.
            $existing = $this->repository->find_by_keyhash($keyhash);
            if ($existing !== null) {
                return $this->handle_existing_record($existing, $requesthash);
            }

            // Vanishingly unlikely (the concurrent record would have to be deleted between our two
            // queries), but fail safely rather than let the request through unprotected.
            throw new key_in_progress_exception();
        }

        try {
            $response = $handler->handle($request);
        } catch (\Throwable $exception) {
            // The request could not be completed. Forget the key so that the client is able to retry it.
            $this->repository->delete($record->id);
            throw $exception;
        }

        if ($response->getStatusCode() >= 500) {
            // Do not persist server errors. The client should be able to retry with the same key.
            $this->repository->delete($record->id);
            return $response;
        }

        // Read the body now, to capture it, then rewind so it can still be read by whatever returns
        // this response to the client.
        $body = (string) $response->getBody();
        $response->getBody()->rewind();

        $this->repository->mark_complete(
            $record->id,
            $response->getStatusCode(),
            $response->getHeaders(),
            $body,
            self::COMPLETE_TTL_SECONDS,
        );

        return $response;
    }

    /**
     * Handle a request for which a record (processing or complete) already exists.
     *
     * @param \stdClass $existing
     * @param string $requesthash The hash of the current request, to check for key reuse.
     * @return ResponseInterface
     */
    protected function handle_existing_record(\stdClass $existing, string $requesthash): ResponseInterface {
        if ($existing->requesthash !== $requesthash) {
            // The same key has been reused with a different request. This is a client error:
            // Idempotency-Keys must only be reused for retries of the exact same request.
            throw new key_mismatch_exception();
        }

        if ($existing->state === idempotency_key_repository::STATE_PROCESSING) {
            // An earlier request with this key is still being processed (e.g. a concurrent retry).
            throw new key_in_progress_exception();
        }

        // We have a captured, completed, response for an identical request. Replay it.
        return $this->create_response_from_record($existing)
            ->withHeader('Idempotency-Replayed', 'true');
    }

    /**
     * Calculate the hash to use for a given request and Idempotency-Key.
     *
     * The hash is scoped to the current user and route so that the same Idempotency-Key value can
     * safely be reused by different users, or against different endpoints, without colliding.
     *
     * @param ServerRequestInterface $request
     * @param string $key The raw Idempotency-Key supplied by the client.
     * @return string
     */
    protected function get_key_hash(ServerRequestInterface $request, string $key): string {
        $user = $request->getAttribute('user');
        $userid = $user->id ?? 0;

        return hash('sha256', implode('|', [
            $userid,
            strtoupper($request->getMethod()),
            $request->getUri()->getPath(),
            $key,
        ]));
    }

    /**
     * Calculate a hash representing the content of a request, used to detect key reuse with a different payload.
     *
     * @param ServerRequestInterface $request
     * @return string
     */
    protected function hash_request(ServerRequestInterface $request): string {
        $body = (string) $request->getBody();
        $request->getBody()->rewind();

        return hash('sha256', $request->getMethod() . "\0" . $request->getUri()->getPath() . "\0" . $body);
    }

    /**
     * Reconstruct a PSR-7 Response from a previously-captured record.
     *
     * @param \stdClass $record
     * @return ResponseInterface
     */
    protected function create_response_from_record(\stdClass $record): ResponseInterface {
        $decoded = $this->repository->decode_response($record);

        $response = $this->responsefactory->createResponse($decoded['status']);
        foreach ($decoded['headers'] as $name => $values) {
            foreach ($values as $value) {
                $response = $response->withAddedHeader($name, $value);
            }
        }
        $response->getBody()->write($decoded['body']);

        return $response;
    }
}
