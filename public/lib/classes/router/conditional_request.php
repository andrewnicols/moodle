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

use core\exception\invalid_parameter_exception;
use core\exception\precondition_failed_exception;
use core\router\schema\response\payload_response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Helpers for conditional requests using ETags.
 *
 * Both the If-Match and If-None-Match headers are optional. A request without them is processed unconditionally.
 *
 * Routes which use these helpers should be marked with {@see \core\router\schema\etag} so that the headers and
 * responses are documented.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class conditional_request {
    /**
     * Generate a strong ETag for a representation.
     *
     * @param array|\stdClass|string $representation The representation which is sent to the client
     * @return string The quoted ETag
     */
    public static function generate_etag(array|\stdClass|string $representation): string {
        $content = is_string($representation) ? $representation : json_encode($representation);
        return '"' . sha1($content) . '"';
    }

    /**
     * Throw if an If-Match header was supplied and does not match the current representation.
     *
     * @param ServerRequestInterface $request
     * @param array|\stdClass|string $current The current representation of the resource
     * @throws precondition_failed_exception
     */
    public static function assert_if_match(ServerRequestInterface $request, array|\stdClass|string $current): void {
        $etags = self::parse_etags($request, 'If-Match');
        if ($etags === [] || $etags === ['*']) {
            return;
        }

        if (!in_array(self::generate_etag($current), $etags, true)) {
            throw new precondition_failed_exception();
        }
    }

    /**
     * Whether the client already has the current representation, according to If-None-Match.
     *
     * @param ServerRequestInterface $request
     * @param array|\stdClass|string $current
     * @param string|null $etag The precomputed current ETag, including quotes
     * @return bool
     */
    public static function is_not_modified(
        ServerRequestInterface $request,
        array|\stdClass|string $current,
        ?string $etag = null,
    ): bool {
        $etags = self::parse_etags($request, 'If-None-Match');
        if ($etags === ['*']) {
            return true;
        }

        $etag ??= self::generate_etag($current);
        foreach ($etags as $candidate) {
            // If-None-Match uses weak comparison, unlike If-Match.
            if (str_starts_with($candidate, 'W/')) {
                $candidate = substr($candidate, 2);
            }
            if ($candidate === $etag) {
                return true;
            }
        }

        return false;
    }

    /**
     * Create the response for a resource, honouring If-None-Match.
     *
     * Returns an empty 304 response if the client already has the representation, and the representation with its
     * ETag otherwise.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param array|\stdClass $representation
     * @return payload_response
     */
    public static function respond(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array|\stdClass $representation,
    ): payload_response {
        $etag = self::generate_etag($representation);
        $response = $response->withHeader('ETag', $etag);

        if (self::is_not_modified($request, $representation, $etag)) {
            return new payload_response([], $request, $response->withStatus(304));
        }

        return new payload_response($representation, $request, $response);
    }

    /**
     * Parse a conditional header containing a wildcard or a list of entity-tags.
     *
     * @param ServerRequestInterface $request
     * @param string $name The header name
     * @return string[] Empty if the header is absent
     * @throws invalid_parameter_exception If the header is malformed
     */
    private static function parse_etags(ServerRequestInterface $request, string $name): array {
        if (!$request->hasHeader($name)) {
            return [];
        }

        $header = trim($request->getHeaderLine($name), " \t");
        if ($header === '*') {
            return ['*'];
        }

        // RFC 9110 entity-tag grammar: commas may occur inside opaque tags. Ignore empty list members.
        $tag = '(?:W/)?"[\x21\x23-\x7E\x80-\xFF]*"';
        if (!preg_match('~\A[ \t,]*' . $tag . '(?:[ \t]*,[ \t,]*' . $tag . ')*[ \t,]*\z~', $header)) {
            throw new invalid_parameter_exception(
                "{$name} must contain double-quoted entity-tags (optionally prefixed with W/), or * alone.",
            );
        }

        preg_match_all('~' . $tag . '~', $header, $matches);
        return $matches[0];
    }
}
