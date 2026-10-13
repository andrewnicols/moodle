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
use core\router\schema\etag;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use PHPUnit\Framework\Attributes\CoversClass;

/**
 * Tests for conditional request (ETag) support on routes.
 *
 * @package    core
 * @category   test
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(conditional_request::class)]
#[CoversClass(etag::class)]
final class conditional_request_test extends \advanced_testcase {
    public function test_etag_is_stable_and_quoted(): void {
        $etag = conditional_request::generate_etag(['a' => 1]);
        $this->assertMatchesRegularExpression('/^"[0-9a-f]{40}"$/', $etag);
        $this->assertSame($etag, conditional_request::generate_etag(['a' => 1]));
        $this->assertNotSame($etag, conditional_request::generate_etag(['a' => 2]));
    }

    public function test_if_match_is_optional(): void {
        $request = new ServerRequest('PATCH', '/');
        conditional_request::assert_if_match($request, ['a' => 1]);
        conditional_request::assert_if_match($request->withHeader('If-Match', '*'), ['a' => 1]);

        $etag = conditional_request::generate_etag(['a' => 1]);
        conditional_request::assert_if_match($request->withHeader('If-Match', "\"other\", {$etag}"), ['a' => 1]);
        $this->expectNotToPerformAssertions();
    }

    public function test_if_match_mismatch(): void {
        $this->expectException(precondition_failed_exception::class);
        conditional_request::assert_if_match(
            (new ServerRequest('PATCH', '/'))->withHeader('If-Match', '"stale"'),
            ['a' => 1],
        );
    }

    public function test_respond(): void {
        $request = new ServerRequest('GET', '/');
        $etag = conditional_request::generate_etag(['a' => 1]);

        $response = conditional_request::respond($request, new Response(), ['a' => 1]);
        $this->assertEquals(200, $response->response->getStatusCode());
        $this->assertEquals($etag, $response->response->getHeaderLine('ETag'));

        $response = conditional_request::respond($request->withHeader('If-None-Match', $etag), new Response(), ['a' => 1]);
        $this->assertEquals(304, $response->response->getStatusCode());
        $this->assertEquals($etag, $response->response->getHeaderLine('ETag'));

        $response = conditional_request::respond($request->withHeader('If-None-Match', '"stale"'), new Response(), ['a' => 1]);
        $this->assertEquals(200, $response->response->getStatusCode());
    }

    public function test_etag_attribute_is_attached_to_route(): void {
        $class = new class {
            #[route(path: '/x', method: ['PATCH'])]
            #[etag]
            public function tagged(): void {
            }

            #[route(path: '/y', method: ['GET'])]
            public function untagged(): void {
            }
        };
        $classinfo = new \ReflectionClass($class);

        $this->assertNotNull(route::from_reflection($classinfo, $classinfo->getMethod('tagged'))->etag);
        $this->assertNull(route::from_reflection($classinfo, $classinfo->getMethod('untagged'))->etag);
    }

    public function test_openapi_documents_etag_routes(): void {
        $class = new class {
            #[route(path: '/x', method: ['PATCH'])]
            #[etag]
            public function write(): void {
            }

            #[route(path: '/y', method: ['GET'])]
            #[etag]
            public function read(): void {
            }

            #[route(path: '/z', method: ['PATCH'])]
            public function plain(): void {
            }
        };
        $classinfo = new \ReflectionClass($class);
        $spec = new schema\specification();
        $describe = function (string $method) use ($spec, $classinfo): \stdClass {
            $route = route::from_reflection($classinfo, $classinfo->getMethod($method));
            return $spec->get_openapi_schema_for_route($route, 'core', '/x')->{strtolower($route->get_methods(['GET'])[0])};
        };

        $write = $describe('write');
        $this->assertArrayHasKey(412, $write->responses);
        $this->assertStringContainsString('If-Match', $write->description);
        $this->assertArrayNotHasKey(304, $write->responses);
        $this->assertContains('If-Match', array_column(json_decode(json_encode($write->parameters), true), 'name'));

        $read = $describe('read');
        $this->assertArrayHasKey(304, $read->responses);
        $this->assertContains('If-None-Match', array_column(json_decode(json_encode($read->parameters), true), 'name'));

        $this->assertArrayNotHasKey(412, $describe('plain')->responses);
    }
}
