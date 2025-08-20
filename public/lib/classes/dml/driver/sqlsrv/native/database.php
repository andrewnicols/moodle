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

namespace core\dml\driver\sqlsrv\native;

use core\dml\database_column_info;
use core\dml\exception\exception as dml_exception;
use core\dml\exception\connection_exception;
use core\dml\exception\sessionwait_exception;
use core\exception\coding_exception;
use ddl_change_structure_exception;
use stdClass;

/**
 * Native sqlsrv class representing moodle database interface.
 *
 * @package    core_dml
 * @copyright  2009 onwards Eloy Lafuente (stronk7) {@link http://stronk7.com}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v2 or later
 */
class database extends \core\dml\database {
    /** @var ?resource The SQLSRV connection resource */
    protected $sqlsrv = null;

    /** @var string current DB collation cache */
    protected ?string $collation;

    /** @var bool Whether the DB version supports the ANSI way of limiting (2012 and higher) */
    protected $supportsoffsetfetch;

    /** @var recordset[] list of open recordsets */
    protected array $recordsets = [];

    /** @var string[] list of reserve words in MSSQL / Transact from http://msdn2.microsoft.com/en-us/library/ms189822.aspx */
    protected array $reservewords = [
        "add", "all", "alter", "and", "any", "as", "asc", "authorization", "avg", "backup", "begin", "between", "break",
        "browse", "bulk", "by", "cascade", "case", "check", "checkpoint", "close", "clustered", "coalesce", "collate", "column",
        "commit", "committed", "compute", "confirm", "constraint", "contains", "containstable", "continue", "controlrow",
        "convert", "count", "create", "cross", "current", "current_date", "current_time", "current_timestamp", "current_user",
        "cursor", "database", "dbcc", "deallocate", "declare", "default", "delete", "deny", "desc", "disk", "distinct",
        "distributed", "double", "drop", "dummy", "dump", "else", "end", "errlvl", "errorexit", "escape", "except", "exec",
        "execute", "exists", "exit", "external", "fetch", "file", "fillfactor", "floppy", "for", "foreign", "freetext",
        "freetexttable", "from", "full", "function", "goto", "grant", "group", "having", "holdlock", "identity",
        "identity_insert", "identitycol", "if", "in", "index", "inner", "insert", "intersect", "into", "is", "isolation",
        "join", "key", "kill", "left", "level", "like", "lineno", "load", "max", "merge", "min", "mirrorexit", "national",
        "nocheck", "nonclustered", "not", "null", "nullif", "of", "off", "offsets", "on", "once", "only", "open",
        "opendatasource", "openquery", "openrowset", "openxml", "option", "or", "order", "outer", "over", "percent", "perm",
        "permanent", "pipe", "pivot", "plan", "precision", "prepare", "primary", "print", "privileges", "proc", "procedure",
        "processexit", "public", "raiserror", "read", "readtext", "reconfigure", "references", "repeatable", "replication",
        "restore", "restrict", "return", "revert", "revoke", "right", "rollback", "rowcount", "rowguidcol", "rule", "save",
        "schema", "securityaudit", "select", "semantickeyphrasetable", "semanticsimilaritydetailstable",
        "semanticsimilaritytable", "serializable", "session_user", "set", "setuser", "shutdown", "some", "statistics", "sum",
        "system_user", "table", "tablesample", "tape", "temp", "temporary", "textsize", "then", "to", "top", "tran",
        "transaction", "trigger", "truncate", "try_convert", "tsequal", "uncommitted", "union", "unique", "unpivot", "update",
        "updatetext", "use", "user", "values", "varying", "view", "waitfor", "when", "where", "while", "with", "within group",
        "work", "writetext",
    ];

    #[\Override]
    public function driver_installed(): bool|string {
        // Note: Use 'function_exists()' rather than 'extension_loaded()' because
        // the name used by 'extension_loaded()' is case specific! The extension
        // therefore *could be* mixed case and hence not found.
        if (!function_exists('sqlsrv_num_rows')) {
            return get_string('nativesqlsrvnodriver', 'install');
        }
        return true;
    }

    #[\Override]
    public function get_dbfamily(): string {
        return 'mssql';
    }

    #[\Override]
    protected function get_dbtype(): string {
        return 'sqlsrv';
    }

    #[\Override]
    protected function get_dblibrary(): string {
        return 'native';
    }

    #[\Override]
    public function get_name(): string {
        return get_string('nativesqlsrv', 'install');
    }

    #[\Override]
    public function get_configuration_help(): string {
        return get_string('nativesqlsrvhelp', 'install');
    }

    #[\Override]
    public function diagnose(): ?string {
        // Verify the database is running with READ_COMMITTED_SNAPSHOT enabled.
        // (that's required to get snapshots/row versioning on READ_COMMITED mode).
        $correctrcsmode = false;
        $sql = "SELECT is_read_committed_snapshot_on
                  FROM sys.databases
                 WHERE name = '{$this->dbname}'";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = sqlsrv_query($this->sqlsrv, $sql);
        $this->query_end($result);
        if ($result) {
            if ($row = sqlsrv_fetch_array($result)) {
                $correctrcsmode = (bool)reset($row);
            }
        }
        $this->free_result($result);

        if (!$correctrcsmode) {
            return get_string('mssqlrcsmodemissing', 'error');
        }

        // Arrived here, all right.
        return null;
    }

