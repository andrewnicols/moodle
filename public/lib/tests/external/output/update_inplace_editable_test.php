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

namespace core\external\output;

use core_external\external_api;
use core_external\tests\external_testcase;

/**
 * Tests for the update_inplace_editable web service.
 *
 * @package    core
 * @category   test
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPunit\Framework\Attributes\CoversClass(update_inplace_editable::class)]
final class update_inplace_editable_test extends external_testcase {
    public function test_update_inplace_editable_without_implementation(): void {
        $this->expectException(\core\exception\coding_exception::class);
        update_inplace_editable::execute('tool_log', 'itemtype', 1, 'newvalue');
    }

    public function test_update_inplace_editable(): void {
        $this->resetAfterTest(true);

        // This is a very basic test for the return value of the external function.
        // More detailed test for tag updating can be found in core_tag component.
        $this->setAdminUser();
        $tag = $this->getDataGenerator()->create_tag();
        $res = update_inplace_editable::execute('core_tag', 'tagname', $tag->id, 'new tag name');
        $res = external_api::clean_returnvalue(update_inplace_editable::execute_returns(), $res);

        $this->assertEquals('new tag name', $res['value']);
    }

    public function test_update_inplace_editable_with_mathjax(): void {
        $this->resetAfterTest(true);
        $this->setAdminUser();

        // Enable MathJax filter in content and headings.
        $this->configure_filters([
            ['name' => 'mathjaxloader', 'state' => TEXTFILTER_ON, 'move' => -1, 'applytostrings' => true],
        ]);

        // Create a forum.
        $course = $this->getDataGenerator()->create_course();
        $forum = self::getDataGenerator()->create_module('forum', array('course' => $course->id, 'name' => 'forum name'));

        // Change the forum name.
        $newname = 'New forum name $$(a+b)=2$$';
        $res = update_inplace_editable::execute('core_course', 'activityname', $forum->cmid, $newname);
        $res = external_api::clean_returnvalue(update_inplace_editable::execute_returns(), $res);

        // Format original data.
        $context = \context_module::instance($forum->cmid);
        $newname = \core_external\util::format_string($newname, $context);
        $editlabel = get_string('newactivityname', '', $newname);

        // Check editlabel is the same and has mathjax.
        $this->assertStringContainsString('<span class="filter_mathjaxloader_equation">', $res['editlabel']);
        $this->assertEquals($editlabel, $res['editlabel']);
    }

}
