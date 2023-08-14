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

use core\router\route;
use core\output\mustache_template_source_loader;
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
    path: '/preference[/{preference}]',
)]
class preference {
    use \core\router\route_controller;

    /**
     * Fetch a single template for a component in a theme.
     *
     * @param ResponseInterface $response
     * @param string $themename
     * @param string $component
     * @param null|string $identifier
     * @return Response
     */
    #[route(
        path: '',
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
                                name: 'Single template value',
                                summary: 'A json response containing the template for a single template',
                                value: [
                                    "mod_example/template_identifier" => "<div class=\"example\">Hello World</div>",
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
        ?string $preference,
    ): ResponseInterface {
        // TODO User validation.

        $result = get_user_preferences(
            name: $preference,
        );

        if (!is_array($result)) {
            // Check if we received just one preference.
            $result = [$preference => $result];
        }

        return $this->json_response($response, $result);
    }
}
