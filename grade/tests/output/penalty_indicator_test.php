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

use advanced_testcase;
use grade_grade;

/**
 * Test class for penalty_indicator
 *
 * @package   core_grades
 * @copyright 2024 Catalyst IT Australia Pty Ltd
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class penalty_indicator_test extends advanced_testcase {
    /**
     * Data provider for test_export_for_template
     * @return array
     */
    public static function export_for_template_provider(): array {
        return [
            // Default icon, with final grade and max grade.
            [
                'html' => <<<EOD
<span class="penalty-indicator-icon" title="Late penalty applied -10.00 marks">
        <i class="icon fa fa-triangle-exclamation text-danger fa-fw " aria-hidden="true"  ></i>
    </span>
    <span class="penalty-indicator-value">
            90.00 / 100.00
    </span>
EOD,
                'icon' => [],
                'penalty' => 10,
                'finalgrade' => 90,
                'grademax' => 100,
                'showfinalgrade' => true,
                'showmaxgrade' => true,
            ],
            // Custom icon, without max grade.
            [
                'html' => <<<EOD
<span class="penalty-indicator-icon" title="Late penalty applied -10.00 marks">
        <i class="icon fa fa-flag fa-fw " aria-hidden="true"  ></i>
    </span>
    <span class="penalty-indicator-value">
            90.00
    </span>
EOD,
                'icon' => ['name' => 'i/flagged', 'component' => 'core'],
                'penalty' => 10,
                'finalgrade' => 90,
                'grademax' => 100,
                'showfinalgrade' => true,
                'showmaxgrade' => false,
            ],
            // Icon only.
            [
                'html' => <<<EOD
<span class="penalty-indicator-icon" title="Late penalty applied -10.00 marks">
        <i class="icon fa fa-triangle-exclamation text-danger fa-fw " aria-hidden="true"  ></i>
    </span>
EOD,
                'icon' => [],
                'penalty' => 10,
                'finalgrade' => 90,
                'grademax' => 100,
                'showfinalgrade' => false,
                'showmaxgrade' => false,
            ],

        ];
    }

    /**
     * Test penalty_indicator
     *
     * @dataProvider export_for_template_provider
     *
     * @covers \core_grades\output\penalty_indicator
     *
     * @param string $expectedhtml The expected html
     * @param array $icon icon to display before the penalty
     * @param float $penalty The penalty
     * @param float $finalgrade The final grade
     * @param float $grademax The max grade
     * @param bool $showfinalgrade Whether to show the final grade
     * @param bool $showgrademax Whether to show the max grade
     */
    public function test_export_for_template(string $expectedhtml, array $icon, float $penalty,
                                             float $finalgrade, float $grademax,
                                             bool $showfinalgrade, bool $showgrademax): void {
        global $PAGE, $DB;

        $this->resetAfterTest();

        // Create a course.
        $course = $this->getDataGenerator()->create_course();

        // Create a user and enrol them in the course.
        $user = $this->getDataGenerator()->create_and_enrol($course);

        // Create an assignment.
        $assign = $this->getDataGenerator()->create_module('assign', ['course' => $course]);

        // Create a grade item.
        $gradeitem = \grade_item::fetch(['iteminstance' => $assign->id, 'itemtype' => 'mod', 'itemmodule' => 'assign']);

        $DB->set_field('grade_items', 'grademax', $grademax, ['id' => $gradeitem->id]);

        // Create a grade.
        $grade = new grade_grade();
        $grade->itemid = $gradeitem->id;
        $grade->timemodified = time();
        $grade->userid = $user->id;
        $grade->finalgrade = $finalgrade;
        $grade->deductedmark = $penalty;
        $grade->insert();

        $indicator = new \core_grades\output\penalty_indicator(2, $grade, $showfinalgrade, $showgrademax, $icon);
        $renderer = $PAGE->get_renderer('core_grades');
        $html = $renderer->render_penalty_indicator($indicator);

        $this->assertEquals($expectedhtml, $html);
    }
}
