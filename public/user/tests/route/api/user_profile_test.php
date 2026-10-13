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
 * Tests for the user profile and custom field API handlers.
 *
 * @package    core_user
 * @category   test
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(user_profile::class)]
#[CoversClass(user_custom_fields::class)]
#[CoversClass(\core_user\local\custom_fields::class)]
#[CoversClass(\core\router\conditional_request::class)]
final class user_profile_test extends route_testcase {
    /**
     * Send a request with a JSON body.
     *
     * @param string $method
     * @param string $path
     * @param array $body
     * @param array $headers
     * @return \Psr\Http\Message\ResponseInterface
     */
    private function send(string $method, string $path, array $body, array $headers = []): \Psr\Http\Message\ResponseInterface {
        return $this->process_api_request(
            $method,
            $path,
            headers: ['HTTP_ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json'] + $headers,
            body: Utils::streamFor(json_encode($body)),
        );
    }

    public function test_required_scopes(): void {
        $this->assert_route_required_scopes([['core_user:user:read:self'], ['core_user:user:read']], [user_profile::class, 'get_profile']);
        $this->assert_route_required_scopes([['core_user:user:update:self'], ['core_user:user:update']], [user_profile::class, 'update_profile']);
        $this->assert_route_required_scopes([['core_user:user:read:self'], ['core_user:user:read']], [user_custom_fields::class, 'get_custom_fields']);
        $this->assert_route_required_scopes(
            [['core_user:user:update:self'], ['core_user:user:update']],
            [user_custom_fields::class, 'replace_custom_fields'],
        );
        $this->assert_route_required_scopes(
            [['core_user:user:update:self'], ['core_user:user:update']],
            [user_custom_fields::class, 'update_custom_fields'],
        );
    }

    public function test_get_and_update_profile(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(user_profile::class);

        $user = $this->getDataGenerator()->create_user(['city' => 'Perth', 'country' => 'AU']);
        $this->setUser($user);

        $response = $this->process_api_request('GET', "/users/{$user->id}/profile");
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertNotEmpty($response->getHeaderLine('ETag'));
        $body = $this->decode_response($response, true);
        $this->assertEquals('Perth', $body['city']);

        $etag = $response->getHeaderLine('ETag');
        $notmodified = $this->process_api_request('GET', "/users/{$user->id}/profile", headers: ['If-None-Match' => $etag]);
        $this->assertEquals(304, $notmodified->getStatusCode());

        $response = $this->send('PATCH', "/users/{$user->id}/profile", ['city' => 'Sydney'], ['If-Match' => $etag]);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('Sydney', $this->decode_response($response, true)['city']);
        $this->assertEquals('Sydney', \core\user::get_user($user->id)->city);

        // The earlier ETag is stale.
        $response = $this->send('PATCH', "/users/{$user->id}/profile", ['city' => 'Hobart'], ['If-Match' => $etag]);
        $this->assertEquals(412, $response->getStatusCode());
    }

    public function test_update_profile_invalid(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(user_profile::class);

        $user = $this->getDataGenerator()->create_user();
        $this->setUser($user);

        foreach ([[], ['country' => 'ZZ'], ['unknown' => 'x']] as $body) {
            $response = $this->send('PATCH', "/users/{$user->id}/profile", $body);
            $this->assertEquals(400, $response->getStatusCode(), json_encode($body));
        }
    }

