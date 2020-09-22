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

namespace mod_page\content\fileareas;

use core\content\servable_item;
use core\content\servable_items\servable_callback;
use core\content\servable_items\servable_stored_file;

/**
 * External mod_page functions unit tests
 *
 * @package    mod_page
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.luk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @coversDefaultClass \mod_page\content\fileareas\content
 * @covers \mod_page\content\fileareas\content
 * @covers \core\content\plugintypes\mod\filearea
 * @covers \core\content\filearea
 */
class content_test extends \advanced_testcase {

    protected function create_test_data(string $filename = 'test.txt'): array {
        $this->resetAfterTest(true);

        // Create a page activity.
        $course = $this->getDataGenerator()->create_course();
        $page = $this->getDataGenerator()->create_module('page', [
            'course' => $course->id,
        ]);
        $context = \core\context\module::instance($page->cmid);
        $coursecontext = $context->get_course_context();
        $fs = get_file_storage();
        $file = $fs->create_file_from_string((object) [
            'contextid' => $context->id,
            'component' => 'mod_page',
            'filearea' => 'content',
            'itemid' => 0,
            'filepath' => '/',
            'filename' => $filename,
        ], 'Example content');

        $student = $this->getDataGenerator()->create_and_enrol($course, 'student');
        $editingteacher = $this->getDataGenerator()->create_and_enrol($course, 'editingteacher');

        return [
            'course' => $course,
            'page' => $page,
            'context' => $context,
            'coursecontext' => $coursecontext,
            'file' => $file,
            'student' => $student,
            'editingteacher' => $editingteacher,
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
     */
    public function test_can_access_stored_file_from_context_guest(): void {
        [
            'context' => $context,
            'coursecontext' => $coursecontext,
            'file' => $file,
        ] = $this->create_test_data();

        $filearea = new content();
        $servable = new servable_stored_file('mod_page', $context, $filearea, $file);

        // Note: These calls assume that the user is logged in and has access to the containing context (e.g. the course).
        // When serving the file, we call `require_course_login` first.

        $user = guest_user();

        $this->setUser($user);
        $this->assertTrue($filearea->can_user_access_servable_item_from_content($servable, $user, $context));
        $this->assertFalse($filearea->can_user_access_servable_item_from_content($servable, $user, $coursecontext));
        set_coursemodule_visible($context->instanceid, 0);
        $this->assertFalse($filearea->can_user_access_servable_item_from_content($servable, $user, $context));

        set_coursemodule_visible($context->instanceid, 1);
        $this->unassign_capability('mod/page:view', 'guest');
        $this->assertFalse($filearea->can_user_access_servable_item_from_content($servable, $user, $context));
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

        $filearea = new content();
        $servable = new servable_stored_file('mod_page', $context, $filearea, $file);

        // Note: These calls assume that the user is logged in and has access to the containing context (e.g. the course).
        // When serving the file, we call `require_course_login` first.
        $user = $student;

        $this->setUser($user);
        $this->assertTrue($filearea->can_user_access_servable_item_from_content($servable, $user, $context));
        $this->assertTrue(\core\content::can_user_access_stored_file_from_context($file, $user, $context));
        $this->assertTrue($servable->can_access_content($user, $context));
        $this->assertTrue($servable->user_can_access_from_context($user, $context));

        $this->assertFalse($filearea->can_user_access_servable_item_from_content($servable, $user, $coursecontext));
        $this->assertFalse(\core\content::can_user_access_stored_file_from_context($file, $user, $coursecontext));
        $this->assertFalse($servable->can_access_content($user, $coursecontext));
        $this->assertFalse($servable->user_can_access_from_context($user, $coursecontext));

        set_coursemodule_visible($context->instanceid, 0);
        $this->assertFalse($filearea->can_user_access_servable_item_from_content($servable, $user, $context));
        $this->assertFalse(\core\content::can_user_access_stored_file_from_context($file, $user, $context));
        $this->assertFalse($servable->can_access_content($user, $context));
        $this->assertFalse($servable->user_can_access_from_context($user, $context));

        set_coursemodule_visible($context->instanceid, 1);
        $this->unassign_capability('mod/page:view', 'user');
        $this->assertFalse($filearea->can_user_access_servable_item_from_content($servable, $user, $context));
        $this->assertFalse(\core\content::can_user_access_stored_file_from_context($file, $user, $context));
        $this->assertFalse($servable->can_access_content($user, $context));
        $this->assertFalse($servable->user_can_access_from_context($user, $context));
    }

    /**
     * @covers ::can_user_access_content_from_context
     * @covers ::can_user_access_stored_file_from_context
     * @covers ::can_user_access_servable_item_from_content
     */
    public function test_can_access_stored_file_from_context_teacher(): void {
        [
            'context' => $context,
            'coursecontext' => $coursecontext,
            'file' => $file,
            'editingteacher' => $editingteacher,
        ] = $this->create_test_data();

        $filearea = new content();
        $servable = new servable_stored_file('mod_page', $context, $filearea, $file);

        // Note: These calls assume that the user is logged in and has access to the containing context (e.g. the course).
        // When serving the file, we call `require_course_login` first.

        $user = $editingteacher;

        $this->setUser($user);
        $this->assertTrue($filearea->can_user_access_servable_item_from_content($servable, $user, $context));
        $this->assertFalse($filearea->can_user_access_servable_item_from_content($servable, $user, $coursecontext));
        set_coursemodule_visible($context->instanceid, 0);
        $this->assertTrue($filearea->can_user_access_servable_item_from_content($servable, $user, $context));

        set_coursemodule_visible($context->instanceid, 1);
        $this->unassign_capability('mod/page:view', 'user');
        $this->assertFalse($filearea->can_user_access_servable_item_from_content($servable, $user, $context));
    }

    /**
     * @covers ::can_user_access_content_from_context
     * @covers ::can_user_access_stored_file_from_context
     * @covers ::can_user_access_servable_item_from_content
     */
    public function test_can_access_stored_file_from_context_otheruser(): void {
        [
            'context' => $context,
            'coursecontext' => $coursecontext,
            'file' => $file,
        ] = $this->create_test_data();

        // We also test a user who is not enrolled in the course.
        $user = $this->getDataGenerator()->create_user();

        $filearea = new content();
        $servable = new servable_stored_file('mod_page', $context, $filearea, $file);

        // Note: These calls assume that the user is logged in and has access to the containing context (e.g. the course).
        // When serving the file, we call `require_course_login` first.

        $this->setUser($user);
        $this->assertTrue($filearea->can_user_access_servable_item_from_content($servable, $user, $context));
        $this->assertFalse($filearea->can_user_access_servable_item_from_content($servable, $user, $coursecontext));
        set_coursemodule_visible($context->instanceid, 0);
        $this->assertFalse($filearea->can_user_access_servable_item_from_content($servable, $user, $context));

        set_coursemodule_visible($context->instanceid, 1);
        $this->unassign_capability('mod/page:view', 'user');
        $this->assertFalse($filearea->can_user_access_servable_item_from_content($servable, $user, $context));
    }

    /**
     * @covers ::requires_course_login
     */
    public function test_requires_course_login(): void {
        $this->resetAfterTest();

        // Create a page activity.
        $course = $this->getDataGenerator()->create_course();
        $page = $this->getDataGenerator()->create_module('page', [
            'course' => $course->id,
        ]);
        $context = \core\context\module::instance($page->cmid);
        $fs = get_file_storage();
        $file = $fs->create_file_from_string((object) [
            'contextid' => $context->id,
            'component' => 'mod_page',
            'filearea' => 'content',
            'itemid' => 0,
            'filepath' => '/',
            'filename' => 'test.txt',
        ], 'Example content');

        $filearea = new content();
        $servable = new servable_stored_file('mod_page', $context, $filearea, $file);
        $this->assertTrue($filearea->requires_course_login($servable));
    }

    /**
     * @covers ::get_servable_item_from_pluginfile_params
     * @dataProvider get_servable_item_from_pluginfile_params_provider
     */
    public function test_get_servable_item_from_pluginfile_params(
        string $filename,
        string $expectedclass,
    ): void {
        [
            'context' => $context,
            'coursecontext' => $coursecontext,
            'file' => $file,
            'student' => $student,
        ] = $this->create_test_data($filename);

        $filearea = new content();
        $servable = $filearea->get_servable_item_from_pluginfile_params(
            'mod_page',
            $context,
            'content',
            [
                $file->get_itemid(),
                $file->get_filepath(),
                $file->get_filename(),
            ],
            $student,
        );

        $this->assertInstanceOf(servable_item::class, $servable);
        $this->assertInstanceOf($expectedclass, $servable);
    }

    /**
     * Data provider for get_servable_item_from_pluginfile_params.
     *
     * @return array
     */
    public function get_servable_item_from_pluginfile_params_provider(): array {
        return [
            ['index.htm', servable_callback::class],
            ['index.html', servable_callback::class],
            ['Default.htm', servable_stored_file::class],
            ['index.txt', servable_stored_file::class],
        ];
    }

    /**
     * @covers ::get_servable_item_from_pluginfile_params
     * @dataProvider get_servable_item_from_pluginfile_params_provider
     */
    public function test_get_servable_item_from_pluginfile_params_empty_filepath(
        string $filename,
        string $expectedclass,
    ): void {
        [
            'context' => $context,
            'student' => $student,
        ] = $this->create_test_data($filename);

        $filearea = new content();
        $servable = $filearea->get_servable_item_from_pluginfile_params(
            'mod_page',
            $context,
            'content',
            // After the itemid and the filename are removed, no filepath is specified.
            [0, $filename],
            $student,
        );

        $this->assertInstanceOf(servable_item::class, $servable);
        $this->assertInstanceOf($expectedclass, $servable);
    }

    /**
     * @covers ::get_servable_item_from_pluginfile_params
     */
    public function test_get_servable_item_from_pluginfile_params_file_not_found(): void {
        [
            'context' => $context,
            'student' => $student,
        ] = $this->create_test_data('index.txt');

        $filearea = new content();
        $servable = $filearea->get_servable_item_from_pluginfile_params(
            'mod_page',
            $context,
            'content',
            [0, 'other.txt'],
            $student,
        );

        $this->assertNull($servable);
    }

    /**
     * @covers ::get_servable_item_from_pluginfile_params
     */
    public function test_get_servable_item_from_pluginfile_params_legacy_files(): void {
        global $DB;

        [
            'context' => $context,
            'student' => $student,
            'page' => $page,
            'coursecontext' => $coursecontext,

        ] = $this->create_test_data('index.txt');

        $page->legacyfiles = RESOURCELIB_DISPLAY_POPUP;
        $DB->update_record('page', $page);

        $fs = get_file_storage();
        $file = $fs->create_file_from_string((object) [
            'contextid' => $context->id,
            'component' => 'mod_page',
            'filearea' => 'content',
            'itemid' => 0,
            'filepath' => "/{$coursecontext->id}/course/legacy/0/",
            'filename' => 'Default.htm',
        ], 'Example content');

        // Warning: This is not normal.
        // We're just doing this to insert some legacy files. There is no longer an API to create new legacy data.
        $filedata = $DB->get_record('files', ['id' => $file->get_parent_directory()->get_id()]);
        $DB->set_field('files', 'pathnamehash', sha1($filedata->filepath . $filedata->filename), ['id' => $filedata->id]);
        $filedata = $DB->get_record('files', ['id' => $file->get_id()]);
        $DB->set_field('files', 'pathnamehash', sha1($filedata->filepath . $filedata->filename), ['id' => $filedata->id]);

        $filearea = new content();
        $servable = $filearea->get_servable_item_from_pluginfile_params(
            'mod_page',
            $context,
            'content',
            [0, 'Default.htm'],
            $student,
        );

        $this->assertInstanceOf(servable_item::class, $servable);
        $this->assertInstanceOf(servable_stored_file::class, $servable);
    }

    /**
     * @covers ::get_servable_item_from_pluginfile_params
     */
    public function test_get_servable_item_from_pluginfile_params_legacy_file_not_found(): void {
        global $DB;

        [
            'context' => $context,
            'student' => $student,
            'page' => $page,
            'coursecontext' => $coursecontext,

        ] = $this->create_test_data('index.txt');

        $page->legacyfiles = RESOURCELIB_DISPLAY_POPUP;
        $DB->update_record('page', $page);

        $filearea = new content();
        $servable = $filearea->get_servable_item_from_pluginfile_params(
            'mod_page',
            $context,
            'content',
            [0, 'Default.htm'],
            $student,
        );

        $this->assertNull($servable);
    }

    /**
     * @covers ::get_servable_item_from_pluginfile_params
     */
    public function test_get_servable_item_from_pluginfile_params_index(): void {
        global $DB;

        [
            'context' => $context,
            'student' => $student,
            'page' => $page,
        ] = $this->create_test_data();

        // TODO: Add some pluginfile.php calls.
        $page->content = '<p>Hello world</p>';
        $page->contentformat = FORMAT_HTML;
        $DB->update_record('page', $page);

        $filearea = new content();
        $servable = $filearea->get_servable_item_from_pluginfile_params(
            'mod_page',
            $context,
            'content',
            [0, 'index.html'],
            $student,
        );

        $this->assertInstanceOf(servable_item::class, $servable);
        $this->assertInstanceOf(servable_callback::class, $servable);

        $content = $servable->get_content();
        $this->assertStringContainsString('<p>Hello world</p>', $content);
    }
}
