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

namespace core_user\route\api;

use core\exception\insufficient_scope_exception;
use core\router\scope\scopeset;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;

/**
 * Tests for the self and any-user scopes of the user handlers.
 *
 * The handlers are called directly because the route test harness does not run the authentication middleware
 * which sets the granted scopes.
 *
 * @package    core_user
 * @category   test
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(\core_user\local\user_scope_check_trait::class)]
final class user_scope_test extends \advanced_testcase {
    /**
     * Run a handler with the given granted scopes.
     *
     * @param string $handler The handler class
     * @param string $method The handler method
     * @param string[]|null $scopes The granted scopes, or null for a session without scopes
     * @param \stdClass $target
     * @param array $body
     */
    private function call(string $handler, string $method, ?array $scopes, \stdClass $target, array $body = []): void {
        $request = new ServerRequest('GET', '/');
        if ($scopes !== null) {
            $request = $request->withAttribute(scopeset::GRANTED_SCOPES, $scopes);
        }
        $request = $request->withParsedBody($body);

        (new $handler())->{$method}(new Response(), $request, $target);
    }

    public static function handlers_provider(): array {
        return [
            'user read' => [users::class, 'get_user', 'read', []],
            'user update' => [users::class, 'update_user', 'update', ['firstName' => 'Changed']],
            'profile read' => [user_profile::class, 'get_profile', 'read', []],
            'profile update' => [user_profile::class, 'update_profile', 'update', ['city' => 'Rome']],
            'custom fields read' => [user_custom_fields::class, 'get_custom_fields', 'read', []],
            'custom fields update' => [user_custom_fields::class, 'update_custom_fields', 'update', ['fields' => []]],
        ];
    }

    #[DataProvider('handlers_provider')]
    public function test_self_scope_is_limited_to_self(string $handler, string $method, string $type, array $body): void {
        $this->resetAfterTest();
        $user = $this->getDataGenerator()->create_user();
        $other = $this->getDataGenerator()->create_user();
        $this->setAdminUser();
        global $USER;
        $admin = clone $USER;

        $selfscope = ["core_user:user:{$type}:self"];

        // Acting as the admin, a self-only token is rejected for another user.
        try {
            $this->call($handler, $method, $selfscope, $user, $body);
            $this->fail('Expected an insufficient scope exception');
        } catch (insufficient_scope_exception) {
            $this->assertTrue(true);
        }

        // But is accepted for the user themselves.
        $this->setUser($user);
        try {
            $this->call($handler, $method, $selfscope, $user, $body);
        } catch (insufficient_scope_exception $e) {
            $this->fail('A self scope must allow acting on yourself: ' . $e->getMessage());
        } catch (\Throwable) {
            // Other failures (such as permissions on the data) are not what this test is about.
        }

        // A token with neither scope is rejected, even for the user themselves.
        try {
            $this->call($handler, $method, ['core_user:user:create'], $user, $body);
            $this->fail('Expected an insufficient scope exception');
        } catch (insufficient_scope_exception) {
            $this->assertTrue(true);
        }

        // The unrestricted scope is accepted for other users, and so is a session without scopes.
        $this->setUser($admin);
        foreach ([["core_user:user:{$type}"], null] as $scopes) {
            try {
                $this->call($handler, $method, $scopes, $other, $body);
            } catch (insufficient_scope_exception $e) {
                $this->fail('Unexpected scope failure: ' . $e->getMessage());
            } catch (\Throwable) {
                // Not relevant here.
            }
        }
    }

    public function test_list_is_limited_to_self_with_self_scope(): void {
        $this->resetAfterTest();
        $user = $this->getDataGenerator()->create_user(['lastname' => 'Zzlist']);
        $this->getDataGenerator()->create_user(['lastname' => 'Zzlist']);
        $this->setAdminUser();
        $this->setUser($user);

        $ids = fn (?array $scopes, string $query = ''): array => array_column(
            $this->list_users($scopes, $query),
            'id',
        );

        $this->assertEquals([(int) $user->id], $ids(['core_user:user:read:self']));
        $this->assertEquals([(int) $user->id], $ids(['core_user:user:read:self'], 'Zzlist'));
        $this->assertEquals([], $ids(['core_user:user:read:self'], 'nomatchatall'));

        // The unrestricted scope, and a session without scopes, are limited only by what the user may see.
        $this->setAdminUser();
        $this->assertGreaterThan(1, count($ids(['core_user:user:read'])));
        $this->assertGreaterThan(1, count($ids(null)));

        $this->expectException(insufficient_scope_exception::class);
        $ids(['core_user:user:create']);
    }

    /**
     * Call the list handler with the given granted scopes and return the items.
     *
     * @param string[]|null $scopes
     * @param string $search
     * @return array
     */
    private function list_users(?array $scopes, string $search): array {
        $request = (new ServerRequest('GET', '/users'))->withQueryParams(['search' => $search, 'pagesize' => 100]);
        if ($scopes !== null) {
            $request = $request->withAttribute(scopeset::GRANTED_SCOPES, $scopes);
        }

        $response = (new users())->list_users(new Response(), $request);
        return $response->payload['items'];
    }
}
