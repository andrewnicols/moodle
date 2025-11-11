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
 * Class refresh_token_repository
 *
 * @package    core
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class refresh_token_repository implements \League\OAuth2\Server\Repositories\RefreshTokenRepositoryInterface {
    #[\Override]
    public function getNewRefreshToken(): ?\League\OAuth2\Server\Entities\RefreshTokenEntityInterface {
        return new refresh_token_entity();
    }

    #[\Override]
    public function persistNewRefreshToken(
        \League\OAuth2\Server\Entities\RefreshTokenEntityInterface $refreshTokenEntity
    ): void {
        // TODO: Implement persistNewRefreshToken() method.
    }

    #[\Override]
    public function revokeRefreshToken($tokenId): void {
        // TODO: Implement revokeRefreshToken() method.
    }

    #[\Override]
    public function isRefreshTokenRevoked($tokenId): bool {
        // TODO: Implement isRefreshTokenRevoked() method.

        return false;
    }
}
