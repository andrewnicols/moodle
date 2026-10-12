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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

namespace core\router\middleware;

use core\tests\router\route_testcase;
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
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(idempotency_key_middleware::class)]
final class idempotency_key_middleware_test extends route_testcase {
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

    /**
     * Create and return an authenticated user for use with request attributes in these tests.
     *
     * Idempotency protection requires an authenticated user (see
     * idempotency_key_middleware::process()), so most tests need one attached via
     * ServerRequestInterface::withAttribute('user', ...) to exercise real idempotency behaviour.
     *
     * @return \stdClass
     */
    protected function get_authenticated_user(): \stdClass {
        return $this->getDataGenerator()->create_user();
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
            ->withAttribute('user', $this->get_authenticated_user())
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
            ->withAttribute('user', $this->get_authenticated_user())
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

    public function test_corrupt_captured_response_is_discarded_and_reprocessed(): void {
        global $DB;

        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->get_counting_handler(2);

        $user = $this->get_authenticated_user();
        $makerequest = static fn(): ServerRequest => (new ServerRequest('POST', '/example'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withAttribute('user', $user);

        $first = $middleware->process($makerequest(), $handler);
        $this->assertEquals('response-1', (string) $first->getBody());

        // Simulate the stored response becoming undecryptable, e.g. because the site's
        // encryption key has changed since it was captured.
        $DB->set_field('api_idempotency_keys', 'response', 'not-valid-encrypted-data', []);

        // The client retries with the same key and request. Rather than erroring, the corrupt
        // record is discarded and the request is processed again as if it were new.
        $second = $middleware->process($makerequest(), $handler);
        $this->assertDebuggingCalled(
            'Unable to decode a captured idempotency key response, discarding it: ' .
            'Data does not match a supported encryption method',
        );
        $this->assertEquals('response-2', (string) $second->getBody());
        $this->assertEquals('', $second->getHeaderLine('Idempotency-Replayed'));

        // The corrupt record has been replaced by a fresh, valid, captured response.
        $this->assertEquals(1, $DB->count_records('api_idempotency_keys'));
        $record = $DB->get_record('api_idempotency_keys', []);
        $decoded = \core\di::get(\core\api\repository\idempotency_key_repository::class)->decode_response($record);
        $this->assertEquals('response-2', $decoded['body']);
    }

    public function test_expired_records_are_purged_by_cleanup_task(): void {
        global $DB;

        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->get_counting_handler(1);

        $request = (new ServerRequest('POST', '/example'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withAttribute('user', $this->get_authenticated_user());
        $middleware->process($request, $handler);

        $this->assertEquals(1, $DB->count_records('api_idempotency_keys'));

        // Force the record to look expired, as if the retention period had already elapsed.
        $DB->set_field('api_idempotency_keys', 'timetoexpire', 1);

        $task = \core\di::make(\core\task\api_idempotency_key_cleanup_task::class);
        $this->expectOutputRegex(
            '/Deleted 1 expired API Idempotency Key record\(s\)\..*' .
            'Deleted 0 API Idempotency Key record\(s\) exceeding the per-user quota\./s',
        );
        $task->execute();

        $this->assertEquals(0, $DB->count_records('api_idempotency_keys'));
    }

    public function test_complete_record_quotas_are_enforced_per_user(): void {
        global $DB;

        $this->resetAfterTest();

        $repository = \core\di::get(\core\api\repository\idempotency_key_repository::class);
        $maxrecords = \core\api\repository\idempotency_key_repository::MAX_COMPLETE_RECORDS_PER_USER;

        $overquotauser = $this->getDataGenerator()->create_user();
        $otheruser = $this->getDataGenerator()->create_user();
        $now = time();
        $expectedretainedkeyhashes = [];

        for ($i = 1; $i <= $maxrecords + 5; $i++) {
            $keyhash = hash('sha256', "over-quota-complete-{$i}");
            $DB->insert_record('api_idempotency_keys', (object) [
                'userid' => $overquotauser->id,
                'keyhash' => $keyhash,
                'requesthash' => hash('sha256', "over-quota-request-{$i}"),
                'state' => \core\api\repository\idempotency_key_repository::STATE_COMPLETE,
                'statuscode' => 200,
                'response' => "encrypted-response-{$i}",
                'timecreated' => $now + $i,
                'timemodified' => $now + $i,
                'timetoexpire' => $now + 86400 + $i,
            ]);

            if ($i > 5) {
                $expectedretainedkeyhashes[] = $keyhash;
            }
        }

        $processingkeyhash = hash('sha256', 'over-quota-processing');
        $DB->insert_record('api_idempotency_keys', (object) [
            'userid' => $overquotauser->id,
            'keyhash' => $processingkeyhash,
            'requesthash' => hash('sha256', 'over-quota-processing-request'),
            'state' => \core\api\repository\idempotency_key_repository::STATE_PROCESSING,
            'statuscode' => null,
            'response' => null,
            'timecreated' => $now - 1000,
            'timemodified' => $now - 1000,
            'timetoexpire' => $now + 60,
        ]);

        $otheruserkeyhashes = [];
        for ($i = 1; $i <= 3; $i++) {
            $keyhash = hash('sha256', "other-user-complete-{$i}");
            $otheruserkeyhashes[] = $keyhash;
            $DB->insert_record('api_idempotency_keys', (object) [
                'userid' => $otheruser->id,
                'keyhash' => $keyhash,
                'requesthash' => hash('sha256', "other-user-request-{$i}"),
                'state' => \core\api\repository\idempotency_key_repository::STATE_COMPLETE,
                'statuscode' => 200,
                'response' => "other-response-{$i}",
                'timecreated' => $now + 1000 + $i,
                'timemodified' => $now + 1000 + $i,
                'timetoexpire' => $now + 86400 + 1000 + $i,
            ]);
        }

        $deletedcount = $repository->enforce_user_quotas();

        $this->assertEquals(5, $deletedcount);
        $this->assertEquals(
            $maxrecords,
            $DB->count_records('api_idempotency_keys', [
                'userid' => $overquotauser->id,
                'state' => \core\api\repository\idempotency_key_repository::STATE_COMPLETE,
            ]),
        );
        $this->assertEquals(
            1,
            $DB->count_records('api_idempotency_keys', [
                'userid' => $overquotauser->id,
                'state' => \core\api\repository\idempotency_key_repository::STATE_PROCESSING,
            ]),
        );

        $remainingrecords = $DB->get_records(
            'api_idempotency_keys',
            [
                'userid' => $overquotauser->id,
                'state' => \core\api\repository\idempotency_key_repository::STATE_COMPLETE,
            ],
            'timecreated ASC',
            'id, keyhash',
        );
        $remainingkeyhashes = array_map(
            static fn(\stdClass $record): string => $record->keyhash,
            array_values($remainingrecords),
        );
        $this->assertSame($expectedretainedkeyhashes, $remainingkeyhashes);
        $this->assertNotFalse($DB->get_record('api_idempotency_keys', ['keyhash' => $processingkeyhash]));

        $otheruserrecords = $DB->get_records(
            'api_idempotency_keys',
            [
                'userid' => $otheruser->id,
                'state' => \core\api\repository\idempotency_key_repository::STATE_COMPLETE,
            ],
            'timecreated ASC',
            'id, keyhash',
        );
        $this->assertSame(
            $otheruserkeyhashes,
            array_map(
                static fn(\stdClass $record): string => $record->keyhash,
                array_values($otheruserrecords),
            ),
        );
    }

    public function test_complete_record_quota_is_configurable(): void {
        global $DB;

        $this->resetAfterTest();

        set_config('apiidempotencymaxrecordsperuser', 3);

        $repository = \core\di::get(\core\api\repository\idempotency_key_repository::class);
        $user = $this->getDataGenerator()->create_user();
        $now = time();

        for ($i = 1; $i <= 5; $i++) {
            $DB->insert_record('api_idempotency_keys', (object) [
                'userid' => $user->id,
                'keyhash' => hash('sha256', "configured-quota-{$i}"),
                'requesthash' => hash('sha256', "configured-quota-request-{$i}"),
                'state' => \core\api\repository\idempotency_key_repository::STATE_COMPLETE,
                'statuscode' => 200,
                'response' => "encrypted-response-{$i}",
                'timecreated' => $now + $i,
                'timemodified' => $now + $i,
                'timetoexpire' => $now + 86400 + $i,
            ]);
        }

        $deletedcount = $repository->enforce_user_quotas();

        $this->assertEquals(2, $deletedcount);
        $this->assertEquals(
            3,
            $DB->count_records('api_idempotency_keys', [
                'userid' => $user->id,
                'state' => \core\api\repository\idempotency_key_repository::STATE_COMPLETE,
            ]),
        );
    }

    public function test_oversized_response_is_not_persisted(): void {
        global $DB;

        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $user = $this->get_authenticated_user();

        // Incompressible, so the gzip-compressed and encrypted payload still exceeds the limit.
        $largebody = random_bytes(6 * 1024 * 1024);

        $handler = $this->getMockBuilder(RequestHandlerInterface::class)->getMock();
        $handler->expects($this->once())
            ->method('handle')
            ->willReturnCallback(function (ServerRequestInterface $request) use ($largebody): ResponseInterface {
                $response = new \GuzzleHttp\Psr7\Response(200);
                $response->getBody()->write($largebody);

                return $response;
            });

        $request = (new ServerRequest('POST', '/example'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withAttribute('user', $user);
        $response = $middleware->process($request, $handler);

        // The original caller still gets the full response as normal.
        $this->assertEquals('Processing-Skipped', $response->getHeaderLine('Idempotency-Status'));
        $this->assertEquals($largebody, (string) $response->getBody());

        // A headers-only record is retained, flagged as oversized, rather than discarded.
        $record = $DB->get_record('api_idempotency_keys', []);
        $this->assertNotFalse($record);
        $this->assertEquals(\core\api\repository\idempotency_key_repository::STATE_OVERSIZED, $record->state);
        $this->assertNull($record->response);

        // Any later request reusing the same key is rejected, since there is no captured body to replay.
        $this->expectException(\core\exception\api\idempotency\response_too_large_exception::class);
        $middleware->process($request, $this->get_counting_handler(0));
    }

    public function test_oversized_response_threshold_is_configurable(): void {
        global $DB;

        $this->resetAfterTest();

        // Lower the configured limit so that even a small response is considered oversized.
        set_config('apiidempotencymaxresponsebytes', 10);

        $middleware = \core\di::get(idempotency_key_middleware::class);

        $handler = $this->getMockBuilder(RequestHandlerInterface::class)->getMock();
        $handler->expects($this->once())
            ->method('handle')
            ->willReturnCallback(function (ServerRequestInterface $request): ResponseInterface {
                $response = new \GuzzleHttp\Psr7\Response(200);
                $response->getBody()->write('this response body is larger than 10 bytes');

                return $response;
            });

        $request = (new ServerRequest('POST', '/example'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withAttribute('user', $this->get_authenticated_user());
        $response = $middleware->process($request, $handler);

        $this->assertEquals('Processing-Skipped', $response->getHeaderLine('Idempotency-Status'));
        $record = $DB->get_record('api_idempotency_keys', []);
        $this->assertNotFalse($record);
        $this->assertEquals(\core\api\repository\idempotency_key_repository::STATE_OVERSIZED, $record->state);
    }

    public function test_non_seekable_request_body_is_handled_safely(): void {
        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->getMockBuilder(RequestHandlerInterface::class)->getMock();
        $handler->expects($this->once())
            ->method('handle')
            ->willReturnCallback(function (ServerRequestInterface $request): ResponseInterface {
                // The handler must still be able to read the full body, even though the original
                // stream it was given was not seekable.
                $this->assertEquals('{"a":1}', (string) $request->getBody());

                $response = new \GuzzleHttp\Psr7\Response(200);
                $response->getBody()->write('ok');

                return $response;
            });

        $body = new \GuzzleHttp\Psr7\NoSeekStream(\GuzzleHttp\Psr7\Utils::streamFor('{"a":1}'));
        $request = (new ServerRequest('POST', '/example'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withAttribute('user', $this->get_authenticated_user())
            ->withBody($body);

        $response = $middleware->process($request, $handler);

        $this->assertEquals('ok', (string) $response->getBody());
    }

    public function test_non_seekable_response_body_is_handled_safely(): void {
        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->getMockBuilder(RequestHandlerInterface::class)->getMock();
        $handler->expects($this->once())
            ->method('handle')
            ->willReturnCallback(function (ServerRequestInterface $request): ResponseInterface {
                $body = new \GuzzleHttp\Psr7\NoSeekStream(\GuzzleHttp\Psr7\Utils::streamFor('response-body'));

                return (new \GuzzleHttp\Psr7\Response(200))->withBody($body);
            });

        $request = (new ServerRequest('POST', '/example'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withAttribute('user', $this->get_authenticated_user());
        $response = $middleware->process($request, $handler);

        // The client must still receive the full body, even though the original stream it was
        // given back was not seekable.
        $this->assertEquals('response-body', (string) $response->getBody());
    }

    public function test_same_key_with_different_payload_is_rejected(): void {
        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->get_counting_handler(1);
        $user = $this->get_authenticated_user();

        $first = (new ServerRequest('POST', '/example'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withAttribute('user', $user)
            ->withBody(\GuzzleHttp\Psr7\Utils::streamFor('{"a":1}'));
        $middleware->process($first, $handler);

        $second = (new ServerRequest('POST', '/example'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withAttribute('user', $user)
            ->withBody(\GuzzleHttp\Psr7\Utils::streamFor('{"a":2}'));

        $this->expectException(\core\exception\api\idempotency\key_mismatch_exception::class);
        $middleware->process($second, $handler);
    }

    public function test_same_key_with_different_query_string_is_rejected(): void {
        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->get_counting_handler(1);
        $user = $this->get_authenticated_user();

        $first = (new ServerRequest('POST', '/example?dryrun=1'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withAttribute('user', $user);
        $middleware->process($first, $handler);

        $second = (new ServerRequest('POST', '/example?dryrun=0'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withAttribute('user', $user);

        $this->expectException(\core\exception\api\idempotency\key_mismatch_exception::class);
        $middleware->process($second, $handler);
    }

    public function test_empty_key_is_rejected(): void {
        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->get_counting_handler(0);

        $request = (new ServerRequest('POST', '/example'))->withHeader('Idempotency-Key', '   ');

        $this->expectException(\core\exception\api\idempotency\invalid_key_exception::class);
        $middleware->process($request, $handler);
    }

    public function test_server_errors_are_not_persisted(): void {
        global $DB;

        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->get_counting_handler(2, 500);

        $request = (new ServerRequest('POST', '/example'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withAttribute('user', $this->get_authenticated_user());
        $middleware->process($request, $handler);
        $middleware->process($request, $handler);

        $this->assertEquals(0, $DB->count_records('api_idempotency_keys'));
    }

    public function test_unauthenticated_request_is_rejected(): void {
        global $DB;

        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->get_counting_handler(0);

        // No 'user' attribute is attached to the request, simulating an anonymous caller.
        $request = (new ServerRequest('POST', '/example'))->withHeader('Idempotency-Key', 'my-key');

        $this->expectException(\core\exception\api\idempotency\unauthenticated_key_exception::class);
        try {
            $middleware->process($request, $handler);
        } finally {
            $this->assertEquals(0, $DB->count_records('api_idempotency_keys'));
        }
    }

    /**
     * A request carrying the Idempotency-Key header for a route marked with the idempotency_unsupported
     * attribute is rejected outright, rather than being silently ignored or processed as idempotent.
     */
    public function test_route_marked_idempotency_unsupported_is_rejected(): void {
        global $DB;

        $this->resetAfterTest();
        self::load_fixture('core', 'router/route_with_scopes.php');

        $user = $this->get_authenticated_user();

        $app = $this->get_simple_app();
        $app->post(
            '/method/path',
            [\core\fixtures\route_with_scopes::class, 'method_with_idempotency_unsupported'],
        );
        $app->add(\core\di::get(idempotency_key_middleware::class));
        $app->addRoutingMiddleware();

        $request = (new ServerRequest('POST', '/method/path'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withAttribute('user', $user);

        $this->expectException(\core\exception\api\idempotency\idempotency_unsupported_exception::class);
        try {
            $app->handle($request);
        } finally {
            $this->assertEquals(0, $DB->count_records('api_idempotency_keys'));
        }
    }

    /**
     * A request for a route marked with the idempotency_unsupported attribute is processed normally when it
     * does not carry the Idempotency-Key header at all.
     */
    public function test_route_marked_idempotency_unsupported_without_header_is_unaffected(): void {
        $this->resetAfterTest();
        self::load_fixture('core', 'router/route_with_scopes.php');

        $user = $this->get_authenticated_user();

        $app = $this->get_simple_app();
        $app->post(
            '/method/path',
            [\core\fixtures\route_with_scopes::class, 'method_with_idempotency_unsupported'],
        );
        $app->add(\core\di::get(idempotency_key_middleware::class));
        $app->addRoutingMiddleware();

        $request = (new ServerRequest('POST', '/method/path'))
            ->withAttribute('user', $user);

        $response = $app->handle($request);
        $this->assertEquals(200, $response->getStatusCode());
    }

    /**
     * Sensitive response headers (e.g. Set-Cookie) are stripped before a response is persisted, so a replayed
     * response never exposes them, even though the original response carried one.
     */
    public function test_sensitive_response_headers_are_not_persisted(): void {
        global $DB;

        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->getMockBuilder(RequestHandlerInterface::class)->getMock();
        $handler->expects($this->once())
            ->method('handle')
            ->willReturnCallback(function (ServerRequestInterface $request): ResponseInterface {
                $response = new \GuzzleHttp\Psr7\Response(200, [
                    'Set-Cookie' => 'sessionid=secret',
                    'X-Example' => 'keep-me',
                ]);
                $response->getBody()->write('response-1');

                return $response;
            });

        $request = (new ServerRequest('POST', '/example'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withAttribute('user', $this->get_authenticated_user());
        $middleware->process($request, $handler);

        $record = $DB->get_record('api_idempotency_keys', []);
        $decoded = \core\di::get(\core\api\repository\idempotency_key_repository::class)->decode_response($record);

        $this->assertArrayNotHasKey('Set-Cookie', $decoded['headers']);
        $this->assertArrayNotHasKey('set-cookie', $decoded['headers']);
        $this->assertArrayHasKey('X-Example', $decoded['headers']);
    }

    /**
     * Two requests from the same user, for the same key/method/path/body, but made with different granted
     * scopes (i.e. different tokens), are treated as distinct requests rather than replaying each other's
     * captured response: a response captured while authorized with one scope set must never be replayed to a
     * request authorized with a different scope set, since the handler's behaviour may legitimately differ.
     */
    public function test_requests_with_different_granted_scopes_are_not_replayed(): void {
        $this->resetAfterTest();

        $middleware = \core\di::get(idempotency_key_middleware::class);
        $handler = $this->get_counting_handler(2);
        $user = $this->get_authenticated_user();

        $first = (new ServerRequest('POST', '/example'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withAttribute('user', $user)
            ->withAttribute(\core\router\scope\scopeset::GRANTED_SCOPES, ['scope:read']);
        $firstresponse = $middleware->process($first, $handler);
        $this->assertEquals('response-1', (string) $firstresponse->getBody());

        $second = (new ServerRequest('POST', '/example'))
            ->withHeader('Idempotency-Key', 'my-key')
            ->withAttribute('user', $user)
            ->withAttribute(\core\router\scope\scopeset::GRANTED_SCOPES, ['scope:read', 'scope:write']);
        $secondresponse = $middleware->process($second, $handler);

        // A different (broader) scope set means this is treated as a fresh request, not a replay.
        $this->assertEquals('response-2', (string) $secondresponse->getBody());
        $this->assertEquals('', $secondresponse->getHeaderLine('Idempotency-Replayed'));
    }
}
