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
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * A Moodle course model parameter referenced in the path.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class path_cmid extends \core\router\schema\parameters\path_parameter implements
    mapped_property_parameter,
    referenced_object
{
    /**
     * Create a new instance.
     *
     * @param string $name The name of the parameter to use for the course identifier
     * @param mixed ...$extra Additional arguments
     */
    public function __construct(
        string $name = 'cmid',
        ...$extra,
    ) {
        $extra['name'] = $name;
        $extra['type'] = param::RAW;
        $extra['description'] = <<<EOF
        The course module identifier.

        This can be the id of the course module.

        EOF;
        $extra['examples'] = [
            new example(
                name: 'A course module id (cmid)',
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
        global $DB;

        $cm = $DB->get_record('course_modules', [
            'id' => $value,
        ]);

        if (!$cm) {
            throw new not_found_exception('course_module', $value);
        }

        $proxy = new parameter_proxy(function () use ($cm): array {
            [$course, $cm] = get_course_and_cm_from_cmid($cm->id);
            return [
                'course' => \core\context\course::instance($cm->course),
                'coursecontext' => \core\context\course::instance($course->id),
                'cminfo' => $cm,
                'cmcontext' => \core\context\module::instance($cm->id),
            ];
        });

        $request = $this->add_proxied_attribute($request, $proxy, 'course');
        $request = $this->add_proxied_attribute($request, $proxy, 'coursecontext');
        $request = $this->add_proxied_attribute($request, $proxy, 'cminfo');
        $request = $this->add_proxied_attribute($request, $proxy, 'cmcontext');

        return $request;
    }

    protected function get_property_name(string $suffix): string {
        return "{$this->name}{$suffix}";
    }

    protected function add_proxied_attribute(
        RequestInterface $request,
        parameter_proxy $proxy,
        string $name,
    ): RequestInterface {
        return $request->withAttribute($this->get_property_name($name), $proxy->prepare($name));
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
