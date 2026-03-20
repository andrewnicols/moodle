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

namespace core_user\route\controller;

use core\tests\router\route_testcase;
use PHPUnit\Framework\Attributes\CoversClass;

/**
 * Tests for the user dashboard page controller.
 *
 * @package     core_user
 * @copyright   2026 Moodle Pty Ltd
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(dashboard::class)]
final class dashboard_test extends route_testcase {

    public function test_view_dashboard(): void {
        $this->resetAfterTest();
        $this->setAdminUser();
        $this->add_class_routes_to_route_loader(dashboard::class);

        $response = $this->process_api_request('GET', '/dashboard');

        $this->assert_valid_response($response);
    }

    public function test_view_dashboard_requires_login(): void {
        $this->resetAfterTest();
        $this->add_class_routes_to_route_loader(dashboard::class);

        $response = $this->process_api_request('GET', '/dashboard');

        $this->assert_exception_response($response, 401);
    }
}
