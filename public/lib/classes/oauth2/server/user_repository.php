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
 * An OAuth2 user repository.
 *
 * This repository is used to retrieve user entities during the OAuth2 flow.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
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

        // TODO: Check that the user is allowed to use this client/grant type.
        // TODO: Check if there are any features of `complete_user_login()` that we need to replicate here (or move into shared functionality).

        // Note: Do not call complete_user_login() here, as this will create a session login.
        // TODO: Logging.
        $userentity = new user_entity();
        $userentity->setIdentifier($user->id);

        return $userentity;
    }

    /**
     * Get user entity from a user record.
     *
     * @param \stdClass $user
     * @return user_entity|null
     */
    public function get_user_from_user_record(\stdClass $user): ?UserEntityInterface {
        if (!$user) {
            return null;
        }

        $userentity = new user_entity();
        $userentity->setIdentifier($user->id);

        return $userentity;
    }

    /**
     * Get the current logged-in user as a user entity.
     *
     * @return user_entity
     */
    public static function get_current_user(): user_entity {
        global $USER;

        $userentity = new user_entity();
        $userentity->setIdentifier($USER->id);

        return $userentity;
    }
}
