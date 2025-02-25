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

namespace gradepenalty_duedate;

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
final class hook_callbacks {
    /**
     * Calculate the penalty and update the hook object.
     * The hook dispatcher is responsible for applying the penalty to the grade.
     *
     * @param before_penalty_applied $hook
     * @return void
     */
    public static function calculate_penalty(before_penalty_applied $hook): void {
        // Calculate the deducted grade based on the max grade.
        $cm = get_coursemodule_from_instance($hook->gradeitem->itemmodule, $hook->gradeitem->iteminstance);
        $deductedpercentage = self::get_penalty_from_rules($cm, $hook->submissiondate, $hook->duedate);
        $deductedgrade = $hook->gradeitem->grademax * $deductedpercentage / 100;
        $hook->aggregate_penalty('duedate', $deductedgrade);
    }

    /**
     * Get the penalty percentage from the most appropriate penalty rule based on the submission date and the due date.
     *
     * @param stdClass $cm The course module object.
     * @param int $submissiondate The submission date.
     * @param int $duedate The due date.
     * @return float the deducted percentage.
     */
    public static function get_penalty_from_rules(stdClass $cm, int $submissiondate, int $duedate): float {
        // Get the difference between the submission date and the due date.
        $diff = $submissiondate - $duedate;

        // Return if the due date is after the submission date.
        if ($diff <= 0) {
            return 0;
        }

        // Get all penalty rules, ordered by the highest penalty first.
        $penaltyrules = self::find_effective_penalty_rules($cm);

        // Return if there are no penalty rules.
        if (empty($penaltyrules)) {
            return 0;
        }

        // Return the first applicable penalty rule.
        foreach ($penaltyrules as $penaltyrule) {
            if ($diff <= $penaltyrule->get('overdueby')) {
                return $penaltyrule->get('penalty');
            }
        }

        // Return the last penalty rule if the difference exceeds the overdueby value of the last rule.
        $lastrule = end($penaltyrules);
        if ($diff > $lastrule->get('overdueby')) {
            return $lastrule->get('penalty');
        }

        // Return if no penalty rule is applicable.
        return 0;
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
        $coursecontext = context_course::instance($cm->course);
        $systemcontext = context_system::instance();

        $contextids = [
            $modulecontext->id,
            $coursecontext->id,
            $systemcontext->id,
        ];

        // Get all penalty rules in one query.
        $select = 'contextid IN (?, ?, ?)';
        $penaltyrules = penalty_rule::get_records_select($select, $contextids, 'sortorder');

        // Filter the penalty rules based on the context hierarchy.
        $modulerules = array_filter($penaltyrules, function ($penaltyrule) use ($modulecontext): bool {
            return (int)$penaltyrule->get('contextid') === (int)$modulecontext->id;
        });

        if (!empty($modulerules)) {
            return $modulerules;
        }

        $courserules = array_filter($penaltyrules, function ($penaltyrule) use ($coursecontext): bool {
            return (int)$penaltyrule->get('contextid') === (int)$coursecontext->id;
        });

        if (!empty($courserules)) {
            return $courserules;
        }

        $systemrules = array_filter($penaltyrules, function ($penaltyrule) use ($systemcontext): bool {
            return (int)$penaltyrule->get('contextid') === (int)$systemcontext->id;
        });

        return $systemrules;
    }
}
