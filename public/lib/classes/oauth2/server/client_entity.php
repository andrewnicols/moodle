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

    /** @var \core\context The owner context */
    protected \core\context $ownercontext;

    /** @var int The status of the client */
    protected int $status;

    /** @var string|null The description of the client */
    protected ?string $description = null;

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
        $client->ownercontext = \core\context::instance_by_id($clientrecord->ownercontext);
        $client->status = (int) $clientrecord->status;
        $client->description = $clientrecord->description;

        // TODO: Store this in the database?
        // Derive it from whether a secret exists?
        // Select an app type and use that to derive a value?
        // Better to err on the side of caution?
        // This is counter-intuitive.
        // This _has_ to be true for ClientCredentials grant.
        $client->isConfidential = false;
        $client->isConfidential = true;

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

    /**
     * Whether the Client is active and not revoked.
     *
     * @return bool
     */
    public function is_active(): bool {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Returns true if the client supports the given grant type.
     *
     * @param string $granttype The grant type to check.
     * @return bool True if the client supports the grant type, false otherwise.
     */
    public function supportsGrantType(string $granttype): bool { // phpcs:ignore moodle.NamingConventions.ValidFunctionName.LowercaseMethod
        if ($granttype === 'client_credentials') {
            if (!$this->isConfidential()) {
                return false;
            }

            if ($this->ownercontext->contextlevel !== CONTEXT_SYSTEM) {
                // Client Credentials grant only allowed for system context clients.
                return false;
            }
        }

        // For now, all clients support all grant types.
        return true;
    }

    public function get_description(): ?string {
        return $this->description;
    }
}
