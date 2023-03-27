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

namespace core_communication;

/**
 * Class communication_settings_data_test to test the communication data in db.
 *
 * @package    core_communication
 * @category   test
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @coversDefaultClass \core_communication\communication_settings_data
 */
class communication_settings_data_test extends \advanced_testcase {

    /**
     * Test get communication data from instanace.
     *
     * @return void
     * @covers ::get_communication_data_from_instance
     * @covers ::set_communication_data
     */
    public function test_get_communication_data_from_instance(): void {
        global $DB;
        $this->resetAfterTest();

        // Sameple test data.
        $instanceid = 10;
        $component = 'core_course';
        $instancetype = 'coursecommunication';
        $selectedcommunication = 'communication_matrix';
        $communicationroomname = 'communicationroom';

        // Communication settings data object.
        $communicationsettingsdata = new communication_settings_data($instanceid, $component, $instancetype);
        $communicationsettingsdata->provider = $selectedcommunication;
        $communicationsettingsdata->roomname = $communicationroomname;
        $communicationsettingsdata->save();

        // Now update the record.
        $communicationroomname = 'communicationroomupdated';

        // Update the object and data.
        $communicationsettingsdata->roomname = $communicationroomname;
        $communicationsettingsdata->save();

        // Now test the record against the database.
        $settingsdatarecord = $DB->get_record('communication',
                ['instanceid' => $instanceid, 'component' => $component, 'instancetype' => $instancetype]);
        $objectrecord = $communicationsettingsdata->get_communication_data_from_instance($instanceid, $component, $instancetype);

        // Test against the set data.
        $this->assertNotEmpty($settingsdatarecord);
        $this->assertEquals($objectrecord->instanceid, $settingsdatarecord->instanceid);
        $this->assertEquals($objectrecord->component, $settingsdatarecord->component);
        $this->assertEquals($objectrecord->provider, $settingsdatarecord->provider);
        $this->assertEquals($objectrecord->roomname, $settingsdatarecord->roomname);
        $this->assertEquals($objectrecord->instancetype, $settingsdatarecord->instancetype);
    }

    /**
     * Test the creation of communication record.
     *
     * @return void
     * @covers ::save
     * @covers ::get_communication_instance_id
     * @covers ::record_exist
     * @covers ::set_communication_data
     * @covers ::get_provider
     * @covers ::get_room_name
     */
    public function test_create_communication_record(): void {
        global $DB;
        $this->resetAfterTest();

        // Sameple test data.
        $instanceid = 10;
        $component = 'core_course';
        $instancetype = 'coursecommunication';
        $selectedcommunication = 'communication_matrix';
        $communicationroomname = 'communicationroom';

        // Communication settings data object.
        $communicationsettingsdata = new communication_settings_data($instanceid, $component, $instancetype);
        $communicationsettingsdata->provider = $selectedcommunication;
        $communicationsettingsdata->roomname = $communicationroomname;
        $communicationsettingsdata->save();

        // Now test the record against the database.
        $settingsdatarecord = $DB->get_record('communication',
            ['instanceid' => $instanceid, 'component' => $component, 'instancetype' => $instancetype]);

        // Test against the set data.
        $this->assertNotEmpty($settingsdatarecord);
        $this->assertEquals($instanceid, $settingsdatarecord->instanceid);
        $this->assertEquals($component, $settingsdatarecord->component);
        $this->assertEquals($selectedcommunication, $settingsdatarecord->provider);
        $this->assertEquals($communicationroomname, $settingsdatarecord->roomname);
        $this->assertEquals($instancetype, $settingsdatarecord->instancetype);

        // Test against the object.
        $this->assertTrue($communicationsettingsdata->record_exist());
        $this->assertEquals($communicationsettingsdata->get_communication_instance_id(), $settingsdatarecord->id);
        $this->assertEquals($communicationsettingsdata->get_provider(), $settingsdatarecord->provider);
        $this->assertEquals($communicationsettingsdata->get_room_name(), $settingsdatarecord->roomname);
    }

    /**
     * Test update communication record.
     *
     * @return void
     * @covers ::save
     * @covers ::get_communication_instance_id
     * @covers ::record_exist
     * @covers ::set_communication_data
     * @covers ::get_provider
     * @covers ::get_room_name
     */
    public function test_update_communication_record(): void {
        global $DB;
        $this->resetAfterTest();

        // Sameple test data.
        $instanceid = 10;
        $component = 'core_course';
        $instancetype = 'coursecommunication';
        $selectedcommunication = 'communication_matrix';
        $communicationroomname = 'communicationroom';

        // Communication settings data object.
        $communicationsettingsdata = new communication_settings_data($instanceid, $component, $instancetype);
        $communicationsettingsdata->provider = $selectedcommunication;
        $communicationsettingsdata->roomname = $communicationroomname;
        $communicationsettingsdata->save();

        // Now update the record.
        $communicationroomname = 'communicationroomupdated';

        // Update the object and data.
        $communicationsettingsdata->roomname = $communicationroomname;
        $communicationsettingsdata->save();

        // Now test the record against the database.
        $settingsdatarecord = $DB->get_record('communication',
            ['instanceid' => $instanceid, 'component' => $component, 'instancetype' => $instancetype]);

        // Test against the set data.
        $this->assertNotEmpty($settingsdatarecord);
        $this->assertEquals($instanceid, $settingsdatarecord->instanceid);
        $this->assertEquals($component, $settingsdatarecord->component);
        $this->assertEquals($selectedcommunication, $settingsdatarecord->provider);
        $this->assertEquals($communicationroomname, $settingsdatarecord->roomname);
        $this->assertEquals($instancetype, $settingsdatarecord->instancetype);

        // Test against the object.
        $this->assertTrue($communicationsettingsdata->record_exist());
        $this->assertEquals($communicationsettingsdata->get_communication_instance_id(), $settingsdatarecord->id);
        $this->assertEquals($communicationsettingsdata->get_provider(), $settingsdatarecord->provider);
        $this->assertEquals($communicationsettingsdata->get_room_name(), $settingsdatarecord->roomname);
    }

    /**
     * Test delete communication record.
     *
     * @return void
     * @covers ::delete
     * @covers ::get_communication_instance_id
     * @covers ::record_exist
     * @covers ::set_communication_data
     */
    public function test_delete_communication_record(): void {
        global $DB;
        $this->resetAfterTest();

        // Sameple test data.
        $instanceid = 10;
        $component = 'core_course';
        $instancetype = 'coursecommunication';
        $selectedcommunication = 'communication_matrix';
        $communicationroomname = 'communicationroom';

        // Communication settings data object.
        $communicationsettingsdata = new communication_settings_data($instanceid, $component, $instancetype);
        $communicationsettingsdata->provider = $selectedcommunication;
        $communicationsettingsdata->roomname = $communicationroomname;
        $communicationsettingsdata->save();

        // Now test the record against the database.
        $settingsdatarecord = $DB->get_record('communication',
            ['instanceid' => $instanceid, 'component' => $component, 'instancetype' => $instancetype]);

        // Test against the set data.
        $this->assertNotEmpty($settingsdatarecord);
        $this->assertTrue($communicationsettingsdata->record_exist());

        // Now delete the record.
        $communicationsettingsdata->delete();

        // Now test the record against the database.
        $settingsdatarecord = $DB->get_record('communication',
            ['instanceid' => $instanceid, 'component' => $component, 'instancetype' => $instancetype]);

        // Test against the set data.
        $this->assertEmpty($settingsdatarecord);
        // Test against the object.
        $this->assertFalse($communicationsettingsdata->record_exist());
    }
}
