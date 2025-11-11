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

namespace core\oauth2\server;

/**
 * The OAuth2 refresh token repository.
 *
 * This repository is responsible for retrieving, persisting, and revoking refresh tokens.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class refresh_token_repository implements \League\OAuth2\Server\Repositories\RefreshTokenRepositoryInterface {
    #[\Override]
    public function getNewRefreshToken(): ?\League\OAuth2\Server\Entities\RefreshTokenEntityInterface {
        return new refresh_token_entity();
    }

    #[\Override]
    public function persistNewRefreshToken(
        \League\OAuth2\Server\Entities\RefreshTokenEntityInterface $refreshtokenentity
    ): void {
        global $DB;

        /** @var access_token_entity $token */
        $token = $refreshtokenentity->getAccessToken();

        $DB->insert_record('oauth2_server_client_refresh_tokens', (object)[
            'identifier' => $refreshtokenentity->getIdentifier(),
            'expiry' => $refreshtokenentity->getExpiryDateTime()->getTimestamp(),
            'accesstokenidentifier' => $token->getIdentifier(),
        ]);
    }

    #[\Override]
    public function revokeRefreshToken($tokenid): void {
        global $DB;

        $DB->set_field(
            'oauth2_server_client_refresh_tokens',
            'status',
            refresh_token_entity::STATUS_REVOKED,
            ['identifier' => $tokenid]
        );
    }

    #[\Override]
    public function isRefreshTokenRevoked($tokenid): bool {
        global $DB;

        $status = $DB->get_field('oauth2_server_client_refresh_tokens', 'status', [
            'identifier' => $tokenid,
        ]);

        if ($status === false) {
            return true;
        }

        return (int) $status === refresh_token_entity::STATUS_REVOKED;
    }
}
