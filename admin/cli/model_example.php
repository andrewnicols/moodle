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
 * Demonstrate a typed, attributed model and its separate database manager.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define('CLI_SCRIPT', true);

require(__DIR__ . '/../../config.php');
require_once($CFG->libdir . '/clilib.php');

use core\model\manager;
use core\oauth2\endpoint_model;

[$options, $unrecognised] = cli_get_params([
    'help' => false,
    'save' => false,
    'issuerid' => 1,
], ['h' => 'help']);

if ($unrecognised) {
    cli_error('Unknown options: ' . implode(', ', $unrecognised));
}
if ($options['help']) {
    echo <<<'HELP'
Demonstrate the declared-property endpoint model.

By default this only builds and validates an in-memory object. No database writes.

Options:
  --issuerid=N   Issuer ID (default: 1).
  --save         Insert a demonstration endpoint for an existing issuer, then reload it.
                 This writes to oauth2_endpoint; use only on a development site.
  -h, --help     Show this help.

Examples:
  php admin/cli/model_example.php
  php admin/cli/model_example.php --save --issuerid=123

HELP;
    exit(0);
}
$issuerid = filter_var($options['issuerid'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
if ($issuerid === false || is_bool($options['issuerid'])) {
    cli_error('--issuerid must be a positive integer.');
}

$endpoint = new endpoint_model();
$endpoint->issuerid = $issuerid;
$endpoint->name = ' demonstration_endpoint ';
$endpoint->url = 'https://example.invalid/authorize';

if ($endpoint->name !== 'demonstration_endpoint' || $endpoint->validate() !== true) {
    cli_error('The model failed hook or field validation.');
}
cli_writeln('Normalised name: ' . $endpoint->name);
cli_writeln('Cleaned URL: ' . $endpoint->get('url'));

if (!$options['save']) {
    cli_writeln('Validated in memory. No database writes; use --help for the optional persistence example.');
    exit(0);
}
if (!$DB->record_exists('oauth2_issuer', ['id' => $issuerid])) {
    cli_error('The supplied issuer does not exist.');
}
if ($DB->record_exists('oauth2_endpoint', ['issuerid' => $issuerid, 'name' => $endpoint->name])) {
    cli_error('A demonstration endpoint already exists for this issuer.');
}

$manager = new manager($DB);
$manager->save($endpoint, (int) $USER->id);
$loaded = $manager->get(endpoint_model::class, $endpoint->get('id'));

cli_writeln('Saved endpoint ID: ' . $loaded->get('id'));
cli_writeln('Reloaded URL: ' . $loaded->get('url'));
