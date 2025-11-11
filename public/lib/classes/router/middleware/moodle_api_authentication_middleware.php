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
     * Constructor for the API Authentifcation Middleware.
     */
    public function __construct(
        private \League\OAuth2\Server\ResourceServer $server,
        private \Slim\App $app,
    ) {
    }

    #[\Override]
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface {
        // Get the Moodle Route from the request. We need this to determine if login is required for this page.
        $moodleroute = $request->getAttribute(route::class);
        if ($moodleroute) {
            // Check if this is an API Key request.
            // TODO: Better exception handling here.
            $authenticated = $this->handle_api_key_auth($request, $moodleroute);

            // Fall back to OAuth2.
            if (!$authenticated) {
                // Process OAuth2 login first.
                try {
                    $authenticated = $this->process_oauth2_login($request, $moodleroute);
                } catch (OAuthServerException $exception) {
                    // An OAuth2 Request which did not provide good auth.
                    $response = $this->app->getResponseFactory()->createResponse();
                    return $exception->generateHttpResponse($response);
                }
            }

            // Fall back to cookie authentication.
            if ($authenticated) {
                $request = $authenticated;
            } else {
                \core\session\manager::set_cookies_supported(true);
                \core\session\manager::start();
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
     * @throws \core\exception\require_login_exception
     * @return ServerRequestInterface|null
     */
    protected function handle_api_key_auth(
        ServerRequestInterface $request,
        route $moodleroute,
    ): ServerRequestInterface|null {
        global $DB;

        if ($request->hasHeader('authorization') === false) {
            // Not an API Key Request.
            return null;
        }

        $auth = $request->getHeaderLine('Authorization');

        if (str_starts_with($auth, 'Bearer ')) {
            $token = substr($auth, 7);

            if (str_starts_with($token, 'mk_')) {
                // TODO: Move this to an appropriate repository method.
                // Tokens are a base64 encoded string of "tokenid/secret" prefixed with "mk_".
                // The secret is hashed in the database using `password_hash` so is not reversible.
                // The base64 encoding makes it URL safe and allows us to include the token ID and secret for verification.
                $tokendata = base64_decode(substr($token, 3));
                [$tokenid, $secret] = explode('/', $tokendata, 2);
                $apikey = $DB->get_record('rest_api_tokens', ['id' => $tokenid]);

                if (!password_verify($secret, $apikey->token)) {
                    $apikey = null;
                }

                // TODO: Throw appropriate exceptions here.
                if (!$apikey) {
                    throw new \core\exception\require_login_exception('Invalid API Key');
                }

                if ($apikey->expiry && $apikey->expiry < time()) {
                    throw new \core\exception\require_login_exception('API Key has expired');
                }

                if ($apikey->status != 1) {
                    throw new \core\exception\require_login_exception('API Key has been revoked');
                }

                $request = $request->withAttribute('api_token_id', $apikey->id)
                    ->withAttribute('oauth_scopes', $apikey->scopes);

                $this->validate_scope($moodleroute, explode(' ', $apikey->scopes));
                $this->complete_user_login($apikey->userid);

                return $request;
            }
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
        route $moodleroute,
    ): ServerRequestInterface|null {
        if ($request->hasHeader('authorization') === false) {
            // Not an OAuth2 Request.
            return null;
        }

        // Note: Do not catch exceptions here - we want to return an error response for invalid OAuth2 requests.
        // If we catch and return false then we'll fall back to cookie auth incorrectly.
        $request = $this->server->validateAuthenticatedRequest($request);

        $oauth2userid = $request->getAttribute('oauth_user_id');
        if ($oauth2userid) {
            $providedscopes = $request->getAttribute('oauth_scopes', []);
            $this->validate_scope($moodleroute, $providedscopes);
            $this->complete_user_login($oauth2userid);

            return $request;
        }

        return null;
    }

    /**
     * Validate the scopes against the route.
     *
     * @param route $moodleroute
     * @param array $providedscopes
     * @return bool
     */
    protected function validate_scope(
        route $moodleroute,
        array $providedscopes,
    ): bool {
        $hasanyscope = in_array('*', $providedscopes);
        if ($hasanyscope) {
            // If we have the wildcard scope, we have all scopes.
            $providedscopes = array_keys(\core\oauth2\api::get_all_scopes());
        } else {
            foreach ($moodleroute->get_scopes() as $requiredscope) {
                // TODO: Support scope wildcards.
                if ($requiredscope->is_satisfied_by($providedscopes)) {
                    continue;
                }

                foreach ($providedscopes as $scope) {
                    if (str_ends_with($scope, '*')) {
                        $prefix = substr($scope, 0, -1);
                        if (str_starts_with($requiredscope, $prefix)) {
                            continue 2;
                        }
                    }
                }

                throw oauth_server_exception::insufficient_scope($moodleroute->get_scopes());
            }
        }

        return true;
    }

    /**
     * Complete the user login for the middleware.
     *
     * @param int $userid
     */
    protected function complete_user_login(int $userid): void {
        // Log in the Moodle user associated with this OAuth2 user ID.
        $user = \core\user::get_user($userid);
        // TODO: Copy the checks from webservice_user::authenticate_user to somewhere shared and call them.

        \core\session\manager::set_user($user);
        // complete_user_login(\core\user::get_user($oauth2userid));
    }
}
