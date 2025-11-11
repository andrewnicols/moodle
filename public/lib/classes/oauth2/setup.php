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

namespace core\oauth2;

use League\OAuth2\Server\Repositories\AccessTokenRepositoryInterface;
use League\OAuth2\Server\Repositories\AuthCodeRepositoryInterface;
use League\OAuth2\Server\Repositories\ClientRepositoryInterface;
use League\OAuth2\Server\Repositories\RefreshTokenRepositoryInterface;
use League\OAuth2\Server\Repositories\ScopeRepositoryInterface;
use League\OAuth2\Server\AuthorizationServer;
use League\OAuth2\Server\Repositories\UserRepositoryInterface;

/**
 * OAuth2 Setup and Configuration.
 *
 * Note: This class is used during installation and upgrade.
 * It should have minimal dependencies on other Moodle code.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class setup {
    /**
     * Configure OAuth2 keys.
     */
    public static function configure_keys(): void {
        self::get_private_key();
        self::get_encryption_key();
    }

    /**
     * Fetch the OAuth2 Private key.
     *
     * @return string
     */
    public static function get_private_key(): string {
        global $CFG;

        // Cache path.
        $cachelocation = $CFG->localcachedir . '/oauth2_private_key.pem';

        if (file_exists($cachelocation)) {
            return file_get_contents($cachelocation);
        }

        if (defined('ABORT_AFTER_CONFIG') && !defined('ABORT_AFTER_CONFIG_CANCEL')) {
            define('ABORT_AFTER_CONFIG_CANCEL', true);
            require("{$CFG->dirroot}/lib/setup.php");
        }

        $privatekey = get_config('core', 'oauth2_private_key');

        if (empty($privatekey)) {
            $keydata = openssl_pkey_new([
                'private_key_type' => OPENSSL_KEYTYPE_RSA,
                'private_key_bits' => 2048,
            ]);

            $privatekey = '';
            openssl_pkey_export($keydata, $privatekey);

            set_config('oauth2_private_key', $privatekey, null);
        }

        $cachelocationtmp = $cachelocation . uniqid();
        file_put_contents($cachelocationtmp, $privatekey);
        rename($cachelocationtmp, $cachelocation);

        return $privatekey;
    }

    /**
     * Fetch the OAuth2 Public key.
     *
     * @param string $privatekey
     * @return string
     */
    public static function get_public_key(string $privatekey): string {
        global $CFG;

        // Cache path.
        $cachelocation = $CFG->localcachedir . '/oauth2_public_key.pem';

        if (file_exists($cachelocation)) {
            return file_get_contents($cachelocation);
        }

        $details = openssl_pkey_get_details(openssl_pkey_get_private($privatekey));
        $publickey = $details['key'];

        $cachelocationtmp = $cachelocation . uniqid();
        file_put_contents($cachelocationtmp, $publickey);
        rename($cachelocationtmp, $cachelocation);

        return $publickey;
    }

    /**
     * Fetch the OAuth2 Encryption key.
     *
     * @return string
     */
    public static function get_encryption_key(): string {
        global $CFG;

        $cachelocation = $CFG->localcachedir . '/oauth2_encryption_key.pem';

        if (file_exists($cachelocation)) {
            return file_get_contents($cachelocation);
        }

        $asciikey = get_config('core', 'oauth2_encryption_key');

        if (empty($asciikey)) {
            $key = \Defuse\Crypto\Key::createNewRandomKey();
            $asciikey = $key->saveToAsciiSafeString();

            set_config('oauth2_encryption_key', $asciikey, null);
        }

        $cachelocationtmp = $cachelocation . uniqid();
        file_put_contents($cachelocationtmp, $asciikey);
        rename($cachelocationtmp, $cachelocation);

        return $asciikey;
    }
}
