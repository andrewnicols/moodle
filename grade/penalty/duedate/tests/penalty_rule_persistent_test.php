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

/**
 * Test penalty rule persistent.
 *
 * @package   gradepenalty_duedate
 * @copyright 2024 Catalyst IT Australia Pty Ltd
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class penalty_rule_persistent_test extends penalty_test_base {
    /**
     * Test get rules.
     *
     * @covers \gradepenalty_duedate\penalty_rule::get_rules
     */
    public function test_get_rules(): void {
        $this->resetAfterTest();
        $this->create_sample_rules();
        $rules = penalty_rule::get_rules(1);
        $this->assertCount(5, $rules);
        $this->assertEquals(10, $rules[0]->get('penalty'));
        $this->assertEquals(20, $rules[1]->get('penalty'));
        $this->assertEquals(30, $rules[2]->get('penalty'));
        $this->assertEquals(40, $rules[3]->get('penalty'));
        $this->assertEquals(50, $rules[4]->get('penalty'));

        // Test get_rules from parent.
        $rules = penalty_rule::get_records(['contextid' => 2]);
        $this->assertCount(0, $rules);
        // Parent rules.
        $rules = penalty_rule::get_rules(2);
        $this->assertCount(5, $rules);
        $this->assertEquals(10, $rules[0]->get('penalty'));
        $this->assertEquals(20, $rules[1]->get('penalty'));
        $this->assertEquals(30, $rules[2]->get('penalty'));
        $this->assertEquals(40, $rules[3]->get('penalty'));
        $this->assertEquals(50, $rules[4]->get('penalty'));
    }

    /**
     * Test reset rules.
     *
     * @covers \gradepenalty_duedate\penalty_rule::reset_rules
     */
    public function test_reset_rules(): void {
        $this->resetAfterTest();
        $this->create_sample_rules();
        penalty_rule::reset_rules(1);
        $rules = penalty_rule::get_rules(1);
        // Default 0% rule.
        $this->assertCount(1, $rules);
        $this->assertEquals(0, $rules[0]->get('penalty'));
    }

    /**
     * Test check if rules are overridden.
     *
     * @covers \gradepenalty_duedate\penalty_rule::is_overridden
     */
    public function test_is_overridden(): void {
        $this->resetAfterTest();

        // System context.
        $this->create_sample_rules();
        $this->assertFalse(penalty_rule::is_overridden(1));

        // Test with overridden rules.
        $this->create_sample_rules(2);
        $this->assertTrue(penalty_rule::is_overridden(2));
    }

    /**
     * Test check if rules are inherited.
     *
     * @covers \gradepenalty_duedate\penalty_rule::is_inherited
     */
    public function test_is_inherited(): void {
        $this->resetAfterTest();

        // System context.
        $this->create_sample_rules();
        $this->assertFalse(penalty_rule::is_inherited(1));

        // Create a course.
        $course = $this->getDataGenerator()->create_course();
        $coursecontextid = context_course::instance($course->id)->id;

        // There is no rules created at course context, so they are inherited rules.
        $this->assertTrue(penalty_rule::is_inherited($coursecontextid));

        // Create sample rules at course context, they are not considered inherited.
        $this->create_sample_rules($coursecontextid);
        $this->assertFalse(penalty_rule::is_inherited($coursecontextid));

        // Remove the rules from the parent context.
        penalty_rule::reset_rules(1);
        $this->assertFalse(penalty_rule::is_inherited($coursecontextid));
    }
}
