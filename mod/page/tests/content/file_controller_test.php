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

namespace mod_page\content;

use core\content\plugintypes\mod\filearea;
use moodle_url;
use stored_file;

/**
 * File Controller test for mod_page.
 *
 * @package    mod_page
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.luk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @coversDefaultClass \mod_page\content\file_controller
 * @covers \core\content\plugintypes\mod\file_controller
 * @covers \core\content\controllers\component_file_controller
 * @covers \core\content\controllers\file_controller

 */
class file_controller_test extends \advanced_testcase {
    /**
     * Helper to create a test file.
     *
     * @param context $context
     * @param string $filename
     * @param string $content
     * @param string $filepath
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
            'filearea' => 'content',
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

    /**
     * Test get_fileareas.
     *
     * @covers ::get_fileareas
     */
    public function test_get_fileareas(): void {
        $fileareas = file_controller::get_fileareas();
        $this->assertIsArray($fileareas);

        $this->assertArrayHasKey('content', $fileareas);
        $this->assertArrayHasKey('intro', $fileareas);

        foreach ($fileareas as $filearea) {
            $this->assertTrue(is_subclass_of($filearea, filearea::class));
        }
    }

    /**
     * @covers ::get_servable_item_from_pluginfile_params
     * @dataProvider get_servable_item_from_pluginfile_params_provider
     */
    public function test_get_servable_item_from_pluginfile_params_match(
        int $itemid,
        string $filename,
        bool $shouldmatch,
    ): void {
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

        $servable = file_controller::get_servable_item_from_pluginfile_params(
            'mod_page',
            $context,
            'content',
            [$itemid, $filename],
            guest_user(),
        );

        if ($shouldmatch) {
            $this->assertInstanceOf(\core\content\servable_items\servable_stored_file::class, $servable);
        } else {
            $this->assertNull($servable);
        }
    }

    /**
     * @covers \core\content::get_servable_item_from_pluginfile_params
     * @covers \core\content\controllers\file_controller::get_servable_item_from_pluginfile_params
     */
    public function test_get_servable_item_from_pluginfile_params_invalid_filearea(): void {
        $servable = \core\content::get_servable_item_from_pluginfile_params(
            'mod_page',
            \core\context\system::instance(),
            'fakefilearea',
            [0, 'test.txt'],
            guest_user(),
        );

        $this->assertDebuggingCalledCount(1);
        $this->assertNull($servable);
    }


    /**
     * @covers \core\content::get_servable_item_from_pluginfile_params
     * @covers \core\content\controllers\file_controller::get_servable_item_from_pluginfile_params
     * @dataProvider get_servable_item_from_pluginfile_params_provider
     */
    public function test_get_servable_item_from_pluginfile_params_match_core(
        int $itemid,
        string $filename,
        bool $shouldmatch,
    ): void {
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

        $servable = \core\content::get_servable_item_from_pluginfile_params(
            'mod_page',
            $context,
            'content',
            [$itemid, $filename],
            guest_user(),
        );

        if ($shouldmatch) {
            $this->assertInstanceOf(\core\content\servable_items\servable_stored_file::class, $servable);
        } else {
            $this->assertNull($servable);
        }
    }

    public function get_servable_item_from_pluginfile_params_provider(): array {
        return [
            'itemid is 0' => [0, 'test.txt', true],
            'itemid does not match' => [12345, 'test.txt', true],
            'filename does not match' => [0, 'oops.txt', false],
        ];
    }

    /**
     * @covers \core\content::get_pluginfile_url_for_stored_file
     * @covers \core\content\controllers\file_controller::get_pluginfile_url_for_stored_file
     */
    public function test_get_pluginfile_url_for_stored_file(): void {
        ['file' => $file] = $this->create_test_data();
        $url = \core\content::get_pluginfile_url_for_stored_file($file, 'mod_page');
        $this->assertTrue(
            (new moodle_url("/pluginfile.php/{$file->get_contextid()}/mod_page/content/0/test.txt"))->compare($url)
        );
    }


    /**
     * @covers ::get_all_files_in_context
     * @covers \core\content::get_all_files_in_context
     * @covers \core\content\filearea::get_all_files_in_context
     */
    public function test_get_all_files_in_context(): void {
        $this->resetAfterTest(true);

        [
            'context' => $context,
        ] = $this->create_test_data();

        $this->create_test_file($context, 'Another file', 'other.txt');
        $this->create_test_file($context, 'Some jpeg', 'other.jpg');
        $this->create_test_file($context, 'Some png', 'other.png');

        $files = \core\content::get_all_files_in_context(
            $context,
            'mod_page',
        );

        $this->assertCount(4, array_filter($files, function($file): bool {
            return !$file->is_directory();
        }));
    }
}
