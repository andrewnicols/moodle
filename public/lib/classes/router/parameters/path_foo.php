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

use core\exception\not_found_exception;
use core\param;
use core\router\schema\example;
use core\router\schema\parameters\mapped_property_parameter;
use core\router\schema\referenced_object;
use Psr\Http\Message\ServerRequestInterface;

/**
 * A Moodle parameter referenced in the path.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class path_foo extends \core\router\schema\parameters\path_parameter implements
    mapped_property_parameter,
    referenced_object
{
    /**
     * Create a new path_course parameter.
     *
     * @param string $name The name of the parameter to use for the course identifier
     * @param mixed ...$extra Additional arguments
     */
    public function __construct(
        string $name = 'foo',
        ...$extra,
    ) {
        $extra['name'] = $name;
        $extra['type'] = param::RAW;

        parent::__construct(...$extra);
    }

    /**
     * Get the course object for the given identifier.
     *
     * @param string $value A course id, idnumber, or shortname
     * @return object
     * @throws not_found_exception If the course cannot be found
     */
    protected function get_course_for_value(string $value): mixed {
        global $DB;

        $data = false;

        if (is_numeric($value)) {
            $data = $DB->get_record('course', [
                'id' => $value,
            ]);
        }

        if ($data) {
            return $data;
        }

        throw new not_found_exception('course', $value);
    }

    #[\Override]
    public function add_attributes_for_parameter_value(
        ServerRequestInterface $request,
        string $value,
    ): ServerRequestInterface {
        $course = $this->get_course_for_value($value);

        return $request
            ->withAttribute($this->name, $course)
            ->withAttribute(
                "{$this->name}context",
                new lazy_parameter(fn (): \core\context\course => \core\context\course::instance($course->id)),
            )
            ->withAttribute(
                "{$this->name}coursecatcontext",
                new lazy_parameter(fn (): \core\context\coursecat => \core\context\coursecat::instance($course->category)),
            );
    }

    #[\Override]
    public function get_schema_from_type(param $type): \stdClass {
        $schema = parent::get_schema_from_type($type);

        $schema->pattern = "^(";
        $schema->pattern .= implode("|", [
            '\d+',
            'idnumber:.+',
            'name:.+',
        ]);
        $schema->pattern .= ")$";

        return $schema;
    }
}
