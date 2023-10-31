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

namespace core\openapi;

use core\router\route;
use core\openapi\schema;
use core\router\parameter;
use stdClass;

/**
 * Moodle OpenApi Specification class.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class specification implements
    \JsonSerializable
{
    protected stdClass $data;

    /**
     * Constructor to configure base information.
     */
    public function __construct() {
        $this->data = (object) [
            'openapi' => '3.0.0',
            'info' => (object) [
                'title' => 'Moodle LMS',
                'description' => 'Moodle LMS',
                'license' => (object) [
                    'name' => 'GNU GPL v3 or later',
                    'url' => 'https://www.gnu.org/licenses/gpl-3.0.html',
                ],
            ],

            // Servers are added during output.
            'servers' => [],

            // Paths are added after initialisation.
            'paths' => (object) [],

            'components' => (object) [
                'schemas' => (object) [],
                'responses' => (object) [],
                'parameters' => (object) [],
                'securitySchemes' => (object) [
                    'api_key' => (object) [
                        'type' => 'apiKey',
                        'name' => 'api_key',
                        'in' => 'header',
                    ],
                    'cookie' => (object) [
                        'type' => 'apiKey',
                        'name' => 'MoodleSession',
                        'in' => 'cookie',
                    ],
                    // TODO: Add support for OAuth2.
                ],
            ],
            // TODO: Add support for OAuth2.
            'security' => [
                (object) [
                    'api_key' => [],
                    'cookie' => [],
                ],
            ],
            'externalDocs' => (object) [
                'description' => 'Moodle Developer Docs',
                'url' => 'https://moodledev.io',
            ],
        ];
    }

    /**
     * Implement the json serialisation interface.
     *
     * @return mixed
     */
    public function jsonSerialize(): mixed {
        global $CFG;

        // Add the Moodle site version here.
        $this->data->info->version = $CFG->version;

        // Add the server configuration.
        $serverdescription = str_replace("'", "\'", format_string(get_site()->fullname));
        $this->add_server(
            "{$CFG->wwwroot}/api/rest/v2",
            $serverdescription,
        );

        return $this->data;
    }

    /**
     * Add a server to the specification.
     * @param string $url The URL of the API base
     * @param string $description
     * @return specification
     */
    public function add_server(
        string $url,
        string $description,
    ): self {
        $this->data->servers[] = (object) [
            'url' => $url,
            'description' => $description,
        ];

        return $this;
    }

    /**
     * Add an API Path.
     *
     * @param string $component The Moodle component
     * @param array $parentcontexts The parent contexts that this path relates to (if any)
     * @param route $route The route which handles this request
     * @param null|ReflectionClass $classinfo
     * @param null|ReflectionMethod $methodinfo
     * @return specification
     */
    public function add_path(
        string $component,
        array $parentcontexts,
        route $route,
    ): self {
        // Compile the final path, complete with component prefix.
        $path = "/{$component}" . $route->get_path();

        // Helper to add the path to the specification.
        $addpath = function(string $path) use ($route, $component, $parentcontexts) {
            // Remove the optional parameters delimeters from the path.
            $path = str_replace(
                ['[', ']'],
                '',
                $path,
            );

            // Get the OpenAPI description for this path with the updated path.
            $pathdocs = $route->get_openapi_description(
                api: $this,
                component: $component,
                path: $path,
                parentcontexts: $parentcontexts,
            );

            if (!property_exists($this->data->paths, $path)) {
                $this->data->paths->$path = (object) [];
            }

            foreach ((array) $pathdocs as $method => $methoddata) {
                // Copy each of the pathdocs into place.
                $this->data->paths->{$path}->{$method} = $methoddata;
            }
        };

        $addpath($path);

        // Check for any optional parameters.
        // OpenAPI does not support optional parameters so we have to duplicate routes instead.
        // We can determine if this is optional if there is any `[` character before it in the path.
        // There can be no required parameter after any optional parameter.
        $optionalparameters = array_filter(
            array: $route->get_path_parameters(),
            callback: fn ($parameter) => !$parameter->is_required($route),
        );

        if (!empty($optionalparameters)) {
            // Go through the path from end to start removing optional parameres and adding them to the path list.
            while (strrpos($path, '[') !== false) {
                $path = substr($path, 0, strrpos($path, '['));
                $addpath($path);
            }
        }

        return $this;
    }

    // TODO. Is this used?
    public function add_schema(
        string $name,
        schema $schema,
    ): self {
        $this->data->components->schemas->$name = $schema->get_schema();

        return $this;
    }

    public function add_parameter(
        string $name,
        parameter $parameter,
    ): self {
        if ($schema = $parameter->get_schema()) {
            $this->data->components->parameters->$name = $schema;
        }

        return $this;
    }

    // TODO. Is this used?
    public function get_schema_path_for_class(schema $schema): string {
        $schema = (object) $schema;
        $schema = $this->get_schema_for_class($schema);

        return "#/components/schemas/{$schema->name}";
    }

    /**
     * Check whether a reference is defined
     *
     * TODO: Check if we need this or not.
     *
     * @param string $ref
     * @return bool
     */
    public function is_reference_defined(
        string $ref,
    ): bool {
        if (!str_starts_with($ref, '#/components/')) {
            return false;
        }

        if (str_starts_with($ref, '#/components/schema')) {
            $schemaref = substr(
                $ref,
                0,
                strlen('#/components/schema'),
            );

            return property_exists($this->data->components->schemas, $schemaref);
        }

        return false;
    }
}
