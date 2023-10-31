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
 * Routing support for Moodle.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// phpcs:disable moodle.Files.MoodleInternal.MoodleInternalGlobalState

// Load the bootstrap and perform the bare early setup.
// This just sets up the autoloaders, basic configuration, and so on.
define('ABORT_AFTER_CONFIG', true);
require_once('config.php');

// Moodle is not guaranteed to exist at the domain root.
// Strip out the current script.
$scriptroot = parse_url($CFG->wwwroot, PHP_URL_PATH);
$relativeroot = sprintf(
    '%s%s',
    $scriptroot,
    str_replace(
        realpath($CFG->dirroot),
        '',
        realpath($_SERVER['SCRIPT_FILENAME']),
    ),
);

// The server is not configured to rewrite unknown requests to automatically use the router.
if (str_starts_with($_SERVER['REQUEST_URI'], $relativeroot)) {
    $scriptroot .= '/r.php';
}

$router = new \core\router(
    basepath: $scriptroot,
);

$router->serve();
