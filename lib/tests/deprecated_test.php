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

namespace core;

use deprecated_enum_fixture;

/**
 * Tests for \core\deprecated.
 *
 * @package    core
 * @category   test
 * @copyright  2024 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers \core\deprecated
 */
class deprecated_test extends \advanced_testcase {
    /**
     * @dataProvider emit_provider
     */
    public function test_emit(
        array $args,
        bool $expectdebugging,
        bool $expectexception,
    ): void {
        if ($expectexception) {
            $this->expectException(\coding_exception::class);
        }

        $attribute = new deprecated(
            'Test description',
            ...$args,
        );

        $attribute->emit_deprecation_notice();

        if ($expectdebugging) {
            $this->assertdebuggingcalledcount(1);
        }
    }

    public static function emit_provider(): array {
        return [
            [
                [
                    'final' => false,
                    'emit' => false,
                ],
                false,
                false,
            ],
            [
                [
                    'final' => false,
                    'emit' => true,
                ],
                true,
                false,
            ],
            [
                [
                    'final' => true,
                    'emit' => false,
                ],
                false,
                false,
            ],
            [
                [
                    'final' => true,
                    'emit' => true,
                ],
                false,
                true,
            ],
        ];
    }

    /**
     * @dataProvider get_deprecation_string_provider
     */
    public function test_get_deprecation_string(
        string $descriptor,
        ?string $since,
        ?string $reason,
        ?string $replacement,
        ?string $mdl,
        string $expected,
    ): void {
        $attribute = new deprecated(
            descriptor: $descriptor,
            since: $since,
            reason: $reason,
            replacement: $replacement,
            mdl: $mdl,
        );

        $this->assertEquals(
            $expected,
            $attribute->get_deprecation_string(),
        );

        $attribute->emit_deprecation_notice();
        $this->assertDebuggingCalled($expected);
    }

    public static function get_deprecation_string_provider(): array {
        return [
            [
                'Test description',
                null,
                null,
                null,
                null,
                'Deprecation: Test description has been deprecated.',
            ],
            [
                'Test description',
                '4.1',
                null,
                null,
                null,
                'Deprecation: Test description has been deprecated since 4.1.',
            ],
            [
                'Test description',
                null,
                'Test reason',
                null,
                null,
                'Deprecation: Test description has been deprecated. Test reason.',
            ],
            [
                'Test description',
                null,
                null,
                'Test replacement',
                null,
                'Deprecation: Test description has been deprecated. Use Test replacement instead.',
            ],
            [
                'Test description',
                null,
                null,
                null,
                'https://docs.moodle.org/311/en/Deprecated',
                'Deprecation: Test description has been deprecated. See https://docs.moodle.org/311/en/Deprecated for more information.',
            ],
            [
                'Test description',
                '4.1',
                'Test reason',
                'Test replacement',
                'https://docs.moodle.org/311/en/Deprecated',
                'Deprecation: Test description has been deprecated since 4.1. Test reason. Use Test replacement instead. See https://docs.moodle.org/311/en/Deprecated for more information.',
            ],
        ];
    }
}
