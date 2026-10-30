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

namespace core\dml;

/**
 * A proxy for the global moodle_database instance.
 *
 * The global $DB may be null when a dependency is resolved, and may later be replaced (for example during
 * setup, or in unit tests). This proxy defers to whatever $DB currently holds on every call, so it is safe to
 * inject and retain.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class database_proxy extends \moodle_database {
    /**
     * Note: Intentionally does not call the parent constructor, as this class holds no connection state.
     */
    public function __construct() {
    }

    /**
     * The proxy owns no resources, and must never dispose of the real database.
     */
    #[\Override]
    public function __destruct() {
    }

    /**
     * Get the current real database instance.
     *
     * @return \moodle_database
     * @throws \coding_exception If the database has not yet been initialised.
     */
    protected function get_database(): \moodle_database {
        global $DB;

        if (!$DB instanceof \moodle_database) {
            throw new \coding_exception('The database has not been initialised yet.');
        }

        return $DB;
    }

    #[\Override]
    public function driver_installed() {
        return $this->get_database()->driver_installed();
    }

    #[\Override]
    public function get_prefix() {
        return $this->get_database()->get_prefix();
    }

    #[\Override]
    public function get_dbvendor() {
        return $this->get_database()->get_dbvendor();
    }

    #[\Override]
    public function get_dbfamily() {
        return $this->get_database()->get_dbfamily();
    }

    #[\Override]
    protected function get_dbtype() {
        return $this->get_database()->get_dbtype();
    }

    #[\Override]
    protected function get_dblibrary() {
        return $this->get_database()->get_dblibrary();
    }

    #[\Override]
    public function get_name() {
        return $this->get_database()->get_name();
    }

    #[\Override]
    public function get_configuration_help() {
        return $this->get_database()->get_configuration_help();
    }

    #[\Override]
    public function get_configuration_hints() {
        return $this->get_database()->get_configuration_hints();
    }

    #[\Override]
    public function export_dbconfig() {
        return $this->get_database()->export_dbconfig();
    }

    #[\Override]
    public function diagnose() {
        return $this->get_database()->diagnose();
    }

    #[\Override]
    public function connect($dbhost, $dbuser, $dbpass, $dbname, $prefix, ?array $dboptions = null) {
        return $this->get_database()->connect($dbhost, $dbuser, $dbpass, $dbname, $prefix, $dboptions);
    }

    #[\Override]
    public function create_database($dbhost, $dbuser, $dbpass, $dbname, ?array $dboptions = null) {
        return $this->get_database()->create_database($dbhost, $dbuser, $dbpass, $dbname, $dboptions);
    }

    #[\Override]
    public function get_transaction_start_backtrace() {
        return $this->get_database()->get_transaction_start_backtrace();
    }

    #[\Override]
    public function dispose() {
        return $this->get_database()->dispose();
    }

    #[\Override]
    public function query_log($error = false) {
        return $this->get_database()->query_log($error);
    }

    #[\Override]
    public function get_server_info() {
        return $this->get_database()->get_server_info();
    }

    #[\Override]
    protected function allowed_param_types() {
        return $this->get_database()->allowed_param_types();
    }

    #[\Override]
    public function get_last_error() {
        return $this->get_database()->get_last_error();
    }

    #[\Override]
    public function get_in_or_equal($items, $type = SQL_PARAMS_QM, $prefix = 'param', $equal = true, $onemptyitems = false) {
        return $this->get_database()->get_in_or_equal($items, $type, $prefix, $equal, $onemptyitems);
    }

    #[\Override]
    public function fix_sql_params($sql, ?array $params = null) {
        return $this->get_database()->fix_sql_params($sql, $params);
    }

    #[\Override]
    public function get_tables($usecache = true) {
        return $this->get_database()->get_tables($usecache);
    }

    #[\Override]
    public function get_indexes($table) {
        return $this->get_database()->get_indexes($table);
    }

    #[\Override]
    public function get_columns($table, $usecache = true): array {
        return $this->get_database()->get_columns($table, $usecache);
    }

    #[\Override]
    protected function fetch_columns(string $table): array {
        return $this->get_database()->fetch_columns($table);
    }

    #[\Override]
    protected function normalise_value($column, $value) {
        return $this->get_database()->normalise_value($column, $value);
    }

    #[\Override]
    public function reset_caches($tablenames = null) {
        return $this->get_database()->reset_caches($tablenames);
    }

    #[\Override]
    public function get_manager() {
        return $this->get_database()->get_manager();
    }

    #[\Override]
    public function change_db_encoding() {
        return $this->get_database()->change_db_encoding();
    }

    #[\Override]
    public function setup_is_unicodedb() {
        return $this->get_database()->setup_is_unicodedb();
    }

    #[\Override]
    public function set_debug($state) {
        return $this->get_database()->set_debug($state);
    }

    #[\Override]
    public function get_debug() {
        return $this->get_database()->get_debug();
    }

    #[\Override]
    public function change_database_structure($sql, $tablenames = null) {
        return $this->get_database()->change_database_structure($sql, $tablenames);
    }

    #[\Override]
    public function execute($sql, ?array $params = null) {
        return $this->get_database()->execute($sql, $params);
    }

    #[\Override]
    public function get_recordset($table, ?array $conditions = null, $sort = '', $fields = '*', $limitfrom = 0, $limitnum = 0) {
        return $this->get_database()->get_recordset($table, $conditions, $sort, $fields, $limitfrom, $limitnum);
    }

    #[\Override]
    public function get_recordset_list($table, $field, array $values, $sort = '', $fields = '*', $limitfrom = 0, $limitnum = 0) {
        return $this->get_database()->get_recordset_list($table, $field, $values, $sort, $fields, $limitfrom, $limitnum);
    }

    #[\Override]
    public function get_recordset_select($table, $select, ?array $params = null, $sort = '', $fields = '*', $limitfrom = 0, $limitnum = 0) {
        return $this->get_database()->get_recordset_select($table, $select, $params, $sort, $fields, $limitfrom, $limitnum);
    }

    #[\Override]
    public function get_recordset_sql($sql, ?array $params = null, $limitfrom = 0, $limitnum = 0) {
        return $this->get_database()->get_recordset_sql($sql, $params, $limitfrom, $limitnum);
    }

    #[\Override]
    public function export_table_recordset($table) {
        return $this->get_database()->export_table_recordset($table);
    }

    #[\Override]
    public function get_records($table, ?array $conditions = null, $sort = '', $fields = '*', $limitfrom = 0, $limitnum = 0) {
        return $this->get_database()->get_records($table, $conditions, $sort, $fields, $limitfrom, $limitnum);
    }

    #[\Override]
    public function get_records_list($table, $field, array $values, $sort = '', $fields = '*', $limitfrom = 0, $limitnum = 0) {
        return $this->get_database()->get_records_list($table, $field, $values, $sort, $fields, $limitfrom, $limitnum);
    }

    #[\Override]
    public function get_records_select($table, $select, ?array $params = null, $sort = '', $fields = '*', $limitfrom = 0, $limitnum = 0) {
        return $this->get_database()->get_records_select($table, $select, $params, $sort, $fields, $limitfrom, $limitnum);
    }

    #[\Override]
    public function get_records_sql($sql, ?array $params = null, $limitfrom = 0, $limitnum = 0) {
        return $this->get_database()->get_records_sql($sql, $params, $limitfrom, $limitnum);
    }

    #[\Override]
    public function get_records_menu($table, ?array $conditions = null, $sort = '', $fields = '*', $limitfrom = 0, $limitnum = 0) {
        return $this->get_database()->get_records_menu($table, $conditions, $sort, $fields, $limitfrom, $limitnum);
    }

    #[\Override]
    public function get_records_select_menu($table, $select, ?array $params = null, $sort = '', $fields = '*', $limitfrom = 0, $limitnum = 0) {
        return $this->get_database()->get_records_select_menu($table, $select, $params, $sort, $fields, $limitfrom, $limitnum);
    }

    #[\Override]
    public function get_records_sql_menu($sql, ?array $params = null, $limitfrom = 0, $limitnum = 0) {
        return $this->get_database()->get_records_sql_menu($sql, $params, $limitfrom, $limitnum);
    }

    #[\Override]
    public function get_record($table, array $conditions, $fields = '*', $strictness = IGNORE_MISSING) {
        return $this->get_database()->get_record($table, $conditions, $fields, $strictness);
    }

    #[\Override]
    public function get_record_select($table, $select, ?array $params = null, $fields = '*', $strictness = IGNORE_MISSING) {
        return $this->get_database()->get_record_select($table, $select, $params, $fields, $strictness);
    }

    #[\Override]
    public function get_record_sql($sql, ?array $params = null, $strictness = IGNORE_MISSING) {
        return $this->get_database()->get_record_sql($sql, $params, $strictness);
    }

    #[\Override]
    public function get_field($table, $return, array $conditions, $strictness = IGNORE_MISSING) {
        return $this->get_database()->get_field($table, $return, $conditions, $strictness);
    }

    #[\Override]
    public function get_field_select($table, $return, $select, ?array $params = null, $strictness = IGNORE_MISSING) {
        return $this->get_database()->get_field_select($table, $return, $select, $params, $strictness);
    }

    #[\Override]
    public function get_field_sql($sql, ?array $params = null, $strictness = IGNORE_MISSING) {
        return $this->get_database()->get_field_sql($sql, $params, $strictness);
    }

    #[\Override]
    public function get_fieldset(string $table, string $return, ?array $conditions = null): array {
        return $this->get_database()->get_fieldset($table, $return, $conditions);
    }

    #[\Override]
    public function get_fieldset_select($table, $return, $select, ?array $params = null) {
        return $this->get_database()->get_fieldset_select($table, $return, $select, $params);
    }

    #[\Override]
    public function get_fieldset_sql($sql, ?array $params = null) {
        return $this->get_database()->get_fieldset_sql($sql, $params);
    }

    #[\Override]
    public function insert_record_raw($table, $params, $returnid = true, $bulk = false, $customsequence = false) {
        return $this->get_database()->insert_record_raw($table, $params, $returnid, $bulk, $customsequence);
    }

    #[\Override]
    public function insert_record($table, $dataobject, $returnid = true, $bulk = false) {
        return $this->get_database()->insert_record($table, $dataobject, $returnid, $bulk);
    }

    #[\Override]
    public function insert_records($table, $dataobjects) {
        return $this->get_database()->insert_records($table, $dataobjects);
    }

    #[\Override]
    public function import_record($table, $dataobject) {
        return $this->get_database()->import_record($table, $dataobject);
    }

    #[\Override]
    public function update_record_raw($table, $params, $bulk = false) {
        return $this->get_database()->update_record_raw($table, $params, $bulk);
    }

    #[\Override]
    public function update_record($table, $dataobject, $bulk = false) {
        return $this->get_database()->update_record($table, $dataobject, $bulk);
    }

    #[\Override]
    public function set_field($table, $newfield, $newvalue, ?array $conditions = null) {
        return $this->get_database()->set_field($table, $newfield, $newvalue, $conditions);
    }

    #[\Override]
    public function set_field_select($table, $newfield, $newvalue, $select, ?array $params = null) {
        return $this->get_database()->set_field_select($table, $newfield, $newvalue, $select, $params);
    }

    #[\Override]
    public function count_records($table, ?array $conditions = null) {
        return $this->get_database()->count_records($table, $conditions);
    }

    #[\Override]
    public function count_records_select($table, $select, ?array $params = null, $countitem = 'COUNT(\'x\')') {
        return $this->get_database()->count_records_select($table, $select, $params, $countitem);
    }

    #[\Override]
    public function count_records_sql($sql, ?array $params = null) {
        return $this->get_database()->count_records_sql($sql, $params);
    }

    #[\Override]
    public function record_exists($table, array $conditions) {
        return $this->get_database()->record_exists($table, $conditions);
    }

    #[\Override]
    public function record_exists_select($table, $select, ?array $params = null) {
        return $this->get_database()->record_exists_select($table, $select, $params);
    }

    #[\Override]
    public function record_exists_sql($sql, ?array $params = null) {
        return $this->get_database()->record_exists_sql($sql, $params);
    }

    #[\Override]
    public function delete_records($table, ?array $conditions = null) {
        return $this->get_database()->delete_records($table, $conditions);
    }

    #[\Override]
    public function delete_records_list($table, $field, array $values) {
        return $this->get_database()->delete_records_list($table, $field, $values);
    }

    #[\Override]
    public function delete_records_subquery(string $table, string $field, string $alias, string $subquery, array $params = []): void {
        $this->get_database()->delete_records_subquery($table, $field, $alias, $subquery, $params);
    }

    #[\Override]
    public function delete_records_select($table, $select, ?array $params = null) {
        return $this->get_database()->delete_records_select($table, $select, $params);
    }

    #[\Override]
    public function sql_null_from_clause() {
        return $this->get_database()->sql_null_from_clause();
    }

    #[\Override]
    public function sql_bitand($int1, $int2) {
        return $this->get_database()->sql_bitand($int1, $int2);
    }

    #[\Override]
    public function sql_bitnot($int1) {
        return $this->get_database()->sql_bitnot($int1);
    }

    #[\Override]
    public function sql_bitor($int1, $int2) {
        return $this->get_database()->sql_bitor($int1, $int2);
    }

    #[\Override]
    public function sql_bitxor($int1, $int2) {
        return $this->get_database()->sql_bitxor($int1, $int2);
    }

    #[\Override]
    public function sql_modulo($int1, $int2) {
        return $this->get_database()->sql_modulo($int1, $int2);
    }

    #[\Override]
    public function sql_ceil($fieldname) {
        return $this->get_database()->sql_ceil($fieldname);
    }

    #[\Override]
    public function sql_cast_to_char(string $field): string {
        return $this->get_database()->sql_cast_to_char($field);
    }

    #[\Override]
    public function sql_cast_char2int($fieldname, $text = false) {
        return $this->get_database()->sql_cast_char2int($fieldname, $text);
    }

    #[\Override]
    public function sql_cast_char2real($fieldname, $text = false) {
        return $this->get_database()->sql_cast_char2real($fieldname, $text);
    }

    #[\Override]
    public function sql_cast_2signed($fieldname) {
        return $this->get_database()->sql_cast_2signed($fieldname);
    }

    #[\Override]
    public function sql_compare_text($fieldname, $numchars = 32) {
        return $this->get_database()->sql_compare_text($fieldname, $numchars);
    }

    #[\Override]
    public function sql_equal($fieldname, $param, $casesensitive = true, $accentsensitive = true, $notequal = false) {
        return $this->get_database()->sql_equal($fieldname, $param, $casesensitive, $accentsensitive, $notequal);
    }

    #[\Override]
    public function sql_like($fieldname, $param, $casesensitive = true, $accentsensitive = true, $notlike = false, $escapechar = '\\') {
        return $this->get_database()->sql_like($fieldname, $param, $casesensitive, $accentsensitive, $notlike, $escapechar);
    }

    #[\Override]
    public function sql_like_escape($text, $escapechar = '\\') {
        return $this->get_database()->sql_like_escape($text, $escapechar);
    }

    #[\Override]
    public function sql_concat(...$arr) {
        return $this->get_database()->sql_concat(...$arr);
    }

    #[\Override]
    public function sql_concat_join($separator = '\' \'', $elements = []) {
        return $this->get_database()->sql_concat_join($separator, $elements);
    }

    #[\Override]
    public function sql_group_concat(string $field, string $separator = ', ', string $sort = ''): string {
        return $this->get_database()->sql_group_concat($field, $separator, $sort);
    }

    #[\Override]
    public function sql_fullname($first = 'firstname', $last = 'lastname') {
        return $this->get_database()->sql_fullname($first, $last);
    }

    #[\Override]
    public function sql_order_by_text($fieldname, $numchars = 32) {
        return $this->get_database()->sql_order_by_text($fieldname, $numchars);
    }

    #[\Override]
    public function sql_order_by_null(string $fieldname, int $sort = SORT_ASC): string {
        return $this->get_database()->sql_order_by_null($fieldname, $sort);
    }

    #[\Override]
    public function sql_length($fieldname) {
        return $this->get_database()->sql_length($fieldname);
    }

    #[\Override]
    public function sql_substr($expr, $start, $length = false) {
        return $this->get_database()->sql_substr($expr, $start, $length);
    }

    #[\Override]
    public function sql_position($needle, $haystack) {
        return $this->get_database()->sql_position($needle, $haystack);
    }

    #[\Override]
    public function sql_empty() {
        return $this->get_database()->sql_empty();
    }

    #[\Override]
    public function sql_isempty($tablename, $fieldname, $nullablefield, $textfield) {
        return $this->get_database()->sql_isempty($tablename, $fieldname, $nullablefield, $textfield);
    }

    #[\Override]
    public function sql_isnotempty($tablename, $fieldname, $nullablefield, $textfield) {
        return $this->get_database()->sql_isnotempty($tablename, $fieldname, $nullablefield, $textfield);
    }

    #[\Override]
    public function sql_regex_supported() {
        return $this->get_database()->sql_regex_supported();
    }

    #[\Override]
    public function sql_regex($positivematch = true, $casesensitive = false) {
        return $this->get_database()->sql_regex($positivematch, $casesensitive);
    }

    #[\Override]
    public function sql_regex_get_word_beginning_boundary_marker() {
        return $this->get_database()->sql_regex_get_word_beginning_boundary_marker();
    }

    #[\Override]
    public function sql_regex_get_word_end_boundary_marker() {
        return $this->get_database()->sql_regex_get_word_end_boundary_marker();
    }

    #[\Override]
    public function sql_intersect($selects, $fields) {
        return $this->get_database()->sql_intersect($selects, $fields);
    }

    #[\Override]
    public function replace_all_text_supported() {
        return $this->get_database()->replace_all_text_supported();
    }

    #[\Override]
    public function replace_all_text($table, \database_column_info $column, $search, $replace) {
        return $this->get_database()->replace_all_text($table, $column, $search, $replace);
    }

    #[\Override]
    public function update_temp_table_stats() {
        return $this->get_database()->update_temp_table_stats();
    }

    #[\Override]
    public function is_transaction_started() {
        return $this->get_database()->is_transaction_started();
    }

    #[\Override]
    public function transactions_forbidden() {
        return $this->get_database()->transactions_forbidden();
    }

    #[\Override]
    public function start_delegated_transaction() {
        return $this->get_database()->start_delegated_transaction();
    }

    #[\Override]
    protected function begin_transaction() {
        return $this->get_database()->begin_transaction();
    }

    #[\Override]
    public function commit_delegated_transaction(\moodle_transaction $transaction) {
        return $this->get_database()->commit_delegated_transaction($transaction);
    }

    #[\Override]
    protected function commit_transaction() {
        return $this->get_database()->commit_transaction();
    }

    #[\Override]
    public function rollback_delegated_transaction(\moodle_transaction $transaction, $e) {
        return $this->get_database()->rollback_delegated_transaction($transaction, $e);
    }

    #[\Override]
    protected function rollback_transaction() {
        return $this->get_database()->rollback_transaction();
    }

    #[\Override]
    public function force_transaction_rollback() {
        return $this->get_database()->force_transaction_rollback();
    }

    #[\Override]
    public function session_lock_supported() {
        return $this->get_database()->session_lock_supported();
    }

    #[\Override]
    public function get_session_lock($rowid, $timeout) {
        return $this->get_database()->get_session_lock($rowid, $timeout);
    }

    #[\Override]
    public function release_session_lock($rowid) {
        return $this->get_database()->release_session_lock($rowid);
    }

    #[\Override]
    public function perf_get_reads() {
        return $this->get_database()->perf_get_reads();
    }

    #[\Override]
    public function want_read_slave(): bool {
        return $this->get_database()->want_read_slave();
    }

    #[\Override]
    public function want_read_replica(): bool {
        return $this->get_database()->want_read_replica();
    }

    #[\Override]
    public function perf_get_reads_slave(): int {
        return $this->get_database()->perf_get_reads_slave();
    }

    #[\Override]
    public function perf_get_reads_replica(): int {
        return $this->get_database()->perf_get_reads_replica();
    }

    #[\Override]
    public function mark_tables_for_primary(string ...$tables): void {
        $this->get_database()->mark_tables_for_primary(...$tables);
    }

    #[\Override]
    public function perf_get_writes() {
        return $this->get_database()->perf_get_writes();
    }

    #[\Override]
    public function perf_get_queries() {
        return $this->get_database()->perf_get_queries();
    }

    #[\Override]
    public function perf_get_queries_time() {
        return $this->get_database()->perf_get_queries_time();
    }

    #[\Override]
    public function is_fulltext_search_supported() {
        return $this->get_database()->is_fulltext_search_supported();
    }

    #[\Override]
    public function is_count_window_function_supported(): bool {
        return $this->get_database()->is_count_window_function_supported();
    }

    #[\Override]
    public function get_counted_records_sql(string $sql, string $fullcountcolumn, string $sort = '', ?array $params = null, int $limitfrom = 0, int $limitnum = 0): array {
        return $this->get_database()->get_counted_records_sql($sql, $fullcountcolumn, $sort, $params, $limitfrom, $limitnum);
    }

    #[\Override]
    public function get_counted_recordset_sql(string $sql, string $fullcountcolumn, string $sort = '', ?array $params = null, int $limitfrom = 0, int $limitnum = 0): \moodle_recordset {
        return $this->get_database()->get_counted_recordset_sql($sql, $fullcountcolumn, $sort, $params, $limitfrom, $limitnum);
    }
}
