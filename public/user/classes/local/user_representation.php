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

use core\user;
use stdClass;

/**
 * Builds the REST representation of the key information about a user.
 *
 * All visibility decisions are delegated to {@see user::get_user_details()}. Fields which the current user may not
 * see are returned as null.
 *
 * @package    core_user
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class user_representation {
    /** @var string[] The fields requested from get_user_details */
    private const FIELDS = [
        'id',
        'username',
        'fullname',
        'firstname',
        'lastname',
        'email',
        'profileimageurl',
        'profileimageurlsmall',
        'timezone',
        'suspended',
        'firstaccess',
        'lastaccess',
    ];

    /**
     * Get the core representation of a user.
     *
     * @param stdClass $user A full user record
     * @param stdClass|null $course A course in which the current user is viewing the user
     * @return array|null The representation, or null if the current user cannot see this user
     */
    public static function get_core(stdClass $user, ?stdClass $course = null): ?array {
        $details = user::get_user_details($user, $course, self::FIELDS);
        if ($details === null) {
            return null;
        }

        return [
            'id' => (int) $details['id'],
            'username' => $details['username'] ?? null,
            'fullName' => $details['fullname'],
            'firstName' => $details['firstname'] ?? null,
            'lastName' => $details['lastname'] ?? null,
            'email' => $details['email'] ?? null,
            'profileImageUrl' => $details['profileimageurl'] ?? null,
            'profileImageUrlSmall' => $details['profileimageurlsmall'] ?? null,
            'timeZone' => $details['timezone'] ?? null,
            'suspended' => $details['suspended'] ?? null,
            'firstAccess' => self::format_time($details['firstaccess'] ?? 0),
            'lastAccess' => self::format_time($details['lastaccess'] ?? 0),
        ];
    }

    /**
     * Get the core representation of a user, looking for any course through which the current user may view them.
     *
     * @param stdClass $user A full user record
     * @param stdClass[]|null $courses Courses where the current user has viewdetails, if already known
     * @return array|null The representation, or null if the current user cannot see this user
     */
    public static function get_core_visible(stdClass $user, ?array &$courses = null): ?array {
        $item = self::get_core($user);
        if ($item !== null) {
            return $item;
        }

        // The user may only be visible through a course-level capability.
        $courses ??= visible_users::get_courses_with_viewdetails();
        foreach ($courses as $course) {
            if (is_enrolled(\core\context\course::instance($course->id), $user)) {
                return self::get_core($user, $course);
            }
        }

        return null;
    }

    /**
     * Calculate an ETag for a representation.
     *
     * @param array $representation
     * @return string A strong, quoted ETag
     */
    public static function get_etag(array $representation): string {
        return '"' . sha1(json_encode($representation)) . '"';
    }

    /**
     * Format a timestamp as an ISO-8601 string in the current user's timezone.
     *
     * @param int $timestamp
     * @return string|null Null if the timestamp is empty
     */
    public static function format_time(int $timestamp): ?string {
        if (!$timestamp) {
            return null;
        }

        return (new \DateTimeImmutable('@' . $timestamp))
            ->setTimezone(\core_date::get_user_timezone_object())
            ->format(\DateTimeInterface::ATOM);
    }
}
