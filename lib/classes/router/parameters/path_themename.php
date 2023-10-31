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

use core\openapi\referenced_parameter;
use core\router\response\example;

/**
 * Routing parameter for validation.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class path_themename extends \core\router\path_parameter {
    public function __construct(
        ...$args,
    ) {
        if (!array_key_exists('name', $args)) {
            $args['name'] = 'themename';
        }

        $args['type'] = PARAM_ALPHANUMEXT;
        $args['description'] = 'The name of a Moodle theme.';
        $args['examples'] = [
            new example(
                name: 'The Boost theme',
                value: 'boost',
            ),
            new example(
                name: 'The Classic theme',
                value: 'classic',
            ),
        ];

        parent::__construct(...$args);
    }
}
