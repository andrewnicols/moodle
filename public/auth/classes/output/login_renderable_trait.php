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
 * Trait with shared functionality for login renderables.
 *
 * @package    core_auth
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
trait login_renderable_trait {
    /** @var ?string The error message, if any. */
    protected ?string $error = null;

    /** @var string The error title, shown as bold heading above the error message for credential failures. */
    protected ?string $errortitle = null;

    /** @var ?string The info message, if any. */
    protected ?string $info = null;

    /** @var ?string Maintenance message, if Maintenance is enabled. */
    protected ?string $maintenance = null;

    /**
     * Get the error message.
     *
     * @return string|null
     */
    public function get_error(): ?string {
        return $this->error;
    }

    /**
     * Get the error title.
     *
     * @return string|null
     */
    public function get_error_title(): ?string {
        return $this->errortitle ?? null;
    }

    /**
     * Get the info message.
     *
     * @return string|null
     */
    public function get_info(): ?string {
        return $this->info;
    }

    /**
     * Get the language menu.
     *
     * @param \core\output\renderer_base $output The renderer to use.
     * @return null|\stdClass The language menu data.
     */
    public function get_language_menu(\core\output\renderer_base $output): ?\stdClass {
        global $PAGE;

        return (new \core\output\language_menu($PAGE))->export_for_action_menu($output);
    }

    /**
     * Get the maintenance message.
     *
     * @return string|null
     */
    public function get_maintenance(): ?string {
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
     * Set the maintenance message.
     *
     * @param string|null $maintenance The maintenance message.
     */
    public function set_maintenance(?string $maintenance): void {
        $this->maintenance = $maintenance;
    }
}
