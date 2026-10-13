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

namespace core\router\schema;

use core\router\parameters\query_page;
use core\router\parameters\query_pagesize;
use core\router\parameters\query_sort;
use core\router\schema\parameters\query_parameter;

/**
 * Configuration for a route which returns a paginated collection.
 *
 * Routes opt-in by adding a `#[collection]` attribute to the handler method alongside `#[route]`, and the page,
 * pagesize, and sort query parameters are added (and validated) automatically.
 *
 * As this is a separate attribute, plugins supporting versions of Moodle without this class may use it freely:
 * the attribute is only instantiated when it exists.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\Attribute(\Attribute::TARGET_METHOD)]
class collection {
    /**
     * Create a new collection configuration.
     *
     * @param int $pagesize The default page size
     * @param int $maxpagesize The maximum page size
     * @param string[] $sortable The fields which clients may sort by. If empty, no sort parameter is added.
     */
    public function __construct(
        /** @var int The default page size */
        public readonly int $pagesize = 25,
        /** @var int The maximum page size */
        public readonly int $maxpagesize = 100,
        /** @var string[] The fields which clients may sort by. If empty, no sort parameter is added. */
        public readonly array $sortable = [],
    ) {
        if ($pagesize < 1 || $maxpagesize < $pagesize) {
            throw new \core\exception\coding_exception('The default page size must be between 1 and the maximum page size.');
        }
    }

    /**
     * Get the query parameters which this collection adds to a route.
     *
     * @return query_parameter[] Indexed by parameter name
     */
    public function get_query_parameters(): array {
        $parameters = [
            new query_page(),
            new query_pagesize(default: $this->pagesize, max: $this->maxpagesize),
        ];

        if ($this->sortable) {
            $parameters[] = new query_sort(sortable: $this->sortable);
        }

        $indexed = [];
        foreach ($parameters as $parameter) {
            $indexed[$parameter->get_name()] = $parameter;
        }

        return $indexed;
    }
}
