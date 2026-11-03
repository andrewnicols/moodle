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

namespace core_user\local;

use core\current_user;
use core\user;
use core_user\user_model;
use stdClass;

/**
 * Builds the REST representation of the key information about a user.
 *
 * All visibility decisions are delegated to {@see user::get_user_details()}. Fields which the current user may not
 * see are returned as null.
 *
 * @package    core_user
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class user_representation {
    /**
     * Constructor.
     *
     * @param visible_user_finder $finder Used to find courses through which a user may be visible
     * @param current_user $currentuser The user who is viewing
     */
    public function __construct(
        /** @var visible_user_finder Used to find courses through which a user may be visible */
        protected visible_user_finder $finder,
        /** @var current_user The user who is viewing */
        protected current_user $currentuser,
    ) {
    }

    /** @var string[] The fields requested from get_user_details */
    private const FIELDS = [
        'id',
        'username',
        'idnumber',
        'fullname',
        'firstname',
        'lastname',
        'firstnamephonetic',
        'lastnamephonetic',
        'middlename',
        'alternatename',
        'email',
        'city',
        'country',
        'institution',
        'department',
        'phone1',
        'phone2',
        'address',
        'description',
        'descriptionformat',
        'lang',
        'calendartype',
        'confirmed',
        'auth',
        'profileimageurl',
        'profileimageurlsmall',
        'imagealt',
        'timezone',
        'suspended',
        'deleted',
    ];

    /**
     * Get the core representation of a user.
     *
     * @param user_model $user A hydrated user model
     * @param stdClass|null $course A course in which the current user is viewing the user
     * @return array|null The representation, or null if the current user cannot see this user
     */
    public function get_core(user_model $user, ?stdClass $course = null): ?array {
        $details = user::get_user_details($user->to_record(), $course, self::FIELDS);
        if ($details === null) {
            return null;
        }

        return (new user_object($details))->to_array();
    }

    /**
     * Get the core representation of a user, looking for any course through which the current user may view them.
     *
     * @param user_model $user A hydrated user model
     * @param stdClass[]|null $courses Courses where the current user has viewdetails, if already known
     * @return array|null The representation, or null if the current user cannot see this user
     */
    public function get_core_visible(user_model $user, ?array &$courses = null): ?array {
        return $this->find_visible($user, $courses, $this->get_core(...));
    }

    /**
     * Find a course (if needed) in which the user is visible, and build a representation in it.
     *
     * @param user_model $user
     * @param stdClass[]|null $courses
     * @param callable $builder Called with the user and an optional course
     * @return array|null
     */
    private function find_visible(user_model $user, ?array &$courses, callable $builder): ?array {
        $item = $builder($user);
        if ($item !== null) {
            return $item;
        }

        // The user may only be visible through a course-level capability.
        $courses ??= $this->finder->get_courses_with_viewdetails();
        foreach ($courses as $course) {
            if (is_enrolled(\core\context\course::instance($course->id), $user->id)) {
                return $builder($user, $course);
            }
        }

        return null;
    }
}
