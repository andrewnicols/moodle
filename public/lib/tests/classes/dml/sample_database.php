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

namespace core\tests\dml;

/**
 * TODO describe file sample_database
 *
 * @package    core
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class sample_database extends \core\dml\driver\pgsql\native\database {
    /**
     * Register the fake library.
     * @return void
     */
    public static function register_fake_library(): void {
        if (!class_exists(\core\dml\driver\pgsql\fake\database::class, false)) {
            class_alias(sample_database::class, \core\dml\driver\pgsql\fake\database::class);
        }
    }
}
