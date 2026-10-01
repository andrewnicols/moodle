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

use GuzzleHttp\Psr7\ServerRequest;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Tests for idempotency_key_middleware.
 *
 * @package    core
 * @category   test
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(idempotency_key_middleware::class)]
final class idempotency_key_middleware_test extends \advanced_testcase {
    /**
     * Create a handler which returns a fresh response with a unique body each time it is called.
     *
     * @param int $expectedcalls The number of times the underlying handler is expected to be invoked.
     * @param int $statuscode The status code the handler should respond with.
     * @return RequestHandlerInterface
     */
    protected function get_counting_handler(int $expectedcalls, int $statuscode = 200): RequestHandlerInterface {
        $handler = $this->getMockBuilder(RequestHandlerInterface::class)->getMock();
        $calls = 0;
        $handler->expects($this->exactly($expectedcalls))
            ->method('handle')
            ->willReturnCallback(function (ServerRequestInterface $request) use (&$calls, $statuscode): ResponseInterface {
                $calls++;
                $response = new \GuzzleHttp\Psr7\Response($statuscode);
                $response->getBody()->write("response-{$calls}");

                return $response;
            });

        return $handler;
    }

    public function test_requests_without_header_are_not_affected(): void {
        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->get_counting_handler(2);

        $request = new ServerRequest('POST', '/example');
        $middleware->process($request, $handler);
        $middleware->process($request, $handler);
    }

    public function test_non_applicable_methods_are_not_affected(): void {
        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->get_counting_handler(2);

        $request = (new ServerRequest('GET', '/example'))->withHeader('Idempotency-Key', 'my-key');
        $middleware->process($request, $handler);
        $middleware->process($request, $handler);
    }

    public function test_duplicate_request_is_replayed(): void {
        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->get_counting_handler(1);

        $request = (new ServerRequest('POST', '/example'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withBody(\GuzzleHttp\Psr7\Utils::streamFor('{"a":1}'));

        $first = $middleware->process($request, $handler);
        $this->assertEquals('response-1', (string) $first->getBody());
        $this->assertFalse($first->hasHeader('Idempotency-Replayed'));

        $second = $middleware->process($request, $handler);
        $this->assertEquals('response-1', (string) $second->getBody());
        $this->assertEquals('true', $second->getHeaderLine('Idempotency-Replayed'));
    }

    public function test_captured_response_is_encrypted_at_rest(): void {
        global $DB;

        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->get_counting_handler(1);

        $request = (new ServerRequest('POST', '/example'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withBody(\GuzzleHttp\Psr7\Utils::streamFor('{"secret":"sensitive-value"}'));
        $middleware->process($request, $handler);

        $record = $DB->get_record('api_idempotency_keys', []);
        $this->assertNotFalse($record);
        $this->assertStringNotContainsString('response-1', $record->response);
        $this->assertStringNotContainsString('sensitive-value', $record->response);

        // But it can be decrypted and decoded back via the repository.
        $decoded = \core\di::get(\core\api\repository\idempotency_key_repository::class)->decode_response($record);
        $this->assertEquals('response-1', $decoded['body']);
    }

    public function test_expired_records_are_purged_by_cleanup_task(): void {
        global $DB;

        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->get_counting_handler(1);

        $request = (new ServerRequest('POST', '/example'))->withHeader('Idempotency-Key', 'my-key');
        $middleware->process($request, $handler);

        $this->assertEquals(1, $DB->count_records('api_idempotency_keys'));

        // Force the record to look expired, as if the retention period had already elapsed.
        $DB->set_field('api_idempotency_keys', 'timetoexpire', 1);

        $task = \core\di::make(\core\task\api_idempotency_key_cleanup_task::class);
        $this->expectOutputRegex('/Deleted 1 expired API Idempotency Key record\(s\)\./');
        $task->execute();

        $this->assertEquals(0, $DB->count_records('api_idempotency_keys'));
    }

    public function test_same_key_with_different_payload_is_rejected(): void {
        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->get_counting_handler(1);

        $first = (new ServerRequest('POST', '/example'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withBody(\GuzzleHttp\Psr7\Utils::streamFor('{"a":1}'));
        $middleware->process($first, $handler);

        $second = (new ServerRequest('POST', '/example'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withBody(\GuzzleHttp\Psr7\Utils::streamFor('{"a":2}'));
        $response = $middleware->process($second, $handler);

        $this->assertEquals(422, $response->getStatusCode());
    }

    public function test_empty_key_is_rejected(): void {
        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->get_counting_handler(0);

        $request = (new ServerRequest('POST', '/example'))->withHeader('Idempotency-Key', '   ');
        $response = $middleware->process($request, $handler);

        $this->assertEquals(400, $response->getStatusCode());
    }

    public function test_server_errors_are_not_persisted(): void {
        global $DB;

        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->get_counting_handler(2, 500);

        $request = (new ServerRequest('POST', '/example'))->withHeader('Idempotency-Key', 'my-key');
        $middleware->process($request, $handler);
        $middleware->process($request, $handler);

        $this->assertEquals(0, $DB->count_records('api_idempotency_keys'));
    }
}
