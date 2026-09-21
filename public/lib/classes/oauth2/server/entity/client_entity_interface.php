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

namespace core\oauth2\server\entity;

use League\OAuth2\Server\Entities\ClientEntityInterface;
use League\OAuth2\Server\Entities\ScopeEntityInterface;

// phpcs:disable moodle.NamingConventions.ValidFunctionName.LowercaseMethod

/**
 * Contract for OAuth2 server client entities.
 *
 * Extends the League client entity contract with the scope-approval behaviour that the internal
 * OAuth2 server's repositories rely on, so those repositories can depend on this interface rather
 * than the concrete {@see client_entity} class.
 *
 * @package    core
 * @copyright  2026 Mihail Geshoski <mihailgesoski@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
interface client_entity_interface extends ClientEntityInterface {
    /**
     * The list of scope identifiers allowed for use by this OAuth2 Client.
     *
     * @return string[]
     */
    public function get_scopes(): array;

    /**
     * Whether a scope requested by the user has been allowed for this client.
     *
     * @param ScopeEntityInterface|null $scope
     * @return bool
     */
    public function is_scope_approved(?ScopeEntityInterface $scope): bool;
}
