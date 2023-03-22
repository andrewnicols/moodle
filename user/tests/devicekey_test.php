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

namespace core_user;

/**
 * Tests for the devicekey class.
 *
 * @package core_user
 * @covers \core_user\devicekey
 */
class devicekey_test extends \advanced_testcase {

    /**
     * Test that the existing keypair will be returned if it already exists.
     * And that it is a valid key.
     *
     * @covers ::get_moodle_device_keypair
     */
    public function test_get_moodle_server_publickey(): void {
        $this->resetAfterTest();

        $key = devicekey::get_moodle_server_publickey();
        $this->assertNotEmpty($key);

        $key2 = devicekey::get_moodle_server_publickey();
        $this->assertEquals($key, $key2);

        // Validate that the key is a base64-encoded value.
        $message = <<<EOF
            This should be a meaningful message.

            Perhaps a love message to your significant other, a note to your child, a letter to a parent, or a long-lost friend?
        EOF;

        $encrypted = sodium_crypto_box_seal($message, $key);
        $this->assertEquals(
            $message,
            devicekey::unseal_message($encrypted)
        );
    }

    public function test_get_signed_encryption_key(): void {
        $this->resetAfterTest();

        $publickey = devicekey::get_moodle_server_publickey();
        $devicekeypair = sodium_crypto_box_keypair();
        $deviceprivatekey = sodium_crypto_box_secretkey($devicekeypair);
        $devicepublickey = sodium_crypto_box_publickey($devicekeypair);
        $message = <<<EOF
            This should be a meaningful message.

            Perhaps a love message to your significant other, a note to your child, a letter to a parent, or a long-lost friend?
        EOF;

        // Get a signed key.
        // This is a new key based on the device public key, and the moodle private key.
        $signedkey = devicekey::get_signed_encryption_key($devicepublickey);
        $this->assertNotEmpty($signedkey);

        $nonce = random_bytes(SODIUM_CRYPTO_BOX_NONCEBYTES);
        $encrypted = sodium_crypto_box($message, $nonce, $signedkey);


        $this->assertEquals(
            $message,
            sodium_crypto_box_open(
                $encrypted,
                $nonce,
                sodium_crypto_box_keypair_from_secretkey_and_publickey($deviceprivatekey, $publickey)
            )
        );
    }
}
