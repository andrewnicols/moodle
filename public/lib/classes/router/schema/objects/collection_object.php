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

use core\param;
use core\router\schema\specification;

/**
 * The standard envelope for a paginated collection: a list of items, and pagination metadata.
 *
 * `totalItems` is nullable when an exact count is not calculated. `hasMore` reports whether another page exists.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class collection_object extends schema_object {
    /**
     * Constructor.
     *
     * @param type_base $itemtype The type of each item in the collection
     * @param mixed[] ...$extra
     */
    public function __construct(
        type_base $itemtype,
        ...$extra,
    ) {
        $extra['content'] = [
            'items' => new array_of_items($itemtype),
            'pagination' => new schema_object(
                content: [
                    'page' => new scalar_type(param::INT, required: true),
                    'pageSize' => new scalar_type(param::INT, required: true),
                    'totalItems' => new scalar_type(param::INT),
                    'hasMore' => new scalar_type(param::BOOL, required: true),
                ],
            ),
        ];

        parent::__construct(...$extra);
    }

    #[\Override]
    public function get_openapi_description(
        specification $api,
        ?string $path = null,
    ): ?\stdClass {
        $description = parent::get_openapi_description($api, $path);
        $description->properties->pagination->properties->totalItems->type = ['integer', 'null'];

        return $description;
    }
}
