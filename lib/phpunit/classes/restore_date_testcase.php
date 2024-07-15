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
 * Restore dates test case.
 *
 * @package    core
 * @category   test
 * @copyright  2017 onwards Ankit Agarwal
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// TODO MDL-82394: Add debugging information about this replacement in Moodle 6.0.
// This file cannot emit before this point because it will cause test failures in stable Moodle versions for community plugins.
// This file will be removed in Moodle 7.0.
class_alias(\core_backup\tests\restore_date_testcase::class, \restore_date_testcase::class);
