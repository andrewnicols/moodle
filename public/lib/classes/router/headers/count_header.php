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

namespace core\router\headers;

use core\router\schema\example;

/**
 * Class count_header
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class count_header extends \core\router\schema\parameters\header_object {
    public function __construct(...$data) {
        $data['name'] = 'X-Total-Count';
        $data['type'] = \core\param::INT;
        $data['examples'] = [
            new example(
                name: 'A total count header',
                value: 42,
            ),
        ];

        parent::__construct(...$data);
    }
}
