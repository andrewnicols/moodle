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

namespace core_admin\route\api\oauth2\server;

use core\tests\router\route_testcase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;

/**
 * Tests for the OAuth2 server clients API scope declarations.
 *
 * @package    core_admin
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(clients::class)]
final class clients_test extends route_testcase {
    /**
     * Managing OAuth2 clients (revoking, reactivating, or deleting) is a sensitive administrative action
     * which requires both the read and write config scopes.
     *
     * @param string $method
     */
    #[DataProvider('required_scopes_provider')]
    public function test_required_scopes(string $method): void {
        $this->assert_route_required_scopes(
            [['core_admin:config:read', 'core_admin:config:write']],
            [clients::class, $method],
        );
    }

    /**
     * Data provider for test_required_scopes.
     *
     * @return array
     */
    public static function required_scopes_provider(): array {
        return [
            'revoke_client' => ['revoke_client'],
            'reactivate_client' => ['reactivate_client'],
            'delete_client' => ['delete_client'],
        ];
    }
}
