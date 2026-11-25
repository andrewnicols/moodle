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

use core\api\repository\api_token_repository;
use core\api\token_manager;
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
 */
#[\PHPUnit\Framework\Attributes\CoversClass(\core\router\bulk_route::class)]
final class bulk_route_test extends route_testcase {
    /**
     * Ensure that non-POST requests are rejected.
     *
     * @param string $method
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('invalid_bulk_http_methods_provider')]
    public function test_non_post_requests(
        string $method,
    ): void {
        self::mock_route_loader();

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
     * @return \Generator
     */
    public static function invalid_bulk_http_methods_provider(): \Generator {
        yield 'GET' => ['GET'];
        yield 'PUT' => ['PUT'];
        yield 'PATCH' => ['PATCH'];
        yield 'DELETE' => ['DELETE'];
        yield 'HEAD' => ['HEAD'];
    }

    /**
     * Ensure that requests with a non-multipart/mixed content type are rejected.
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('invalid_bulk_http_content_types_provider')]
    public function test_invalid_content_type($contenttype): void {
        self::mock_route_loader();

        $response = $this->process_request(
            'POST',
            path: '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
            headers: [
                'Content-Type' => $contenttype,
            ],
            contenttype: null,
        );

        $this->assert_valid_response(
            $response,
            415, // Unsupported Media Type.
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
        $request->getBody()->write("Some example junk content in the prologue.\r\n");

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

        $request->getBody()->write("--boundary--\r\n\r\n");

        // Add an epilogue.
        $request->getBody()->write("Some example junk content in the epilogue.\r\n");

        // Handle the request.
        $response = $app->handle($request);

        $this->assert_valid_response($response);

        // Find the boundary from the Response content-type.
        $boundary = bulk_route::get_boundary_from_contenttype($response->getHeaderLine('Content-Type'));
        $response->getBody()->rewind();

        $body = $response->getBody()->getContents();

        // The response should start and end with the boundary.
        $this->assertStringStartsWith("--{$boundary}\r\n", $body);
        $this->assertStringEndsWith("--{$boundary}--", $body);

        // Strip them off.
        $body = trim(substr($body, strlen("--{$boundary}\r\n"), -strlen("--{$boundary}--")));

        $parts = explode("--{$boundary}\r\n", $body);

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
        $request->getBody()->write("--boundary--\r\n\r\n");

        // Handle the request.
        $response = $app->handle($request);

        $this->assert_valid_response($response, 400);
    }

    /**
     * Ensure child requests cannot contain authentication headers.
     *
     * @param array $firstheaders
     * @param array $secondheaders
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('child_authentication_headers_provider')]
    public function test_child_authentication_headers_are_rejected(
        array $firstheaders,
        array $secondheaders,
    ): void {
        self::mock_route_loader();
        $app = $this->get_app();

        $request = $this->create_request(
            'POST',
            '',
            headers: [
                'Content-Type' => 'multipart/mixed; boundary=boundary',
            ],
            prefix: route_loader_interface::ROUTE_BATCH_API,
        );

        foreach ([$firstheaders, $secondheaders] as $index => $headers) {
            $this->add_request_to_bulk_body(
                $this->create_request(
                    'GET',
                    '/templates/boost/core/modal',
                    headers: $headers,
                    prefix: route_loader_interface::ROUTE_GROUP_API,
                ),
                'boundary',
                $request->getBody(),
                $index + 1,
            );
        }
        $request->getBody()->write("--boundary--\r\n\r\n");

        $response = $app->handle($request);

        $this->assert_valid_response($response);
        $this->assertStringContainsString('HTTP/1.1 400', (string) $response->getBody());
    }

    /**
     * Data provider for child authentication header cases.
     *
     * @return \Generator
     */
    public static function child_authentication_headers_provider(): \Generator {
        yield 'authenticated and cookie-authenticated' => [
            ['Authorization' => 'Bearer token-one'],
            [],
        ];
        yield 'different bearer credentials' => [
            ['Authorization' => 'Bearer token-one'],
            ['Authorization' => 'Bearer token-two'],
        ];
        yield 'same bearer credentials' => [
            ['Authorization' => 'Bearer token-one'],
            ['Authorization' => 'Bearer token-one'],
        ];
        yield 'cookie header' => [
            ['Cookie' => 'MoodleSession=example'],
            [],
        ];
    }

