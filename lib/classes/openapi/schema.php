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

use core\openapi\specification;
use core\openapi\openapi_base;

/**
 * Routing parameter for validation.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class schema extends openapi_base {

    /**
     * Note: We do not implement the $example, because it has been deprecated in OpenApi 3.0.
     * @param array $examples 
     * @param mixed $extra 
     */
    public function __construct(
        protected array $examples = [],

        ...$extra,
    ) {}


    public function get_openapi_description(
        specification $api,
        string $component,
        array $parentcontexts = [],
    ): \stdClass {
        $data = (object) [];

        if (count($this->examples)) {
            $data->examples = [];
            foreach ($this->examples as $example) {
                $data->examples[$example->get_name()] = $example->get_openapi_description(
                    $api,
                    $component,
                    [$this, $parentcontexts],
                );
            }
        }

        return $data;
    }

    /**
     * Ensure the schema exists in the specification within the #/components/schemas section and is available for re-use.
     *
     * @param specification $api
     * @return self
     */
    public function ensure_schema_exists(
        specification $api,
    ): self {
        if (!$api->is_reference_defined($this->get_reference())) {
            $api->add_schema($this->get_reference(qualify: false), $this);
        }
        return $this;
    }
}
