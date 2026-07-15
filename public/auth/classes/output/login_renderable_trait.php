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
    /** @var string The error message, if any. */
    private ?string $error = null;

    /** @var string The error title, shown as bold heading above the error message for credential failures. */
    private ?string $errortitle = null;

    /** @var string The info message, if any. */
    private ?string $info = null;

    /**
     * Set the error message. For the AUTH_LOGIN_FAILED case, also sets
     * an errortitle so the template can render a bold heading above the detail text.
     *
     * @param string $error The error message.
     * @param int $errorcode The error code from login/index.php.
     */
    public function set_error(string $error, int $errorcode = 0): void {
        if ($errorcode === AUTH_LOGIN_FAILED) {
            $this->errortitle = get_string('logininvalidlogintitle');
            $this->error = get_string('logininvalidlogindetail');
        } else {
            $this->error = $error;
        }
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
     * @param \core\output\core_renderer $output
     * @return \stdClass
     */
    public function export_for_template(\core\output\renderer_base $output): \stdClass {
        return (object) [
            'error' => $this->error,
            'errorformatted' => $output->error_text($this->error),
            'errortitle' => $this->errortitle,
            'info' => $this->info,
            'languagemenu' => $this->get_language_menu($output),
            'maintenance' => \format_text($this->get_maintenance_message(), FORMAT_MOODLE),
            'sitename' => $this->get_site_name(),
            'logourl' => $this->get_logo_url(),
        ];
    }

    /**
     * Get the language menu data for the template.
     *
     * @param \core\output\renderer_base $output
     * @return \stdClass|null
     */
    protected function get_language_menu(\core\output\renderer_base $output): ?\stdClass {
        global $PAGE;

        $languagedata = new \core\output\language_menu($PAGE);
        return $languagedata->export_for_action_menu($output);
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
}
