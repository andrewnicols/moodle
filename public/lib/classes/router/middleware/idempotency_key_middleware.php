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
use Psr\Http\Message\MessageInterface;
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
 * Idempotency protection requires an authenticated user (see {@see process()}): the key is scoped
 * per-user, and anonymous requests have no way of being distinguished from one another, which
 * would otherwise let unrelated anonymous clients collide on the same key value and have each
 * other's captured responses replayed to them. Anonymous requests carrying the header are
 * processed normally, without idempotency protection, and are flagged via an
 * `Idempotency-Status: Unauthenticated-Skipped` response header.
 *
 * Captured responses can contain sensitive data (e.g. the full content of whatever resource was
 * created), so they are persisted in the database rather than MUC: cache stores are liable to be
 * purged at any time (e.g. by an administrator, or a store evicting under memory pressure)
 * without notice, which would otherwise silently defeat the replay protection this middleware is
 * meant to provide. Responses are gzip-compressed and encrypted at rest using
 * {@see \core\encryption}. Responses which are still too large after compression are not
 * persisted at all (see {@see \core\api\repository\idempotency_key_repository::mark_complete()}).
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

        $userattribute = $request->getAttribute('user');
        if ($userattribute === null || empty($userattribute->id)) {
            // Idempotency protection requires an authenticated user: the key is scoped per-user
            // (see get_key_hash()), and without that scoping, unrelated anonymous clients could
            // collide on the same key value and have each other's captured responses replayed to
            // them. Writes are not generally expected to be performed anonymously, so we fail open
            // here (process the request as normal, without idempotency protection) rather than
            // reject the request outright. This also means no 'processing' record is ever written
            // to the database for anonymous callers, which would otherwise be an easy unauthenticated
            // storage-amplification vector.
            $response = $handler->handle($request);

            return $response->withHeader('Idempotency-Status', 'Unauthenticated-Skipped');
        }

        // Read the body now, to hash it.
        [$body, $request] = $this->capture_body($request);

        $requesthash = $this->hash_request($request, $body);
        $keyhash = $this->get_key_hash($request, $key);

        $existing = $this->repository->find_by_keyhash($keyhash);
        if ($existing !== null) {
            $response = $this->handle_existing_record($existing, $requesthash);
            if ($response !== null) {
                return $response;
            }

            // The existing record was corrupt and has been discarded (see
            // handle_existing_record()). Fall through and treat this as a fresh request.
        }

        $userid = (int) $userattribute->id;
        $record = $this->repository->begin_processing($keyhash, $requesthash, $userid, self::PROCESSING_TTL_SECONDS);
        if ($record === null) {
            // We lost a race with a concurrent request using the same key. Re-fetch and defer to it.
            $existing = $this->repository->find_by_keyhash($keyhash);
            if ($existing !== null) {
                $response = $this->handle_existing_record($existing, $requesthash);
                if ($response !== null) {
                    return $response;
                }

                // Vanishingly unlikely: corrupt twice in a row. Fail safely rather than loop
                // indefinitely or let the request through unprotected.
                throw new key_in_progress_exception();
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

        // Read the body now, to capture it.
        [$body, $response] = $this->capture_body($response);

        $persisted = $this->repository->mark_complete(
            $record->id,
            $response->getStatusCode(),
            $response->getHeaders(),
            $body,
            self::COMPLETE_TTL_SECONDS,
        );

        if (!$persisted) {
            // The response was too large to persist for replay (see
            // idempotency_key_repository::get_max_response_bytes(), configurable via the
            // 'apiidempotencymaxresponsebytes' admin setting). Forget the key so the client can
            // retry, and signal that idempotency protection did not apply to this call.
            //
            // Future improvement: if large captured responses turn out to be common enough to
            // matter, we could store the (still encrypted) payload via the File Storage API
            // instead of a DB text column, and raise or remove this limit. Not pursued here since
            // it adds real complexity (file lifecycle/cleanup, no built-in encryption-at-rest) for
            // what is expected to be a rare case.
            $this->repository->delete($record->id);
            return $response->withHeader('Idempotency-Status', 'Processing-Skipped');
        }

        return $response;
    }

    /**
     * Handle a request for which a record (processing or complete) already exists.
     *
     * @param \stdClass $existing
     * @param string $requesthash The hash of the current request, to check for key reuse.
     * @return ResponseInterface|null The replayed response, or null if the captured response
     *                                could not be decoded (e.g. the encryption key has since
     *                                changed, or the stored data is corrupt). The caller should
     *                                treat a null return as if no record existed: the corrupt
     *                                record has already been deleted.
     */
    protected function handle_existing_record(\stdClass $existing, string $requesthash): ?ResponseInterface {
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
        try {
            $response = $this->create_response_from_record($existing);
        } catch (\Throwable $exception) {
            // The captured response could not be decrypted or decoded. This can happen if the
            // site's encryption key has changed since it was stored (e.g. a database restored
            // into an environment without the original dataroot/secret key), or if the stored
            // data is otherwise corrupt. Fail open: forget the record and let the caller process
            // the request as if it were new, rather than returning a hard error for what the
            // client otherwise has no way to recover from until the record expires.
            debugging(
                'Unable to decode a captured idempotency key response, discarding it: ' . $exception->getMessage(),
                DEBUG_NORMAL,
            );
            $this->repository->delete($existing->id);
            return null;
        }

        return $response->withHeader('Idempotency-Replayed', 'true');
    }

    /**
     * Read the full body of a PSR-7 message, returning it alongside a message guaranteed to still
     * have a usable body afterwards.
     *
     * If the original stream is seekable, it is rewound in place at no extra memory cost. If it
     * is not seekable (e.g. a lazily-generated or proxied stream), rewinding it would either
     * throw or leave it exhausted for whatever reads the message next, so it is instead replaced
     * with a fresh stream built from the bytes already read.
     *
     * @template T of MessageInterface
     * @param T $message
     * @return array{0: string, 1: T} The body content, and a message safe to pass on.
     */
    protected function capture_body(MessageInterface $message): array {
        $stream = $message->getBody();
        $body = (string) $stream;

        if ($stream->isSeekable()) {
            $stream->rewind();
        } else {
            $message = $message->withBody(\GuzzleHttp\Psr7\Utils::streamFor($body));
        }

        return [$body, $message];
    }

    /**
     * Calculate the hash to use for a given request and Idempotency-Key.
     *
     * The hash is scoped to the current user and route so that the same Idempotency-Key value can
     * safely be reused by different users, or against different endpoints, without colliding.
     *
     * Only called from {@see process()} once an authenticated user has already been confirmed to
     * be present on the request, so the userid is never the anonymous fallback of 0.
     *
     * @param ServerRequestInterface $request
     * @param string $key The raw Idempotency-Key supplied by the client.
     * @return string
     */
    protected function get_key_hash(ServerRequestInterface $request, string $key): string {
        $userid = (int) $request->getAttribute('user')->id;

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
     * @param string $body The already-read request body (see {@see self::process()}).
     * @return string
     */
    protected function hash_request(ServerRequestInterface $request, string $body): string {
        // The query string is included because it can change the semantics of an otherwise
        // identical method+path+body request (e.g. filters, flags, pagination).
        return hash(
            'sha256',
            $request->getMethod() . "\0" .
            $request->getUri()->getPath() . "\0" .
            $request->getUri()->getQuery() . "\0" .
            $body,
        );
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
