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
 * Renderable for the Continue as existing user page.
 *
 * @package    core_auth
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class continue_as_user_page extends oauth2_page {
    use \core_auth\output\login_renderable_trait {
        get_react_component_props as shared_get_react_component_props;
    }

    /**
     * Create an instance of the form page.
     *
     * @param \League\OAuth2\Server\Entities\ClientEntityInterface $client The client entity
     * @param \core\url $action
     * @param \core\url $logoutaction
     * @param \stdClass $user The user entity
     */
    public function __construct(
        \League\OAuth2\Server\Entities\ClientEntityInterface $client,
        \core\url $action,
        /** @var \core\url The logout url */
        private \core\url $logoutaction,
        /** @var \stdClass The user entity */
        protected \stdClass $user,
    ) {
        $this->client = $client;
        $this->set_action_url($action);
    }

    #[\Override]
    public function get_react_component_name(): string {
        return 'core_auth/ContinueAsUserPage';
    }

    #[\Override]
    public function get_react_component_props(
        \core\output\renderer_base $renderer,
    ): \stdClass {
        $data = $this->shared_get_react_component_props($renderer);
        $data->logoutUrl = $this->logoutaction->out(false);

        $userinfo = $this->get_user_info($renderer);
        $data->userPictureHtml = $userinfo->userPictureHtml;
        $data->userFullName = $userinfo->fullName;

        $clientinfo = $this->get_client_info();
        $data->clientName = $clientinfo->clientName;

        $data->sesskey = sesskey();

        return $data;
    }
}
