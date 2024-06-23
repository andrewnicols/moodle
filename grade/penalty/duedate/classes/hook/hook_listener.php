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

namespace gradepenalty_duedate\hook;

use context_course;
use context_module;
use context_system;
use core_grades\hook\before_penalty_applied;
use gradepenalty_duedate\penalty_rule;
use stdClass;

/**
 * Callbacks for grade penalty hook.
 *
 * @package   gradepenalty_duedate
 * @copyright 2024 Catalyst IT Australia Pty Ltd
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class hook_listener {
    /**
     * Apply penalty.
     *
     * @param before_penalty_applied $hook
     * @return void
     */
    public static function apply_penalty(
        before_penalty_applied $hook
    ): void {
        // Calculate the deducted grade based on the max grade.
        $cm = get_coursemodule_from_instance($hook->gradeitem->itemmodule, $hook->gradeitem->iteminstance);
        $deductedpercentage = self::calculate_penalty_percentage($cm, $hook->submissiondate, $hook->duedate);
        $deductedgrade = $hook->gradeitem->grademax * $deductedpercentage / 100;
        $hook->apply_penalty('duedate', $deductedgrade);
    }

    /**
     * The penalty percentage will be applied.
     * The percentage will be calculated based on the submission date and the due date.
     *
     * @param stdClass $cm The course module object.
     * @param int $submissiondate The submission date.
     * @param int $duedate The due date.
     * @return float the deducted percentage.
     */
    public static function calculate_penalty_percentage(stdClass $cm, int $submissiondate, int $duedate): float {
        $penalty = 0.0;

        // Calculate the difference between the submission date and the due date.
        $diff = $submissiondate - $duedate;

        // If the submission date is after the due date, calculate the penalty.
        if ($diff > 0) {
            // Get all penalty rules, ordered by the highest penalty first.
            $penaltyrules = self::find_effective_penalty_rules($cm);

            // Check each rule to see which rule will apply.
            if (!empty($penaltyrules)) {
                // Check if the diff is greater than the last rule.
                if ($diff > $penaltyrules[count($penaltyrules) - 1]->get('overdueby')) {
                    // We will have the same penalty as the last rule.
                    $penalty = $penaltyrules[count($penaltyrules) - 1]->get('penalty');
                } else {
                    foreach ($penaltyrules as $penaltyrule) {
                        if ($diff <= $penaltyrule->get('overdueby')) {
                            $penalty = $penaltyrule->get('penalty');
                            break;
                        }
                    }
                }
            }
        }

        // Calculate the deducted percentage.
        return $penalty;
    }

    /**
     * Find effective penalty rule which will be applied the course module.
     *
     * @param stdClass $cm The course module object.
     * @return array
     */
    private static function find_effective_penalty_rules($cm): array {
        // Course module context id.
        $modulecontext = context_module::instance($cm->id);

        // Get all penalty rules, ordered by the highest penalty first.
        $penaltyrules = penalty_rule::get_records(['contextid' => $modulecontext->id], 'sortorder');

        // If there is no penalty rule, go to the course context.
        if (empty($penaltyrules)) {
            // Find course content.
            $course = get_course($cm->course);
            $coursecontext = context_course::instance($course->id);

            $penaltyrules = penalty_rule::get_records(['contextid' => $coursecontext->id], 'sortorder');
        }

        // If there is no penalty rule, go to the system context.
        if (empty($penaltyrules)) {
            $systemcontext = context_system::instance();
            $penaltyrules = penalty_rule::get_records(['contextid' => $systemcontext->id], 'sortorder');
        }

        return $penaltyrules;
    }
}
