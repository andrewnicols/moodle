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

namespace core_auth\output\oauth2;

/**
 * Abstract class containing shared functionality for OAuth2 pages.
 *
 * @package    core_auth
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class oauth2_page implements
    \core\output\react_component_renderable,
    \core\output\renderable
{
    /** @var \League\OAuth2\Server\Entities\ClientEntityInterface The client entity */
    protected \League\OAuth2\Server\Entities\ClientEntityInterface $client;

    /**
     * Get the user information for the currently logged in user.
     *
     * @return object
     */
    protected function get_user_info(\core\output\core_renderer $renderer): \stdClass {
        return (object) [
            'username' => $this->user->username,
            'fullName' => \core_user::get_fullname($this->user),
            'email' => $this->user->email,
            'userPictureHtml' => $renderer->user_picture($this->user, [
                'includefullname' => true,
                'class' => 'userpicture',
            ]),
            'profileUrl' => \core\user::get_profile_url($this->user)->out(false),
        ];
    }

    /**
     * Get the OAuth2 client information for display.
     *
     * @return object
     */
    protected function get_client_info(): \stdClass {
        return (object) [
            'clientName' => $this->client->getName(),
            'clientDescription' => format_text($this->client->get_description(), FORMAT_MOODLE),
            'clientIdentifier' => $this->client->getIdentifier(),
            'clientIsConfidential' => $this->client->isConfidential(),
        ];
    }
}
