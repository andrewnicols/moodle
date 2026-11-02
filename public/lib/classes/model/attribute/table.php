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

namespace core\model\attribute;

use core\exception\coding_exception;

/**
 * Map a concrete model to a Moodle database table, without the configured prefix.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\Attribute(\Attribute::TARGET_CLASS)]
final class table {
    /**
     * Describe the mapped table.
     *
     * @param string $name Table name without the database prefix.
     */
    public function __construct(
        /** @var string Table name. */
        public readonly string $name,
    ) {
        if (!preg_match('/^[a-z][a-z0-9_]*$/D', $name)) {
            throw new coding_exception('A model table must be a non-empty Moodle table name without a prefix.');
        }
    }
}
