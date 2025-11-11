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

use League\OAuth2\Server\Entities\UserEntityInterface;

/**
 * Class user_repository
 *
 * @package    core
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class user_repository implements \League\OAuth2\Server\Repositories\UserRepositoryInterface {
    #[\Override]
    public function getUserEntityByUserCredentials(
        string $username,
        string $password,
        string $granttype,
        \League\OAuth2\Server\Entities\ClientEntityInterface $cliententity
    ): ?UserEntityInterface {
        $user = authenticate_user_login($username, $password);
        if (!$user) {
            return null;
        }

        // Note: Do not call complete_user_login() here, as this will create a session login.
        // TODO: Logging.
        $userentity = new user_entity();
        $userentity->setIdentifier($user->id);

        return $userentity;
    }
}
