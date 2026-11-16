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

namespace core\router\middleware;

use core\router\route;
use core\router\schema\text_formatting;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Middleware to handle validation of API requests and responses based on the route data.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class api_validation_middleware extends validation_middleware {
    #[\Override]
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface {
        try {
            $route = $request->getAttribute(route::class);
            $originalparams = $request->getQueryParams();
            if ($route) {
                text_formatting::get_api_query_parameters($route);
            }
            $request = $this->requestvalidator->validate_request($request);
            if ($route) {
                foreach (text_formatting::get_query_parameters() as $name => $parameter) {
                    if (array_key_exists($name, $originalparams)) {
                        $params = $request->getQueryParams();
                        $params[$name] = $originalparams[$name];
                        $request = $parameter->validate($request, $params);
                    }
                }
            }
        } catch (\Exception $e) {
            return $this->responsehandler->get_response_from_exception($request, $e);
        }

        $response = $handler->handle($request);

        try {
            $this->responsevalidator->validate_response($request, $response);
        } catch (\Exception $e) {
            return $this->responsehandler->get_response_from_exception($request, $e);
        }

        return $response;
    }
}
