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

namespace core\tests\router;

use core\tests\fake_plugins_test_trait;
use PHPUnit\Framework\AssertionFailedError;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\RunInSeparateProcess;

/**
 * Tests for the scope-related assertion helpers in {@see route_testcase}.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(route_testcase::class)]
final class route_testcase_test extends route_testcase {
    use fake_plugins_test_trait;

    /**
     * Install the fake_oauth2scope fixture plugin used by the scope fixtures below.
     */
    protected function add_fake_oauth2scope_plugin(): void {
        $this->resetAfterTest();
        $this->add_full_mocked_plugintype(
            plugintype: 'fake',
            path: 'public/lib/tests/fixtures/fakeplugins/fake',
        );
    }

    /**
     * assert_route_is_unscoped() passes for a method marked with #[unscoped_resource].
     */
    public function test_assert_route_is_unscoped_passes_for_unscoped_method(): void {
        self::load_fixture('core', 'router/route_with_scopes.php');

        $this->assert_route_is_unscoped(
            [\core\fixtures\route_with_scopes::class, 'method_with_unscoped_resource'],
        );
    }

    /**
     * assert_route_is_unscoped() fails for a method which requires a scope.
     */
    #[RunInSeparateProcess]
    public function test_assert_route_is_unscoped_fails_for_scoped_method(): void {
        $this->add_fake_oauth2scope_plugin();
        self::load_fixture('core', 'router/route_with_scopes.php');

        $this->expectException(AssertionFailedError::class);
        $this->assert_route_is_unscoped(
            [\core\fixtures\route_with_scopes::class, 'method_with_single_scopeset'],
        );
    }

    /**
     * assert_route_is_unscoped() fails for a method with no scope attributes at all, since this is not the
     * same as an explicit #[unscoped_resource] declaration.
     */
    public function test_assert_route_is_unscoped_fails_for_method_with_no_attributes(): void {
        self::load_fixture('core', 'router/route_with_scopes.php');

        $this->expectException(AssertionFailedError::class);
        $this->assert_route_is_unscoped(
            [\core\fixtures\route_with_scopes::class, 'method_with_no_scope_attributes'],
        );
    }

    /**
     * assert_route_is_scoped() passes for a method with at least one #[scopeset] attribute.
     */
    #[RunInSeparateProcess]
    public function test_assert_route_is_scoped_passes_for_scoped_method(): void {
        $this->add_fake_oauth2scope_plugin();
        self::load_fixture('core', 'router/route_with_scopes.php');

        $this->assert_route_is_scoped(
            [\core\fixtures\route_with_scopes::class, 'method_with_single_scopeset'],
        );
    }

    /**
     * assert_route_is_scoped() passes even where the required scope cannot be resolved (for example,
     * because it targets a scope which does not exist in this version of Moodle) since it only checks that
     * a scope decision was made, not what that decision resolves to.
     */
    #[RunInSeparateProcess]
    public function test_assert_route_is_scoped_passes_for_unresolvable_scope(): void {
        $this->add_fake_oauth2scope_plugin();
        self::load_fixture('core', 'router/route_with_scopes.php');

        $this->assert_route_is_scoped(
            [\core\fixtures\route_with_scopes::class, 'method_with_invalid_scope'],
        );
    }

    /**
     * assert_route_is_scoped() fails for an unscoped method.
     */
    public function test_assert_route_is_scoped_fails_for_unscoped_method(): void {
        self::load_fixture('core', 'router/route_with_scopes.php');

        $this->assert_route_is_scoped(
            [\core\fixtures\route_with_scopes::class, 'method_with_unscoped_resource'],
        );
    }

    /**
     * assert_route_is_scoped() fails for an unscoped method.
     */
    public function test_assert_route_is_scoped_fails_for_method_with_no_scope_definition(): void {
        self::load_fixture('core', 'router/route_with_scopes.php');

        $this->expectException(AssertionFailedError::class);
        $this->assert_route_is_scoped(
            [\core\fixtures\route_with_scopes::class, 'method_with_no_scope_definition'],
        );
    }

    /**
     * assert_route_required_scopes() matches a method with a single scope set.
     */
    #[RunInSeparateProcess]
    public function test_assert_route_required_scopes_matches_single_scopeset(): void {
        $this->add_fake_oauth2scope_plugin();
        self::load_fixture('core', 'router/route_with_scopes.php');

        $this->assert_route_required_scopes(
            [['fake_oauth2scope:resource:read']],
            [\core\fixtures\route_with_scopes::class, 'method_with_single_scopeset'],
        );
    }

    /**
     * assert_route_required_scopes() matches a method with multiple (OR) scope sets, in declaration order,
     * silently ignoring any scope set which can never be satisfied because it targets a scope that cannot be
     * resolved in this version of Moodle (for example, one which a plugin has declared in anticipation of a
     * scope only present in a different Moodle version). The fixture used here declares three scope sets:
     * two real ones, and one referencing a scope class which does not exist; only the two real ones are
     * expected here, regardless of whether the third scope happens to exist.
     */
    #[RunInSeparateProcess]
    public function test_assert_route_required_scopes_matches_multiple_scopesets(): void {
        $this->add_fake_oauth2scope_plugin();
        self::load_fixture('core', 'router/route_with_scopes.php');

        $this->assert_route_required_scopes(
            [
                ['fake_oauth2scope:resource:read'],
                ['fake_oauth2scope:resource:write'],
            ],
            [\core\fixtures\route_with_scopes::class, 'method_with_multiple_scopesets'],
        );
    }

    /**
     * assert_route_required_scopes() fails when the expected identifiers do not match those required.
     */
    #[RunInSeparateProcess]
    public function test_assert_route_required_scopes_fails_on_mismatch(): void {
        $this->add_fake_oauth2scope_plugin();
        self::load_fixture('core', 'router/route_with_scopes.php');

        $this->expectException(AssertionFailedError::class);
        $this->assert_route_required_scopes(
            [['fake_oauth2scope:resource:write']],
            [\core\fixtures\route_with_scopes::class, 'method_with_single_scopeset'],
        );
    }

    /**
     * A route whose only scope set(s) can never be satisfied (because every one of them targets a scope
     * which cannot be resolved in this version of Moodle) has no satisfiable required scopes at all, once
     * those unresolvable scope sets have been filtered out.
     */
    #[RunInSeparateProcess]
    public function test_assert_route_required_scopes_ignores_wholly_unresolvable_scopesets(): void {
        $this->add_fake_oauth2scope_plugin();
        self::load_fixture('core', 'router/route_with_scopes.php');

        $this->assert_route_required_scopes(
            [],
            [\core\fixtures\route_with_scopes::class, 'method_with_invalid_scope'],
        );
    }
}
