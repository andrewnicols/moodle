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
use core\oauth2\server\user_repository;
use core\router\route;
use League\OAuth2\Server\AuthorizationServer;
use League\OAuth2\Server\Exception\OAuthServerException;
use League\OAuth2\Server\Repositories\ClientRepositoryInterface;
use League\OAuth2\Server\Repositories\ScopeRepositoryInterface;
use League\OAuth2\Server\Repositories\UserRepositoryInterface;
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
        } catch (\League\OAuth2\Server\Exception\OAuthServerException $exception) {
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
        ResponseInterface $response,
    ): ResponseInterface {
        global $USER;

        $action = \core\router\util::get_path_for_callable([self::class, 'do_login']);

        // If the user is already logged in, make this selectable.
        if (isloggedin() && !isguestuser()) {
            $body = $response->getBody();
            $body->write("<p>You are already logged in as " . htmlspecialchars($USER->username) . ".</p>");
            $body->write("<form method=\"post\" action=\"{$action}\">");
            $body->write(\core\output\html_writer::empty_tag('input', [
                'type' => 'hidden',
                'name' => 'currentuser',
                'value' => 1,
            ]));
            $body->write(\core\output\html_writer::empty_tag('input', [
                'type' => 'hidden',
                'name' => 'sesskey',
                'value' => sesskey(),
            ]));
            $body->write('<button type="submit">Continue as this user</button>');
            $body->write('</form>');
            return $response;
        }

        // Render a simple login form.
        $body = $response->getBody();
        $body->write("<form method=\"post\" action=\"{$action}\">");
        $body->write('<input type="text" name="username" placeholder="Username"/>');
        $body->write('<input type="password" name="password" placeholder="Password"/>');
        $body->write(\core\output\html_writer::empty_tag('input', [
            'type' => 'hidden',
            'name' => 'sesskey',
            'value' => sesskey(),
        ]));
        $body->write('<button type="submit">Login</button>');
        $body->write('</form>');
        return $response;
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
        global $USER;

        require_sesskey();

        // Handle the login form submission.
        $authrequest = $this->get_auth_request($request);

        if ($request->getParsedBody()['currentuser'] ?? '' === '1') {
            // Continue as the current user.
            $authrequest->setUser(
                $userrepository->get_user_from_user_record($USER),
            );
        } else {
            // Validate the user credentials.
            $authrequest->setUser(
                $userrepository->getUserEntityByUserCredentials(
                    $request->getParsedBody()['username'] ?? '',
                    $request->getParsedBody()['password'] ?? '',
                    '',
                    $authrequest->getClient(),
                ),
            );
        }

        if ($authrequest->getUser() !== null) {
            $this->update_session($authrequest);

            return \core\router\util::redirect_to_callable(
                $request,
                $response,
                [self::class, 'approve'],
            );
        }

        // Login failed, redirect back to login form.
        return \core\router\util::redirect_to_callable(
            $request,
            $response,
            [self::class, 'login'],
        );
    }

    /**
     * Handle the authorization request.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param AuthorizationServer $server
     * @param UserRepositoryInterface $userrepository
     * @return ResponseInterface
     */
    #[route(
        path: '/authorize',
        method: ['GET'],
    )]
    public function authorize(
        ServerRequestInterface $request,
        ResponseInterface $response,
        AuthorizationServer $server,
        UserRepositoryInterface $userrepository,
    ): ResponseInterface {
        global $SESSION;

        $this->reset_auth_request_session();
        try {
            $authrequest = $this->get_auth_request($request);
        } catch (OAuthServerException $exception) {
            // All instances of OAuthServerException can be formatted into a HTTP response
            return $exception->generateHttpResponse($response);
        }


        if ($authrequest->getState() !== $request->getQueryParams()['state'] ?? null) {
            $this->reset_auth_request_session();
            $authrequest = $this->get_auth_request($request);
        }

        if (!property_exists($SESSION, 'user')) {
            // User is not logged in, redirect to login.
            return \core\router\util::redirect_to_callable(
                $request,
                $response,
                [self::class, 'login'],
            );
        }

        if (!$SESSION->approvedscopes) {
            $authrequest->setUser(
                $userrepository->getUserEntityById($SESSION->user->id),
            );

            $this->update_session($authrequest);

            return \core\router\util::redirect_to_callable(
                $request,
                $response,
                [self::class, 'approve'],
            );
        }

        // TODO: Work out what to do in this case.
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
     * @param AuthorizationServer $server
     * @param ClientRepositoryInterface $clientrepository
     * @param ScopeRepositoryInterface $scoperepository
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

        // Render a simple approval form.
        $action = \core\router\util::get_path_for_callable([self::class, 'do_approve']);
        $body = $response->getBody();
        $body->write("<form method=\"post\" action=\"{$action}\">");
        $body->write('<p>Do you approve the requested scopes?</p>');
        $body->write('<ul>');
        foreach ($authrequest->getScopes() as $scope) {
            $body->write('<li>' . htmlspecialchars($scope->getIdentifier()) . '</li>');
        }
        $body->write('</ul>');
        $body->write('<button type="submit" name="approve" value="1">Approve</button>');
        $body->write('<button type="submit" name="approve" value="0">Deny</button>');
        $body->write('</form>');
        return $response;
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
        global $SESSION;

        $approved = $request->getParsedBody()['approve'] ?? '0';
        $SESSION->approvedscopes = $approved === '1';
        $authrequest = $this->get_auth_request($request);
        $authrequest->setAuthorizationApproved(true);

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
            $authrequest->setRedirectUri($client->getRedirectUri());

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
}
