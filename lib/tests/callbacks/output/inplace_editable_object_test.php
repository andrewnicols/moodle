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

namespace core\callbacks\output;

use core\exception\coding_exception;
use core\output\inplace_editable;

/**
 * Tests for 
 *
 * @package    core
 * @category   test
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(inplace_editable_object::class)]
final class inplace_editable_object_test extends \advanced_testcase {
    public function test_get_renderable_not_set(): void {
        $callback = new inplace_editable_object('itemtype', 1, 'newvalue');

        $this->expectException(coding_exception::class);
        $this->expectExceptionMessage('The inplace editable has not been set.');

        $callback->get_renderable();
    }

    public function test_get_renderable_value_set(): void {
        $callback = new inplace_editable_object('itemtype', 1, 'newvalue');

        $value = new inplace_editable(
            'mod_example',
            'example',
            1,
            false,
            'ONE',
        );

        $callback->set_renderable($value);

        $this->assertSame($value, $callback->get_renderable());
    }

    public function test_implementing_interfaces(): void {
        $callback = new inplace_editable_object('itemtype', 1, 'newvalue');
        $this->assertContains(
            inplace_editable_interface::class,
            $callback->get_implementing_interface_names(),
        );
    }
}
