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

namespace core_auth;

use core_auth\exception\access_denied_exception;

/**
 * Class user
 *
 * @package    core_auth
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class validate_user {
    /**
     * Validate a user before allowing them to login via an external service.
     *
     * @param \stdClass $user The user object.
     * @throws access_denied_exception If the user is not allowed to login.
     */
    public static function validate_user_before_external_login(\stdClass $user): void {
        global $CFG;

        // Cannot authenticate unless maintenance access is granted.
        self::validate_user_maintenance_mode_access($user);

        // Deleted users cannot login.
        self::validate_user_not_deleted($user);

        // Only confirmed user should be able to call web service.
        self::validate_user_is_confirmed($user);

        // Suspended users cannot login.
        self::validate_user_is_not_suspended($user);
    }

    /**
     * Validate that the user has maintenance mode access if maintenance mode is enabled.
     *
     * @param \stdClass $user The user object.
     * @throws \core_auth\exception\maintenance_mode_enabled_exception If the user does not have maintenance mode access
     */
    public static function validate_user_maintenance_mode_access(\stdClass $user): void {
        global $CFG;

        // Cannot authenticate unless maintenance access is granted.
        if (!empty($CFG->maintenance_enabled)) {
            if (!has_capability('moodle/site:maintenanceaccess', \core\context\system::instance(), $user)) {
                throw new \core_auth\exception\maintenance_mode_enabled_exception($user);
            }
        }
    }

    /**
     * Validate that the user has not been deleted.
     *
     * @param \stdClass $user The user object.
     * @throws \core_auth\exception\user_deleted_exception If the user has been deleted
     */
    public static function validate_user_not_deleted(\stdClass $user): void {
        if (!empty($user->deleted)) {
            throw new \core_auth\exception\user_deleted_exception($user);
        }
    }

    /**
     * Validate that the user has not been deleted.
     *
     * @param \stdClass $user The user object.
     * @throws \core_auth\exception\user_not_confirmed_exception If the user has not been confirmed
     */
    public static function validate_user_is_confirmed(\stdClass $user): void {
        if (empty($user->confirmed)) {
            throw new \core_auth\exception\user_not_confirmed_exception($user);
        }
    }

    /**
     * Validate that the user has not been suspended.
     *
     * @param \stdClass $user The user object.
     * @throws \core_auth\exception\user_not_confirmed_exception If the user has been suspended
     */
    public static function validate_user_is_not_suspended(\stdClass $user): void {
        if (!empty($user->suspended)) {
            throw new \core_auth\exception\user_suspended_exception($user);
        }
    }
}
