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

namespace core_user;

class devicekey {
    /**
     * Update the users public key for the specified device and app.
     *
     * @param string $uuid The device UUID.
     * @param string $appid The app id, usually something like com.moodle.moodlemobile.
     * @param string $publickey The app generated public key.
     * @return bool
     * @since Moodle 4.2
     */
    public static function update_device_key(string $uuid, string $appid, string $publickey): bool {
        global $USER, $DB;

        if (!$DB->get_record(
            'user_devices',
            ['uuid' => $uuid, 'appid' => $appid, 'userid' => $USER->id]
        )) {
            return false;
        }

        $DB->set_field(
            'user_devices',
            'publickey',
            $publickey,
            ['uuid' => $uuid, 'appid' => $appid, 'userid' => $USER->id]
        );

        return true;
    }

    private static function get_moodle_server_keypair(): string {
        $storedkeypair = get_config('tool_mobile', 'x25519_keypair');
        if ($storedkeypair) {
            $keypair = sodium_base642bin($storedkeypair, SODIUM_BASE64_VARIANT_ORIGINAL);
        }
        if (empty($storedkeypair)) {
            $keypair = sodium_crypto_box_keypair();
            set_config(
                'x25519_keypair',
                sodium_bin2base64($keypair, SODIUM_BASE64_VARIANT_ORIGINAL),
                'tool_mobile'
            );
        }

        return $keypair;
    }

    public static function get_moodle_server_publickey(): string {
        $keypair = self::get_moodle_server_keypair();

        return sodium_crypto_box_publickey($keypair);
    }

    public static function get_signed_encryption_key(string $publickey): string {
        $keypair = self::get_moodle_server_keypair();

        return sodium_crypto_box_keypair_from_secretkey_and_publickey(
            sodium_crypto_box_secretkey($keypair),
            $publickey
        );
    }

    public static function unseal_message(string $encrypted, ?string $signerpublickey = null, ?string $nonce = null): string {
        $keypair = self::get_moodle_server_keypair();

        if ($signerpublickey === null) {
            return sodium_crypto_box_seal_open($encrypted, $keypair);
        }

        $key = sodium_crypto_box_keypair_from_secretkey_and_publickey(
            sodium_crypto_box_secretkey($keypair),
            $signerpublickey
        );
        return sodium_crypto_box_open($encrypted, $nonce, $key);
    }
}
