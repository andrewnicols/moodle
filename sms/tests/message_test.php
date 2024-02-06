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

namespace core_sms;

/**
 * Tests for sms
 *
 * @package    core_sms
 * @category   test
 * @copyright  2024 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers \core_sms\message
 */
class message_test extends \advanced_testcase {
    public function test_create(): void {
        $message = new message(
            recipient: '1234567890',
            content: 'Hello, world!',
            component: 'core',
            messagetype: 'test',
            recipientuserid: null,
            sensitive: false,
        );

        $this->assertInstanceOf(message::class, $message);
    }

    public function test_timecreated(): void {
        $clock = $this->mock_clock_with_incrementing(55555);

        $timecreated = 12345;
        $message = new message(
            recipient: '1234567890',
            content: 'Hello, world!',
            component: 'core',
            messagetype: 'test',
            recipientuserid: null,
            sensitive: false,
            timecreated: $timecreated,
        );

        $this->assertEquals($timecreated, $message->timecreated);

        $starttime = $clock->now();
        $message = new message(
            recipient: '1234567890',
            content: 'Hello, world!',
            component: 'core',
            messagetype: 'test',
            recipientuserid: null,
            sensitive: false,
        );

        $this->assertGreaterThan($starttime->getTimestamp(), $message->timecreated);
        $this->assertLessThan($clock->now()->getTimestamp(), $message->timecreated);
    }

    public function test_id_not_updatable(): void {
        $message = new message(
            recipient: '1234567890',
            content: 'Hello, world!',
            component: 'core',
            messagetype: 'test',
            recipientuserid: null,
            sensitive: false,
        );

        $this->assertFalse(isset($message->id));

        $message = $message->with(id: 123);
        $this->assertEquals(123, $message->id);

        $this->expectException(\coding_exception::class);
        $message->with(id: 987);
    }
}
