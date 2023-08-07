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
 * Display the course home page.
 *
 * @copyright 1999 Martin Dougiamas  http://dougiamas.com
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @package core_course
 */

use \core\router;

require_once('../config.php');

$name = optional_param('name', '', PARAM_TEXT);
$idnumber = optional_param('idnumber', '', PARAM_RAW);

$params = [];
if (!empty($name)) {
    router::redirect_to_callable(
        \core_course\route\view_controller::class . '::view_by_shortname',
        ['shortname' => $name],
    );
} else if (!empty($idnumber)) {
    router::redirect_to_callable(
        \core_course\route\view_controller::class . '::view_by_idnumber',
    );
}

router::redirect_to_callable(
    \core_course\route\view_controller::class . '::view_course',
);
