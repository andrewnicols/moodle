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

defined('MOODLE_INTERNAL') || die();

require_once(__DIR__.'/../../../ddl/sql_generator.php');

/**
 * Test SQL code generator class
 *
 * @package    core
 * @category   ddl
 * @copyright  2018 Catalyst IT
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class sql_generator extends \sql_generator {
    #[\Override]
    public function getResetSequenceSQL($table) {
        return [];
    }

    #[\Override]
    public function getCreateTempTableSQL($xmldbtable) {
        return [];
    }

    #[\Override]
    public function getTypeSQL($xmldbtype, $xmldblength = null, $xmldbdecimals = null) {
        return '';
    }

    #[\Override]
    function getCommentSQL($xmldbtable) {
        return [];
    }

    #[\Override]
    public function getCreateDefaultSQL($xmldbtable, $xmldbfield) {
        return [];
    }

    #[\Override]
    public function getDropDefaultSQL($xmldbtable, $xmldbfield) {
        return [];
    }

    #[\Override]
    public static function getReservedWords() {
        return [];
    }
}
