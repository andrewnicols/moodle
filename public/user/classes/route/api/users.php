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

use core\exception\insufficient_scope_exception;
use core\exception\not_found_exception;
use core\exception\precondition_failed_exception;
use core\router\parameters\path_user;
use core\param;
use core\router\pagination_request;
use core\router\schema\response\payload_response;
use core\router\require_login;
use core\router\route;
use core\router\schema\objects\scalar_type;
use core\router\schema\objects\schema_object;
use core\router\schema\request_body;
use core\router\schema\response\content\payload_response_type;
use core\router\schema\collection;
use core\router\schema\parameters\query_parameter;
use core\router\schema\response\collection_response;
use core\router\scope\scopeset;
use core_user\local\user_representation;
use core_user\local\user_updater;
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

    /**
     * Update a user.
     *
     * @param ResponseInterface $response
     * @param ServerRequestInterface $request
     * @param \stdClass $userId
     * @return payload_response
     */
    #[route(
        path: '/{userId}',
        title: 'Update a user',
        description: <<<EOF
        Partially update the key information about a user. Only the fields supplied are changed.

        If an `If-Match` header is supplied, the update is only applied if it matches the current `ETag` of the user.
        EOF,
        method: ['PATCH'],
        pathtypes: [
            new path_user(name: 'userId'),
        ],
        requestbody: new request_body(
            required: true,
            content: new payload_response_type(
                schema: new schema_object(
                    content: [
                        'firstName' => new scalar_type(param::TEXT),
                        'lastName' => new scalar_type(param::TEXT),
                        'email' => new scalar_type(param::RAW),
                        'timeZone' => new scalar_type(param::RAW),
                        'suspended' => new scalar_type(param::BOOL),
                    ],
                ),
            ),
        ),
        responses: [
            new user_response(),
        ],
    )]
    #[scopeset(
        new \core_user\route\scope\user\update_self(),
    )]
    public function update_user(
        ResponseInterface $response,
        ServerRequestInterface $request,
        \stdClass $userId,
    ): payload_response {
        global $DB, $USER;

        $current = user_representation::get_core_visible($userId);
        if ($current === null) {
            throw new not_found_exception('user', (string) $userId->id);
        }

        // A token which is only able to update the current user cannot update anybody else.
        $grantedscopes = $request->getAttribute(scopeset::GRANTED_SCOPES);
        if (
            $grantedscopes !== null
            && (int) $userId->id !== (int) $USER->id
            && !(new \core_user\route\scope\user\update())->is_satisfied_by($grantedscopes)
        ) {
            throw new insufficient_scope_exception(
                'The core_user:user:update scope is required to update other users.',
                [new scopeset(new \core_user\route\scope\user\update())],
            );
        }

        $transaction = $DB->start_delegated_transaction();

        $ifmatch = trim($request->getHeaderLine('If-Match'));
        if ($ifmatch !== '' && $ifmatch !== '*') {
            $etags = array_map('trim', explode(',', $ifmatch));
            if (!in_array(user_representation::get_etag($current), $etags, true)) {
                throw new precondition_failed_exception();
            }
        }

        user_updater::update($userId, (array) $request->getParsedBody());

        $updated = user_representation::get_core_visible(\core\user::get_user($userId->id));
        $transaction->allow_commit();

        return new payload_response(
            $updated,
            $request,
            $response->withHeader('ETag', user_representation::get_etag($updated)),
        );
    }
}
