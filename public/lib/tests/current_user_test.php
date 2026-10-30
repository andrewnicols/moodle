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

namespace core;

use PHPUnit\Framework\Attributes\CoversClass;

/**
 * Tests for the current user accessor.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(current_user::class)]
final class current_user_test extends \advanced_testcase {
    public function test_follows_the_global_user(): void {
        $this->resetAfterTest();

        // Resolved before any user is set, and retained across changes.
        $current = di::get(current_user::class);

        $this->setAdminUser();
        $this->assertSame((int) get_admin()->id, $current->get_id());

        $user = $this->getDataGenerator()->create_user();
        $this->setUser($user);
        $this->assertSame((int) $user->id, $current->get_id());
        $this->assertSame($user->id, $current->get_user_object()->id);

        $this->setUser(0);
        $this->assertSame(0, $current->get_id());
    }

    public function test_has_capability_and_timezone_for_current_user(): void {
        $this->resetAfterTest();
        $current = di::get(current_user::class);
        $system = \core\context\system::instance();

        $user = $this->getDataGenerator()->create_user(['timezone' => 'Australia/Perth']);
        $this->setUser($user);
        $this->assertFalse($current->has_capability('moodle/site:config', $system));
        $this->assertSame('Australia/Perth', $current->get_timezone_object()->getName());

        $this->setAdminUser();
        $this->assertTrue($current->has_capability('moodle/site:config', $system));
        $this->assertFalse($current->has_capability('moodle/site:config', $system, false));
    }

    public function test_require_capability_for_current_user(): void {
        $this->resetAfterTest();
        $current = di::get(current_user::class);
        $system = \core\context\system::instance();

        $this->setUser($this->getDataGenerator()->create_user());
        try {
            $current->require_capability('moodle/site:config', $system);
            $this->fail('Expected a required_capability_exception');
        } catch (\required_capability_exception) {
            $this->assertFalse($current->has_capability('moodle/site:config', $system));
        }

        $this->setAdminUser();
        $current->require_capability('moodle/site:config', $system);
        $this->expectException(\required_capability_exception::class);
        $current->require_capability('moodle/site:config', $system, false);
    }
}
