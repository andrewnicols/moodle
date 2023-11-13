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

namespace core_user\route\api;

use GuzzleHttp\Psr7\Response;

/**
 * Tests for user preference API handler.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers \core_user\route\api\preferences
 */
class preferences_test extends \route_testcase {

    /**
     * @dataProvider thous
     */
    public function test_preferences_returned(): void {
        $this->resetAfterTest();

        $this->setAdminUser();
        set_user_preference('testpreference', 'testvalue');

        $app = $this->get_app();
        $response = $app->handle($this->create_request('GET', '/core_user/preferences'));

        $this->assert_valid_response($response);

        $payload = $this->decode_response($response);

        $this->assertObjectHasAttribute('testpreference', $payload);
        $this->assertEquals('testvalue', $payload->testpreference);
        print_r($payload);
    }

    public static function thous(): array{
        return array_fill(0, 1000, []);
    }
}
