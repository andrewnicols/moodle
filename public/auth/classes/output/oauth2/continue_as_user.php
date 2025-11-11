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

use core\url;

/**
 * Continue the OAuth2 Workflow as the currently logged-in user.
 *
 * @package    core_auth
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class continue_as_user implements
    \core\output\named_templatable,
    \core\output\renderable,
    \core\output\templatable
{
    use \core_auth\output\login_renderable_trait;

    /**
     * Create a renderable to allow the current user to continue in the oauth2 workflow.
     *
     * @param url $actionurl The form action URL.
     */
    public function __construct(
        /** @var url The form action URL. */
        protected url $actionurl,
    ) {
    }

    #[\Override]
    public function export_for_template(\core\output\renderer_base $output) {
        global $USER;

        $data = (object) [
            'maintenance' => $this->get_maintenance(),
            'logourl' => $output->get_logo_url()->out(false),
            'error' => $this->get_error(),
            'info' => $this->get_info(),
            'actionurl' => $this->actionurl->out(false),
            'languagemenu' => $this->get_language_menu($output),
            'userinfo' => (object) [
                'username' => $USER->username,
                'fullname' => fullname($USER),
                'email' => $USER->email,
            ],
        ];

        return $data;
    }

    #[\Override]
    public function get_template_name(\core\output\renderer_base $renderer): string {
        return 'core/oauth2/continue_as_user';
    }
}
