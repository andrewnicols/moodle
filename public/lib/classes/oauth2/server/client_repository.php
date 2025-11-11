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

use core\url;
use League\OAuth2\Server\Repositories\ClientRepositoryInterface;

/**
 * Class client_repository
 *
 * @package    core
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class client_repository implements ClientRepositoryInterface {
    #[\Override]
    public function getClientEntity(
        $clientidentifier,
    ): ?\League\OAuth2\Server\Entities\ClientEntityInterface {
        // For simplicity, we are not implementing client storage in this example.

        return match($clientidentifier) {
            '12345' => $this->create_client($clientidentifier, 'https://mandarin.nicols.uk/oauth2/client/process_auth_code.php'),
            'postman' => $this->create_client($clientidentifier, 'https://oauth.pstmn.io/v1/callback'),
            'openapi' => $this->create_client($clientidentifier, (new url('/admin/swaggerui-oauth2.php'))->out()),
            default => null,
        };
    }

    private function create_client(
        string $identifier,
        string $uri,
    ): client_entity {
        $client = new client_entity(
            'Test Client',
            $uri,
        );

        $client->setIdentifier($identifier);

        return $client;
    }

    #[\Override]
    public function validateClient(
        $clientidentifier,
        $clientsecret = null,
        $granttype = null,
    ): bool {
        // TODO.
        return true;
    }
}
