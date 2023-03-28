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

namespace core_communication\task;

use core\task\adhoc_task;
use core_communication\communication;
use core_communication\instance_data;

/**
 * Class communication_room_operations to manage communication provider room operations from provider plugins.
 *
 * This task will handle create, update, delete for the provider room.
 *
 * @package    core_communication
 * @copyright  2023 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class user_operation_processor extends adhoc_task {

    public function execute() {
        // Initialize the custom data operation to be used for the action.
        $data = $this->get_custom_data();
        $operation = $data->operation;

        // Call the communication api to action the passed operation.
        $communication = communication::load_by_id($data->id);
        $communication->$operation($data->userids);
    }

    public static function queue(
        int $communicationid,
        string $action,
        array $userids,
    ): void {
        // Add ad-hoc task to update the provider room.
        $task = new self();
        $task->set_custom_data([
            'id' => $communicationid,
            'operation' => $action,
            'userids' => $userids,
        ]);

        // Queue the task for the next run.
        \core\task\manager::queue_adhoc_task($task);
    }
}
