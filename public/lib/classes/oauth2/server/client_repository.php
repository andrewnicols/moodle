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

use League\OAuth2\Server\Repositories\ClientRepositoryInterface;

/**
 * The OAuth2 client repository.
 *
 * This repository is responsible for retrieving and validating client entities.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class client_repository implements ClientRepositoryInterface {
    /**
     * Get a client entity.
     *
     * @param string $clientidentifier
     * @return client_entity|null
     */
    #[\Override]
    public function getClientEntity(
        $clientidentifier,
    ): ?\League\OAuth2\Server\Entities\ClientEntityInterface {
        global $DB;

        $clientrecord = $DB->get_record('oauth2_server_clients', ['clientidentifier' => $clientidentifier]);

        if (!$clientrecord) {
            return null;
        }

        $redirecturis = $DB->get_records('oauth2_server_client_redirect_uris', ['clientidentifier' => $clientidentifier]);

        return client_entity::from_record($clientrecord, $redirecturis ?: []);
    }

    #[\Override]
    public function validateClient(
        $clientidentifier,
        $clientsecret = null,
        $granttype = null,
    ): bool {
        global $DB;
        // TODO.
        // Check if the client is:
        // - active, expired, or revoked;
        // - if the client is 'confidential', we *must* validate the client secret;
        // - allowed to use the given grant type.

        // Not all clients will be allowed to use all grant types.
        // If we grant the ClientCredentials grant to a client then that client will be able to act as admin.
        // They have no option to be a different user.

        // Fetch the client record.
        $client = self::getClientEntity($clientidentifier);
        if (!$client) {
            return false;
        }

        if (!$client->is_active()) {
            return false;
        }

        if (!$client->supportsGrantType($granttype)) {
            return false;
        }

        $secrets = $DB->get_records('oauth2_server_client_secrets', [
            'clientidentifier' => $clientidentifier,
            'status' => client_entity::STATUS_ACTIVE,
        ]);

        foreach ($secrets as $secret) {
            if (password_verify($clientsecret, $secret->secret)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Create a new OAuth2 client.
     *
     * @param \core\context $ownercontext
     * @param string $clientidentifier
     * @param array $redirecturis
     * @return \League\OAuth2\Server\Entities\ClientEntityInterface|null
     */
    public function create_client(
        \core\context $ownercontext,
        string $name,
        string $description,
        array $redirecturis,
    ): client_entity {
        global $DB;

        $clientidentifier = bin2hex(openssl_random_pseudo_bytes(16));
        $id = $DB->insert_record('oauth2_server_clients', [
            'clientidentifier' => $clientidentifier,
            'name' => $name,
            'description' => $description,
            'ownercontext' => $ownercontext->id,
            'timecreated' => time(),
        ]);
        $clientrecord = $DB->get_record('oauth2_server_clients', ['id' => $id]);

        foreach ($redirecturis as $uri) {
            $DB->insert_record('oauth2_server_client_redirect_uris', (object)[
                'clientidentifier' => $clientidentifier,
                'uri' => $uri,
            ]);
        }

        return $this->getClientEntity($clientidentifier);
    }

    /**
     * Add a new redirect URI for a client.
     *
     * @param string $clientidentifier
     * @param string $redirecturi
     */
    public function add_redirect_uri(
        string $clientidentifier,
        string $redirecturi,
    ): void {
        global $DB;

        $DB->insert_record('oauth2_server_client_redirect_uris', (object)[
            'clientidentifier' => $client->getIdentifier(),
            'uri' => $redirecturi,
        ]);
    }
}
