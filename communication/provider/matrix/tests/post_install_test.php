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

namespace communication_matrix;

use communication_matrix\matrix_test_helper_trait;

defined('MOODLE_INTERNAL') || die();

require_once(__DIR__ . '/matrix_test_helper_trait.php');

/**
 * Class matrix_user_manager_test to test the matrix user manager.
 *
 * @package    communication_matrix
 * @category   test
 * @copyright  2023 Stevani Andolo <stevani.andolo@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @coversDefaultClass \communication_matrix\matrix_user
 */
class post_install_test extends \advanced_testcase {

    use matrix_test_helper_trait;

    /**
     * Test post matrix install to insert new user field record.
     *
     * @return void
     * @covers ::execute
     */
    public function test_execute(): void {
        $this->resetAfterTest();

        // Run the task.
        $this->run_post_install_task();

        // Check if "Communication" field has been added.
        $categoryfield = get_config('core_communication', 'communication_category_field');
        $this->assertNotNull($categoryfield);
        $this->assertEquals('Communication', $categoryfield);

        // Check if "matrixuserid" field has been added.
        $infofield = get_config('communication_matrix', 'matrixuserid_field');
        $this->assertNotNull($infofield);
        $this->assertEquals('matrixuserid', $infofield);
    }
}
