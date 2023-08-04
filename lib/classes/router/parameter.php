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

use core\openapi\openapi_base;
use core\openapi\referenced_parameter;
use core\openapi\specification;
use core\openapi\schema;
use stdClass;

/**
 * OpenAPI parameter.
 *
 * https://swagger.io/specification/#parameter-object
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
     * - If in is "path", the name field MUST correspond to a template expression occurring within the path field in the Paths Object. See Path Templating for further information.
     * - If in is "header" and the name field is "Accept", "Content-Type" or "Authorization", the parameter definition SHALL be ignored.
     * - For all other cases, the name corresponds to the parameter name used by the in property.
     * @param string $in The location of the parameter. Possible values are "query", "header", "path" or "cookie".
     * @param null|string $type A Moodle PARAM_ type, which can be used instead of a schema.
     * @param null|schema $schema
     * @param null|string $description 
     * @param null|bool $required 
     * @param null|bool $deprecated Specifies that a parameter is deprecated and SHOULD be transitioned out of usage.
     * @param null|bool $allowemptyvalue Sets the ability to pass empty-valued parameters. This is valid only for query parameters and allows sending a parameter with an empty value.
     * @param null|string $example 
     * @param array $examples 
     * @param mixed $extra 
     */
    public function __construct(
        // Fixed fields.
        protected string $name,
        protected string $in,
        protected ?string $type = null,
        protected ?schema $schema = null,
        protected ?string $description = null,
        protected ?bool $required = null,
        protected ?bool $deprecated = false,
        protected ?bool $allowemptyvalue = false,

        // Schema fields.
        protected ?string $example = null,
        protected array $examples = [],

        // TODO All of the rest.

        ...$extra,
    ) {
        assert(
            $example === null || count($examples) === 0,
            'Only one of example or examples can be specified.',
        );
    }

    public function get_openapi_description(
        specification $api,
        string $component,
        array $parentcontexts = [],
    ): \stdClass {
        if (is_a($this, referenced_parameter::class)) {
            $this->ensure_parameter_exists($api);
            return (object) [
                '$ref' => $this->get_reference(),
            ];
        }

        $data = (object) [
            // The `name`, and `in` values are required.
            'name' => $this->name,
            'in' => $this->in,
        ];

        if ($this->description !== null) {
            $data->description = $this->description;
        }

        // TODO...
        if ($this->schema !== null) {
            $data->schema = $this->schema;
        } else {
            $data->schema = $this->get_schema_from_type();
        }

        // Note, the spec has the following regarding examples.
        // If referencing a schema that contains an example, the examples value SHALL override the example provided by the schema.
        if ($this->example) {
            $data->example = $this->example;
        } else if (count($this->examples) > 0) {
            $data->examples = [];
            foreach ($this->examples as $example) {
                $data->examples[$example->get_name()] = $example->get_openapi_description(
                    $api,
                    $component,
                    [$this, $parentcontexts],
                );
            }
        } else {
            // TODO. Fall back to the schema example?
            // This is _not_ clear in the spec and I have not found an example of this.
        }


        return $data;
    }

    protected function get_type(): string {
        return $this->type;
    }

    // TODO Move to its own type?
    public function get_schema_from_type(): \stdClass {
        $type = 'string';
        switch ($this->type) {
            case PARAM_INT:
                return (object) ['type' => 'integer'];
            case PARAM_FLOAT:
                return (object) ['type' => 'number'];
            case PARAM_BOOL:
                return (object) ['type' => 'boolean'];

            // The following are all string types which cannot be patternised.
            case PARAM_RAW:
            case PARAM_RAW_TRIMMED:
            case PARAM_CLEANHTML:
            case PARAM_NOTAGS:
            case PARAM_TEXT:
                return (object) ['type' => 'string'];
        }

        // All other types are string types and most have a pattern.
        $type = 'string';
        $pattern = null;
        switch ($this->type) {
            case PARAM_LOCALISEDFLOAT:
                // Some langauges use a comma as a decimal separator.
                $pattern = '^\d*([\.,])\d+$';
                break;
            case PARAM_ALPHA:
                $pattern = '^[a-zA-Z]*$';
                break;
            case PARAM_ALPHAEXT:
                $pattern = '^[a-zA-Z_\-]*$';
                break;
            case PARAM_ALPHANUM:
                $pattern = '^[a-zA-Z0-9]*$';
                break;
            case PARAM_ALPHANUMEXT:
                $pattern = '^[a-zA-Z0-9_\-]*$';
                break;
            case PARAM_SEQUENCE:
                $pattern = '^[0-9,]*$';
                break;
            case PARAM_COMPONENT:
                $pattern = '^[a-z][a-z0-9]*(_(?:[a-z][a-z0-9_](?!__))*)?[a-z0-9]+$';
                break;
            case PARAM_PLUGIN:
            case PARAM_AREA:
                $pattern = '^[a-z](?:[a-z0-9_](?!__))*[a-z0-9]+$';
                break;
            case PARAM_SAFEDIR:
                $pattern = '^[a-zA-Z0-9_\-]*$';
                break;
            case PARAM_SAFEPATH:
                $pattern = '^[a-zA-Z0-9\/_\-]*$';
                break;
        }

        $data = (object) ['type' => $type];
        if ($pattern !== null) {
            $data->pattern = $pattern;
        }

        return $data;
    }

    public function get_schema(): stdClass {
        if ($this->schema !== null) {
            return $this->schema;
        } else {
            return $this->get_schema_from_type();
        }
    }

    public function ensure_parameter_exists(
        specification $api,
    ): self {
        if (!$api->is_reference_defined($this->get_reference())) {
            $api->add_parameter($this->get_reference(qualify: false), $this);
        }
        return $this;
    }
}
