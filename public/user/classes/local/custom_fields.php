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

use core\exception\access_denied_exception;
use core\exception\invalid_parameter_exception;
use stdClass;

/**
 * Reads and writes the custom profile field values of a user, keyed by field shortname.
 *
 * Visibility, editability, locking, and validation are delegated to the profile field types.
 *
 * @package    core_user
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class custom_fields {
    /**
     * Get the representation of the custom fields of a user which are visible to the current user.
     *
     * @param stdClass $user
     * @return array
     */
    public static function get_representation(stdClass $user): array {
        global $CFG;
        require_once("{$CFG->dirroot}/user/profile/lib.php");

        $fields = [];
        foreach (profile_get_user_fields_with_data($user->id) as $field) {
            if ($field->is_visible()) {
                $fields[$field->get_shortname()] = $field->data;
            }
        }

        return ['fields' => (object) $fields];
    }

    /**
     * Update the custom fields of a user.
     *
     * @param stdClass $user The user to update
     * @param array $values The new values, keyed by shortname
     * @param bool $replace If true, editable fields which are not supplied are cleared
     * @throws invalid_parameter_exception If a field is unknown or a value is invalid
     * @throws access_denied_exception If the current user may not edit a field
     */
    public static function update(stdClass $user, array $values, bool $replace): void {
        global $CFG;
        require_once("{$CFG->dirroot}/user/profile/lib.php");

        user_updater::require_can_edit($user);

        $fields = [];
        foreach (profile_get_user_fields_with_data($user->id) as $field) {
            if ($field->is_visible()) {
                $fields[$field->get_shortname()] = $field;
            }
        }

        $unknown = array_diff(array_keys($values), array_keys($fields));
        if ($unknown) {
            throw new invalid_parameter_exception('Unknown custom fields: ' . implode(', ', $unknown));
        }

        $canupdate = user_updater::can_update_any();
        $usernew = (object) ['id' => $user->id];
        $towrite = [];
        foreach ($fields as $shortname => $field) {
            $supplied = array_key_exists($shortname, $values);
            if (!$supplied && !$replace) {
                continue;
            }

            if (!$field->is_editable() || ($field->is_locked() && !$canupdate)) {
                if ($supplied) {
                    throw new access_denied_exception('nopermissions', '', '', "update custom field {$shortname}");
                }
                // Not editable by this user, so left untouched by a replacement.
                continue;
            }

            $value = $supplied ? $values[$shortname] : '';
            if ($value !== null && !is_scalar($value)) {
                throw new invalid_parameter_exception("The value of {$shortname} must be a string.");
            }

            $value = (string) $value;

            $current = (string) $field->data;
            if ($value !== $current && user_updater::is_locked_by_auth($user, $field->inputname, $current)) {
                if ($supplied) {
                    throw new access_denied_exception(
                        'nopermissions',
                        '',
                        '',
                        "update custom field {$shortname}: managed by the authentication plugin",
                    );
                }
                // Managed externally, so left untouched by a replacement.
                continue;
            }
            if ($field->is_required() && trim($value) === '') {
                throw new invalid_parameter_exception("The custom field {$shortname} is required.");
            }

            $usernew->{$field->inputname} = $value;
            $towrite[$shortname] = $field;
        }

        $errors = [];
        foreach ($towrite as $shortname => $field) {
            $errors += array_map(fn ($error) => "{$shortname}: {$error}", $field->edit_validate_field($usernew));
        }
        if ($errors) {
            throw new invalid_parameter_exception(implode('; ', $errors));
        }

        foreach ($towrite as $field) {
            $field->edit_save_data($usernew);
        }

        \core\event\user_updated::create_from_userid($user->id)->trigger();
    }
}
