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

use core\openapi\specification;

/**
 * A schema to descirbe an array of things. These could be any type, including other schema definitions.
 *
 * See https://spec.openapis.org/oas/v3.0.0#model-with-map-dictionary-properties for relevant documentation.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class schema_object extends \core\openapi\schema {
    /**
     * An array of things.
     *
     * @param array $content The child content
     * @param array $extra
     */
    public function __construct(
        protected array $content,
        ...$extra,
    ) {
        parent::__construct(...$extra);
    }

    public function get_openapi_description(
        specification $api,
    ): \stdClass {
        $data = (object) [
            'type' => 'object',
            'properties' => (object) [],
        ];

        foreach ($this->content as $name => $content) {
            $data->properties->{$name} = $content->get_openapi_description(
                $api,
            );
        }

        return $data;
    }
}
