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
 * Swagger UI for Moodle
 *
 * @package   core_admin
 * @copyright Andrew Lyons <andrew@nicols.co.uk>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require('../config.php');
require_once($CFG->libdir . '/adminlib.php');

$swaggerversion = '5.30.2';

$PAGE->set_url('/admin/swaggerui-oauth2.php');

admin_externalpage_setup('swaggerui');

echo $OUTPUT->header();

// These have to be manually added for now because they must be made cross-origin. The `js` method does not yet support this.
echo html_writer::tag(
    tagname: 'script',
    contents: '',
    attributes: [
        'src' => new moodle_url("https://unpkg.com/swagger-ui-dist@{$swaggerversion}/oauth2-redirect.js"),
        'crossorigin' => 'crossorigin',
    ],
);
echo $OUTPUT->footer();