    #[\Override]
    public function connect($dbhost, $dbuser, $dbpass, $dbname, $prefix, ?array $dboptions = null): bool {
        if ($prefix == '' && !$this->external) {
            // Enforce prefixes for everybody but mysql.
            throw new dml_exception('prefixcannotbeempty', $this->get_dbfamily());
        }

        $driverstatus = $this->driver_installed();

        if ($driverstatus !== true) {
            throw new dml_exception('dbdriverproblem', $driverstatus);
        }

        // Log all Errors.
        sqlsrv_configure("WarningsReturnAsErrors", false);
        sqlsrv_configure("LogSubsystems", SQLSRV_LOG_SYSTEM_OFF);
        sqlsrv_configure("LogSeverity", SQLSRV_LOG_SEVERITY_ERROR);

        $this->store_settings($dbhost, $dbuser, $dbpass, $dbname, $prefix, $dboptions);

        $options = [
            'UID' => $this->dbuser,
            'PWD' => $this->dbpass,
            'Database' => $this->dbname,
            'CharacterSet' => 'UTF-8',
            'MultipleActiveResultSets' => true,
            'ConnectionPooling' => !empty($this->dboptions['dbpersist']),
            'ReturnDatesAsStrings' => true,
        ];

        $dbhost = $this->dbhost;
        if (!empty($dboptions['dbport'])) {
            $dbhost .= ',' . $dboptions['dbport'];
        }

        // The sqlsrv_connect() has a lot of connection options to be used.
        // Users can add any supported options with the 'extrainfo' key in the dboptions.
        if (isset($this->dboptions['extrainfo'])) {
            $options = array_merge($options, $this->dboptions['extrainfo']);
        }

        $this->sqlsrv = sqlsrv_connect($dbhost, $options);

        if ($this->sqlsrv === false) {
            $this->sqlsrv = null;
            $dberr = $this->get_last_error();

            throw new connection_exception($dberr);
        }

        // Disable logging until we are fully setup.
        $this->query_log_prevent();

        // Allow quoted identifiers.
        $sql = "SET QUOTED_IDENTIFIER ON";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = sqlsrv_query($this->sqlsrv, $sql);
        $this->query_end($result);

        $this->free_result($result);

        // Force ANSI nulls so the NULL check was done by IS NULL and NOT IS NULL
        // instead of equal(=) and distinct(<>) symbols.
        $sql = "SET ANSI_NULLS ON";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = sqlsrv_query($this->sqlsrv, $sql);
        $this->query_end($result);

        $this->free_result($result);

        // Force ANSI warnings so arithmetic/string overflows will be
        // returning error instead of transparently truncating data.
        $sql = "SET ANSI_WARNINGS ON";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = sqlsrv_query($this->sqlsrv, $sql);
        $this->query_end($result);

        // Concatenating null with anything MUST return NULL.
        $sql = "SET CONCAT_NULL_YIELDS_NULL  ON";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = sqlsrv_query($this->sqlsrv, $sql);
        $this->query_end($result);

        $this->free_result($result);

        // Set transactions isolation level to READ_COMMITTED
        // prevents dirty reads when using transactions +
        // is the default isolation level of sqlsrv.
        $sql = "SET TRANSACTION ISOLATION LEVEL READ COMMITTED";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = sqlsrv_query($this->sqlsrv, $sql);
        $this->query_end($result);

        $this->free_result($result);

        $serverinfo = $this->get_server_info();
        // Fetch/offset is supported staring from SQL Server 2012.
        $this->supportsoffsetfetch = $serverinfo['version'] > '11';

        // We can enable logging now.
        $this->query_log_allow();

        // Connection established and configured, going to instantiate the temptables controller.
        $this->temptables = new temptables($this);

        return true;
    }

    #[\Override]
    public function dispose(): void {
        // Call parent dispose to write/close session and other common stuff before closing connection.
        parent::dispose();

        if ($this->sqlsrv) {
            sqlsrv_close($this->sqlsrv);
            $this->sqlsrv = null;
        }
    }

    #[\Override]
    // phpcs:ignore Generic.CodeAnalysis.UselessOverridingMethod.Found
    protected function query_start(string $sql, ?array $params, $type, $extrainfo = null): void {
        parent::query_start($sql, $params, $type, $extrainfo);
    }

    #[\Override]
    // phpcs:ignore Generic.CodeAnalysis.UselessOverridingMethod.Found
    protected function query_end(mixed $result): void {
        parent::query_end($result);
    }

    #[\Override]
    public function get_server_info(): array {
        static $info;

        if (!$info) {
            $serverinfo = sqlsrv_server_info($this->sqlsrv);

            if ($serverinfo) {
                $info['description'] = $serverinfo['SQLServerName'];
                $info['version'] = $serverinfo['SQLServerVersion'];
                $info['database'] = $serverinfo['CurrentDatabase'];
            }
        }
        return $info;
    }

    #[\Override]
    protected function fix_table_names($sql): string {
        if (preg_match_all('/\{([a-z][a-z0-9_]*)\}/i', $sql, $matches)) {
            foreach ($matches[0] as $key => $match) {
                $name = $matches[1][$key];

                if ($this->temptables->is_temptable($name)) {
                    $sql = str_replace($match, $this->temptables->get_correct_name($name), $sql);
                } else {
                    $sql = str_replace($match, $this->prefix . $name, $sql);
                }
            }
        }
        return $sql;
    }

    #[\Override]
    protected function allowed_param_types(): int {
        return SQL_PARAMS_QM;  // SQLSrv 1.1 can bind.
    }

    #[\Override]
    public function get_last_error(): string {
        $reterrors = sqlsrv_errors(SQLSRV_ERR_ALL);
        $errormessage = 'No errors found';

        if ($reterrors != null) {
            $errormessage = '';

            foreach ($reterrors as $arrerror) {
                $errormessage .= "SQLState: " . $arrerror['SQLSTATE'] . "<br>\n";
                $errormessage .= "Error Code: " . $arrerror['code'] . "<br>\n";
                $errormessage .= "Message: " . $arrerror['message'] . "<br>\n";
            }
        }

        return $errormessage;
    }

