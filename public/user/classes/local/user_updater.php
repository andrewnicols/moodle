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

use core\context\system;
use core\context\user as user_context;
use core\exception\access_denied_exception;
use core\exception\invalid_parameter_exception;
use stdClass;

/**
 * Applies a partial update of the key information about a user, after checking that the current user may do so.
 *
 * @package    core_user
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class user_updater {
    /** @var string[] API fields which map to a user record field, and which may be edited as part of a profile */
    private const PROFILE_FIELDS = [
        'firstName' => 'firstname',
        'lastName' => 'lastname',
        'timeZone' => 'timezone',
    ];

    /** @var string[] API fields which map to a user record field, and which require moodle/user:update */
    private const ADMIN_FIELDS = [
        'email' => 'email',
        'suspended' => 'suspended',
    ];

    /**
     * Get the names of the API fields which can be updated.
     *
     * @return string[]
     */
    public static function get_updatable_fields(): array {
        return array_merge(array_keys(self::PROFILE_FIELDS), array_keys(self::ADMIN_FIELDS));
    }

    /**
     * Update a user.
     *
     * @param stdClass $user The user to update
     * @param array $changes The API field names and their new values
     * @throws invalid_parameter_exception If the changes are empty, unknown, or invalid
     * @throws access_denied_exception If the current user may not make the changes
     */
    public static function update(stdClass $user, array $changes): void {
        if (empty($changes)) {
            throw new invalid_parameter_exception('At least one field must be supplied.');
        }

        $unknown = array_diff(array_keys($changes), self::get_updatable_fields());
        if ($unknown) {
            throw new invalid_parameter_exception('Unknown or read-only fields: ' . implode(', ', $unknown));
        }

        self::require_access($user, $changes);

        $record = (object) ['id' => $user->id];
        foreach ($changes as $field => $value) {
            $column = self::PROFILE_FIELDS[$field] ?? self::ADMIN_FIELDS[$field];
            $record->{$column} = self::clean_value($user, $field, $value);
        }

        \core\user::update_user($record, false);

        if (!empty($record->suspended) && !$user->suspended) {
            \core\session\manager::destroy_user_sessions($user->id);
        }
    }

    /**
     * Check that the current user may update the specified fields of the user.
     *
     * @param stdClass $user
     * @param array $changes
     * @throws access_denied_exception
     */
    private static function require_access(stdClass $user, array $changes): void {
        global $USER;

        $isself = (int) $user->id === (int) $USER->id;
        $systemcontext = system::instance();

        if (!$isself) {
            if (isguestuser($user->id)) {
                throw new access_denied_exception('guestnoeditprofileother');
            }
            if (is_siteadmin($user) && !is_siteadmin($USER)) {
                throw new access_denied_exception('useradmineditadmin');
            }
        }

        $canupdate = has_capability('moodle/user:update', $systemcontext);
        $canedit = $canupdate || ($isself
            ? has_capability('moodle/user:editownprofile', $systemcontext)
            : has_capability('moodle/user:editprofile', user_context::instance($user->id)));

        foreach (array_keys($changes) as $field) {
            $allowed = array_key_exists($field, self::PROFILE_FIELDS) ? $canedit : $canupdate;
            if (!$allowed) {
                throw new access_denied_exception('nopermissions', '', '', "update {$field}");
            }
        }
    }

    /**
     * Validate and clean the new value for a field.
     *
     * @param stdClass $user
     * @param string $field The API field name
     * @param mixed $value
     * @return string|int
     * @throws invalid_parameter_exception
     */
    private static function clean_value(stdClass $user, string $field, mixed $value): string|int {
        global $CFG, $DB;

        switch ($field) {
            case 'firstName':
            case 'lastName':
                $value = trim((string) $value);
                if ($value === '') {
                    throw new invalid_parameter_exception("{$field} cannot be empty.");
                }
                return $value;
            case 'email':
                $value = trim((string) $value);
                if (!validate_email($value)) {
                    throw new invalid_parameter_exception('The email address is invalid.');
                }
                if (empty($CFG->allowaccountssameemail) && strtolower($value) !== strtolower($user->email)) {
                    $select = $DB->sql_equal('email', ':email', false) . ' AND mnethostid = :mnethostid AND id <> :id';
                    if ($DB->record_exists_select('user', $select, [
                        'email' => $value,
                        'mnethostid' => $CFG->mnet_localhost_id,
                        'id' => $user->id,
                    ])) {
                        throw new invalid_parameter_exception('The email address is already in use.');
                    }
                }
                return $value;
            case 'timeZone':
                $value = (string) $value;
                if (!array_key_exists($value, \core_date::get_list_of_timezones(null, true))) {
                    throw new invalid_parameter_exception('The time zone is invalid.');
                }
                return $value;
            default:
                return (int) (bool) $value;
        }
    }
}
