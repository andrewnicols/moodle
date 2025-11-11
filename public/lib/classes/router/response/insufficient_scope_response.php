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
 * A response to be used when insufficient scopes are present in the authentication token for a resource.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class insufficient_scope_response extends exception_response {
    #[\Override]
    public static function get_exception_status_code(): int {
        return 403;
    }

    #[\Override]
    protected static function get_response_description(): string {
        return 'Insufficient scope for this resource.';
    }

    #[\Override])]
    protected static function get_payload_data(
        \Exception $exception,
        ...$extra,
    ): array {
        return [];
    }
}