    /**
     * Prepare the query binding and do the actual query.
     *
     * @param string $sql The sql statement
     * @param array $params array of params for binding. If NULL, they are ignored.
     * @param int $sqlquerytype - Type of operation
     * @param bool $freeresult - Default true, transaction query will be freed.
     * @param bool $scrollable - Default false, to use for quickly seeking to target records
     * @return resource|bool result
     */
    private function do_query(
        string $sql,
        ?array $params,
        int $sqlquerytype,
        bool $freeresult = true,
        bool $scrollable = false,
    ): mixed {
        [$sql, $params, $type] = $this->fix_sql_params($sql, $params);

        // Bound variables *are* supported. Until I can get it to work, emulate the bindings
        // The challenge/problem/bug is that although they work, doing a SELECT SCOPE_IDENTITY()
        // doesn't return a value (no result set)
        //
        // -- somebody from MS.

        $sql = $this->emulate_bound_params($sql, $params);
        $this->query_start($sql, $params, $sqlquerytype);
        if (!$scrollable) {
            // Only supporting next row.
            $result = sqlsrv_query($this->sqlsrv, $sql);
        } else {
            // Supporting absolute/relative rows.
            $result = sqlsrv_query($this->sqlsrv, $sql, [], ['Scrollable' => SQLSRV_CURSOR_STATIC]);
        }

        if ($result === false) {
            // TODO do something with error or just use if DEV or DEBUG?
            $dberr = $this->get_last_error();
        }

        $this->query_end($result);

        if ($freeresult) {
            $this->free_result($result);
            return true;
        }
        return $result;
    }

    #[\Override]
    public function get_tables(bool $usecache = true): array {
        if ($usecache && $this->tables !== null) {
            return $this->tables;
        }
        $this->tables = [];
        $prefix = str_replace('_', '\\_', $this->prefix);
        $sql = "SELECT table_name
                  FROM INFORMATION_SCHEMA.TABLES
                 WHERE table_name LIKE '$prefix%' ESCAPE '\\' AND table_type = 'BASE TABLE'";

        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = sqlsrv_query($this->sqlsrv, $sql);
        $this->query_end($result);

        if ($result) {
            while ($row = sqlsrv_fetch_array($result)) {
                $tablename = reset($row);
                if ($this->prefix !== false && $this->prefix !== '') {
                    if (strpos($tablename, $this->prefix) !== 0) {
                        continue;
                    }
                    $tablename = substr($tablename, strlen($this->prefix));
                }
                $this->tables[$tablename] = $tablename;
            }
            $this->free_result($result);
        }

        // Add the currently available temptables.
        $this->tables = array_merge($this->tables, $this->temptables->get_temptables());
        return $this->tables;
    }

