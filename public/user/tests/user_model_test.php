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

namespace core_user;

use core\model\manager;
use core\model\representation;
use core\router\schema\objects\representation_schema;
use core\router\schema\specification;
use PHPUnit\Framework\Attributes\CoversClass;

/**
 * Tests for read-only model-backed user projections.
 *
 * @package    core_user
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(user_model::class)]
final class user_model_test extends \advanced_testcase {
    /**
     * Hydrate a real user, export only mapped columns and describe exposed getters.
     */
    public function test_hydration_and_exposure(): void {
        $this->resetAfterTest();
        $this->setAdminUser();
        $user = $this->getDataGenerator()->create_user(['firstname' => 'Alice', 'lastname' => 'Example']);
        $model = (new user_model())->from_record($user);
        $this->assertInstanceOf(\core\model::class, $model);
        $this->assertTrue($model->validate());
        $record = $model->to_record();
        foreach ($record as $name => $value) {
            $this->assertEquals($user->{$name}, $value, $name);
        }
        foreach (['fullname', 'effectivetimezone', 'timezonepreference', 'password', 'usermodified'] as $name) {
            $this->assertFalse(property_exists($record, $name), $name);
        }
        $payload = representation::to_array($model);
        $this->assertSame(\core\user::get_fullname($user), $payload['fullName']);
        $this->assertArrayNotHasKey('timezone', $payload);
        $schema = (new representation_schema(user_model::class))->get_openapi_description(new specification());
        $this->assertSame(array_keys($payload), array_keys((array) $schema->properties));
        $this->assertTrue($schema->properties->fullName->readOnly);
        $this->assertTrue($schema->properties->timeZone->readOnly);
        $model->from_record((object) ['firstname' => 'Bob', 'fullname' => 'Ignored']);
        $this->assertSame(\core\user::get_fullname($model->to_record()), $model->fullname);
        $this->assertNotSame($payload['fullName'], $model->fullname);
    }

    /**
     * Computed names and timezone views follow mutations and current settings.
     */
    public function test_computed_values_follow_settings(): void {
        global $CFG;
        $this->resetAfterTest();
        $this->setAdminUser();
        $CFG->fullnamedisplay = 'firstname lastname';
        $CFG->forcetimezone = '99';
        $CFG->timezone = 'Australia/Perth';
        $model = (new user_model())->from_record((object) [
            'username' => 'alice', 'firstname' => 'Alice', 'lastname' => 'Example',
        ]);
        $this->assertSame('Alice Example', $model->fullname);
        $CFG->fullnamedisplay = 'lastname firstname';
        $this->assertSame('Example Alice', $model->fullname);
        $model->firstname = 'Bob';
        $this->assertSame('Example Bob', $model->fullname);
        $this->assertSame('Australia/Perth', $model->effectivetimezone);
        $this->assertNull($model->timezonepreference);
        $CFG->timezone = 'Europe/London';
        $this->assertSame('Europe/London', $model->effectivetimezone);
        $model->timezone = 'Australia/Perth';
        $CFG->forcetimezone = 'Europe/London';
        $this->assertSame('Europe/London', $model->effectivetimezone);
        $this->assertSame('Australia/Perth', $model->timezonepreference);
        $this->assertSame('Australia/Perth', $model->to_record()->timezone);
    }

    /**
     * The generic manager cannot persist this partial user projection.
     */
    public function test_generic_writes_disabled(): void {
        global $DB;
        $this->resetAfterTest();
        $model = (new user_model())->from_record((object) ['username' => 'alice']);
        $before = $DB->perf_get_queries();
        try {
            (new manager($DB))->save($model, 1);
            $this->fail('A partial user projection was persisted.');
        } catch (\core\exception\coding_exception $e) {
            $this->assertStringContainsString('table attribute', $e->getMessage());
        }
        $this->assertSame($before, $DB->perf_get_queries());
    }
}
