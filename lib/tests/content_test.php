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

namespace core;

/**
 * Unit tests for core\content class.
 *
 * @package     core
 * @category    test
 * @copyright   2020 Michael Hawkins <michaelh@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @coversDefaultClass \core\content
 * @covers \core\content
 */
class content_test extends \advanced_testcase {

    /**
     * A test to confirm only valid cases allow exporting of course content.
     *
     * @covers ::can_export_context
     */
    public function test_can_export_context_course() {
        global $DB;

        $this->resetAfterTest();

        $course1 = $this->getDataGenerator()->create_course();
        $course2 = $this->getDataGenerator()->create_course();
        $course1context = \context_course::instance($course1->id);
        $course2context = \context_course::instance($course2->id);

        // Enrol user as student in course1 only.
        $user = $this->getDataGenerator()->create_and_enrol($course1, 'student');

        // Confirm by default enrolled user does not have permission to export in course1.
        $this->assertFalse(content::can_export_context($course1context, $user));

        // Make course download available on site, but not enabled in course1 or by default.
        set_config('downloadcoursecontentallowed', true);

        // Confirm user still does not have permission to export (disabled in courses by default).
        $this->assertFalse(content::can_export_context($course1context, $user));

        // Enable export in courses by default.
        set_config('downloadcontentsitedefault', DOWNLOAD_COURSE_CONTENT_ENABLED, 'moodlecourse');

        // Confirm user now has permission to export in course1 only.
        $this->assertTrue(content::can_export_context($course1context, $user));

        // Disable course downloads in course1.
        $course1->downloadcontent = DOWNLOAD_COURSE_CONTENT_DISABLED;
        $DB->update_record('course', $course1);
        rebuild_course_cache($course1->id);

        // Confirm user does not have permission to export in course1.
        $this->assertFalse(content::can_export_context($course1context, $user));

        // Enable course downloads in course1.
        $course1->downloadcontent = DOWNLOAD_COURSE_CONTENT_ENABLED;
        $DB->update_record('course', $course1);
        rebuild_course_cache($course1->id);

        // Confirm user has permission to export in course1.
        $this->assertTrue(content::can_export_context($course1context, $user));

        // Confirm user does not have permission to export in course they are not enrolled in (course2).
        $this->assertFalse(content::can_export_context($course2context, $user));

        // Disable export in courses by default.
        set_config('downloadcontentsitedefault', DOWNLOAD_COURSE_CONTENT_DISABLED, 'moodlecourse');

        // Confirm user still has permission to export in course1 (still enabled at the course level).
        $this->assertTrue(content::can_export_context($course1context, $user));

        // Disable the course downloads feature.
        set_config('downloadcoursecontentallowed', false);

        // Confirm user no longer has permission to export in course1.
        $this->assertFalse(content::can_export_context($course1context, $user));
    }

    /**
     * A test to confirm unsupported contexts will return false when checking whether content can be exported.
     *
     * @covers ::can_export_context
     */
    public function test_can_export_context_unsupported_context() {
        $this->resetAfterTest();

        $course1 = $this->getDataGenerator()->create_course();
        $systemcontext = \core\context\system::instance();

        // Enrol user as student in course1 only.
        $user = $this->getDataGenerator()->create_and_enrol($course1, 'student');

        // Make course download available on site (course context).
        set_config('downloadcoursecontentallowed', true);

        // Confirm system context does not gain permission to export content.
        $this->assertFalse(content::can_export_context($systemcontext, $user));
    }

    /**
     * @covers ::get_servable_item_from_pluginfile_params
     */
    public function test_get_servable_item_from_pluginfile_params_invalid_component(): void {
        $this->assertNull(\core\content::get_servable_item_from_pluginfile_params(
            'test_fakecomponent',
            \core\context\system::instance(),
            'fakefilearea',
            [],
            guest_user(),
        ));
    }

    /**
     * @covers ::can_user_access_stored_file_from_context
     */
    public function test_can_user_access_stored_file_from_context_invalid_component(): void {
        $mock = $this->getMockBuilder(\stored_file::class)
            ->disableOriginalConstructor()
            ->getMock();
        $this->assertFalse(\core\content::can_user_access_stored_file_from_context(
            $mock,
            guest_user(),
            \core\context\system::instance(),
            'test_fakecomponent',
        ));
    }


    /**
     * @covers ::get_pluginfile_url_for_stored_file
     */
    public function test_get_pluginfile_url_for_stored_file_invalid_component(): void {
        $storedfile = $this->getMockBuilder(\stored_file::class)
            ->disableOriginalConstructor()
            ->getMock();
        $this->assertNull(\core\content::get_pluginfile_url_for_stored_file(
            $storedfile,
            'test_fakecomponent',
        ));
    }

    public function test_serve_servable_item(): void {
        $content = $this->getMockBuilder(\core\content\servable_item::class)
            ->disableOriginalConstructor()
            ->getMock();

        $content->expects($this->once())
            ->method('send_file');

        \core\content::serve_servable_item($content, [], false);
    }

    public function test_get_all_files_in_context(): void {
        $files = \core\content::get_all_files_in_context(
            \core\context\system::instance(),
            'test_fakecomponent',
        );

        $this->assertIsArray($files);
        $this->assertEmpty($files);
    }

}
