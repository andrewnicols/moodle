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

namespace core_calendar\route\api;

use core\tests\route_testcase;

/**
 * Tests for calendar
 *
 * @package    core_calendar
 * @category   test
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers    \core_calendar\route\api\event
 */
final class event_test extends route_testcase {
    public function test_delete_user_event_as_user(): void {
        global $DB, $USER;

        $this->resetAfterTest(true);

        $user = $this->getDataGenerator()->create_user();
        $this->setUser($user);
        $course = $this->getDataGenerator()->create_course();
        $group = $this->getDataGenerator()->create_group((object) [
            'courseid' => $course->id,
        ]);

        $event = $this->getDataGenerator()->create_event([
            'name' => 'Event',
            'eventtype' => 'user',
            'userid' => $user->id,
        ]);

        $this->add_class_routes_to_route_loader(event::class);

        $response = $this->process_api_request('DELETE', "/event/{$event->id}?repeat=true");

        $this->assert_valid_response($response, 204);
    }
}
