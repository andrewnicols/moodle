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

namespace core_user\route\headers;

use core\router\schema\header_object;
use core\router\schema\referenced_object;

/**
 * An example of a header.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class example_header extends header_object implements referenced_object {
    public function __construct(
        ...$extra,
    ) {
        $extra['name'] = 'X-Total-Count';
        $extra['description'] = 'The total number of preferences';
        $extra['type'] = PARAM_INT;
        parent::__construct(...$extra);
    }
}
