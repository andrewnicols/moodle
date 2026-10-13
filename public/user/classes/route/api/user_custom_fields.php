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
use core\router\schema\objects\array_of_strings;
use core\router\schema\objects\schema_object;
use core\router\schema\request_body;
use core\router\schema\response\content\payload_response_type;
use core\router\schema\response\payload_response;
use core\router\schema\etag;
use core\router\scope\scopeset;
use core_user\local\custom_fields;
use core_user\local\user_representation;
use core_user\local\user_scope_check_trait;
use core_user\local\user_updater;
use core_user\route\responses\user_custom_fields_response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * User custom profile fields API handler.
 *
 * @package    core_user
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[route(
    path: '/users/{userId}/custom-fields',
    requirelogin: new require_login(),
    pathtypes: [
        new path_user(name: 'userId'),
    ],
)]
class user_custom_fields {
    use user_scope_check_trait;

    /**
     * Fetch the custom fields of a user.
     *
     * @param ResponseInterface $response
     * @param ServerRequestInterface $request
     * @param \stdClass $userId
     * @return payload_response
     */
    #[route(
        title: 'Fetch user custom fields',
        description: 'Fetch the custom profile fields of one user which are visible to the current user.',
        method: ['GET'],
        responses: [
            new user_custom_fields_response(),
        ],
    )]
    #[etag]
    #[scopeset(
        new \core_user\route\scope\user\read_self(),
    )]
    #[scopeset(
        new \core_user\route\scope\user\read(),
    )]
    public function get_custom_fields(
        ResponseInterface $response,
        ServerRequestInterface $request,
        \stdClass $userId,
    ): payload_response {
        $this->require_read_scope_for($request, $userId);
        $this->require_visible($userId);

        $item = custom_fields::get_representation($userId);
        return conditional_request::respond($request, $response, $item);
    }

    /**
     * Replace the custom fields of a user.
     *
     * @param ResponseInterface $response
     * @param ServerRequestInterface $request
     * @param \stdClass $userId
     * @return payload_response
     */
    #[route(
        title: 'Replace user custom fields',
        description: <<<EOF
        Replace the custom profile fields of a user. Any field which the current user may edit and which is not supplied
        is cleared. Fields which the current user may not edit are left unchanged.
        EOF,
        method: ['PUT'],
        requestbody: new request_body(
            required: true,
            content: new payload_response_type(
                schema: new schema_object(
                    content: [
                        'fields' => new array_of_strings(
                            keyparamtype: param::ALPHANUMEXT,
                            valueparamtype: param::RAW,
                        ),
                    ],
                ),
            ),
        ),
        responses: [
            new user_custom_fields_response(),
        ],
    )]
    #[etag]
    #[scopeset(
        new \core_user\route\scope\user\update_self(),
    )]
    #[scopeset(
        new \core_user\route\scope\user\update(),
    )]
    public function replace_custom_fields(
        ResponseInterface $response,
        ServerRequestInterface $request,
        \stdClass $userId,
    ): payload_response {
        return $this->write($response, $request, $userId, true);
    }

    /**
     * Partially update the custom fields of a user.
     *
     * @param ResponseInterface $response
     * @param ServerRequestInterface $request
     * @param \stdClass $userId
     * @return payload_response
     */
    #[route(
        title: 'Update user custom fields',
        description: <<<EOF
        Partially update the custom profile fields of a user. Only the fields supplied are changed.
        EOF,
        method: ['PATCH'],
        requestbody: new request_body(
            required: true,
            content: new payload_response_type(
                schema: new schema_object(
                    content: [
                        'fields' => new array_of_strings(
                            keyparamtype: param::ALPHANUMEXT,
                            valueparamtype: param::RAW,
                        ),
                    ],
                ),
            ),
        ),
        responses: [
            new user_custom_fields_response(),
        ],
    )]
    #[etag]
    #[scopeset(
        new \core_user\route\scope\user\update_self(),
    )]
    #[scopeset(
        new \core_user\route\scope\user\update(),
    )]
    public function update_custom_fields(
        ResponseInterface $response,
        ServerRequestInterface $request,
        \stdClass $userId,
    ): payload_response {
        return $this->write($response, $request, $userId, false);
    }

    /**
     * Write the custom fields.
     *
     * @param ResponseInterface $response
     * @param ServerRequestInterface $request
     * @param \stdClass $user
     * @param bool $replace
     * @return payload_response
     */
    private function write(
        ResponseInterface $response,
        ServerRequestInterface $request,
        \stdClass $user,
        bool $replace,
    ): payload_response {
        global $DB;

        $this->require_update_scope_for($request, $user);
        $this->require_visible($user);
        user_updater::require_can_edit($user);

        $transaction = $DB->start_delegated_transaction();

        conditional_request::assert_if_match($request, custom_fields::get_representation($user));

        $body = (array) $request->getParsedBody();
        custom_fields::update($user, (array) ($body['fields'] ?? []), $replace);

        $updated = custom_fields::get_representation($user);
        $transaction->allow_commit();

        return new payload_response(
            $updated,
            $request,
            $response->withHeader('ETag', conditional_request::generate_etag($updated)),
        );
    }

    /**
     * Ensure that the current user can see the user, without revealing whether they exist otherwise.
     *
     * @param \stdClass $user
     * @throws not_found_exception
     */
    private function require_visible(\stdClass $user): void {
        if (user_representation::get_core_visible($user) === null) {
            throw new not_found_exception('user', (string) $user->id);
        }
    }
}
