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

namespace core\api;

use core\router\route;
use core\output\mustache_template_source_loader;
use GuzzleHttp\Psr7\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Template Controller.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[route(
    path: '/templates',
)]
class templates {
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
        path: '/{themename}/{component}/{identifier}',
        method: ['GET'],
        title: 'Fetch a single template',
        description: 'Fetch a single template for a component in a theme',
        security: [],
        tags: ['Templates'],
        pathtypes: [
            new \core\router\parameters\path_themename(),
            new \core\router\parameters\path_component(),
            new \core\router\path_parameter(
                name: 'identifier',
                type: PARAM_SAFEPATH,
            ),
        ],
        queryparams: [
            new \core\router\query_parameter(
                name: 'includecomments',
                type: PARAM_BOOL,
                description: 'Include comments in the template',
                default: false,
            ),
        ],
        responses: [
            200 => new \core\router\response(
                statuscode: 200,
                description: 'OK',
                content: [
                    new \core\router\response\content\json_response(
                        schema: new \core\router\schema\array_of_strings(),
                        // examples: [
                        //     new \core\router\response\example(
                        //         name: 'Single template value',
                        //         summary: 'A json response containing the template for a single template',
                        //         value: [
                        //             "mod_example/template_identifier" => "<div class=\"example\">Hello World</div>",
                        //         ],
                        //     ),
                        // ]
                    ),
                ],
            ),
        ],
    )]
    public function get_templates(
        ServerRequestInterface $request,
        ResponseInterface $response,
        mustache_template_source_loader $loader,
        string $themename,
        string $component,
        string $identifier,
    ): Response {
        $params = $request->getQueryParams();
        if (array_key_exists('includecomments', $params)) {
            $comments = $params['includecomments'];
        } else {
            $comments = false;
        }

        try {
            $result = [
                "{$component}/{$identifier}" => $loader->load(
                    component: $component,
                    name: $identifier,
                    themename: $themename,
                    includecomments: $comments,
                ),
            ];
        } catch (\moodle_exception $e) {
            return $this->value_not_found_response(
                $response,
                sprintf(
                    "No template found for component '%s' with name '%s' in theme '%s'",
                    $component,
                    $identifier,
                    $themename,
                ),
            );
        }

        return $this->json_response($response, $result);
    }
}
