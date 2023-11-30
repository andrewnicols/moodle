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

namespace core\router;

use core\param;
use core\router\schema\parameters\path_parameter;
use core\router\schema\parameters\query_parameter;
use core\router\schema\request_body;
use core\router\route;
use invalid_parameter_exception;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpNotFoundException;

/**
 * Tests for user preference API handler.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers     \core\router\route
 */
class route_test extends \route_testcase {
    /**
     * Test that the Attribute is configured correctly.
     */
    public function test_attributes(): void {
        $route = new \ReflectionClass(\core\router\route::class);
        $this->assertNotEmpty($route->getAttributes());

        $this->assertNotEmpty($route->getAttributes(\Attribute::class));
        $attributes = $route->getAttributes(\Attribute::class);
        $this->assertCount(1, $attributes);
        $attribute = reset($attributes);
        $flags = $attribute->getArguments()[0];

        // This can only be set on class, and method.
        $this->assertEquals(\Attribute::TARGET_CLASS, $flags & \Attribute::TARGET_CLASS);
        $this->assertEquals(\Attribute::TARGET_METHOD, $flags & \Attribute::TARGET_METHOD);

        // Only one per method or class allowed.
        $this->assertEquals(0, \Attribute::IS_REPEATABLE & $flags);

        // Yes, this is a poor test, but if someone wants to extend this attribute in future,
        // they need to write appropriate tests for it.
        $this->assertEquals(\Attribute::TARGET_CLASS | \Attribute::TARGET_METHOD, $flags);
    }

    /**
     * Test that path setting and getting works as expected.
     */
    public function test_get_path(): void {
        $route = new route(
            path: '/example',
        );

        $this->assertEquals('/example', $route->get_path());

        // And with a parent.
        $child = new route(
            path: '/child/path',
        );
        $child->set_parent($route);
        $this->assertEquals('/example/child/path', $child->get_path());

        // But the parent is not changed in any way.
        $this->assertEquals('/example', $route->get_path());
    }


    /**
     * Test the default method.
     */
    public function test_get_methods(): void {
        // No method specified.
        $route = new route();
        $this->assertNull($route->get_methods());

        // A string route.
        $route = new route(
            method: 'POST',
        );
        $this->assertEquals(['POST'], $route->get_methods());

        // An array of routes.
        $route = new route(
            method: ['POST', 'PUT'],
        );
        $this->assertEquals(['POST', 'PUT'], $route->get_methods());

        // A route which inherits its method from its parent
        $child = new route();
        $child->set_parent($route);
        $this->assertEquals(['POST', 'PUT'], $child->get_methods());

        // A child route will merge its own routes with its parents.
        $child = new route(
            method: 'GET',
        );
        $child->set_parent($route);
        $this->assertEquals(['GET', 'POST', 'PUT'], $child->get_methods());

        // A child route which shares some will not dulicate.
        $child = new route(
            method: ['GET', 'PUT'],
        );
        $child->set_parent($route);
        $this->assertEquals(['GET', 'POST', 'PUT'], $child->get_methods());
    }

    /**
     * Ensure that pathtypes and queryparams accept query parameters correctly.
     */
    public function test_params_are_params(): void {
        $route = new route(
            pathtypes: [
                new path_parameter(
                    name: 'example',
                    type: param::RAW,
                ),
                new path_parameter(
                    name: 'another',
                    type: param::INT,
                ),
            ],
            queryparams: [
                new query_parameter(
                    name: 'example',
                    type: param::RAW,
                ),
                new query_parameter(
                    name: 'another',
                    type: param::INT,
                ),
            ],
        );
        $this->assertInstanceOf(route::class, $route);
    }

    /**
     * @dataProvider invalid_constructor_param_types
     */
    public function test_params_not_params(array $args): void {
        $this->expectException(\coding_exception::class);
        new \core\router\route(...$args);
    }

    public static function invalid_constructor_param_types(): array {
        return [
            'path_parameter in querytypes' => [
                'args' => [
                    'pathtypes' => [
                        new path_parameter(
                            name: 'example',
                            type: param::RAW,
                        ),
                        new query_parameter(
                            name: 'another',
                            type: param::INT,
                        ),
                    ],
                ],
            ],
            'query_parameter in pathtype' => [
                'args' => [
                    'pathtypes' => [
                        new path_parameter(
                            name: 'example',
                            type: param::RAW,
                        ),
                        new query_parameter(
                            name: 'another',
                            type: param::INT,
                        ),
                    ],
                ],
            ],
        ];
    }

