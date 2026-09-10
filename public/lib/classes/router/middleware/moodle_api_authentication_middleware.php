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

use core\api\token_manager;
use core\router\exception\oauth_server_exception;
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
     * Constructor for the API Authentication Middleware.
     */
    public function __construct(
        private \League\OAuth2\Server\ResourceServer $server,
        private \Slim\App $app,
        private \core_auth\validate_user $uservalidator,
        private \core\api\repository\api_token_repository $apitokenmanager,
    ) {
    }

    #[\Override]
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface {
        // Get the Moodle Route from the request. We need this to determine if login is required for this page.
        $moodleroute = $request->getAttribute(route::class);
        if ($moodleroute) {
            // Check if this is an API Key request.
            try {
                $authenticatedrequest = $this->handle_api_key_auth($request);
            } catch (OAuthServerException $exception) {
                // We are going to re-use the OAuth2 exception handling mechanism for API key errors.
                $response = $this->app->getResponseFactory()->createResponse();
                return $exception->generateHttpResponse($response);
            }

            if (!$authenticatedrequest) {
                // Still not authenticated.
                // Check for an OAuth2 login credential in the header.
                try {
                    $authenticatedrequest = $this->process_oauth2_login($request);
                } catch (OAuthServerException $exception) {
                    // There was an OAuth2 header, but it did not provide good auth.
                    $response = $this->app->getResponseFactory()->createResponse();
                    return $exception->generateHttpResponse($response);
                }
            }

            if ($authenticatedrequest) {
                // We have an authenticated request.
                $request = $authenticatedrequest;
            } else if ($moodleroute->cookies !== false) {
                // No authenticated request, but cookies are supported.
                \core\session\manager::set_cookies_supported(true);
                if (!\core\session\manager::is_session_active()) {
                    \core\session\manager::start();
                }
            }

            if ($moodleroute->requirelogin) {
                $requirements = $moodleroute->requirelogin;

                $courseattributename = $requirements->get_course_attribute_name();
                $courseorid = $courseattributename ? $request->getAttribute($courseattributename, null) : null;

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

    /**
     * Handle API Key based authentication from the request.
     *
     * @param ServerRequestInterface $request
     * @param route $moodleroute
     * @return ServerRequestInterface|null
     */
    protected function handle_api_key_auth(
        ServerRequestInterface $request,
    ): ServerRequestInterface|null {
        if ($request->hasHeader('authorization') === false) {
            // Not an API Key Request.
            return null;
        }

        $auth = $request->getHeaderLine('Authorization');

        if (
            str_starts_with($auth, 'Bearer ')
            && str_starts_with(substr($auth, 7), token_manager::TOKEN_PREFIX)
        ) {
            $token = substr($auth, 7);

            $apikey = $this->apitokenmanager->get_from_token($token);
            $request = $request->withAttribute('api_token_id', $apikey->get_id());

            $user = $this->complete_user_login($apikey->get_userid());

            $request = $request->withAttribute('user', $user);

            return $request;
        }

        return null;
    }

    /**
     * Process the OAuth2 Login Request.
     *
     * @param ServerRequestInterface $request
     * @param route $moodleroute
     * @return ServerRequestInterface|null
     */
    protected function process_oauth2_login(
        ServerRequestInterface $request,
    ): ServerRequestInterface|null {
        if ($request->hasHeader('authorization') === false) {
            // Not an OAuth2 Request.
            return null;
        }

        // Note: Do not catch exceptions here - we want to return an error response for invalid OAuth2 requests.
        // If we catch and return false then we'll fall back to cookie auth incorrectly.
        $request = $this->server->validateAuthenticatedRequest($request);

        $oauth2userid = $request->getAttribute('oauth_user_id');

        if ($oauth2userid !== null) {
            if ((int) $oauth2userid === 0) {
                // System user login.
                $this->complete_system_login();
            } else {
                $this->complete_user_login($oauth2userid);
            }

            return $request;
        }

        return null;
    }

    /**
     * Complete the user login for the middleware.
     *
     * @param int $userid
     * @return \stdClass $user
     */
    protected function complete_user_login(int $userid): \stdClass {
        // Log in the Moodle user associated with this OAuth2 user ID.
        $user = \core\user::get_user($userid);

        try {
            $this->uservalidator->validate_before_external_login($user);
        } catch (\core_auth\exception\access_denied_exception $e) {
            throw oauth_server_exception::accessDenied(
                $e->getMessage(),
                previous: $e,
            );
        }

        \core\session\manager::init_empty_session();
        \core\session\manager::set_user($user);

        return $user;
    }

    /**
     * Complete the system user login for the middleware.
     *
     * This logs the user in as the system user, which is the 'main' admin user.
     * Ideally this should be a separate user with elevated privileges.
     */
    protected function complete_system_login(): void {
        // The system user is essentially the admin user, but with some value removed.
        \core\session\manager::init_empty_session();
        \core\session\manager::set_user(\core\user::get_system_user());
        $GLOBALS['SESSION'] = new \stdClass();
    }
}
