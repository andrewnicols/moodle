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

use core\hook\stoppable_trait;
use grade_item;

/**
 * Trait for providing the common methods for the grade penalty hooks.
 *
 * @package   core_grades
 * @copyright 2024 Catalyst IT Australia Pty Ltd
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
trait grade_penalty_handler {
    use stoppable_trait;

    /**
     * Constructor for the hook.
     *
     * @param int $userid The user id
     * @param grade_item $gradeitem The grade item object
     * @param int $submissiondate the submission date
     * @param int $duedate the due date
     * @param float $gradebeforepenalty original final grade
     * @param float $deductedpercentage the deducted percentage from final grade
     * @param float $deductedgrade the deducted grade
     * @param ?float $gradeafterpenalty grade after deduction
     */
    public function __construct(
        /** @var int The user id */
        public readonly int $userid,
        /** @var grade_item $gradeitem the grade item object*/
        public readonly grade_item $gradeitem,
        /** @var float the submission date */
        public readonly int $submissiondate,
        /** @var float the due date */
        public readonly int $duedate,
        /** @var float original final grade */
        private float $gradebeforepenalty,
        /** @var int the deducted percentage from final grade */
        private float $deductedpercentage = 0.0,
        /** @var float the deducted grade */
        private float $deductedgrade = 0.0,
        /** @var ?float grade after deduction */
        private ?float $gradeafterpenalty = null,
    ) {
        if ($this->gradeafterpenalty === null) {
            $this->gradeafterpenalty = $this->gradebeforepenalty;
        }
    }

    /**
     * Get grade before penalty is applied.
     *
     * @return float The penalized grade
     */
    public function get_grade_before_penalty(): float {
        return $this->gradebeforepenalty;
    }

    /**
     * Get the penalized grade.
     *
     * @return float The penalized grade
     */
    public function get_grade_after_penalty(): float {
        return $this->gradeafterpenalty;
    }

    /**
     * Get the deducted percentage.
     *
     */
    public function get_deducted_percentage(): float {
        return $this->deductedpercentage;
    }

    /**
     * Get the deducted grade.
     *
     */
    public function get_deducted_grade(): float {
        return $this->deductedgrade;
    }

}
