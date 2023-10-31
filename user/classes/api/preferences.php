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

namespace core_user\api;

use core\router\payload_response;
use core\router\response_type;
use core\router\route;
use core_user;
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

    /**
     * Fetch a single user preference, or a set of user preferences.
     *
     * @param ResponseInterface $response
     * @param string $themename
     * @param string $component
     * @param null|string $identifier
     * @return Response
     */
    #[route(
        path: '[/{preference}]',
        method: ['GET'],
        title: 'Fetch user preferences',
        description: 'Fetch one user preference, or all user preferences',
        pathtypes: [
            new \core\router\path_parameter(
                name: 'preference',
                type: PARAM_RAW,
            ),
        ],
        responses: [
            200 => new \core\router\response(
                statuscode: 200,
                description: 'OK',
                content: [
                    new \core\router\response\content\json_response(
                        schema: new \core\router\schema\array_of_strings(),
                        examples: [
                            new \core\router\response\example(
                                name: 'A single preference value',
                                summary: 'A json response containing a single preference',
                                value: [
                                    "drawers-open-index" => "1",
                                ],
                            ),
                            new \core\router\response\example(
                                name: 'A set of preference values',
                                summary: 'A json response containing a set of preferences',
                                value: [
                                    "drawers-open-index" => "1",
                                    "login_failed_count_since_success" => "1",
                                    "coursesectionspreferences_2" => "{\"contentcollapsed\":[]}",
                                ],
                            ),
                        ]
                    ),
                ],
            ),
        ],
    )]
    public function get_preferences(
        ResponseInterface $response,
        ServerRequestInterface $request,
        ?string $preference,
    ): response_type {
        // TODO User validation.

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
        path: '',
        method: ['POST'],
        title: 'Set a set of user preferences',
        responses: [
            200 => new \core\router\response(
                statuscode: 200,
                description: 'OK',
                content: [
                    new \core\router\response\content\json_response(
                        schema: new \core\router\schema\array_of_strings(),
                        examples: [
                            new \core\router\response\example(
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
    public function set_preferences(
        ResponseInterface $response,
        ServerRequestInterface $request,
    ): payload_response {
        xdebug_break();
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
            new \core\router\path_parameter(
                name: 'preference',
                type: PARAM_RAW,
            ),
        ],
        responses: [
            200 => new \core\router\response(
                statuscode: 200,
                description: 'OK',
                content: [
                    new \core\router\response\content\json_response(
                        schema: new \core\router\schema\array_of_strings(),
                        examples: [
                            new \core\router\response\example(
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
