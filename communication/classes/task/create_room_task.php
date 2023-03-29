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

/**
 * Handle the task of creating a room.
 *
 * @package    core_communication
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class create_room_task extends adhoc_task {

    public function execute() {
        // Initialize the custom data operation to be used for the action.
        $data = $this->get_custom_data();

        // Call the communication api to action the passed operation.
        // We must override the provider with the one stored in the data in case the provider has changed.
        $communication = communication::load_by_id($data->id);
        if ($communication->get_provider() !== $data->provider) {
            mtrace("Skipping room creation because the provider no longer matches the requested provider");
            return;
        }
        $communication->get_room_provider()->create_room();
    }

    /**
     * Queue the task to create a new room based on the communication API record.
     *
     * @param communication $communication
     * @param array $userids
     */
    public static function queue(
        communication $communication,
    ): void {
        // Add ad-hoc task to update the provider room.
        $task = new self();
        $task->set_custom_data([
            'id' => $communication->get_id(),
            'provider' => $communication->get_provider(),
        ]);

        // Queue the task for the next run.
        \core\task\manager::queue_adhoc_task($task);
    }
}
