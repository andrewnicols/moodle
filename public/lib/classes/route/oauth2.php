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
use League\OAuth2\Server\AuthorizationServer;
use League\OAuth2\Server\Repositories\ClientRepositoryInterface;
use League\OAuth2\Server\Repositories\ScopeRepositoryInterface;
use League\OAuth2\Server\Repositories\UserRepositoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Class token_request
 *
 * @package    core
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class oauth2 {
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

    public function login(
        ServerRequestInterface $request,
        ResponseInterface $response,
        AuthorizationServer $server,
        ClientRepositoryInterface $clientrepository,
        ScopeRepositoryInterface $scoperepository,
        UserRepositoryInterface $userrepository,
    ): ResponseInterface {
        $action = \core\router\util::get_path_for_callable([self::class, 'do_login']);
        // Render a simple login form.
        $body = $response->getBody();
        $body->write("<form method=\"post\" action=\"{$action}\">");
        $body->write('<input type="text" name="username" placeholder="Username"/>');
        $body->write('<input type="password" name="password" placeholder="Password"/>');
        $body->write('<button type="submit">Login</button>');
        $body->write('</form>');
        return $response;
    }

    public function do_login(
        ServerRequestInterface $request,
        ResponseInterface $response,
        AuthorizationServer $server,
        ClientRepositoryInterface $clientrepository,
        ScopeRepositoryInterface $scoperepository,
        UserRepositoryInterface $userrepository,
    ): ResponseInterface {
        // Handle the login form submission.
        $authrequest = $this->get_auth_request(
            $request,
            $server,
            $clientrepository,
            $scoperepository,
        );
        $authrequest->setUser($userrepository->getUserEntityByUserCredentials(
            $request->getParsedBody()['username'] ?? '',
            $request->getParsedBody()['password'] ?? '',
            '',
            $authrequest->getClient(),
        ));

        $this->update_session($authrequest);

        if ($authrequest->getUser() !== null) {
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

    public function authorize(
        ServerRequestInterface $request,
        ResponseInterface $response,
        AuthorizationServer $server,
        ClientRepositoryInterface $clientrepository,
        ScopeRepositoryInterface $scoperepository,
        UserRepositoryInterface $userrepository,
    ): ResponseInterface {
        global $SESSION;

        $this->reset_auth_request_session();
        $authrequest = $this->get_auth_request(
            $request,
            $server,
            $clientrepository,
            $scoperepository,
        );

        if ($authrequest->getState() !== $request->getQueryParams()['state'] ?? null) {
            $this->reset_auth_request_session();
            $authrequest = $this->get_auth_request(
                $request,
                $server,
                $clientrepository,
                $scoperepository,
            );
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
    }

    public function refresh(
        ServerRequestInterface $request,
        ResponseInterface $response,
        AuthorizationServer $server,
    ): ResponseInterface {
        return $server->respondToAccessTokenRequest($request, $response);
    }

    public function approve(
        ServerRequestInterface $request,
        ResponseInterface $response,
        AuthorizationServer $server,
        ClientRepositoryInterface $clientrepository,
        ScopeRepositoryInterface $scoperepository,
    ): ResponseInterface {
        $authrequest = $this->get_auth_request(
            $request,
            $server,
            $clientrepository,
            $scoperepository,
        );

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

    public function do_approve(
        ServerRequestInterface $request,
        ResponseInterface $response,
        AuthorizationServer $server,
        ClientRepositoryInterface $clientrepository,
        ScopeRepositoryInterface $scoperepository,
    ): ResponseInterface {
        global $SESSION;

        $approved = $request->getParsedBody()['approve'] ?? '0';
        $SESSION->approvedscopes = $approved === '1';
        $authrequest = $this->get_auth_request(
            $request,
            $server,
            $clientrepository,
            $scoperepository,
        );
        $authrequest->setAuthorizationApproved(true);

        $this->update_session($authrequest);
        return $server->completeAuthorizationRequest($authrequest, $response);
    }

    private function reset_auth_request_session(): void {
        global $SESSION;

        unset($SESSION->oauth2request);
    }

    private function get_auth_request(
        ServerRequestInterface $request,
        AuthorizationServer $server,
        ClientRepositoryInterface $clientrepository,
        ScopeRepositoryInterface $scoperepository,
    ): ?\League\OAuth2\Server\RequestTypes\AuthorizationRequest {
        global $SESSION;

        if (empty($SESSION->oauth2request)) {

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

    private function update_session(
        \League\OAuth2\Server\RequestTypes\AuthorizationRequest $authrequest
    ): void {
        global $SESSION;

        $SESSION->oauth2request = serialize($authrequest);
    }
}
