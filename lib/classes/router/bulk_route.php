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

use core\di;
use core\router;
use core\uuid;
use GuzzleHttp\Psr7\ServerRequest;
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
     * Handle a bulk request.
     *
     * @param \Psr\Http\Message\ServerRequestInterface $request
     * @param \Psr\Http\Message\ResponseInterface $response
     * @return \Psr\Http\Message\ResponseInterface
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
     * @param \Psr\Http\Message\ServerRequestInterface $request
     * @param \Psr\Http\Message\ResponseInterface $response
     * @return \Psr\Http\Message\ResponseInterface
     */
    protected function handle_multipart_mixed_request(
        ServerRequestInterface $request,
        ResponseInterface $response,
    ): ResponseInterface {
        $boundary = self::get_boundary_from_contenttype($request->getHeaderLine('Content-Type'));
        if ($boundary === null) {
            return $response->withStatus(400);
        }

        // Get the body and split by boundary.
        // The body is processed per RFC2046 Section 5.1.1.
        // The body may contain both a preamble and an epilogue, which are not part of the request and *must* be ignored.
        $body = (string) $request->getBody();
        $marker = "--{$boundary}";

        // Strip off any preamble.
        $firstboundaryposition = strpos($body, $marker) + strlen($marker);
        $requestbody = trim(substr($body, $firstboundaryposition));

        // And any epilogue.
        $lastboundaryposition = strrpos($requestbody, "{$marker}--");
        $requestbody = trim(substr($requestbody, 0, $lastboundaryposition));

        // Split the request body into parts.
        $requestparts = array_filter(explode("--{$boundary}\n", $requestbody));

        $router = di::get(router::class);

        // Generate the response, which is in the form of a multipart/mixed response.
        $responseboundary = uuid::generate();
        $response = $response->withHeader('Content-Type', "multipart/mixed; boundary={$responseboundary}");

        foreach ($requestparts as $requestpart) {
            // Get the ServerRequest from a multipart request part, and pass it through the Router.
            $request = self::get_request_from_part($requestpart);
            $requestresponse = $router->handle_request($request);

            // Write the response to the body of the combined response.
            // Note: The response is written within an application/http and may have its own headers and status.
            $response->getBody()->write("--{$responseboundary}\n");
            $response->getBody()->write("Content-Type: application/http\n\n");
            $response->getBody()->write(sprintf(
                "HTTP/1.1 %s %s\n",
                $requestresponse->getStatusCode(),
                $requestresponse->getReasonPhrase(),
            ));
            foreach ($requestresponse->getHeaders() as $header => $values) {
                $response->getBody()->write(sprintf("%s: %s\n", $header, implode(', ', $values)));
            }
            $response->getBody()->write("\n");

            $data = (string) $requestresponse->getBody();
            $response->getBody()->write($data);
            $response->getBody()->write("\n\n");
        }

        $response->getBody()->write("--{$responseboundary}--");
        return $response;
    }

    /**
     * Get the boundary from a Content-Type header.
     *
     * @param string $contenttype
     * @return null|string
     */
    public static function get_boundary_from_contenttype(string $contenttype): ?string {
        // The Boundary is required and must be in the form `Content-Type=multipart/mixed;boundary=[boundary]`.
        preg_match('@multipart/mixed; *boundary=(?<boundary>.*)$@', $contenttype, $matches);

        if (!isset($matches['boundary'])) {
            return null;
        }

        return $matches['boundary'];
    }

    /**
     * Get a request from a part of a multipart/mixed request.
     *
     * @param string $requestpart
     * @return \Psr\Http\Message\ServerRequestInterface
     */
    public static function get_request_from_part(string $requestpart): ServerRequestInterface {
        // Each part is split into:
        // - Headers to describe the request
        // - Two new-lines.
        // - The request headeer.
        // - Two new-lines.
        // - The request body.
        $parts = explode("\n\n", $requestpart);

        // The multipart header should contain:
        // A Content-Type with value 'application/header'.
        // An optional Content-ID.
        if (count($parts) === 2) {
            [
                $partheader,
                $requestheader,
            ] = $parts;
            $body = null;
        } else if (count($parts) > 2) {
            [
                $partheader,
                $requestheader,
                $body,
            ] = $parts;
        } else {
            throw new \InvalidArgumentException("Invalid request");
        }

        $requestheaders = explode("\n", $requestheader);
        [$method, $uri, $protocol] = self::get_method_and_uri(array_shift($requestheaders));

        $parsedheaders = [];
        foreach ($requestheaders as $header) {
            [$name, $value] = explode(':', $header, 2);
            $parsedheaders[$name] = $value;
        }

        // The first line of the request header is the Request type and URI.
        return new ServerRequest(
            $method,
            $uri,
            $parsedheaders,
            $body,
            $protocol,
        );
    }

    /**
     * Get the method and URI from a request header.
     *
     * @param string $methodandpath
     * @return string[]
     */
    protected static function get_method_and_uri(string $methodandpath): array {
        $methodandpath = array_map('trim', explode(' ', $methodandpath));
        $method = array_shift($methodandpath);
        $uri = array_shift($methodandpath);
        if (count($methodandpath)) {
            $protocol = array_shift($methodandpath);
        } else {
            $protocol = 'HTTP/1.1';
        }

        $protocol = str_replace('HTTP/', '', $protocol);

        return [$method, $uri, $protocol];
    }
}
