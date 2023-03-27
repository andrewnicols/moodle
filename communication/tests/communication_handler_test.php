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

defined('MOODLE_INTERNAL') || die();

require_once(__DIR__ . '/communication_test_helper_trait.php');

/**
 * Class communication_handler_test to test the communication handler and its associated methods.
 *
 * @package    core_communication
 * @category   test
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @coversDefaultClass \core_communication\communication_handler
 */
class communication_handler_test extends \advanced_testcase {

    use communication_test_helper_trait;

    /**
     * Test the communication plugin list for the form element returns the correct number of plugins.
     *
     * @return void
     * @covers ::get_communication_plugin_list_for_form
     */
    public function test_get_communication_plugin_list_for_form(): void {
        $this->resetAfterTest();
        $course = $this->get_course();

        $communication = new communication_handler($course->id);
        $communicationplugins = $communication->get_communication_plugin_list_for_form();

        // Get the communication plugins.
        $plugins = \core_component::get_plugin_list('communication');
        // Check the number of plugins matches plus 1 as we have none in the selection.
        $this->assertCount(count($plugins) + 1, $communicationplugins);
    }

    /**
     * Test set data to the instance.
     *
     * @return void
     * @covers ::set_data
     */
    public function test_set_data(): void {
        $this->resetAfterTest();
        $course = $this->get_course();
        $communication = new communication_handler($course->id);

        // Sample data.
        $roomname = 'Sampleroom';
        $provider = 'communication_matrix';

        // Set the data.
        $communication->set_data($course);

        // Test the set data.
        $this->assertEquals($roomname, $course->communicationroomname);
        $this->assertEquals($provider, $course->selectedcommunication);
    }

    /**
     * Test save form data.
     *
     * @return void
     * @covers ::save_form_data
     */
    public function test_save_form_data(): void {
        $this->resetAfterTest();
        $course = $this->get_course();
        // Sample data.
        $communicationroomname = 'Sampletestroom';
        $selectedcommunication = 'communication_matrix';

        // Handler object and save form data.
        $communication = new communication_handler($course->id);
        $communication->create_and_configure_room_and_add_members($selectedcommunication, $communicationroomname);

        // Test the set data.
        $communicationsettingsdata = new communication_settings_data($course->id, 'core_course', 'coursecommunication');
        $this->assertEquals($communicationroomname, $communicationsettingsdata->get_room_name());
        $this->assertEquals($selectedcommunication, $communicationsettingsdata->get_provider());
    }

    /**
     * Test is update required.
     *
     * @return void
     * @covers ::is_update_required
     */
    public function test_is_update_required(): void {
        $this->resetAfterTest();
        $course = $this->get_course();
        // Sample changed data.
        $communicationroomname = 'Sampletestroom';
        $selectedcommunication = 'communication_matrix';

        // Handler object and save form data.
        $communication = new communication_handler($course->id);
        $communication->save_form_data($selectedcommunication, $communicationroomname);

        // Returns true when data is changed.
        $this->assertTrue($communication->is_update_required());
    }

    /**
     * Test the handler create method to add/create tasks.
     *
     * @return void
     * @covers ::create_and_configure_room_and_add_members
     * @covers ::add_to_task_queue
     */
    public function test_create_handler_operation(): void {
        $this->resetAfterTest();
        // Get the course by disabling communication so that we can create it manually calling the handler.
        $course = $this->get_course('Sampleroom', 'none');

        // Sample data.
        $communicationroomname = 'Sampleroom';
        $selectedcommunication = 'communication_matrix';

        // Handler object to create communication data.
        $communication = new communication_handler($course->id);
        $communication->create_and_configure_room_and_add_members($selectedcommunication, $communicationroomname);

        // Test the tasks added.
        $adhoctask = \core\task\manager::get_adhoc_tasks('\\core_communication\\task\\communication_room_operations');
        $this->assertCount(1, $adhoctask);

        $adhoctask = reset($adhoctask);
        $this->assertInstanceOf('\\core_communication\\task\\communication_room_operations', $adhoctask);

        // Test the communication record added.
        $communicationsettingsdata = new communication_settings_data($course->id, 'core_course', 'coursecommunication');
        $this->assertTrue($communicationsettingsdata->record_exist());
    }

