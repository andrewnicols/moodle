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

namespace core_auth\output;

/**
 * Trait to share login renderable properties between the standard login renderable and the SSO login renderable.
 *
 * @package    core_auth
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
trait login_renderable_trait {
    /** @var \core\url The URL to use in any form action */
    private \core\url $actionurl;

    /** @var string|null The error message, if any. */
    private ?string $error = null;

    /** @var string|null The raw error message, if any. */
    private ?string $rawerror = null;
    /** @var int|null The error code, if any */
    private ?int $errorcode = null;

    /** @var string|null The error title, shown as bold heading above the error message for credential failures. */
    private ?string $errortitle = null;

    /** @var string|null The info message, if any. */
    private ?string $info = null;

    /**
     * The Action URL for form submission.
     *
     * @param \core\url $actionurl
     */
    public function set_action_url(\core\url $actionurl): void {
        $this->actionurl = $actionurl;
    }

    /**
     * Set the error message. For the AUTH_LOGIN_FAILED case, also sets
     * an errortitle so the template can render a bold heading above the detail text.
     *
     * @param string $error The error message.
     * @param int $errorcode The error code from login/index.php.
     */
    public function set_error(string $error, int $errorcode = 0): void {
        $this->rawerror = $error;
        $this->errorcode = $errorcode;
        if ($errorcode === AUTH_LOGIN_FAILED) {
            $this->set_error_title(get_string('logininvalidlogintitle'));
            $this->error = get_string('logininvalidlogindetail');
        } else {
            $this->error = $error;
        }
    }

    /**
     * Set the error title.
     *
     * @param string $errortitle The error title.
     */
    public function set_error_title(string $errortitle): void {
        $this->errortitle = $errortitle;
    }

    /**
     * Set the info message.
     *
     * @param string $info The info message.
     */
    public function set_info(string $info): void {
        $this->info = $info;
    }

    /**
     * Export data for the template
     *
     * @param \core\output\renderer_base $output
     * @return \stdClass
     */
    public function get_react_component_props(\core\output\renderer_base $output): \stdClass {
        $data = (object) [
            'actionUrl' => $this->actionurl->out(false),
            'error' => $this->error,
            'errorTitle' => $this->errortitle,
            'info' => $this->info,
            'languageMenuHtml' => $this->get_language_menu($output),
            'maintenance' => \format_text($this->get_maintenance_message(), FORMAT_MOODLE),
            'siteName' => $this->get_site_name(),
            'logoUrl' => $this->get_logo_url(),
        ];

        $this->add_auth_instructions($data);
        return $data;
    }

    /**
     * Get the language menu data for the template.
     *
     * @param \core\output\renderer_base $output
     * @return string|null
     */
    protected function get_language_menu(\core\output\renderer_base $output): ?string {
        global $PAGE;

        $languagedata = new \core\output\language_menu($PAGE);
        return $output->render_from_template(
            'core/action_menu',
            $languagedata->export_for_action_menu($output),
        );
    }

    /**
     * Get the site name, formatted for display.
     *
     * @return string The formatted site name.
     */
    protected function get_site_name(): string {
        global $SITE;

        $formatter = \core\di::get(\core\formatting::class);

        return $formatter->format_string(
            string: $SITE->fullname,
            context: \core\context\course::instance(SITEID),
            escape: false,
        );
    }

    /**
     * Get the logo URL, if any.
     *
     * @return string|null The logo URL, or null if no logo is set.
     */
    protected function get_logo_url(): ?string {
        global $PAGE;

        $logourl = $PAGE->get_renderer('core')->get_logo_url();
        if ($logourl) {
            return $logourl->out(false);
        }

        return null;
    }

    /**
     * Get the maintenance message, if any.
     *
     * @return null|string The maintenance message, or null if maintenance mode is not enabled.
     */
    protected function get_maintenance_message(): ?string {
        global $CFG;

        if ($CFG->maintenance_enabled == true) {
            if (!empty($CFG->maintenance_message)) {
                return $CFG->maintenance_message;
            } else {
                return get_string('sitemaintenance', 'admin');
            }
        }

        return null;
    }

    /**
     * Get the instructions for the left-hand side of the layout.
     *
     * @param \stdClass $data The data object to populate with instructions.
     */
    protected function add_auth_instructions(\stdClass $data): void {
        global $CFG;

        $data->authInstructions = null;

        // Left-panel instructions. Only set when the admin has defined custom instructions;
        // the template falls back to the default welcome content when this is empty/null.
        if (empty($CFG->auth_instructions)) {
            return;
        }

        $data->authInstructions = format_text(
            $CFG->auth_instructions,
            FORMAT_MOODLE,
            [
                'context' => \core\context\system::instance(),
            ],
        );
    }
}
