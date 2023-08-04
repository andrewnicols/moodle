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

namespace core\router;

use core\openapi\specification;
use Slim\Routing\Route as RoutingRoute;
use stdClass;

/**
 * Routing parameter for validation.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class path_parameter extends parameter {
    public function __construct(
        ...$args,
    ) {
        $args['in'] = 'path';
        parent::__construct(...$args);
    }

    public function validate(
        RoutingRoute $route,
    ): void {
        validate_param(
            param: $route->getArgument($this->name),
            type: $this->type,

            // The fact that this route was matched means that the parameter is optional.
            // Do not fail validation on empty values.
            allownull: NULL_ALLOWED,
        );
    }

    public function get_openapi_description(
        specification $api,
        string $component,
        array $parentcontexts = [],
    ): stdClass {
        $data = parent::get_openapi_description(
            api: $api,
            component: $component,
            parentcontexts: $parentcontexts,
        );

        // Fetch the route, and determine if this is an optional parameter.
        // We can determine if this is optional if there is any `[` character before it in the path.
        // There can be no required parameter after any optional parameter.
        $routes = array_filter($parentcontexts, fn($context) => $context instanceof route);
        $path = $routes[0]->get_path(array_slice($routes, 1));
        $paramposition = strpos($path, '{' . $this->name . '}');
        $data->required = !str_contains(substr($path, 0, $paramposition), '[');

        return $data;
    }
}
