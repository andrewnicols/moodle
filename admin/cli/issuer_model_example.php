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
 * Demonstrate a typed issuer model and its separate database manager.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define('CLI_SCRIPT', true);

require(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/clilib.php');

use core\model\manager;
use core\oauth2\issuer_model;

[$options, $unrecognised] = cli_get_params([
    'help' => false,
    'save' => false,
], ['h' => 'help']);

if ($unrecognised) {
    cli_error('Unknown options: ' . implode(', ', $unrecognised));
}
if ($options['help']) {
    echo <<<'HELP'
Demonstrate the declared-property issuer model.

By default this only builds and validates an in-memory object. No database writes.

Options:
  --save         Insert a disabled demonstration issuer, then reload it.
                 This writes to oauth2_issuer; use only on a development site.
  -h, --help     Show this help.

Examples:
  php admin/cli/issuer_model_example.php
  php admin/cli/issuer_model_example.php --save

HELP;
    exit(0);
}

$issuer = new issuer_model();
$issuer->name = ' Demonstration issuer ';
$issuer->baseurl = 'https://example.invalid/';
$issuer->clientid = 'demonstration-client';
$issuer->enabled = false;
$issuer->image = null;
$issuer->systememail = 'oauth@example.invalid';

if ($issuer->name !== 'Demonstration issuer' || $issuer->validate() !== true) {
    cli_error('The model failed hook or field validation.');
}
cli_writeln('Normalised name: ' . $issuer->name);
cli_writeln('Cleaned base URL: ' . $issuer->get('baseurl'));
cli_writeln('Enabled: ' . ($issuer->enabled ? 'yes' : 'no'));

if (!$options['save']) {
    cli_writeln('Validated in memory. No database writes; use --help for the optional persistence example.');
    exit(0);
}
if ($DB->record_exists('oauth2_issuer', ['name' => $issuer->name])) {
    cli_error('A demonstration issuer already exists.');
}

$issuer->sortorder = $DB->count_records('oauth2_issuer');
$manager = new manager($DB);
$manager->save($issuer, (int) $USER->id);
$loaded = $manager->get(issuer_model::class, $issuer->get('id'));

cli_writeln('Saved issuer ID: ' . $loaded->get('id'));
cli_writeln('Reloaded name: ' . $loaded->name);
cli_writeln('Reloaded base URL: ' . $loaded->get('baseurl'));
