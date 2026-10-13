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

use core\tests\router\route_testcase;
use GuzzleHttp\Psr7\Utils;
use PHPUnit\Framework\Attributes\CoversClass;

/**
 * Tests for the user collection API handler.
 *
 * @package    core_user
 * @category   test
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(users::class)]
#[CoversClass(\core_user\local\visible_users::class)]
#[CoversClass(\core_user\local\user_representation::class)]
#[CoversClass(\core_user\route\responses\user_collection_response::class)]
#[CoversClass(\core_user\route\responses\user_response::class)]
#[CoversClass(\core_user\local\user_updater::class)]
final class users_test extends route_testcase {
    public function test_required_scopes(): void {
        $this->assert_route_required_scopes(
            [['core_user:user:read:self'], ['core_user:user:read']],
            [users::class, 'list_users'],
        );
    }

    public function test_sortable_fields_match_query(): void {
        $route = \core\router\route::from_reflection(
            new \ReflectionClass(users::class),
            new \ReflectionMethod(users::class, 'list_users'),
        );

        $this->assertEquals(
            array_keys(\core_user\local\visible_users::SORT_COLUMNS),
            $route->collection->sortable,
        );
    }

    public function test_list_requires_login(): void {
        $route = (new \ReflectionClass(users::class))
            ->getAttributes(\core\router\route::class)[0]->newInstance();

        $this->assertTrue($route->requirelogin->should_require_login());
    }

    public function test_list_as_admin(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);

        $user = $this->getDataGenerator()->create_user([
            'username' => 'alice',
            'firstname' => 'Alice',
            'lastname' => 'Anderson',
            'email' => 'alice@example.com',
        ]);
        $deleted = $this->getDataGenerator()->create_user(['deleted' => 1]);
        $this->setAdminUser();

        $response = $this->process_api_request('GET', '/users?pagesize=100');
        $this->assert_valid_response($response);
        $payload = $this->decode_response($response, true);

        $this->assertEquals(1, $payload['pagination']['page']);
        $this->assertEquals(100, $payload['pagination']['pageSize']);

        $ids = array_column($payload['items'], 'id');
        $this->assertContains((int) $user->id, $ids);
        $this->assertNotContains((int) $deleted->id, $ids);
        $this->assertNotContains((int) guest_user()->id, $ids);
        $this->assertEquals(count($ids), $payload['pagination']['totalItems']);

        $item = $payload['items'][array_search((int) $user->id, $ids)];
        $this->assertEquals('alice', $item['username']);
        $this->assertEquals('Alice Anderson', $item['fullName']);
        $this->assertEquals('Alice', $item['firstName']);
        $this->assertEquals('alice@example.com', $item['email']);
        $this->assertNotEmpty($item['profileImageUrl']);
        $this->assertNull($item['lastAccess']);
    }

    public function test_default_order_is_by_name_not_id(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);

        $generator = $this->getDataGenerator();
        // Created in the opposite order to their names.
        $c = $generator->create_user(['firstname' => 'Cara', 'lastname' => 'Zzorder']);
        $b = $generator->create_user(['firstname' => 'Bea', 'lastname' => 'Zzorder']);
        $a = $generator->create_user(['firstname' => 'Ann', 'lastname' => 'Zzorder']);
        $this->setAdminUser();

        $response = $this->process_api_request('GET', '/users?search=Zzorder');
        $this->assertEquals(
            [(int) $a->id, (int) $b->id, (int) $c->id],
            array_column($this->decode_response($response, true)['items'], 'id'),
        );

        $response = $this->process_api_request('GET', '/users?search=Zzorder&sort=-firstname');
        $this->assertEquals(
            [(int) $c->id, (int) $b->id, (int) $a->id],
            array_column($this->decode_response($response, true)['items'], 'id'),
        );

        // The id is not offered as a sort field.
        $this->assertEquals(400, $this->process_api_request('GET', '/users?sort=id')->getStatusCode());
    }

    public function test_pagination_and_sort(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);

        foreach (['Cara', 'Anna', 'Bella', 'Dina'] as $name) {
            $this->getDataGenerator()->create_user(['firstname' => $name, 'lastname' => 'Zed']);
        }
        $this->setAdminUser();

        $response = $this->process_api_request('GET', '/users?search=Zed&sort=firstname&pagesize=3');
        $this->assert_valid_response($response);
        $payload = $this->decode_response($response, true);
        $this->assertEquals(4, $payload['pagination']['totalItems']);
        $this->assertEquals(['Anna', 'Bella', 'Cara'], array_column($payload['items'], 'firstName'));

        $response = $this->process_api_request('GET', '/users?search=Zed&sort=-firstname&pagesize=3&page=2');
        $payload = $this->decode_response($response, true);
        $this->assertEquals(['Anna'], array_column($payload['items'], 'firstName'));

        // Out of range pages are empty.
        $response = $this->process_api_request('GET', '/users?search=Zed&page=5');
        $this->assert_valid_response($response);
        $this->assertEmpty($this->decode_response($response, true)['items']);
    }

    public function test_invalid_pagination(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);
        $this->setAdminUser();

        foreach (['page=0', 'pagesize=101', 'sort=password', 'sort=email'] as $query) {
            $response = $this->process_api_request('GET', "/users?{$query}");
            $this->assertEquals(400, $response->getStatusCode(), $query);
        }
    }

    public function test_user_without_capability_only_sees_themselves(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);

        $this->getDataGenerator()->create_user();
        $user = $this->getDataGenerator()->create_user();
        $this->setUser($user);

        $this->assertFalse(has_capability('moodle/user:viewdetails', \context_system::instance()));

        $response = $this->process_api_request('GET', '/users');
        $this->assert_valid_response($response);
        $payload = $this->decode_response($response, true);

        $this->assertEquals([(int) $user->id], array_column($payload['items'], 'id'));
        $this->assertEquals(1, $payload['pagination']['totalItems']);
    }

    public function test_user_sees_users_in_shared_courses_only(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);

        $generator = $this->getDataGenerator();
        $course = $generator->create_course();
        $teacher = $generator->create_and_enrol($course, 'editingteacher');
        $student = $generator->create_and_enrol($course, 'student');
        $outsider = $generator->create_user();

        $this->setUser($teacher);
        // Teachers can view details of users within their courses, but not site-wide by default.
        $systemcontext = \context_system::instance();
        $this->assertFalse(has_capability('moodle/user:viewdetails', $systemcontext));

        $response = $this->process_api_request('GET', '/users');
        $this->assert_valid_response($response);
        $ids = array_column($this->decode_response($response, true)['items'], 'id');

        $this->assertContains((int) $teacher->id, $ids);
        $this->assertContains((int) $student->id, $ids);
        $this->assertNotContains((int) $outsider->id, $ids);
    }

    public function test_get_user_required_scopes(): void {
        $this->assert_route_required_scopes(
            [['core_user:user:read:self'], ['core_user:user:read']],
            [users::class, 'get_user'],
        );
    }

    public function test_get_user(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);

        $user = $this->getDataGenerator()->create_user(['username' => 'alice', 'idnumber' => 'ID1']);
        $this->setAdminUser();

        foreach (["/users/{$user->id}", '/users/username:alice', '/users/idnumber:ID1'] as $path) {
            $response = $this->process_api_request('GET', $path);
            $this->assert_valid_response($response);
            $payload = $this->decode_response($response, true);
            $this->assertEquals((int) $user->id, $payload['id'], $path);
            $this->assertEquals('alice', $payload['username']);
            $this->assertNotEmpty($response->getHeaderLine('ETag'));
        }
    }

    public function test_get_user_etag(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);

        $user = $this->getDataGenerator()->create_user();
        $this->setAdminUser();

        $response = $this->process_api_request('GET', "/users/{$user->id}");
        $etag = $response->getHeaderLine('ETag');

        $response = $this->process_api_request('GET', "/users/{$user->id}", headers: ['If-None-Match' => $etag]);
        $this->assertEquals(304, $response->getStatusCode());

        $response = $this->process_api_request('GET', "/users/{$user->id}", headers: ['If-None-Match' => '"other"']);
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function test_get_user_not_visible(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);

        $other = $this->getDataGenerator()->create_user();
        $this->setUser($this->getDataGenerator()->create_user());

        $response = $this->process_api_request('GET', "/users/{$other->id}");
        $this->assertEquals(404, $response->getStatusCode());

        $response = $this->process_api_request('GET', '/users/current');
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function test_get_user_unknown(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);
        $this->setAdminUser();

        $response = $this->process_api_request('GET', '/users/99999999');
        $this->assertEquals(404, $response->getStatusCode());
    }

    /**
     * Send a PATCH request.
     *
     * @param string $path
     * @param array $body
     * @param array $headers
     * @return \Psr\Http\Message\ResponseInterface
     */
    private function patch(string $path, array $body, array $headers = []): \Psr\Http\Message\ResponseInterface {
        return $this->process_api_request(
            'PATCH',
            $path,
            headers: ['HTTP_ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json'] + $headers,
            body: Utils::streamFor(json_encode($body)),
        );
    }

    public function test_update_user_required_scopes(): void {
        $this->assert_route_required_scopes(
            [['core_user:user:update:self'], ['core_user:user:update']],
            [users::class, 'update_user'],
        );
    }

    public function test_update_user_as_admin(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);

        $user = $this->getDataGenerator()->create_user(['firstname' => 'Old', 'email' => 'old@example.com']);
        $this->setAdminUser();

        $response = $this->patch("/users/{$user->id}", [
            'firstName' => 'New',
            'email' => 'new@example.com',
            'timeZone' => 'Australia/Perth',
            'suspended' => true,
        ]);
        $this->assert_valid_response($response);
        $payload = $this->decode_response($response, true);

        $this->assertEquals('New', $payload['firstName']);
        $this->assertEquals('new@example.com', $payload['email']);
        $this->assertTrue((bool) $payload['suspended']);
        $this->assertNotEmpty($response->getHeaderLine('ETag'));

        $record = \core\user::get_user($user->id);
        $this->assertEquals('New', $record->firstname);
        $this->assertEquals('Australia/Perth', $record->timezone);
        $this->assertEquals(1, $record->suspended);
    }

    public function test_update_self_profile_fields_only(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);

        $user = $this->getDataGenerator()->create_user();
        $this->setUser($user);

        $response = $this->patch('/users/current', ['lastName' => 'Renamed']);
        $this->assert_valid_response($response);
        $this->assertEquals('Renamed', \core\user::get_user($user->id)->lastname);

        // Email requires moodle/user:update.
        $response = $this->patch('/users/current', ['email' => 'x@example.com']);
        $this->assertEquals(403, $response->getStatusCode());
    }

    public function test_update_other_user_forbidden(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);

        $generator = $this->getDataGenerator();
        $course = $generator->create_course();
        $teacher = $generator->create_and_enrol($course, 'editingteacher');
        $student = $generator->create_and_enrol($course, 'student');
        $this->setUser($teacher);

        // Visible but not updatable.
        $response = $this->patch("/users/{$student->id}", ['firstName' => 'Nope']);
        $this->assertEquals(403, $response->getStatusCode());

        // Not visible.
        $outsider = $generator->create_user();
        $response = $this->patch("/users/{$outsider->id}", ['firstName' => 'Nope']);
        $this->assertEquals(404, $response->getStatusCode());
    }

    public function test_update_invalid_requests(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);

        $user = $this->getDataGenerator()->create_user();
        $other = $this->getDataGenerator()->create_user(['email' => 'taken@example.com']);
        $this->setAdminUser();

        foreach ([
            [],
            ['username' => 'changed'],
            ['firstName' => ' '],
            ['email' => 'not-an-email'],
            ['email' => 'taken@example.com'],
            ['timeZone' => 'Not/AZone'],
        ] as $body) {
            $response = $this->patch("/users/{$user->id}", $body);
            $this->assertEquals(400, $response->getStatusCode(), json_encode($body));
        }
    }

    public function test_update_if_match(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);

        $user = $this->getDataGenerator()->create_user(['firstname' => 'Before']);
        $this->setAdminUser();

        $etag = $this->process_api_request('GET', "/users/{$user->id}")->getHeaderLine('ETag');

        $response = $this->patch("/users/{$user->id}", ['firstName' => 'During'], ['If-Match' => $etag]);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertNotEquals($etag, $response->getHeaderLine('ETag'));

        // The original ETag is now stale.
        $response = $this->patch("/users/{$user->id}", ['firstName' => 'After'], ['If-Match' => $etag]);
        $this->assertEquals(412, $response->getStatusCode());
        $this->assertEquals('During', \core\user::get_user($user->id)->firstname);

        // Without If-Match the update is applied.
        $response = $this->patch("/users/{$user->id}", ['firstName' => 'After']);
        $this->assertEquals(200, $response->getStatusCode());
    }
}
