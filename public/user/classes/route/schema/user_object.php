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

namespace core_user\route\schema;

use core\router\schema\objects\representation_schema;

/**
 * The schema of the key information about a user.
 *
 * @package    core_user
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class user_object extends representation_schema {
    /**
     * Constructor.
     *
     * @param mixed[] ...$extra
     */
    public function __construct(...$extra) {
        parent::__construct(\core_user\local\user_object::class, ...$extra);
    }
}
