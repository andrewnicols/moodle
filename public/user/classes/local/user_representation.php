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
        'lang',
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
     * @param stdClass $user A full user record
     * @param stdClass|null $course A course in which the current user is viewing the user
     * @return array|null The representation, or null if the current user cannot see this user
     */
    public function get_core(stdClass $user, ?stdClass $course = null): ?array {
        $details = user::get_user_details($user, $course, self::FIELDS);
        if ($details === null) {
            return null;
        }

        return [
            'id' => (int) $details['id'],
            'username' => $details['username'] ?? null,
            'idnumber' => $details['idnumber'] ?? null,
            'fullName' => $details['fullname'],
            'firstName' => $details['firstname'] ?? null,
            'lastName' => $details['lastname'] ?? null,
            'firstNamePhonetic' => $details['firstnamephonetic'] ?? null,
            'lastNamePhonetic' => $details['lastnamephonetic'] ?? null,
            'middleName' => $details['middlename'] ?? null,
            'alternateName' => $details['alternatename'] ?? null,
            'email' => $details['email'] ?? null,
            'lang' => $details['lang'] ?? null,
            'confirmed' => isset($details['confirmed']) ? (bool) $details['confirmed'] : null,
            'auth' => $details['auth'] ?? null,
            'profileImageUrl' => $details['profileimageurl'] ?? null,
            'profileImageUrlSmall' => $details['profileimageurlsmall'] ?? null,
            'profileImageAlt' => $details['imagealt'] ?? null,
            'timeZone' => isset($details['timezone']) ? $this->normalise_timezone($details['timezone']) : null,
            'timeZonePreference' => $this->get_timezone_preference($details['timezone'] ?? null),
            'suspended' => $details['suspended'] ?? null,
            'deleted' => $details['deleted'],
        ];
    }

    /**
     * Get the core representation of a user, looking for any course through which the current user may view them.
     *
     * @param stdClass $user A full user record
     * @param stdClass[]|null $courses Courses where the current user has viewdetails, if already known
     * @return array|null The representation, or null if the current user cannot see this user
     */
    public function get_core_visible(stdClass $user, ?array &$courses = null): ?array {
        return $this->find_visible($user, $courses, $this->get_core(...));
    }

    /**
     * Find a course (if needed) in which the user is visible, and build a representation in it.
     *
     * @param stdClass $user
     * @param stdClass[]|null $courses
     * @param callable $builder Called with the user and an optional course
     * @return array|null
     */
    private function find_visible(stdClass $user, ?array &$courses, callable $builder): ?array {
        $item = $builder($user);
        if ($item !== null) {
            return $item;
        }

        // The user may only be visible through a course-level capability.
        $courses ??= $this->finder->get_courses_with_viewdetails();
        foreach ($courses as $course) {
            if (is_enrolled(\core\context\course::instance($course->id), $user)) {
                return $builder($user, $course);
            }
        }

        return null;
    }

    /**
     * Get the timezone which the user has chosen, as an IANA name.
     *
     * @param string|null $timezone The stored value
     * @return string|null Null if the user follows the server timezone (stored as 99), or the value is hidden
     */
    private function get_timezone_preference(?string $timezone): ?string {
        if ($timezone === null || $timezone === '' || $timezone === '99') {
            return null;
        }

        return \core_date::normalise_timezone($timezone);
    }

    /**
     * Normalise a stored timezone to an IANA time zone database name (BCP 175 / RFC 6557), such as Australia/Perth.
     *
     * Moodle stores 99 for "use the server timezone", and may still hold legacy numeric offsets. Both resolve to the
     * zone which Moodle actually uses for the user.
     *
     * @param string $timezone The stored value
     * @return string
     */
    private function normalise_timezone(string $timezone): string {
        return \core_date::get_user_timezone((object) ['timezone' => $timezone]);
    }
}