    public function test_get_path_parameters(): void {
        // No parameters at all.
        $route = new route();
        $this->assertEmpty($route->get_path_parameters());

        $child = new route();
        $child->set_parent($route);
        $this->assertEmpty($child->get_path_parameters());

        // A route with a single parameter.
        $route = new route(
            pathtypes: [
                new path_parameter(
                    name: 'example',
                    type: param::SAFEPATH,
                ),
            ],
        );
        $params = $route->get_path_parameters();
        $this->assertCount(1, $params);
        $this->assertArrayHasKey('example', $params);
        $this->assertInstanceOf(path_parameter::class, $params['example']);
        $this->assertEquals(param::SAFEPATH, $params['example']->get_type());

        // A route with a multiple parameters.
        $route = new route(
            pathtypes: [
                new path_parameter(
                    name: 'example',
                    type: param::SAFEPATH,
                ),
                new path_parameter(
                    name: 'another',
                    type: param::INT,
                ),
            ],
        );
        $params = $route->get_path_parameters();
        $this->assertCount(2, $params);
        $this->assertArrayHasKey('example', $params);
        $this->assertArrayHasKey('another', $params);
        $this->assertInstanceOf(path_parameter::class, $params['example']);
        $this->assertEquals(param::SAFEPATH, $params['example']->get_type());
        $this->assertInstanceOf(path_parameter::class, $params['another']);
        $this->assertEquals(param::INT, $params['another']->get_type());

        // A child will also inhereit any params from the parent.
        $child = new route(
            pathtypes: [
                new path_parameter(
                    name: 'childparam',
                    type: param::COMPONENT,
                ),
            ],
        );
        $child->set_parent($route);
        $params = $child->get_path_parameters();
        $this->assertCount(3, $params);
        $this->assertArrayHasKey('example', $params);
        $this->assertArrayHasKey('another', $params);
        $this->assertArrayHasKey('childparam', $params);
        $this->assertInstanceOf(path_parameter::class, $params['example']);
        $this->assertEquals(param::SAFEPATH, $params['example']->get_type());
        $this->assertInstanceOf(path_parameter::class, $params['another']);
        $this->assertEquals(param::INT, $params['another']->get_type());
        $this->assertInstanceOf(path_parameter::class, $params['childparam']);
        $this->assertEquals(param::COMPONENT, $params['childparam']->get_type());
    }

    /**
     * Test that has_request_body works as expected.
     */
    public function test_has_request_body(): void {
        $route = new route();
        $this->assertFalse($route->has_request_body());

        $route = new route(
            requestbody: new request_body(),
        );
        $this->assertTrue($route->has_request_body());
    }

    /**
     * Ensure that has_any_validatable_parameter checks the param types.
     */
    public function test_has_any_validatable_parameter(): void {
        // No validatable params.
        $route = new route();
        $this->assertFalse($route->has_any_validatable_parameter());

        // A pathtype is a validatable param.
        $route = new route(
            pathtypes: [
                new path_parameter(
                    name: 'example',
                    type: param::INT,
                ),
            ],
        );
        $this->assertTrue($route->has_any_validatable_parameter());

        // A pathtype is a validatable param.
        $route = new route(
            queryparams: [
                new query_parameter(
                    name: 'example',
                    type: param::INT,
                ),
            ],
        );
        $this->assertTrue($route->has_any_validatable_parameter());

        // A request bdoy is a validatable param.
        $route = new route(
            requestbody: new request_body(),
        );
        $this->assertTrue($route->has_any_validatable_parameter());
    }

    /**
     * Test cookie control.
     */
    public function test_can_access_cookies(): void {
        // By default we allow cookie access.
        $route = new route();
        $this->assertTrue($route->can_access_cookies());

        // This can also be set as an option.
        $route = new route(
            cookies: true,
        );
        $this->assertTrue($route->can_access_cookies());

        // It can also be prevented.
        $route = new route(
            cookies: false,
        );
        $this->assertFalse($route->can_access_cookies());
    }

    /**
     * Test abort_after_config control.
     */
    public function test_abort_after_config(): void {
        // By default we do not abort after config.
        $route = new route();
        $this->assertFalse($route->abort_after_config());

        // This can also be set as an option.
        $route = new route(
            abortafterconfig: false,
        );
        $this->assertFalse($route->abort_after_config());

        // It can also be prevented.
        $route = new route(
            abortafterconfig: true,
        );
        $this->assertTrue($route->abort_after_config());
    }

