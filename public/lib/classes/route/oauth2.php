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

namespace core\route;

use core\exception;
use core\oauth2\server\granted_scopes_repository;
use core\oauth2\server\scope_repository;
use core\oauth2\server\user_repository;
use core\output\renderable;
use core\router\route;
use core\router\scope\abstract_scope;
use League\OAuth2\Server\AuthorizationServer;
use League\OAuth2\Server\Exception\OAuthServerException;
use League\OAuth2\Server\Repositories\ClientRepositoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * The oauth2 routes which control the oauth2 authorization flows.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class oauth2 {
    /**
     * Handle the authorization request.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    #[route(
        path: '/authorize',
        method: ['GET'],
    )]
    public function authorize(
        ServerRequestInterface $request,
        ResponseInterface $response,
    ): ResponseInterface {
        $this->reset_auth_request_session();
        try {
            $authrequest = $this->get_auth_request($request);
        } catch (OAuthServerException $exception) {
            // All instances of OAuthServerException can be formatted into a HTTP response.
            return $exception->generateHttpResponse($response);
        }

        if ($authrequest->getState() !== ($request->getQueryParams()['state'] ?? null)) {
            $this->reset_auth_request_session();
            $authrequest = $this->get_auth_request($request);
        }

        if (isloggedin() && !isguestuser()) {
            // User is logged in and not guest.
            // Set the user on the auth request.
            // Redirect to the login page to confirm that the user wishes to continue as this user.
            $authrequest->setUser(user_repository::get_current_user());
            $this->update_session($authrequest);
        }

        return \core\router\util::redirect_to_callable(
            $request,
            $response,
            [self::class, 'login'],
        );
    }

    /**
     * Fetch a token for the client.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param AuthorizationServer $server
     * @return ResponseInterface
     */
    #[route(
        path: '/token',
        method: ['GET', 'POST'],
    )]
    public function token(
        ServerRequestInterface $request,
        ResponseInterface $response,
        AuthorizationServer $server,
    ): ResponseInterface {
        try {
            // Try to respond to the request.
            return $server->respondToAccessTokenRequest($request, $response);
        } catch (OAuthServerException $exception) {
            // All instances of OAuthServerException can be formatted into a HTTP response.
            return $exception->generateHttpResponse($response);
        } catch (\Exception $exception) {
            // Unknown exception.
            $body = $response->getBody();
            $body->write($exception->getMessage());
            return $response->withStatus(500);
        }
    }

    /**
     * Fetch a token for the client_grant.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param AuthorizationServer $server
     * @return ResponseInterface
     */
    #[route(
        path: '/access_token',
        method: ['GET', 'POST'],
    )]
    public function access_token(
        ServerRequestInterface $request,
        ResponseInterface $response,
        AuthorizationServer $server,
    ): ResponseInterface {
        try {
            // Try to respond to the request.
            return $server->respondToAccessTokenRequest($request, $response);
        } catch (OAuthServerException $exception) {
            // All instances of OAuthServerException can be formatted into a HTTP response.
            return $exception->generateHttpResponse($response);
        } catch (\Exception $exception) {
            // Unknown exception.
            $body = $response->getBody();
            $body->write($exception->getMessage());
            return $response->withStatus(500);
        }
    }

    /**
     * Show the login form.
     *
     * @param \Psr\Http\Message\ResponseInterface $response
     * @return ResponseInterface
     */
    #[route(
        path: '/login',
        method: ['GET'],
    )]
    public function login(
        ServerRequestInterface $request,
        ResponseInterface $response,
    ): ResponseInterface {
        $action = \core\router\util::get_path_for_callable([self::class, 'do_login']);

        // If the user is already logged in, make this selectable.
        if (isloggedin() && !isguestuser()) {
            $continueform = new \core_auth\output\oauth2\continue_as_user($action);

            return $this->render_page_from_renderable(
                get_string('login'),
                $continueform,
                $response,
            );
        }

        // TODO: Move this to a shared library somewhere.
        // This is currently copied from login/index.php
        // Note: Do not convert loginpage_hook to a hook, but maybe update it to accept the arguments it can set by reference.
        $authsequence = get_enabled_auth_plugins(); // Auths, in sequence.
        $frm = false;
        $user = false;
        foreach ($authsequence as $authname) {
            $authplugin = get_auth_plugin($authname);
            // The auth plugin's loginpage_hook() can eventually set $frm and/or $user.
            $authplugin->loginpage_hook();
        }

        if (!\is_object($frm)) {
            $frm = new \stdClass();
        }

        $username = $request->getQueryParams()['username'] ?? '';
        if ($username !== '') {
            $frm->username = clean_param($username, PARAM_RAW);
        } else {
            $frm->username = get_moodle_cookie();
        }
        $frm->password = '';

        $loginform = new \core_auth\output\login($authsequence, $frm->username);
        $loginform->loginurl = $action;

        return $this->render_page_from_renderable(
            get_string('login'),
            $loginform,
            $response,
        );
    }

    /**
     * Process the login form submission.
     *
     * @param ServerRequestInterface $request
     * @param \Psr\Http\Message\ResponseInterface $response
     * @param user_repository $userrepository
     * @return ResponseInterface
     */
    #[route(
        path: '/login',
        method: ['POST'],
    )]
    public function do_login(
        ServerRequestInterface $request,
        ResponseInterface $response,
        user_repository $userrepository,
    ): ResponseInterface {
        // Handle the login form submission.
        $authrequest = $this->get_auth_request($request);

        $parsedbody = $request->getParsedBody();

        $user = null;
        if ($parsedbody['currentuser'] ?? '' === '1') {
            // Continue as the current user.
            $user = $userrepository->get_current_user();
        } else if (!empty($parsedbody['username']) && !empty($parsedbody['password'])) {
            // Validate the user credentials.
            $user = $userrepository->getUserEntityByUserCredentials(
                $parsedbody['username'] ?? '',
                $parsedbody['password'] ?? '',
                '',
                $authrequest->getClient(),
            );
        }

        if ($user === null) {
            return \core\router\util::redirect_to_callable(
                $request,
                $response,
                [self::class, 'login'],
            );
        }

        // Login failed, redirect back to login form.
        $authrequest->setUser($user);
        $this->update_session($authrequest);

        return \core\router\util::redirect_to_callable(
            $request,
            $response,
            [self::class, 'approve'],
        );
    }

    /**
     * Handle the refresh token request.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param AuthorizationServer $server
     * @return ResponseInterface
     */
    #[route(
        path: '/refresh',
        method: ['POST'],
    )]
    public function refresh(
        ServerRequestInterface $request,
        ResponseInterface $response,
        AuthorizationServer $server,
    ): ResponseInterface {
        return $server->respondToAccessTokenRequest($request, $response);
    }

    /**
     * Show the approval form.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    #[route(
        path: '/approve',
        method: ['GET'],
    )]
    public function approve(
        ServerRequestInterface $request,
        ResponseInterface $response,
    ): ResponseInterface {
        $authrequest = $this->get_auth_request($request);

        $grantedscopesrepository =  \core\di::get(granted_scopes_repository::class);
        $requestedscopes = array_map(fn($scope): string => $scope->getIdentifier(), $authrequest->getScopes());
        $grantedscopes = $grantedscopesrepository->get_granted_scopes_for_user(
            $authrequest->getClient(),
            $authrequest->getUser(),
        );

        $newscopes = array_map(
            fn (string $identifier): abstract_scope => scope_repository::from_identifier($identifier),
            array_values(array_diff($requestedscopes, $grantedscopes)),
        );

        // Render a simple approval form.
        $confirmscopesform = new \core_auth\output\oauth2\confirm_scopes(
            $grantedscopes,
            $newscopes,
            \core\router\util::get_path_for_callable([self::class, 'do_approve']),
        );

        return $this->render_page_from_renderable(
            get_string('login'),
            $confirmscopesform,
            $response,
        );
    }

    /**
     * Process the approval form submission.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param AuthorizationServer $server
     * @return ResponseInterface
     */
    #[route(
        path: '/approve',
        method: ['POST'],
    )]
    public function do_approve(
        ServerRequestInterface $request,
        ResponseInterface $response,
        AuthorizationServer $server,
    ): ResponseInterface {
        $approved = $request->getParsedBody()['approve'] ?? '0';
        $authrequest = $this->get_auth_request($request);

        $grantedscopesrepository = \core\di::get(granted_scopes_repository::class);
        if ($approved === '1') {
            $selectedscopes = $request->getParsedBody()['scopes'] ?? [];
            $grantedscopesrepository->store_granted_scopes_for_user(
                $authrequest->getClient(),
                $authrequest->getUser(),
                $selectedscopes,
            );
            $authrequest->setAuthorizationApproved(true);
        }

        $this->update_session($authrequest);
        return $server->completeAuthorizationRequest($authrequest, $response);
    }

    /**
     * Helper to reset the authentication request in the session.
     */
    private function reset_auth_request_session(): void {
        global $SESSION;

        unset($SESSION->oauth2request);
    }

    /**
     * Helper to get the authentication request from the session or create a new one.
     *
     * @param \Psr\Http\Message\ServerRequestInterface $request
     * @param \League\OAuth2\Server\AuthorizationServer $server
     */
    private function get_auth_request(
        ServerRequestInterface $request,
    ): ?\League\OAuth2\Server\RequestTypes\AuthorizationRequest {
        global $SESSION;

        if (empty($SESSION->oauth2request)) {
            $server = $this->get(AuthorizationServer::class);
            $clientrepository = $this->get(ClientRepositoryInterface::class);

            $authrequest = $server->validateAuthorizationRequest($request);
            $client = $clientrepository->getClientEntity($request->getQueryParams()['client_id']);
            $authrequest->setClient($client);
            $redirecturi = $request->getQueryParams()['redirect_uri'] ?? null;
            $authrequest->setRedirectUri($redirecturi);

            $this->update_session($authrequest);
        } else {
            $authrequest = unserialize($SESSION->oauth2request);
        }

        return $authrequest;
    }

    /**
     * Helper to update the authentication request within the session.
     *
     * @param \League\OAuth2\Server\RequestTypes\AuthorizationRequest $authrequest
     */
    private function update_session(
        \League\OAuth2\Server\RequestTypes\AuthorizationRequest $authrequest
    ): void {
        global $SESSION;

        $SESSION->oauth2request = serialize($authrequest);
    }

    /**
     * Helper to get a service from the DI container.
     *
     * @param string $identifier
     * @return mixed
     */
    private function get(string $identifier): mixed {
        return \core\di::get($identifier);
    }

    /**
     * Helper to render a page with header and footer.
     *
     * @param string $title
     * @param renderable $content
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    private function render_page_from_renderable(
        string $title,
        renderable $content,
        ResponseInterface $response,
    ): ResponseInterface {
        global $OUTPUT, $PAGE;

        $PAGE->set_pagelayout('login');

        $PAGE->set_title($title);
        $PAGE->set_heading($title);
        $response->getBody()->write($OUTPUT->header());
        $response->getBody()->write($OUTPUT->heading($title));
        $response->getBody()->write($OUTPUT->render($content));
        $response->getBody()->write($OUTPUT->footer());

        return $response;
    }
}
