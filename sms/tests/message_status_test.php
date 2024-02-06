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
 * @covers \core_sms\message_status
 */
class message_status_test extends \advanced_testcase {
    public function test_is_sent(): void {
        $sent = [
            message_status::GATEWAY_SENT,
        ];

        foreach (message_status::cases() as $case) {
            if (in_array($case, $sent)) {
                $this->assertTrue($case->is_sent());
            } else {
                $this->assertFalse($case->is_sent());
            }
        }
    }
}
