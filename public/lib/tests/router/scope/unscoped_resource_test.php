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

namespace core\router\scope;

use PHPUnit\Framework\Attributes\CoversClass;

/**
 * Tests for {@see unscoped_resource}.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(unscoped_resource::class)]
final class unscoped_resource_test extends \advanced_testcase {
    /**
     * The attribute must only be usable on methods, and only once per method.
     */
    public function test_attributes(): void {
        $reflection = new \ReflectionClass(unscoped_resource::class);
        $attributes = $reflection->getAttributes(\Attribute::class);

        $this->assertCount(1, $attributes);
        $flags = $attributes[0]->getArguments()[0];

        $this->assertEquals(\Attribute::TARGET_METHOD, $flags);
    }
}
