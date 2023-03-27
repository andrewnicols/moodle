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

namespace communication_matrix;

/**
 * class matrix_user_manager to handle specific actions.
 *
 * @package    communication_matrix
 * @copyright  2023 Stevani Andolo <stevani.andolo@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class matrix_user_manager {

    /**
     * Gets matrix user id from moodle.
     *
     * @param string $userid Moodle user id
     * @param string $homeserver Matrix home server url
     * @return string
     */
    public static function get_matrixid_from_moodle(string $userid, string $homeserver) : ?string {
        global $CFG;
        require_once("$CFG->dirroot/user/profile/lib.php");
        $matrixprofilefield = get_config('communication_matrix', 'matrixuserid_field');
        $field = profile_user_record($userid);
        $pureusername = $field->{$matrixprofilefield} ?? null;
        if ($pureusername) {
            $homeserver = self::set_matrix_home_server($homeserver);
            return "@{$pureusername}:$homeserver";
        }
        return $pureusername;
    }

    /**
     * Sets qualified matrix user id
     *
     * @param string $userid Moodle user id
     * @param string $homeserver Matrix home server url
     * @return array
     */
    public static function set_qualified_matrix_user_id(string $userid, string $homeserver) : array {
        $user = \core_user::get_user($userid);
        $username = preg_replace('/[@#$%^&*()+{}|<>?!,]/i', '.', $user->username);
        $username = ltrim(rtrim($username, '.'), '.');
        $homeserver = self::set_matrix_home_server($homeserver);
        return ["@{$username}:{$homeserver}", $username];
    }

    /**
     * Add user's Matrix user id.
     *
     * @param string $userid Moodle user id
     * @param string $matrixuserid Matrix user id
     * @return bool
     */
    public static function add_user_matrix_id_to_moodle(string $userid, string $matrixuserid): bool {
        global $CFG;
        require_once("$CFG->dirroot/user/profile/lib.php");
        $matrixprofilefield = get_config('communication_matrix', 'matrixuserid_field');
        $field = profile_get_custom_field_data_by_shortname($matrixprofilefield);
        if (!empty($field)) {
            $userinfodata = new \stdClass();
            $userinfodata->id = $userid;
            $userinfodata->data = $matrixuserid;
            $userinfodata->fieldid = $field->id;
            $userinfodata->{"profile_field_{$matrixprofilefield}"} = $matrixuserid;
            profile_save_data($userinfodata);
            return true;
        }
        return false;
    }

    /**
     * Sets home server for user matrix id
     *
     * @param string $homeserver Matrix home server url
     * @return string
     */
    public static function set_matrix_home_server(string $homeserver) : string {
        $homeserver = parse_url($homeserver)['host'];
        if (strpos($homeserver, '.') !== false) {
            $host = explode('.', $homeserver);
            return strpos($homeserver, 'www') !== false ? $host[1] : $host[0];
        }
        return $homeserver;
    }

    /**
     * Gets moodle's user data.
     *
     * @param string $userid Moodle user id
     * @return stdClass|null
     */
    public static function get_moodle_user_data(string $userid): ?\stdClass {
        $user = \core_user::get_user($userid);
        if (!empty($user)) {
            $user->fullname = "{$user->firstname} {$user->lastname}";
        }
        return $user ?? null;
    }
}
