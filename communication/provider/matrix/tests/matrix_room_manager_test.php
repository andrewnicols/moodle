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
use core_communication\communication_room_base;
use core_communication\communication_settings_data;
use core_communication\communication_test_helper_trait;

defined('MOODLE_INTERNAL') || die();

require_once(__DIR__ . '/matrix_test_helper_trait.php');
require_once(__DIR__ . '/../../../tests/communication_test_helper_trait.php');

/**
 * Class matrix_events_manager_test to test the matrix events endpoint.
 *
 * @package    communication_matrix
 * @category   test
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @coversDefaultClass \communication_matrix\matrix_room_manager
 */
class matrix_room_manager_test extends \advanced_testcase {

    use matrix_test_helper_trait;
    use communication_test_helper_trait;

    /**
     * @var communication_room_base|matrix_room_manager $matrixroommanager Matrix room manager object
     */
    protected communication_room_base|matrix_room_manager $matrixroommanager;

    /**
     * @var communication $communication The communication object
     */
    protected communication $communication;

    /**
     * @var communication_settings_data $communicationdata The communication settings data object
     */
    protected communication_settings_data $communicationdata;

    public function setUp(): void {
        parent::setUp();
        $this->resetAfterTest();
        $this->initialise_mock_server();
    }

    /**
     * Test create room.
     *
     * @return void
     * @covers ::create
     * @covers ::init
     */
    public function test_create(): void {
        global $CFG;
        $course = $this->get_course();
        $avatarurl = $CFG->dirroot . '/communication/provider/matrix/tests/fixtures/moodle_logo.jpg';

        $communicationdata = new communication_settings_data($course->id, 'core_course', 'coursecommunication');
        $communication = new communication($course->id, 'core_course', 'coursecommunication', $avatarurl);
        $matrixroommanager = new matrix_room_manager($communication);
        $matrixroommanager->create();

        $matrixrooms = new matrix_rooms($communication->communicationsettings->get_communication_instance_id());

        // Test the response against the stored data.
        $this->assertNotEmpty($matrixrooms->roomid);
        $this->assertNotEmpty($matrixrooms->roomalias);

        // Add api call to get room data and test against set data.
        $matrixroomdata = $this->get_matrix_room_data($matrixrooms->roomid);
        $this->assertEquals($matrixrooms->roomid, $matrixroomdata->room_id);
        $this->assertEquals($matrixrooms->roomalias, $matrixroomdata->canonical_alias);
        $this->assertEquals($communicationdata->get_room_name(), $matrixroomdata->name);
        $this->assertNotEmpty($matrixroomdata->avatar);
    }

    /**
     * Test update room.
     *
     * @return void
     * @covers ::update
     * @covers ::update_room_name
     * @covers ::update_room_avatar
     */
    public function test_update(): void {
        global $CFG;
        $course = $this->get_course();
        $avatarurl = $CFG->dirroot . '/communication/provider/matrix/tests/fixtures/moodle_logo.jpg';

        $communicationdata = new communication_settings_data($course->id, 'core_course', 'coursecommunication');
        $communication = new communication($course->id, 'core_course', 'coursecommunication', $avatarurl);
        $matrixroommanager = new matrix_room_manager($communication);

        // First create the communication objects and data.
        $matrixroommanager->create();

        // Now update with custom data.
        $newroomname = 'Newsampleroomname';

        $communicationdata->roomname = $newroomname;
        $communicationdata->save();

        $communication = new communication($course->id, 'core_course', 'coursecommunication', $avatarurl);
        $matrixroommanager = new matrix_room_manager($communication);
        $matrixroommanager->update();

        $matrixrooms = new matrix_rooms($communication->communicationsettings->get_communication_instance_id());

        // Test the response against the stored data.
        $this->assertNotEmpty($matrixrooms->roomid);
        $this->assertNotEmpty($matrixrooms->roomalias);

        // Add api call to get room data and test against set data.
        $matrixroomdata = $this->get_matrix_room_data($matrixrooms->roomid);
        $this->assertEquals($matrixrooms->roomid, $matrixroomdata->room_id);
        $this->assertEquals($matrixrooms->roomalias, $matrixroomdata->canonical_alias);
        $this->assertEquals($newroomname, $matrixroomdata->name);
        $this->assertNotEmpty($matrixroomdata->avatar);
    }

