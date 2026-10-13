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

namespace core\exception;

use core\router\response\precondition_failed_response;

/**
 * An exception to describe the case where a conditional request header, such as If-Match, was not satisfied.
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class precondition_failed_exception extends moodle_exception implements response_aware_exception {
    /**
     * Constructor for a new precondition failed exception.
     */
    public function __construct() {
        parent::__construct(errorcode: 'preconditionfailed');
    }

    #[\Override]
    public function get_response_classname(): string {
        return precondition_failed_response::class;
    }
}
