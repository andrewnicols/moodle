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

namespace core_tag\callbacks\output;

use core\callback_manager;
use core\callbacks\output\inplace_editable_object;
use core\external\output\update_inplace_editable;
use core_external\external_api;

/**
 * Test inplace editable callback.
 *
 * @package    core_tag
 * @category   test
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(inplace_editable_callback::class)]
final class inplace_editable_callback_test extends \advanced_testcase {
    public function test_update_inplace_editable_without_permissions(): void {
        $this->resetAfterTest(true);
        $tag = $this->getDataGenerator()->create_tag();
        $this->setUser($this->getDataGenerator()->create_user());
        $callback = new inplace_editable_object('tagname', $tag->id, 'new tag name');

        $this->expectException(\core\exception\required_capability_exception::class);

        \core\di::get(callback_manager::class)->dispatch('core_tag', $callback);
    }

    public function test_update_using_webservice(): void {
        global $CFG, $DB, $PAGE;

        $this->resetAfterTest(true);
        $tag = $this->getDataGenerator()->create_tag();
        $this->setAdminUser();

        // Ensure that the tag name can be updated.
        $data = update_inplace_editable::execute('core_tag', 'tagname', $tag->id, 'New tag name');
        $data = external_api::clean_returnvalue(update_inplace_editable::execute_returns(), $data);

        $this->assertEquals('New tag name', $data['value']);
        $this->assertEquals('New tag name', $DB->get_field('tag', 'rawname', ['id' => $tag->id]));
    }

    public function test_update_inplace_editable(): void {
        global $CFG, $DB, $PAGE;

        $this->resetAfterTest(true);
        $tag = $this->getDataGenerator()->create_tag();
        $this->setAdminUser();

        // Ensure that the tag name can be updated.
        $callback = new inplace_editable_object('tagname', $tag->id, 'New tag name');

        \core\di::get(callback_manager::class)->dispatch('core_tag', $callback);

        $renderable = $callback->get_renderable();
        $data = $renderable->export_for_template($PAGE->get_renderer('core'));
        $this->assertEquals('New tag name', $data['value']);
        $this->assertEquals('New tag name', $DB->get_field('tag', 'rawname', ['id' => $tag->id]));
    }
}
