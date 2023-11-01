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

/**
 * A scheam to describe an array of strings.
 *
 * TODO: This should really take a PARAM_ type for validation of both name and value.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class array_of_strings extends array_of_things {
    public function __construct(
        protected string $keyparamtype = PARAM_RAW,
        protected string $valueparamtype = PARAM_RAW,
        ...$extra,
    ) {
        $extra['thingtype'] = 'string';
        parent::__construct(...$extra);
    }

    public function validate_data(array $params): array {
        foreach ($params as $name => $value) {
            validate_param($name, PARAM_RAW);
            validate_param($value, PARAM_RAW);
        }
        return $params;
    }
}
