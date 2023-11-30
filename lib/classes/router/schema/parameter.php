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
use core\param;
use core\router\route;
use core\router\schema\openapi_base;
use core\router\schema\specification;
use core\router\schema\objects\type_base;
use stdClass;

/**
 * OpenAPI parameter.
 *
 * https://spec.openapis.org/oas/v3.1.0#parameter-object
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class parameter extends openapi_base {
    // This is a Moodle PARAM_ and informs a schema.
    /**
     * Constructor for a Parameter Object.
     *
     * @param string $name The name of the parameter. Parameter names are case sensitive.
     * - If in is "path", the name field MUST correspond to a template expression occurring within the
     *   path field in the Paths Object.
     *   See Path Templating for further information.
     * - If in is "header" and the name field is "Accept", "Content-Type" or "Authorization",
     *   the parameter definition SHALL be ignored.
     * - For all other cases, the name corresponds to the parameter name used by the in property.
     * @param string $in The location of the parameter. Possible values are "query", "header", "path" or "cookie".
     * @param null|param $type A Moodle parameter type, which can be used instead of a schema.
     * @param null|type_base $schema
     * @param null|string $description
     * @param null|bool $required
     * @param null|bool $deprecated Specifies that a parameter is deprecated and SHOULD be transitioned out of usage.
     * @param null|string $example
     * @param array $examples
     * @param array $extra
     */
    public function __construct(
        // Fixed fields.
        protected string $name,
        protected string $in,
        protected ?string $description = null,
        protected ?bool $required = null,
        protected ?bool $deprecated = false,

        // Moodle-specific fields.
        protected ?param $type = null,
        protected mixed $default = null,

        // Schema fields.
        protected ?type_base $schema = null,
        protected ?example $example = null,
        protected array $examples = [],

        ...$extra,
    ) {
        if ($example) {
            if (count($examples)) {
                throw new coding_exception('Only one of example or examples can be specified.');
            }
            $this->examples[$example->get_name()] = $example;
        }

        assert(
            ($required === true && $default === null)
                ||
            ($required == null || $required == false),
            'A parameter cannot be required and have a default value.',
        );
    }

    public function get_openapi_description(
        specification $api,
        ?string $path = null,
    ): ?\stdClass {
        $data = (object) [
            // The `name`, and `in` values are required.
            'name' => $this->name,
            'in' => $this->in,
        ];

        if ($this->description !== null) {
            $data->description = $this->description;
        }

        // Allow another schema to be passed.
        if ($this->schema !== null) {
            $data->schema = $this->schema->get_openapi_schema($api, $path);
        } else {
            $data->schema = $this->get_schema_from_type($this->type);
        }

        if (count($this->examples) > 0) {
            $data->examples = [];
            foreach ($this->examples as $example) {
                $data->examples[$example->get_name()] = $example->get_openapi_schema(
                    api: $api,
                );
            }
        }

        return $data;
    }

    /**
     * Get the OpenAPI 'in' property.
     *
     * @return string
     */
    public function get_in(): string {
        return $this->in;
    }

    /**
     * Fetch the underlying param.
     *
     * @return param
     */
    public function get_type(): param {
        return $this->type;
    }

    public function is_required(route $route): bool {
        return $this->required ?? false;
    }

    public function get_name(): string {
        return $this->name;
    }
}
