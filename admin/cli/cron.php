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
 * CLI cron
 *
 * This script looks through all the module directories for cron.php files
 * and runs them.  These files can contain cleanup functions, email functions
 * or anything that needs to be run on a regular basis.
 *
 * @package    core
 * @subpackage cli
 * @copyright  2009 Petr Skoda (http://skodak.org)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define('CLI_SCRIPT', true);

require(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/clilib.php');

// Now get cli option.
[$options, $unrecognized] = cli_get_params(
    [
        'help' => false,
        'stop' => false,
        'list' => false,
        'force' => false,
        'enable' => false,
        'disable' => false,
        'disable-wait' => false,
        'keep-alive' => null,
    ],
    [
        'h' => 'help',
        's' => 'stop',
        'l' => 'list',
        'f' => 'force',
        'e' => 'enable',
        'd' => 'disable',
        'w' => 'disable-wait',
        'k' => 'keep-alive',
    ]
);

if ($unrecognized) {
    $unrecognized = implode("\n  ", $unrecognized);
    cli_error(get_string('cliunknowoption', 'admin', $unrecognized));
}

$args = [];

// In this case all options here match the options in the new command.
foreach ($options as $key => $value) {
    if ($value === true) {
        $args["--{$key}"] = null; // Boolean options.
    } else if ($value !== false) {
        $args["--{$key}"] = $value; // Options with values.
    }
}

// TODO: Add a deprecation notice for this script.
\core\di::get(\core\cli\application::class)->run(
    \core\cli\application::get_input_for_command('admin:cron', $args),
);
