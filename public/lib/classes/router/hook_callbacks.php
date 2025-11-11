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

namespace core\router;

use League\OAuth2\Server\Repositories\AccessTokenRepositoryInterface;
use League\OAuth2\Server\Repositories\AuthCodeRepositoryInterface;
use League\OAuth2\Server\Repositories\ClientRepositoryInterface;
use League\OAuth2\Server\Repositories\RefreshTokenRepositoryInterface;
use League\OAuth2\Server\Repositories\ScopeRepositoryInterface;
use League\OAuth2\Server\AuthorizationServer;
use League\OAuth2\Server\Repositories\UserRepositoryInterface;

/**
 * Class hook_callbacks
 *
 * @package    core
 * @copyright  2024 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class hook_callbacks {
    /**
     * Provide DI Configuration for the Router system.
     *
     * @param \core\hook\di_configuration $hook
     * @codeCoverageIgnore
     */
    public static function provide_di_configuration(
        \core\hook\di_configuration $hook,
    ): void {
        $hook->add_definition(
            request_validator_interface::class,
            \DI\get(request_validator::class),
        );
        $hook->add_definition(
            response_validator_interface::class,
            \DI\get(response_validator::class),
        );
        $hook->add_definition(
            route_loader_interface::class,
            \DI\get(route_loader::class),
        );

        self::configure_oauth2_server($hook);
    }

    /**
     * Generate the OAuth2 configuration.
     *
     * @param \core\router\ContainerBuilder $builder
     */
    private static function configure_oauth2_server(
        \core\hook\di_configuration $hook,
    ): void {
        $hook->add_definition(
            'oauth2.server.private_key',
            \DI\factory(function (): string {
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

                if (!empty($privatekey)) {
                    $cachelocationtmp = $cachelocation . '.tmp';
                    file_put_contents($cachelocationtmp, $privatekey);
                    rename($cachelocationtmp, $cachelocation);

                    return $privatekey;
                }

                $privatekey = openssl_pkey_new([
                    'private_key_type' => OPENSSL_KEYTYPE_RSA,
                    'private_key_bits' => 2048,
                ]);

                $output = '';
                openssl_pkey_export($privatekey, $output);

                set_config('oauth2_private_key', $output, null);

                return $output;
            }),
        );

        $hook->add_definition(
            'oauth2.server.encryption_key',
            \DI\factory(function (): string {
                global $CFG;

                // Cache path.
                $cachelocation = $CFG->localcachedir . '/oauth2_encryption_key.pem';

                if (file_exists($cachelocation)) {
                    return file_get_contents($cachelocation);
                }
                if (ABORT_AFTER_CONFIG && !defined('ABORT_AFTER_CONFIG_CANCEL')) {
                    define('ABORT_AFTER_CONFIG_CANCEL', true);
                    require("{$CFG->dirroot}/lib/setup.php");
                }


                $encryptionkey = get_config('core', 'oauth2_encryption_key');

                if (!empty($encryptionkey)) {
                    $cachelocationtmp = $cachelocation . '.tmp';
                    file_put_contents($cachelocationtmp, $encryptionkey);
                    rename($cachelocationtmp, $cachelocation);

                    return $encryptionkey;
                }

                $key = \Defuse\Crypto\Key::createNewRandomKey();
                $asciikey = $key->saveToAsciiSafeString();

                set_config('oauth2_encryption_key', $asciikey, null);

                return $asciikey;
            }),
        );

        $hook->add_definition(
            AuthorizationServer::class,
            \DI\create()
                ->constructor(
                    \DI\get(ClientRepositoryInterface::class),
                    \DI\get(AccessTokenRepositoryInterface::class),
                    \DI\get(ScopeRepositoryInterface::class),
                    \DI\get('oauth2.server.private_key'),
                    \DI\get('oauth2.server.encryption_key'),
                )
                ->method(
                    'enableGrantType',
                    \DI\get(\League\OAuth2\Server\Grant\AuthCodeGrant::class),
                    \DI\create(\DateInterval::class)->constructor('PT1H'),
                )
                ->method(
                    'enableGrantType',
                    \DI\create(\League\OAuth2\Server\Grant\RefreshTokenGrant::class)
                        ->constructor(
                            \DI\get(RefreshTokenRepositoryInterface::class)
                        )
                        ->method('setRefreshTokenTTL', \DI\create(\DateInterval::class)->constructor('P1M')),
                ),
        );

        $hook->add_definition(
            \League\OAuth2\Server\ResourceServer::class,
            \DI\create()
                ->constructor(
                    \DI\get(AccessTokenRepositoryInterface::class),
                    \DI\get('oauth2.server.private_key'),
                ),
        );

        $hook->add_definition(
            \League\OAuth2\Server\Grant\AuthCodeGrant::class,
            \DI\create()
                ->constructor(
                    \DI\get(AuthCodeRepositoryInterface::class),
                    \DI\get(RefreshTokenRepositoryInterface::class),
                    \DI\create(\DateInterval::class)->constructor('PT10M'),
                )
                ->method('disableRequireCodeChallengeForPublicClients')
                ->method('setRefreshTokenTTL', \DI\create(\DateInterval::class)->constructor('P1M')),
        );

        $hook->add_definition(
            ClientRepositoryInterface::class,
            \DI\get(\core\oauth2\server\client_repository::class),
        );
        $hook->add_definition(
            AccessTokenRepositoryInterface::class,
            \DI\get(\core\oauth2\server\access_token_repository::class),
        );
        $hook->add_definition(
            ScopeRepositoryInterface::class,
            \DI\get(\core\oauth2\server\scope_repository::class),
        );
        $hook->add_definition(
            AuthCodeRepositoryInterface::class,
            \DI\get(\core\oauth2\server\auth_code_repository::class),
        );
        $hook->add_definition(
            RefreshTokenRepositoryInterface::class,
            \DI\get(\core\oauth2\server\refresh_token_repository::class),
        );
        $hook->add_definition(
            UserRepositoryInterface::class,
            \DI\get(\core\oauth2\server\user_repository::class),
        );
    }
}
