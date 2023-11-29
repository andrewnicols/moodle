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

use core\router;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use GuzzleHttp\Psr7\Uri;
use PHPUnit\Framework\ExpectationFailedException;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\App;

/**
 * Tests for user preference API handler.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class route_testcase extends \advanced_testcase {

    /**
     * Get an instance of the Moodle Routing Application.
     *
     * @return App
     */
    protected function get_app(): App {
        // Create a partial mock for the Router, removing certain features.
        /** @var (router&\PHPUnit\Framework\MockObject\MockObject) */
        $router = $this->getMockBuilder(router::class)
            ->setConstructorArgs([''])
            ->disallowMockingUnknownTypes()
            ->onlyMethods([
                'configure_caching',
                'add_bootstrap_middlware',
            ])
            ->getMock();

        $router
            ->expects($this->any())
            ->method('configure_caching');

        return $router->get_app();
    }

    /**
     * Create a Request object.
     *
     * @param string $method
     * @param string $path
     * @param array  $headers
     * @param array  $cookies
     * @param array  $serverparams
     * @return ServerRequestInterface
     */
    protected function create_request(
        string $method,
        string $path,
        array $headers = ['Content-Type' => 'application/json'],
        array $cookies = [],
        array $serverparams = [],
    ): ServerRequestInterface {
        $prefix = '/api/rest/v2';
        $uri = new Uri($prefix . $path);

        $request = new ServerRequest(
            method: $method,
            headers: $headers,
            uri: $uri,
            serverParams: $serverparams,
        );

        return $request
            ->withCookieParams($cookies);
    }

    /**
     * Process a request with the app.
     *
     * @param string $method
     * @param string $path
     * @param array  $headers
     * @param array  $cookies
     * @param array  $serverparams
     * @return ResponseInterface
     */
    protected function process_request(
        string $method,
        string $path,
        array $headers = ['HTTP_ACCEPT' => 'application/json'],
        array $cookies = [],
        array $serverparams = [],
    ): ResponseInterface {
        $app = $this->get_app();
        return $app->handle($this->create_request(
            $method,
            $path,
            $headers,
            $cookies,
            $serverparams,
        ));
    }

    /**
     * Assert that a Response object was valid.
     *
     * @param ResponseInterface $response
     * @param null|int $statuscode The expected status code
     * @throws ExpectationFailedException
     */
    protected function assert_valid_response(
        ResponseInterface $response,
        ?int $statuscode = 200,
    ): void {
        $this->assertInstanceOf(Response::class, $response);
        $this->assertEquals(
            $statuscode,
            $response->getStatusCode(),
            "Response status code is not $statuscode",
        );
    }

    /**
     * Decode the JSON response for a Response object.
     *
     * @return stdClass|array
     */
    protected function decode_response(ResponseInterface $response): stdClass|array {
        return (object) json_decode(
            json: (string) $response->getBody(),
            associative: false,
            flags: JSON_FORCE_OBJECT,
        );
    }
}
