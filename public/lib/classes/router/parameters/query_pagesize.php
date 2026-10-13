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

use core\exception\invalid_parameter_exception;
use core\param;
use core\router\schema\parameters\query_parameter;
use Psr\Http\Message\ServerRequestInterface;

/**
 * The pagesize query parameter for collection routes.
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class query_pagesize extends query_parameter {
    /**
     * Create a new query_pagesize parameter.
     *
     * @param int $default The default page size
     * @param int $max The maximum page size
     * @param string $name The name of the parameter
     * @param mixed ...$extra Additional arguments
     */
    public function __construct(
        int $default = 25,
        protected int $max = 100,
        string $name = 'pagesize',
        ...$extra,
    ) {
        $extra['name'] = $name;
        $extra['type'] = param::INT;
        $extra['default'] = $default;
        $extra['description'] ??= "The number of results per page. Maximum {$max}.";

        parent::__construct(...$extra);
    }

    #[\Override]
    public function validate(
        ServerRequestInterface $request,
        array $params,
    ): ServerRequestInterface {
        $request = parent::validate($request, $params);

        $value = (int) $request->getQueryParams()[$this->name];
        if ($value < 1 || $value > $this->max) {
            throw new invalid_parameter_exception(
                "The {$this->name} parameter must be between 1 and {$this->max}.",
            );
        }

        return $request;
    }

    #[\Override]
    public function get_schema_from_type(param $type): \stdClass {
        $schema = parent::get_schema_from_type($type);
        $schema->minimum = 1;
        $schema->maximum = $this->max;
        $schema->default = $this->default;

        return $schema;
    }
}
