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
 * TODO describe file database_for_testing
 *
 * @package    core
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
/**
 * This class is not a proper subclass of moodle_database. It is
 * intended to be used only in unit tests, in order to gain access to the
 * protected methods of moodle_database, and unit test them.
 */
class database_for_testing extends \core\dml\database {
    protected $prefix = 'mdl_';

    public function public_fix_table_names($sql) {
        return $this->fix_table_names($sql);
    }

    public function driver_installed() {}
    public function get_dbfamily() {}
    protected function get_dbtype() {}
    protected function get_dblibrary() {}
    public function get_name() {}
    public function get_configuration_help() {}
    public function connect($dbhost, $dbuser, $dbpass, $dbname, $prefix, ?array $dboptions=null) {}
    public function get_server_info() {}
    protected function allowed_param_types() {}
    public function get_last_error() {}
    public function get_tables($usecache=true) {}
    public function get_indexes($table) {}
    protected function fetch_columns(string $table): array {
        return [];
    }
    protected function normalise_value($column, $value) {}
    public function set_debug($state) {}
    public function get_debug() {}
    public function change_database_structure($sql, $tablenames = null) {}
    public function execute($sql, ?array $params=null) {}
    public function get_recordset_sql($sql, ?array $params=null, $limitfrom=0, $limitnum=0) {}
    public function get_records_sql($sql, ?array $params=null, $limitfrom=0, $limitnum=0) {}
    public function get_fieldset_sql($sql, ?array $params=null) {}
    public function insert_record_raw($table, $params, $returnid=true, $bulk=false, $customsequence=false) {}
    public function insert_record($table, $dataobject, $returnid=true, $bulk=false) {}
    public function import_record($table, $dataobject) {}
    public function update_record_raw($table, $params, $bulk=false) {}
    public function update_record($table, $dataobject, $bulk=false) {}
    public function set_field_select($table, $newfield, $newvalue, $select, ?array $params=null) {}
    public function delete_records_select($table, $select, ?array $params=null) {}
    public function sql_concat(...$arr) {}
    public function sql_concat_join($separator="' '", $elements=array()) {}
    public function sql_group_concat(string $field, string $separator = ', ', string $sort = ''): string {
        return '';
    }
    public function sql_substr($expr, $start, $length=false) {}
    public function begin_transaction() {}
    public function commit_transaction() {}
    public function rollback_transaction() {}
}
