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
use PHPUnit\Framework\Attributes\DataProvider;

/**
 * Tests for {@see name_attribute}.
 *
 * @package    core
 * @copyright  2026 Mihail Geshoski <mihailgesoski@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(name_attribute::class)]
final class name_attribute_test extends \advanced_testcase {
    /**
     * Test name_attribute construction and get_name() with valid scope names.
     *
     * @param string $inputname The raw input scope name.
     * @param string|null $expectedname The expected scope name.
     * @param string|null $expectedexception The expected exception message, if any.
     */
    #[DataProvider('scope_names_provider')]
    public function test_scope_name_construction(string $inputname, ?string $expectedname, ?string $expectedexception): void {
        if ($expectedexception !== null) {
            $this->expectException(\coding_exception::class);
            $this->expectExceptionMessage($expectedexception);
        }

        $attribute = new name_attribute($inputname);

        $this->assertSame($expectedname, $attribute->get_name());
    }

    /**
     * Data provider for valid scope names.
     *
     * @return array
     */
    public static function scope_names_provider(): array {
        return [
            'valid scope name (simple lowercase)' => [
                'profile',
                'profile',
                null,
            ],
            'valid scope name (lowercase with underscore)' => [
                'user_read',
                'user_read',
                null,
            ],
            'valid scope name (lowercase with numbers)' => [
                'write_123',
                'write_123',
                null,
            ],
            'valid scope name (starts with letter, followed by number)' => [
                'a1_b2',
                'a1_b2',
                null,
            ],
            'invalid scope name (empty string)' => [
                '',
                null,
                'OAuth2 scope name cannot be empty.',
            ],
            'invalid scope name (only spaces)' => [
                '   ',
                null,
                'OAuth2 scope name cannot be empty.'
            ],
            'invalid scope name (starts with underscore)' => [
                '_profile',
                null,
                "Invalid OAuth2 scope name '_profile'. Scope names must start with a letter and consist of lowercase " .
                "letters, numbers, and underscores.",
            ],
            'invalid scope name (starts with number)' => [
                '1profile',
                null,
                "Invalid OAuth2 scope name '1profile'. Scope names must start with a letter and consist of lowercase " .
                "letters, numbers, and underscores.",
            ],
            'invalid scope name (contains uppercase)' => [
                'Profile',
                null,
                "Invalid OAuth2 scope name 'Profile'. Scope names must start with a letter and consist of lowercase " .
                "letters, numbers, and underscores.",
            ],
            'invalid scope name (contains hyphen)' => [
                'profile-scope',
                null,
                "Invalid OAuth2 scope name 'profile-scope'. Scope names must start with a letter and consist of lowercase " .
                "letters, numbers, and underscores.",
            ],
            'invalid scope name (contains spaces inside)' => [
                'profile scope',
                null,
                "Invalid OAuth2 scope name 'profile scope'. Scope names must start with a letter and consist of lowercase " .
                "letters, numbers, and underscores.",
            ],
            'invalid scope name (contains special characters)' => [
                'profile$',
                null,
                "Invalid OAuth2 scope name 'profile$'. Scope names must start with a letter and consist of lowercase " .
                "letters, numbers, and underscores.",
            ],
        ];
    }
}
