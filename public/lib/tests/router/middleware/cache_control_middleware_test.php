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

use core\di;
use core\router\callable_resolver;
use core\router\route;
use core\tests\router\route_testcase;
use GuzzleHttp\Psr7\HttpFactory;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Tests for the Cache Control middleware.
 *
 * @package    core
 * @category   test
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(cache_control_middleware::class)]
final class cache_control_middleware_test extends route_testcase {
    #[\PHPUnit\Framework\Attributes\DataProvider('valid_cache_provider')]
    #[\PHPUnit\Framework\Attributes\DataProvider('valid_cache_lifetime_provider')]
    #[\PHPUnit\Framework\Attributes\DataProvider('invalid_method_cache_provider')]
    #[\PHPUnit\Framework\Attributes\DataProvider('invalid_statuscode_cache_provider')]
    #[\PHPUnit\Framework\Attributes\DataProvider('invalid_cache_keys_provider')]
    #[\PHPUnit\Framework\Attributes\DataProvider('invalid_cache_lifetime_provider')]
    public function test_middleware(
        string $method,
        int $statuscode,
        bool $routesupportscaching,
        mixed $urlcachekey,
        string|null $cachelifetime,
        bool $expectcache,
    ): void {
        $middleware = di::get(cache_control_middleware::class);

        $next = $this->getMockBuilder(RequestHandlerInterface::class)
            ->onlyMethods(['handle'])
            ->getMock();

        $response = $this->getMockBuilder(Response::class)
            ->onlyMethods(['getStatusCode'])
            ->getMock();
        $next->expects($this->once())->method('handle')->willReturn($response);

        $response->method('getStatusCode')->willReturn($statuscode);

        $slimroute = new \Slim\Routing\Route(
            [$method],
            $routesupportscaching ? '/cachekey:{cachekey}/some/path' : '/some/path',
            fn (ResponseInterface $response) => $response,
            di::get(HttpFactory::class),
            di::get(callable_resolver::class),
        );

        // Build the requested URL.
        $url = 'https://example.com';
        if ($urlcachekey) {
            $url .= "/cachekey:{$urlcachekey}";
            $slimroute->setArgument('cachekey', $urlcachekey);
        }
        $url .= "/some/path";

        // Build the Request that will be passed to the middleware.
        // This is a simplified version of the Request that Slim would build.
        // We do need to set the Moodle Route and the Slim Route as those are used by the middleware.
        $request = (new ServerRequest($method, $url))
            ->withAttribute(
                route::class,
                new route(cachelifetime: $cachelifetime),
            )
            ->withAttribute('__route__', $slimroute);

        // Process the request through the middleware.
        $response = $middleware->process($request, $next);
        if ($expectcache) {
            $this->assertStringContainsString('max-age=', $response->getHeaderLine('Cache-Control'));
        } else {
            $this->assertSame('private, no-store, no-cache', $response->getHeaderLine('Cache-Control'));
            $this->assertSame('no-cache', $response->getHeaderLine('Pragma'));
            $this->assertSame('0', $response->getHeaderLine('Expires'));
        }
    }

    /**
     * Explicit cache policies must not be overwritten, including on publicly cacheable routes.
     *
     * @param string $header
     * @param string $value
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('explicit_cache_headers_provider')]
    public function test_explicit_cache_headers(string $header, string $value): void {
        $slimroute = new \Slim\Routing\Route(
            ['GET'],
            '/cachekey:{cachekey}/some/path',
            fn (ResponseInterface $response) => $response,
            di::get(HttpFactory::class),
            di::get(callable_resolver::class),
        );
        $slimroute->setArgument('cachekey', 12345);
        $request = (new ServerRequest('GET', 'https://example.com/cachekey:12345/some/path'))
            ->withAttribute(route::class, new route(cachelifetime: '5 days'))
            ->withAttribute('__route__', $slimroute);
        $response = new Response(200, [$header => $value]);
        $next = $this->createMock(RequestHandlerInterface::class);
        $next->method('handle')->willReturn($response);

        $this->assertSame($response, di::get(cache_control_middleware::class)->process($request, $next));
    }

    /**
     * Cache-policy headers to preserve.
     *
     * @return array
     */
    public static function explicit_cache_headers_provider(): array {
        return [
            'cache control' => ['Cache-Control', 'private, max-age=60'],
            'expires' => ['Expires', 'Wed, 21 Oct 2037 07:28:00 GMT'],
            'pragma' => ['Pragma', 'no-cache'],
        ];
    }

    public function test_default_preserves_validator(): void {
        $request = new ServerRequest('GET', 'https://example.com/some/path');
        $response = new Response(304, ['ETag' => '"example"']);
        $next = $this->createMock(RequestHandlerInterface::class);
        $next->method('handle')->willReturn($response);

        $response = di::get(cache_control_middleware::class)->process($request, $next);
        $this->assertSame('private, no-store, no-cache', $response->getHeaderLine('Cache-Control'));
        $this->assertSame('"example"', $response->getHeaderLine('ETag'));
    }

