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

use core\router\schema\specification;

/**
 * An OpenAPI array (list) of items which all have the same type.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class array_of_items extends type_base {
    /**
     * Constructor.
     *
     * @param type_base $itemtype The type of each item in the list
     * @param mixed[] ...$extra
     */
    public function __construct(
        /** @var type_base The type of each item */
        protected type_base $itemtype,
        ...$extra,
    ) {
        parent::__construct(...$extra);
    }

    #[\Override]
    public function get_openapi_description(
        specification $api,
        ?string $path = null,
    ): ?\stdClass {
        $data = parent::get_openapi_description($api, $path);
        $data->type = 'array';
        $data->items = $this->itemtype->get_openapi_schema($api);

        return $data;
    }

    #[\Override]
    public function validate_data(mixed $data) {
        if (!is_array($data)) {
            throw new \core\exception\invalid_parameter_exception('Invalid data type, expected array.');
        }

        return array_map(fn ($item) => $this->itemtype->validate_data($item), $data);
    }
}
