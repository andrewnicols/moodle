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

use core_grades\hook\after_penalty_applied;

/**
 * Hook fixtures for testing of hooks.
 *
 * @package   core_grades
 * @copyright 2024 Catalyst IT Australia Pty Ltd
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class plugin3_hook_listener {
    /**
     * Apply penalty.
     *
     * @param after_penalty_applied $hook
     * @return void
     */
    public static function show_debugging(
        \core_grades\hook\after_penalty_applied $hook
    ): void {
        debugging('Grade before: ' . $hook->get_grade_before_penalty());
        debugging('Grade after: ' . $hook->get_grade_after_penalty());
        debugging('Deducted percentage: ' . $hook->get_deducted_percentage());
        debugging('Deducted grade: ' . $hook->get_deducted_grade());
    }
}
