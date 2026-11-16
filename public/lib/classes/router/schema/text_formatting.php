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

namespace core\router\schema;

use core\param;
use core\exception\coding_exception;
use core\router\parameters\query_apply_context_filters;
use core\router\route;
use core\router\schema\parameters\query_parameter;

/**
 * Common query parameters for API text representations.
 *
 * @package core
 * @copyright 2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class text_formatting {
    /**
     * Get the query parameters for text representation preferences.
     *
     * @return query_parameter[]
     */
    public static function get_query_parameters(): array {
        return [
            'textMode' => new query_parameter(
                name: 'textMode',
                type: param::ALPHA,
                description: 'Representation for supported text fields: formatted (the default) or raw. '
                    . 'Raw text is not safe to render as HTML and may contain @@PLUGINFILE@@ references.',
            ),
            'applyContextFilters' => new query_apply_context_filters(),
        ];
    }

    /**
     * Combine route and common API query parameters, rejecting reserved names.
     *
     * @param route $route
     * @return query_parameter[]
     */
    public static function get_api_query_parameters(route $route): array {
        $parameters = $route->get_query_parameters();
        $common = self::get_query_parameters();
        $conflicts = array_intersect_key($parameters, $common);
        if ($conflicts) {
            throw new coding_exception('Reserved API query parameters: ' . implode(', ', array_keys($conflicts)));
        }
        return array_merge($parameters, $common);
    }
}
