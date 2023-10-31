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

namespace core\router\types;

use Attribute;

/**
 * Routing attribute.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
class component {
    protected array $method = [];

    public function __construct(
        public ?string $path = null,
        array|string $method = [],
    ) {
        if (is_string($method)) {
            $method = [$method];
        }
        $this->method = $method;
    }

    public function get_path(
        ?route $parent = null,
    ): string {
        $path = $this->path ?? '';
        if ($parent) {
            $path = $parent->get_path() . $path;
        }
        return $path;
    }

    public function get_methods(
        ?route $parent = null,
    ): array {
        return array_merge(
            $parent ? $parent->get_methods() : [],
            $this->method,
        );
    }
}
