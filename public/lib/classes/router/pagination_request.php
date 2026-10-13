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

namespace core\router;

use Psr\Http\Message\ServerRequestInterface;

/**
 * The validated pagination and sort inputs for a collection request.
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class pagination_request {
    /**
     * Constructor.
     *
     * @param int $page The page number, starting at 1
     * @param int $pagesize The number of items per page
     * @param array<string, bool> $sort Map of field name to whether it is descending, in order of precedence
     */
    public function __construct(
        public readonly int $page = 1,
        public readonly int $pagesize = 25,
        public readonly array $sort = [],
    ) {
    }

    /**
     * Build from a request that has been through the request validator.
     *
     * @param ServerRequestInterface $request
     * @return self
     */
    public static function from_request(ServerRequestInterface $request): self {
        $params = $request->getQueryParams();

        $sort = [];
        foreach (array_filter(explode(',', (string) ($params['sort'] ?? ''))) as $field) {
            $descending = str_starts_with($field, '-');
            $sort[ltrim($field, '-')] = $descending;
        }

        return new self(
            page: (int) ($params['page'] ?? 1),
            pagesize: (int) ($params['pagesize'] ?? 25),
            sort: $sort,
        );
    }

    /**
     * The number of records to skip, for use as limitfrom.
     *
     * @return int
     */
    public function get_offset(): int {
        return ($this->page - 1) * $this->pagesize;
    }

    /**
     * The maximum number of records to return, for use as limitnum.
     *
     * @return int
     */
    public function get_limit(): int {
        return $this->pagesize;
    }

    /**
     * Get an ORDER BY clause body for the requested sort, using a map of API field names to safe SQL expressions.
     *
     * Fields which are not in the map are ignored.
     *
     * @param array<string, string> $columns Map of API field name to SQL column expression
     * @return string An empty string if there is nothing to sort by
     */
    public function get_order_by(array $columns): string {
        $parts = [];
        foreach ($this->sort as $field => $descending) {
            if (isset($columns[$field])) {
                $parts[] = $columns[$field] . ($descending ? ' DESC' : ' ASC');
            }
        }

        return implode(', ', $parts);
    }
}
