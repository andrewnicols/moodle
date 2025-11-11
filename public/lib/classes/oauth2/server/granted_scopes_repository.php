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

use core\router\scope\abstract_scope;
use League\OAuth2\Server\Entities\ClientEntityInterface;
use League\OAuth2\Server\Entities\UserEntityInterface;

/**
 * Class granted_scopes_repository
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class granted_scopes_repository {
    /**
     * Get the granted scopes for the specified client/user combination.
     *
     * @param ClientEntityInterface $client
     * @param UserEntityInterface $user
     * @return abstract_scope[]
     */
    public function get_granted_scopes_for_user(
        ClientEntityInterface $client,
        UserEntityInterface $user,
    ): array {
        global $DB;

        $scope = $DB->get_field_sql(
            "SELECT scope
               FROM {oauth2_server_client_granted_scopes} gs
              WHERE gs.clientidentifier = :clientidentifier
                AND gs.userid = :userid",
            [
                'clientidentifier' => $client->getIdentifier(),
                'userid' => $user->getIdentifier(),
            ],
        );

        $scopes = array_filter(explode(' ', $scope), static fn($s) => !empty($s));

        return array_map(
            static fn($scope): abstract_scope => scope_repository::from_identifier($scope),
            $scopes,
        );
    }

    public function has_granted_all_scopes(
        ClientEntityInterface $client,
        UserEntityInterface $user,
        array $requestedscopes,
    ): bool {
        $grantedscopeentities = $this->get_granted_scopes_for_user($client, $user);
        $grantedscopeidentifiers = array_map(
            static fn($scopeentity): string => $scopeentity->getIdentifier(),
            $grantedscopeentities,
        );

        foreach ($requestedscopes as $requestedscope) {
            if (!in_array($requestedscope->getIdentifier(), $grantedscopeidentifiers, true)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Update all granted scopes for the user.
     *
     * @param ClientEntityInterface $client
     * @param UserEntityInterface $user
     * @param array $scopes
     * @return void
     */
    public function store_granted_scopes_for_user(
        ClientEntityInterface $client,
        UserEntityInterface $user,
        array $scopes,
    ): void {
        global $DB;

        // TODO: Upsert instead of delete + insert.

        $scopes = array_filter($scopes);
        asort($scopes);
        $scopestring = implode(' ', $scopes);

        $DB->delete_records(
            'oauth2_server_client_granted_scopes',
            [
                'clientidentifier' => $client->getIdentifier(),
                'userid' => $user->getIdentifier(),
            ],
        );

        $DB->insert_record('oauth2_server_client_granted_scopes', (object) [
            'clientidentifier' => $client->getIdentifier(),
            'userid' => $user->getIdentifier(),
            'scope' => $scopestring,
        ]);
    }
}
