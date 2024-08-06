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
use core\tests\route_testcase;
use GuzzleHttp\Psr7\Response;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\StreamInterface;

/**
 * Tests for the Bulk Request processor.
 *
 * @package    core
 * @category   test
 * @copyright  2024 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers \core\router\bulk_route
 */
final class bulk_route_test extends route_testcase {
    /**
     * Ensure that non-POST requests are rejected.
     *
     * @dataProvider invalid_bulk_http_methods_provider
     * @param string $method
     */
    public function test_non_post_requests(
        string $method,
    ): void {
        self::mock_route_logger();
        self::mock_route_loader();

        $this->get_app();

        $response = $this->process_request(
            $method,
            path: '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
        );

        $this->assert_valid_response(
            $response,
            405, // Method Not Allowed.
        );
    }

    /**
     * Data provider containing request methods not supported by the bulk handler.
     *
     * @return array
     */
    public static function invalid_bulk_http_methods_provider(): array {
        return [
            ['GET'],
            ['PUT'],
            ['PATCH'],
            ['DELETE'],
            ['HEAD'],
        ];
    }

    /**
     * Ensure that requests with a non-multipart/mixed content type are rejected.
     *
     * @dataProvider invalid_bulk_http_content_types_provider
     */
    public function test_json_content_type($contenttype): void {
        self::mock_route_logger();
        self::mock_route_loader();

        $this->get_app();

        $response = $this->process_request(
            'POST',
            path: '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
            headers: [
                'Content-Type' => $contenttype,
            ],
        );

        $this->assert_valid_response(
            $response,
            415, // Method Not Allowed.
        );
    }

    /**
     * Ensure that prologue and epilogue have no impact in a batch response.
     */
    public function test_prologue_epilogue_ignored(): void {
        // We need some valid requests to test the prologue.
        $this->add_class_routes_to_route_loader(\core\route\api\templates::class);
        $app = $this->get_app();

        $request = $this->create_request(
            'POST',
            '',
            headers: [
                'Content-Type' => 'multipart/mixed; boundary=boundary',
            ],
            prefix: route_loader_interface::ROUTE_BATCH_API,
        );

        // Add a prologue.
        $request->getBody()->write("Some example junk content in the prologue.\n");

        $this->add_request_to_bulk_body(
            $this->create_request(
                'GET',
                '/templates/boost/core/modal',
                prefix: route_loader_interface::ROUTE_GROUP_API,
            ),
            'boundary',
            $request->getBody(),
            1,
        );

        $this->add_request_to_bulk_body(
            $this->create_request(
                'GET',
                '/templates/boost/core/loginform',
                prefix: route_loader_interface::ROUTE_GROUP_API,
            ),
            'boundary',
            $request->getBody(),
            2,
        );

        $this->add_request_to_bulk_body(
            $this->create_request(
                'GET',
                '/templates/boost/core/notfound',
                prefix: route_loader_interface::ROUTE_GROUP_API,
            ),
            'boundary',
            $request->getBody(),
            3,
        );

        $request->getBody()->write("--boundary--\n\n");

        // Add an epilogue.
        $request->getBody()->write("Some example junk content in the epilogue.\n");

        // Handle the request.
        $response = $app->handle($request);

        $this->assert_valid_response($response);

        // Find the boundary from the Response content-type.
        $boundary = bulk_route::get_boundary_from_contenttype($response->getHeaderLine('Content-Type'));
        $response->getBody()->rewind();

        $body = $response->getBody()->getContents();

        // The response should start and end with the boundary.
        $this->assertStringStartsWith("--{$boundary}\n", $body);
        $this->assertStringEndsWith("--{$boundary}--", $body);

        // Strip them off.
        $body = trim(substr($body, strlen("--{$boundary}\n"), -strlen("--{$boundary}--")));

        $parts = explode("--{$boundary}\n", $body);

        // There should only be three parts.
        $this->assertCount(3, $parts);

        // Both of them should return a 200 response.
        $responsea = self::get_response_from_part($parts[0]);
        $this->assertEquals(200, $responsea->getStatusCode());
        $this->assertJson($responsea->getBody());

        $responseb = self::get_response_from_part($parts[1]);
        $this->assertEquals(200, $responseb->getStatusCode());
        $this->assertJson($responsea->getBody());

        $responsec = self::get_response_from_part($parts[2]);
        $this->assertEquals(404, $responsec->getStatusCode());
    }

