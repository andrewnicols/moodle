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

namespace core\router\exception;

use League\OAuth2\Server\Exception\OAuthServerException;

/**
 * OAuth server exception class extension for Moodle.
 *
 * @package    core
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class oauth_server_exception extends OAuthServerException {
    /**
     * Create a new insufficient scope exception.
     *
     * @param string[] $requiredscopes The required scopes for the resource
     * @return static
     */
    public static function insufficient_scope(
        array $requiredscopes,
    ): self {
        // Defined in RFC7605 Section 6.2.3.
        return new static(
            'Insufficient scope',
            0,
            'insufficient_scope',
            403,
            implode(" ", $requiredscopes),
        );
    }

    #[\Override]
    public function getHttpHeaders(): array {
        $headers = parent::getHttpHeaders();

        // RFC6705 Section 3 describes the headers for OAuth errors.
        $error = $this->getErrorType();
        $description = $this->getMessage();
        $headerdata = [
            "realm='Moodle API'",
            "error='{$error}'",
            "error_description='{$description}'",
        ];

        if ($this->getErrorType() === 'insufficient_scope') {
            $headerdata[] = "scope='" . $this->getHint() . "'";
        }

        $headers['WWW-Authenticate'] = "Bearer " . implode(", ", $headerdata);

        return $headers;
    }
}
