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

use core\formatting;
use core\param;
use core\router\route;
use core\router\schema\parameters\query_parameter;
use core\router\schema\text_formatting;
use core\text_formatting_options;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Tests request-scoped text formatting preferences.
 *
 * @package core
 * @copyright 2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(text_formatting_middleware::class)]
final class text_formatting_middleware_test extends \advanced_testcase {
    public function test_reserved_parameter_collision(): void {
        $route = new route(path: '/test', queryparams: [
            new query_parameter(name: 'textMode', type: param::ALPHA),
        ]);
        $this->expectException(\core\exception\coding_exception::class);
        $this->expectExceptionMessage('Reserved API query parameters: textMode');
        text_formatting::get_api_query_parameters($route);
    }

    public function test_request_does_not_inherit_preferences(): void {
        $formatter = new formatting();
        $previous = new text_formatting_options(raw: true);
        $formatter->set_external_options($previous);
        $middleware = new text_formatting_middleware($formatter);
        $request = (new ServerRequest('GET', '/test'))->withAttribute(route::class, new route(path: '/test'));
        $handler = $this->createMock(RequestHandlerInterface::class);
        $handler->method('handle')->willReturnCallback(function () use ($formatter): Response {
            $this->assertFalse($formatter->get_external_options()->raw);
            return new Response();
        });

        $this->assertSame(200, $middleware->process($request, $handler)->getStatusCode());
        $this->assertSame($previous, $formatter->get_external_options());
    }

    public function test_restores_preferences_after_exception(): void {
        $formatter = new formatting();
        $previous = new text_formatting_options(raw: false, filter: false);
        $formatter->set_external_options($previous);
        $middleware = new text_formatting_middleware($formatter);
        $route = new route(path: '/test');
        $request = (new ServerRequest('GET', '/test'))
            ->withAttribute(route::class, $route)
            ->withQueryParams(['textMode' => 'raw']);
        $handler = $this->createMock(RequestHandlerInterface::class);
        $handler->method('handle')->willReturnCallback(function () use ($formatter): void {
            $this->assertTrue($formatter->get_external_options()->raw);
            throw new \RuntimeException('Test exception');
        });

        try {
            $middleware->process($request, $handler);
            $this->fail('The exception should have propagated.');
        } catch (\RuntimeException $exception) {
            $this->assertSame('Test exception', $exception->getMessage());
        }
        $this->assertSame($previous, $formatter->get_external_options());
    }
}
