<?php
// This file is part of Moodle - https://moodle.org/
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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

namespace core;

/**
 * Unit tests for enrolment helpers.
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(enrolment::class)]
final class enrolment_test extends \advanced_testcase {
    /**
     * Test looking up the first matching course for a list of users.
     */
    public function test_get_first_matching_course_for_users(): void {
        $this->resetAfterTest();
        $generator = $this->getDataGenerator();

        $firstcourse = $generator->create_course();
        $secondcourse = $generator->create_course();
        $unrelatedcourse = $generator->create_course();
        $firstuser = $generator->create_user();
        $seconduser = $generator->create_user();
        $outsider = $generator->create_user();

        $generator->enrol_user($firstuser->id, $firstcourse->id);
        $generator->enrol_user($firstuser->id, $secondcourse->id);
        $generator->enrol_user($seconduser->id, $secondcourse->id);
        $generator->enrol_user($outsider->id, $unrelatedcourse->id);
        $enrolment = \core\di::get(enrolment::class);

        $coursebyuserid = $enrolment->get_first_matching_course_for_users(
            [$firstcourse->id, $secondcourse->id],
            [$firstuser->id, $seconduser->id, $outsider->id],
        );

        $this->assertSame((int) $firstcourse->id, $coursebyuserid[(int) $firstuser->id]);
        $this->assertSame((int) $secondcourse->id, $coursebyuserid[(int) $seconduser->id]);
        $this->assertArrayNotHasKey((int) $outsider->id, $coursebyuserid);
    }

    /**
     * Test that course ordering is preserved when the course list spans multiple queries.
     */
    public function test_get_first_matching_course_for_users_across_course_batches(): void {
        $this->resetAfterTest();
        $generator = $this->getDataGenerator();
        $firstcourse = $generator->create_course();
        $secondcourse = $generator->create_course();
        $user = $generator->create_user();
        $generator->enrol_user($user->id, $firstcourse->id);
        $generator->enrol_user($user->id, $secondcourse->id);
        $enrolment = \core\di::get(enrolment::class);
        $courseids = [
            ...range(1000000, 1000398),
            $firstcourse->id,
            $secondcourse->id,
        ];

        $coursebyuserid = $enrolment->get_first_matching_course_for_users($courseids, [$user->id]);

        $this->assertSame((int) $firstcourse->id, $coursebyuserid[(int) $user->id]);
    }

    /**
     * Test that the front page is used as a fallback after other courses.
     */
    public function test_get_first_matching_course_for_users_frontpage_fallback(): void {
        $this->resetAfterTest();
        $generator = $this->getDataGenerator();
        $firstcourse = $generator->create_course();
        $lastcourse = $generator->create_course();
        $firstuser = $generator->create_user();
        $lastuser = $generator->create_user();
        $unaffiliateduser = $generator->create_user();
        $generator->enrol_user($firstuser->id, $firstcourse->id);
        $generator->enrol_user($lastuser->id, $lastcourse->id);
        $enrolment = \core\di::get(enrolment::class);
        $userids = [$firstuser->id, $lastuser->id, $unaffiliateduser->id];
        for ($i = 0; $i < 98; $i++) {
            $userids[] = $generator->create_user()->id;
        }

        $coursebyuserid = $enrolment->get_first_matching_course_for_users(
            [$firstcourse->id, SITEID, $lastcourse->id],
            [...$userids, -1],
        );
        $frontpageonly = $enrolment->get_first_matching_course_for_users([SITEID], [$firstuser->id]);

        $this->assertSame((int) $firstcourse->id, $coursebyuserid[(int) $firstuser->id]);
        $this->assertSame((int) $lastcourse->id, $coursebyuserid[(int) $lastuser->id]);
        $this->assertSame((int) SITEID, $coursebyuserid[(int) $unaffiliateduser->id]);
        $this->assertCount(count($userids), $coursebyuserid);
        $this->assertArrayNotHasKey(-1, $coursebyuserid);
        $this->assertSame((int) SITEID, $frontpageonly[(int) $firstuser->id]);
    }

    /**
     * Test filtering out suspended enrolments when only active enrolments are requested.
     */
    public function test_get_first_matching_course_for_users_only_active(): void {
        global $DB;

        $this->resetAfterTest();
        $generator = $this->getDataGenerator();
        $course = $generator->create_course();
        $user = $generator->create_user();
        $generator->enrol_user($user->id, $course->id);
        $DB->set_field('user_enrolments', 'status', ENROL_USER_SUSPENDED, ['userid' => $user->id]);
        $enrolment = \core\di::get(enrolment::class);

        $coursebyuserid = $enrolment->get_first_matching_course_for_users([$course->id], [$user->id]);
        $activecoursebyuserid = $enrolment->get_first_matching_course_for_users([$course->id], [$user->id], true);

        $this->assertSame((int) $course->id, $coursebyuserid[(int) $user->id]);
        $this->assertArrayNotHasKey((int) $user->id, $activecoursebyuserid);
    }
}
