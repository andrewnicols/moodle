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

use core\di;
use core\router\scope\scopeset;
use core\tests\fake_plugins_test_trait;
use core\tests\router\route_testcase;
use GuzzleHttp\Psr7\ServerRequest;

/**
 * Tests for the Moodle OAuth2 scope attribute middleware.
 *
 * @package    core
 * @category   test
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(moodle_oauth2_scope_attribute_middleware::class)]
final class moodle_oauth2_scope_attribute_middleware_test extends route_testcase {
    use fake_plugins_test_trait;

    /**
     * When a matched route has a scopeset attribute, the middleware exposes the resolved scope sets on the
     * request as the scopeset::class attribute.
     */
    #[\PHPUnit\Framework\Attributes\RunInSeparateProcess]
    public function test_route_with_scopeset_is_added_to_request(): void {
        $this->resetAfterTest();
        $this->add_full_mocked_plugintype(
            plugintype: 'fake',
            path: 'public/lib/tests/fixtures/fakeplugins/fake',
        );
        self::load_fixture('core', 'router/route_with_scopes.php');

        $testcase = $this;

        $app = $this->get_simple_app();
        $app->get('/method/path', [\core\fixtures\route_with_scopes::class, 'method_with_single_scopeset']);
        $app->add(function ($request, $handler) use ($testcase) {
            $scopesets = $request->getAttribute(scopeset::class);
            $testcase->assertCount(1, $scopesets);
            $testcase->assertSame(
                'fake_oauth2scope:resource:read',
                $scopesets[0]->requiredscopes[0]->get_identifier(),
            );

            return $handler->handle($request);
        });
        $app->add(di::get(moodle_oauth2_scope_attribute_middleware::class));
        $app->addRoutingMiddleware();

        $app->handle(new ServerRequest('GET', '/method/path'));
    }

    /**
     * When a matched route has no scope requirements, the middleware sets an empty array of scope sets on the
     * request, rather than leaving the attribute unset.
     */
    public function test_route_without_scopeset_adds_empty_array(): void {
        $testcase = $this;

        $app = $this->get_simple_app();
        $app->get('/method/path', fn ($request, $response) => $response);
        $app->add(function ($request, $handler) use ($testcase) {
            $testcase->assertSame([], $request->getAttribute(scopeset::class));

            return $handler->handle($request);
        });
        $app->add(di::get(moodle_oauth2_scope_attribute_middleware::class));
        $app->addRoutingMiddleware();

        $app->handle(new ServerRequest('GET', '/method/path'));
    }

    /**
     * If no route was matched at all, Slim's routing middleware raises a 404 before this middleware is ever
     * invoked, so there is no scenario in which the middleware itself must handle a missing route.
     */
    public function test_no_matched_route_raises_not_found(): void {
        $app = $this->get_simple_app();
        $app->add(di::get(moodle_oauth2_scope_attribute_middleware::class));
        $app->addRoutingMiddleware();

        $this->expectException(\Slim\Exception\HttpNotFoundException::class);
        $app->handle(new ServerRequest('GET', '/no/such/path'));
    }
}
