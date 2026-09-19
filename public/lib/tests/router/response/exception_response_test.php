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

namespace core\router\response;

use core\router\schema\objects\schema_object;
use core\tests\router\route_testcase;
use GuzzleHttp\Psr7\ServerRequest;

/**
 * Tests for the access denied response.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(\core\router\response\exception_response::class)]
final class exception_response_test extends route_testcase {
    public function test_basics(): void {
        $instance = new class extends exception_response { // phpcs:ignore
            #[\Override]
            protected static function get_response_description(): string {
                return 'Access was denied to the resource.';
            }
        };

        $rcm = new \ReflectionMethod($instance, 'get_exception_status_code');

        $this->assertIsInt($rcm->invoke(null));
        $this->assertEquals(500, $rcm->invoke(null));
    }

    /**
     * The response schema must define the fields required by RFC-9457.
     */
    public function test_get_response_schema(): void {
        $rcm = new \ReflectionMethod(exception_response::class, 'get_response_schema');
        $schema = $rcm->invoke(null);

        $this->assertInstanceOf(schema_object::class, $schema);

        foreach (['type', 'title', 'status', 'detail', 'instance'] as $field) {
            $this->assertTrue($schema->has($field), "Schema is missing the '{$field}' field");
        }
    }

    /**
     * When no type URL is defined, the payload must default to 'about:blank' as required by the RFC.
     */
    public function test_get_payload_data_defaults_type_to_about_blank(): void {
        $exception = new \Exception('Some error message');
        $request = new ServerRequest('GET', '/example');

        $instance = new class extends exception_response { // phpcs:ignore
            #[\Override]
            protected static function get_response_description(): string {
                return 'Example description';
            }
        };
        $rc = get_class($instance);

        $rcm = new \ReflectionMethod($rc, 'get_response_payload');
        $data = $rcm->invoke(null, $exception, request: $request);

        $this->assertEquals('about:blank', $data['type']);
        $this->assertEquals('Example description', $data['title']);
        $this->assertEquals($exception->getMessage(), $data['detail']);
        $this->assertEquals('/example', $data['instance']);
    }

    /**
     * When a type URL is defined, it must be used, out as an unescaped url string.
     */
    public function test_get_response_payload_uses_response_type_when_set(): void {
        $exception = new \Exception('Some error message');
        $request = new ServerRequest('GET', '/example');

        $instance = new class extends exception_response { // phpcs:ignore
            #[\Override]
            protected static function get_response_description(): string {
                return 'Example description';
            }

            #[\Override]
            protected static function get_response_type(): ?\core\url {
                return new \core\url('https://example.com/problems/example');
            }
        };
        $rc = get_class($instance);

        $rcm = new \ReflectionMethod($rc, 'get_response_payload');
        $data = $rcm->invoke(null, $exception, request: $request);

        $this->assertEquals('https://example.com/problems/example', $data['type']);
    }

    /**
     * The 'instance' field must only be included when a request was passed as extra data.
     */
    public function test_get_payload_data_omits_instance_without_request(): void {
        $exception = new \Exception('Some error message');

        $instance = new class extends exception_response { // phpcs:ignore
            #[\Override]
            protected static function get_response_description(): string {
                return 'Example description';
            }
        };
        $rc = get_class($instance);

        $rcm = new \ReflectionMethod($rc, 'get_payload_data');
        $data = $rcm->invoke(null, $exception);
        $this->assertDebuggingNotCalled();

        $this->assertArrayNotHasKey('instance', $data);
    }

    /**
     * Ensure that if a legacy get_payload_data method exists, then it is called and emits deprecation notices.
     */
    public function test_get_response_payload_calls_get_payload_data_and_emits_deprecation(): void {
        $exception = new \Exception('Some error message');
        $request = new ServerRequest('GET', '/example');

        $instance = new class extends exception_response { // phpcs:ignore
            #[\Override]
            protected static function get_payload_data(
                \Exception $exception,
                ...$extra,
            ): array {
                return ['example' => 'foo'];
            }
        };
        $rc = get_class($instance);

        $rcm = new \ReflectionMethod($rc, 'get_response_payload');
        $data = $rcm->invoke(null, $exception, $request);
        $this->assertdebuggingcalledcount(1);
        $this->assertArrayHasKey('example', $data);
        $this->assertEquals('foo', $data['example']);
    }
}
