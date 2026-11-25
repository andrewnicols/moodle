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
 * Supports independent requests in the OData multipart and JSON batch formats, but is not
 * a full OData service. Responses use the same format as the request. Atomic change sets,
 * JSON conditions, and references to other requests are not supported.
 *
 * JSON batches continue by default, honour dependencies, and can request continue-on-error=false.
 *
 * A JSON envelope has the form
 * {"requests":[{"id":"1","method":"GET","url":"rest/v2/example"}]}.
 * The matching response uses {"responses":[{"id":"1","status":200}]}.
 *
 * @see https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_BatchRequests
 * @see https://docs.oasis-open.org/odata/odata-json-format/v4.01/odata-json-format-v4.01.html#sec_BatchRequestsandResponses
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
        return match (self::media_type($request->getHeaderLine('Content-Type'))) {
            'multipart/mixed' => $this->handle_multipart_mixed_request($request, $response),
            'application/json' => $this->handle_json_request($request, $response),

            default => $response->withStatus(415),
        };
    }

    /**
     * Handle a JSON batch.
     *
     * An invalid envelope cannot be correlated to response IDs, so it receives an outer
     * 400 before executing any child. This differs from OData's accepted-batch status rule.
     * Errors in an individual request have an individual response.
     * Atomic group members are all rejected; dependent requests get 424 rather than running.
     * Unsupported conditions and references must not be silently treated as independent.
     * If a child response cannot be encoded as JSON, its response is 500, but the child
     * may already have completed and its side effects are not rolled back.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    protected function handle_json_request(
        ServerRequestInterface $request,
        ResponseInterface $response,
    ): ResponseInterface {
        if (!self::accepts_json($request->getHeaderLine('Accept'))) {
            return $response->withStatus(406);
        }

        try {
            $batch = json_decode((string) $request->getBody(), false, 512, JSON_THROW_ON_ERROR);
            $requests = self::validate_json_batch($batch);
        } catch (\JsonException | \InvalidArgumentException $exception) {
            $response = $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            $response->getBody()->write('{"error":{"code":"InvalidBatchRequest","message":"Invalid batch request."}}');
            return $response;
        }

        $continueonerror = self::continue_on_error($request->getHeaderLine('Prefer'), true);
        $statuses = [];
        $responses = [];
        foreach ($requests as $item) {
            $result = null;
            if (isset($item->atomicityGroup)) {
                $result = self::batch_error(501, 'AtomicChangeSetNotSupported', 'Atomic change sets are not supported.');
            } else if (property_exists($item, 'if')) {
                $result = self::batch_error(501, 'BatchConditionNotSupported', 'Batch conditions are not supported.');
            } else {
                foreach ($item->dependsOn ?? [] as $dependency) {
                    if ($statuses[$dependency] < 200 || $statuses[$dependency] >= 300) {
                        $result = self::batch_error(424, 'FailedDependency', 'A batch dependency failed.');
                        break;
                    }
                }
            }

            if ($result === null) {
                try {
                    $child = $this->get_json_child_request($item, $request);
                } catch (\InvalidArgumentException | \JsonException $exception) {
                    $result = self::batch_error(400, 'InvalidBatchRequest', 'Invalid batch request.');
                } catch (\BadMethodCallException $exception) {
                    $result = self::batch_error(501, 'BatchReferenceNotSupported', 'Batch references are not supported.');
                }
                if ($result === null) {
                    $result = $this->dispatch_child_request($child, $request);
                }
            }

            try {
                $resultobject = self::get_json_response($item, $result);
            } catch (\JsonException $exception) {
                $result = self::batch_error(500, 'InvalidBatchResponse', 'The batch response could not be encoded.');
                $resultobject = self::get_json_response($item, $result);
            }
            $responses[] = $resultobject;
            $statuses[$item->id] = $result->getStatusCode();
            if (isset($item->atomicityGroup)) {
                $statuses[$item->atomicityGroup] = $result->getStatusCode();
            }
            if ($result->getStatusCode() >= 400 && !$continueonerror) {
                break;
            }
        }

        $response = $response->withHeader('Content-Type', 'application/json');
        $response->getBody()->write(json_encode(['responses' => $responses], JSON_THROW_ON_ERROR));
        return $response;
    }

    /**
     * Validate identifiers, contiguous groups and backward dependencies before dispatch.
     *
     * All IDs must be unique across both requests and groups. A dependency on a different
     * atomic group must name the group, not an individual member, and cannot refer forward.
     *
     * @param mixed $batch
     * @return array
     */
    protected static function validate_json_batch(mixed $batch): array {
        if (!is_object($batch) || !isset($batch->requests) || !is_array($batch->requests)) {
            throw new \InvalidArgumentException('Invalid batch envelope');
        }

        $ids = [];
        $groups = [];
        $lastgroup = null;
        foreach ($batch->requests as $index => $item) {
            if (
                !is_object($item)
                || !isset($item->id)
                || !is_string($item->id)
                || !preg_match('/\A[A-Za-z0-9._~-]+\z/D', $item->id)
                || isset($ids[$item->id])
            ) {
                throw new \InvalidArgumentException('Invalid request identifier');
            }
            $ids[$item->id] = $index;
            $group = $item->atomicityGroup ?? null;
            if (
                property_exists($item, 'atomicityGroup')
                && (!is_string($group) || !preg_match('/\A[A-Za-z0-9._~-]+\z/D', $group))
            ) {
                throw new \InvalidArgumentException('Invalid atomicity group');
            }
            if ($group !== null) {
                if (isset($groups[$group]) && $lastgroup !== $group) {
                    throw new \InvalidArgumentException('Atomicity group members must be adjacent');
                }
                $groups[$group] = $index;
            }
            $lastgroup = $group;
        }
        if (array_intersect_key($ids, $groups)) {
            throw new \InvalidArgumentException('Duplicate request and group identifiers');
        }

        foreach ($batch->requests as $index => $item) {
            if (property_exists($item, 'dependsOn')) {
                if (!is_array($item->dependsOn)) {
                    throw new \InvalidArgumentException('Invalid dependencies');
                }
                foreach ($item->dependsOn as $dependency) {
                    if (
                        !is_string($dependency)
                        || (!isset($ids[$dependency]) && !isset($groups[$dependency]))
                        || ($ids[$dependency] ?? $groups[$dependency]) >= $index
                    ) {
                        throw new \InvalidArgumentException('Invalid dependency');
                    }
                    if (isset($ids[$dependency])) {
                        $dependencygroup = $batch->requests[$ids[$dependency]]->atomicityGroup ?? null;
                        if ($dependencygroup !== null && $dependencygroup !== ($item->atomicityGroup ?? null)) {
                            throw new \InvalidArgumentException('A dependency on a group must name the group');
                        }
                    }
                }
            }
        }
        return $batch->requests;
    }

    /**
     * Construct and validate an individual JSON batch request.
     *
     * Resolve URLs against the batch URI, then restrict dispatch to the same origin and API
     * route group. Encoded path separators, dots and percent signs are rejected to prevent
     * routing after decoding from bypassing the path check. This also rejects nested batches.
     * JSON body values remain JSON, text is passed through, and other media types use base64url.
     * JSON values are decoded and re-encoded using PHP's native numeric precision.
     *
     * @param \stdClass $item
     * @param ServerRequestInterface $batch
     * @return ServerRequestInterface
     */
    protected function get_json_child_request(\stdClass $item, ServerRequestInterface $batch): ServerRequestInterface {
        if (
            !isset($item->method, $item->url)
            || !is_string($item->method)
            || !in_array(strtoupper($item->method), ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], true)
            || !is_string($item->url)
            || $item->url === ''
        ) {
            throw new \InvalidArgumentException('Invalid request method or URL');
        }
        foreach (array_keys(get_object_vars($item)) as $property) {
            if (
                !in_array($property, ['id', 'method', 'url', 'headers', 'body', 'dependsOn', 'atomicityGroup', 'if'], true)
                && !str_contains($property, '@')
            ) {
                throw new \InvalidArgumentException('Unknown request property');
            }
        }
        if (preg_match('/^\$[A-Za-z0-9._~-]+(?:[\/?#]|$)/', $item->url)) {
            throw new \BadMethodCallException('Request references are not supported');
        }

        $uri = UriResolver::resolve($batch->getUri(), new Uri($item->url));
        $batchuri = $batch->getUri();
        $path = $uri->getPath();
        $prefix = $this->router->basepath . route_loader_interface::ROUTE_GROUP_API;
        if (
            $uri->getUserInfo() !== ''
            || $uri->getFragment() !== ''
            || strtolower($uri->getScheme()) !== strtolower($batchuri->getScheme())
            || strtolower($uri->getHost()) !== strtolower($batchuri->getHost())
            || $uri->getPort() !== $batchuri->getPort()
            || ($path !== $prefix && !str_starts_with($path, $prefix . '/'))
            || preg_match('/%(?:2e|2f|5c|25)/i', $path)
        ) {
            throw new \InvalidArgumentException('Invalid request destination');
        }

        $headers = [];
        if (property_exists($item, 'headers')) {
            if (!is_object($item->headers)) {
                throw new \InvalidArgumentException('Invalid request headers');
            }
            foreach ($item->headers as $name => $value) {
                $name = strtolower($name);
                if (
                    !is_string($value)
                    || isset($headers[$name])
                    || $name === 'host'
                ) {
                    throw new \InvalidArgumentException('Invalid request header');
                }
                if (
                    in_array($name, ['if-match', 'if-none-match'], true)
                    && preg_match('/^\$[A-Za-z0-9._~-]+$/D', trim($value))
                ) {
                    throw new \BadMethodCallException('Request references are not supported');
                }
                $headers[$name] = $value;
            }
        }

        $body = null;
        if (property_exists($item, 'body') && $item->body !== null) {
            if (in_array(strtoupper($item->method), ['GET', 'DELETE'], true) || !isset($headers['content-type'])) {
                throw new \InvalidArgumentException('Invalid request body');
            }
            $contenttype = self::media_type($headers['content-type']);
            if (self::is_json_media_type($contenttype)) {
                $body = json_encode($item->body, JSON_THROW_ON_ERROR);
            } else if (str_starts_with($contenttype, 'text/')) {
                if (!is_string($item->body)) {
                    throw new \InvalidArgumentException('Invalid text body');
                }
                $body = $item->body;
            } else {
                if (
                    !is_string($item->body)
                    || !preg_match('/\A[A-Za-z0-9_-]*={0,2}\z/D', $item->body)
                    || strlen(rtrim($item->body, '=')) % 4 === 1
                ) {
                    throw new \InvalidArgumentException('Invalid binary body');
                }
                $body = base64_decode(strtr($item->body, '-_', '+/'), true);
                if ($body === false) {
                    throw new \InvalidArgumentException('Invalid binary body');
                }
            }
        }
        $child = new ServerRequest(strtoupper($item->method), $uri, $headers, $body);
        self::validate_child_credentials($child);
        return self::initialise_child_request($child, $item->id);
    }

    /**
     * Convert an individual HTTP response to a JSON batch response object.
     *
     * JSON is decoded into a JSON value, text remains a string, and other bodies are
     * base64url encoded. An unlabelled non-empty body is treated as binary. Headers
     * are emitted in lower case as required by the JSON batch format.
     *
     * @param \stdClass $item
     * @param ResponseInterface $response
     * @return array
     */
    protected static function get_json_response(\stdClass $item, ResponseInterface $response): array {
        $result = ['id' => $item->id, 'status' => $response->getStatusCode()];
        if (isset($item->atomicityGroup)) {
            $result['atomicityGroup'] = $item->atomicityGroup;
        }
        $headers = [];
        foreach ($response->getHeaders() as $name => $values) {
            $headers[strtolower($name)] = implode(', ', $values);
        }
        $body = (string) $response->getBody();
        if ($body !== '') {
            $contenttype = self::media_type($response->getHeaderLine('Content-Type'));
            if (self::is_json_media_type($contenttype)) {
                $result['body'] = json_decode($body, false, 512, JSON_THROW_ON_ERROR);
            } else if (str_starts_with($contenttype, 'text/')) {
                $result['body'] = $body;
            } else {
                if ($contenttype === '') {
                    $headers['content-type'] = 'application/octet-stream';
                }
                $result['body'] = rtrim(strtr(base64_encode($body), '+/', '-_'), '=');
            }
        }
        if ($headers) {
            $result['headers'] = (object) $headers;
        }
        // Check the whole child response can be represented in the enclosing JSON.
        json_encode($result, JSON_THROW_ON_ERROR);
        return $result;
    }

    /**
     * Create an individual batch error response.
     *
     * @param int $status
     * @param string $code
     * @param string $message
     * @return ResponseInterface
     */
    protected static function batch_error(int $status, string $code, string $message): ResponseInterface {
        return new Response($status, ['Content-Type' => 'application/json'], json_encode([
            'error' => ['code' => $code, 'message' => $message],
        ], JSON_THROW_ON_ERROR));
    }

    /**
     * Get the media type without parameters.
     *
     * @param string $contenttype
     * @return string
     */
    protected static function media_type(string $contenttype): string {
        return strtolower(trim(explode(';', $contenttype, 2)[0]));
    }

    /**
     * Whether a media type represents JSON.
     *
     * @param string $contenttype
     * @return bool
     */
    protected static function is_json_media_type(string $contenttype): bool {
        return $contenttype === 'application/json'
            || (str_starts_with($contenttype, 'application/') && str_ends_with($contenttype, '+json'));
    }

    /**
     * Whether the Accept header permits a JSON response.
     *
     * A more specific media range takes precedence over a wildcard, including q=0.
     * Cross-format responses are not implemented.
     *
     * @param string $accept
     * @return bool
     */
    protected static function accepts_json(string $accept): bool {
        if (trim($accept) === '') {
            return true;
        }
        $specificity = -1;
        $quality = 0.0;
        foreach (explode(',', $accept) as $entry) {
            $parts = array_map('trim', explode(';', strtolower($entry)));
            $type = array_shift($parts);
            $rank = match ($type) {
                'application/json' => 2,
                'application/*' => 1,
                '*/*' => 0,
                default => -1,
            };
            if ($rank < 0 || $rank < $specificity) {
                continue;
            }
            $q = 1.0;
            foreach ($parts as $part) {
                if (preg_match('/^q\s*=\s*(0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/D', $part, $matches)) {
                    $q = (float) $matches[1];
                } else if (preg_match('/^q\s*=/', $part)) {
                    $q = 0.0;
                }
            }
            $quality = $rank === $specificity ? max($quality, $q) : $q;
            $specificity = $rank;
        }
        return $quality > 0;
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
                    $requestresponse = self::batch_error(
                        501,
                        'AtomicChangeSetNotSupported',
                        'Atomic change sets are not supported.',
                    );
                } else {
                    $childrequest = self::get_request_from_part($requestpart);
                    self::validate_child_credentials($childrequest);
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
                $requestresponse ??= self::batch_error(
                    400,
                    'InvalidBatchRequest',
                    'Invalid batch request.',
                );
            } else {
                if (Uri::isRelativePathReference($childrequest->getUri())) {
                    $childrequest = $childrequest->withUri(
                        UriResolver::resolve($request->getUri(), $childrequest->getUri()),
                        true,
                    );
                }
                $requestresponse = $this->dispatch_child_request($childrequest, $request);
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
     * Dispatch a child request with the credentials of its batch.
     *
     * Callers must validate the child credentials first. A fresh Moodle page/output/course
     * environment prevents state from the previous child being reused by the next one.
     *
     * @param ServerRequestInterface $child
     * @param ServerRequestInterface $batch
     * @return ResponseInterface
     */
    protected function dispatch_child_request(
        ServerRequestInterface $child,
        ServerRequestInterface $batch,
    ): ResponseInterface {
        if ($batch->hasHeader('Authorization')) {
            $child = $child->withHeader('Authorization', $batch->getHeader('Authorization'));
        }
        $this->reset_environment();
        return $this->router->handle_request($child);
    }

    /**
     * Reject child credentials rather than letting them override the batch identity.
     *
     * @param ServerRequestInterface $child
     */
    protected static function validate_child_credentials(ServerRequestInterface $child): void {
        if (
            $child->hasHeader('Authorization')
            || $child->hasHeader('Proxy-Authorization')
            || $child->hasHeader('Cookie')
        ) {
            throw new \InvalidArgumentException('Invalid authentication header');
        }
    }

    /**
     * Initialise fields shared by both child request formats.
     *
     * Guzzle parses the URI but does not populate the PSR-7 query parameters.
     *
     * @param ServerRequestInterface $child
     * @param string|null $id
     * @return ServerRequestInterface
     */
    protected static function initialise_child_request(ServerRequestInterface $child, ?string $id): ServerRequestInterface {
        parse_str($child->getUri()->getQuery(), $queryparams);
        return $child->withQueryParams($queryparams)->withAttribute('batch_content_id', $id);
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
     * @param bool $default The default when the preference is absent
     * @return bool
     */
    protected static function continue_on_error(string $prefer, bool $default = false): bool {
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
        return $default;
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
        return self::initialise_child_request($request, $contentid);
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
