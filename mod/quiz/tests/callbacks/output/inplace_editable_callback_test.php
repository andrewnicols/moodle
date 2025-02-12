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

namespace mod_quiz\callbacks\output;

use core_external\external_api;
use mod_quiz\quiz_settings;

/**
 * Tests for Quiz Inplace Editables.
 *
 * @package    mod_quiz
 * @category   test
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(\mod_quiz\callbacks\output\inplace_editable_callback::class)]
final class inplace_editable_callback_test extends \advanced_testcase {
    /**
     * Data provider for summarise_response() test cases.
     *
     * @return \Iterator
     */
    public static function provider(): \Iterator {
        yield 'set to A1' => [1, 'A1'];
        yield 'set with HTML characters' => [2, 'A & &amp; <-:'];
        yield 'set to integer' => [3, '3'];
        yield 'set to blank' => [4, ''];
        yield 'set with Unicode characters' => [1, 'L\'Aina Lluís^'];
        yield 'set with Unicode at the truncation point' => [1, '123456789012345碁'];
        yield 'set with HTML Char at the truncation point' => [1, '123456789012345>'];
    }

    /**
     * Test customised and automated question numbering for a given slot number and customised value.
     *
     * @param int $slotnumber
     * @param string $newvalue
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('provider')]
    public function test_mod_quiz_inplace_editable(
        int $slotnumber,
        string $newvalue,
    ): void {
        global $CFG;
        require_once($CFG->dirroot . '/lib/external/externallib.php');
        $this->resetAfterTest();

        $this->setAdminUser();
        $course = self::getDataGenerator()->create_course();
        $quiz = $this->getDataGenerator()->create_module('quiz', ['course' => $course->id, 'sumgrades' => 1]);
        $cm = get_coursemodule_from_id('quiz', $quiz->cmid);

        // Add few questions to the quiz.
        $questiongenerator = $this->getDataGenerator()->get_plugin_generator('core_question');
        $cat = $questiongenerator->create_question_category();

        $question = $questiongenerator->create_question('truefalse', null, ['category' => $cat->id]);
        quiz_add_quiz_question($question->id, $quiz);

        $question = $questiongenerator->create_question('shortanswer', null, ['category' => $cat->id]);
        quiz_add_quiz_question($question->id, $quiz);

        $question = $questiongenerator->create_question('multichoice', null, ['category' => $cat->id]);
        quiz_add_quiz_question($question->id, $quiz);

        $question = $questiongenerator->create_question('numerical', null, ['category' => $cat->id]);
        quiz_add_quiz_question($question->id, $quiz);

        // Create the quiz object.
        $quizobj = new quiz_settings($quiz, $cm, $course);
        $structure = $quizobj->get_structure();

        $slots = $structure->get_slots();
        $this->assertEquals(4, count($slots));

        $slotid = $structure->get_slot_id_for_slot($slotnumber);

        $result = \core_external::update_inplace_editable('mod_quiz', 'slotdisplaynumber', $slotid, $newvalue);
        $result = external_api::clean_returnvalue(\core_external::update_inplace_editable_returns(), $result);

        $this->assertEquals($slotid, $result['itemid']);
        if ($newvalue === '' || is_null($newvalue)) {
            // Check against default.
            $this->assertEquals($slotnumber, $result['displayvalue']);
            $this->assertEquals($slotnumber, $result['value']);
        } else {
            // Check against the custom number.
            $this->assertEquals(s($newvalue), $result['displayvalue']);
            $this->assertEquals($newvalue, $result['value']);
        }
    }
}