    /**
     * An invalid child cannot override batch credentials, even when processing continues.
     */
    public function test_rejected_child_credentials_do_not_affect_later_requests(): void {
        $authorizations = [];
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['GET']),
            callable: function ($request, $response) use (&$authorizations) {
                $authorizations[] = $request->getHeaderLine('Authorization');
                return $response;
            },
        );
        $batch = $this->create_request(
            'POST',
            '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
            headers: [
                'Content-Type' => 'multipart/mixed; boundary=boundary',
                'Authorization' => 'Bearer outer',
                'Prefer' => 'continue-on-error',
            ],
        );
        $this->add_request_to_bulk_body(
            $this->create_request('GET', '/capture', headers: ['Authorization' => 'Bearer other']),
            'boundary',
            $batch->getBody(),
            1,
        );
        $this->add_request_to_bulk_body($this->create_request('GET', '/capture'), 'boundary', $batch->getBody(), 2);
        $batch->getBody()->write("--boundary--\r\n");

        $response = $this->get_app()->handle($batch);
        $this->assert_valid_response($response);
        $this->assertStringContainsString("Content-ID: 1\r\n\r\nHTTP/1.1 400", (string) $response->getBody());
        $this->assertStringContainsString("Content-ID: 2\r\n\r\nHTTP/1.1 200", (string) $response->getBody());
        $this->assertSame(['Bearer outer'], $authorizations);
    }

    /**
     * Child requests retain their query parameters and body, and IDs are MIME headers.
     */
    public function test_child_request_data_and_content_id(): void {
        $captured = null;
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['POST']),
            callable: function ($request, $response) use (&$captured) {
                $captured = $request;
                return $response;
            },
        );
        $app = $this->get_app();
        $batch = $this->create_request(
            'POST',
            '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
            headers: ['Content-Type' => 'multipart/mixed; boundary=boundary'],
        );
        $child = $this->create_request(
            'POST',
            '/capture?name=hello%20world&items%5B%5D=one&items%5B%5D=two',
            headers: ['Content-Type' => 'text/plain'],
        );
        $child->getBody()->write("  body\r\n\r\n");
        $this->add_request_to_bulk_body($child, 'boundary', $batch->getBody(), 42);
        $batch->getBody()->write("--boundary--\r\n");

        $response = $app->handle($batch);
        $this->assert_valid_response($response);
        $this->assertSame(['name' => 'hello world', 'items' => ['one', 'two']], $captured->getQueryParams());
        $this->assertSame("  body\r\n\r\n", (string) $captured->getBody());
        $this->assertStringContainsString(
            "Content-Type: application/http\r\nContent-ID: 42\r\n\r\nHTTP/1.1 200",
            (string) $response->getBody(),
        );
    }

    /**
     * Multipart batches stop on errors unless explicitly requested to continue.
     *
     * @param string $prefer
     * @param bool $continues
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('continue_on_error_provider')]
    public function test_continue_on_error(string $prefer, bool $continues): void {
        $calls = 0;
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['GET']),
            callable: function ($request, $response) use (&$calls) {
                $calls++;
                return $response;
            },
        );
        $app = $this->get_app();
        $batch = $this->create_request(
            'POST',
            '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
            headers: ['Content-Type' => 'multipart/mixed; boundary=boundary', 'Prefer' => $prefer],
        );
        foreach (['/missing', '/capture'] as $index => $path) {
            $this->add_request_to_bulk_body($this->create_request('GET', $path), 'boundary', $batch->getBody(), $index + 1);
        }
        $batch->getBody()->write("--boundary--\r\n");

        $response = $app->handle($batch);
        $this->assert_valid_response($response);
        $this->assertSame($continues ? 1 : 0, $calls);
        $this->assertSame($continues, str_contains((string) $response->getBody(), 'Content-ID: 2'));
    }

    /**
     * @return \Generator
     */
    public static function continue_on_error_provider(): \Generator {
        yield 'default' => ['', false];
        yield '4.01 implicit true' => ['continue-on-error', true];
        yield '4.0 implicit true' => ['odata.continue-on-error', true];
        yield 'explicit true' => ['respond-async, continue-on-error=true', true];
        yield 'explicit false' => ['odata.continue-on-error=false', false];
    }

    /**
     * A malformed request without a Content-ID is reported within the batch.
     */
    public function test_malformed_child_without_id_is_reported(): void {
        $calls = 0;
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['GET']),
            callable: function ($request, $response) use (&$calls) {
                $calls++;
                return $response;
            },
        );
        $app = $this->get_app();
        $batch = $this->create_request(
            'POST',
            '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
            headers: ['Content-Type' => 'multipart/mixed; boundary=boundary'],
        );
        $this->add_request_to_bulk_body($this->create_request('GET', '/capture'), 'boundary', $batch->getBody(), 1);
        $batch->getBody()->write("--boundary\r\nContent-Type: application/http\r\n\r\ninvalid\r\n\r\n\r\n");
        $batch->getBody()->write("--boundary--\r\n");

        $response = $app->handle($batch);
        $this->assert_valid_response($response);
        $this->assertSame(1, $calls);
        $this->assertStringContainsString("Content-Type: application/http\r\n\r\nHTTP/1.1 400", (string) $response->getBody());
    }

    /**
     * A malformed individual request is reported inside an accepted batch.
     *
     * @param string $prefer
     * @param int $expectedcalls
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('malformed_child_preference_provider')]
    public function test_malformed_child_is_a_batch_response(string $prefer, int $expectedcalls): void {
        $calls = 0;
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['GET']),
            callable: function ($request, $response) use (&$calls) {
                $calls++;
                return $response;
            },
        );
        $app = $this->get_app();
        $batch = $this->create_request(
            'POST',
            '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
            headers: ['Content-Type' => 'multipart/mixed; boundary=boundary', 'Prefer' => $prefer],
        );
        $this->add_request_to_bulk_body($this->create_request('GET', '/capture'), 'boundary', $batch->getBody(), 1);
        $batch->getBody()->write(
            "--boundary\r\nContent-Type: application/http\r\nContent-ID: 2\r\n\r\ninvalid\r\n\r\n\r\n",
        );
        $this->add_request_to_bulk_body($this->create_request('GET', '/capture'), 'boundary', $batch->getBody(), 3);
        $batch->getBody()->write("--boundary--\r\n");

        $response = $app->handle($batch);
        $this->assert_valid_response($response, 200);
        $this->assertSame($expectedcalls, $calls);
        $this->assertStringContainsString("Content-ID: 2\r\n\r\nHTTP/1.1 400", (string) $response->getBody());
        $this->assertSame($expectedcalls === 2, str_contains((string) $response->getBody(), 'Content-ID: 3'));
        $this->assertStringContainsString('"code":"InvalidBatchRequest"', (string) $response->getBody());
    }

    /**
     * @return \Generator
     */
    public static function malformed_child_preference_provider(): \Generator {
        yield 'stop on error' => ['', 1];
        yield 'continue on error' => ['continue-on-error', 2];
    }

    /**
     * A missing closing delimiter is reported inside the batch.
     */
    public function test_missing_closing_boundary(): void {
        self::mock_route_loader();
        $batch = $this->create_request(
            'POST',
            '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
            headers: ['Content-Type' => 'multipart/mixed; boundary=boundary'],
        );
        $this->add_request_to_bulk_body($this->create_request('GET', '/capture'), 'boundary', $batch->getBody(), 1);
        $response = $this->get_app()->handle($batch);
        $this->assert_valid_response($response);
        $this->assertStringContainsString('HTTP/1.1 400', (string) $response->getBody());
    }

    /**
     * Duplicate request identifiers cannot be used to correlate responses.
     */
    public function test_duplicate_content_ids_are_rejected(): void {
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['GET']),
        );
        $batch = $this->create_request(
            'POST',
            '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
            headers: ['Content-Type' => 'multipart/mixed; boundary=boundary'],
        );
        for ($i = 0; $i < 2; $i++) {
            $this->add_request_to_bulk_body($this->create_request('GET', '/capture'), 'boundary', $batch->getBody(), 1);
        }
        $batch->getBody()->write("--boundary--\r\n");
        $response = $this->get_app()->handle($batch);
        $this->assert_valid_response($response);
        $this->assertStringContainsString('HTTP/1.1 200', (string) $response->getBody());
        $this->assertStringContainsString('HTTP/1.1 400', (string) $response->getBody());
    }

    /**
     * Outer API credentials are authenticated independently for each routed request.
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('outer_api_token_scopes_provider')]
    public function test_outer_api_token_authentication(array $scopes, int $status): void {
        global $USER;

        $this->resetAfterTest();
        $user = $this->getDataGenerator()->create_user();
        $token = di::get(api_token_repository::class)->create_token(
            'Batch test',
            'correctsecret',
            $user->id,
            $scopes,
        );
        $bearer = rtrim(token_manager::TOKEN_PREFIX . base64_encode("{$token->get_id()}/correctsecret"), '=');
        $this->add_class_routes_to_route_loader(\core_user\route\api\preferences::class);
        $app = $this->get_app();
        $batch = $this->create_request(
            'POST',
            '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
            headers: [
                'Content-Type' => 'multipart/mixed; boundary=boundary',
                'Authorization' => "Bearer {$bearer}",
                'Prefer' => 'continue-on-error',
            ],
        );
        for ($i = 1; $i <= 2; $i++) {
            $this->add_request_to_bulk_body(
                $this->create_request('GET', "/{$user->id}/preferences"),
                'boundary',
                $batch->getBody(),
                $i,
            );
        }
        $batch->getBody()->write("--boundary--\r\n");

        $response = $app->handle($batch);
        $this->assert_valid_response($response);
        $this->assertSame(2, substr_count((string) $response->getBody(), "HTTP/1.1 {$status}"));
        if ($status === 200) {
            $this->assertEquals($user->id, $USER->id);
        }
    }

    /**
     * @return \Generator
     */
    public static function outer_api_token_scopes_provider(): \Generator {
        yield 'allowed scope' => [['core_user:user:read:self'], 200];
        yield 'missing scope' => [[], 403];
    }

    /**
     * Cookie-authenticated child requests use the current session.
     */
    public function test_cookie_session_authentication(): void {
        $this->resetAfterTest();
        $user = $this->getDataGenerator()->create_user();
        $this->setUser($user);
        $this->add_class_routes_to_route_loader(\core_user\route\api\preferences::class);
        $app = $this->get_app();
        $batch = $this->create_request(
            'POST',
            '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
            headers: ['Content-Type' => 'multipart/mixed; boundary=boundary'],
        );
        $this->add_request_to_bulk_body(
            $this->create_request('GET', "/{$user->id}/preferences"),
            'boundary',
            $batch->getBody(),
            1,
        );
        $batch->getBody()->write("--boundary--\r\n");
        $response = $app->handle($batch);
        $this->assert_valid_response($response);
        $this->assertStringContainsString('HTTP/1.1 200', (string) $response->getBody());
    }

    /**
     * Ensure that a boundary can be extracted from a content type.
     *
     * @param string $contenttype
     * @param string $boundary
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('boundary_from_contenttype_provider')]
    public function test_get_boundary_from_contenttype(
        string $contenttype,
        ?string $boundary,
    ): void {
        $this->assertEquals($boundary, bulk_route::get_boundary_from_contenttype($contenttype));
    }

    /**
     * Data provider for testing boundary extraction.
     *
     * @return \Generator
     */
    public static function boundary_from_contenttype_provider(): \Generator {
        yield 'Single string' => [
            'multipart/mixed; boundary=boundary',
            'boundary',
        ];
        yield 'GUID-4 style' => [
            'multipart/mixed; boundary=6f6e21d4-6323-47f0-a4f0-ca0e46ea05be',
            '6f6e21d4-6323-47f0-a4f0-ca0e46ea05be',
        ];
        yield 'Missing boundary' => [
            'multipart/mixed; boundary=',
            null,
        ];
        yield 'Wrong mimetype' => [
            'multipart/other; boundary=6f6e21d4-6323-47f0-a4f0-ca0e46ea05be',
            null,
        ];
        yield 'Quoted boundary and additional parameter' => [
            'Multipart/Mixed; charset=utf-8; boundary="boundary"; other=value',
            'boundary',
        ];
    }

    /**
     * Data provider containing content types not supported by the bulk handler.
     *
     * @return \Generator
     */
    public static function invalid_bulk_http_content_types_provider(): \Generator {
        yield 'application/json' => ['application/json'];
        yield 'application/http' => ['application/http'];
        yield 'application/x-www-form-urlencoded' => ['application/x-www-form-urlencoded'];
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
        $body->write("--{$boundary}\r\n");
        $body->write("Content-Type: application/http\r\n");
        $body->write("Content-ID: {$contentid}\r\n");
        $body->write("\r\n");
        $body->write($request->getMethod() . " " . $request->getUri() . " HTTP/1.1\r\n");
        foreach ($request->getHeaders() as $name => $values) {
            $body->write("{$name}: " . implode(", ", $values) . "\r\n");
        }
        $body->write("\r\n");
        $body->write((string) $request->getBody());
        $body->write("\r\n");
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
        $parts = explode("\r\n\r\n", $responsepart);

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

        $requestheaders = explode("\r\n", $requestheader);
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
