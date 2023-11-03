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
 * A schema to describe an array of things. These could be any type, including other schema definitions.
 *
 * See https://spec.openapis.org/oas/v3.1.0#model-with-map-dictionary-properties for relevant documentation.
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

    public function has(string $key): bool {
        return isset($this->content[$key]);
    }

    public function validate_data(array $params): array {
        foreach ($params as $key => $values) {
            if (!$this->has($key)) {
                // We do not know about this one.
                // Remove it from the params array.
                $params = array_diff_key(
                    $params,
                    [$key => $values],
                );
                continue;
            }

            // Validate this parameter.
            $child = $this->content[$key];
            $params[$key] = $child->validate_data($values);
        }

        return $params;
    }

    public function get_openapi_description(
        specification $api,
        ?string $path = null,
    ): ?\stdClass {
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
