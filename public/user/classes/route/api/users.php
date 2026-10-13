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

namespace core_user\route\api;

use core\exception\not_found_exception;
use core\router\parameters\path_user;
use core\router\pagination_request;
use core\router\schema\response\payload_response;
use core\router\require_login;
use core\router\route;
use core\router\schema\collection;
use core\router\schema\parameters\query_parameter;
use core\router\schema\response\collection_response;
use core\router\scope\scopeset;
use core_user\local\user_representation;
use core_user\local\visible_users;
use core_user\route\responses\user_collection_response;
use core_user\route\responses\user_response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * User collection API handler.
 *
 * @package    core_user
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[route(
    path: '/users',
    requirelogin: new require_login(),
)]
class users {
    /**
     * List the users which the current user is allowed to see.
     *
     * @param ResponseInterface $response
     * @param ServerRequestInterface $request
     * @return collection_response
     */
    #[route(
        title: 'List users',
        description: 'List the users visible to the current user.',
        method: ['GET'],
        queryparams: [
            new query_parameter(
                name: 'search',
                type: \core\param::TEXT,
                description: 'Only return users whose name, or any visible identity field, contains this value.',
            ),
        ],
        responses: [
            new user_collection_response(),
        ],
    )]
    // Attributes cannot call functions. The sortable fields must match visible_users::SORT_COLUMNS.
    #[collection(sortable: ['firstname', 'lastname'])]
    #[scopeset(
        new \core_user\route\scope\user\read(),
    )]
    public function list_users(
        ResponseInterface $response,
        ServerRequestInterface $request,
    ): collection_response {
        $result = visible_users::get_page(
            pagination: pagination_request::from_request($request),
            search: trim($request->getQueryParams()['search'] ?? ''),
        );

        $items = [];
        $courses = null;
        foreach ($result['users'] as $user) {
            $item = user_representation::get_core_visible($user, $courses);
            if ($item !== null) {
                $items[] = $item;
            }
        }

        return new collection_response($items, $result['total'], $request, $response);
    }

    /**
     * Fetch a single user.
     *
     * @param ResponseInterface $response
     * @param ServerRequestInterface $request
     * @param \stdClass $user
     * @return payload_response
     */
    #[route(
        path: '/{userId}',
        title: 'Fetch a user',
        description: 'Fetch the key information about one user.',
        method: ['GET'],
        pathtypes: [
            new path_user(name: 'userId'),
        ],
        responses: [
            new user_response(),
        ],
    )]
    #[scopeset(
        new \core_user\route\scope\user\read(),
    )]
    public function get_user(
        ResponseInterface $response,
        ServerRequestInterface $request,
        \stdClass $userId,
    ): payload_response {
        $item = user_representation::get_core_visible($userId);
        if ($item === null) {
            // Do not reveal the existence of users which the current user cannot see.
            throw new not_found_exception('user', (string) $userId->id);
        }

        $etag = user_representation::get_etag($item);
        if (in_array($etag, array_map('trim', explode(',', $request->getHeaderLine('If-None-Match'))), true)) {
            return new payload_response([], $request, $response->withStatus(304)->withHeader('ETag', $etag));
        }

        return new payload_response($item, $request, $response->withHeader('ETag', $etag));
    }
}