    public function test_profile_of_other_user(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(user_profile::class);

        $user = $this->getDataGenerator()->create_user();
        $other = $this->getDataGenerator()->create_user();
        $this->setUser($user);

        // Not visible: no shared course.
        $response = $this->process_api_request('GET', "/users/{$other->id}/profile");
        $this->assertEquals(404, $response->getStatusCode());

        $this->setAdminUser();
        $response = $this->send('PATCH', "/users/{$other->id}/profile", ['city' => 'Rome']);
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function test_custom_fields(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(user_custom_fields::class);

        $generator = $this->getDataGenerator();
        $generator->create_custom_profile_field(['datatype' => 'text', 'shortname' => 'alpha', 'name' => 'Alpha']);
        $generator->create_custom_profile_field(['datatype' => 'text', 'shortname' => 'beta', 'name' => 'Beta']);
        $user = $generator->create_user();
        $this->setUser($user);

        $response = $this->process_api_request('GET', "/users/{$user->id}/custom-fields");
        $this->assertEquals(200, $response->getStatusCode());
        $etag = $response->getHeaderLine('ETag');

        $response = $this->send('PATCH', "/users/{$user->id}/custom-fields", ['fields' => ['alpha' => 'one', 'beta' => 'two']]);
        $this->assertEquals(200, $response->getStatusCode());
        $fields = $this->decode_response($response, true)['fields'];
        $this->assertEquals('one', $fields['alpha']);
        $this->assertEquals('two', $fields['beta']);

        $response = $this->send('PATCH', "/users/{$user->id}/custom-fields", ['fields' => ['alpha' => 'uno']]);
        $fields = $this->decode_response($response, true)['fields'];
        $this->assertEquals('uno', $fields['alpha']);
        $this->assertEquals('two', $fields['beta']);

        // PUT clears anything not supplied.
        $response = $this->send('PUT', "/users/{$user->id}/custom-fields", ['fields' => ['alpha' => 'solo']]);
        $this->assertEquals(200, $response->getStatusCode());
        $fields = $this->decode_response($response, true)['fields'];
        $this->assertEquals('solo', $fields['alpha']);
        $this->assertEmpty($fields['beta'] ?? '');

        $response = $this->send('PATCH', "/users/{$user->id}/custom-fields", ['fields' => ['alpha' => 'x']], ['If-Match' => $etag]);
        $this->assertEquals(412, $response->getStatusCode());
    }

    public function test_custom_fields_unknown_field(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(user_custom_fields::class);

        $user = $this->getDataGenerator()->create_user();
        $this->setUser($user);

        $response = $this->send('PATCH', "/users/{$user->id}/custom-fields", ['fields' => ['nope' => 'x']]);
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function test_fields_locked_by_auth_plugin(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);
        $this->add_class_routes_to_route_loader(user_profile::class);
        $this->add_class_routes_to_route_loader(user_custom_fields::class);

        $generator = $this->getDataGenerator();
        $generator->create_custom_profile_field(['datatype' => 'text', 'shortname' => 'ext', 'name' => 'External']);
        $generator->create_custom_profile_field(['datatype' => 'text', 'shortname' => 'other', 'name' => 'Other']);
        set_config('field_lock_firstname', 'locked', 'auth_ldap');
        set_config('field_lock_lastname', 'unlockedifempty', 'auth_ldap');
        set_config('field_lock_city', 'unlockedifempty', 'auth_ldap');
        set_config('field_lock_profile_field_ext', 'locked', 'auth_ldap');

        $user = $generator->create_user(['auth' => 'ldap', 'firstname' => 'Ada', 'lastname' => 'Lovelace', 'city' => '']);
        $this->setUser($user);

        // A locked field cannot be changed, even by an administrator.
        foreach ([$user, get_admin()] as $actor) {
            $this->setUser($actor);
            $response = $this->send('PATCH', "/users/{$user->id}", ['firstName' => 'Grace']);
            $this->assertEquals(403, $response->getStatusCode());
        }
        $this->assertEquals('Ada', \core\user::get_user($user->id)->firstname);

        // Resubmitting the current value is accepted, as are unlocked fields.
        $this->setUser($user);
        $response = $this->send('PATCH', "/users/{$user->id}", ['firstName' => 'Ada', 'timeZone' => 'Australia/Perth']);
        $this->assertEquals(200, $response->getStatusCode());

        // A field which is only locked while it has a value.
        $response = $this->send('PATCH', "/users/{$user->id}", ['lastName' => 'Byron']);
        $this->assertEquals(403, $response->getStatusCode());
        $response = $this->send('PATCH', "/users/{$user->id}/profile", ['city' => 'Perth']);
        $this->assertEquals(200, $response->getStatusCode());
        $response = $this->send('PATCH', "/users/{$user->id}/profile", ['city' => 'Sydney']);
        $this->assertEquals(403, $response->getStatusCode());

        // Custom fields.
        $response = $this->send('PATCH', "/users/{$user->id}/custom-fields", ['fields' => ['ext' => 'x']]);
        $this->assertEquals(403, $response->getStatusCode());
        $response = $this->send('PATCH', "/users/{$user->id}/custom-fields", ['fields' => ['other' => 'y']]);
        $this->assertEquals(200, $response->getStatusCode());

        // A replacement which omits the externally managed field leaves it alone.
        $response = $this->send('PUT', "/users/{$user->id}/custom-fields", ['fields' => ['other' => 'z']]);
        $this->assertEquals(200, $response->getStatusCode());

        // Users of other authentication plugins are unaffected.
        $manual = $generator->create_user(['firstname' => 'Ada']);
        $this->setUser($manual);
        $response = $this->send('PATCH', "/users/{$manual->id}", ['firstName' => 'Grace']);
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function test_custom_fields_locked_field(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(user_custom_fields::class);

        $generator = $this->getDataGenerator();
        $generator->create_custom_profile_field(
            ['datatype' => 'text', 'shortname' => 'locked', 'name' => 'Locked', 'locked' => 1],
        );
        $user = $generator->create_user();
        $this->setUser($user);

        $response = $this->send('PATCH', "/users/{$user->id}/custom-fields", ['fields' => ['locked' => 'x']]);
        $this->assertEquals(403, $response->getStatusCode());

        $this->setAdminUser();
        $response = $this->send('PATCH', "/users/{$user->id}/custom-fields", ['fields' => ['locked' => 'x']]);
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function test_capabilities_required_to_edit(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(user_profile::class);
        $this->add_class_routes_to_route_loader(user_custom_fields::class);
        $this->add_class_routes_to_route_loader(users::class);

        $generator = $this->getDataGenerator();
        $generator->create_custom_profile_field(['datatype' => 'text', 'shortname' => 'alpha', 'name' => 'Alpha']);
        $user = $generator->create_user();
        $this->setUser($user);

        $archetyperoles = \get_archetype_roles('user');
        $userrole = reset($archetyperoles)->id;
        assign_capability('moodle/user:editownprofile', CAP_PROHIBIT, $userrole, \core\context\system::instance()->id, true);

        foreach ([
            ['PATCH', "/users/{$user->id}", ['firstName' => 'New']],
            ['PATCH', "/users/{$user->id}/profile", ['city' => 'New']],
            ['PATCH', "/users/{$user->id}/custom-fields", ['fields' => ['alpha' => 'x']]],
            ['PUT', "/users/{$user->id}/custom-fields", ['fields' => ['alpha' => 'x']]],
        ] as [$method, $path, $body]) {
            $response = $this->send($method, $path, $body);
            $this->assertEquals(403, $response->getStatusCode(), "{$method} {$path}");
        }

        // Reading is unaffected.
        $this->assertEquals(200, $this->process_api_request('GET', "/users/{$user->id}/profile")->getStatusCode());
    }

    public function test_editprofile_capability_for_other_user(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(user_profile::class);

        $generator = $this->getDataGenerator();
        $manager = $generator->create_user();
        $target = $generator->create_user();
        $course = $generator->create_course();
        $generator->enrol_user($manager->id, $course->id, 'editingteacher');
        $generator->enrol_user($target->id, $course->id, 'student');
        $this->setUser($manager);

        // Visible through the shared course, but there is no moodle/user:editprofile in the user context.
        $response = $this->send('PATCH', "/users/{$target->id}/profile", ['city' => 'Rome']);
        $this->assertEquals(403, $response->getStatusCode());

        $roleid = $generator->create_role();
        assign_capability('moodle/user:editprofile', CAP_ALLOW, $roleid, \core\context\system::instance()->id, true);
        $generator->role_assign($roleid, $manager->id, \core\context\system::instance()->id);
        accesslib_clear_all_caches_for_unit_testing();

        $response = $this->send('PATCH', "/users/{$target->id}/profile", ['city' => 'Rome']);
        $this->assertEquals(200, $response->getStatusCode());
    }
}
