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

namespace core\router\schema\response\content;

use core\router\schema\openapi_base;
use core\router\schema\objects\type_base;
use core\router\schema\specification;

/**
 * An OpenAPI MediaType.
 * https://swagger.io/specification/#media-type-object
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class media_type extends openapi_base {
    public function __construct(
        protected ?type_base $schema = null,
        protected ?string $example = null,
        protected array $examples = [],

        // Used for request body.
        protected bool $required = false,

        ...$extra,
    ) {
        assert(
            $example === null || count($examples) === 0,
            'Only one of example or examples can be specified.',
        );
    }

    public function get_openapi_description(
        specification $api,
        ?string $path = null,
    ): ?\stdClass {
        $data = (object) [];

        if ($this->schema) {
            $data->schema = $this->schema->get_openapi_schema(
                api: $api,
            );
        }

        if ($this->example) {
            $data->example = $this->example;
        } else if (count($this->examples)) {
            $data->examples = array_map(
                fn(\core\router\schema\example $example) => $example->get_openapi_schema(
                    api: $api,
                ),
                $this->examples,
            );
        }

        if ($this->required) {
            $data->required = true;
        }

        return $data;
    }

    public function get_schema(): type_base {
        return $this->schema;
    }

    public function get_mimetype(): string {
        return static::get_encoding();
    }

    abstract public static function get_encoding(): string;
}
