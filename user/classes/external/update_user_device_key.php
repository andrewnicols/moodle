<?php
// This file is part of Moodle - https://moodle.org/
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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

namespace core_user\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;
use core_external\external_warnings;

/**
 * Update a user device key.
 *
 * @package     core_user
 * @category    external
 * @copyright   2021 David Mudrák <david@moodle.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class update_user_device_key extends external_api {
    /**
     * Returns description of method parameters.
     *
     * @return external_function_parameters
     * @since Moodle 4.2
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'uuid' => new external_value(PARAM_RAW, 'the device UUID'),
            'appid' => new external_value(PARAM_NOTAGS, 'The app id, something like com.moodle.moodlemobile'),
            'publickey' => new external_value(PARAM_BASE64, 'The base64-encoded X25519 generated public key'),
        ]);
    }

    /**
     * Update public key against registered user device.
     *
     * @param string $uuid The device UUID.
     * @param string $appid The app id, usually something like com.moodle.moodlemobile.
     * @param string $publickey The app generated public key.
     * @return array Status and list of possible warnings
     * @since Moodle 4.2
     */
    public static function execute($uuid, $appid, $publickey): array {
        $params = self::validate_parameters(self::execute_parameters(), [
            'uuid' => $uuid,
            'appid' => $appid,
            'publickey' => $publickey
        ]);

        $context = \context_system::instance();
        self::validate_context($context);

        $warnings = [];

        $status = \core_user\devicekey::update_device_key($params['uuid'], $params['appid'], $params['publickey']);

        $moodlepublickey = \core_user\devicekey::get_moodle_server_publickey();
        $moodlekey = sodium_bin2base64($moodlepublickey, SODIUM_BASE64_VARIANT_ORIGINAL);

        if (!$status) {
            $warnings[] = [
                'item' => $params['uuid'],
                'warningcode' => 'devicedoesnotexist',
                'message' => 'Could not find a device with the specified device UUID and app ID for this user',
            ];
        }

        return [
            'moodlekey' => $moodlekey,
            'status' => $status,
            'warnings' => $warnings
        ];
    }

    /**
     * Returns description of method result value.
     *
     * @return external_single_structure
     * @since Moodle 4.2
     */
    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'moodlekey' => new external_value(PARAM_BASE64, 'The Moodle public key'),
            'status' => new external_value(PARAM_BOOL, 'True indicates success in updating the public key'),
            'warnings' => new external_warnings()
        ]);
    }
}
