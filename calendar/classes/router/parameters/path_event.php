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

namespace core_calendar\router\parameters;

use calendar_event;
use core\exception\not_found_exception;
use core\param;
use core\router\schema\example;
use core\router\schema\parameters\mapped_property_parameter;
use core\router\schema\referenced_object;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Class path_event
 *
 * @package    core_calendar
 * @copyright  2024 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class path_event extends \core\router\schema\parameters\path_parameter implements
    mapped_property_parameter,
    referenced_object
{
    /**
     * Create a new instance of the event path parameter.
     *
     * @param string $name The name of the parameter to use for the course identifier
     * @param mixed ...$extra Additional arguments
     */
    public function __construct(
        string $name = 'event',
        ...$extra,
    ) {
        $extra['name'] = $name;
        $extra['type'] = param::INT;
        $extra['description'] = <<<EOF
        The event identifier.

        This can be the id of the event.

        EOF;
        $extra['examples'] = [
            new example(
                name: 'An event id',
                value: 54,
            ),
        ];

        parent::__construct(...$extra);
    }

    #[\Override]
    public function add_attributes_for_parameter_value(
        ServerRequestInterface $request,
        string $value,
    ): ServerRequestInterface {
        return $request
            ->withAttribute($this->name, calendar_event::load($value));
    }
}
