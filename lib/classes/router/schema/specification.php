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

use coding_exception;
use core\router\route;
use core\openapi\schema;
use core\router\request_body;
use core\router\response;
use core\router\response\example;
use core\router\schema\parameter;
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
            'openapi' => '3.1.0',
            'info' => (object) [
                'title' => 'Moodle LMS',
                'description' => 'REST API for Moodle LMS',
                'summary' => 'Moodle LMS REST API',
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
                // Note: This list must be kept in-sync with add_component.
                'schemas' => (object) [],
                'responses' => (object) [],
                'parameters' => (object) [],
                'examples' => (object) [],
                'requestBodies' => (object) [],
                'headers' => (object) [],

                // The add_component method does not support securitySchemes because we hard-code these.
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
     * Add a component to the components object.
     *
     * https://spec.openapis.org/oas/v3.1.0#components-object
     *
     * Note: The following component types are supported:
     *
     * - schemas
     * - responses
     * - parameters
     * - examples
     * - requestBodies
     * - headers
     *
     * At this time, other component types are not supported.
     *
     * @param openapi_base $object
     * @return specification
     * @throws coding_exception If the component type is unknown.
     */
    public function add_component(openapi_base $object): self {
        if (is_a($object, header_object::class)) {
            // Note: Headers are a form of Parameter, but are shown in a different section of the specification.
            // This check must be before the parameter check.
            $this->add_header($object);

            return $this;
        }

        if (is_a($object, parameter::class)) {
            $this->add_parameter($object);

            return $this;
        }

        if (is_a($object, response::class)) {
            $this->add_response($object);

            return $this;
        }

        if (is_a($object, example::class)) {
            $this->add_example($object);

            return $this;
        }

        if (is_a($object, request_body::class)) {
            $this->add_request_body($object);

            return $this;
        }

        if (is_a($object, schema::class)) {
            $this->add_schema($object);

            return $this;
        }

        throw new \coding_exception('Unknown object type.');
    }

    /**
     * Add a server to the specification.
     *
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
            $pathdocs = $route->get_openapi_schema(
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
        schema $schema,
    ): self {
        $name = $schema->get_reference(qualify: false);
        $this->data->components->schemas->$name = $schema->get_schema();

        return $this;
    }

    /**
     * Add a schema to the shared components section of the specification.
     *
     * @param schema $schema
     * @return specification
     */
    public function add_parameter(
        parameter $parameter,
    ): self {
        $name = $parameter->get_reference(qualify: false);
        $this->data->components->parameters->$name = $parameter->get_openapi_description($this);

        return $this;
    }

    /**
     * Add a header to the shared components section of the specification.
     *
     * @param header_object $response
     * @return specification
     */
    public function add_header(
        header_object $header,
    ): self {
        $name = $header->get_reference(qualify: false);
        $this->data->components->headers->$name = $header->get_openapi_description($this);

        return $this;
    }

    /**
     * Add a response to the shared components section of the specification.
     *
     * @param response $response
     * @return specification
     */
    public function add_response(
        response $response,
    ): self {
        $name = $response->get_reference(qualify: false);
        $this->data->components->responses->$name = $response->get_openapi_description($this);

        return $this;
    }

    /**
     * Add an example to the shared components section of the specification.
     *
     * @param example $example
     * @return specification
     */
    public function add_example(
        example $example,
    ): self {
        $name = $example->get_reference(qualify: false);
        $this->data->components->examples->$name = $example->get_openapi_description($this);

        return $this;
    }

    /**
     * Add a request body to the shared components section of the specification.
     *
     * @param request_body $body
     * @return specification
     */
    public function add_request_body(
        request_body $body,
    ): self {
        $name = $body->get_reference(qualify: false);
        $this->data->components->requestBodies->$name = $body->get_openapi_description($this);

        return $this;
    }

    /**
     * Check whether a reference is defined
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

        // Remove the leading #/components/ part.
        $ref = substr($ref, strlen('#/components/'));

        // Split the path and name.
        [$path, $name] = explode('/', $ref, 2);

        return property_exists($this->data->components->$path, $name);
    }
}
