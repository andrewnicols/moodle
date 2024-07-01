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

namespace core_grades\output;

use core\output\renderer_base;
use templatable;
use renderable;

/**
 * The base class for the action bar in the gradebook pages.
 *
 * @package    core_grades
 * @copyright  2024 Catalyst IT Australia Pty Ltd
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class penalty_indicator implements templatable, renderable {
    /** @var int $decimals the decimal places */
    protected int $decimals;

    /** @var \grade_grade $grade user grade */
    protected \grade_grade $grade;

    /** @var bool $showfinalgrade whether to show the final grade */
    protected bool $showfinalgrade;

    /** @var bool $showgrademax whether to show the max grade */
    protected bool $showgrademax;

    /** @var array|null $penaltyicon icon to show if penalty is applied */
    protected ?array $penaltyicon;

    /**
     * The class constructor.
     *
     * @param int $decimals the decimal places
     * @param \grade_grade $grade user grade
     * @param bool $showfinalgrade whether to show the final grade (or show icon only)
     * @param bool $showgrademax whether to show the max grade
     * @param array|null $penaltyicon icon to show if penalty is applied
     */
    public function __construct(int $decimals, \grade_grade $grade,
                                bool $showfinalgrade = false, bool $showgrademax = false,
                                ?array $penaltyicon = null) {
        $this->decimals = $decimals;
        $this->grade = $grade;
        $this->showfinalgrade = $showfinalgrade;
        $this->showgrademax = $showgrademax;
        $this->penaltyicon = $penaltyicon;
    }

    /**
     * Returns the template for the actions bar.
     *
     * @return string
     */
    public function get_template(): string {
        return 'core_grades/penalty_indicator';
    }

    /**
     * Export the data for the mustache template.
     *
     * @param \renderer_base $output renderer to be used to render the penalty indicator.
     * @return array
     */
    public function export_for_template(renderer_base $output) {
        $penalty = format_float($this->grade->deductedmark, $this->decimals);
        $finalgrade = $this->showfinalgrade ? format_float($this->grade->finalgrade , $this->decimals) : null;
        $grademax = $this->showgrademax ? format_float($this->grade->get_grade_max(), $this->decimals) : null;
        $icon = $this->penaltyicon ?: ['name' => 'i/risk_xss', 'component' => 'core'];
        $info = get_string('gradepenalty_indicator_info', 'core_grades',  format_float($penalty, $this->decimals));

        $context = [
            'penalty' => $penalty,
            'finalgrade' => $finalgrade,
            'grademax' => $grademax,
            'icon' => $icon,
            'info' => $info,
        ];

        return $context;
    }
}
