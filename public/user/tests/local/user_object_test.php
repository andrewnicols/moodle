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

namespace core_user\local;

use core\model\representation;
use core\router\schema\specification;
use PHPUnit\Framework\Attributes\CoversClass;

/**
 * Tests for the visibility-filtered exposed user view.
 *
 * @package    core_user
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(user_object::class)]
#[CoversClass(\core_user\route\schema\user_object::class)]
final class user_object_test extends \advanced_testcase {
    /**
     * Hidden source fields stay hidden and cannot override the authorised full name.
     */
    public function test_filtered_fields_and_schema_match(): void {
        $object = new user_object([
            'id' => '12',
            'fullname' => 'Visible name',
            'deleted' => false,
            'password' => 'not exported',
            'timeZone' => 'not trusted',
        ]);
        $data = $object->to_array();
        $this->assertSame(12, $data['id']);
        $this->assertSame('Visible name', $data['fullName']);
        $this->assertNull($data['firstName']);
        $this->assertNull($data['email']);
        $this->assertNull($data['timeZone']);
        $this->assertNull($data['timeZonePreference']);
        $this->assertArrayNotHasKey('password', $data);
        $this->assertArrayNotHasKey('timezone', $data);
        $object->firstname = 'Changed';
        $this->assertSame('Visible name', $object->fullname);
        $data['firstName'] = 'Changed';
        $schema = (new \core_user\route\schema\user_object())->get_openapi_description(new specification());
        $this->assertSame(array_keys($data), array_keys((array) $schema->properties));
        $this->assertSame(array_keys($data), $schema->required);
        $this->assertTrue($schema->properties->fullName->readOnly);
        $this->assertSame(['string', 'null'], $schema->properties->email->type);
        $this->assertSame($data, representation::to_array($object));
    }

    /**
     * Derived timezone values follow settings without retaining cached results.
     */
    public function test_timezone_views_follow_settings(): void {
        global $CFG;
        $this->resetAfterTest();
        $CFG->forcetimezone = '99';
        $CFG->timezone = 'Australia/Perth';
        $details = ['id' => 12, 'fullname' => 'Visible name', 'deleted' => false];
        $object = new user_object($details + ['timezone' => '99']);
        $this->assertSame('Australia/Perth', $object->effectivetimezone);
        $this->assertNull($object->timezonepreference);
        $CFG->timezone = 'Europe/London';
        $this->assertSame('Europe/London', $object->effectivetimezone);
        $explicit = new user_object($details + ['timezone' => 'Australia/Perth']);
        $this->assertSame('Australia/Perth', $explicit->effectivetimezone);
        $this->assertSame('Australia/Perth', $explicit->timezonepreference);
        $legacy = new user_object($details + ['timezone' => '8']);
        $this->assertSame(\core_date::normalise_timezone('8'), $legacy->timezonepreference);
        $this->assertSame(\core_date::get_user_timezone((object) ['timezone' => '8']), $legacy->effectivetimezone);
    }
}
