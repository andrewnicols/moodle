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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

namespace core;

use DateTimeZone;
use stdClass;

/**
 * An injectable accessor for the current user.
 *
 * The global $USER may be replaced at any time (for example when logging in, or in unit tests), so this does not
 * retain the user. It reads the global on every call, so it is safe to inject and retain.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class current_user {
    /**
     * Get the current user object.
     *
     * @return stdClass
     */
    public function get_user_object(): stdClass {
        global $USER;

        return $USER;
    }

    /**
     * Get the id of the current user.
     *
     * @return int 0 if nobody is logged in
     */
    public function get_id(): int {
        return (int) ($this->get_user_object()->id ?? 0);
    }

    /**
     * Check whether the current user has a capability.
     *
     * @param string $capability
     * @param \core\context $context
     * @param bool $doanything Whether the 'doanything' (site admin) override applies
     * @return bool
     */
    public function has_capability(string $capability, context $context, bool $doanything = true): bool {
        return has_capability($capability, $context, $this->get_user_object(), $doanything);
    }

    /**
     * Require that the current user has a capability.
     *
     * @param string $capability
     * @param \core\context $context
     * @param bool $doanything Whether the 'doanything' (site admin) override applies
     * @param string $errormessage The error string to use if the capability is missing
     * @param string $stringfile The file which contains the error string
     * @throws \required_capability_exception
     */
    public function require_capability(
        string $capability,
        context $context,
        bool $doanything = true,
        string $errormessage = 'nopermissions',
        string $stringfile = '',
    ): void {
        require_capability(
            $capability,
            $context,
            $this->get_id(),
            $doanything,
            $errormessage,
            $stringfile,
        );
    }

    /**
     * Get the timezone of the current user.
     *
     * @return DateTimeZone
     */
    public function get_timezone_object(): DateTimeZone {
        return \core_date::get_user_timezone_object($this->get_user_object());
    }
}
