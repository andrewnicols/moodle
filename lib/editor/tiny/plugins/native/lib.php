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

/**
 * Native TinyMCE Plugin File loader.
 *
 * @package    tiny_native
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

function tiny_native_pluginfile(
    ?stdClass $course,
    ?stdClass $cm,
    \context $context,
    string $filearea,
    array $args,
    ?bool $forcedownload,
    ?array $sendfileoptions,
): void {
    $fs = get_file_storage();

    // This plugin uses args in the order:
    // jsrev/[pluginname]/[pluginname][.min].js
    // If ths jsrev is negative, then the file is not cached.

    [$jsrev, $pluginname, $filename] = $args;
    $file = $fs->get_file(
        $context->id,
        'tiny_native',
        'pluginfiles',
        0,
        "/{$pluginname}/",
        $filename,
    );

    $lifetime = $jsrev > 0 ? DAYSECS : 0;
    send_stored_file(
        $file,
        $lifetime,
        0,
        true,
    );
}
