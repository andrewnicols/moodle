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

namespace core\router\response;

/**
 * A standard response for a request which was well-formed but could not be processed due to
 * semantic errors (e.g. reuse of an Idempotency-Key with a different request payload).
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class unprocessable_entity_response extends exception_response {
    #[\Override]
    public static function get_exception_status_code(): int {
        return 422;
    }

    #[\Override]
    protected static function get_response_description(): string {
        return 'Unprocessable Entity';
    }
}
