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

namespace core_grades\local\penalty;

use grade_item;
use stdClass;

/**
 * Test for manager class.
 *
 * @package   core_grades
 * @copyright 2024 Catalyst IT Australia Pty Ltd
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class penalty_test extends \advanced_testcase {
    /** @var stdClass $user user whose grade will be updated */
    private $user;

    /** @var grade_item $gradeitem grade item */
    private $gradeitem;

    /** @var stdClass $course course */
    private $course;

    /** @var stdClass $assign assignment */
    private $assign;

    /**
     * Setup required fixtures, course, assign, user.
     */
    private function setup_test(): void {
        // Hook mock up.
        require_once(__DIR__ . '/../../fixtures/hooks/plugin1_hook_listener.php');
        require_once(__DIR__ . '/../../fixtures/hooks/plugin2_hook_listener.php');
        require_once(__DIR__ . '/../../fixtures/hooks/plugin3_hook_listener.php');

        \core\di::set(
            \core\hook\manager::class,
            \core\hook\manager::phpunit_get_instance([
                'test_plugin1' => 'grade/tests/fixtures/hooks/hooks.php',
            ]),
        );

        // Create user, course and assignment.
        $this->user = $this->getDataGenerator()->create_user();
        $this->course = $this->getDataGenerator()->create_course();
        $this->assign = $this->getDataGenerator()->create_module('assign', ['course' => $this->course->id]);

        // Get grade item.
        $gradeitemparams = [
            'courseid' => $this->course->id,
            'itemtype' => 'mod',
            'itemmodule' => 'assign',
            'iteminstance' => $this->assign->id,
            'itemnumber' => 0,
        ];
        $this->gradeitem = grade_item::fetch($gradeitemparams);
    }

    /**
     * Update grade.
     *
     * @param float $rawgrade raw grade.
     */
    private function update_grade(float $rawgrade): void {
        grade_update('mod/assign', $this->course->id, 'mod', 'assign', $this->assign->id, 0,
            ['userid' => $this->user->id, 'rawgrade' => $rawgrade]);
    }

    /**
     * Get final grade
     *
     * @return float the final grade for current user.
     */
    private function get_final_grade(): float {
        return $this->gradeitem->get_final($this->user->id)->finalgrade;
    }

    /**
     * Data provider for test_apply_penalty.
     *
     * @return array test data.
     */
    public static function apply_penalty_provider(): array {
        return [
            // Deduction: 20% of max grade and bonus is a fixed grade of 10.
            [
                // The params: submissiondate, duedate, grademin, grademax.
                DAYSECS * 1, DAYSECS + 1, 0, 100,
                // And rawgrade, finalgrade, $enabledplugins.
                100, 100, ['fake_deduction', 'fake_bonus'],
                // And deductedgrade, deductedpercentage, expectedgrade.
                10, 10, 90,
            ],
            [
                // Zero grade, no penalty.
                DAYSECS * 1, DAYSECS + 1, 0, 100,
                0, 0, ['fake_deduction', 'fake_bonus'],
                0, 0, 0,
            ],
            // Bonus grade only.
            [
                // Cannot be more than max grade.
                DAYSECS * 1, DAYSECS + 1, 0, 100,
                100, 100, ['fake_bonus'],
                -10, -10, 100,
            ],
            [
                // Grade with 50 plus bonus of 10.
                DAYSECS * 1, DAYSECS + 1, 0, 100,
                50, 50, ['fake_bonus'],
                -10, -20, 60,
            ],
            // Deduction only.
            [
                // Deduct 20% of max grade.
                DAYSECS * 1, DAYSECS + 1, 0, 100,
                100, 100, ['fake_deduction'],
                20, 20, 80,
            ],
            [
                // Cannot be less than min grade.
                DAYSECS * 1, DAYSECS + 1, 0, 100,
                10, 10, ['fake_deduction'],
                20, 200, 0,
            ],
            // Max grade of 80.
            [
                // Cannot be more than max grade.
                DAYSECS * 1, DAYSECS + 1, 0, 80,
                80, 80, ['fake_bonus'],
                -10, -12.5, 80,
            ],
            [
                // Deduct 20% of max grade.
                DAYSECS * 1, DAYSECS + 1, 0, 80,
                80, 80, ['fake_deduction'],
                16, 20, 64,
            ],
            [
                // Cannot be less than min grade.
                DAYSECS * 1, DAYSECS + 1, 0, 80,
                10, 10, ['fake_deduction'],
                16, 160, 0,
            ],
            // Min grade of 50.
            [
                // Deduct 20% of max grade.
                DAYSECS * 1, DAYSECS + 1, 50, 100,
                100, 100, ['fake_deduction'],
                20, 20, 80,
            ],
            [
                // Cannot be less than min grade.
                DAYSECS * 1, DAYSECS + 1, 50, 100,
                50, 50, ['fake_deduction'],
                20, 40, 50,
            ],
        ];
    }

    /**
     * Test apply_penalty.
     *
     * @dataProvider apply_penalty_provider
     *
     * @covers       \core_grades\local\penalty\manager::apply_penalty
     * @covers       \core_grades\hook\before_penalty_applied
     * @covers       \core_grades\hook\after_penalty_applied
     *
     * @param int $submissiondate submission date
     * @param int $duedate due date
     * @param float $grademin grade min
     * @param float $grademax grade max
     * @param float $rawgrade raw grade
     * @param float $finalgrade final grade
     * @param array $enabledplugins enabled plugins
     * @param float $deductedgrade deducted grade
     * @param float $deductedpercentage deducted percentage
     * @param float $expectedgrade expected grade
     */
    public function test_apply_penalty(int $submissiondate, int $duedate, float $grademin, float $grademax,
                                       float $rawgrade, float $finalgrade, array $enabledplugins,
                                       float $deductedgrade, float $deductedpercentage, float $expectedgrade): void {
        global $DB;
        $this->resetAfterTest();
        $this->setup_test();

        // Update max/min grade.
        $DB->set_field('grade_items', 'grademin', $grademin, ['id' => $this->gradeitem->id]);
        $DB->set_field('grade_items', 'grademax', $grademax, ['id' => $this->gradeitem->id]);
        $this->gradeitem = grade_item::fetch(['id' => $this->gradeitem->id]);

        // Grade for the user.
        $this->update_grade($rawgrade);

        // Penalty is not enabled.
        apply_grade_penalty_to_user($this->user->id, $this->gradeitem, $submissiondate, $duedate);
        $this->assertEquals($finalgrade, $this->get_final_grade());

        // Enable penalty. But the assign module is not supported/enabled.
        set_config('gradepenalty_enabled', 1);
        apply_grade_penalty_to_user($this->user->id, $this->gradeitem, $submissiondate, $duedate);
        $this->assertEquals($finalgrade, $this->get_final_grade());

        // Enable assign module.
        set_config('gradepenalty_supportedplugins', 'quiz,assign');

        // Enable fake grade penalty plugins.
        foreach ($enabledplugins as $plugin) {
            \core\plugininfo\gradepenalty::enable_plugin($plugin, true);
        }

        // Apply penalty.
        apply_grade_penalty_to_user($this->user->id, $this->gradeitem, $submissiondate, $duedate);

        // Expect debugging messages from hooks.
        if ($rawgrade <= 0) {
            $expecteddebugmessages = [];
        } else {
            $expecteddebugmessages = [
                "Submission date: $submissiondate",
                "Due date: $duedate",
                "fake_deduction: Deducting 20% of the maximum grade",
                "fake_bonus: a fixed bonus grade of 10",
                "Grade before: $finalgrade",
                "Grade after: $expectedgrade",
                "Deducted percentage: $deductedpercentage",
                "Deducted grade: $deductedgrade",
            ];
        }
        $this->assertdebuggingcalledcount(count($expecteddebugmessages), $expecteddebugmessages);

        // Check expected final grade.
        $this->assertEquals($expectedgrade, $this->get_final_grade());
    }

    /**
     * Test with no grade.
     * The penalty should be only applied on existing grade.
     *
     * @covers       \core_grades\local\penalty\manager::apply_penalty
     * @covers       \core_grades\hook\before_penalty_applied
     * @covers       \core_grades\hook\after_penalty_applied
     */
    public function test_no_grade(): void {
        $this->resetAfterTest();
        $this->setup_test();
        // Enable grade penalty.
        set_config('gradepenalty_enabled', 1);
        set_config('gradepenalty_supportedplugins', 'quiz,assign');
        foreach (['test_plugin1', 'test_plugin2', 'test_plugin3'] as $plugin) {
            \core\plugininfo\gradepenalty::enable_plugin($plugin, true);
        }
        apply_grade_penalty_to_user($this->user->id, $this->gradeitem, DAYSECS, DAYSECS * 2);
        // There should be one debugging message.
        $messages = $this->getDebuggingMessages();
        $this->assertdebuggingcalledcount(1);
        $this->assertStringContainsString('No raw grade found for user', $messages[0]->message);
    }

    /**
     * Test when penalty is should not be applied
     *
     * @covers       \core_grades\local\penalty\manager::apply_penalty
     */
    public function test_no_penalty(): void {
        global $DB;
        $this->resetAfterTest();
        $this->setup_test();

        // Enable grade penalty.
        set_config('gradepenalty_enabled', 1);
        set_config('gradepenalty_supportedplugins', 'quiz,assign');
        foreach (['test_plugin1', 'test_plugin2', 'test_plugin3'] as $plugin) {
            \core\plugininfo\gradepenalty::enable_plugin($plugin, true);
        }

        // Zero grade.
        $this->update_grade(0);
        // No penalty should be applied.
        apply_grade_penalty_to_user($this->user->id, $this->gradeitem, DAYSECS, DAYSECS * 2);
        // No penalty hook should be called.
        $this->assertdebuggingcalledcount(0);

        // Overridden grade.
        $this->update_grade(100);
        // Set it as overridden.
        $DB->set_field('grade_grades', 'overridden', time(), [
            'itemid' => $this->gradeitem->id,
            'userid' => $this->user->id,
        ]);
        // No penalty should be applied.
        apply_grade_penalty_to_user($this->user->id, $this->gradeitem, DAYSECS, DAYSECS * 2);
        // No penalty hook should be called.
        $this->assertdebuggingcalledcount(0);
        // Remove overridden.
        $DB->set_field('grade_grades', 'overridden', 0, [
            'itemid' => $this->gradeitem->id,
            'userid' => $this->user->id,
        ]);
        apply_grade_penalty_to_user($this->user->id, $this->gradeitem, DAYSECS, DAYSECS * 2);
        // Expect debugging messages from hooks.
        $this->assertdebuggingcalledcount(8);

        // Locked grade.
        $this->update_grade(100);
        // Set it as locked.
        $DB->set_field('grade_grades', 'locked', time(), [
            'itemid' => $this->gradeitem->id,
            'userid' => $this->user->id,
        ]);
        // No penalty should be applied.
        apply_grade_penalty_to_user($this->user->id, $this->gradeitem, DAYSECS, DAYSECS * 2);
        // No penalty hook should be called.
        $this->assertdebuggingcalledcount(0);
    }
}
