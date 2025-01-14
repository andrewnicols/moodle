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
global $CFG;

$CFG = (object) [
    'admin' => 'admin',
    'dirroot' => dirname(__DIR__),
    'libdir' => dirname(__DIR__) . '/lib',
    'cachedir' => sys_get_temp_dir(),
];

require_once(__DIR__ . '/../lib/classes/component.php');
ini_set('include_path', $CFG->libdir . '/pear' . PATH_SEPARATOR . ini_get('include_path'));
\core\component::register_autoloader();

define('CACHE_DISABLE_ALL', false);
define('MOODLE_INTERNAL', true);

require_once($CFG->libdir . '/dmllib.php');
require_once($CFG->libdir . '/phpunit/lib.php');
