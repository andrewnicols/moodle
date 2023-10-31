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

use core\param;
use core\router\response\invalid_parameter_response;
use core\router\route;
use core\router\schema\response\payload_response;
use core\router\schema\response\content\payload_response_type;
use core\router\schema\response\response_type;
use core_user;
use core_user\route\responses\user_preferences_response;
use GuzzleHttp\Psr7\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * User preference API handler.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

#[route(
    path: '/preferences',
)]
class preferences {
    use \core\router\route_controller;

    #[route(
        path: '[/{preference}]',
        title: 'Fetch user preferences',
        description: 'Fetch one user preference, or all user preferences',
        pathtypes: [
            new \core\router\schema\parameters\path_parameter(
                name: 'preference',
                type: param::RAW,
            ),
        ],
        responses: [
            200 => new user_preferences_response(),
        ],
    )]
    public function get_preferences(
        ResponseInterface $response,
        ServerRequestInterface $request,
        ?string $preference,
    ): response_type {
        // ...
        $result = get_user_preferences(
            name: $preference,
        );

        if (!is_array($result)) {
            // Check if we received just one preference.
            $result = [$preference => $result];
        }

        return new payload_response($result, $request, $response);
    }

    /**
     * Set a set of user preferences.
     *
     * @param ResponseInterface $response
     * @param string $themename
     * @param string $component
     * @param null|string $identifier
     * @return Response
     */
    #[route(
        method: ['POST'],
        title: 'Set or update multiple user preferences',
        requestbody: new \core\router\schema\request_body(
            content: new payload_response_type(
                schema: new \core\router\schema\objects\schema_object(
                    content: [
                        'preferences' => new \core\router\schema\objects\array_of_strings(
                            keyparamtype: param::TEXT,
                            valueparamtype: param::INT,
                        ),
                    ],
                ),
            ),
        ),
        responses: [
            200 => new user_preferences_response(),
        ],
    )]
    public function set_preferences(
        ResponseInterface $response,
        ServerRequestInterface $request,
    ): payload_response {
        global $USER;

        $user = core_user::get_user(
            userid: $USER->id,
        );
        $values = $request->getParsedBody();
        $preferences = $values['preferences'] ?? [];

        foreach ($preferences as $preference => $value) {
            if (!core_user::can_edit_preference($preference, $user)) {
                // TODO Create an Access Denied exception.
                throw new \Exception('You do not have permission to edit this preference.');
            }
            set_user_preference($preference, $value, $user->id);
        }

        return $this->get_preferences($response, $request, null);
    }

    /**
     * Set a single user preference.
     *
     * @param ResponseInterface $response
     * @param string $themename
     * @param string $component
     * @param null|string $identifier
     * @return Response
     */
    #[route(
        path: '/{preference}',
        method: ['POST'],
        title: 'Set a single user preference',
        description: 'Set a single user preference',
        pathtypes: [
            new \core\router\schema\parameters\path_parameter(
                name: 'preference',
                type: param::RAW,
            ),
        ],
        responses: [
            200 => new \core\router\schema\response\response(
                statuscode: 200,
                description: 'OK',
                content: [
                    new \core\router\schema\response\content\json_media_type(
                        schema: new \core\router\schema\objects\array_of_strings(
                            keyparamtype: param::TEXT,
                            valueparamtype: param::RAW,
                        ),
                        examples: [
                            new \core\router\schema\example(
                                name: 'A single preference value',
                                summary: 'A json response containing a single preference',
                                value: [
                                    "drawers-open-index" => "1",
                                ],
                            ),
                        ]
                    ),
                ],
            ),
        ],
    )]
    public function set_preference(
        ResponseInterface $response,
        ServerRequestInterface $request,
        ?string $preference,
    ): payload_response {
        global $USER;

        // Only support setting for the current user.
        $user = core_user::get_user(
            userid: $USER->id,
        );

        if (!core_user::can_edit_preference($preference, $user)) {
            // TODO Create an Access Denied exception.
            throw new \Exception('You do not have permission to edit this preference.');
        }

        $values = $request->getParsedBody();
        $value = $values['value'] ?? null;

        set_user_preference($preference, $value, $user->id);

        return $this->get_preferences($response, $request, $preference);
    }

}
