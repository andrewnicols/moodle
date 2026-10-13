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
 * The sort query parameter for collection routes.
 *
 * The value is a comma-separated list of field names from an allow-list.
 * A field prefixed with `-` is sorted in descending order.
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class query_sort extends query_parameter {
    /**
     * Create a new query_sort parameter.
     *
     * @param string[] $sortable The fields which can be sorted on
     * @param string $name The name of the parameter
     * @param mixed ...$extra Additional arguments
     */
    public function __construct(
        protected array $sortable = [],
        string $name = 'sort',
        ...$extra,
    ) {
        $extra['name'] = $name;
        $extra['type'] = param::RAW;
        $extra['description'] ??= 'A comma-separated list of fields to sort by. Prefix a field with `-` for descending order.'
            . ' Sortable fields: ' . implode(', ', $sortable) . '.';

        parent::__construct(...$extra);
    }

    #[\Override]
    public function validate(
        ServerRequestInterface $request,
        array $params,
    ): ServerRequestInterface {
        $request = parent::validate($request, $params);

        $value = $request->getQueryParams()[$this->name];
        if ($value === null || $value === '') {
            return $request;
        }

        foreach (explode(',', (string) $value) as $field) {
            if (!in_array(ltrim($field, '-'), $this->sortable, true) || str_starts_with($field, '--')) {
                throw new invalid_parameter_exception("Cannot sort by '{$field}'.");
            }
        }

        return $request;
    }

    #[\Override]
    public function get_schema_from_type(param $type): \stdClass {
        $schema = parent::get_schema_from_type($type);
        $schema->pattern = '^-?(' . implode('|', array_map('preg_quote', $this->sortable)) . ')'
            . '(,-?(' . implode('|', array_map('preg_quote', $this->sortable)) . '))*$';

        return $schema;
    }
}