    #[\Override]
    public function get_indexes(string $table): array {
        $indexes = [];
        $tablename = $this->prefix . $table;

        // Indexes aren't covered by information_schema metatables, so we need to
        // go to sys ones. Skipping primary key indexes on purpose.
        $sql = "SELECT i.name AS index_name, i.is_unique, ic.index_column_id, c.name AS column_name
                  FROM sys.indexes i
                  JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
                  JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
                  JOIN sys.tables t ON i.object_id = t.object_id
                 WHERE t.name = '$tablename' AND i.is_primary_key = 0
              ORDER BY i.name, i.index_id, ic.index_column_id";

        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = sqlsrv_query($this->sqlsrv, $sql);
        $this->query_end($result);

        if ($result) {
            $lastindex = '';
            $unique = false;
            $columns = [];

            while ($row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC)) {
                if ($lastindex && $lastindex != $row['index_name']) {
                    // Save lastindex to $indexes and reset info.
                    $indexes[$lastindex] =
                     [
                      'unique' => $unique,
                      'columns' => $columns,
                     ];

                    $unique = false;
                    $columns = [];
                }
                $lastindex = $row['index_name'];
                $unique = empty($row['is_unique']) ? false : true;
                $columns[] = $row['column_name'];
            }

            if ($lastindex) {
                // Add the last one if exists.
                $indexes[$lastindex] =
                 [
                  'unique' => $unique,
                  'columns' => $columns,
                 ];
            }

            $this->free_result($result);
        }
        return $indexes;
    }

    #[\Override]
    protected function fetch_columns(string $table): array {
        $structure = [];

        if (!$this->temptables->is_temptable($table)) {
            // This is a normal table; get metadata from own schema.
            $sql = "SELECT column_name AS name,
                           data_type AS type,
                           numeric_precision AS max_length,
                           character_maximum_length AS char_max_length,
                           numeric_scale AS scale,
                           is_nullable AS is_nullable,
                           columnproperty(
                               object_id(
                                   quotename(table_schema) + '.' + quotename(table_name)
                               ),
                               column_name,
                               'IsIdentity'
                           ) AS auto_increment,
                           column_default AS default_value
                      FROM INFORMATION_SCHEMA.COLUMNS
                     WHERE table_name = '{" . $table . "}'
                  ORDER BY ordinal_position";
        } else {
            // Temporary table, get metadata from tempdb schema.
            $sql = "SELECT column_name AS name,
                           data_type AS type,
                           numeric_precision AS max_length,
                           character_maximum_length AS char_max_length,
                           numeric_scale AS scale,
                           is_nullable AS is_nullable,
                           columnproperty(
                               object_id(
                                   quotename(table_schema) + '.' + quotename(table_name)
                               ),
                               column_name,
                               'IsIdentity'
                           ) AS auto_increment,
                           column_default AS default_value
                      FROM tempdb.INFORMATION_SCHEMA.COLUMNS " .
            // Check this statement
            // JOIN tempdb..sysobjects ON name = table_name
            // WHERE id = object_id('tempdb..{".$table."}').
                    "WHERE table_name LIKE '{" . $table . "}__________%'
                  ORDER BY ordinal_position";
        }

        [$sql, $params, $type] = $this->fix_sql_params($sql, null);

        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = sqlsrv_query($this->sqlsrv, $sql);
        $this->query_end($result);

        if (!$result) {
            return  [];
        }

        while ($rawcolumn = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC)) {
            $rawcolumn = (object)$rawcolumn;

            $info = new stdClass();
            $info->name = $rawcolumn->name;
            $info->type = $rawcolumn->type;
            $info->meta_type = $this->sqlsrvtype2moodletype($info->type);

            // Prepare auto_increment info.
            $info->auto_increment = $rawcolumn->auto_increment ? true : false;

            // Define type for auto_increment columns.
            $info->meta_type = ($info->auto_increment && $info->meta_type == 'I') ? 'R' : $info->meta_type;

            // The id columns being auto_incremnt are PK by definition.
            $info->primary_key = ($info->name == 'id' && $info->meta_type == 'R' && $info->auto_increment);

            if ($info->meta_type === 'C' && $rawcolumn->char_max_length == -1) {
                // This is NVARCHAR(MAX), not a normal NVARCHAR.
                $info->max_length = -1;
                $info->meta_type = 'X';
            } else {
                // Put correct length for character and LOB types.
                $info->max_length = $info->meta_type == 'C' ? $rawcolumn->char_max_length : $rawcolumn->max_length;
                $info->max_length = ($info->meta_type == 'X' || $info->meta_type == 'B') ? -1 : $info->max_length;
            }

            // Scale.
            $info->scale = $rawcolumn->scale;

            // Prepare not_null info.
            $info->not_null = $rawcolumn->is_nullable == 'NO' ? true : false;

            // Process defaults.
            $info->has_default = !empty($rawcolumn->default_value);
            if ($rawcolumn->default_value === null) {
                $info->default_value = null;
            } else {
                $info->default_value = preg_replace("/^[\(N]+[']?(.*?)[']?[\)]+$/", '\\1', $rawcolumn->default_value);
            }

            // Process binary.
            $info->binary = $info->meta_type == 'B' ? true : false;

            $structure[$info->name] = new database_column_info($info);
        }
        $this->free_result($result);

        return $structure;
    }

    #[\Override]
    protected function normalise_value(database_column_info $column, mixed $value): mixed {
        $this->detect_objects($value);

        if (is_bool($value)) {
            // Always, convert boolean to int.
            $value = (int) $value;
            // And continue processing because text columns with numeric info need special handling below.
        }

        if ($column->meta_type == 'B') {
            // BLOBs need to be properly "packed", but can be inserted directly if so.
            if (!is_null($value)) {
                // If value not null, unpack it to unquoted hexadecimal byte-string format
                // we leave it as array, so emulate_bound_params() can detect it easily and "bind" the param ok.
                $value = unpack('H*hex', $value);
            }
        } else if ($column->meta_type == 'X') {
            // SQLSrv doesn't cast from int to text, so if text column and is numeric value then cast to string
            // and put into array, so emulate_bound_params() will know how to "bind" the param ok,
            // avoiding reverse conversion to number.
            if (is_numeric($value)) {
                $value = ['numstr' => (string) $value];
            }
        } else if ($value === '') {
            if ($column->meta_type == 'I' || $column->meta_type == 'F' || $column->meta_type == 'N') {
                // Prevent '' problems in numeric fields.
                $value = 0;
            }
        }
        return $value;
    }

    /**
     * Selectively call sqlsrv_free_stmt(), avoiding some warnings without using the horrible @
     *
     * @param \sqlsrv_resource $resource resource to be freed if possible
     * @return bool
     */
    private function free_result($resource): bool {
        if (!is_bool($resource) && is_resource($resource)) {
            // We need to make sure that the statement resource is in the correct type before freeing it.
            return sqlsrv_free_stmt($resource);
        }
        return false;
    }

    /**
     * Provides mapping between sqlsrv native data types and moodle_database - database_column_info - ones)
     *
     * @param string $sqlsrv_type native sqlsrv data type
     * @return string 1-char database_column_info data type
     */
    private function sqlsrvtype2moodletype(string $type): string {
        switch (strtoupper($type)) {
            case 'BIT':
                return 'L';

            case 'INT':
            case 'SMALLINT':
            case 'INTEGER':
            case 'BIGINT':
                return 'I';

            case 'DECIMAL':
            case 'REAL':
            case 'FLOAT':
                return 'N';

            case 'VARCHAR':
            case 'NVARCHAR':
                return 'C';

            case 'TEXT':
            case 'NTEXT':
            case 'VARCHAR(MAX)':
            case 'NVARCHAR(MAX)':
                return 'X';

            case 'IMAGE':
            case 'VARBINARY':
            case 'VARBINARY(MAX)':
                return 'B';

            case 'DATETIME':
                return 'D';
        }

        throw new dml_exception('invalidsqlsrvnativetype', $type);
    }

    #[\Override]
    public function change_database_structure(
        string|array $sql,
        ?array $tablenames = null,
    ): bool {
        $this->get_manager();
        $sqls = (array)$sql;

        try {
            foreach ($sqls as $sql) {
                $this->query_start($sql, null, SQL_QUERY_STRUCTURE);
                $result = sqlsrv_query($this->sqlsrv, $sql);
                $this->query_end($result);
            }
        } catch (ddl_change_structure_exception $e) {
            $this->reset_caches($tablenames);
            throw $e;
        }

        $this->reset_caches($tablenames);
        return true;
    }

    /**
     * Prepare the array of params for native binding
     */
    protected function build_native_bound_params(?array $params = null) {

        return null;
    }

    /**
     * Workaround for SQL*Server Native driver similar to MSSQL driver for
     * consistent behavior.
     */
    protected function emulate_bound_params($sql, ?array $params = null) {
        if (empty($params)) {
            return $sql;
        }
        // Ok, we have verified sql statement with ? and correct number of params.
        $parts = array_reverse(explode('?', $sql));
        $return = array_pop($parts);
        foreach ($params as $param) {
            if (is_bool($param)) {
                $return .= (int)$param;
            } else if (is_array($param) && isset($param['hex'])) {
                // Detect hex binary, bind it specially.
                $return .= '0x' . $param['hex'];
            } else if (is_array($param) && isset($param['numstr'])) {
                // Detect numerical strings that *must not*
                // be converted back to number params, but bound as strings.
                $return .= "N'{$param['numstr']}'";
            } else if (is_null($param)) {
                $return .= 'NULL';
            } else if (is_number($param)) {
                // We can not use is_numeric() because it eats leading zeros from strings like 0045646.
                // This is a hack for MDL-23997, we intentionally use string because it is compatible with
                // both nvarchar and int types.
                $return .= "'$param'";
            } else if (is_float($param)) {
                $return .= $param;
            } else {
                $param = str_replace("'", "''", $param);
                $param = str_replace("\0", "", $param);
                $return .= "N'$param'";
            }

            $return .= array_pop($parts);
        }
        return $return;
    }

    #[\Override]
    public function execute($sql, ?array $params = null): bool {
        if (strpos($sql, ';') !== false) {
            throw new coding_exception(
                'moodle_database::execute() Multiple sql statements found or bound parameters not used properly in query!',
            );
        }
        $this->do_query($sql, $params, SQL_QUERY_UPDATE);
        return true;
    }

    /**
     * Whether the given SQL statement has the ORDER BY clause in the main query.
     *
     * @param string $sql the SQL statement
     * @return bool true if the main query has the ORDER BY clause; otherwise, false.
     */
    protected static function has_query_order_by(string $sql) {
        $sqltoupper = strtoupper($sql);
        // Fail fast if there is no ORDER BY clause in the original query.
        if (strpos($sqltoupper, 'ORDER BY') === false) {
            return false;
        }

        // Search for an ORDER BY clause in the main query, not in any subquery (not always allowed in MSSQL)
        // or in clauses like OVER with a window function e.g. ROW_NUMBER() OVER (ORDER BY ...) or RANK() OVER (ORDER BY ...):
        // use PHP PCRE recursive patterns to remove everything found within round brackets.
        $mainquery = preg_replace('/\(((?>[^()]+)|(?R))*\)/', '()', $sqltoupper);
        if (strpos($mainquery, 'ORDER BY') !== false) {
            return true;
        }

        return false;
    }

    #[\Override]
    public function get_recordset_sql(
        string $sql,
        ?array $params = null,
        string|int|null $limitfrom = 0,
        string|int|null $limitnum = 0,
    ): \core\dml\recordset {
        [$limitfrom, $limitnum] = $this->normalise_limit_from_num($limitfrom, $limitnum);
        $needscrollable = (bool)$limitfrom; // To determine if we'll need to perform scroll to $limitfrom.

        if ($limitfrom || $limitnum) {
            if (!$this->supportsoffsetfetch) {
                if ($limitnum >= 1) { // Only apply TOP clause if we have any limitnum (limitfrom offset is handled later).
                    $fetch = $limitfrom + $limitnum;
                    if (PHP_INT_MAX - $limitnum < $limitfrom) { // Check PHP_INT_MAX overflow.
                        $fetch = PHP_INT_MAX;
                    }
                    $sql = preg_replace(
                        '/^([\s(])*SELECT([\s]+(DISTINCT|ALL))?(?!\s*TOP\s*\()/i',
                        "\\1SELECT\\2 TOP $fetch",
                        $sql
                    );
                }
            } else {
                $needscrollable = false; // Using supported fetch/offset, no need to scroll anymore.
                $sql = (substr($sql, -1) === ';') ? substr($sql, 0, -1) : $sql;
                // We need ORDER BY to use FETCH/OFFSET.
                // Ordering by first column shouldn't break anything if there was no order in the first place.
                if (!self::has_query_order_by($sql)) {
                    $sql .= " ORDER BY 1";
                }

                $sql .= " OFFSET " . $limitfrom . " ROWS ";

                if ($limitnum > 0) {
                    $sql .= " FETCH NEXT " . $limitnum . " ROWS ONLY";
                }
            }
        }

        // Add WITH (NOLOCK) to any temp tables.
        $sql = $this->add_no_lock_to_temp_tables($sql);

        $result = $this->do_query($sql, $params, SQL_QUERY_SELECT, false, $needscrollable);

        if ($needscrollable) { // Skip $limitfrom records.
            sqlsrv_fetch($result, SQLSRV_SCROLL_ABSOLUTE, $limitfrom - 1);
        }
        return $this->create_recordset($result);
    }

    /**
     * Use NOLOCK on any temp tables. Since it's a temp table and uncommitted reads are low risk anyway.
     *
     * @param string $sql the SQL select query to execute.
     * @return string The SQL, with WITH (NOLOCK) added to all temp tables
     */
    protected function add_no_lock_to_temp_tables($sql) {
        return preg_replace_callback('/(\{([a-z][a-z0-9_]*)\})(\s+(\w+))?/', function ($matches) {
            $table = $matches[1]; // With the braces, so we can put it back in the query.
            $name = $matches[2]; // Without the braces, so we can check if it's a temptable.
            $tail = isset($matches[3]) ? $matches[3] : ''; // Catch the next word afterwards so that we can check if it's an alias.
            $replacement = $matches[0]; // The table and the word following it, so we can replace it back if no changes are needed.

            if ($this->temptables && $this->temptables->is_temptable($name)) {
                if (!empty($tail)) {
                    if (in_array(strtolower(trim($tail)), $this->reservewords)) {
                        // If the table is followed by a reserve word, it's not an alias so put the WITH (NOLOCK) in between.
                        return $table . ' WITH (NOLOCK)' . $tail;
                    }
                }
                // If the table is not followed by a reserve word, put the WITH (NOLOCK) after the whole match.
                return $replacement . ' WITH (NOLOCK)';
            } else {
                return $replacement;
            }
        }, $sql);
    }

    /**
     * Create a record set and initialize with first row
     *
     * @param mixed $result
     * @return \core\dml\recordset
     */
    protected function create_recordset(mixed $result): \core\dml\recordset {
        $rs = new recordset($result, $this);
        $this->recordsets[] = $rs;
        return $rs;
    }

    /**
     * Do not use outside of recordset class.
     *
     * @param \core\dml\recordset $rs
     */
    public function recordset_closed(recordset $rs): void {
        if ($key = array_search($rs, $this->recordsets, true)) {
            unset($this->recordsets[$key]);
        }
    }

    #[\Override]
    public function get_records_sql(
        string $sql,
        ?array $params = null,
        string|int|null $limitfrom = 0,
        string|int|null $limitnum = 0,
    ): array {
        $rs = $this->get_recordset_sql($sql, $params, $limitfrom, $limitnum);

        $results = [];

        foreach ($rs as $row) {
            $rowarray = (array)$row;
            $id = reset($rowarray);

            if (isset($results[$id])) {
                $colname = key($rowarray);
                debugging(
                    "Did you remember to make the first column something unique in your call to get_records? "
                        . "Duplicate value '$id' found in column '$colname'.",
                    DEBUG_DEVELOPER,
                );
            }
            $results[$id] = (object)$row;
        }
        $rs->close();

        return $results;
    }

    #[\Override]
    public function get_fieldset_sql($sql, ?array $params = null) {

        $rs = $this->get_recordset_sql($sql, $params);

        $results = [];

        foreach ($rs as $row) {
            $rowarray = (array)$row;
            $results[] = reset($rowarray);
        }
        $rs->close();

        return $results;
    }

    /**
     * Insert new record into database, as fast as possible, no safety checks, lobs not supported.
     * @param string $table name
     * @param mixed $params data record as object or array
     * @param bool $returnit return it of inserted record
     * @param bool $bulk true means repeated inserts expected
     * @param bool $customsequence true if 'id' included in $params, disables $returnid
     * @return bool|int true or new id
     * @throws dml_exception A DML specific exception is thrown for any errors.
     */
    #[\Override]
    public function insert_record_raw($table, $params, $returnid = true, $bulk = false, $customsequence = false): bool|int {
        if (!is_array($params)) {
            $params = (array)$params;
        }

        $isidentity = false;

        if ($customsequence) {
            if (!isset($params['id'])) {
                throw new coding_exception(
                    'moodle_database::insert_record_raw() id field must be specified if custom sequences used.',
                );
            }

            $returnid = false;
            $columns = $this->get_columns($table);
            if (isset($columns['id']) && $columns['id']->auto_increment) {
                $isidentity = true;
            }

            // Disable IDENTITY column before inserting record with id, only if the
            // column is identity, from meta information.
            if ($isidentity) {
                $sql = 'SET IDENTITY_INSERT {' . $table . '} ON'; // Yes, it' ON!!
                $this->do_query($sql, null, SQL_QUERY_AUX);
            }
        } else {
            unset($params['id']);
        }

        if (empty($params)) {
            throw new coding_exception('moodle_database::insert_record_raw() no fields found.');
        }
        $fields = implode(',', array_keys($params));
        $qms = array_fill(0, count($params), '?');
        $qms = implode(',', $qms);
        $sql = "INSERT INTO {" . $table . "} ($fields) VALUES($qms)";
        $this->do_query($sql, $params, SQL_QUERY_INSERT);

        if ($customsequence) {
            // Enable IDENTITY column after inserting record with id, only if the
            // column is identity, from meta information.
            if ($isidentity) {
                $sql = 'SET IDENTITY_INSERT {' . $table . '} OFF'; // Yes, it' OFF!!
                $this->do_query($sql, null, SQL_QUERY_AUX);
            }
        }

        if ($returnid) {
            $id = $this->sqlsrv_fetch_id();
            return $id;
        } else {
            return true;
        }
    }

    /**
     * Get the ID of the current action
     *
     * @return bool|int ID
     */
    private function sqlsrv_fetch_id(): bool|int {
        $queryid = sqlsrv_query($this->sqlsrv, 'SELECT SCOPE_IDENTITY()');
        if ($queryid === false) {
            $dberr = $this->get_last_error();
            return false;
        }
        $row = $this->sqlsrv_fetchrow($queryid);
        return (int) $row[0];
    }

    /**
     * Fetch a single row into an numbered array
     *
     * @param mixed $queryid
     */
    private function sqlsrv_fetchrow($queryid) {
        $row = sqlsrv_fetch_array($queryid, SQLSRV_FETCH_NUMERIC);
        if ($row === false) {
            $dberr = $this->get_last_error();
            return false;
        }

        foreach ($row as $key => $value) {
            $row[$key] = ($value === ' ' || $value === null) ? '' : $value;
        }
        return $row;
    }

    #[\Override]
    public function insert_record($table, $dataobject, $returnid = true, $bulk = false): bool|int {
        $dataobject = (array)$dataobject;

        $columns = $this->get_columns($table);
        if (empty($columns)) {
            throw new dml_exception('ddltablenotexist', $table);
        }

        $cleaned = [];

        foreach ($dataobject as $field => $value) {
            if ($field === 'id') {
                continue;
            }
            if (!isset($columns[$field])) {
                continue;
            }
            $column = $columns[$field];
            $cleaned[$field] = $this->normalise_value($column, $value);
        }

        return $this->insert_record_raw($table, $cleaned, $returnid, $bulk);
    }

    #[\Override]
    public function import_record($table, $dataobject) {
        if (!is_object($dataobject)) {
            $dataobject = (object)$dataobject;
        }

        $columns = $this->get_columns($table);
        $cleaned = [];

        foreach ($dataobject as $field => $value) {
            if (!isset($columns[$field])) {
                continue;
            }
            $column = $columns[$field];
            $cleaned[$field] = $this->normalise_value($column, $value);
        }

        $this->insert_record_raw($table, $cleaned, false, false, true);

        return true;
    }

    /**
     * Update record in database, as fast as possible, no safety checks, lobs not supported.
     *
     * @param string $table name
     * @param stdClass|array $params data record as object or array
     * @param bool true means repeated updates expected
     * @return bool true
     * @throws dml_exception A DML specific exception is thrown for any errors.
     */
    #[\Override]
    public function update_record_raw($table, $params, $bulk = false): bool {
        $params = (array)$params;

        if (!isset($params['id'])) {
            throw new coding_exception('moodle_database::update_record_raw() id field must be specified.');
        }
        $id = $params['id'];
        unset($params['id']);

        if (empty($params)) {
            throw new coding_exception('moodle_database::update_record_raw() no fields found.');
        }

        $sets = [];

        foreach ($params as $field => $value) {
            $sets[] = "$field = ?";
        }

        // The last ? in the WHERE condition.
        $params[] = $id;

        $sets = implode(',', $sets);
        $sql = "UPDATE {" . $table . "} SET $sets WHERE id = ?";

        $this->do_query($sql, $params, SQL_QUERY_UPDATE);

        return true;
    }

    #[\Override]
    public function update_record($table, $dataobject, $bulk = false): bool {
        $dataobject = (array)$dataobject;

        $columns = $this->get_columns($table);
        $cleaned = [];

        foreach ($dataobject as $field => $value) {
            if (!isset($columns[$field])) {
                continue;
            }
            $column = $columns[$field];
            $cleaned[$field] = $this->normalise_value($column, $value);
        }

        return $this->update_record_raw($table, $cleaned, $bulk);
    }

    #[\Override]
    public function set_field_select($table, $newfield, $newvalue, $select, ?array $params = null): bool {
        if ($select) {
            $select = "WHERE $select";
        }

        if (is_null($params)) {
            $params = [];
        }

        // Convert params to ? types.
        [$select, $params, $type] = $this->fix_sql_params($select, $params);

        // Get column metadata.
        $columns = $this->get_columns($table);
        $column = $columns[$newfield];

        $newvalue = $this->normalise_value($column, $newvalue);

        if (is_null($newvalue)) {
            $newfield = "$newfield = NULL";
        } else {
            $newfield = "$newfield = ?";
            array_unshift($params, $newvalue);
        }
        $sql = "UPDATE {" . $table . "} SET $newfield $select";

        $this->do_query($sql, $params, SQL_QUERY_UPDATE);

        return true;
    }

    #[\Override]
    public function delete_records_select($table, $select, ?array $params = null): bool {
        if ($select) {
            $select = "WHERE $select";
        }

        $sql = "DELETE FROM {" . $table . "} $select";

        // Use SQL_QUERY_UPDATE because we do not know what is in general SQL, delete constant would not be accurate.
        $this->do_query($sql, $params, SQL_QUERY_UPDATE);

        return true;
    }

    #[\Override]
    public function sql_cast_to_char(string $field): string {
        return " CAST({$field} AS NVARCHAR(MAX)) ";
    }

    #[\Override]
    public function sql_cast_char2int(string $fieldname, bool $text = false): string {
        if (!$text) {
            return " CAST({$fieldname} AS INT) ";
        } else {
            return ' CAST(' . $this->sql_compare_text($fieldname) . ' AS INT) ';
        }
    }

    #[\Override]
    public function sql_cast_char2real(string $fieldname, bool $text = false): string {
        if (!$text) {
            return ' CAST(' . $fieldname . ' AS REAL) ';
        } else {
            return ' CAST(' . $this->sql_compare_text($fieldname) . ' AS REAL) ';
        }
    }

    #[\Override]
    public function sql_ceil(string $fieldname): string {
        return " CEILING({$fieldname})";
    }


    /**
     * Returns the current database collation.
     *
     * @return ?string or null MySQL collation name
     */
    protected function get_collation(): ?string {
        if (isset($this->collation)) {
            return $this->collation;
        }
        if (!empty($this->dboptions['dbcollation'])) {
            // Perf speedup.
            $this->collation = $this->dboptions['dbcollation'];
            return $this->collation;
        }

        // Make some default.
        $this->collation = 'Latin1_General_CI_AI';

        $sql = "SELECT CAST(DATABASEPROPERTYEX('$this->dbname', 'Collation') AS varchar(255)) AS SQLCollation";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = sqlsrv_query($this->sqlsrv, $sql);
        $this->query_end($result);

        if ($result) {
            if ($rawcolumn = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC)) {
                $this->collation = reset($rawcolumn);
            }
            $this->free_result($result);
        }

        return $this->collation;
    }

    #[\Override]
    public function sql_equal(
        string $fieldname,
        string $param,
        bool $casesensitive = true,
        bool $accentsensitive = true,
        bool $notequal = false,
    ): string {
        $equalop = $notequal ? '<>' : '=';
        $collation = $this->get_collation();

        if ($casesensitive) {
            $collation = str_replace('_CI', '_CS', $collation);
        } else {
            $collation = str_replace('_CS', '_CI', $collation);
        }
        if ($accentsensitive) {
            $collation = str_replace('_AI', '_AS', $collation);
        } else {
            $collation = str_replace('_AS', '_AI', $collation);
        }

        return "$fieldname COLLATE $collation $equalop $param";
    }

    #[\Override]
    public function sql_like(
        string $fieldname,
        string $param,
        bool $casesensitive = true,
        bool $accentsensitive = true,
        bool $notlike = false,
        string $escapechar = '\\',
    ): string {
        if (strpos($param, '%') !== false) {
            debugging('Potential SQL injection detected, sql_like() expects bound parameters (? or :named)');
        }

        $collation = $this->get_collation();
        $like = $notlike ? 'NOT LIKE' : 'LIKE';

        if ($casesensitive) {
            $collation = str_replace('_CI', '_CS', $collation);
        } else {
            $collation = str_replace('_CS', '_CI', $collation);
        }
        if ($accentsensitive) {
            $collation = str_replace('_AI', '_AS', $collation);
        } else {
            $collation = str_replace('_AS', '_AI', $collation);
        }

        return "{$fieldname} COLLATE {$collation} {$like} {$param} ESCAPE '{$escapechar}'";
    }

    #[\Override]
    public function sql_like_escape(
        string $text,
        string $escapechar = '\\',
    ): string {
        $text = parent::sql_like_escape($text, $escapechar);

        $text = str_replace('[', $escapechar . '[', $text);
        $text = str_replace(']', $escapechar . ']', $text);

        return $text;
    }

    #[\Override]
    public function sql_concat(...$arr): string {
        foreach ($arr as $key => $ele) {
            $arr[$key] = $this->sql_cast_to_char($ele);
        }
        $s = implode(' + ', $arr);

        if ($s === '') {
            return " '' ";
        }
        return " $s ";
    }

    #[\Override]
    public function sql_concat_join($separator = "' '", $elements = []): string {
        for ($n = count($elements) - 1; $n > 0; $n--) {
            array_splice($elements, $n, 0, $separator);
        }
        return call_user_func_array([$this, 'sql_concat'], array_values($elements));
    }

    #[\Override]
    public function sql_group_concat(string $field, string $separator = ', ', string $sort = ''): string {
        $fieldsort = $sort ? "WITHIN GROUP (ORDER BY {$sort})" : '';
        return "STRING_AGG({$field}, '{$separator}') {$fieldsort}";
    }

    #[\Override]
    public function sql_isempty(
        string $tablename,
        string $fieldname,
        bool $nullablefield,
        bool $textfield,
    ): string {
        if ($textfield) {
            return ' (' . $this->sql_compare_text($fieldname) . " = '') ";
        } else {
            return " ($fieldname = '') ";
        }
    }

    #[\Override]
    public function sql_length(string $fieldname): string {
        return " LEN({$fieldname})";
    }

    #[\Override]
    public function sql_order_by_text(string $fieldname, int $numchars = 32): string {
        return " CONVERT(varchar({$numchars}), {$fieldname})";
    }

    #[\Override]
    public function sql_position(string $needle, string $haystack): string {
        return "CHARINDEX(($needle), ($haystack))";
    }

    #[\Override]
    public function sql_substr(string $expr, $start, $length = false): string {
        if (count(func_get_args()) < 2) {
            throw new coding_exception(
                'moodle_database::sql_substr() requires at least two parameters',
                'Originally this function was only returning name of SQL substring function, it now requires all parameters.'
            );
        }

        if ($length === false) {
            return "SUBSTRING($expr, " . $this->sql_cast_char2int($start) . ", 2^31-1)";
        } else {
            return "SUBSTRING($expr, " . $this->sql_cast_char2int($start) . ", " . $this->sql_cast_char2int($length) . ")";
        }
    }

    #[\Override]
    public function replace_all_text_supported(): bool {
        return true;
    }

    #[\Override]
    public function session_lock_supported(): bool {
        return true;
    }

    #[\Override]
    public function get_session_lock($rowid, $timeout): void {
        if (!$this->session_lock_supported()) {
            return;
        }
        parent::get_session_lock($rowid, $timeout);

        $timeoutmilli = $timeout * 1000;

        $fullname = $this->dbname . '-' . $this->prefix . '-session-' . $rowid;
        // While this may work using proper {call sp_...} calls + binding +
        // executing + consuming recordsets, the solution used for the mssql
        // driver is working perfectly, so 100% mimic-ing that code.
        $sql = "BEGIN
                    DECLARE @result INT
                    EXECUTE @result = sp_getapplock @Resource='$fullname',
                                                    @LockMode='Exclusive',
                                                    @LockOwner='Session',
                                                    @LockTimeout='$timeoutmilli'
                    SELECT @result
                END";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = sqlsrv_query($this->sqlsrv, $sql);
        $this->query_end($result);

        if ($result) {
            $row = sqlsrv_fetch_array($result);
            if ($row[0] < 0) {
                throw new sessionwait_exception();
            }
        }

        $this->free_result($result);
    }

    #[\Override]
    public function release_session_lock(int $rowid): void {
        if (!$this->session_lock_supported()) {
            return;
        }
        if (!$this->is_used_for_db_sessions()) {
            return;
        }

        parent::release_session_lock($rowid);

        $fullname = $this->dbname . '-' . $this->prefix . '-session-' . $rowid;
        $sql = "sp_releaseapplock '$fullname', 'Session'";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = sqlsrv_query($this->sqlsrv, $sql);
        $this->query_end($result);
        $this->free_result($result);
    }

    #[\Override]
    protected function begin_transaction(): void {
        // Recordsets do not work well with transactions in SQL Server,
        // let's prefetch the recordsets to memory to work around these problems.
        foreach ($this->recordsets as $rs) {
            $rs->transaction_starts();
        }

        $this->query_start('native sqlsrv_begin_transaction', null, SQL_QUERY_AUX);
        $result = sqlsrv_begin_transaction($this->sqlsrv);
        $this->query_end($result);
    }

    #[\Override]
    protected function commit_transaction(): void {
        $this->query_start('native sqlsrv_commit', null, SQL_QUERY_AUX);
        $result = sqlsrv_commit($this->sqlsrv);
        $this->query_end($result);
    }

    #[\Override]
    protected function rollback_transaction(): void {
        $this->query_start('native sqlsrv_rollback', null, SQL_QUERY_AUX);
        $result = sqlsrv_rollback($this->sqlsrv);
        $this->query_end($result);
    }

    #[\Override]
    public function is_fulltext_search_supported(): bool {
        global $CFG;

        $sql = "SELECT FULLTEXTSERVICEPROPERTY('IsFullTextInstalled')";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = sqlsrv_query($this->sqlsrv, $sql);
        $this->query_end($result);
        if ($result) {
            if ($row = sqlsrv_fetch_array($result)) {
                $property = (bool)reset($row);
            }
        }
        $this->free_result($result);

        return !empty($property);
    }
}

// Alias this class to the old name.
// This file will be autoloaded by the legacyclasses autoload system.
// In future all uses of this class will be corrected and the legacy references will be removed.
class_alias(database::class, \sqlsrv_native_moodle_database::class);
