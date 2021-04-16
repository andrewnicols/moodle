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

/**
 * PHPUnit block_accessibility_review tests
 *
 * @package   block_accessibility_review
 * @copyright  2020 onward: Learning Technology Services, www.lts.ie
 * @author     Jay Churchward (jay.churchward@poetopensource.org)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

require_once(__DIR__ . '/../../moodleblock.class.php');
require_once(__DIR__ . '/../block_accessreview.php');

/**
 * Unit tests for {@accessibility_review block_accessibility_review}.
 * @group block_accessibility_review
 */
class block_accessibility_review_testcase extends advanced_testcase {

    /**
     * Creates an accessibility review block on a course.
     *
     * @param \stdClass $course Course object
     * @return \block_html Block instance object
     */
    protected function create_block($course) {
        $page = self::construct_page($course);
        $page->blocks->add_block_at_end_of_default_region('accessreview');

        // Load the block.
        $page = self::construct_page($course);
        $page->blocks->load_blocks();
        $blocks = $page->blocks->get_blocks_for_region($page->blocks->get_default_region());
        $block = end($blocks);
        return $block;
    }

    public function test_get_toggle_link() {
        $this->resetAfterTest();

        $block = new mock_block_accessreview();
        $output = $block->get_toggle_link_for_test();
        $this->assertNotEmpty($output);
    }

    public function test_get_download_link() {
        $this->resetAfterTest();

        $block = new mock_block_accessreview();

        $user1 = $this->getDataGenerator()->create_user();
        $user2 = $this->getDataGenerator()->create_user();

        $course = $this->getDataGenerator()->create_course();

        // Enrol users in the course.
        $this->getDataGenerator()->enrol_user($user1->id, $course->id, 'teacher');
        $this->getDataGenerator()->enrol_user($user2->id, $course->id, 'student');

        $this->setUser($user1);
        $result = $block->get_download_link_for_test(context_course::instance($course->id));
        $this->assertNotEmpty($result);

        $this->setUser($user2);
        $result = $block->get_download_link_for_test(context_course::instance($course->id));
        $this->assertEmpty($result);
    }

    public function test_get_report_link() {
        $this->resetAfterTest();

        $block = new mock_block_accessreview();

        $user1 = $this->getDataGenerator()->create_user();
        $user2 = $this->getDataGenerator()->create_user();

        $course = $this->getDataGenerator()->create_course();

        // Enrol users in the course.
        $this->getDataGenerator()->enrol_user($user1->id, $course->id, 'teacher');
        $this->getDataGenerator()->enrol_user($user2->id, $course->id, 'student');

        $this->setUser($user1);
        $result = $block->get_report_link_for_test(context_course::instance($course->id));
        $this->assertNotEmpty($result);

        $this->setUser($user2);
        $result = $block->get_report_link_for_test(context_course::instance($course->id));
        $this->assertEmpty($result);
    }
}

class mock_block_accessreview extends block_accessreview {
    public function get_toggle_link_for_test() {
        return $this->get_toggle_link();
    }

    public function get_download_link_for_test(\context $context) {
        return $this->get_download_link($context);
    }

    public function get_report_link_for_test(\context $context) {
        return $this->get_report_link($context);
    }
}
