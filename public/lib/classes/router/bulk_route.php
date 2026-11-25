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

namespace core\router;

use core\router;
use core\uuid;
use GuzzleHttp\Psr7\Message;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use GuzzleHttp\Psr7\Uri;
use GuzzleHttp\Psr7\UriResolver;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Bulk API Handler.
 *
 * This bulk handler attempts to support the ODATA 4.0 specification for batch requests.
 * Note: This is not a full implementation of ODATA 4.0 and may not meet all requirements.
 * The full ODATA 4.0 specification can be found at https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class bulk_route {
    /**
     * Constructor for the bulk route handler.
     *
     * @param router $router The router instance to use for handling requests.
     */
    public function __construct(
        /** @var router */
        private router $router,
    ) {
    }

    /**
     * Handle a bulk request.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    public function handle(
        ServerRequestInterface $request,
        ResponseInterface $response,
    ): ResponseInterface {
        // Bulk requests must have a MIME type of multipart/mixed.
        [$contenttype] = explode(';', $request->getHeaderLine('Content-Type'));

        return match (strtolower(trim($contenttype))) {
            'multipart/mixed' => $this->handle_multipart_mixed_request($request, $response),

            default => $response->withStatus(415),
        };
    }

    /**
     * Handle a multipart/mixed request.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    protected function handle_multipart_mixed_request(
        ServerRequestInterface $request,
        ResponseInterface $response,
    ): ResponseInterface {
        $boundary = self::get_boundary_from_contenttype($request->getHeaderLine('Content-Type'));
        if ($boundary === null) {
            return $response->withStatus(400);
        }

        $responseboundary = uuid::generate();
        $response = $response->withHeader('Content-Type', "multipart/mixed; boundary={$responseboundary}");
        // A valid boundary accepts the batch even if the body contains malformed parts.
        // Such failures are reported in individual responses.
        try {
            $requestparts = $this->get_requests_from_body((string) $request->getBody(), $boundary);
        } catch (\InvalidArgumentException $exception) {
            $requestparts = [null];
        }

        $continueonerror = self::continue_on_error($request->getHeaderLine('Prefer'));
        $contentids = [];
        foreach ($requestparts as $requestpart) {
            $contentid = null;
            $requestresponse = null;
            try {
                if ($requestpart === null) {
                    throw new \InvalidArgumentException('Invalid multipart body');
                }
                $partheaders = self::get_part_headers($requestpart);
                $contentid = $partheaders['content-id'][0] ?? null;
                if (
                    count($partheaders['content-type'] ?? []) === 1
                    && self::get_boundary_from_contenttype($partheaders['content-type'][0]) !== null
                ) {
                    // A change set promises atomicity, so never dispatch its operations independently.
                    $childrequest = null;
                    $requestresponse = new Response(
                        501,
                        ['Content-Type' => 'application/json'],
                        '{"error":{"code":"AtomicChangeSetNotSupported","message":"Atomic change sets are not supported."}}',
                    );
                } else {
                    $childrequest = self::get_request_from_part($requestpart);
                    if (
                        $childrequest->hasHeader('Authorization')
                        || $childrequest->hasHeader('Proxy-Authorization')
                        || $childrequest->hasHeader('Cookie')
                    ) {
                        throw new \InvalidArgumentException('Invalid authentication header');
                    }
                    if ($contentid !== null) {
                        if ($contentid === '' || in_array($contentid, $contentids, true)) {
                            throw new \InvalidArgumentException('Invalid request identifier');
                        }
                        $contentids[] = $contentid;
                    }
                }
            } catch (\InvalidArgumentException $exception) {
                $childrequest = null;
            }

            if ($childrequest === null) {
                $requestresponse ??= new Response(
                    400,
                    ['Content-Type' => 'application/json'],
                    '{"error":{"code":"InvalidBatchRequest","message":"Invalid batch request."}}',
                );
            } else {
                if (Uri::isRelativePathReference($childrequest->getUri())) {
                    $childrequest = $childrequest->withUri(
                        UriResolver::resolve($request->getUri(), $childrequest->getUri()),
                        true,
                    );
                }
                if ($request->hasHeader('Authorization')) {
                    $childrequest = $childrequest->withHeader('Authorization', $request->getHeader('Authorization'));
                }

                // Ensure that we clean up before handling each sub-request.
                $this->reset_environment();

                // Pass each sub-request through the Router.
                $requestresponse = $this->router->handle_request($childrequest);
            }

            // Write the response to the body of the combined response.
            // Note: The response is written within an application/http and may have its own headers and status.
            $response->getBody()->write("--{$responseboundary}\r\n");
            $response->getBody()->write("Content-Type: application/http\r\n");
            if ($contentid !== null && $contentid !== '') {
                $response->getBody()->write("Content-ID: {$contentid}\r\n");
            }
            $response->getBody()->write("\r\n");
            $response->getBody()->write(sprintf(
                "HTTP/1.1 %s %s\r\n",
                $requestresponse->getStatusCode(),
                $requestresponse->getReasonPhrase(),
            ));
            foreach ($requestresponse->getHeaders() as $header => $values) {
                $response->getBody()->write(sprintf("%s: %s\r\n", $header, implode(', ', $values)));
            }
            $response->getBody()->write("\r\n");

            $data = (string) $requestresponse->getBody();
            $response->getBody()->write($data);

            $response->getBody()->write("\r\n");

            if ($requestresponse->getStatusCode() >= 400 && !$continueonerror) {
                break;
            }
        }

        $response->getBody()->write("--{$responseboundary}--");
        return $response;
    }

    /**
     * Reset the environment between pages.
     */
    protected function reset_environment(): void {
        // Reset the page, renderer and course globals; this does not undo other side effects.
        \core\setup::setup_page();
        \core\setup::setup_output();
        \core\setup::setup_course_global();
    }

    /**
     * Whether the client requested processing to continue after an error.
     *
     * @param string $prefer The Prefer header; multipart stops on errors unless continuation is requested
     * @return bool
     */
    protected static function continue_on_error(string $prefer): bool {
        foreach (explode(',', $prefer) as $preference) {
            if (
                preg_match(
                    '/^\s*(?:odata\.)?continue-on-error\s*(?:=\s*(true|false))?\s*(?:;.*)?$/i',
                    $preference,
                    $matches,
                )
            ) {
                return !isset($matches[1]) || strtolower($matches[1]) === 'true';
            }
        }
        return false;
    }

    /**
     * Get the requests from the multipart request body.
     *
     * @param string $requestbody
     * @param string $boundary
     * @return string[]
     */
    protected function get_requests_from_body(string $requestbody, string $boundary): array {
        // Delimiters must occupy complete MIME lines; ignore preamble and epilogue.
        $pattern = '/(?:\A|\r\n)--' . preg_quote($boundary, '/') . '(--)?[ \t]*(?:\r\n|\z)/';
        preg_match_all($pattern, $requestbody, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE);
        $parts = [];
        $start = null;
        foreach ($matches as $match) {
            if ($start !== null) {
                $parts[] = substr($requestbody, $start, $match[0][1] - $start);
            }
            if (($match[1][0] ?? '') === '--') {
                if ($start === null || !$parts) {
                    throw new \InvalidArgumentException('Invalid multipart body');
                }
                return $parts;
            }
            $start = $match[0][1] + strlen($match[0][0]);
        }
        throw new \InvalidArgumentException('Missing multipart boundary');
    }

    /**
     * Get the boundary from a Content-Type header.
     *
     * @param string $contenttype
     * @return null|string
     */
    public static function get_boundary_from_contenttype(string $contenttype): ?string {
        if (!preg_match('/^\s*multipart\/mixed\s*;/i', $contenttype)) {
            return null;
        }
        if (!preg_match('/;\s*boundary\s*=\s*(?:"([^"]+)"|([^;\s]+))\s*(?=;|$)/i', $contenttype, $matches)) {
            return null;
        }
        $boundary = $matches[1] !== '' ? $matches[1] : $matches[2];
        // A MIME boundary has at most 70 permitted characters and cannot end in a space.
        if (!preg_match("/\\A[0-9A-Za-z'()+_,.\\/:=? -]{1,70}\\z/D", $boundary) || str_ends_with($boundary, ' ')) {
            return null;
        }
        return $boundary;
    }

    /**
     * Get a request from a part of a multipart/mixed request.
     *
     * @param string $requestpart
     * @return ServerRequestInterface
     */
    public static function get_request_from_part(string $requestpart): ServerRequestInterface {
        $parts = explode("\r\n\r\n", $requestpart, 2);
        if (count($parts) !== 2) {
            throw new \InvalidArgumentException('Invalid MIME part');
        }
        $partheaders = self::get_part_headers($requestpart);
        if (
            count($partheaders['content-type'] ?? []) !== 1
            || strtolower(trim($partheaders['content-type'][0])) !== 'application/http'
            || count($partheaders['content-id'] ?? []) > 1
        ) {
            throw new \InvalidArgumentException('Invalid MIME headers');
        }
        // Content-ID belongs to the MIME part, not the embedded HTTP request headers.
        $contentid = $partheaders['content-id'][0] ?? null;
        $http = Message::parseMessage($parts[1]);
        if (!preg_match('/^(\S+)\s+(\S+)\s+HTTP\/(\d+\.\d+)$/', $http['start-line'], $matches)) {
            throw new \InvalidArgumentException('Invalid request line');
        }
        $request = new ServerRequest($matches[1], $matches[2], $http['headers'], $http['body'], $matches[3]);
        parse_str($request->getUri()->getQuery(), $queryparams);
        return $request->withQueryParams($queryparams)->withAttribute('batch_content_id', $contentid);
    }

    /**
     * Read the MIME headers of a request part.
     *
     * @param string $requestpart
     * @return array
     */
    protected static function get_part_headers(string $requestpart): array {
        $parts = explode("\r\n\r\n", $requestpart, 2);
        if (count($parts) !== 2) {
            throw new \InvalidArgumentException('Invalid MIME part');
        }
        $part = Message::parseMessage("HTTP/1.1 200 OK\r\n{$parts[0]}\r\n\r\n");
        $partheaders = [];
        foreach ($part['headers'] as $name => $values) {
            $name = strtolower($name);
            $partheaders[$name] = array_merge($partheaders[$name] ?? [], $values);
        }
        return $partheaders;
    }
}
