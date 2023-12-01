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

use core\router\route;
use GuzzleHttp\Psr7\Response;
use Psr\Http\Message\ResponseInterface;
use Slim\App;

/**
 * Tests for the route_controller trait.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers     \core\router\route_controller
 */
class route_controller_test extends \route_testcase {
    /**
     * Test that the redirect method works as expected.
     *
     * @covers ::redirect
     */
    public function test_redirect(): void {
        $helper = new class(\core\container::get_container()) {
            use route_controller;
            public function test(
                ResponseInterface $response,
                $url,
            ) {
                return $this->redirect($response, $url);
            }
        };

        $response = $helper->test(new Response(), '/test');
        $this->assertEquals(302, $response->getStatusCode());
        $this->assertEquals('/test', $response->getHeaderLine('Location'));
    }

    /**
     * Test that get_param works as expected.
     *
     * @covers \core\router\route_controller::get_param
     */
    public function test_get_param(): void {
        $request = (new \GuzzleHttp\Psr7\ServerRequest('GET', '/test'))
            ->withQueryParams(['test' => 'value']);

        $helper = new class(\core\container::get_container()) {
            use route_controller;
        };

        $rc = new \ReflectionClass($helper);
        $rcm = $rc->getMethod('get_param');

        // Test a value that exists.
        $result = $rcm->invokeArgs($helper, [$request, 'test', null]);
        $this->assertEquals('value', $result);

        $result = $rcm->invokeArgs($helper, [$request, 'test', 'Unused default']);
        $this->assertEquals('value', $result);

        // Test a value that does not existexists.
        $result = $rcm->invokeArgs($helper, [$request, 'fake', null]);
        $this->assertEquals(null, $result);
        $this->assertdebuggingcalledcount(1);

        $result = $rcm->invokeArgs($helper, [$request, 'fake', 'Used default']);
        $this->assertEquals('Used default', $result);
        $this->assertdebuggingcalledcount(1);
    }
}
