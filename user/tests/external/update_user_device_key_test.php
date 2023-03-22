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

namespace core_user\external;

use core_external\external_api;

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->dirroot . '/webservice/tests/helpers.php');

/**
 * Unit tests for the update_user_device_key web service.
 *
 * @package    core_user
 * @category   external
 * @copyright  2023 Alex Morris <alex.morris@catalyst.net.nz>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since Moodle 4.2
 * @covers \core_user\external\update_user_device_key
 */
class update_user_device_key_test extends \externallib_advanced_testcase {
    public function test_execute_invalid_device(): void {
        $this->resetAfterTest();

        $user = $this->getDataGenerator()->create_user();
        $this->setUser($user);

        // Test sending a key to an invalid device.
        $result = update_user_device_key::execute('fakedevice', 'moodlemobile', 'fakekey');
        $result = external_api::clean_returnvalue(update_user_device_key::execute_returns(), $result);
        $this->assertFalse($result['status']);
        $this->assertNotEmpty($result['warnings']);
        $this->assertNotEmpty($result['moodlekey']);

        // Validate that the returned moodlekey is a base64-encoded value.
        $moodlekey = sodium_base642bin($result['moodlekey'],
            SODIUM_BASE64_VARIANT_ORIGINAL
        );

        // Validate that it matches the stored key.
        $this->assertEquals($moodlekey, \core_user\devicekey::get_moodle_server_publickey());
    }

    public function test_execute_moodlekey_static(): void {
        global $DB;

        $this->resetAfterTest();

        $users = [
            $this->getDataGenerator()->create_user(),
            $this->getDataGenerator()->create_user(),
        ];

        $results = [];
        foreach ($users as $user) {
            $this->setUser($user);
            // Create user device to add the key against.
            $device = [
                'appid' => 'com.moodle.moodlemobile',
                'name' => 'occam',
                'model' => 'Nexus 4',
                'platform' => 'Android',
                'version' => '4.2.2',
                'pushid' => 'apushdkasdfj4835',
                'uuid' => 'ABCDE3723ksdfhasfaasef859',
                'userid' => $user->id,
                'timecreated' => time(),
                'timemodified' => time(),
            ];
            $DB->insert_record('user_devices', $device);

            // Create a keypair and extract the public key.
            $keypair = sodium_crypto_box_keypair();
            $publickey = sodium_crypto_box_publickey($keypair);
            $encodedpublickey = sodium_bin2base64($publickey, SODIUM_BASE64_VARIANT_ORIGINAL);

            // Test sending a key to a valid device.
            $result = update_user_device_key::execute($device['uuid'], $device['appid'], $encodedpublickey);
            $result = external_api::clean_returnvalue(update_user_device_key::execute_returns(), $result);
            $this->assertTrue($result['status']);
            $this->assertEmpty($result['warnings']);
            $this->assertNotEmpty($result['moodlekey']);
            $results[] = $result;
        }

        // Validate that the same moodlekey is returned for each user.
        $this->assertEquals($results[0]['moodlekey'], $results[1]['moodlekey']);

        // Validate that the returned moodlekey is a base64-encoded value.
        $moodlekey = sodium_base642bin($results[0]['moodlekey'], SODIUM_BASE64_VARIANT_ORIGINAL);

        // Validate that it matches the stored key.
        $this->assertEquals($moodlekey, \core_user\devicekey::get_moodle_server_publickey());
    }
}
