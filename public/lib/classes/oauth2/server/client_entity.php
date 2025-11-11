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
 * Class client_entity
 *
 * @package    core
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class client_entity implements \League\OAuth2\Server\Entities\ClientEntityInterface {
    use \League\OAuth2\Server\Entities\Traits\ClientTrait;
    use \League\OAuth2\Server\Entities\Traits\EntityTrait;

    /** @var int A status to inform that the token has been revoked */
    public const int STATUS_REVOKED = 0;

    /** @var int A status to inform that the token is active */
    public const int STATUS_ACTIVE = 1;

    /**
     * Create a client_entity from a database record.
     *
     * @param \stdClass $clientrecord The client database record.
     * @param array $redirecturis Array of redirect URI records.
     * @return self The client entity.
     */
    public static function from_record(
        \stdClass $clientrecord,
        array $redirecturis,
    ): self {
        $redirecturiarray = [];
        foreach ($redirecturis as $redirecturi) {
            $redirecturiarray[] = $redirecturi->uri;
        }

        $client = new self();
        $client->setIdentifier($clientrecord->clientidentifier);
        $client->name = $clientrecord->name;
        $client->redirectUri = $redirecturiarray;

        // Better to err on the side of caution?
        $client->isConfidential = true;
        $client->isConfidential = false;

        return $client;
    }

    /**
     * Generate and store a new secret for this client.
     *
     * The secret is stored in hashed form in the database and can only be retrieved at creation time.
     *
     * @return string The generated secret.
     */
    public function generate_secret(): string {
        global $DB;

        $secret = bin2hex(openssl_random_pseudo_bytes(32));

        $DB->insert_record('oauth2_server_client_secrets', (object) [
            'clientidentifier' => $this->getIdentifier(),
            'secret' => password_hash($secret, PASSWORD_DEFAULT),
            'timecreated' => time(),
            'lastaccessed' => 0,
        ]);

        return $secret;
    }
}
