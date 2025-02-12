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

namespace format_topics\callbacks\output;

use core\callback_manager;
use core\callbacks\output\inplace_editable_object;
use core\external\output\update_inplace_editable;
use core_external\external_api;
use dml_missing_record_exception;
use require_login_exception;


/**
 * Test inplace editable callback.
 *
 * @package    format_topics
 * @category   test
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(inplace_editable_callback::class)]
final class inplace_editable_callback_test extends \advanced_testcase {
    public function test_update_using_webservice(): void {
        global $DB, $PAGE;

        $this->resetAfterTest();
        $user = $this->getDataGenerator()->create_user();
        $course = $this->getDataGenerator()->create_course([
            'numsections' => 5,
            'format' => 'topics',
        ], ['createsections' => true]);
        $section = $DB->get_record('course_sections', ['course' => $course->id, 'section' => 2]);

        $teacherrole = $DB->get_record('role', ['shortname' => 'editingteacher']);
        $this->getDataGenerator()->enrol_user($user->id, $course->id, $teacherrole->id);
        $this->setUser($user);

        // Ensure that the value can be updated.
        $data = update_inplace_editable::execute('format_topics', 'sectionname', $section->id, 'New section name');
        $data = external_api::clean_returnvalue(update_inplace_editable::execute_returns(), $data);

        $this->assertEquals('New section name', $data['value']);
        $this->assertEquals('New section name', $DB->get_field('course_sections', 'name', ['id' => $section->id]));
    }

    public function test_update_using_webservice_without_permission(): void {
        global $DB, $PAGE;

        $this->resetAfterTest();
        $user = $this->getDataGenerator()->create_user();
        $course = $this->getDataGenerator()->create_course([
            'numsections' => 5,
            'format' => 'topics',
        ], ['createsections' => true]);
        $section = $DB->get_record('course_sections', ['course' => $course->id, 'section' => 2]);

        $this->setUser($user);

        $this->expectException(require_login_exception::class);
        update_inplace_editable::execute('format_topics', 'sectionname', $section->id, 'New section name');
    }

    public function test_update_inplace_editable(): void {
        global $DB, $PAGE;

        $this->resetAfterTest();
        $user = $this->getDataGenerator()->create_user();
        $course = $this->getDataGenerator()->create_course([
            'numsections' => 5,
            'format' => 'topics',
        ], ['createsections' => true]);
        $teacherrole = $DB->get_record('role', ['shortname' => 'editingteacher']);
        $this->getDataGenerator()->enrol_user($user->id, $course->id, $teacherrole->id);
        $this->setUser($user);

        $section = $DB->get_record('course_sections', ['course' => $course->id, 'section' => 2]);

        $callback = new inplace_editable_object('sectionname', $section->id, 'Rename me again');

        \core\di::get(callback_manager::class)->dispatch('format_topics', $callback);

        $renderable = $callback->get_renderable();
        $data = $renderable->export_for_template($PAGE->get_renderer('core'));
        $this->assertEquals('Rename me again', $data['value']);
        $this->assertEquals('Rename me again', $DB->get_field('course_sections', 'name', ['id' => $section->id]));
    }

    public function test_update_inplace_editable_incorrect_course_format(): void {
        global $DB, $PAGE;

        $this->resetAfterTest();
        $user = $this->getDataGenerator()->create_user();
        $course = $this->getDataGenerator()->create_course([
            'numsections' => 5,
            'format' => 'weeks',
        ], ['createsections' => true]);
        $teacherrole = $DB->get_record('role', ['shortname' => 'editingteacher']);
        $this->getDataGenerator()->enrol_user($user->id, $course->id, $teacherrole->id);
        $this->setUser($user);

        $section = $DB->get_record('course_sections', ['course' => $course->id, 'section' => 2]);

        $callback = new inplace_editable_object('sectionname', $section->id, 'Rename me again');

        $this->expectException(dml_missing_record_exception::class);
        \core\di::get(callback_manager::class)->dispatch('format_topics', $callback);
    }
}
