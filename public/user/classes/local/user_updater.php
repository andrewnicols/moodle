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
    /** @var string[] API fields of the core resource which map to a user record field. Editable with a profile capability. */
    private const CORE_FIELDS = [
        'firstName' => 'firstname',
        'lastName' => 'lastname',
        'timeZone' => 'timezone',
    ];

    /** @var string[] API fields of the core resource which require moodle/user:update */
    private const ADMIN_FIELDS = [
        'email' => 'email',
        'suspended' => 'suspended',
    ];

    /** @var string[] API fields of the profile resource which map to a user record field */
    private const PROFILE_FIELDS = [
        'city' => 'city',
        'country' => 'country',
        'institution' => 'institution',
        'department' => 'department',
        'phone' => 'phone1',
        'mobilePhone' => 'phone2',
        'address' => 'address',
        'description' => 'description',
    ];

    /**
     * Get the names of the API fields of the core resource which can be updated.
     *
     * @return string[]
     */
    public static function get_updatable_fields(): array {
        return array_merge(array_keys(self::CORE_FIELDS), array_keys(self::ADMIN_FIELDS));
    }

    /**
     * Get the names of the API fields of the profile resource which can be updated.
     *
     * @return string[]
     */
    public static function get_updatable_profile_fields(): array {
        return array_keys(self::PROFILE_FIELDS);
    }

    /**
     * Update the core information about a user.
     *
     * @param stdClass $user The user to update
     * @param array $changes The API field names and their new values
     * @throws invalid_parameter_exception If the changes are empty, unknown, or invalid
     * @throws access_denied_exception If the current user may not make the changes
     */
    public static function update(stdClass $user, array $changes): void {
        $record = self::build_record(
            $user,
            $changes,
            self::CORE_FIELDS + self::ADMIN_FIELDS,
            array_keys(self::ADMIN_FIELDS),
        );

        \core\user::update_user($record, false);

        if (!empty($record->suspended) && !$user->suspended) {
            \core\session\manager::destroy_user_sessions($user->id);
        }
    }

    /**
     * Update the profile information about a user.
     *
     * @param stdClass $user The user to update
     * @param array $changes The API field names and their new values
     * @throws invalid_parameter_exception If the changes are empty, unknown, or invalid
     * @throws access_denied_exception If the current user may not make the changes
     */
    public static function update_profile(stdClass $user, array $changes): void {
        $record = self::build_record($user, $changes, self::PROFILE_FIELDS, []);

        \core\user::update_user($record, false);
    }

    /**
     * Check that the current user may edit the specified user at all.
     *
     * @param stdClass $user
     * @throws access_denied_exception
     */
    public static function require_editable_user(stdClass $user): void {
        global $USER;

        if ((int) $user->id === (int) $USER->id) {
            return;
        }

        if (isguestuser($user->id)) {
            throw new access_denied_exception('guestnoeditprofileother');
        }
        if (is_siteadmin($user) && !is_siteadmin($USER)) {
            throw new access_denied_exception('useradmineditadmin');
        }
    }

    /**
     * Whether the user's authentication plugin prevents the field from being changed.
     *
     * This mirrors the lock applied by the profile editing form: a field is locked, or locked while it has a value.
     * It applies to everyone, including administrators, because the external source would overwrite any change.
     *
     * @param stdClass $user
     * @param string $field The user record column, or the profile_field_* name of a custom field
     * @param string|null $currentvalue The current value, if it is not a column of the user record
     * @return bool
     */
    public static function is_locked_by_auth(stdClass $user, string $field, ?string $currentvalue = null): bool {
        $authentication = \core\di::get(\core\authentication::class);
        if (!$authentication->plugin_exists($user->auth)) {
            return false;
        }

        $lock = $authentication->get_plugin($user->auth)->config->{"field_lock_{$field}"} ?? null;
        $currentvalue ??= (string) ($user->{$field} ?? '');

        return $lock === 'locked' || ($lock === 'unlockedifempty' && $currentvalue !== '');
    }

    /**
     * Validate the changes, check access, and build a user record to save.
     *
     * @param stdClass $user
     * @param array $changes
     * @param string[] $fieldmap Map of the permitted API fields to user record columns
     * @param string[] $adminfields API fields which require moodle/user:update
     * @return stdClass
     */
    private static function build_record(stdClass $user, array $changes, array $fieldmap, array $adminfields): stdClass {
        if (empty($changes)) {
            throw new invalid_parameter_exception('At least one field must be supplied.');
        }

        $unknown = array_diff(array_keys($changes), array_keys($fieldmap));
        if ($unknown) {
            throw new invalid_parameter_exception('Unknown or read-only fields: ' . implode(', ', $unknown));
        }

        self::require_access($user, array_keys($changes), $adminfields);

        $record = (object) ['id' => $user->id];
        foreach ($changes as $field => $value) {
            $column = $fieldmap[$field];
            $record->{$column} = self::clean_value($user, $field, $value);

            // Resubmitting the current value is harmless, so clients may send back a whole representation.
            if ((string) $record->{$column} !== (string) $user->{$column} && self::is_locked_by_auth($user, $column)) {
                throw new access_denied_exception('nopermissions', '', '', "update {$field}: managed by the authentication plugin");
            }
        }

        $errors = \core\user::validate($record);
        if ($errors !== true) {
            throw new invalid_parameter_exception('Invalid value for: ' . implode(', ', array_keys($errors)));
        }

        return $record;
    }

    /**
     * Check that the current user may edit the user at all.
     *
     * This is the gate for every write to a user resource. It requires:
     * - moodle/user:update in the system context; or
     * - moodle/user:editownprofile in the system context when editing themselves; or
     * - moodle/user:editprofile in the user context when editing someone else.
     *
     * Individual fields may require more (see {@see self::require_access()}).
     *
     * @param stdClass $user
     * @throws access_denied_exception
     */
    public static function require_can_edit(stdClass $user): void {
        self::require_editable_user($user);

        if (!self::can_edit($user)) {
            throw new access_denied_exception('nopermissions', '', '', 'update user');
        }
    }

    /**
     * Whether the current user may edit the user, subject to field-specific restrictions.
     *
     * @param stdClass $user
     * @return bool
     */
    private static function can_edit(stdClass $user): bool {
        global $USER;

        if (self::can_update_any()) {
            return true;
        }

        return (int) $user->id === (int) $USER->id
            ? has_capability('moodle/user:editownprofile', system::instance())
            : has_capability('moodle/user:editprofile', user_context::instance($user->id));
    }

    /**
     * Whether the current user holds moodle/user:update, which allows editing any field of any user.
     *
     * @return bool
     */
    public static function can_update_any(): bool {
        return has_capability('moodle/user:update', system::instance());
    }

    /**
     * Check that the current user may update the specified fields of the user.
     *
     * @param stdClass $user
     * @param string[] $fields The API fields being changed
     * @param string[] $adminfields API fields which require moodle/user:update
     * @throws access_denied_exception
     */
    private static function require_access(stdClass $user, array $fields, array $adminfields): void {
        self::require_can_edit($user);

        $canupdate = self::can_update_any();
        foreach ($fields as $field) {
            if (in_array($field, $adminfields, true) && !$canupdate) {
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
            case 'country':
                $value = (string) $value;
                if ($value !== '' && !array_key_exists($value, get_string_manager()->get_list_of_countries())) {
                    throw new invalid_parameter_exception('The country must be an ISO 3166-1 alpha-2 code, or empty.');
                }
                return $value;
            case 'suspended':
                return (int) (bool) $value;
            default:
                return trim((string) $value);
        }
    }
}
