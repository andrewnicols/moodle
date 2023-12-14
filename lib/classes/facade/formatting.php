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

namespace core\facade;

/**
 * Text and string formatting for Moodle.
 *
 * @package core
 * @copyright 2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @method static string format_string(
 *    string $string,
 *    bool $striplinks = true,
 *    ?context $context = null,
 *    bool $filter = true,
 *    bool $escape = true,
 * )
 * 
 * @method static string format_text(
 *    ?string $text,
 *    string $format = FORMAT_MOODLE,
 *    ?context $context = null,
 *    bool $trusted = false,
 *    ?bool $clean = null,
 *    bool $filter = true,
 *    bool $para = true,
 *    bool $newlines = true,
 *    bool $overflowdiv = false,
 *    bool $blanktarget = false,
 *    bool $allowid = false,
 * )
 * 
 * @method static \core\formatting set_forceclean(bool $forceclean) Set the forceclean state
 * @method static bool get_forceclean() Get the forceclean state
 * @method static \core\formatting set_striptags(bool $striptags) Set the striptags state
 * @method static bool get_striptags() Get the striptags state
 * @method static bool get_filterall() Get the current filterall state
 * @method static \core\formatting set_filterall(bool $filterall) Set the current filterall state
 * 
 * @see \core\formatting
 */
class formatting extends \core\facade {
    public static function get_facade_accessor(): string {
        return \core\formatting::class;
    }
}