    public function test_api_cache_headers(): void {
        global $CFG;

        $this->add_class_routes_to_route_loader(\core\route\api\strings::class);

        $response = $this->process_api_request('GET', '/strings/en/core/accept');
        $this->assert_valid_response($response);
        $this->assertSame('private, no-store, no-cache', $response->getHeaderLine('Cache-Control'));

        $response = $this->process_api_request('GET', '/strings/invalid!language/core/accept');
        $this->assertGreaterThanOrEqual(400, $response->getStatusCode());
        $this->assertSame('private, no-store, no-cache', $response->getHeaderLine('Cache-Control'));

        $request = new ServerRequest(
            'GET',
            $CFG->wwwroot . '/api/rest/v2/cachekey:12345/strings/en/core/accept',
        );
        $response = $this->get_app()->handle($request);
        $this->assert_valid_response($response);
        $this->assertStringContainsString('public, max-age=', $response->getHeaderLine('Cache-Control'));
        $this->assertStringContainsString('immutable', $response->getHeaderLine('Cache-Control'));
    }

    /**
     * Data provider for the test_middleware method providing valid cache scenarios.
     *
     * @return \Generator
     */
    public static function valid_cache_provider(): \Generator {
        yield '200 GET with a valid cachekey: Supported' => [
            'method' => 'GET',
            'statuscode' => 200,
            'routesupportscaching' => true,
            'urlcachekey' => 12345,
            'cachelifetime' => '5 days',
            'expectcache' => true,
        ];
        yield '304 GET with a valid cachekey: Supported' => [
            'method' => 'GET',
            'statuscode' => 304,
            'routesupportscaching' => true,
            'urlcachekey' => 12345,
            'cachelifetime' => '5 days',
            'expectcache' => true,
        ];
        yield '304 GET without a cachekey: Private' => [
            'method' => 'GET',
            'statuscode' => 304,
            'routesupportscaching' => true,
            'urlcachekey' => null,
            'cachelifetime' => '5 days',
            'expectcache' => false,
        ];
    }

    /**
     * Data provider for the test_middleware method providing cache scenarios which contain uncacheable methods.
     *
     * @return \Generator
     */
    public static function invalid_method_cache_provider(): \Generator {
        $unsupportedmethods = ['POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
        foreach ($unsupportedmethods as $method) {
            yield "200 {$method} with a valid cachekey: Not supported" => [
                'method' => $method,
                'statuscode' => 200,
                'routesupportscaching' => true,
                'urlcachekey' => 12345,
                'cachelifetime' => '5 days',
                'expectcache' => false,
            ];
        }
    }

    /**
     * Data provider for the test_middleware method providing cache scenarios which contain uncacheable status codes.
     *
     * @return \Generator
     */
    public static function invalid_statuscode_cache_provider(): \Generator {
        $unsupportedstatuses = [100, 101, 301, 303, 400, 403, 404, 500, 503];
        foreach ($unsupportedstatuses as $statuscode) {
            yield "{$statuscode} GET with a valid cachekey: Not supported" => [
                'method' => 'GET',
                'statuscode' => $statuscode,
                'routesupportscaching' => true,
                'urlcachekey' => 12345,
                'cachelifetime' => '5 days',
                'expectcache' => false,
            ];
        }
    }

    /**
     * Data provider for the test_middleware method providing cache scenarios which contain invalid URL cache keys.
     *
     * @return \Generator
     */
    public static function invalid_cache_keys_provider(): \Generator {
        $cachekeys = [
            'Future' => time() + DAYSECS,
            'String zero' => '0',
            'Non-numeric string' => 'yes',
            'No key specified' => null,
        ];

        foreach ($cachekeys as $title => $cachekey) {
            yield "200 GET with an invalid cachekey in the URL ({$title}): Not supported" => [
                'method' => 'GET',
                'statuscode' => 200,
                'routesupportscaching' => true,
                'urlcachekey' => $cachekey,
                'cachelifetime' => '5 days',
                'expectcache' => false,
            ];
        }
    }

    /**
     * Data provider for the test_middleware method providing cache scenarios which contain invalid URL cache keys.
     *
     * @return \Generator
     */
    public static function valid_cache_keys_provider(): \Generator {
        $cachekeys = [
            'Numeric String' => '12345',
        ];

        foreach ($cachekeys as $title => $cachekey) {
            yield "200 GET with an invalid cachekey in the URL ({$title}): Not supported" => [
                'method' => 'GET',
                'statuscode' => 200,
                'routesupportscaching' => true,
                'urlcachekey' => $cachekey,
                'cachelifetime' => '5 days',
                'expectcache' => true,
            ];
        }
    }

    /**
     * Data provider for the test_middleware method providing cache scenarios which contain invalid cache lifetimes.
     *
     * @return \Generator
     */
    public static function invalid_cache_lifetime_provider(): \Generator {
        $lifetimes = [
            '0 days',
            '-1 days',
            '-1 seconds',
            '0 seconds',
            '0',
        ];

        foreach ($lifetimes as $title => $lifetime) {
            yield "200 GET with an invalid cache lifetime ({$title}): Not supported" => [
                'method' => 'GET',
                'statuscode' => 200,
                'routesupportscaching' => true,
                'urlcachekey' => 12345,
                'cachelifetime' => $lifetime,
                'expectcache' => false,
            ];
        }
    }

    /**
     * Data provider for the test_middleware method providing cache scenarios which contain valid cache lifetimes.
     *
     * @return \Generator
     */
    public static function valid_cache_lifetime_provider(): \Generator {
        $lifetimes = [
            '1 minute',
        ];

        foreach ($lifetimes as $title => $lifetime) {
            yield "200 GET with an valid cache lifetime ({$title}): Supported" => [
                'method' => 'GET',
                'statuscode' => 200,
                'routesupportscaching' => true,
                'urlcachekey' => 12345,
                'cachelifetime' => $lifetime,
                'expectcache' => true,
            ];
        }
    }
}
