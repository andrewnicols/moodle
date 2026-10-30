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
use PHPUnit\Framework\Attributes\CoversClass;

/**
 * Tests for the user collection API handler.
 *
 * @package    core_user
 * @category   test
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(users::class)]
#[CoversClass(\core_user\local\visible_user_finder::class)]
#[CoversClass(\core_user\local\user_representation::class)]
#[CoversClass(\core_user\route\responses\user_collection_response::class)]
#[CoversClass(\core_user\route\responses\user_response::class)]
final class users_test extends route_testcase {
    public function test_user_response_documents_etag(): void {
        $spec = new \core\router\schema\specification();
        $response = new \core_user\route\responses\user_response();
        $header = new \core\router\schema\parameters\etag();
        $description = $response->get_openapi_description($spec);

        $this->assertSame($header->get_reference(), $description->headers['ETag']->{'$ref'});
        $this->assertTrue($spec->is_reference_defined($header->get_reference()));
    }

    public function test_user_picture_without_page_context(): void {
        global $PAGE;

        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);
        $user = $this->getDataGenerator()->create_user();
        $this->setAdminUser();

        foreach (['/users', "/users/{$user->id}"] as $path) {
            $PAGE = new class extends \moodle_page {
                protected function magic_get_context() {
                    // CLI normally masks the missing context which produces a diagnostic in web requests.
                    if ($this->_context === null) {
                        throw new \core\exception\coding_exception('$PAGE->context was not set.');
                    }
                    return parent::magic_get_context();
                }
            };
            $response = $this->process_api_request('GET', $path);
            $this->assert_valid_response($response);
            $this->assertDebuggingNotCalled();
        }
    }

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
            array_keys(\core_user\local\visible_user_finder::SORT_COLUMNS),
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
        $this->assertNull($payload['pagination']['totalItems']);
        $this->assertFalse($payload['pagination']['hasMore']);

        $item = $payload['items'][array_search((int) $user->id, $ids)];
        $this->assertEquals('alice', $item['username']);
        $this->assertFalse($item['deleted']);
        $this->assertEquals('Alice Anderson', $item['fullName']);
        $this->assertEquals('Alice', $item['firstName']);
        $this->assertEquals('alice@example.com', $item['email']);
        $this->assertNotEmpty($item['profileImageUrl']);
        $this->assertArrayNotHasKey('firstAccess', $item);
        $this->assertArrayNotHasKey('lastAccess', $item);
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
        $this->assertNull($payload['pagination']['totalItems']);
        $this->assertTrue($payload['pagination']['hasMore']);
        $this->assertEquals(['Anna', 'Bella', 'Cara'], array_column($payload['items'], 'firstName'));

        $response = $this->process_api_request('GET', '/users?search=Zed&sort=-firstname&pagesize=3&page=2');
        $payload = $this->decode_response($response, true);
        $this->assertEquals(['Anna'], array_column($payload['items'], 'firstName'));
        $this->assertFalse($payload['pagination']['hasMore']);

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
        $this->assertNull($payload['pagination']['totalItems']);
        $this->assertFalse($payload['pagination']['hasMore']);
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
            $this->assertSame('ID1', $payload['idnumber']);
            $this->assertFalse($payload['deleted']);
            $this->assertNotEmpty($response->getHeaderLine('ETag'));
        }
    }

    public function test_get_user_timezone_is_an_iana_name(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);
        set_config('timezone', 'Europe/London');
        $this->setAdminUser();

        $expected = [
            'Australia/Perth' => 'Australia/Perth',
            // The server default.
            '99' => 'Europe/London',
            // A legacy numeric offset.
            '8.0' => 'Etc/GMT-8',
        ];
        $preferences = ['Australia/Perth' => 'Australia/Perth', '99' => null, '8.0' => 'Etc/GMT-8'];
        foreach ($expected as $stored => $name) {
            $user = $this->getDataGenerator()->create_user(['timezone' => (string) $stored]);
            $response = $this->process_api_request('GET', "/users/{$user->id}");
            $this->assert_valid_response($response);
            $payload = $this->decode_response($response, true);
            $this->assertSame($name, $payload['timeZone'], "Stored {$stored}");
            $this->assertSame($preferences[$stored], $payload['timeZonePreference'], "Stored {$stored}");
        }
    }

    public function test_get_user_name_fields_and_image_alt(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);

        $user = $this->getDataGenerator()->create_user([
            'firstnamephonetic' => 'Ah-liss',
            'lastnamephonetic' => 'An-der-son',
            'middlename' => 'Maria',
            'alternatename' => 'Ally',
            'imagealt' => 'Alice smiling',
        ]);
        $this->setAdminUser();

        $payload = $this->decode_response($this->process_api_request('GET', "/users/{$user->id}"), true);
        $this->assertSame('Ah-liss', $payload['firstNamePhonetic']);
        $this->assertSame('An-der-son', $payload['lastNamePhonetic']);
        $this->assertSame('Maria', $payload['middleName']);
        $this->assertSame('Ally', $payload['alternateName']);
        $this->assertSame('Alice smiling', $payload['profileImageAlt']);
    }

    public function test_user_account_fields_visibility(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(users::class);

        $generator = $this->getDataGenerator();
        $course = $generator->create_course();
        $teacher = $generator->create_and_enrol($course, 'editingteacher');
        $student = $generator->create_and_enrol($course, 'student', ['lang' => 'en', 'idnumber' => 'STUDENT1']);

        foreach ([$student, get_admin()] as $viewer) {
            $this->setUser($viewer);
            $response = $this->process_api_request('GET', "/users/{$student->id}");
            $this->assert_valid_response($response);
            $payload = $this->decode_response($response, true);
            $this->assertSame('en', $payload['lang']);
            $this->assertSame('STUDENT1', $payload['idnumber']);
            $this->assertTrue($payload['confirmed']);
            $this->assertSame($student->auth, $payload['auth']);
        }

        $this->setUser($teacher);
        $response = $this->process_api_request('GET', '/users');
        $this->assert_valid_response($response);
        $items = array_column($this->decode_response($response, true)['items'], null, 'id');
        $this->assertNull($items[$student->id]['lang']);
        $this->assertNull($items[$student->id]['idnumber']);
        $this->assertNull($items[$student->id]['confirmed']);
        $this->assertNull($items[$student->id]['auth']);

        $this->setAdminUser();
        $unconfirmed = $generator->create_user(['confirmed' => 0]);
        $response = $this->process_api_request('GET', "/users/{$unconfirmed->id}");
        $this->assert_valid_response($response);
        $this->assertFalse($this->decode_response($response, true)['confirmed']);
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
}
