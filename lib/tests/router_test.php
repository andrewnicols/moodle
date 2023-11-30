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

namespace core;

use core\router\route;
use GuzzleHttp\Psr7\Response;
use Psr\Http\Message\ResponseInterface;
use Slim\App;

/**
 * Tests for the router class.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers     \core\router
 * @covers     \core\router\response_handler
 */
class router_test extends \route_testcase {
    public function test_instantiation(): void {
        $this->assertInstanceOf(router::class, new router(''));
    }

    public function test_get_app(): void {
        $router = new router('/example');
        $app = $router->get_app();
        $this->assertInstanceOf(App::class, $app);

        $this->assertEquals(container::get_container(), $app->getContainer());

        // Moodle is not fully loaded at this point.
        $this->assertFalse($router->is_full_moodle_loaded());
    }

    public function test_get_route_instance_for_method(): void {
        require_once(__DIR__ . '/fixtures/router/route_on_method_only.php');
        require_once(__DIR__ . '/fixtures/router/route_on_class.php');

        // The class has no route attribute.

        // Test a method that has no route attribute.
        $this->assertNull(router::get_route_instance_for_method('core\fixtures\route_on_method_only::method_without_route'));
        $this->assertNull(router::get_route_instance_for_method(['core\fixtures\route_on_method_only', 'method_without_route']));

        // Test a method that has a route attribute.
        $this->assert_route_callable_data(
            'core\fixtures\route_on_method_only::method_with_route',
            '/method/path',
            'core\fixtures\route_on_method_only::method_with_route',
        );
        $this->assert_route_callable_data(
            ['core\fixtures\route_on_method_only', 'method_with_route'],
            '/method/path',
            'core\fixtures\route_on_method_only::method_with_route',
        );

        // The class has a route attribute.

        // Test a method that has no route attribute.
        $this->assertNull(router::get_route_instance_for_method('core\fixtures\route_on_class::method_without_route'));
        $this->assertNull(router::get_route_instance_for_method(['core\fixtures\route_on_class', 'method_without_route']));

        // Test a method that has a route attribute - it is merged with parent.
        $this->assert_route_callable_data(
            'core\fixtures\route_on_class::method_with_route',
            '/class/path/method/path',
            'core\fixtures\route_on_class::method_with_route',
        );
        $this->assert_route_callable_data(
            ['core\fixtures\route_on_class', 'method_with_route'],
            '/class/path/method/path',
            'core\fixtures\route_on_class::method_with_route',
        );
    }

    protected function assert_route_callable_data(
        $callable,
        string $path,
        string $routename,
    ): void {
        $route = router::get_route_instance_for_method($callable);
        $this->assertInstanceOf(route::class, $route);
        $this->assertEquals($path, $route->get_path());
        $this->assertIsString(router::get_route_name_for_callable($callable));
        $this->assertEquals($routename, router::get_route_name_for_callable($callable));
    }

    public function test_request_normalisation(): void {
        $router = new router('');

        // Create handlers for the routes.
        // Note: These must all be created before any are accessed as the data is cached after first use.
        $app = $router->get_app();
        $app->get('/test/path', fn ($response) => $response->withStatus(299));
        $app->get('/', fn ($response) => $response->withStatus(275));
        $app->get('/test/otherpath', fn ($response) => $response->withStatus(250));

        // Duplicate slashes.
        $request = $this->create_request('GET', '/test//path', '');
        $response = $router->handle_request($request);
        $this->assertEquals(299, $response->getStatusCode());

        // An empty route.
        $request = $this->create_request('GET', '', '');
        $response = $router->handle_request($request);
        $this->assertEquals(275, $response->getStatusCode());

        // A route with a trailing slash.
        $request = $this->create_request('GET', '/test/otherpath/', '');
        $response = $router->handle_request($request);
        $this->assertEquals(250, $response->getStatusCode());

        // A route with a trailing double slash.
        $request = $this->create_request('GET', '/test/otherpath/////', '');
        $response = $router->handle_request($request);
        $this->assertEquals(250, $response->getStatusCode());
    }

    /**
     * Test an API route.
     */
    public function test_preferences_no_login(): void {
        $response = $this->process_request('GET', '/user/preferences');

        $this->assert_valid_response($response);
        $payload = $this->decode_response($response);

        $this->assertEmpty((array) $payload);
    }

    public function test_get_path_for_callable(): void {
        require_once(__DIR__ . '/fixtures/router/route_on_class.php');

        $rc = new \ReflectionClass(\core\fixtures\route_on_class::class);
        $rcm = $rc->getMethod('method_with_route');
        $route = $rcm->getAttributes(route::class)[0]->newInstance();
        $router = $this->get_router();
        $app = $router->get_app();
        \core\container::get_container()->set(router::class, $router);

        $app
            ->get(
                $route->get_path(),
                ['core\fixtures\route_on_class', 'method_with_route'],
            )
            ->setName('core\fixtures\route_on_class::method_with_route');

        $url = router::get_path_for_callable(
            'core\fixtures\route_on_class::method_with_route',
            [],
            [],
        );

        $parsedurl = parse_url($url);
        $this->assertEquals('/method/path', $parsedurl['path']);
    }
}
