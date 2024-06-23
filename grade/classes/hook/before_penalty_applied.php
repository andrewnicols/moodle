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

namespace core_grades\hook;

use core\plugininfo\gradepenalty;
use Psr\EventDispatcher\StoppableEventInterface;

/**
 * Hook before penalty is applied.
 *
 * This hook will be dispatched before the penalty is applied to the grade.
 * Allow plugins to do penalty calculations.
 *
 * @package   core_grades
 * @copyright 2024 Catalyst IT Australia Pty Ltd
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\core\attribute\label('Allow plugins to do penalty calculations.')]
#[\core\attribute\tags('grade')]
class before_penalty_applied implements StoppableEventInterface {
    use grade_penalty_handler;

    /**
     * Set deducted grade.
     * We restrict the hook to be used by grade penalty plugins only.
     *
     * @param string $pluginname the plugin name
     * @param float $deductedgrade The deducted grade
     */
    public function apply_penalty(string $pluginname, float $deductedgrade): void {
        // Check if the plugin is enabled.
        if (gradepenalty::is_plugin_enabled($pluginname)) {
            // Aggregate the deducted grade.
            $this->deductedgrade += $deductedgrade;

            // Update the final grade.
            $this->gradeafterpenalty = $this->gradebeforepenalty - $this->deductedgrade;
            // Cannot be negative.
            $this->gradeafterpenalty = max($this->gradeitem->grademin, $this->gradeafterpenalty);
            // Cannot be greater than the maximum grade.
            $this->gradeafterpenalty = min($this->gradeafterpenalty, $this->gradeitem->grademax);

            // Update the deducted percentage.
            // The percentage can be used by modules to calculate penalty for their own grade, such as assign_grade.
            $this->deductedpercentage = $this->deductedgrade / $this->gradebeforepenalty * 100;
        }
    }
}
