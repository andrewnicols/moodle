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

namespace core\router\schema\objects;

use core\router\schema\specification;

/**
 * A schema to descirbe an array of things. These could be any type, including other schema definitions.
 *
 * See https://spec.openapis.org/oas/v3.0.0#model-with-map-dictionary-properties for relevant documentation.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class array_of_things extends \core\router\schema\objects\type_base {
    /**
     * An array of things.
     *
     * @param string|null $thingtype The OpenAPI type, or null if any type is allowed.
     * @param array $extra
     */
    public function __construct(
        protected string|null $thingtype = null,
        ...$extra,
    ) {
        parent::__construct(...$extra);
    }

    public function get_openapi_description(
        specification $api,
        ?string $path = null,
    ): ?\stdClass {
        return $this->get_schema();
    }

    public function get_schema(): \stdClass {
        return (object) [
            'type' => 'object',
            'additionalProperties' => $this->get_additional_properties($this->thingtype),
        ];
    }

    public function validate_data($data) {
        return $data;
    }
}
