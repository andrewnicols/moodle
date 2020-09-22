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
 * Content API File Area definition.
 *
 * @package     core_files
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
namespace core_user\content\fileareas;

use core\context;
use context_user;
use core\content\filearea;
use core\content\servable_item;
use stdClass;
use stored_file;

/**
 * File area definition for the profile filearea of core_user.
 *
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class profile extends filearea {

    /**
     * Get the itemid usage for this filearea.
     *
     * @param   context $context
     * @return  int
     */
    protected function get_itemid_usage(context $context): ?int {
        if ($context->contextlevel == CONTEXT_USER) {
            return self::ITEMID_NOT_PRESENT;
        }

        return self::ITEMID_PRESENT_IN_USE;
    }

    /**
     * Get the stored file at the specified location.
     *
     * @return  null|stored_file A stored_file for the given params, or null if none was found
     */
    protected function get_stored_file_from_filepath(
        context $context,
        string $component,
        string $filearea,
        int $itemid,
        string $filepath,
        string $filename
    ): ?stored_file {

        if ($context->contextlevel == CONTEXT_USER) {
            // The user context is handled by standard mechanisms.
            return parent::get_stored_file_from_filepath($context, $component, $filearea, $itemid, $filepath, $filename);
        }

        if ($context->contextlevel != CONTEXT_COURSE) {
            // The only other context accepted is CONTEXT_COURSE.
            return null;
        }

        // For the course context the file is fetched from the user context rather than the supplied context.
        // Capability checks are performed in the supplied context in can_user_access_stored_file_from_context.

        $usercontext = context_user::instance($itemid);
        $fs = get_file_storage();
        $file = $fs->get_file($usercontext->id, $component, $filearea, $itemid, $filepath, $filename);

        if (!$file) {
            // File not found.
            return null;
        }

        return $file;
    }

    /**
     * Check whether the specified use can access the supplied stored_file in the supplied context.
     *
     * @param   stored_file $file
     * @param   stdClass $user
     * @param   context $context
     * @return  bool
     */
    public static function can_user_access_stored_file_from_context(stored_file $file, stdClass $user, context $context): ?bool {
        global $CFG;

        // The usercontext is the context of the file itself.
        // In some cases this will be different to the context - in particular for files viewed from a course profile.
        $usercontext = self::get_context_for_stored_file($file);

        // Note: The $context in this instance is the context that the file is being viewed from.
        // That is the context specified in the URL.
        if ($context->contextlevel == CONTEXT_USER) {
            if ($user->id == $usercontext->instanceid) {
                // A user can always access their own profile files.
                return true;
            }

            if (empty($CFG->forceloginforprofiles)) {
                // Profile fields will be accessible if forceloginforprofiles is disabled.
                return true;
            }

            // Login is required for profiles from this point on.

            if (isguestuser()) {
                // Guests cannot access.
                return false;
            }

            if (has_capability('moodle/user:viewdetails', $context, $user)) {
                // The current user has access to view user details of the owner of the target file in the viewed context.
                return true;
            }

            if (!has_coursecontact_role($fileuserid))  {
                // The owner of the file being accessed does not have a course contact role, like teacher.
                // That means they will have a role like 'student'.
                // The viewing user does not have permission to view any users in the viewed context.
                return false;
            }

            // Check whether the current user can view details in any course that they share with the file owner.
            $courses = enrol_get_users_courses($fileuserid, true, 'id');
            foreach ($courses as $course) {
                if (has_capability('moodle/user:viewdetails', context_course::instance($course->id), $user)) {
                    return true;
                }
            }

            // The current user is not the owner, does not have the viewdetails capability in any shared courses,
            // and the file's owner is not a course contact.
            // Deny access.
            return false;

        } else if ($context->contextlevel == CONTEXT_COURSE) {
            if ($user->id == $usercontext->instanceid) {
                // A user can always access their own profile files.
                return true;
            }

            error_log(var_export($CFG->forceloginforprofiles, true));
            if (empty($CFG->forceloginforprofiles)) {
                // Profile fields will be accessible if forceloginforprofiles is disabled.
                return true;
            }

            // Login is required for profiles from this point on.

            if (isguestuser()) {
                // Guests cannot access.
                return false;
            }

            if (has_capability('moodle/user:viewdetails', $context, $user)) {
                // The current user has access to view user details of the owner of the target file in the viewed context.
                return true;
            }

            if (!has_capability('moodle/user:viewdetails', $usercontext, $user)) {
                // The viewing user does not have permission to view the user in the user's context.
                if (!has_coursecontact_role($fileuserid))  {
                    // The owner of the file being accessed does not have any course contact role, like teacher.
                    // The viewing user does not have permission to view any users in the viewed context.
                    return false;
                }

                if (!has_capability('moodle/user:viewdetails', $context, $user)) {
                    // The viewing user does not have permission to view the user in the current course context either.
                    return false;
                }
            }

            if (!is_enrolled($context, $fileuserid)) {
                // The file owner is not enrolled in this course.
                return false;
            }

            // The viewing user is either in the same course as the target user, or has permission some other way.
            // The viewing user can access the files if that user can view the group information of the target user.
            if (has_capability('moodle/site:accessallgroups', $context, $user)) {
                // The user has access to all groups, regardless of groupmode and group sharing.
                return true;
            }

            $course = get_course($context->instanceid);
            if (groups_get_course_groupmode($course) != SEPARATEGROUPS) {
                // The course is not in seperate groups mode, so all group members are inherently visible.
                return true;
            }

            $targetusergroups = groups_get_all_groups($course->id, $userid);
            $currentusergroups = groups_get_all_groups($course->id, $user->id);
            return !(empty(array_intersect_key($targetusergroups, $currentusergroups)));
        }
    }

    /**
     * Login is always required for access to user backup files.
     *
     * @param   servable_item $servable
     * @return  bool
     */
    public function requires_login(servable_item $servable): bool {
        global $CFG;

        if (!empty($CFG->forcelogin)) {
            return true;
        }

        if (!empty($CFG->forceloginforprofiles)) {
            return true;
        }

        return false;
    }

    /**
     * Set whether the content should be forcibly downloaded.
     *
     * If a null value is returned, then the user-requested value is used, otherwise download is either forcibly set, or
     * forcibly unset.
     *
     * @return  null|bool
     */
    public function should_force_download(servable_item $servable): ?bool {
        return true;
    }

    /**
     * Return the cache time to use for this file.
     *
     * @param   servable_item $servable
     * @return  null|int
     */
    public function get_sendfile_cache_time(servable_item $servable): ?int {
        return 0;
    }
}
