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

use core\router\auth\scope_manager;
use core\router\route;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Routing\RouteContext;

/**
 * Middleware to check API Scopes.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class moodle_api_scope_middleware implements MiddlewareInterface {
    #[\Override]
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface {
        // TODO: Determine how to proceed if this is not an OAuth2 Request.
        // I think we can only do this if this is an OAuth2 Request.
        // We probably should use a constant and store the OAuth2 Status in the Request Object.
        // $request->getAttribute(router::OAuth2S);

        if ($request->getAttribute(RouteContext::ROUTE)) {
            $route = $request->getAttribute(RouteContext::ROUTE);
            $route->getPattern();
        }

        // Get the Moodle Route from the request. We need this to determine scopes for this page.
        $moodleroute = $request->getAttribute(route::class);

        if (!$moodleroute) {
            // Every API page must have a route object.
            // If we don't have one, we cannot continue.
            // We should throw an exception here.
            // The one exception is the SwaggerUI page.
            if (str_ends_with($request->getUri()->getPath(), 'rest/v2/openapi.json')) {
                return $handler->handle($request);
            }

            throw new \Exception('No route object found in request.');
        }

        if ($moodleroute->scopes === null) {
            // No scopes defined, so we can continue for now but this will cease to work in 5.1.
            // We add a warning because this should be defined as an empty array.
            // TODO: Add better debugging to help.
            error_log('No scopes defined for route  with path ' . $moodleroute->get_path());
        }

        if ($moodleroute->scopes === null || count($moodleroute->scopes) === 0) {
            // Scopes are defined but none required.
            // We can continue.
            return $handler->handle($request);
        }

        // TODO: Check scopes here.
        $scopemanager = \core\di::get(scope_manager::class);
        if (!$scopemanager->user_has_all_scopes($moodleroute->scopes)) {
            // User does not have all required scopes.
            // We should throw an exception here.
            throw new \Exception(
                'User does not have all required scopes. Missing ' .
                implode(', ', $scopemanager->get_missing_scopes_for_user($moodleroute->scopes)),
            );
        }

        // User has all required scopes.
        return $handler->handle($request);
    }
}
