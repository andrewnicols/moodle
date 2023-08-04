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

namespace core\router\response;

use core\openapi\specification;
use Psr\Http\Message\ResponseInterface;

/**
 * A Response Example Object.
 *
 * https://swagger.io/specification/#example-object
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class example {
    public function __construct(
        protected string $name,
        protected ?string $summary = null,
        protected ?string $description = null,
        protected mixed $value = null,
        protected ?string $externalvalue = null,
        ...$extra,
    ) {
        assert(
            $value === null || $externalvalue === null,
            'Only one of value or externalvalue can be specified.',
        );
    }

    public function get_name(): string {
        return $this->name;
    }

    public function get_openapi_description(
        specification $api,
        string $component,
        array $parentcontexts = [],
    ): \stdClass {
        $data = (object) [];

        if ($this->summary !== null) {
            $data->summary = $this->summary;
        }

        if ($this->description !== null) {
            $data->description = $this->description;
        }

        if ($this->value !== null) {
            $data->value = $this->value;
        } else {
            $data->externalValue = $this->externalvalue;
        }

        return $data;
    }
}
