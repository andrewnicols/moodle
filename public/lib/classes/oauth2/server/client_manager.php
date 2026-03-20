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
 * Manager for OAuth2 server client administration.
 *
 * Provides CRUD operations for OAuth2 clients, secrets, and redirect URIs.
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class client_manager {
    /** @var int Maximum number of active secrets per client */
    public const int MAX_ACTIVE_SECRETS = 2;

    /**
     * Get all OAuth2 server clients.
     *
     * @return array Array of client records.
     */
    public static function get_all_clients(): array {
        global $DB;
        return $DB->get_records('oauth2_server_clients', null, 'name ASC');
    }

    /**
     * Get a single client by its database ID.
     *
     * @param int $id The client record ID.
     * @return \stdClass|false The client record, or false if not found.
     */
    public static function get_client_by_id(int $id): \stdClass|false {
        global $DB;
        return $DB->get_record('oauth2_server_clients', ['id' => $id]);
    }

    /**
     * Get a single client by its client identifier string.
     *
     * @param string $clientidentifier The client identifier.
     * @return \stdClass|false The client record, or false if not found.
     */
    public static function get_client_by_identifier(string $clientidentifier): \stdClass|false {
        global $DB;
        return $DB->get_record('oauth2_server_clients', ['clientidentifier' => $clientidentifier]);
    }

    /**
     * Update an existing client's name and description.
     *
     * @param int $id The client record ID.
     * @param string $name The new client name.
     * @param string $description The new client description.
     */
    public static function update_client(int $id, string $name, string $description): void {
        global $DB;

        $record = $DB->get_record('oauth2_server_clients', ['id' => $id], '*', MUST_EXIST);
        $record->name = $name;
        $record->description = $description;
        $DB->update_record('oauth2_server_clients', $record);
    }

    /**
     * Revoke a client (soft-delete).
     *
     * Sets the client status to revoked. Also revokes all active secrets.
     *
     * @param int $id The client record ID.
     */
    public static function revoke_client(int $id): void {
        global $DB;

        $record = $DB->get_record('oauth2_server_clients', ['id' => $id], '*', MUST_EXIST);
        $record->status = client_entity::STATUS_REVOKED;
        $DB->update_record('oauth2_server_clients', $record);

        // Revoke all active secrets for this client.
        $DB->set_field(
            'oauth2_server_client_secrets',
            'status',
            client_entity::STATUS_REVOKED,
            [
                'clientidentifier' => $record->clientidentifier,
                'status' => client_entity::STATUS_ACTIVE,
            ],
        );
    }

    /**
     * Re-enable a previously revoked client.
     *
     * @param int $id The client record ID.
     */
    public static function enable_client(int $id): void {
        global $DB;

        $record = $DB->get_record('oauth2_server_clients', ['id' => $id], '*', MUST_EXIST);
        $record->status = client_entity::STATUS_ACTIVE;
        $DB->update_record('oauth2_server_clients', $record);
    }

    /**
     * Permanently delete a client and all associated data.
     *
     * The client must be revoked before it can be deleted.
     *
     * @param int $id The client record ID.
     * @throws \moodle_exception If the client is not revoked.
     */
    public static function delete_client(int $id): void {
        global $DB;

        $record = $DB->get_record('oauth2_server_clients', ['id' => $id], '*', MUST_EXIST);

        if ((int) $record->status !== client_entity::STATUS_REVOKED) {
            throw new \moodle_exception('oauth2server:deletenotrevokedfirst', 'moodle');
        }

        $clientidentifier = $record->clientidentifier;

        // Delete all associated data.
        $DB->delete_records('oauth2_server_client_secrets', ['clientidentifier' => $clientidentifier]);
        $DB->delete_records('oauth2_server_client_redirect_uris', ['clientidentifier' => $clientidentifier]);
        $DB->delete_records('oauth2_server_client_access_tokens', ['clientidentifier' => $clientidentifier]);
        $DB->delete_records('oauth2_server_client_refresh_tokens', ['accesstokenidentifier' => $clientidentifier]);
        $DB->delete_records('oauth2_server_client_auth_codes', ['identifier' => $clientidentifier]);
        $DB->delete_records('oauth2_server_client_granted_scopes', ['clientidentifier' => $clientidentifier]);
        $DB->delete_records('oauth2_server_clients', ['id' => $id]);
    }

    /**
     * Get all secrets for a client (metadata only, not the hashed values).
     *
     * @param string $clientidentifier The client identifier.
     * @return array Array of secret records (id, timecreated, status, lastaccessed).
     */
    public static function get_secrets(string $clientidentifier): array {
        global $DB;

        return $DB->get_records(
            'oauth2_server_client_secrets',
            ['clientidentifier' => $clientidentifier],
            'timecreated DESC',
            'id, timecreated, status, lastaccessed',
        );
    }

    /**
     * Count the number of active secrets for a client.
     *
     * @param string $clientidentifier The client identifier.
     * @return int The number of active secrets.
     */
    public static function count_active_secrets(string $clientidentifier): int {
        global $DB;

        return $DB->count_records('oauth2_server_client_secrets', [
            'clientidentifier' => $clientidentifier,
            'status' => client_entity::STATUS_ACTIVE,
        ]);
    }

    /**
     * Generate a new secret for a client.
     *
     * The secret is returned in plain text and stored hashed. It can only be
     * retrieved at creation time. Maximum of MAX_ACTIVE_SECRETS active secrets
     * per client.
     *
     * @param string $clientidentifier The client identifier.
     * @return string The generated plain-text secret.
     * @throws \moodle_exception If the maximum number of active secrets has been reached.
     */
    public static function generate_secret(string $clientidentifier): string {
        global $DB;

        $activecount = self::count_active_secrets($clientidentifier);
        if ($activecount >= self::MAX_ACTIVE_SECRETS) {
            throw new \moodle_exception(
                'oauth2server:secretmaxreached',
                'moodle',
                '',
                self::MAX_ACTIVE_SECRETS,
            );
        }

        $secret = bin2hex(openssl_random_pseudo_bytes(32));

        $DB->insert_record('oauth2_server_client_secrets', (object) [
            'clientidentifier' => $clientidentifier,
            'secret' => password_hash($secret, PASSWORD_DEFAULT),
            'timecreated' => time(),
            'status' => client_entity::STATUS_ACTIVE,
            'lastaccessed' => 0,
        ]);

        return $secret;
    }

    /**
     * Revoke a secret.
     *
     * @param int $secretid The secret record ID.
     */
    public static function revoke_secret(int $secretid): void {
        global $DB;

        $record = $DB->get_record('oauth2_server_client_secrets', ['id' => $secretid], '*', MUST_EXIST);
        $record->status = client_entity::STATUS_REVOKED;
        $DB->update_record('oauth2_server_client_secrets', $record);
    }

    /**
     * Get all redirect URIs for a client.
     *
     * @param string $clientidentifier The client identifier.
     * @return array Array of redirect URI records.
     */
    public static function get_redirect_uris(string $clientidentifier): array {
        global $DB;

        return $DB->get_records(
            'oauth2_server_client_redirect_uris',
            ['clientidentifier' => $clientidentifier],
            'id ASC',
        );
    }

    /**
     * Add a redirect URI for a client.
     *
     * @param string $clientidentifier The client identifier.
     * @param string $uri The redirect URI.
     * @throws \moodle_exception If the URI is not valid.
     */
    public static function add_redirect_uri(string $clientidentifier, string $uri): void {
        global $DB;

        $error = self::validate_redirect_uri($uri);
        if ($error !== null) {
            throw new \moodle_exception('error', 'moodle', '', $error);
        }

        $DB->insert_record('oauth2_server_client_redirect_uris', (object) [
            'clientidentifier' => $clientidentifier,
            'uri' => $uri,
        ]);
    }

    /**
     * Remove a redirect URI.
     *
     * @param int $uriid The redirect URI record ID.
     */
    public static function remove_redirect_uri(int $uriid): void {
        global $DB;

        $DB->delete_records('oauth2_server_client_redirect_uris', ['id' => $uriid]);
    }

    /**
     * Validate a redirect URI.
     *
     * Rules:
     * - Must be a valid URL.
     * - If the host is localhost or 127.0.0.1, HTTP is allowed.
     * - Otherwise, HTTPS is required.
     *
     * @param string $uri The redirect URI to validate.
     * @return string|null A translated error message, or null if valid.
     */
    public static function validate_redirect_uri(string $uri): ?string {
        $parsed = parse_url($uri);

        if ($parsed === false || empty($parsed['scheme']) || empty($parsed['host'])) {
            return get_string('oauth2server:redirecturiinvalid', 'moodle');
        }

        $host = strtolower($parsed['host']);
        $scheme = strtolower($parsed['scheme']);

        $islocal = ($host === 'localhost' || $host === '127.0.0.1');

        if (!$islocal && $scheme !== 'https') {
            return get_string('oauth2server:redirecturihttpsrequired', 'moodle');
        }

        if ($islocal && $scheme !== 'http' && $scheme !== 'https') {
            return get_string('oauth2server:redirecturiinvalid', 'moodle');
        }

        return null;
    }
}
