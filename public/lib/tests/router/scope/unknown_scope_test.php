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

namespace core\router\scope;

use PHPUnit\Framework\Attributes\CoversClass;

/**
 * Tests for {@see unknown_scope}.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(unknown_scope::class)]
final class unknown_scope_test extends \advanced_testcase {
    /**
     * The unknown_scope must extend the abstract_scope base class so that it can be used
     * anywhere a scope is expected.
     */
    public function test_extends_abstract_scope(): void {
        $this->assertInstanceOf(abstract_scope::class, new unknown_scope());
    }

    /**
     * An unknown_scope has no #[identifier_attribute], so it can never be satisfied.
     *
     * This is intentional fail-safe behaviour: a scope set containing an unknown_scope
     * (for example, one used to replace a scope which no longer exists) can never be granted.
     */
    public function test_is_never_satisfied(): void {
        $scope = new unknown_scope();

        $this->expectException(\coding_exception::class);
        $this->expectExceptionMessage(
            'The class core\router\scope\unknown_scope must have an #[identifier_attribute] attribute.',
        );
        $scope->is_satisfied_by([]);
    }
}
