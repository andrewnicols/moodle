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

namespace core_course\route\controller;

use core\exception\moodle_exception;
use core\router\route_loader_interface;
use core\tests\router\route_testcase;
use core\url;
use core_course\modinfo;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;

/**
 * Course navigation controller tests.
 *
 * @package     core_course
 * @copyright   2025 Laurent David <laurent.david@moodle.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 **/
#[CoversClass(\core_course\route\controller\course_navigation::class)]
final class course_navigation_test extends route_testcase {
    /**
     * Test the course navigation course module next route.
     *
     * @param string $currentmodule
     * @param array $expectednextelement
     * @param string $user
     * @return void
     */
    #[DataProvider('cm_next_provider')]
    public function test_cm_next(
        string $currentmodule,
        array $expectednextelement,
        string $user,
    ): void {
        $this->resetAfterTest();

        // First create a simple course with some activities.
        ['course' => $course, 'users' => $users, 'cms' => $cms] = $this->create_course_and_modules(
            2,
            [
                ['key' => 'student1', 'role' => 'student'],
            ],
            [
                ['key' => 'cm0', 'type' => 'assign'],
                ['key' => 'cm1', 'type' => 'assign', 'options' => ['section' => 2]],
                ['key' => 'cm2', 'type' => 'label', 'options' => ['section' => 2]],
                ['key' => 'subsection1', 'type' => 'subsection', 'options' => ['section' => 2]],
                ['key' => 'cm3', 'type' => 'assign', 'options' => ['section' => 'subsection1']],
                ['key' => 'cm4', 'type' => 'assign', 'options' => ['section' => 2]],
                ['key' => 'cm5', 'type' => 'label', 'options' => ['section' => 2]],
            ]
        );
        $cmid = $cms[$currentmodule]->cmid ?? 9999; // If we cannot find it we will test the error case of not found.
        $this->setUser($users[$user]);

        $response = $this->process_request(
            'GET',
            "course/cm/{$cmid}/next",
            route_loader_interface::ROUTE_GROUP_PAGE
        );
        if ($expectednextelement['type'] === 'error') {
            $this->assertEquals(
                $expectednextelement['statuscode'],
                $response->getStatusCode(),
            );
            return;
        }
        $this->assert_valid_response($response, 302);
        $nextlocation = $response->getHeader('Location'); // Just to consume the header if any.

        $this->assertNotEmpty($nextlocation, 'The redirection header should be present.');
        $this->assert_redirected_url(
            $expectednextelement['type'],
            $expectednextelement['id'] ?? '',
            $course->id,
            $nextlocation[0]
        );
    }

    /**
     * Data provider for test_cm_next.
     *
     * @return \Generator
     */
    public static function cm_next_provider(): \Generator {
        yield 'Next simple case (student)' => [
            'currentmodule' => 'cm0',
            'expectednextelement' => [
                'type' => 'cm',
                'id' => 'cm1',
            ],
            'user' => 'student1',
        ];
        yield 'Next with next module being a subsection (student)' => [
            'currentmodule' => 'cm2',
            'expectednextelement' => [
                'type' => 'cm',
                'id' => 'cm3',
            ],
            'user' => 'student1',
        ];
        yield 'Next with next module being a label and subsections (student)' => [
            'currentmodule' => 'cm1',
            'expectednextelement' => [
                'type' => 'cm',
                'id' => 'cm3',
            ],
            'user' => 'student1',
        ];
        yield 'Next with last module with url (student)' => [
            'currentmodule' => 'cm4',
            'expectednextelement' => [
                'type' => 'error',
                'statuscode' => 404,
            ],
            'user' => 'student1',
        ];
        yield 'Next with module that does not exist (student)' => [
            'currentmodule' => 'cmthatdoesnotexist',
            'expectednextelement' => [
                'type' => 'error',
                'statuscode' => 404,
            ],
            'user' => 'student1',
        ];
    }

    /**
     * Helper function to assert that the redirection URL matches the expected next element.
     *
     * @param string $elementtype
     * @param string $elementid
     * @param int $courseid
     * @param string $location
     * @return void
     * @throws moodle_exception
     */
    protected function assert_redirected_url(
        string $elementtype,
        string $elementid,
        int $courseid,
        string $location
    ): void {
        $coursemodinfo = modinfo::instance($courseid);
        switch ($elementtype) {
            case 'cm':
                $cms = $coursemodinfo->get_cms();
                $cm = null;
                foreach ($cms as $activitycm) {
                    if ($activitycm->get_name() == $elementid) {
                        $cm = $activitycm;
                        break;
                    }
                }
                $this->assertNotEmpty($cm, "The course module with name {$elementid} should be found.");
                $this->assertEquals(
                    $cm->url,
                    new url($location)
                );
                break;
            case 'section':
                $sectioninfo = $coursemodinfo->get_section_info($elementid);
                $this->assertEquals(
                    new url('/course/section.php', ['id' => $sectioninfo->id]),
                    new url($location)
                );
                break;
            case 'course':
                $this->assertEquals(
                    new url('/course/view.php', ['id' => $courseid]),
                    new url($location)
                );
                break;
            default:
                $this->fail('Unknown expected next element type ' . $elementtype);
        }
    }

    /**
     * Helper function to create a course with sections and modules based on the provided definitions.
     *
     * @param int $numsections The number of sections to create in the course.
     * @param array $usersdef An array of user definitions, each containing 'key', 'role', and optional 'options' for enrolment.
     * @param array $cmsdef An array of course module definitions, each containing 'key' and optional 'options' for module creation.
     * @return array An array containing created 'users', 'course', and 'cms'.
     */
    protected function create_course_and_modules(
        int $numsections,
        array $usersdef,
        array $cmsdef,
    ) {
        // Create a course with $sectionnumber sections.
        $generator = $this->getDataGenerator();
        $course = $generator->create_course(['numsections' => $numsections]);
        foreach ($usersdef as $userdef) {
            $users[$userdef['key']] = $generator->create_and_enrol(
                $course,
                $userdef['role'],
                $userdef['options'] ?? [],
            );
        }
        foreach ($cmsdef as $cmdef) {
            $options = [
                'course' => $course->id,
                'name' => $cmdef['key'],
            ];
            $key = $cmdef['key'];
            if (isset($cmdef['options']['section']) && !is_int($cmdef['options']['section'])) {
                // We are pointing to a subsection module.
                $modinfo = modinfo::instance($course->id);
                $delegatedcms = $modinfo->get_sections_delegated_by_cm();
                foreach ($delegatedcms as $cminfosection) {
                    if ($cminfosection->name == $cmdef['options']['section']) {
                        $cmdef['options']['section'] = $cminfosection->sectionnum;
                        break;
                    }
                }
            }
            $options = array_merge($options, $cmdef['options'] ?? []);
            $cms[$key] = $generator->create_module($cmdef['type'] ?? 'assign', $options);
        }
        return ['users' => $users, 'course' => $course, 'cms' => $cms];
    }
}
