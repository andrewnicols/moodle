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
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
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
        $ifmatch = trim($request->getHeaderLine('If-Match'));
        if ($ifmatch === '' || $ifmatch === '*') {
            return;
        }

        if (!in_array(self::generate_etag($current), self::split($ifmatch), true)) {
            throw new precondition_failed_exception();
        }
    }

    /**
     * Whether the client already has the current representation, according to If-None-Match.
     *
     * @param ServerRequestInterface $request
     * @param array|\stdClass|string $current
     * @return bool
     */
    public static function is_not_modified(ServerRequestInterface $request, array|\stdClass|string $current): bool {
        $header = trim($request->getHeaderLine('If-None-Match'));
        if ($header === '') {
            return false;
        }

        return $header === '*' || in_array(self::generate_etag($current), self::split($header), true);
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
        $response = $response->withHeader('ETag', self::generate_etag($representation));

        if (self::is_not_modified($request, $representation)) {
            return new payload_response([], $request, $response->withStatus(304));
        }

        return new payload_response($representation, $request, $response);
    }

    /**
     * Split a header containing a list of ETags.
     *
     * @param string $header
     * @return string[]
     */
    private static function split(string $header): array {
        return array_map('trim', explode(',', $header));
    }
}
