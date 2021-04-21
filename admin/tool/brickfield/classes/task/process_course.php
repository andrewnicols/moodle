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

namespace tool_brickfield\task;

use tool_brickfield\accessibility;
use tool_brickfield\scheduler;

/**
 * Adhoc task to process a specific course upon request.
 *
 * @package    tool_brickfield
 * @copyright  2021 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class process_course extends \core\task\adhoc_task {
    /**
     * Execute the task.
     */
    public function execute(): void {
        // If this feature has been disabled do nothing.
        if (!accessibility::is_accessibility_enabled()) {
            return;
        }

        $data = $this->get_custom_data();
        scheduler::process_scheduled_item($data->id);
    }
}
