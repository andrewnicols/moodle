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

namespace mod_assign\hook;

use core_grades\hook\before_penalty_recalculation;
use mod_assign\task\recalculate_penalties;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/mod/assign/locallib.php');

/**
 * Hook callbacks.
 *
 * @package    mod_assign
 * @copyright  2024 Catalyst IT Australia
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class hook_callbacks {

    /**
     * Callback for before_penalty_recalculation.
     *
     * @param before_penalty_recalculation $hook
     * @return void
     */
    public static function extend_penalty_recalculation(before_penalty_recalculation $hook): void {
        global $DB;

        switch ($hook->context->contextlevel) {
            case CONTEXT_MODULE:
                $cmid = $hook->context->instanceid;
                $cm = get_coursemodule_from_id('assign', $cmid, 0, false, MUST_EXIST);
                recalculate_penalties::queue($cm->instance, $hook->usermodified);
                break;
            case CONTEXT_COURSE:
                $courseid = $hook->context->instanceid;
                $assigns = $DB->get_records('assign', ['course' => $courseid]);
                foreach ($assigns as $assign) {
                    recalculate_penalties::queue($assign->id, $hook->usermodified);
                }
                break;
        }
    }
}
