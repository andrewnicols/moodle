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

namespace core\api;

use Psr\Http\Message\ServerRequestInterface;

/**
 * API Token Repository.
 *
 * This repository is responsible for managing API tokens.
 *
 * @package    core
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class api_token_repository {
    /**
     * Validate an API token.
     *
     * @param ServerRequestInterface $request
     * @param string $token
     * @throws \core\exception\require_login_exception
     * @return ServerRequestInterface
     */
    public static function validate_api_token(
        ServerRequestInterface $request,
        string $token,
    ): ServerRequestInterface {
        global $DB;

        // Tokens are a base64 encoded string of "tokenid/secret" prefixed with "mk_".
        // The secret is hashed in the database using `password_hash` so is not reversible.
        // The base64 encoding makes it URL safe and allows us to include the token ID and secret for verification.
        $tokendata = base64_decode(substr($token, 3), true);
        if (!$tokendata) {
            throw new \core\exception\require_login_exception('Invalid API Key');
        }

        [$tokenid, $secret] = explode('/', $tokendata, 2);

        if (!$tokenid || !$secret) {
            throw new \core\exception\require_login_exception('Invalid API Key');
        }

        $apikey = $DB->get_record('rest_api_tokens', ['id' => $tokenid]);

        if (!password_verify($secret, $apikey->token)) {
            $apikey = null;
        }

        // TODO: Throw appropriate exceptions here.
        if (!$apikey) {
            throw new \core\exception\require_login_exception('Invalid API Key');
        }

        if ($apikey->expiry && $apikey->expiry < time()) {
            throw new \core\exception\require_login_exception('API Key has expired');
        }

        if ($apikey->status != 1) {
            throw new \core\exception\require_login_exception('API Key has been revoked');
        }

        $request = $request->withAttribute('api_token_id', $apikey->id)
            ->withAttribute('oauth_scopes', $apikey->scopes);

        return $request;
    }

    /**
     * Create a new API token.
     *
     * @param int $userid The user ID the token is for.
     * @param string $name The name of the token.
     * @param string $scopes The scopes for the token.
     * @param int $expiry The expiry timestamp for the token.
     * @return string The generated token.
     */
    public static function create_token(
        int $userid,
        string $name,
        string $scopes,
        int $expiry,
    ): string {
        global $DB;

        // Generate a new secret.
        $secret = bin2hex(openssl_random_pseudo_bytes(32));

        $tokenid = $DB->insert_record('rest_api_tokens', [
            'userid' => (int) $userid,
            'token' => password_hash($secret, PASSWORD_DEFAULT),
            'expiry' => 0,
            'name' => $name,
            'status' => 1,
            'scopes' => $scopes,
            'timecreated' => time(),
            'lastaccessed' => 0,
            // 'iprestriction' => '',
        ]);

        $token = base64_encode(sprintf("%s/%s", $tokenid, $secret));

        // Remove the trailing '=' characters to make the token shorter.
        return rtrim($token, '=');
    }

    /**
     * Get all API tokens for a user.
     *
     * @param int $userid
     * @return array
     */
    public function get_user_tokens(int $userid): array {
        global $DB;

        return array_map(
            fn($record) => api_token_entity::from_record($record),
            $DB->get_records('rest_api_tokens', ['userid' => $userid])
        );
    }
}
