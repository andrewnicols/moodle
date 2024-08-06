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
 * @package    core
 * @copyright  2024 Andrew Lyons <andrew@nicols.co.uk>
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
        // xdebug_break();
        // Bulk requests must be a POST, and must have a MIME type of multipart/mixed.
        if ($request->getMethod() !== 'POST') {
            return $response->withStatus(405);
        }

        [$contenttype, $boundary] = explode(';', $request->getHeaderLine('Content-Type'));
        if (strtolower(trim($contenttype)) !== 'multipart/mixed') {
            return $response->withStatus(415);
        }

        // The Boundary is required and must be in the form `boundary=[boundary]`.
        $boundary = trim($boundary);
        if (strpos($boundary, 'boundary=') !== 0) {
            return $response->withStatus(400);
        }
        $boundary = substr($boundary, 9);

        // Get the body and split by boundary.
        $body = $request->getBody()->getContents();
        $requestparts = array_filter(explode("--{$boundary}\n", $body));

        $router = di::get(router::class);

        $responseboundary = uuid::generate();
        $response = $response->withHeader('Content-Type', "multipart/mixed; boundary={$responseboundary}");

        foreach ($requestparts as $requestpart) {
            $request = $this->get_request_from_part($requestpart);
            $requestresponse = $router->handle_request($request);
            $response->getBody()->write("--{$responseboundary}\n");
            $response->getBody()->write("Content-Type: application/html\n\n");
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

        $response->getBody()->write("--{$responseboundary}");
        return $response;
    }

    protected function get_request_from_part(string $requestpart): ServerRequestInterface {
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
        }

        $requestheaders = explode("\n", $requestheader);
        [$method, $uri, $protocol] = $this->get_method_and_uri(array_shift($requestheaders));

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

    protected function get_method_and_uri(string $methodandpath): array {
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
