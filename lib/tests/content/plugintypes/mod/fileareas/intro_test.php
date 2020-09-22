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

namespace core\content\plugintypes\mod;

use stored_file;
use core\content\servable_items\servable_stored_file;

/**
 * External mod_page functions unit tests
 *
 * @package    mod_page
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.luk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @coversDefaultClass \mod_page\content\fileareas\content
 * @covers \core\content\plugintypes\mod\fileareas\intro
 * @covers \core\content\plugintypes\mod\filearea
 * @covers \core\content\filearea
 */
class intro_test extends \advanced_testcase {
    /**
     * Helper to create a test file.
     *
     * @param context $context
     * @param string $filename
     * @param string $content
     * @param string $filepathv
     */
    protected function create_test_file(
        \core\context $context,
        string $filename,
        string $content,
        string $filepath = '/',
    ): stored_file {
        $fs = get_file_storage();
        return $fs->create_file_from_string((object) [
            'contextid' => $context->id,
            'component' => 'mod_page',
            'filearea' => 'intro',
            'itemid' => 0,
            'filepath' => $filepath,
            'filename' => $filename,
        ], $content);
    }

    /**
     * Helper to create test data.
     *
     * @return array
     */
    protected function create_test_data(): array {
        $this->resetAfterTest(true);

        // Create a page activity.
        $course = $this->getDataGenerator()->create_course();
        $page = $this->getDataGenerator()->create_module('page', [
            'course' => $course->id,
        ]);
        $context = \core\context\module::instance($page->cmid);

        return [
            'course' => $course,
            'page' => $page,
            'context' => $context,
            'coursecontext' => $context->get_course_context(),
            'file' => $this->create_test_file($context, 'test.txt', 'Example content'),
            'student' => $this->getDataGenerator()->create_and_enrol($course, 'student'),
            'editingteacher' => $this->getDataGenerator()->create_and_enrol($course, 'editingteacher'),
        ];
    }

    protected function unassign_capability(string $capability, string $rolename, ?int $contextid = null): void {
        global $DB;

        $rolename = $DB->get_field('role', 'id', ['shortname' => $rolename]);
        unassign_capability($capability, $rolename, $contextid);
    }

    /**
     * @covers ::can_user_access_content_from_context
     * @covers ::can_user_access_stored_file_from_context
     * @covers ::can_user_access_servable_item_from_content
     * @covers \core\content::can_user_access_stored_file_from_context
     * @covers \core\content\controllers\file_controller::can_user_access_stored_file_from_context
     * @covers \core\content\servable_item::can_access_content
     * @covers \core\content\servable_item::user_can_access_from_context
     */
    public function test_can_access_stored_file_from_context_student(): void {
        [
            'context' => $context,
            'coursecontext' => $coursecontext,
            'file' => $file,
            'student' => $student,
        ] = $this->create_test_data();

        $filearea = new fileareas\intro();
        $servable = new servable_stored_file('mod_page', $context, $filearea, $file);

        // Note: These calls assume that the user is logged in and has access to the containing context (e.g. the course).
        // When serving the file, we call `require_course_login` first.
        $user = $student;

        $this->setUser($user);
        $this->assertTrue($filearea->can_user_access_servable_item_from_content($servable, $user, $context));
        $this->assertTrue(\core\content::can_user_access_stored_file_from_context($file, $user, $context));
        $this->assertTrue($servable->can_access_content($user, $context));
        $this->assertTrue($servable->user_can_access_from_context($user, $context));

        $this->assertTrue($filearea->can_user_access_servable_item_from_content($servable, $user, $coursecontext));
        $this->assertTrue(\core\content::can_user_access_stored_file_from_context($file, $user, $coursecontext));
        $this->assertTrue($servable->can_access_content($user, $coursecontext));
        $this->assertTrue($servable->user_can_access_from_context($user, $coursecontext));

        set_coursemodule_visible($context->instanceid, 0);
        // xdebug_break();
        // $this->assertFalse($filearea->can_user_access_servable_item_from_content($servable, $user, $context));
        // $this->assertFalse(\core\content::can_user_access_stored_file_from_context($file, $user, $context));
        // $this->assertFalse($servable->can_access_content($user, $context));
        // $this->assertFalse($servable->user_can_access_from_context($user, $context));

        set_coursemodule_visible($context->instanceid, 1);
        $this->unassign_capability('mod/page:view', 'user');
        // $this->assertFalse($filearea->can_user_access_servable_item_from_content($servable, $user, $context));
        // $this->assertFalse(\core\content::can_user_access_stored_file_from_context($file, $user, $context));
        // $this->assertFalse($servable->can_access_content($user, $context));
        // $this->assertFalse($servable->user_can_access_from_context($user, $context));
    }

    /**
     * @covers ::requires_course_login
     */
    public function test_requires_course_login(): void {
        [
            'context' => $context,
            'file' => $file,
            'student' => $student,
            'editingteacher' => $editingteacher,
        ] = $this->create_test_data();

        $filearea = new fileareas\intro();
        $servable = new servable_stored_file('mod_page', $context, $filearea, $file);
        $this->assertFalse($servable->meets_login_requirements());

        $this->setUser($student);
        $this->assertTrue($servable->meets_login_requirements());

        $this->setUser($editingteacher);
        $this->assertTrue($servable->meets_login_requirements());

        // Hide the activity.
        set_coursemodule_visible($context->instanceid, 0);

        $this->setUser($student);
        $this->assertFalse($servable->meets_login_requirements());

        $this->setUser($editingteacher);
        $this->assertTrue($servable->meets_login_requirements());
    }

}
