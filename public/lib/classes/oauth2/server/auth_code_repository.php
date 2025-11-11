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

use League\OAuth2\Server\Entities\AuthCodeEntityInterface;

/**
 * The OAuth2 authorization code repository.
 *
 * This repository is responsible for retrieving, persisting, and revoking authorization codes.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class auth_code_repository implements \League\OAuth2\Server\Repositories\AuthCodeRepositoryInterface {
    #[\Override]
    public function getNewAuthCode(): AuthCodeEntityInterface {
        return new auth_code_entity();
    }

    #[\Override]
    public function persistNewAuthCode(
        AuthCodeEntityInterface $authcodeentity,
    ): void {
        global $DB;

        $DB->insert_record('oauth2_server_client_auth_codes', (object) [
            'identifier' => $authcodeentity->getIdentifier(),
            'expiry' => $authcodeentity->getExpiryDateTime()->getTimestamp(),
            'userid' => $authcodeentity->getUserIdentifier(),
            'scopes' => implode(' ', array_map(fn($scope): string => $scope->getIdentifier(), $authcodeentity->getScopes())),
            'status' => auth_code_entity::STATUS_ACTIVE,
        ]);
    }

    #[\Override]
    public function revokeAuthCode(string $codeid): void {
        global $DB;

        $DB->set_field(
            'oauth2_server_client_auth_codes',
            'status',
            auth_code_entity::STATUS_REVOKED,
            ['identifier' => $codeid],
        );
    }

    #[\Override]
    public function isAuthCodeRevoked(string $codeid): bool {
        global $DB;

        $status = $DB->get_field('oauth2_server_client_auth_codes', 'status', [
            'identifier' => $codeid,
        ]);

        if ($status === false) {
            return true;
        }

        return (int) $status === auth_code_entity::STATUS_REVOKED;
    }
}
