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

use core_communication\communication_handler;
use core_communication\communication_settings_data;
use core_communication\communication_test_helper_trait;

defined('MOODLE_INTERNAL') || die();

require_once(__DIR__ . '/matrix_test_helper_trait.php');
require_once(__DIR__ . '/../../../tests/communication_test_helper_trait.php');

/**
 * Class matrix_rooms_test to test the matrix room data in db.
 *
 * @package    communication_matrix
 * @category   test
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @coversDefaultClass \communication_matrix\matrix_rooms
 */
class matrix_rooms_test extends \advanced_testcase {

    use matrix_test_helper_trait;
    use communication_test_helper_trait;

    /**
     * Test the matrix room creation in database.
     *
     * @return void
     * @covers ::create
     * @covers ::get_matrix_room_data
     */
    public function test_matrix_room_record_creation(): void {
        global $DB;
        $this->resetAfterTest();
        $course = $this->get_course();
        $sampleroomid = 'samplematrixroomid';
        $sampleroomalias = 'samplematrixalias#roomalias';

        // Communication api call.
        $communicationdata = new communication_settings_data($course->id, 'core_course', 'coursecommunication');

        // Call matrix room object to create the matrix data.
        $matrixroom = new \communication_matrix\matrix_rooms(
            $communicationdata->get_communication_instance_id());
        $matrixroom->roomid = $sampleroomid;
        $matrixroom->roomalias = $sampleroomalias;
        $matrixroom->create();

        // Test the object.
        $this->assertEquals($matrixroom->roomid, $sampleroomid);
        $this->assertEquals($matrixroom->roomalias, $sampleroomalias);

        // Get the record from db.
        $matrixrecord = $DB->get_record('matrix_rooms',
            ['commid' => $communicationdata->get_communication_instance_id()]);

        // Check the record against sample data.
        $this->assertNotEmpty($matrixrecord);
        $this->assertEquals($sampleroomid, $matrixrecord->roomid);
        $this->assertEquals($sampleroomalias, $matrixrecord->alias);
        $this->assertEquals($communicationdata->get_communication_instance_id(), $matrixrecord->commid);
    }

    /**
     * Test matrix room record updates.
     *
     * @return void
     * @covers ::update
     * @covers ::get_matrix_room_data
     */
    public function test_matrix_room_record_update(): void {
        global $DB;
        $this->resetAfterTest();
        $course = $this->get_course();
        $sampleroomid = 'samplematrixroomid';
        $sampleroomalias = 'samplematrixalias#roomalias';

        // Communication api call.
        $communicationdata = new communication_settings_data($course->id, 'core_course', 'coursecommunication');

        // Call matrix room object to create the matrix data.
        $matrixroom = new \communication_matrix\matrix_rooms(
            $communicationdata->get_communication_instance_id());
        $matrixroom->roomid = $sampleroomid;
        $matrixroom->roomalias = $sampleroomalias;
        $matrixroom->create();

        // Get the record from db.
        $matrixrecord = $DB->get_record('matrix_rooms',
            ['commid' => $communicationdata->get_communication_instance_id()]);

        // Check the record against sample data.
        $this->assertNotEmpty($matrixrecord);

        $sampleroomidupdated = 'samplematrixroomidupdated';
        $sampleroomaliasupdated = 'samplematrixalias#roomaliasupdated';

        $matrixroom->roomid = $sampleroomidupdated;
        $matrixroom->roomalias = $sampleroomaliasupdated;
        $matrixroom->update();

        // Test the object.
        $this->assertEquals($matrixroom->roomid, $sampleroomidupdated);
        $this->assertEquals($matrixroom->roomalias, $sampleroomaliasupdated);

        // Get the record from db.
        $matrixrecord = $DB->get_record('matrix_rooms',
            ['commid' => $communicationdata->get_communication_instance_id()]);

        // Check the record against sample data.
        $this->assertNotEmpty($matrixrecord);
        $this->assertEquals($sampleroomidupdated, $matrixrecord->roomid);
        $this->assertEquals($sampleroomaliasupdated, $matrixrecord->alias);
        $this->assertEquals($communicationdata->get_communication_instance_id(), $matrixrecord->commid);
    }

    /**
     * Test matrix room deletion.
     *
     * @return void
     * @covers ::delete
     * @covers ::get_matrix_room_data
     */
    public function test_matrix_room_deletion(): void {
        global $DB;
        $this->resetAfterTest();
        $course = $this->get_course();
        $sampleroomid = 'samplematrixroomid';
        $sampleroomalias = 'samplematrixalias#roomalias';

        // Communication api call.
        $communicationdata = new communication_settings_data($course->id, 'core_course', 'coursecommunication');

        // Call matrix room object to create the matrix data.
        $matrixroom = new \communication_matrix\matrix_rooms(
            $communicationdata->get_communication_instance_id());
        $matrixroom->roomid = $sampleroomid;
        $matrixroom->roomalias = $sampleroomalias;
        $matrixroom->create();

        // Get the record from db.
        $matrixrecord = $DB->get_record('matrix_rooms',
            ['commid' => $communicationdata->get_communication_instance_id()]);

        // Check the record against sample data.
        $this->assertNotEmpty($matrixrecord);

        // Now delete the record.
        $matrixroom->delete();

        // Get the record from db.
        $matrixrecord = $DB->get_record('matrix_rooms',
            ['commid' => $communicationdata->get_communication_instance_id()]);

        // Check the record against sample data.
        $this->assertEmpty($matrixrecord);
    }
}
