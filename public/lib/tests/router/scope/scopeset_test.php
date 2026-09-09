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

use core\tests\fake_plugins_test_trait;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\RunInSeparateProcess;

/**
 * Tests for {@see scopeset}.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(scopeset::class)]
final class scopeset_test extends \advanced_testcase {
    use fake_plugins_test_trait;

    /**
     * Install the fake_oauth2scope fixture plugin used by these tests.
     */
    protected function add_mock(): void {
        $this->resetAfterTest();
        $this->add_full_mocked_plugintype(
            plugintype: 'fake',
            path: 'public/lib/tests/fixtures/fakeplugins/fake',
        );
    }

    /**
     * A scope set with a single required scope is satisfied only when that scope is granted.
     */
    #[RunInSeparateProcess]
    public function test_single_required_scope(): void {

        $this->add_mock();
        $scopeset = new scopeset(new \fake_oauth2scope\route\scope\resource\read());

        $this->assertTrue($scopeset->is_satisfied_by(['fake_oauth2scope:resource:read']));
        $this->assertTrue($scopeset->is_satisfied_by(['other:scope', 'fake_oauth2scope:resource:read']));
        $this->assertFalse($scopeset->is_satisfied_by([]));
        $this->assertFalse($scopeset->is_satisfied_by(['other:scope']));
    }

    /**
     * A scope set with more than one required scope behaves as an AND condition: all scopes must be granted.
     */
    #[RunInSeparateProcess]
    public function test_multiple_required_scopes_is_an_and_condition(): void {
        $this->add_mock();
        $scopeset = new scopeset(
            new \fake_oauth2scope\route\scope\resource\read(),
            new \fake_oauth2scope\route\scope\resource\write(),
        );

        $this->assertTrue($scopeset->is_satisfied_by([
            'fake_oauth2scope:resource:read',
            'fake_oauth2scope:resource:write',
        ]));

        // Only one of the two required scopes is granted.
        $this->assertFalse($scopeset->is_satisfied_by(['fake_oauth2scope:resource:read']));
        $this->assertFalse($scopeset->is_satisfied_by(['fake_oauth2scope:resource:write']));
        $this->assertFalse($scopeset->is_satisfied_by([]));
    }

    /**
     * The scopeset attribute may be repeated on a single method.
     */
    #[RunInSeparateProcess]
    public function test_attribute_is_repeatable(): void {
        $this->add_mock();
        $reflection = new \ReflectionClass(scopeset::class);
        $attributes = $reflection->getAttributes(\Attribute::class);

        $this->assertCount(1, $attributes);
        $flags = $attributes[0]->getArguments()[0];

        $this->assertEquals(\Attribute::TARGET_METHOD, $flags & \Attribute::TARGET_METHOD);
        $this->assertEquals(\Attribute::IS_REPEATABLE, $flags & \Attribute::IS_REPEATABLE);
    }

    /**
     *  It is not possible to add an empty scopeset.
     */
    public function test_empty_scopeset(): void {
        $this->expectException(\core\exception\coding_exception::class);

        $scopeset = new scopeset();
    }
}
