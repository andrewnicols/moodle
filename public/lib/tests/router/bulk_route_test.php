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
use GuzzleHttp\Psr7\ServerRequest;
use GuzzleHttp\Psr7\Uri;
use Psr\Http\Message\ResponseInterface;
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
     * Ensure that requests with an unsupported content type are rejected.
     *
     * @param string $contenttype
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('invalid_bulk_http_content_types_provider')]
    public function test_invalid_content_type(string $contenttype): void {
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
        $child = new ServerRequest(
            'POST',
            'rest/v2/capture?name=hello%20world&items%5B%5D=one&items%5B%5D=two',
            ['Content-Type' => 'text/plain'],
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
     * Child URLs are resolved against the batch URL without changing absolute request targets.
     *
     * @param string $basepath
     * @param string $target
     * @param string $expecteduri
     * @param string $host
     * @param string $expectedhost
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('child_request_url_provider')]
    public function test_child_request_url(
        string $basepath,
        string $target,
        string $expecteduri,
        string $host,
        string $expectedhost,
    ): void {
        global $CFG;

        $this->resetAfterTest();
        $wwwrootpath = str_ends_with($basepath, '/r.php') ? substr($basepath, 0, -6) : $basepath;
        $CFG->wwwroot = 'https://example.test:8443' . $wwwrootpath;
        $this->set_basepath($basepath);
        $captured = null;
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['GET']),
            callable: function ($request, $response) use (&$captured) {
                $captured = $request;
                return $response;
            },
        );
        $batch = $this->create_request(
            'POST',
            '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
            headers: ['Content-Type' => 'multipart/mixed; boundary=boundary'],
        );
        $batch = $batch->withUri(new Uri('https://example.test:8443' . $batch->getUri() . '?outer=ignored'));
        $headers = $host === '' ? [] : ['Host' => $host];
        $child = new ServerRequest('GET', $target . '?name=hello%20world&items%5B%5D=one', $headers);
        $this->add_request_to_bulk_body($child, 'boundary', $batch->getBody(), 1);
        $batch->getBody()->write("--boundary--\r\n");

        $response = $this->get_app()->handle($batch);
        $this->assert_valid_response($response);
        $this->assertStringContainsString("Content-ID: 1\r\n\r\nHTTP/1.1 200", (string) $response->getBody());
        $this->assertSame($expecteduri . '?name=hello%20world&items%5B%5D=one', (string) $captured->getUri());
        $this->assertSame(['name' => 'hello world', 'items' => ['one']], $captured->getQueryParams());
        $this->assertSame($expectedhost, $captured->getHeaderLine('Host'));
    }

    /**
     * Request URL forms and expected resolution.
     *
     * @return \Generator
     */
    public static function child_request_url_provider(): \Generator {
        yield 'site root' => ['', 'rest/v2/capture', 'https://example.test:8443/api/rest/v2/capture', '', 'example.test:8443'];
        yield 'subdirectory' => [
            '/moodle', 'rest/v2/capture', 'https://example.test:8443/moodle/api/rest/v2/capture', '', 'example.test:8443',
        ];
        yield 'r.php' => [
            '/moodle/r.php', 'rest/v2/capture', 'https://example.test:8443/moodle/r.php/api/rest/v2/capture',
            '', 'example.test:8443',
        ];
        yield 'dot segments' => [
            '/moodle', '../api/rest/./v2/capture', 'https://example.test:8443/moodle/api/rest/v2/capture',
            'child.example', 'child.example',
        ];
        yield 'absolute path and host' => [
            '/moodle', '/moodle/api/rest/v2/capture', '/moodle/api/rest/v2/capture',
            'child.example:8080', 'child.example:8080',
        ];
        yield 'absolute URI' => [
            '/moodle', 'https://example.test:8443/moodle/api/rest/v2/capture',
            'https://example.test:8443/moodle/api/rest/v2/capture', 'example.test:8443', 'example.test:8443',
        ];
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
     * Data generator for the continue on error tests.
     *
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
     * Unsupported atomic change sets are rejected without executing any of their requests.
     *
     * @param string $prefer
     * @param bool $continues
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('continue_on_error_provider')]
    public function test_atomic_change_set_is_rejected(string $prefer, bool $continues): void {
        $methods = [];
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['GET', 'POST']),
            callable: function ($request, $response) use (&$methods) {
                $methods[] = $request->getMethod();
                return $response;
            },
        );
        $batch = $this->create_request(
            'POST',
            '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
            headers: ['Content-Type' => 'multipart/mixed; boundary=boundary', 'Prefer' => $prefer],
        );
        $this->add_request_to_bulk_body($this->create_request('GET', '/capture'), 'boundary', $batch->getBody(), 1);
        $batch->getBody()->write("--boundary\r\nContent-Type: Multipart/Mixed; boundary=\"changeset\"\r\n\r\n");
        $this->add_request_to_bulk_body($this->create_request('POST', '/capture'), 'changeset', $batch->getBody(), 2);
        $this->add_request_to_bulk_body($this->create_request('POST', '/capture'), 'changeset', $batch->getBody(), 3);
        $batch->getBody()->write("--changeset--\r\n");
        $this->add_request_to_bulk_body($this->create_request('GET', '/capture'), 'boundary', $batch->getBody(), 4);
        $batch->getBody()->write("--boundary--\r\n");

        $response = $this->get_app()->handle($batch);
        $this->assert_valid_response($response);
        $this->assertSame($continues ? ['GET', 'GET'] : ['GET'], $methods);
        $this->assertStringContainsString(
            "Content-Type: application/http\r\n\r\nHTTP/1.1 501 Not Implemented",
            (string) $response->getBody(),
        );
        $this->assertStringContainsString('"code":"AtomicChangeSetNotSupported"', (string) $response->getBody());
        $this->assertSame($continues, str_contains((string) $response->getBody(), 'Content-ID: 4'));
    }

    /**
     * A change set with invalid MIME headers remains an invalid batch request.
     */
    public function test_atomic_change_set_with_missing_boundary(): void {
        self::mock_route_loader();
        $batch = $this->create_request(
            'POST',
            '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
            headers: ['Content-Type' => 'multipart/mixed; boundary=boundary'],
        );
        $batch->getBody()->write("--boundary\r\nContent-Type: multipart/mixed\r\n\r\ninvalid\r\n--boundary--\r\n");

        $response = $this->get_app()->handle($batch);
        $this->assert_valid_response($response);
        $this->assertStringContainsString('HTTP/1.1 400 Bad Request', (string) $response->getBody());
        $this->assertStringContainsString('"code":"InvalidBatchRequest"', (string) $response->getBody());
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
     * Data provider for the malformed child preference tests.
     *
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
     *
     * @param array[] $scopes
     * @param int $status
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
        $children = [
            $this->create_request('GET', "/{$user->id}/preferences"),
            new ServerRequest('GET', "rest/v2/{$user->id}/preferences"),
        ];
        foreach ($children as $index => $child) {
            $this->add_request_to_bulk_body(
                $child,
                'boundary',
                $batch->getBody(),
                $index + 1,
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
     * Generator for the outer API token scopes tests.
     *
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
     * JSON child requests retain their body, query parameters, identifiers, and outer credentials.
     */
    public function test_json_request_and_response(): void {
        $captured = null;
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['POST']),
            callable: function ($request, $response) use (&$captured) {
                $captured = $request;
                $response->getBody()->write('{"result":{"ok":true}}');
                return $response->withHeader('Content-Type', 'application/json; charset=utf-8')
                    ->withHeader('X-Example', 'value');
            },
        );
        $response = $this->send_json_batch([
            [
                'id' => 'first',
                'method' => 'POST',
                'url' => 'rest/v2/capture?name=hello%20world&items%5B%5D=one',
                'headers' => ['Content-Type' => 'application/json; charset=utf-8', 'If-Match' => '"etag"'],
                'body' => ['nested' => (object) [], 'enabled' => true],
            ],
        ], ['Authorization' => 'Bearer outer']);

        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame('application/json', $response->getHeaderLine('Content-Type'));
        $result = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR);
        $this->assertSame('first', $result['responses'][0]['id']);
        $this->assertSame(200, $result['responses'][0]['status']);
        $this->assertSame(['result' => ['ok' => true]], $result['responses'][0]['body']);
        $this->assertSame('application/json; charset=utf-8', $result['responses'][0]['headers']['content-type']);
        $this->assertSame('value', $result['responses'][0]['headers']['x-example']);
        $this->assertSame(['name' => 'hello world', 'items' => ['one']], $captured->getQueryParams());
        $this->assertSame('{"nested":{},"enabled":true}', (string) $captured->getBody());
        $this->assertSame('Bearer outer', $captured->getHeaderLine('Authorization'));
        $this->assertSame('"etag"', $captured->getHeaderLine('If-Match'));
        $this->assertSame('first', $captured->getAttribute('batch_content_id'));
    }

    /**
     * Failed dependencies and unsupported atomic groups are never dispatched.
     */
    public function test_json_dependencies_and_atomic_groups(): void {
        $calls = [];
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/{name}', method: ['GET']),
            callable: function ($request, $response) use (&$calls) {
                $calls[] = basename($request->getUri()->getPath());
                return $response->withStatus(end($calls) === 'fail' ? 400 : 200);
            },
        );
        $response = $this->send_json_batch([
            ['id' => 'failed', 'method' => 'GET', 'url' => 'rest/v2/fail'],
            ['id' => 'dependent', 'method' => 'GET', 'url' => 'rest/v2/not-called', 'dependsOn' => ['failed']],
            ['id' => 'a', 'method' => 'GET', 'url' => 'rest/v2/not-called', 'atomicityGroup' => 'group'],
            ['id' => 'b', 'method' => 'GET', 'url' => 'rest/v2/not-called', 'atomicityGroup' => 'group'],
            ['id' => 'after-group', 'method' => 'GET', 'url' => 'rest/v2/not-called', 'dependsOn' => ['group']],
            ['id' => 'success', 'method' => 'GET', 'url' => 'rest/v2/success'],
            ['id' => 'after-success', 'method' => 'GET', 'url' => 'rest/v2/next', 'dependsOn' => ['success']],
        ]);
        $results = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR)['responses'];
        $this->assertSame([400, 424, 501, 501, 424, 200, 200], array_column($results, 'status'));
        $this->assertSame('group', $results[2]['atomicityGroup']);
        $this->assertSame('group', $results[3]['atomicityGroup']);
        $this->assertSame('AtomicChangeSetNotSupported', $results[2]['body']['error']['code']);
        $this->assertSame(['fail', 'success', 'next'], $calls);
    }

    /**
     * JSON batches continue by default, but clients may request that processing stop on error.
     *
     * @param string $prefer
     * @param array $statuses
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('json_continue_provider')]
    public function test_json_continue_on_error(string $prefer, array $statuses): void {
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/{name}', method: ['GET']),
            callable: fn ($request, $response) => $response->withStatus(
                str_ends_with($request->getUri()->getPath(), '/fail') ? 400 : 200,
            ),
        );
        $response = $this->send_json_batch([
            ['id' => '1', 'method' => 'GET', 'url' => 'rest/v2/fail'],
            ['id' => '2', 'method' => 'GET', 'url' => 'rest/v2/ok'],
        ], ['Prefer' => $prefer]);
        $results = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR)['responses'];
        $this->assertSame($statuses, array_column($results, 'status'));
    }

    /**
     * Continue-on-error preference cases for JSON batches.
     *
     * @return \Generator
     */
    public static function json_continue_provider(): \Generator {
        yield 'default' => ['', [400, 200]];
        yield 'true' => ['continue-on-error=true', [400, 200]];
        yield 'false' => ['continue-on-error=false', [400]];
        yield 'odata false' => ['odata.continue-on-error=false', [400]];
    }

    /**
     * JSON batches preserve text and binary request and response bodies.
     *
     * @param string $contenttype
     * @param string $encoded
     * @param string $plain
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('json_body_provider')]
    public function test_json_body_encodings(string $contenttype, string $encoded, string $plain): void {
        $captured = null;
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['POST']),
            callable: function ($request, $response) use (&$captured, $contenttype) {
                $captured = (string) $request->getBody();
                $response->getBody()->write($captured);
                return $response->withHeader('Content-Type', $contenttype);
            },
        );
        $response = $this->send_json_batch([[
            'id' => 'body',
            'method' => 'POST',
            'url' => 'rest/v2/capture',
            'headers' => ['content-type' => $contenttype],
            'body' => $encoded,
        ]]);
        $result = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR)['responses'][0];
        $this->assertSame(200, $result['status']);
        $this->assertSame($plain, $captured);
        $this->assertSame($encoded, $result['body']);
        $this->assertSame($contenttype, $result['headers']['content-type']);
    }

    /**
     * Text and binary body encodings for JSON batches.
     *
     * @return \Generator
     */
    public static function json_body_provider(): \Generator {
        yield 'text' => ['text/plain; charset=utf-8', "hello\nworld", "hello\nworld"];
        yield 'binary' => ['application/octet-stream', 'AP_-YQ', "\x00\xff\xfea"];
    }

    /**
     * JSON subtypes retain their JSON value and null is equivalent to an absent body.
     */
    public function test_json_subtype_and_null_body(): void {
        $bodies = [];
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['POST']),
            callable: function ($request, $response) use (&$bodies) {
                $bodies[] = (string) $request->getBody();
                if ($bodies[count($bodies) - 1] !== '') {
                    $response->getBody()->write((string) $request->getBody());
                }
                return $response->withHeader('Content-Type', 'application/problem+json; charset=utf-8');
            },
        );
        $response = $this->send_json_batch([
            [
                'id' => 'json',
                'method' => 'POST',
                'url' => 'rest/v2/capture',
                'headers' => ['content-type' => 'application/problem+json; charset=utf-8'],
                'body' => [(object) [], ['count' => 3]],
            ],
            ['id' => 'null', 'method' => 'POST', 'url' => 'rest/v2/capture', 'body' => null],
        ]);
        $results = json_decode((string) $response->getBody(), false, 512, JSON_THROW_ON_ERROR)->responses;
        $this->assertSame(['[{},{"count":3}]', ''], $bodies);
        $this->assertSame(200, $results[0]->status);
        $this->assertEquals([(object) [], (object) ['count' => 3]], $results[0]->body);
        $this->assertSame('application/problem+json; charset=utf-8', $results[0]->headers->{'content-type'});
        $this->assertObjectNotHasProperty('body', $results[1]);
    }

    /**
     * An unlabelled binary response is representable without corrupting its bytes.
     */
    public function test_json_response_without_content_type(): void {
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['GET']),
            callable: function ($request, $response) {
                $response->getBody()->write("\x00\xff");
                return $response->withoutHeader('Content-Type');
            },
        );
        $response = $this->send_json_batch([['id' => '1', 'method' => 'GET', 'url' => 'rest/v2/capture']]);
        $result = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR)['responses'][0];
        $this->assertSame('AP8', $result['body']);
        $this->assertSame('application/octet-stream', $result['headers']['content-type']);
    }

    /**
     * An invalid JSON response becomes an individual error and does not prevent later requests.
     */
    public function test_json_invalid_child_response(): void {
        $calls = 0;
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['GET']),
            callable: function ($request, $response) use (&$calls) {
                $calls++;
                $response->getBody()->write($calls === 1 ? '{invalid' : '{}');
                return $response->withHeader('Content-Type', 'application/json');
            },
        );
        $response = $this->send_json_batch([
            ['id' => '1', 'method' => 'GET', 'url' => 'rest/v2/capture'],
            ['id' => '2', 'method' => 'GET', 'url' => 'rest/v2/capture'],
        ]);
        $results = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR)['responses'];
        $this->assertSame([500, 200], array_column($results, 'status'));
        $this->assertSame('InvalidBatchResponse', $results[0]['body']['error']['code']);
    }

    /**
     * Invalid child requests are rejected independently of other JSON requests.
     *
     * @param array $child
     * @param int $status
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('invalid_json_child_provider')]
    public function test_invalid_json_child(array $child, int $status): void {
        $calls = 0;
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['GET', 'POST']),
            callable: function ($request, $response) use (&$calls) {
                $calls++;
                return $response;
            },
        );
        $child += ['id' => 'bad', 'method' => 'GET', 'url' => 'rest/v2/capture'];
        $response = $this->send_json_batch([$child, ['id' => 'good', 'method' => 'GET', 'url' => 'rest/v2/capture']]);
        $results = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR)['responses'];
        $this->assertSame([$status, 200], array_column($results, 'status'));
        $this->assertSame(1, $calls);
    }

    /**
     * Invalid and unsupported JSON child requests.
     *
     * @return \Generator
     */
    public static function invalid_json_child_provider(): \Generator {
        yield 'child authorization' => [['headers' => ['Authorization' => 'Bearer other']], 400];
        yield 'child cookie' => [['headers' => ['Cookie' => 'session=other']], 400];
        yield 'child proxy authorization' => [['headers' => ['Proxy-Authorization' => 'other']], 400];
        yield 'host override' => [['headers' => ['Host' => 'other.example']], 400];
        yield 'duplicate headers' => [['headers' => ['Accept' => 'a', 'accept' => 'b']], 400];
        yield 'invalid header value' => [['headers' => ['x-test' => ['a', 'b']]], 400];
        yield 'invalid method' => [['method' => 'OPTIONS'], 400];
        yield 'body on GET' => [['headers' => ['content-type' => 'application/json'], 'body' => []], 400];
        yield 'missing content type' => [['method' => 'POST', 'body' => []], 400];
        yield 'invalid text body' => [['method' => 'POST', 'headers' => ['content-type' => 'text/plain'], 'body' => []], 400];
        yield 'invalid base64url' => [
            ['method' => 'POST', 'headers' => ['content-type' => 'application/octet-stream'], 'body' => 'not+base64'],
            400,
        ];
        yield 'unknown property' => [['depends_on' => ['other']], 400];
        yield 'unsupported condition' => [['if' => '$previous/$succeeded'], 501];
        yield 'null condition' => [['if' => null], 501];
        yield 'unsupported url reference' => [['url' => '$previous'], 501];
        yield 'url reference with query' => [['url' => '$previous?field=value'], 501];
        yield 'unsupported etag reference' => [['headers' => ['if-match' => '$previous']], 501];
        yield 'etag reference with whitespace' => [['headers' => ['if-match' => ' $previous ']], 501];
    }

    /**
     * Unsafe URLs and nested batches are rejected before routing.
     *
     * @param string $target
     * @param int $status
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('json_child_url_provider')]
    public function test_json_child_url(string $target, int $status): void {
        global $CFG;

        $this->resetAfterTest();
        $CFG->wwwroot = 'https://example.test:8443/moodle';
        $this->set_basepath('/moodle/r.php');
        $calls = 0;
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['GET']),
            callable: function ($request, $response) use (&$calls) {
                $calls++;
                return $response;
            },
        );
        $batch = $this->create_request(
            'POST',
            '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
        );
        $batch = $batch->withUri(new Uri('https://example.test:8443' . $batch->getUri()));
        $batch->getBody()->write(json_encode(['requests' => [
            ['id' => '1', 'method' => 'GET', 'url' => $target],
        ]], JSON_THROW_ON_ERROR));
        $response = $this->get_app()->handle($batch);
        $results = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR)['responses'];
        $this->assertSame($status, $results[0]['status']);
        $this->assertSame($status === 200 ? 1 : 0, $calls);
    }

    /**
     * Safe and unsafe JSON child URLs.
     *
     * @return \Generator
     */
    public static function json_child_url_provider(): \Generator {
        yield 'relative' => ['rest/v2/capture', 200];
        yield 'absolute path' => ['/moodle/r.php/api/rest/v2/capture', 200];
        yield 'same origin' => ['https://example.test:8443/moodle/r.php/api/rest/v2/capture', 200];
        yield 'other host' => ['https://other.test:8443/moodle/r.php/api/rest/v2/capture', 400];
        yield 'other port' => ['https://example.test/moodle/r.php/api/rest/v2/capture', 400];
        yield 'network path' => ['//other.test/moodle/r.php/api/rest/v2/capture', 400];
        yield 'userinfo' => ['https://user@example.test:8443/moodle/r.php/api/rest/v2/capture', 400];
        yield 'nested batch' => ['/moodle/r.php/api/$batch', 400];
        yield 'non-api route' => ['/moodle/r.php/admin/index.php', 400];
        yield 'prefix bypass' => ['/moodle/r.php/api/rest/v2extra/capture', 400];
        yield 'encoded traversal' => ['/moodle/r.php/api/rest/v2/%2e%2e/capture', 400];
        yield 'double encoding' => ['/moodle/r.php/api/rest/v2/%252e%252e/capture', 400];
        yield 'encoded slash' => ['/moodle/r.php/api/rest/v2/%2fcapture', 400];
        yield 'fragment' => ['rest/v2/capture#fragment', 400];
    }

    /**
     * Invalid envelopes cannot execute any children.
     *
     * @param array $batchbody
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('invalid_json_envelope_provider')]
    public function test_invalid_json_envelope(array $batchbody): void {
        $calls = 0;
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['GET']),
            callable: function ($request, $response) use (&$calls) {
                $calls++;
                return $response;
            },
        );
        $batch = $this->create_request('POST', '', prefix: route_loader_interface::ROUTE_BATCH_API);
        $batch->getBody()->write(json_encode($batchbody, JSON_THROW_ON_ERROR));
        $response = $this->get_app()->handle($batch);
        $this->assertSame(400, $response->getStatusCode());
        $this->assertSame(0, $calls);
    }

    /**
     * Invalid JSON batch envelopes.
     *
     * @return \Generator
     */
    public static function invalid_json_envelope_provider(): \Generator {
        $request = ['id' => '1', 'method' => 'GET', 'url' => 'rest/v2/capture'];
        yield 'missing requests' => [[]];
        yield 'invalid request' => [['requests' => [$request, null]]];
        yield 'duplicate id' => [['requests' => [$request, $request]]];
        yield 'forward dependency' => [['requests' => [$request + ['dependsOn' => ['2']], ['id' => '2']]]];
        yield 'unknown dependency' => [['requests' => [$request + ['dependsOn' => ['missing']]]]];
        yield 'invalid dependency type' => [['requests' => [$request + ['dependsOn' => null]]]];
        yield 'invalid group type' => [['requests' => [$request + ['atomicityGroup' => null]]]];
        yield 'group and request name collision' => [['requests' => [$request + ['atomicityGroup' => '1']]]];
        yield 'non-adjacent group' => [['requests' => [
            $request + ['atomicityGroup' => 'group'],
            ['id' => '2'],
            ['id' => '3', 'atomicityGroup' => 'group'],
        ]]];
    }

    /**
     * JSON output is only returned when allowed by the Accept header.
     *
     * @param string $accept
     * @param int $status
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('json_accept_provider')]
    public function test_json_accept(string $accept, int $status): void {
        self::mock_route_loader();
        $response = $this->send_json_batch([], ['Accept' => $accept]);
        $this->assertSame($status, $response->getStatusCode());
    }

    /**
     * Accept headers for JSON batch responses.
     *
     * @return \Generator
     */
    public static function json_accept_provider(): \Generator {
        yield 'no accept' => ['', 200];
        yield 'json' => ['application/json', 200];
        yield 'wildcard' => ['application/*', 200];
        yield 'all' => ['*/*', 200];
        yield 'unsupported' => ['multipart/mixed', 406];
        yield 'excluded' => ['application/json;q=0, */*;q=1', 406];
        yield 'accepted despite wildcard exclusion' => ['*/*;q=0, application/json;q=0.5', 200];
    }

    /**
     * Invalid JSON itself is rejected without dispatching a request.
     */
    public function test_malformed_json_batch(): void {
        self::mock_route_loader();
        $batch = $this->create_request('POST', '', prefix: route_loader_interface::ROUTE_BATCH_API);
        $batch->getBody()->write('{"requests":[');
        $response = $this->get_app()->handle($batch);
        $this->assertSame(400, $response->getStatusCode());
        $this->assertSame('InvalidBatchRequest', json_decode((string) $response->getBody())->error->code);
    }

    /**
     * Unrepresentable JSON numbers fail the child without aborting the batch.
     */
    public function test_unrepresentable_json_child_body(): void {
        $calls = 0;
        $this->mock_route_from_route_attribute(
            route_loader_interface::ROUTE_GROUP_API,
            new route(path: '/capture', method: ['GET', 'POST']),
            callable: function ($request, $response) use (&$calls) {
                $calls++;
                return $response;
            },
        );
        $batch = $this->create_request('POST', '', prefix: route_loader_interface::ROUTE_BATCH_API);
        $batch->getBody()->write(
            '{"requests":[{"id":"1","method":"POST","url":"rest/v2/capture",'
            . '"headers":{"content-type":"application/json"},"body":1e400},'
            . '{"id":"2","method":"GET","url":"rest/v2/capture"}]}',
        );
        $response = $this->get_app()->handle($batch);
        $results = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR)['responses'];
        $this->assertSame([400, 200], array_column($results, 'status'));
        $this->assertSame(1, $calls);
    }

    /**
     * The outer token is used for each JSON child and scoped by the normal API middleware.
     *
     * @param array $scopes
     * @param int $status
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('outer_api_token_scopes_provider')]
    public function test_json_outer_api_token_authentication(array $scopes, int $status): void {
        $this->resetAfterTest();
        $user = $this->getDataGenerator()->create_user();
        $token = di::get(api_token_repository::class)->create_token('Batch test', 'correctsecret', $user->id, $scopes);
        $bearer = rtrim(token_manager::TOKEN_PREFIX . base64_encode("{$token->get_id()}/correctsecret"), '=');
        $this->add_class_routes_to_route_loader(\core_user\route\api\preferences::class);
        $response = $this->send_json_batch([
            ['id' => '1', 'method' => 'GET', 'url' => "rest/v2/{$user->id}/preferences"],
            ['id' => '2', 'method' => 'GET', 'url' => "rest/v2/{$user->id}/preferences"],
        ], ['Authorization' => "Bearer {$bearer}"]);
        $results = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR)['responses'];
        $this->assertSame([$status, $status], array_column($results, 'status'));
    }

    /**
     * A JSON child can use the current cookie-authenticated session.
     */
    public function test_json_cookie_session_authentication(): void {
        $this->resetAfterTest();
        $user = $this->getDataGenerator()->create_user();
        $this->setUser($user);
        $this->add_class_routes_to_route_loader(\core_user\route\api\preferences::class);
        $response = $this->send_json_batch([
            ['id' => '1', 'method' => 'GET', 'url' => "rest/v2/{$user->id}/preferences"],
        ]);
        $results = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR)['responses'];
        $this->assertSame(200, $results[0]['status']);
    }

    /**
     * Send a JSON batch through the router.
     *
     * @param array $requests
     * @param array $headers
     * @return ResponseInterface
     */
    protected function send_json_batch(array $requests, array $headers = []): ResponseInterface {
        $batch = $this->create_request(
            'POST',
            '',
            prefix: route_loader_interface::ROUTE_BATCH_API,
            headers: array_merge(['Content-Type' => 'application/json'], $headers),
        );
        $batch->getBody()->write(json_encode(['requests' => $requests], JSON_THROW_ON_ERROR));
        return $this->get_app()->handle($batch);
    }

    /**
     * Ensure that a boundary can be extracted from a content type.
     *
     * @param string $contenttype
     * @param null|string $boundary
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
     * @param string $protocolandresponse
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