    /**
     * A basic test of request validation.
     */
    public function test_validate_request(): void {
        // The route being tested.
        $route = new route(
            path: '/example/{required}',
            pathtypes: [
                new path_parameter(
                    name: 'required',
                    type: param::INT,
                ),
            ],
        );
        $request = $this->get_request_for_routed_route($route, '/example/123');

        $this->assertInstanceOf(ServerRequestInterface::class, $route->validate_request($request));
    }

    /**
     * A basic test of request validation.
     */
    public function test_validate_request_missing_pathtype(): void {
        // A route with a parameter defined in the path, but no pathtype for it.
        $route = new route(
            path: '/example/{required}',
        );

        $request = $this->get_request_for_routed_route($route, '/example/123');

        $this->assertInstanceOf(ServerRequestInterface::class, $route->validate_request($request));
    }

    /**
     * When a defined pathtype is missing from the path.
     */
    public function test_validate_request_missing_path_component(): void {
        // A route with a parameter defined in the path, but no pathtype for it.
        $route = new route(
            path: '/example/123',
            pathtypes: [
                new path_parameter(
                    name: 'required',
                    type: param::INT,
                ),
            ],
        );

        $request = $this->get_request_for_routed_route($route, '/example/123');

        $this->expectException(\coding_exception::class);
        $this->expectExceptionMessageMatches('/Route.*has 0 arguments.* 1 pathtypes./');
        $route->validate_request($request);
    }

    /**
     * When a pathtype fails to validate, it will result in an HttpNotFoundException.
     */
    public function test_validate_request_invalid_path_component(): void {
        // Most of the path types are converted to regexes and will lead to a 404 before they get this far.
        $type = param::INT;
        $this->assertEmpty(
            $type->get_clientside_expression(),
            'This test requires a type with no clientside expression. Please update the test.',
        );

        $route = new route(
            path: '/example/{required}',
            pathtypes: [
                new path_parameter(
                    name: 'required',
                    type: $type,
                ),
            ],
        );

        $request = $this->get_request_for_routed_route($route, '/example/abc');

        $this->expectException(HttpNotFoundException::class);
        $route->validate_request($request);
    }

    /**
     * When a pathtype fails to validate, it will result in an HttpNotFoundException.
     */
    public function test_validate_request_invalid_path_component_native(): void {
        // Most of the path types are converted to regexes and will lead to a 404 before they get this far.
        $type = param::ALPHA;
        $this->assertNotEmpty(
            $type->get_clientside_expression(),
            'This test requires a type with clientside expression. Please update the test.',
        );
        $route = new route(
            path: '/example/{required}',
            pathtypes: [
                new path_parameter(
                    name: 'required',
                    type: $type,
                ),
            ],
        );

        // A value which does not meet the param validation.
        $request = $this->get_request_for_routed_route($route, '/example/123');

        $this->expectException(HttpNotFoundException::class);
        $route->validate_request($request);
    }

    /**
     * Query parameter validation.
     */
    public function test_validate_request_query_parameter_valid(): void {
        $type = param::INT;
        $value = 123;

        $route = new route(
            path: '/example',
            queryparams: [
                new query_parameter(
                    name: 'required',
                    type: $type,
                ),
            ],
        );

        $request = $this->get_request_for_routed_route($route, "/example?required={$value}");
        $this->assertEquals($value, $request->getQueryParams()['required']);

        // Validate the request.
        $validatedrequest = $route->validate_request($request);
        $this->assertInstanceOf(ServerRequestInterface::class, $validatedrequest);
        $this->assertEquals($value, $validatedrequest->getQueryParams()['required']);
    }

    /**
     * Query parameter validation failure.
     */
    public function test_validate_request_query_parameter_invalid(): void {
        $type = param::INT;
        $value = 'abc';

        $route = new route(
            path: '/example',
            queryparams: [
                new query_parameter(
                    name: 'required',
                    type: $type,
                ),
            ],
        );

        $request = $this->get_request_for_routed_route($route, "/example?required={$value}");
        $this->assertEquals($value, $request->getQueryParams()['required']);

        // Validate the request.
        $this->expectException(invalid_parameter_exception::class);
        $route->validate_request($request);
    }

    /**
     * @todo Test request body validation.
     */
    public function test_validate_request_body_valid(): void {
    }
}
