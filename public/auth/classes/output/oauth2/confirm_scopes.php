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

use core\router\scope\abstract_scope;
use core\url;

/**
 * Confirm the scopes used as part of the OAuth2 workflow.
 *
 * @package    core_auth
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class confirm_scopes implements
    \core\output\named_templatable,
    \core\output\renderable,
    \core\output\templatable
{
    use \core_auth\output\login_renderable_trait;

    /**
     * Create a new confirm scopes renderable.
     *
     * @param array<abstract_scope> $grantedscopes The already granted scopes.
     * @param array<abstract_scope> $requestedscopes The newly requested scopes.
     * @param url $actionurl The form action URL.
     */
    public function __construct(
        /** @var array<abstract_scope> The already granted scopes. */
        protected array $grantedscopes,
        /** @var array<abstract_scope> The newly requested scopes. */
        protected array $requestedscopes,
        /** @var url The form action URL. */
        protected url $actionurl,
    ) {
    }

    #[\Override]
    public function export_for_template(\core\output\renderer_base $output): object {
        $formatscopedata = fn (abstract_scope $scope) => [
            'description' => $scope->get_description(),
            'identifier' => $scope->getIdentifier(),
        ];

        $data = (object) [
            'logourl' => $output->get_logo_url()->out(false),
            'maintenance' => $this->get_maintenance(),
            'error' => $this->get_error(),
            'info' => $this->get_info(),
            'actionurl' => $this->actionurl->out(false),
            'languagemenu' => $this->get_language_menu($output),
            'grantedscopes' => array_map($formatscopedata, $this->grantedscopes),
            'requestedscopes' => array_map($formatscopedata, $this->requestedscopes),
        ];

        return $data;
    }

    #[\Override]
    public function get_template_name(\core\output\renderer_base $renderer): string {
        return 'core/oauth2/confirm_scopes';
    }
}
