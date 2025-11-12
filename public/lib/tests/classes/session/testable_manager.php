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

namespace core\tests\session;

/**
 * A Testable session manager.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

class testable_manager extends \core\session\manager {
    /** @var bool */
    protected static ?bool $iscli = null;

    #[\Override]
    protected static function is_cli_script(): bool {
        if (is_null(static::$iscli)) {
            return parent::is_cli_script();
        }
        return static::$iscli;
    }

    /**
     * Set whether we are emulating a CLI script.
     *
     * @param bool $iscli
     * @return void
     */
    public static function set_cli_script(bool $iscli): void {
        static::$iscli = $iscli;
    }
}
