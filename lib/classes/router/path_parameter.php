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
        string $path,
        array $parentcontexts = [],
    ): ?stdClass {
        if (!str_contains($path, "{{$this->name}}")) {
            // In OpenAPI, Path parameters can never be optional.
            return null;
        }
        $data = parent::get_openapi_description(
            api: $api,
            component: $component,
            path: $path,
            parentcontexts: $parentcontexts,
        );
        $data->required = true;

        return $data;
    }

    public function is_required(route $route): bool {
        $path = $route->get_path();
        $paramposition = strpos($path, '{' . $this->name . '}');
        return !str_contains(substr($path, 0, $paramposition), '[');
    }
}
