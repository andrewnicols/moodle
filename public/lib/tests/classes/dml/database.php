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

use core\dml\temptables;
use core\dml\database_column_info;
use database_manager;
use Exception;

/**
 * Abstract database driver test class
 *
 * @package    core
 * @category   dml
 * @copyright  2018 Catalyst IT
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class database extends \core\dml\database {
    /** @var string */
    private $error;

    /** @var array */
    private $_tables = [];

    /**
     * Constructor - Instantiates the database
     * @param bool $external True means that an external database is used.
     */
    public function __construct($external = false) {
        parent::__construct($external);

        $this->temptables = new temptables($this);
    }

    /**
     * Default implementation
     * @return boolean true
     */
    public function driver_installed(): bool {
        return true;
    }

    /**
     * Default implementation
     * @return string 'test'
     */
    public function get_dbfamily(): string {
        return 'test';
    }

    /**
     * Default implementation
     * @return string 'test'
     */
    protected function get_dbtype(): string {
        return 'test';
    }

    /**
     * Default implementation
     * @return string 'test'
     */
    protected function get_dblibrary(): string {
        return 'test';
    }

    /**
     * Default implementation
     * @return string 'test'
     */
    public function get_name(): string {
        return 'test';
    }

    /**
     * Default implementation
     * @return string
     */
    public function get_configuration_help(): string {
        return 'test database driver';
    }

    /**
     * Default implementation
     * @return array
     */
    public function get_server_info(): array {
        return ['description' => $this->name(), 'version' => '0'];
    }

    /**
     * Default implementation
     * @return int 0
     */
    protected function allowed_param_types(): int {
        return 0;
    }

    /**
     * Returns error property
     * @return string $error
     */
    public function get_last_error(): string {
        return $this->error;
    }

    /**
     * Sets tables property
     * @param array $tables
     * @return void
     */
    public function set_tables($tables) {
        $this->_tables = $tables;
    }

    #[\Override]
    public function get_tables($usecache = true): array {
        return array_keys($this->_tables);
    }

    #[\Override]
    public function get_indexes(string $table): array {
        return isset($this->_tables[$table]['indexes']) ? $this->_tables[$table]['indexes'] : [];
    }

    #[\Override]
    public function fetch_columns(string $table): array {
        return $this->_tables[$table]['columns'];
    }

    #[\Override]
    protected function normalise_value(database_column_info $column, mixed $value): mixed {
        return $value;
    }

    #[\Override]
    public function change_database_structure(
        string|array $sql,
        ?array $tablenames = null,
    ): bool {
        return true;
    }

    #[\Override]
    public function execute($sql, ?array $params = null): bool {
            throw new Exception("execute() not implemented");
    }

    #[\Override]
    public function get_recordset_sql(
        string $sql,
        ?array $params = null,
        string|int|null $limitfrom = 0,
        string|int|null $limitnum = 0,
    ): \core\dml\recordset {
        throw new Exception("get_recordset_sql() not implemented");
    }

    #[\Override]
    public function get_records_sql(
        string $sql,
        ?array $params = null,
        string|int|null $limitfrom = 0,
        string|int|null $limitnum = 0
    ): array {
        throw new Exception("get_records_sql() not implemented");
    }

    #[\Override]
    public function get_fieldset_sql($sql, ?array $params = null) {
        throw new Exception("get_fieldset_sql() not implemented");
    }

    #[\Override]
    public function insert_record_raw($table, $params, $returnid = true, $bulk = false, $customsequence = false): bool|int {
        throw new Exception("insert_record_raw() not implemented");
    }

    #[\Override]
    public function insert_record($table, $dataobject, $returnid = true, $bulk = false): bool|int {
        return $this->insert_record_raw($table, (array)$dataobject, $returnid, $bulk);
    }

    #[\Override]
    public function import_record($table, $dataobject) {
        throw new Exception("import_record() not implemented");
    }

    #[\Override]
    public function update_record_raw($table, $params, $bulk = false) {
        throw new Exception("update_record_raw() not implemented");
    }

    #[\Override]
    public function update_record($table, $dataobject, $bulk = false) {
        throw new Exception("update_record() not implemented");
    }

    #[\Override]
    public function set_field_select($table, $newfield, $newvalue, $select, ?array $params = null) {
        throw new Exception("set_field_select() not implemented");
    }

    #[\Override]
    public function delete_records_select($table, $select, ?array $params = null) {
        throw new Exception("delete_records_select() not implemented");
    }

    #[\Override]
    public function sql_concat(...$arr) {
        throw new Exception("sql_concat() not implemented");
    }

    #[\Override]
    public function sql_concat_join($separator = "' '", $elements = []) {
        throw new Exception("sql_concat_join() not implemented");
    }

    #[\Override]
    public function sql_group_concat(string $field, string $separator = ', ', string $sort = ''): string {
        throw new Exception('sql_group_concat() not implemented');
    }

    #[\Override]
    protected function begin_transaction(): void {
        throw new Exception("begin_transaction() not implemented");
    }

    #[\Override]
    protected function commit_transaction(): void {
        throw new Exception("commit_transaction() not implemented");
    }

    #[\Override]
    protected function rollback_transaction(): void {
        throw new Exception("rollback_transaction() not implemented");
    }

    #[\Override]
    public function get_manager() {
        if (!$this->database_manager) {
            $generator = new sql_generator($this, $this->temptables);

            $this->database_manager = new database_manager($this, $generator);
        }
        return $this->database_manager;
    }
}
