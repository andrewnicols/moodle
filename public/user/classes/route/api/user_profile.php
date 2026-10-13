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
use core\param;
use core\router\conditional_request;
use core\router\parameters\path_user;
use core\router\require_login;
use core\router\route;
use core\router\schema\objects\scalar_type;
use core\router\schema\objects\schema_object;
use core\router\schema\request_body;
use core\router\schema\response\content\payload_response_type;
use core\router\schema\response\payload_response;
use core\router\schema\etag;
use core\router\scope\scopeset;
use core_user\local\user_representation;
use core_user\local\user_scope_check_trait;
use core_user\local\user_updater;
use core_user\route\responses\user_profile_response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * User profile API handler.
 *
 * @package    core_user
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[route(
    path: '/users/{userId}/profile',
    requirelogin: new require_login(),
    pathtypes: [
        new path_user(name: 'userId'),
    ],
)]
class user_profile {
    use user_scope_check_trait;

    /**
     * Fetch the profile information of a user.
     *
     * @param ResponseInterface $response
     * @param ServerRequestInterface $request
     * @param \stdClass $userId
     * @return payload_response
     */
    #[route(
        title: 'Fetch a user profile',
        description: 'Fetch the profile information of one user.',
        method: ['GET'],
        responses: [
            new user_profile_response(),
        ],
    )]
    #[etag]
    #[scopeset(
        new \core_user\route\scope\user\read_self(),
    )]
    #[scopeset(
        new \core_user\route\scope\user\read(),
    )]
    public function get_profile(
        ResponseInterface $response,
        ServerRequestInterface $request,
        \stdClass $userId,
    ): payload_response {
        $this->require_read_scope_for($request, $userId);

        $item = user_representation::get_profile_visible($userId);
        if ($item === null) {
            throw new not_found_exception('user', (string) $userId->id);
        }

        return conditional_request::respond($request, $response, $item);
    }

    /**
     * Update the profile information of a user.
     *
     * @param ResponseInterface $response
     * @param ServerRequestInterface $request
     * @param \stdClass $userId
     * @return payload_response
     */
    #[route(
        title: 'Update a user profile',
        description: <<<EOF
        Partially update the profile information of a user. Only the fields supplied are changed.
        EOF,
        method: ['PATCH'],
        requestbody: new request_body(
            required: true,
            content: new payload_response_type(
                schema: new schema_object(
                    content: [
                        'city' => new scalar_type(param::TEXT),
                        'country' => new scalar_type(param::RAW),
                        'institution' => new scalar_type(param::TEXT),
                        'department' => new scalar_type(param::TEXT),
                        'phone' => new scalar_type(param::TEXT),
                        'mobilePhone' => new scalar_type(param::TEXT),
                        'address' => new scalar_type(param::TEXT),
                        'description' => new scalar_type(param::RAW),
                    ],
                ),
            ),
        ),
        responses: [
            new user_profile_response(),
        ],
    )]
    #[etag]
    #[scopeset(
        new \core_user\route\scope\user\update_self(),
    )]
    #[scopeset(
        new \core_user\route\scope\user\update(),
    )]
    public function update_profile(
        ResponseInterface $response,
        ServerRequestInterface $request,
        \stdClass $userId,
    ): payload_response {
        global $DB;

        $this->require_update_scope_for($request, $userId);

        $current = user_representation::get_profile_visible($userId);
        if ($current === null) {
            throw new not_found_exception('user', (string) $userId->id);
        }

        user_updater::require_can_edit($userId);

        $transaction = $DB->start_delegated_transaction();

        conditional_request::assert_if_match($request, $current);

        user_updater::update_profile($userId, (array) $request->getParsedBody());

        $updated = user_representation::get_profile_visible(\core\user::get_user($userId->id));
        $transaction->allow_commit();

        return new payload_response(
            $updated,
            $request,
            $response->withHeader('ETag', conditional_request::generate_etag($updated)),
        );
    }
}
