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

namespace core_grades\local\penalty\test\hooks;

use core_grades\hook\before_penalty_applied;

/**
 * Hook fixtures for testing of hooks.
 *
 * @package   core_grades
 * @copyright 2024 Catalyst IT Australia Pty Ltd
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class plugin1_hook_listener {
    /**
     * Apply penalty.
     *
     * @param before_penalty_applied $hook
     * @return void
     */
    public static function apply_penalty(
        \core_grades\hook\before_penalty_applied $hook
    ): void {
        // Dates are available in the hook.
        debugging('Submission date: ' . $hook->submissiondate);
        debugging('Due date: ' . $hook->duedate);

        // Deduct 10% of the maximum grade.
        $deductedgrade = $hook->gradeitem->grademax * 0.2;
        $grademax = format_float($hook->gradeitem->grademax);
        debugging("fake_deduction: Deducting 20% of the maximum grade");
        $hook->apply_penalty('fake_deduction', $deductedgrade);
    }
}
