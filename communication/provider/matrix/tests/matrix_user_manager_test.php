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

use core_communication\communication;
use core_communication\communication_test_helper_trait;
use communication_matrix\matrix_test_helper_trait;
use communication_matrix\matrix_user_manager;

defined('MOODLE_INTERNAL') || die();

require_once(__DIR__ . '/matrix_test_helper_trait.php');
require_once(__DIR__ . '/../../../tests/communication_test_helper_trait.php');

/**
 * Class matrix_user_manager_test to test the matrix user manager.
 *
 * @package    communication_matrix
 * @category   test
 * @copyright  2023 Stevani Andolo <stevani.andolo@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @coversDefaultClass \communication_matrix\matrix_user
 * @coversDefaultClass \communication\task\communication_user_operations
 */
class matrix_user_manager_test extends \advanced_testcase {

    use matrix_test_helper_trait;
    use communication_test_helper_trait;

    public function setUp(): void {
        parent::setUp();
        $this->resetAfterTest();
        $this->initialise_mock_server();
    }

    /**
     * Test get matrix id from moodle.
     *
     * @return void
     * @covers ::get_matrixid_from_moodle
     */
    public function test_get_matrixid_from_moodle(): void {
        // Run matrix post install task.
        $this->run_post_install_task();

        $course = $this->get_course();
        $userid = $this->get_user()->id;

        // Run room operation task.
        $this->runAdhocTasks('\core_communication\task\communication_room_operations');

        // Create user in matrix.
        $communication = new communication($course->id, 'core_course', 'coursecommunication');
        $matrixuser = new matrix_user($communication);
        $matrixuser->create_members([$userid]);

        $matrixrooms = new matrix_rooms($communication->communicationsettings->get_communication_instance_id());
        $eventmanager = new matrix_events_manager($matrixrooms->roomid);
        $matrixhomeserverurl = $eventmanager->matrixhomeserverurl;

        // Get created matrixuserid from moodle.
        $elementserver = matrix_user_manager::set_matrix_home_server($matrixhomeserverurl);
        $matrixuserid = matrix_user_manager::get_matrixid_from_moodle($userid, $matrixhomeserverurl);
        $this->assertNotNull($matrixuserid);
        $this->assertEquals("@sampleun:{$elementserver}", $matrixuserid);
    }

    /**
     * Sets qualified matrix user id.
     *
     * @return void
     * @covers ::set_qualified_matrix_user_id
     */
    public function test_set_qualified_matrix_user_id(): void {
        $course = $this->get_course();

        // Run room operation task.
        $this->runAdhocTasks('\core_communication\task\communication_room_operations');

        $communication = new communication($course->id, 'core_course', 'coursecommunication');
        $matrixrooms = new matrix_rooms($communication->communicationsettings->get_communication_instance_id());
        $eventmanager = new matrix_events_manager($matrixrooms->roomid);
        $matrixhomeserverurl = $eventmanager->matrixhomeserverurl;
        $elementserver = matrix_user_manager::set_matrix_home_server($matrixhomeserverurl);

        // Sets qualified matrix id test1.
        $user = $this->get_user();
        list($matrixuserid, $pureusername) = matrix_user_manager::set_qualified_matrix_user_id($user->id, $matrixhomeserverurl);
        $this->assertEquals("@{$user->username}:{$elementserver}", $matrixuserid);
        $this->assertEquals("sampleun", $pureusername);

        // Sets qualified matrix id test2.
        $user = $this->get_user('moodlefn', 'moodleln', 'admin@moodle.com');
        list($matrixuserid, $pureusername) = matrix_user_manager::set_qualified_matrix_user_id($user->id, $matrixhomeserverurl);
        $this->assertEquals("@admin.moodle.com:{$elementserver}", $matrixuserid);
        $this->assertEquals("admin.moodle.com", $pureusername);

        // Sets qualified matrix id test3.
        $user = $this->get_user('moodlefn', 'moodleln', 'admin-user@moodle.com');
        list($matrixuserid, $pureusername) = matrix_user_manager::set_qualified_matrix_user_id($user->id, $matrixhomeserverurl);
        $this->assertEquals("@admin-user.moodle.com:{$elementserver}", $matrixuserid);
        $this->assertEquals("admin-user.moodle.com", $pureusername);
    }

    /**
     * Add user's matrix id to moodle.
     *
     * @return void
     * @covers ::add_user_matrix_id_to_moodle
     */
    public function test_add_user_matrix_id_to_moodle(): void {
        // Run matrix post install task.
        $this->run_post_install_task();

        $course = $this->get_course();
        $user = $this->get_user();

        // Run room operation task.
        $this->runAdhocTasks('\core_communication\task\communication_room_operations');

        $communication = new communication($course->id, 'core_course', 'coursecommunication');
        $matrixrooms = new matrix_rooms($communication->communicationsettings->get_communication_instance_id());
        $eventmanager = new matrix_events_manager($matrixrooms->roomid);

        // Sets qualified matrix id.
        list($qualifiedmuid, $pureusername) = matrix_user_manager::set_qualified_matrix_user_id(
            $user->id,
            $eventmanager->matrixhomeserverurl
        );
        $this->assertNotNull($qualifiedmuid);
        $this->assertNotNull($pureusername);

        // Will return true on success.
        $this->assertTrue(matrix_user_manager::add_user_matrix_id_to_moodle($user->id, $pureusername));

        // Get created matrixuserid from moodle.
        $elementserver = matrix_user_manager::set_matrix_home_server($eventmanager->matrixhomeserverurl);
        $matrixuserid = matrix_user_manager::get_matrixid_from_moodle($user->id, $eventmanager->matrixhomeserverurl);
        $this->assertNotNull($matrixuserid);
        $this->assertEquals("@sampleun:{$elementserver}", $matrixuserid);
    }

    /**
     * Add matrix home server for qualified matrix id.
     *
     * @return void
     * @covers ::set_matrix_home_server
     */
    public function test_set_matrix_home_server(): void {
        $course = $this->get_course();

        // Run room operation task.
        $this->runAdhocTasks('\core_communication\task\communication_room_operations');

        $communication = new communication($course->id, 'core_course', 'coursecommunication');
        $matrixrooms = new matrix_rooms($communication->communicationsettings->get_communication_instance_id());
        $eventmanager = new matrix_events_manager($matrixrooms->roomid);

        // Will generate matrix home server.
        $generatedhomeserver = matrix_user_manager::set_matrix_home_server($eventmanager->matrixhomeserverurl);
        $this->assertNotNull($generatedhomeserver);
    }

    /**
     * Test we are able to retrieve user data from Moodle.
     *
     * @return void
     * @covers ::get_moodle_user_data
     */
    public function test_get_moodle_user_data(): void {
        $userid = $this->get_user()->id;
        $userdata = matrix_user_manager::get_moodle_user_data($userid);
        $this->assertNotNull($userdata);
    }
}
