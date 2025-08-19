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

namespace core\tests\dml;

/**
 * Test class for testing temptables
 *
 * @copyright  2017 John Okely
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class temptables_tester {
    /**
     * Returns if one table, based in the information present in the store, is a temp table
     *
     * For easy testing, anything with the word 'temp' in it is considered temporary.
     *
     * @param string $tablename name without prefix of the table we are asking about
     * @return bool true if the table is a temp table (based in the store info), false if not
     */
    public function is_temptable($tablename) {
        if (strpos($tablename, 'temp') === false) {
            return false;
        } else {
            return true;
        }
    }
    /**
     * Dispose the temptables
     *
     * @return void
     */
    public function dispose() {
    }
}