    /**
     * Test the handler create method to add/create tasks.
     *
     * @return void
     * @covers ::create_and_configure_room_and_add_members
     * @covers ::add_to_task_queue
     */
    public function test_create_handler_operation_without_communication_provider_selected(): void {
        $this->resetAfterTest();
        // Get the course by disabling communication so that we can create it manually calling the handler.
        $course = $this->getDataGenerator()->create_course();

        // Test the tasks added.
        $adhoctask = \core\task\manager::get_adhoc_tasks('\\core_communication\\task\\communication_room_operations');
        $this->assertCount(0, $adhoctask);

        // Test the communication record added.
        $communicationsettingsdata = new communication_settings_data($course->id, 'core_course', 'coursecommunication');
        $this->assertFalse($communicationsettingsdata->record_exist());
    }

    /**
     * Test update handler operation.
     *
     * @return void
     * @covers ::update_room_and_membership
     * @covers ::is_update_required
     * @covers ::add_to_task_queue
     */
    public function test_update_handler_operation(): void {
        $this->resetAfterTest();
        $course = $this->get_course();

        // Sample data.
        $communicationroomname = 'Sampleroom';
        $selectedcommunication = 'communication_matrix';

        // Handler object to update communication data.
        $communication = new communication_handler($course->id);
        $communication->update_room_and_membership($selectedcommunication, $communicationroomname);

        // Test the tasks added.
        $adhoctask = \core\task\manager::get_adhoc_tasks('\\core_communication\\task\\communication_room_operations');
        // Should be 2 as one for create, another for update.
        $this->assertCount(2, $adhoctask);

        $adhoctask = reset($adhoctask);
        $this->assertInstanceOf('\\core_communication\\task\\communication_room_operations', $adhoctask);

        // Test the communication record added.
        $communicationsettingsdata = new communication_settings_data($course->id, 'core_course', 'coursecommunication');
        $this->assertTrue($communicationsettingsdata->record_exist());
    }

    /**
     * Test delete handler operation.
     *
     * @return void
     * @covers ::delete_room_and_remove_members
     * @covers ::add_to_task_queue
     */
    public function test_delete_handler_operation(): void {
        $this->resetAfterTest();
        $course = $this->get_course();

        // Test the communication record added.
        $communicationsettingsdata = new communication_settings_data($course->id, 'core_course', 'coursecommunication');
        $this->assertTrue($communicationsettingsdata->record_exist());

        // Handler object to delete communication data.
        $communication = new communication_handler($course->id);
        $communication->delete_room_and_remove_members();

        // Test the communication record added.
        $communicationsettingsdata = new communication_settings_data($course->id, 'core_course', 'coursecommunication');
        // Expect it to be true as the local record should only be deleted after the room operation actioned.
        $this->assertTrue($communicationsettingsdata->record_exist());
    }

    /**
     * Test the adding members to a room operation.
     *
     * @return void
     * @covers ::update_room_membership
     * @covers ::is_update_required
     * @covers ::add_to_task_queue
     * @covers ::add_members
     */
    public function test_add_member_to_room_operation(): void {
        $this->resetAfterTest();
        $course = $this->get_course();
        $userid = $this->get_user()->id;

        // Handler object to update the room membership.
        $communication = new communication_handler($course->id);
        $communication->update_room_membership('add', [$userid]);

        // Test the tasks added.
        $adhoctask = \core\task\manager::get_adhoc_tasks('\\core_communication\\task\\communication_user_operations');
        $this->assertCount(1, $adhoctask);
    }

    /**
     * Test the removing members from a room operation.
     *
     * @return void
     * @covers ::update_room_membership
     * @covers ::is_update_required
     * @covers ::add_to_task_queue
     * @covers ::remove_members
     */
    public function test_remove_member_from_room_operation(): void {
        $this->resetAfterTest();
        $course = $this->get_course();
        $userid = $this->get_user()->id;

        // Handler object to update the room membership.
        $communication = new communication_handler($course->id);
        $communication->update_room_membership('remove', [$userid]);

        // Test the tasks added.
        $adhoctask = \core\task\manager::get_adhoc_tasks('\\core_communication\\task\\communication_user_operations');
        $this->assertCount(1, $adhoctask);
    }
}