    /**
     * Test update room name.
     *
     * @return void
     * @covers ::update_room_name
     */
    public function test_update_room_name(): void {
        $course = $this->get_course();

        $communicationdata = new communication_settings_data($course->id, 'core_course', 'coursecommunication');
        $communication = new communication($course->id, 'core_course', 'coursecommunication');
        $matrixroommanager = new matrix_room_manager($communication);

        // First create the communication objects and data.
        $matrixroommanager->create();

        // Now update the room name.
        $newroomname = 'Newsampleroomnameupdate';
        $communicationdata->roomname = $newroomname;
        $communicationdata->save();

        $communication = new communication($course->id, 'core_course', 'coursecommunication');
        $matrixroommanager = new matrix_room_manager($communication);
        $matrixroommanager->update_room_name();

        $matrixrooms = new matrix_rooms($communication->communicationsettings->get_communication_instance_id());
        // Add api call to get room data and test against set data.
        $matrixroomdata = $this->get_matrix_room_data($matrixrooms->roomid);
        $this->assertEquals($newroomname, $matrixroomdata->name);
    }

    /**
     * Test update room avatar.
     *
     * @return void
     * @covers ::update_room_avatar
     */
    public function test_update_room_avatar(): void {
        global $CFG;
        $course = $this->get_course();
        $avatarurl = $CFG->dirroot . '/communication/provider/matrix/tests/fixtures/moodle_logo.jpg';

        $communication = new communication($course->id, 'core_course', 'coursecommunication', $avatarurl);
        $matrixroommanager = new matrix_room_manager($communication);

        // First create the communication objects and data.
        $matrixroommanager->create();

        $matrixrooms = new matrix_rooms($communication->communicationsettings->get_communication_instance_id());

        // Add api call to get room data and test against set data.
        $matrixroomdata = $this->get_matrix_room_data($matrixrooms->roomid);
        $this->assertNotEmpty($matrixroomdata->avatar);
    }

    /**
     * Test delete room.
     * Deleting room won't delete anything from matrix. Will just remove users and delete local records.
     *
     * @return void
     * @covers ::delete
     */
    public function test_delete(): void {
        $course = $this->get_course();
        $communication = new communication($course->id, 'core_course', 'coursecommunication');
        $matrixroommanager = new matrix_room_manager($communication);

        // First create the communication objects and data.
        $matrixroommanager->create();

        // Now delete.
        $matrixroommanager->delete();
        $matrixrooms = new matrix_rooms($communication->communicationsettings->get_communication_instance_id());

        // Test the response against the stored data.
        $this->assertNull($matrixrooms->roomid);
        $this->assertNull($matrixrooms->roomalias);
    }

    /**
     * Test generation of a room url for a Matrix room.
     *
     * @return void
     * @covers ::generate_room_url
     */
    public function test_generate_room_url(): void {
        $course = $this->get_course();
        $communication = new communication($course->id, 'core_course', 'coursecommunication');
        $matrixroommanager = new matrix_room_manager($communication);
        // First, create a room.
        $matrixroommanager->create();
        // Test that we have a url returned.
        $this->assertNotEmpty($matrixroommanager->generate_room_url());
    }

    /**
     * Test a room exists in Matrix.
     *
     * @return void
     * @covers ::check_room_exists
     */
    public function test_check_room_exists(): void {
        $course = $this->get_course();
        $communication = new communication($course->id, 'core_course', 'coursecommunication');
        $matrixroommanager = new matrix_room_manager($communication);
        // First, create a room.
        $matrixroommanager->create();
        // Test that the room exists in Matrix.
        $this->assertNotFalse($matrixroommanager->check_room_exists());
    }
}
