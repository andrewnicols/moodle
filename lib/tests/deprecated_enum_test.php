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
 * Tests for \core\deprecated_enum covering \core\deprecated.
 *
 * @package    core
 * @category   test
 * @copyright  2024 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers \core\deprecated_enum
 * @covers \core\deprecated
 */
class deprecated_enum_test extends \advanced_testcase {
    public static function setUpBeforeClass(): void {
        require_once(dirname(__FILE__) . '/fixtures/deprecated_enum_fixture.php');
    }

    /**
     * @dataProvider emit_provider
     */
    public function test_emit(
        deprecated_enum_fixture $enum,
        bool $expectdebugging,
        bool $expectexception,
    ): void {
        if ($expectexception) {
            $this->expectException(\coding_exception::class);
        }

        $re = new \ReflectionEnum($enum);
        $rem = $re->getMethod('emit_deprecation_notice');
        $rem->invoke($enum);

        if ($expectdebugging) {
            $this->assertdebuggingcalledcount(1);
        }
    }

    public static function emit_provider(): array {
        require_once(dirname(__FILE__) . '/fixtures/deprecated_enum_fixture.php');
        return [
            [deprecated_enum_fixture::NOT_DEPRECATED, false, false],
            [deprecated_enum_fixture::DEPRECATED_NOT_FINAL_NOT_EMIT, false, false],
            [deprecated_enum_fixture::DEPRECATED_DEFAULT, true, false],
            [deprecated_enum_fixture::DEPRECATED_NOT_FINAL_EMIT, true, false],
            [deprecated_enum_fixture::DEPRECATED_FINAL_NOT_EMIT, false, false],
            [deprecated_enum_fixture::DEPRECATED_FINAL_EMIT, false, true],
        ];
    }
}
