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
 * A facade for the core\facade\formatting class
 *
 * @package core
 * @copyright http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @author Moodle Pty Ltd <moodlebot@moodle.com>
 * @see \core\formatting
 * @method static string format_string(null|string $string, bool $striplinks = true, null|\core\context $context = null, bool $filter
 * = true, bool $escape = true) Given a simple string, this function returns the string
 * processed by enabled string filters if $CFG->filterall is enabled
 * @method static string format_text(null|string $text, string $format = \FORMAT_MOODLE, null|\core\context $context = null, bool
 * $trusted = false, null|bool $clean = null, bool $filter = true, bool $para = true, bool $newlines = true, bool $overflowdiv =
 * false, bool $blanktarget = false, bool $allowid = false) Given text in a variety of format codings, this function returns the text
 * as safe HTML.
 * @method static self set_forceclean(bool $forceclean) Set the value of the forceclean setting.
 * @method static bool get_forceclean() Get the current forceclean value.
 * @method static self set_striptags(bool $striptags) Set the value of the striptags setting.
 * @method static bool get_striptags() Get the current striptags value.
 * @method static self set_filterall(bool $filterall) Set the value of the filterall setting.
 * @method static bool get_filterall() Get the current filterall value.
 */
class formatting extends \core\facade {
    public static function get_facade_accessor(): string {
        return \core\formatting::class;
    }
}
