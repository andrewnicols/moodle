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

use core\openapi\specification;
use ReflectionClass;
use Slim\Routing\Route as RoutingRoute;
use stdClass;

class generic_parameter {

    public function __construct(
        protected string $name,
        protected string $type,
        protected ?string $description = null,
        protected ?string $in = 'path',
        protected ?bool $required = null,
        protected ?bool $deprecated = null,
        protected ?bool $allowemptyvalue = null,

        // TODO All of the rest.

        ...$extra,
    ) {
    }

    public function get_openapi_description(
        specification $api,
        string $component,
        ?route $parentroute = null,
    ): \stdClass {
        $data = (object) [
            'name' => $this->name,
            'type' => $this->type,
        ];

        if ($this->description !== null) {
            $data->description = $this->description;
        }

        if ($this->in !== null) {
            $data->in = $this->in;
        }

        // TODO Determine the required state from the URL parameter.
        $data->required = true;

        return $data;
    }
}
