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
use League\OAuth2\Server\Exception\OAuthServerException;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Middleware to check Moodle authentication.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class moodle_api_authentication_middleware extends moodle_authentication_middleware {
    /**
     * Constructor for the API Authentifcation Middleware.
     */
    public function __construct(
        private \League\OAuth2\Server\ResourceServer $server,
    ) {
    }

    #[\Override]
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface {
        // Get the Moodle Route from the request. We need this to determine if login is required for this page.
        $moodleroute = $request->getAttribute(route::class);

        if ($moodleroute) {
            // Process OAuth2 login first.
            $oauth2 = $this->process_oauth2_login($request, $moodleroute);
            if ($oauth2 !== true) {
                \core\session\manager::set_cookies_supported(true);
                \core\session\manager::start();

                // \core\session\manager::set_user($USER);
            }

            if ($moodleroute->requirelogin) {
                $requirements = $moodleroute->requirelogin;
                if ($courseattributename = $requirements->get_course_attribute_name()) {
                    $courseorid = $request->getAttribute($courseattributename, null);
                }

                if ($requirements->should_require_course_login()) {
                    require_course_login(
                        $courseorid,
                        $requirements->should_autologin_guest(),
                    );
                } else if ($requirements->should_require_login()) {
                    require_login(
                        $courseorid,
                        $requirements->should_autologin_guest(),
                    );
                }
            }
        }

        return $handler->handle($request);
    }

    protected function process_oauth2_login(
        ServerRequestInterface $request,
        route $moodleroute,
    ): bool {
        try {
            $request = $this->server->validateAuthenticatedRequest($request);
        } catch (OAuthServerException $exception) {
            // Not an OAuth2 Request.
            return false;
        }

        $oauth2userid = $request->getAttribute('oauth_user_id');
        if ($oauth2userid) {
            $oauth2scopes = $request->getAttribute('oauth_scopes', []);
            $hasanyscope = in_array('*', $oauth2scopes);
            if ($hasanyscope) {
                // If we have the wildcard scope, we have all scopes.
                $oauth2scopes = array_keys(\core\oauth2\api::get_all_scopes());
            } else {
                foreach ($moodleroute->get_scopes() as $requiredscope) {
                    // TODO: Support scope wildcards.
                    $hasscope = in_array($requiredscope, $oauth2scopes);
                    if ($hasscope) {
                        continue;
                    }

                    foreach ($oauth2scopes as $scope) {
                        if (str_ends_with($scope, '*')) {
                            $prefix = substr($scope, 0, -1);
                            if (str_starts_with($requiredscope, $prefix)) {
                                $hasscope = true;
                                break;
                            }
                        }
                    }

                    if (!$hasscope) {
                        throw new \core\exception\moodle_exception('missingrequiredscope', 'oauth2');
                    }
                }
            }

            // Log in the Moodle user associated with this OAuth2 user ID.
            $user = \core\user::get_user($oauth2userid);
            // TODO: Copy the checks from webservice_user::authenticate_user to somewhere shared and call them.

            \core\session\manager::set_user($user);
            // complete_user_login(\core\user::get_user($oauth2userid));

            return true;
        }
    }
}
