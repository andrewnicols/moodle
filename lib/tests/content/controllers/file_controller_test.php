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

namespace core\content\controllers;

/**
 * Unit tests for core\content\controllers\file_controller class.
 *
 * @package     core
 * @category    test
 * @copyright   2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @coversDefaultClass \core\content\controllers\file_controller
 */
class file_controller_test extends \advanced_testcase {

    public function setUp(): void {
        global $CFG;
        require_once("{$CFG->libdir}/tests/fixtures/content/controllers/fileareas_test.php");
    }

    /**
     * @covers ::get_filearea_classname
     */
    public function test_get_filearea_classname_no_area(): void {
        $this->assertNull(fileareas_test::get_filearea_classname('noarea'));
    }

    /**
     * @covers ::get_filearea_classname
     */
    public function test_get_filearea_classname_no_class(): void {
        $this->assertNull(fileareas_test::get_filearea_classname('noclass'));
    }

    /**
     * @covers ::get_filearea_classname
     */
    public function test_get_filearea_classname_invalid_class(): void {
        $this->assertNull(fileareas_test::get_filearea_classname('invalidclass'));
        $this->assertDebuggingCalledCount(1);
    }
}
