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

/**
 * Activity criteria tests.
 *
 * @package    core_completion
 * @category   test
 * @copyright  2017 Frédéric Massart <fred@branchup.tech>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->libdir . '/completionlib.php');
require_once($CFG->dirroot . '/completion/criteria/completion_criteria_activity.php');
require_once($CFG->dirroot . '/mod/assign/locallib.php');

/**
 * Activity criteria testcase.
 *
 * @package    core_completion
 * @category   test
 * @copyright  2017 Frédéric Massart <fred@branchup.tech>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class core_completion_criteria_activity_testcase extends advanced_testcase {

    public function setUp() {
        global $CFG;
        $CFG->enablecompletion = true;
        $this->resetAfterTest();
    }

    /**
     * Tests the review method.
     *
     * @return void
     */
    public function test_review() {
        $this->setAdminUser();
        $dg = $this->getDataGenerator();

        $student = $dg->create_user();
        $course = $dg->create_course(['enablecompletion' => 1]);

        // Create 4 assignments. A manually completed, and three automatically completed based on grade. The first one
        // does not have any grade to pass, the last one will be marked as failed.
        $assign1 = $dg->create_module('assign', ['course' => $course->id, 'completion' => COMPLETION_TRACKING_MANUAL]);
        $assign2 = $dg->create_module('assign', ['course' => $course->id, 'completion' => COMPLETION_TRACKING_AUTOMATIC,
            'completionusegrade' => true]);
        $assign3 = $dg->create_module('assign', ['course' => $course->id, 'completion' => COMPLETION_TRACKING_AUTOMATIC,
            'completionusegrade' => true, 'gradepass' => 70]);
        $assign4 = $dg->create_module('assign', ['course' => $course->id, 'completion' => COMPLETION_TRACKING_AUTOMATIC,
            'completionusegrade' => true, 'gradepass' => 70]);
        $cmassign1 = get_coursemodule_from_id('assign', $assign1->cmid);
        $cmassign2 = get_coursemodule_from_id('assign', $assign2->cmid);
        $cmassign3 = get_coursemodule_from_id('assign', $assign3->cmid);
        $cmassign4 = get_coursemodule_from_id('assign', $assign4->cmid);
        $dg->enrol_user($student->id, $course->id, 'student');

        // Set the activity criterion.
        $critdata = new stdClass();
        $critdata->id = $course->id;
        $critdata->criteria_activity = [
            $assign1->cmid => 1,
            $assign2->cmid => 1,
            $assign3->cmid => 1,
            $assign4->cmid => 1
        ];
        $criterion = new completion_criteria_activity();
        $criterion->update_config($critdata);

        // Activity criteria mess.
        $crit1 = new completion_criteria_activity(['course' => $course->id, 'moduleinstance' => $assign1->cmid]);
        $crit2 = new completion_criteria_activity(['course' => $course->id, 'moduleinstance' => $assign2->cmid]);
        $crit3 = new completion_criteria_activity(['course' => $course->id, 'moduleinstance' => $assign3->cmid]);
        $crit4 = new completion_criteria_activity(['course' => $course->id, 'moduleinstance' => $assign4->cmid]);
        $complcrit1 = new completion_criteria_completion([
            'userid' => $student->id,
            'course' => $course->id,
            'criteriaid' => $crit1->id,
        ]);
        $complcrit2 = new completion_criteria_completion([
            'userid' => $student->id,
            'course' => $course->id,
            'criteriaid' => $crit2->id,
        ]);
        $complcrit3 = new completion_criteria_completion([
            'userid' => $student->id,
            'course' => $course->id,
            'criteriaid' => $crit3->id,
        ]);
        $complcrit4 = new completion_criteria_completion([
            'userid' => $student->id,
            'course' => $course->id,
            'criteriaid' => $crit4->id,
        ]);
        $this->assertFalse($crit1->review($complcrit1, false));
        $this->assertFalse($crit2->review($complcrit2, false));
        $this->assertFalse($crit3->review($complcrit3, false));
        $this->assertFalse($crit4->review($complcrit4, false));
        $this->assertFalse($complcrit1->is_complete());
        $this->assertFalse($complcrit2->is_complete());
        $this->assertFalse($complcrit3->is_complete());
        $this->assertFalse($complcrit4->is_complete());

        // Mark as complete.
        $info = new completion_info($course);
        $info->update_state($cmassign1, COMPLETION_COMPLETE, $student->id);

        $gi = grade_item::fetch(['itemtype' => 'mod', 'itemmodule' => 'assign', 'iteminstance' => $assign2->id]);
        $gi->update_final_grade($student->id, 69);
        $gi = grade_item::fetch(['itemtype' => 'mod', 'itemmodule' => 'assign', 'iteminstance' => $assign3->id]);
        $gi->update_final_grade($student->id, 71);
        $gi = grade_item::fetch(['itemtype' => 'mod', 'itemmodule' => 'assign', 'iteminstance' => $assign4->id]);
        $gi->update_final_grade($student->id, 69);

        // Now should be complete, but we did not mark it so it's still incomplete in the completion statuses.
        $this->assertTrue($crit1->review($complcrit1, false));
        $this->assertTrue($crit2->review($complcrit2, false));
        $this->assertTrue($crit3->review($complcrit3, false));
        $this->assertTrue($crit4->review($complcrit4, false));
        $this->assertFalse($complcrit1->is_complete());
        $this->assertFalse($complcrit2->is_complete());
        $this->assertFalse($complcrit3->is_complete());
        $this->assertFalse($complcrit4->is_complete());

        // Now we shoudl be writing in the completion status.
        $this->assertTrue($crit1->review($complcrit1, true));
        $this->assertTrue($crit2->review($complcrit2, true));
        $this->assertTrue($crit3->review($complcrit3, true));
        $this->assertTrue($crit4->review($complcrit4, true));
        $this->assertTrue($complcrit1->is_complete());
        $this->assertTrue($complcrit2->is_complete());
        $this->assertTrue($complcrit3->is_complete());
        $this->assertTrue($complcrit4->is_complete());
    }

    /**
     * Tests the review method.
     *
     * @return void
     */
    public function test_cron() {
        $this->setAdminUser();
        $dg = $this->getDataGenerator();

        $student = $dg->create_user();
        $course = $dg->create_course(['enablecompletion' => 1]);

        // Create 4 assignments. A manually completed, and three automatically completed based on grade. The first one
        // does not have any grade to pass, the last one will be marked as failed.
        $assign1 = $dg->create_module('assign', ['course' => $course->id, 'completion' => COMPLETION_TRACKING_MANUAL]);
        $assign2 = $dg->create_module('assign', ['course' => $course->id, 'completion' => COMPLETION_TRACKING_AUTOMATIC,
            'completionusegrade' => true]);
        $assign3 = $dg->create_module('assign', ['course' => $course->id, 'completion' => COMPLETION_TRACKING_AUTOMATIC,
            'completionusegrade' => true, 'gradepass' => 70]);
        $assign4 = $dg->create_module('assign', ['course' => $course->id, 'completion' => COMPLETION_TRACKING_AUTOMATIC,
            'completionusegrade' => true, 'gradepass' => 70]);
        $cmassign1 = get_coursemodule_from_id('assign', $assign1->cmid);
        $cmassign2 = get_coursemodule_from_id('assign', $assign2->cmid);
        $cmassign3 = get_coursemodule_from_id('assign', $assign3->cmid);
        $cmassign4 = get_coursemodule_from_id('assign', $assign4->cmid);
        $dg->enrol_user($student->id, $course->id, 'student');

        // Set the activity criterion.
        $critdata = new stdClass();
        $critdata->id = $course->id;
        $critdata->criteria_activity = [
            $assign1->cmid => 1,
            $assign2->cmid => 1,
            $assign3->cmid => 1,
            $assign4->cmid => 1
        ];
        $criterion = new completion_criteria_activity();
        $criterion->update_config($critdata);

        // Activity criteria mess.
        $crit1 = new completion_criteria_activity(['course' => $course->id, 'moduleinstance' => $assign1->cmid]);
        $crit2 = new completion_criteria_activity(['course' => $course->id, 'moduleinstance' => $assign2->cmid]);
        $crit3 = new completion_criteria_activity(['course' => $course->id, 'moduleinstance' => $assign3->cmid]);
        $crit4 = new completion_criteria_activity(['course' => $course->id, 'moduleinstance' => $assign4->cmid]);
        $complcrit1 = new completion_criteria_completion([
            'userid' => $student->id,
            'course' => $course->id,
            'criteriaid' => $crit1->id,
        ]);
        $complcrit2 = new completion_criteria_completion([
            'userid' => $student->id,
            'course' => $course->id,
            'criteriaid' => $crit2->id,
        ]);
        $complcrit3 = new completion_criteria_completion([
            'userid' => $student->id,
            'course' => $course->id,
            'criteriaid' => $crit3->id,
        ]);
        $complcrit4 = new completion_criteria_completion([
            'userid' => $student->id,
            'course' => $course->id,
            'criteriaid' => $crit4->id,
        ]);
        $this->assertFalse($complcrit1->is_complete());
        $this->assertFalse($complcrit2->is_complete());
        $this->assertFalse($complcrit3->is_complete());
        $this->assertFalse($complcrit4->is_complete());

        // Mark as complete.
        $info = new completion_info($course);
        $info->update_state($cmassign1, COMPLETION_COMPLETE, $student->id);

        $gi = grade_item::fetch(['itemtype' => 'mod', 'itemmodule' => 'assign', 'iteminstance' => $assign2->id]);
        $gi->update_final_grade($student->id, 69);
        $gi = grade_item::fetch(['itemtype' => 'mod', 'itemmodule' => 'assign', 'iteminstance' => $assign3->id]);
        $gi->update_final_grade($student->id, 71);
        $gi = grade_item::fetch(['itemtype' => 'mod', 'itemmodule' => 'assign', 'iteminstance' => $assign4->id]);
        $gi->update_final_grade($student->id, 69);

        // Simulate cron run.
        $cronrunner = new completion_criteria_activity();
        $cronrunner->cron();

        // Validate new completion statuses.
        $complcrit1 = new completion_criteria_completion([
            'userid' => $student->id,
            'course' => $course->id,
            'criteriaid' => $crit1->id,
        ]);
        $complcrit2 = new completion_criteria_completion([
            'userid' => $student->id,
            'course' => $course->id,
            'criteriaid' => $crit2->id,
        ]);
        $complcrit3 = new completion_criteria_completion([
            'userid' => $student->id,
            'course' => $course->id,
            'criteriaid' => $crit3->id,
        ]);
        $complcrit4 = new completion_criteria_completion([
            'userid' => $student->id,
            'course' => $course->id,
            'criteriaid' => $crit4->id,
        ]);
        $this->assertTrue($complcrit1->is_complete());
        $this->assertTrue($complcrit2->is_complete());
        $this->assertTrue($complcrit3->is_complete());
        $this->assertTrue($complcrit4->is_complete());
    }
}
