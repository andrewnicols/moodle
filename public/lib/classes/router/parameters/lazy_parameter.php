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

namespace core\router\parameters;

/**
 * Lazy parameter.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class lazy_parameter {
    /**
     * Create a new instance of the lazy parameter.
     *
     * @param \Closure $hydrator The closure to use to hydrate the value.
     */
    public function __construct(
        /** @var \Closure $hydrator The closure to use to hydrate the value. */
        protected readonly \Closure $hydrator,
    ) {
    }

    /**
     * Hydrate and return the value.
     *
     * @return mixed
     */
    public function hydrate_value(): mixed {
        print_r("Hydrating lazy parameter");
        return ($this->hydrator)();
    }
}
