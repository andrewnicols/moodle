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

use League\OAuth2\Server\Entities\AccessTokenEntityInterface;
use League\OAuth2\Server\Entities\ClientEntityInterface;
use League\OAuth2\Server\Repositories\AccessTokenRepositoryInterface;

/**
 * Class access_token_repository
 *
 * @package    core
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class access_token_repository implements AccessTokenRepositoryInterface {
    #[\Override]
    public function getNewToken(
        ClientEntityInterface $cliententity,
        array $scopes,
        $useridentifier = null,
    ): AccessTokenEntityInterface {
        $entity = new access_token_entity();
        $entity->setClient($cliententity);

        foreach ($scopes as $scope) {
            $entity->addScope($scope);
        }

        if ($useridentifier !== null) {
            $entity->setUserIdentifier($useridentifier);
        }

        return $entity;
    }

    #[\Override]
    public function persistNewAccessToken(
        AccessTokenEntityInterface $accesstoken,
    ): void {
        // For simplicity, we are not implementing access token storage in this example.
    }

    #[\Override]
    public function revokeAccessToken($tokenid): void {
        // For simplicity, we are not implementing access token revocation in this example.
    }

    #[\Override]
    public function isAccessTokenRevoked($tokenid): bool {
        // For simplicity, we are not implementing access token revocation checking in this example.
        return false;
    }
}