    /**
     * Ensure that a missing boundary leads to a 400 response per the spec.
     */
    public function test_boundary_missing(): void {
        // We need some valid requests to test the prologue.
        $this->add_class_routes_to_route_loader(\core\route\api\templates::class);
        $app = $this->get_app();

        // Generate a bulk request with a single request.
        $request = $this->create_request(
            'POST',
            '',
            headers: [
                'Content-Type' => 'multipart/mixed;',
            ],
            prefix: route_loader_interface::ROUTE_BATCH_API,
        );

        $this->add_request_to_bulk_body(
            $this->create_request(
                'GET',
                '/templates/boost/core/modal',
                prefix: route_loader_interface::ROUTE_GROUP_API,
            ),
            'boundary',
            $request->getBody(),
            1,
        );
        $request->getBody()->write("--boundary--\n\n");

        // Handle the request.
        $response = $app->handle($request);

        $this->assert_valid_response($response, 400);
    }

    /**
     * Ensure that a boundary can be extracted from a content type.
     *
     * @dataProvider boundary_from_contenttype_provider
     * @param string $contenttype
     * @param string $boundary
     */
    public function test_get_boundary_from_contenttype(
        string $contenttype,
        ?string $boundary,
    ): void {
        $this->assertEquals($boundary, bulk_route::get_boundary_from_contenttype($contenttype));
    }

    /**
     * Data provider for testing boundary extraction.
     *
     * @return array
     */
    public static function boundary_from_contenttype_provider(): array {
        return [
            'Single string' => [
                'multipart/mixed; boundary=boundary',
                'boundary',
            ],
            'GUID-4 style' => [
                'multipart/mixed; boundary=6f6e21d4-6323-47f0-a4f0-ca0e46ea05be',
                '6f6e21d4-6323-47f0-a4f0-ca0e46ea05be',
            ],
            'Missing boundary' => [
                'multipart/mixed; boundary=',
                null,
            ],
            'Wrong mimetype' => [
                'multipart/other; boundary=6f6e21d4-6323-47f0-a4f0-ca0e46ea05be',
                null,
            ],
        ];
    }

    /**
     * Data provider containing content types not supported by the bulk handler.
     *
     * @return array
     */
    public static function invalid_bulk_http_content_types_provider(): array {
        return [
            ['application/json'],
            ['application/http'],
            ['application/x-www-form-urlencoded'],
        ];
    }

    /**
     * Mock the route loader for the bulk route.
     *
     * Note: This could be in the route_testcase, but all other API routes
     * should use the existing mock loaders and not this one.
     */
    protected static function mock_route_loader(): void {
        $routeloader = di::get(\core\tests\router\mocking_route_loader::class);
        di::set(route_loader_interface::class, $routeloader);
    }

    /**
     * Add a ServerRequestInterface to the body of a bulk request.
     *
     * @param ServerRequestInterface $request The request to add.
     * @param string $boundary The boundary of the request.
     * @param StreamInterface $body The body of the bulk request
     * @param int $contentid The content id of the request.
     */
    protected function add_request_to_bulk_body(
        ServerRequestInterface $request,
        string $boundary,
        StreamInterface $body,
        int $contentid,
    ): void {
        $body->write("--{$boundary}\n");
        $body->write("Content-Type: application/http\n");
        $body->write("\n");
        $body->write($request->getMethod() . " " . $request->getUri() . "\n");
        foreach ($request->getHeaders() as $name => $values) {
            $body->write("{$name}: " . implode(", ", $values) . "\n");
        }
        $body->write("Content-ID: {$contentid}\n");

        $body->write((string) $request->getBody());
        $body->write("\n\n");
    }

    /**
     * Get a Response from a part of a multipart/mixed request.
     *
     * @param string $responsepart
     * @return Response
     */
    public static function get_response_from_part(string $responsepart): Response {
        // Each part is split into:
        // - Headers to describe the request
        // - Two new-lines.
        // - The request headeer.
        // - Two new-lines.
        // - The request body.
        $parts = explode("\n\n", $responsepart);

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
        [$protocolversion, $code, $reason] = self::get_protocol_and_response_code(array_shift($requestheaders));

        $parsedheaders = [];
        foreach ($requestheaders as $header) {
            [$name, $value] = explode(':', $header, 2);
            $parsedheaders[$name] = $value;
        }

        return new Response(
            $code,
            $parsedheaders,
            $body,
            $protocolversion,
            $reason,
        );
    }

    /**
     * Get the protocol version and response code from a response header.
     *
     * @param string $methodandpath
     * @return string[]
     */
    protected static function get_protocol_and_response_code(string $protocolandresponse): array {
        $protocolandresponse = array_map('trim', explode(' ', $protocolandresponse));
        $protocolversion = array_shift($protocolandresponse);
        $code = array_shift($protocolandresponse);
        if (count($protocolandresponse)) {
            $reason = array_shift($protocolandresponse);
        } else {
            $reason = null;
        }

        $protocolversion = str_replace('HTTP/', '', $protocolversion);

        return [$protocolversion, $code, $reason];
    }
}
