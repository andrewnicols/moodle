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

namespace core\router\schema\response;

use core\router\pagination_request;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * A payload response for a paginated collection.
 *
 * The payload is wrapped in the standard items and pagination envelope.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class collection_response extends payload_response {
    /**
     * Create a new collection response.
     *
     * @param array $items The items on the requested page
     * @param int|null $totalitems The total number of items across all pages, or null if not calculated
     * @param bool $hasmore Whether another page of items is available
     * @param ServerRequestInterface $request The request
     * @param ResponseInterface|null $response The response
     */
    public function __construct(
        array $items,
        ?int $totalitems,
        bool $hasmore,
        ServerRequestInterface $request,
        ?ResponseInterface $response = null,
    ) {
        $pagination = pagination_request::from_request($request);

        parent::__construct(
            payload: [
                'items' => array_values($items),
                'pagination' => [
                    'page' => $pagination->page,
                    'pageSize' => $pagination->pagesize,
                    'totalItems' => $totalitems,
                    'hasMore' => $hasmore,
                ],
            ],
            request: $request,
            response: $response,
        );
    }
}
