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
 * This library contains all the Data Manipulation Language (DML) functions
 * used to interact with the DB
 *
 * This library contains all the Data Manipulation Language (DML) functions
 * used to interact with the DB. All the dunctions in this library must be
 * generic and work against the major number of RDBMS possible. This is the
 * list of currently supported and tested DBs: mysql, postresql, and mssql.
 *
 * This library is automatically included by Moodle core so you never need to
 * include it yourself.
 *
 * For more info about the functions available in this library, please visit:
 *     http://docs.moodle.org/en/DML_functions
 * (feel free to modify, improve and document such page, thanks!)
 *
 * @package    core
 * @category   dml
 * @subpackage dml
 * @copyright  2008 Petr Skoda (http://skodak.org)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
