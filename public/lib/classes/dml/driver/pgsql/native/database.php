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

namespace core\dml\driver\pgsql\native;

use core\dml\database_column_info;
use core\dml\exception\exception as dml_exception;
use core\dml\exception\connection_exception;
use core\dml\exception\sessionwait_exception;
use core\dml\read_replica_trait;
use core\exception\coding_exception;
use core\exception\moodle_exception;
use ddl_change_structure_exception;
use PgSql;
use stdClass;
use Traversable;

/**
 * Native pgsql class representing moodle database interface.
 *
 * @package    core_dml
 * @copyright  2008 Petr Skoda (http://skodak.org)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class database extends \core\dml\database {
    use read_replica_trait {
        select_db_handle as read_replica_select_db_handle;
        can_use_readonly as read_replica_can_use_readonly;
        query_start as read_replica_query_start;
        query_end as read_replica_query_end;
    }

    /** @var array $sslmodes */
    private static array $sslmodes = [
        'disable',
        'prefer',
        'require',
        'verify-full',
    ];

    /** @var array $serverinfo Cache of server information */
    private array $serverinfo = [];

    /** @var array $dbhcursor keep track of open cursors */
    private array $dbhcursor = [];

    /** @var PgSql\Connection|null $pgsql database resource */
    protected mixed $pgsql = null;

    /**
     * @var int The value of the error_reporting before changes were made
     *
     * Used to handle pgsql driver default verbosity.
     */
    protected int $lasterrorreporting;

    /** @var bool savepoint hack for MDL-35506 - workaround for automatic transaction rollback on error */
    protected bool $savepointpresent = false;

    /** @var int Number of cursors used (for constructing a unique ID) */
    protected int $cursorcount = 0;

    /** @var int Default number of rows to fetch at a time when using recordsets with cursors */
    public const DEFAULT_FETCH_BUFFER_SIZE = 100000;

    #[\Override]
    public function driver_installed(): bool|string {
        if (!extension_loaded('pgsql')) {
            return get_string('pgsqlextensionisnotpresentinphp', 'install');
        }
        return true;
    }

    #[\Override]
    public function get_dbfamily(): string {
        return 'postgres';
    }

    #[\Override]
    protected function get_dbtype(): string {
        return 'pgsql';
    }

    #[\Override]
    protected function get_dblibrary(): string {
        return 'native';
    }

    #[\Override]
    public function get_name(): string {
        return get_string('nativepgsql', 'install');
    }

    #[\Override]
    public function get_configuration_help(): string {
        return get_string('nativepgsqlhelp', 'install');
    }

    /**
     * Connect to the database server.
     *
     * @param string $dbhost The database host.
     * @param string $dbuser The database username.
     * @param string $dbpass The database username's password.
     * @param string $dbname The name of the database being connected to.
     * @param mixed $prefix string means moodle db prefix, false used for external databases where prefix not used
     * @param array $dboptions driver specific options
     * @return bool true
     * @throws moodle_exception
     * @throws connection_exception if error
     */
    public function raw_connect(
        string $dbhost,
        string $dbuser,
        string $dbpass,
        string $dbname,
        $prefix,
        ?array $dboptions = null,
    ): bool {
        if ($prefix == '' && !$this->external) {
            // Enforce prefixes for everybody but mysql.
            throw new dml_exception('prefixcannotbeempty', $this->get_dbfamily());
        }

        $driverstatus = $this->driver_installed();

        if ($driverstatus !== true) {
            throw new dml_exception('dbdriverproblem', $driverstatus);
        }

        $this->store_settings($dbhost, $dbuser, $dbpass, $dbname, $prefix, $dboptions);

        $pass = addcslashes($this->dbpass, "'\\");

        // Unix socket connections should have lower overhead.
        if (!empty($this->dboptions['dbsocket']) && ($this->dbhost === 'localhost' || $this->dbhost === '127.0.0.1')) {
            $connection = "user='$this->dbuser' password='$pass' dbname='$this->dbname'";
            if (strpos($this->dboptions['dbsocket'], '/') !== false) {
                // A directory was specified as the socket location.
                $connection .= " host='" . $this->dboptions['dbsocket'] . "'";
            }
            if (!empty($this->dboptions['dbport'])) {
                // A port as specified, add it to the connection as it's used as part of the socket path.
                $connection .= " port ='" . $this->dboptions['dbport'] . "'";
            }
        } else {
            $this->dboptions['dbsocket'] = '';
            if (empty($this->dbname)) {
                // Probably old style socket connection - do not add port.
                $port = "";
            } else if (empty($this->dboptions['dbport'])) {
                $port = "port ='5432'";
            } else {
                $port = "port ='" . $this->dboptions['dbport'] . "'";
            }
            $connection = "host='$this->dbhost' $port user='$this->dbuser' password='$pass' dbname='$this->dbname'";
        }

        if (!empty($this->dboptions['connecttimeout'])) {
            $connection .= " connect_timeout=" . $this->dboptions['connecttimeout'];
        }

        if (empty($this->dboptions['dbhandlesoptions'])) {
            // ALTER USER and ALTER DATABASE are overridden by these settings.
            $options = ['--client_encoding=utf8', '--standard_conforming_strings=on'];
            // Select schema if specified, otherwise the first one wins.
            if (!empty($this->dboptions['dbschema'])) {
                $options[] = "-c search_path=" . addcslashes($this->dboptions['dbschema'], "'\\");
            }

            $connection .= " options='" . implode(' ', $options) . "'";
        }

        if (isset($this->dboptions['ssl'])) {
            $sslmode = $this->dboptions['ssl'];
            if (!in_array($sslmode, self::$sslmodes, true)) {
                throw new moodle_exception('validateerrorlist', 'admin', '', "'dboptions''ssl': $sslmode");
            }
            $connection .= " sslmode=$sslmode";
        }

        ob_start();
        // It seems that pg_connect() handles some errors differently.
        // For example, name resolution error will raise an exception, and non-existing
        // database or wrong credentials will just return false.
        // We need to cater for both.
        try {
            if (empty($this->dboptions['dbpersist'])) {
                $this->pgsql = pg_connect($connection, PGSQL_CONNECT_FORCE_NEW);
            } else {
                $this->pgsql = pg_pconnect($connection, PGSQL_CONNECT_FORCE_NEW);
            }
            $dberr = ob_get_contents();
        } catch (\Exception $e) {
            $dberr = $e->getMessage();
        }
        ob_end_clean();

        $status = $this->pgsql ? pg_connection_status($this->pgsql) : false;

        if ($status === false || $status === PGSQL_CONNECTION_BAD) {
            $this->pgsql = null;
            throw new connection_exception($dberr);
        }

        if (!empty($this->dboptions['dbpersist'])) {
            // There are rare situations (such as PHP out of memory errors) when open cursors may
            // not be closed at the end of a connection. When using persistent connections, the
            // cursors remain open and 'get in the way' of future connections. To avoid this
            // problem, close all cursors here.
            $result = pg_query($this->pgsql, 'CLOSE ALL');
            if ($result) {
                pg_free_result($result);
            }
        }

        if (!empty($this->dboptions['dbhandlesoptions'])) {
            /* We don't trust people who just set the dbhandlesoptions, this code checks up on them.
             * These functions do not talk to the server, they use the client library knowledge to determine state.
             */
            if (!empty($this->dboptions['dbschema'])) {
                throw new connection_exception('You cannot specify a schema with dbhandlesoptions, use the database to set it.');
            }
            if (pg_client_encoding($this->pgsql) != 'UTF8') {
                throw new connection_exception('client_encoding = UTF8 not set, it is: ' . pg_client_encoding($this->pgsql));
            }
            if (pg_escape_string($this->pgsql, '\\') != '\\') {
                throw new connection_exception('standard_conforming_strings = on, must be set at the database.');
            }
        }

        // Connection stabilised and configured, going to instantiate the temptables controller.
        $this->temptables = new temptables($this);

        return true;
    }

    /**
     * Close database connection and release all resources and memory (especially circular memory references).
     *
     * Note: Do NOT use connect() again, create a new instance if needed.
     */
    public function dispose(): void {
        // Call parent dispose to write/close session and other common stuff before closing connection.
        parent::dispose();
        if ($this->pgsql) {
            pg_close($this->pgsql);
            $this->pgsql = null;
        }
    }

    /**
     * Gets db handle currently used with queries
     *
     * @return PgSql\Connection|null
     */
    protected function get_db_handle(): mixed {
        return $this->pgsql;
    }

    /**
     * Sets db handle to be used with subsequent queries
     * @param PgSql\Connection $dbh
     */
    protected function set_db_handle(mixed $dbh): void {
        $this->pgsql = $dbh;
    }

    /**
     * Select appropriate db handle - readwrite or readonly.
     *
     * @param int $type type of query
     * @param string $sql
     */
    protected function select_db_handle(int $type, string $sql): void {
        $this->read_replica_select_db_handle($type, $sql);

        if (preg_match('/^DECLARE (crs\w*) NO SCROLL CURSOR/', $sql, $match)) {
            $cursor = $match[1];
            $this->dbhcursor[$cursor] = $this->pgsql;
        }
        if (preg_match('/^(?:FETCH \d+ FROM|CLOSE) (crs\w*)\b/', $sql, $match)) {
            $cursor = $match[1];
            $this->pgsql = $this->dbhcursor[$cursor];
        }
    }

    /**
     * Check if The query qualifies for readonly connection execution.
     *
     * Logging queries are exempt, those are write operations that circumvent standard query_start/query_end paths.
     *
     * @param int $type type of query
     * @param string $sql
     * @return bool
     */
    protected function can_use_readonly(int $type, string $sql): bool {
        // All `pg_*lock` queries always go to primary.
        if (preg_match('/\bpg_\w*lock/', $sql)) {
            return false;
        }

        // Unfortunately pg_catalog cannot use readonly - temptables use this.
        if (preg_match('/\bpg_catalog/', $sql) && $this->temptables->get_temptables()) {
            return false;
        }

        return $this->read_replica_can_use_readonly($type, $sql);
    }

    #[\Override]
    protected function query_start(string $sql, ?array $params, $type, $extrainfo = null): void {
        $this->read_replica_query_start($sql, $params, $type, $extrainfo);
        // The pgsql driver tends to send debug to output, we do not need that.
        $this->lasterrorreporting = error_reporting(0);
    }

    #[\Override]
    protected function query_end(mixed $result): void {
        // Reset original debug level.
        error_reporting($this->lasterrorreporting);
        try {
            $this->read_replica_query_end($result);
            if (
                $this->savepointpresent &&
                    !in_array(
                        $this->lasttype,
                        [SQL_QUERY_AUX, SQL_QUERY_AUX_READONLY, SQL_QUERY_SELECT],
                        true
                    )
            ) {
                $res = @pg_query($this->pgsql, "RELEASE SAVEPOINT moodle_pg_savepoint; SAVEPOINT moodle_pg_savepoint");
                if ($res) {
                    pg_free_result($res);
                }
            }
        } catch (\Exception $e) {
            if ($this->savepointpresent) {
                $res = @pg_query($this->pgsql, "ROLLBACK TO SAVEPOINT moodle_pg_savepoint; SAVEPOINT moodle_pg_savepoint");
                if ($res) {
                    pg_free_result($res);
                }
            }
            throw $e;
        }
    }

    /**
     * Returns database server info array.
     *
     * @return array Array containing 'description' and 'version' info
     */
    public function get_server_info(): array {
        if (empty($this->serverinfo)) {
            $this->query_start('--pg_version()', null, SQL_QUERY_AUX);
            $this->serverinfo = pg_version($this->pgsql);
            $this->query_end(true);
        }
        return [
            'description' => $this->serverinfo['server'],
            'version' => $this->serverinfo['server'],
        ];
    }

    #[\Override]
    protected function allowed_param_types(): int {
        return SQL_PARAMS_DOLLAR;
    }

    #[\Override]
    public function get_last_error(): string {
        return pg_last_error($this->pgsql);
    }

    #[\Override]
    public function get_tables(bool $usecache = true): array {
        if ($usecache && $this->tables !== null) {
            return $this->tables;
        }
        $this->tables = [];
        $prefix = str_replace('_', '|_', $this->prefix);
        $sql = "SELECT c.relname
                  FROM pg_catalog.pg_class c
                  JOIN pg_catalog.pg_namespace as ns ON ns.oid = c.relnamespace
                 WHERE c.relname LIKE '$prefix%' ESCAPE '|'
                       AND c.relkind = 'r'
                       AND (ns.nspname = current_schema() OR ns.oid = pg_my_temp_schema())";
        $this->query_start($sql, null, SQL_QUERY_AUX_READONLY);
        $result = pg_query($this->pgsql, $sql);
        $this->query_end($result);

        if ($result) {
            while ($row = pg_fetch_row($result)) {
                $tablename = reset($row);
                if ($this->prefix !== false && $this->prefix !== '') {
                    if (strpos($tablename, $this->prefix) !== 0) {
                        continue;
                    }
                    $tablename = substr($tablename, strlen($this->prefix));
                }
                $this->tables[$tablename] = $tablename;
            }
            pg_free_result($result);
        }
        return $this->tables;
    }

    /**
     * Constructs 'IN()' or '=' sql fragment
     *
     * Method overriding {@see moodle_database::get_in_or_equal} to be able to use
     * more than 65535 elements in $items array.
     *
     * @param mixed $items A single value or array of values for the expression.
     * @param int $type Parameter bounding type : SQL_PARAMS_QM or SQL_PARAMS_NAMED.
     * @param string $prefix Named parameter placeholder prefix (a unique counter value is appended to each parameter name).
     * @param bool $equal True means we want to equate to the constructed expression, false means we don't want to equate to it.
     * @param mixed $onemptyitems This defines the behavior when the array of items provided is empty. Defaults to false,
     *              meaning throw exceptions. Other values will become part of the returned SQL fragment.
     * @throws coding_exception | dml_exception
     * @return array A list containing the constructed sql fragment and an array of parameters.
     */
    #[\Override]
    public function get_in_or_equal($items, $type = SQL_PARAMS_QM, $prefix = 'param', $equal = true, $onemptyitems = false): array {
        // We only interfere if number of items in expression exceeds 16 bit value.
        if (!is_array($items) || count($items) < 65535) {
            return parent::get_in_or_equal($items, $type, $prefix, $equal, $onemptyitems);
        }

        // Determine the type from the first value. We don't need to be very smart here,
        // it is developer's responsibility to make sure that variable type is matching
        // field type, if not the case, DB engine will hint. Also mixing types won't work
        // here anyway, so we ignore NULL or boolean (unlikely you need 56k values of
        // these types only).
        $cast = is_string(current($items)) ? '::text' : '::bigint';

        if ($type == SQL_PARAMS_QM) {
            if ($equal) {
                $sql = 'IN (VALUES (' . implode('),(', array_fill(0, count($items), '?' . $cast)) . '))';
            } else {
                $sql = 'NOT IN (VALUES (' . implode('),(', array_fill(0, count($items), '?' . $cast)) . '))';
            }
            $params = array_values($items);
        } else if ($type == SQL_PARAMS_NAMED) {
            if (empty($prefix)) {
                $prefix = 'param';
            }
            $params = [];
            $sql = [];
            foreach ($items as $item) {
                $param = $prefix . $this->inorequaluniqueindex++;
                $params[$param] = $item;
                $sql[] = ':' . $param . $cast;
            }
            if ($equal) {
                $sql = 'IN (VALUES (' . implode('),(', $sql) . '))';
            } else {
                $sql = 'NOT IN (VALUES (' . implode('),(', $sql) . '))';
            }
        } else {
            throw new dml_exception('typenotimplement');
        }
        return [$sql, $params];
    }

    #[\Override]
    public function get_indexes(string $table): array {
        $indexes = [];
        $tablename = $this->prefix . $table;

        $sql = "SELECT i.*
                  FROM pg_catalog.pg_indexes i
                  JOIN pg_catalog.pg_namespace as ns ON ns.nspname = i.schemaname
                 WHERE i.tablename = '$tablename'
                       AND (i.schemaname = current_schema() OR ns.oid = pg_my_temp_schema())";

        $this->query_start($sql, null, SQL_QUERY_AUX_READONLY);
        $result = pg_query($this->pgsql, $sql);
        $this->query_end($result);

        if ($result) {
            while ($row = pg_fetch_assoc($result)) {
                // The index definition could be generated schema-qualifying the target table name
                // for safety, depending on the pgsql version (CVE-2018-1058).
                if (
                    !preg_match(
                        '/CREATE (|UNIQUE )INDEX ([^\s]+) ON (|'
                            . $row['schemaname'] . '\.)' . $tablename
                            . ' USING ([^\s]+) \(([^\)]+)\)/i',
                        $row['indexdef'],
                        $matches,
                    )
                ) {
                    continue;
                }
                if ($matches[5] === 'id') {
                    continue;
                }
                $columns = explode(',', $matches[5]);
                foreach ($columns as $k => $column) {
                    $column = trim($column);
                    if ($pos = strpos($column, ' ')) {
                        // Index type is separated by space.
                        $column = substr($column, 0, $pos);
                    }
                    $columns[$k] = $this->trim_quotes($column);
                }
                $indexes[$row['indexname']] = ['unique' => !empty($matches[1]),
                                              'columns' => $columns];
            }
            pg_free_result($result);
        }
        return $indexes;
    }

    #[\Override]
    protected function fetch_columns(string $table): array {
        $structure = [];

        $tablename = $this->prefix . $table;

        $sql = "SELECT a.attnum, a.attname AS field, t.typname AS type, a.attlen, a.atttypmod, a.attnotnull, a.atthasdef,
                       CASE WHEN a.atthasdef THEN pg_catalog.pg_get_expr(d.adbin, d.adrelid) ELSE '' END AS adsrc
                  FROM pg_catalog.pg_class c
                  JOIN pg_catalog.pg_namespace as ns ON ns.oid = c.relnamespace
                  JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid
                  JOIN pg_catalog.pg_type t ON t.oid = a.atttypid
             LEFT JOIN pg_catalog.pg_attrdef d ON (d.adrelid = c.oid AND d.adnum = a.attnum)
                 WHERE relkind = 'r' AND c.relname = '$tablename' AND c.reltype > 0 AND a.attnum > 0
                       AND (ns.nspname = current_schema() OR ns.oid = pg_my_temp_schema())
              ORDER BY a.attnum";

        $this->query_start($sql, null, SQL_QUERY_AUX_READONLY);
        $result = pg_query($this->pgsql, $sql);
        $this->query_end($result);

        if (!$result) {
            return [];
        }
        while ($rawcolumn = pg_fetch_object($result)) {
            $info = new stdClass();
            $info->name = $rawcolumn->field;
            $matches = null;

            if ($rawcolumn->type === 'varchar') {
                $info->type          = 'varchar';
                $info->meta_type     = 'C';
                $info->max_length    = $rawcolumn->atttypmod - 4;
                $info->scale         = null;
                $info->not_null      = ($rawcolumn->attnotnull === 't');
                $info->has_default   = ($rawcolumn->atthasdef === 't');
                if ($info->has_default) {
                    $parts = explode('::', $rawcolumn->adsrc);
                    if (count($parts) > 1) {
                        $info->default_value = reset($parts);
                        $info->default_value = trim($info->default_value, "'");
                    } else {
                        $info->default_value = $rawcolumn->adsrc;
                    }
                } else {
                    $info->default_value = null;
                }
                $info->primary_key   = false;
                $info->binary        = false;
                $info->unsigned      = null;
                $info->auto_increment = false;
                $info->unique        = null;
            } else if (preg_match('/int(\d)/i', $rawcolumn->type, $matches)) {
                $info->type = 'int';
                if (strpos($rawcolumn->adsrc ?? '', 'nextval') === 0) {
                    $info->primary_key   = true;
                    $info->meta_type     = 'R';
                    $info->unique        = true;
                    $info->auto_increment = true;
                    $info->has_default   = false;
                } else {
                    $info->primary_key   = false;
                    $info->meta_type     = 'I';
                    $info->unique        = null;
                    $info->auto_increment = false;
                    $info->has_default   = ($rawcolumn->atthasdef === 't');
                }
                // Return number of decimals, not bytes here.
                if ($matches[1] >= 8) {
                    $info->max_length = 18;
                } else if ($matches[1] >= 4) {
                    $info->max_length = 9;
                } else if ($matches[1] >= 2) {
                    $info->max_length = 4;
                } else if ($matches[1] >= 1) {
                    $info->max_length = 2;
                } else {
                    $info->max_length = 0;
                }
                $info->scale         = null;
                $info->not_null      = ($rawcolumn->attnotnull === 't');
                if ($info->has_default) {
                    // PG 9.5+ uses ::<TYPE> syntax for some defaults.
                    $parts = explode('::', $rawcolumn->adsrc);
                    if (count($parts) > 1) {
                        $info->default_value = reset($parts);
                    } else {
                        $info->default_value = $rawcolumn->adsrc;
                    }
                    $info->default_value = trim($info->default_value, "()'");
                } else {
                    $info->default_value = null;
                }
                $info->binary        = false;
                $info->unsigned      = false;
            } else if ($rawcolumn->type === 'numeric') {
                $info->type = $rawcolumn->type;
                $info->meta_type     = 'N';
                $info->primary_key   = false;
                $info->binary        = false;
                $info->unsigned      = null;
                $info->auto_increment = false;
                $info->unique        = null;
                $info->not_null      = ($rawcolumn->attnotnull === 't');
                $info->has_default   = ($rawcolumn->atthasdef === 't');
                if ($info->has_default) {
                    // PG 9.5+ uses ::<TYPE> syntax for some defaults.
                    $parts = explode('::', $rawcolumn->adsrc);
                    if (count($parts) > 1) {
                        $info->default_value = reset($parts);
                    } else {
                        $info->default_value = $rawcolumn->adsrc;
                    }
                    $info->default_value = trim($info->default_value, "()'");
                } else {
                    $info->default_value = null;
                }
                $info->max_length    = $rawcolumn->atttypmod >> 16;
                $info->scale         = ($rawcolumn->atttypmod & 0xFFFF) - 4;
            } else if (preg_match('/float(\d)/i', $rawcolumn->type, $matches)) {
                $info->type = 'float';
                $info->meta_type     = 'N';
                $info->primary_key   = false;
                $info->binary        = false;
                $info->unsigned      = null;
                $info->auto_increment = false;
                $info->unique        = null;
                $info->not_null      = ($rawcolumn->attnotnull === 't');
                $info->has_default   = ($rawcolumn->atthasdef === 't');
                if ($info->has_default) {
                    // PG 9.5+ uses ::<TYPE> syntax for some defaults.
                    $parts = explode('::', $rawcolumn->adsrc);
                    if (count($parts) > 1) {
                        $info->default_value = reset($parts);
                    } else {
                        $info->default_value = $rawcolumn->adsrc;
                    }
                    $info->default_value = trim($info->default_value, "()'");
                } else {
                    $info->default_value = null;
                }
                // Just guess expected number of decimal places.
                // Note: This is not ideal.
                if ($matches[1] == 8) {
                    // Total 15 digits.
                    $info->max_length = 8;
                    $info->scale      = 7;
                } else {
                    // Total 6 digits.
                    $info->max_length = 4;
                    $info->scale      = 2;
                }
            } else if ($rawcolumn->type === 'text') {
                $info->type          = $rawcolumn->type;
                $info->meta_type     = 'X';
                $info->max_length    = -1;
                $info->scale         = null;
                $info->not_null      = ($rawcolumn->attnotnull === 't');
                $info->has_default   = ($rawcolumn->atthasdef === 't');
                if ($info->has_default) {
                    $parts = explode('::', $rawcolumn->adsrc);
                    if (count($parts) > 1) {
                        $info->default_value = reset($parts);
                        $info->default_value = trim($info->default_value, "'");
                    } else {
                        $info->default_value = $rawcolumn->adsrc;
                    }
                } else {
                    $info->default_value = null;
                }
                $info->primary_key   = false;
                $info->binary        = false;
                $info->unsigned      = null;
                $info->auto_increment = false;
                $info->unique        = null;
            } else if ($rawcolumn->type === 'bytea') {
                $info->type          = $rawcolumn->type;
                $info->meta_type     = 'B';
                $info->max_length    = -1;
                $info->scale         = null;
                $info->not_null      = ($rawcolumn->attnotnull === 't');
                $info->has_default   = false;
                $info->default_value = null;
                $info->primary_key   = false;
                $info->binary        = true;
                $info->unsigned      = null;
                $info->auto_increment = false;
                $info->unique        = null;
            }

            $structure[$info->name] = new database_column_info($info);
        }

        pg_free_result($result);

        return $structure;
    }

    #[\Override]
    protected function normalise_value(database_column_info $column, mixed $value): mixed {
        $this->detect_objects($value);

        if (is_bool($value)) {
            // Always, convert boolean to int.
            $value = (int)$value;
        } else if ($column->meta_type === 'B') {
            if (!is_null($value)) {
                // The `standard_conforming_strings` option must be enabled, otherwise pg_escape_bytea() will double escape `\`
                // and produce data errors.  This is set on the connection.
                $value = pg_escape_bytea($this->pgsql, $value);
            }
        } else if ($value === '') {
            if ($column->meta_type === 'I' || $column->meta_type === 'F' || $column->meta_type === 'N') {
                // Prevent '' problems in numeric fields.
                $value = 0;
            }
        }
        return $value;
    }

    #[\Override]
    public function setup_is_unicodedb(): bool {
        // Get PostgreSQL server_encoding value.
        $sql = 'SHOW server_encoding';
        $this->query_start($sql, null, SQL_QUERY_AUX_READONLY);
        $result = pg_query($this->pgsql, $sql);
        $this->query_end($result);

        if (!$result) {
            return false;
        }
        $rawcolumn = pg_fetch_object($result);
        $encoding = $rawcolumn->server_encoding;
        pg_free_result($result);

        return (strtoupper($encoding) == 'UNICODE' || strtoupper($encoding) == 'UTF8');
    }

    #[\Override]
    public function change_database_structure(
        string|array $sql,
        ?array $tablenames = null,
    ): bool {
        $this->get_manager();
        if (is_array($sql)) {
            $sql = implode("\n;\n", $sql);
        }
        if (!$this->is_transaction_started()) {
            // It is better to do all or nothing, this helps with recovery.
            $sql = "BEGIN ISOLATION LEVEL SERIALIZABLE;\n$sql\n; COMMIT";
        }

        try {
            $this->query_start($sql, null, SQL_QUERY_STRUCTURE);
            $result = pg_query($this->pgsql, $sql);
            $this->query_end($result);
            pg_free_result($result);
        } catch (ddl_change_structure_exception $e) {
            if (!$this->is_transaction_started()) {
                $result = @pg_query($this->pgsql, "ROLLBACK");
                @pg_free_result($result);
            }
            $this->reset_caches($tablenames);
            throw $e;
        }

        $this->reset_caches($tablenames);
        return true;
    }

    #[\Override]
    public function execute($sql, ?array $params = null): bool {
        [$sql, $params, $type] = $this->fix_sql_params($sql, $params);

        if (strpos($sql, ';') !== false) {
            throw new coding_exception(
                'moodle_database::execute() Multiple sql statements found or bound parameters not used properly in query!',
            );
        }

        $this->query_start($sql, $params, SQL_QUERY_UPDATE);
        $result = pg_query_params($this->pgsql, $sql, $params);
        $this->query_end($result);

        pg_free_result($result);
        return true;
    }

    #[\Override]
    public function get_recordset_sql(
        string $sql,
        ?array $params = null,
        string|int|null $limitfrom = 0,
        string|int|null $limitnum = 0,
    ): \core\dml\recordset {
        [$limitfrom, $limitnum] = $this->normalise_limit_from_num($limitfrom, $limitnum);

        if ($limitnum) {
            $sql .= " LIMIT $limitnum";
        }
        if ($limitfrom) {
            $sql .= " OFFSET $limitfrom";
        }

        [$sql, $params, $type] = $this->fix_sql_params($sql, $params);

        // For any query that doesn't explicitly specify a limit, we must use cursors to stop it
        // loading the entire thing (unless the config setting is turned off).
        $usecursors = !$limitnum && ($this->get_fetch_buffer_size() > 0);
        if ($usecursors) {
            // Work out the cursor unique identifer. This is based on a simple count used which
            // should be OK because the identifiers only need to be unique within the current
            // transaction.
            $this->cursorcount++;
            $cursorname = 'crs' . $this->cursorcount;

            // Do the query to a cursor.
            $sql = "DECLARE $cursorname NO SCROLL CURSOR WITH HOLD FOR $sql";
        } else {
            $cursorname = '';
        }

        $this->query_start($sql, $params, SQL_QUERY_SELECT);

        $result = pg_query_params($this->pgsql, $sql, $params);

        $this->query_end($result);
        if ($usecursors) {
            pg_free_result($result);
            $result = null;
        }

        return new recordset($result, $this, $cursorname);
    }

    /**
     * Gets size of fetch buffer used for recordset queries.
     *
     * If this returns 0 then cursors will not be used, meaning recordset queries will occupy enough
     * memory as needed for the Postgres library to hold the entire query results in memory.
     *
     * @return int Fetch buffer size or 0 indicating not to use cursors
     */
    protected function get_fetch_buffer_size(): int {
        if (array_key_exists('fetchbuffersize', $this->dboptions)) {
            return (int)$this->dboptions['fetchbuffersize'];
        } else {
            return self::DEFAULT_FETCH_BUFFER_SIZE;
        }
    }

    /**
     * Retrieves data from cursor. For use by recordset only; do not call directly.
     *
     * Return value contains the next batch of Postgres data, and a boolean indicating if this is
     * definitely the last batch (if false, there may be more)
     *
     * @param string $cursorname Name of cursor to read from
     * @return array Array with 2 elements (next data batch and boolean indicating last batch)
     */
    public function fetch_from_cursor($cursorname): array {
        $count = $this->get_fetch_buffer_size();

        $sql = 'FETCH ' . $count . ' FROM ' . $cursorname;

        $this->query_start($sql, [], SQL_QUERY_AUX);
        $result = pg_query($this->pgsql, $sql);
        $last = pg_num_rows($result) !== $count;

        $this->query_end($result);

        return [$result, $last];
    }

    /**
     * Closes a cursor. For use by recordset only; do not call directly.
     *
     * @param string $cursorname Name of cursor to close
     * @return bool True if we actually closed one, false if the transaction was cancelled
     */
    public function close_cursor($cursorname): bool {
        // If the transaction got cancelled, then ignore this request.
        $sql = 'CLOSE ' . $cursorname;
        $this->query_start($sql, [], SQL_QUERY_AUX);
        $result = pg_query($this->pgsql, $sql);
        $this->query_end($result);
        if ($result) {
            pg_free_result($result);
        }
        return true;
    }

    /**
     * A faster version of pg_field_type.
     *
     * The pg_field_type function in the php postgres driver internally makes an sql call
     * to get the list of field types which it statically caches only for a single request.
     * This wraps it in a cache keyed by oid to avoid these DB calls on every request.
     *
     * @param resource|PgSql\Result $result
     * @param int $fieldnumber
     * @return string Field type
     */
    public function pg_field_type($result, int $fieldnumber): mixed {
        static $map;
        $cache = $this->get_metacache();

        // Getting the oid doesn't make an internal query.
        $oid = pg_field_type_oid($result, $fieldnumber);
        if (!$map) {
            $map = $cache->get('oid2typname');
        }
        if ($map === false) {
            $map = [];
        }
        if (isset($map[$oid])) {
            return $map[$oid];
        }
        $map[$oid] = pg_field_type($result, $fieldnumber);
        $cache->set('oid2typname', $map);
        return $map[$oid];
    }

    #[\Override]
    public function get_records_sql(
        string $sql,
        ?array $params = null,
        string|int|null $limitfrom = 0,
        string|int|null $limitnum = 0,
    ): array {
        [$limitfrom, $limitnum] = $this->normalise_limit_from_num($limitfrom, $limitnum);

        if ($limitnum) {
            $sql .= " LIMIT $limitnum";
        }
        if ($limitfrom) {
            $sql .= " OFFSET $limitfrom";
        }

        [$sql, $params, $type] = $this->fix_sql_params($sql, $params);
        $this->query_start($sql, $params, SQL_QUERY_SELECT);
        $result = pg_query_params($this->pgsql, $sql, $params);
        $this->query_end($result);

        // Find out if there are any blobs.
        $numfields = pg_num_fields($result);
        $blobs = [];
        for ($i = 0; $i < $numfields; $i++) {
            $type = $this->pg_field_type($result, $i);
            if ($type == 'bytea') {
                $blobs[] = pg_field_name($result, $i);
            }
        }

        $return = [];
        while ($row = pg_fetch_assoc($result)) {
            $id = reset($row);
            if ($blobs) {
                foreach ($blobs as $blob) {
                    $row[$blob] = ($row[$blob] !== null ? pg_unescape_bytea($row[$blob]) : null);
                }
            }
            if (isset($return[$id])) {
                $colname = key($row);
                debugging(
                    "Did you remember to make the first column something unique in your call to get_records? "
                        . "Duplicate value '$id' found in column '$colname'.",
                    DEBUG_DEVELOPER,
                );
            }
            $return[$id] = (object) $row;
        }

        return $return;
    }

    #[\Override]
    public function get_fieldset_sql($sql, ?array $params = null): array {
        [$sql, $params, $type] = $this->fix_sql_params($sql, $params);

        $this->query_start($sql, $params, SQL_QUERY_SELECT);
        $result = pg_query_params($this->pgsql, $sql, $params);
        $this->query_end($result);

        $return = pg_fetch_all_columns($result, 0);

        if ($this->pg_field_type($result, 0) == 'bytea') {
            foreach ($return as $key => $value) {
                $return[$key] = ($value === null ? $value : pg_unescape_bytea($value));
            }
        }

        pg_free_result($result);

        return $return;
    }

    #[\Override]
    public function insert_record_raw($table, $params, $returnid = true, $bulk = false, $customsequence = false): bool|int {
        if (!is_array($params)) {
            $params = (array)$params;
        }

        $returning = "";

        if ($customsequence) {
            if (!isset($params['id'])) {
                throw new coding_exception(
                    'moodle_database::insert_record_raw() id field must be specified if custom sequences used.',
                );
            }
            $returnid = false;
        } else {
            if ($returnid) {
                $returning = "RETURNING id";
                unset($params['id']);
            } else {
                unset($params['id']);
            }
        }

        if (empty($params)) {
            throw new coding_exception('moodle_database::insert_record_raw() no fields found.');
        }

        $fields = implode(',', array_keys($params));
        $values = [];
        $i = 1;
        foreach ($params as $value) {
            $this->detect_objects($value);
            $values[] = "\$" . $i++;
        }
        $values = implode(',', $values);

        $sql = "INSERT INTO {$this->prefix}$table ($fields) VALUES($values) $returning";
        $this->query_start($sql, $params, SQL_QUERY_INSERT);
        $result = pg_query_params($this->pgsql, $sql, $params);
        $this->query_end($result);

        if ($returning !== "") {
            $row = pg_fetch_assoc($result);
            $params['id'] = reset($row);
        }
        pg_free_result($result);

        if (!$returnid) {
            return true;
        }

        return (int)$params['id'];
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
    public function insert_records(string $table, $dataobjects): void {
        if (!is_array($dataobjects) && !($dataobjects instanceof Traversable)) {
            throw new coding_exception('insert_records() passed non-traversable object');
        }

        // PostgreSQL does not seem to have problems with huge queries.
        $chunksize = 500;
        if (!empty($this->dboptions['bulkinsertsize'])) {
            $chunksize = (int)$this->dboptions['bulkinsertsize'];
        }

        $columns = $this->get_columns($table, true);

        $fields = null;
        $count = 0;
        $chunk = [];
        foreach ($dataobjects as $dataobject) {
            if (!is_array($dataobject) && !is_object($dataobject)) {
                throw new coding_exception('insert_records() passed invalid record object');
            }
            $dataobject = (array)$dataobject;
            if ($fields === null) {
                $fields = array_keys($dataobject);
                $columns = array_intersect_key($columns, $dataobject);
                unset($columns['id']);
            } else if ($fields !== array_keys($dataobject)) {
                throw new coding_exception('All dataobjects in insert_records() must have the same structure!');
            }

            $count++;
            $chunk[] = $dataobject;

            if ($count === $chunksize) {
                $this->insert_chunk($table, $chunk, $columns);
                $chunk = [];
                $count = 0;
            }
        }

        if ($count) {
            $this->insert_chunk($table, $chunk, $columns);
        }
    }

    /**
     * Insert records in chunks, strict param types...
     *
     * Note: can be used only from insert_records().
     *
     * @param string $table
     * @param array $chunk
     * @param database_column_info[] $columns
     */
    protected function insert_chunk(string $table, array $chunk, array $columns): void {
        $i = 1;
        $params = [];
        $values = [];
        foreach ($chunk as $dataobject) {
            $vals = [];
            foreach ($columns as $field => $column) {
                $params[] = $this->normalise_value($column, $dataobject[$field]);
                $vals[] = "\$" . $i++;
            }
            $values[] = '(' . implode(',', $vals) . ')';
        }

        $fieldssql = '(' . implode(',', array_keys($columns)) . ')';
        $valuessql = implode(',', $values);

        $sql = "INSERT INTO {$this->prefix}$table $fieldssql VALUES $valuessql";
        $this->query_start($sql, $params, SQL_QUERY_INSERT);
        $result = pg_query_params($this->pgsql, $sql, $params);
        $this->query_end($result);
        pg_free_result($result);
    }

    #[\Override]
    public function import_record($table, $dataobject): bool|int {
        $dataobject = (array)$dataobject;

        $columns = $this->get_columns($table);
        $cleaned = [];

        foreach ($dataobject as $field => $value) {
            $this->detect_objects($value);
            if (!isset($columns[$field])) {
                continue;
            }
            $column = $columns[$field];
            $cleaned[$field] = $this->normalise_value($column, $value);
        }

        return $this->insert_record_raw($table, $cleaned, false, true, true);
    }

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

        $i = 1;

        $sets = [];
        foreach ($params as $field => $value) {
            $this->detect_objects($value);
            $sets[] = "$field = \$" . $i++;
        }

        // The last ? in the WHERE condition.
        $params[] = $id;

        $sets = implode(',', $sets);
        $sql = "UPDATE {$this->prefix}$table SET $sets WHERE id=\$" . $i;

        $this->query_start($sql, $params, SQL_QUERY_UPDATE);
        $result = pg_query_params($this->pgsql, $sql, $params);
        $this->query_end($result);

        pg_free_result($result);
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

        $this->update_record_raw($table, $cleaned, $bulk);

        return true;
    }

    #[\Override]
    public function set_field_select($table, $newfield, $newvalue, $select, ?array $params = null): bool {
        if ($select) {
            $select = "WHERE $select";
        }
        if (is_null($params)) {
            $params = [];
        }
        [$select, $params, $type] = $this->fix_sql_params($select, $params);
        $i = count($params) + 1;

        // Get column metadata.
        $columns = $this->get_columns($table);
        $column = $columns[$newfield];

        $normalisedvalue = $this->normalise_value($column, $newvalue);

        $newfield = "$newfield = \$" . $i;
        $params[] = $normalisedvalue;
        $sql = "UPDATE {$this->prefix}$table SET $newfield $select";

        $this->query_start($sql, $params, SQL_QUERY_UPDATE);
        $result = pg_query_params($this->pgsql, $sql, $params);
        $this->query_end($result);

        pg_free_result($result);

        return true;
    }

    #[\Override]
    public function delete_records_select($table, $select, ?array $params = null): bool {
        if ($select) {
            $select = "WHERE $select";
        }
        $sql = "DELETE FROM {$this->prefix}$table $select";

        [$sql, $params, $type] = $this->fix_sql_params($sql, $params);

        $this->query_start($sql, $params, SQL_QUERY_UPDATE);
        $result = pg_query_params($this->pgsql, $sql, $params);
        $this->query_end($result);

        pg_free_result($result);

        return true;
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

        // Postgresql does not support accent insensitive text comparisons, sorry.
        if ($casesensitive) {
            $like = $notlike ? 'NOT LIKE' : 'LIKE';
        } else {
            $like = $notlike ? 'NOT ILIKE' : 'ILIKE';
        }
        return "$fieldname $like $param ESCAPE '$escapechar'";
    }

    #[\Override]
    public function sql_bitxor(mixed $int1, mixed $int2): string {
        return "(({$int1}) # ({$int2}))";
    }

    #[\Override]
    public function sql_cast_to_char(string $field): string {
        return " CAST({$field} AS VARCHAR) ";
    }

    #[\Override]
    public function sql_cast_char2int(string $fieldname, bool $text = false): string {
        return " CAST({$fieldname} AS INT) ";
    }

    #[\Override]
    public function sql_cast_char2real(string $fieldname, bool $text = false): string {
        return " {$fieldname}::real ";
    }

    #[\Override]
    public function sql_concat(...$arr) {
        $s = implode(' || ', $arr);
        if ($s === '') {
            return " '' ";
        }
        // Add always empty string element so integer-exclusive concats will work without needing to cast each element explicitly.
        return " '' || $s ";
    }

    #[\Override]
    public function sql_concat_join($separator = "' '", $elements = []): string {
        for ($n = count($elements) - 1; $n > 0; $n--) {
            array_splice($elements, $n, 0, $separator);
        }
        $s = implode(' || ', $elements);
        if ($s === '') {
            return " '' ";
        }
        return " $s ";
    }

    #[\Override]
    public function sql_group_concat(string $field, string $separator = ', ', string $sort = ''): string {
        $fieldsort = $sort ? "ORDER BY {$sort}" : '';
        return "STRING_AGG(" . $this->sql_cast_to_char($field) . ", '{$separator}' {$fieldsort})";
    }

    #[\Override]
    public function sql_order_by_null(string $fieldname, int $sort = SORT_ASC): string {
        return parent::sql_order_by_null($fieldname, $sort) . ' NULLS ' . ($sort == SORT_ASC ? 'FIRST' : 'LAST');
    }

    #[\Override]
    public function sql_regex_supported(): bool {
        return true;
    }

    #[\Override]
    public function sql_regex(bool $positivematch = true, bool $casesensitive = false): string {
        if ($casesensitive) {
            return $positivematch ? '~' : '!~';
        } else {
            return $positivematch ? '~*' : '!~*';
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

    /**
     * Obtain session lock.
     *
     * @param int $rowid id of the row with session record
     * @param int $timeout max allowed time to wait for the lock in seconds
     * @return bool success
     */
    #[\Override]
    public function get_session_lock(int $rowid, int $timeout): void {
        // NOTE: there is a potential locking problem for database running multiple instances of moodle.
        // We could try to use pg_advisory_lock(int, int).
        // Luckily there is not a big chance that they would collide.
        if (!$this->session_lock_supported()) {
            return;
        }

        parent::get_session_lock($rowid, $timeout);

        $timeoutmilli = $timeout * 1000;

        $sql = "SET statement_timeout TO $timeoutmilli";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = pg_query($this->pgsql, $sql);
        $this->query_end($result);

        if ($result) {
            pg_free_result($result);
        }

        $sql = "SELECT pg_advisory_lock($rowid)";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $start = time();
        $result = pg_query($this->pgsql, $sql);
        $end = time();
        try {
            $this->query_end($result);
        } catch (dml_exception $ex) {
            if ($end - $start >= $timeout) {
                throw new sessionwait_exception();
            } else {
                throw $ex;
            }
        }

        if ($result) {
            pg_free_result($result);
        }

        $sql = "SET statement_timeout TO DEFAULT";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = pg_query($this->pgsql, $sql);
        $this->query_end($result);

        if ($result) {
            pg_free_result($result);
        }
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

        $sql = "SELECT pg_advisory_unlock($rowid)";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = pg_query($this->pgsql, $sql);
        $this->query_end($result);

        if ($result) {
            pg_free_result($result);
        }
    }

    /**
     * Driver specific start of real database transaction, this can not be used directly in code.
     */
    #[\Override]
    protected function begin_transaction(): void {
        $this->savepointpresent = true;
        $sql = "BEGIN ISOLATION LEVEL READ COMMITTED; SAVEPOINT moodle_pg_savepoint";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = pg_query($this->pgsql, $sql);
        $this->query_end($result);

        pg_free_result($result);
    }

    /**
     * Driver specific commit of real database transaction, this can not be used directly in code.
     */
    #[\Override]
    protected function commit_transaction(): void {
        $this->savepointpresent = false;
        $sql = "RELEASE SAVEPOINT moodle_pg_savepoint; COMMIT";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = pg_query($this->pgsql, $sql);
        $this->query_end($result);

        pg_free_result($result);
    }

    /**
     * Driver specific abort of real database transaction, this can not be used directly in code.
     */
    #[\Override]
    protected function rollback_transaction(): void {
        $this->savepointpresent = false;
        $sql = "RELEASE SAVEPOINT moodle_pg_savepoint; ROLLBACK";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = pg_query($this->pgsql, $sql);
        $this->query_end($result);

        pg_free_result($result);
    }

    /**
     * Helper function to trim whitespace and quotes from any string.
     *
     * This is needed because Postgresql encloses some fields in index definitions and other locations within double quotes.
     *
     * @param string $str string to apply whitespace + quotes trim
     * @return string trimmed string
     */
    private function trim_quotes(string $str): string {
        return trim(trim($str), "'\"");
    }

    /**
     * Postgresql supports full-text search indexes.
     *
     * @return bool
     */
    #[\Override]
    public function is_fulltext_search_supported(): bool {
        return true;
    }

    /**
     * Postgresql supports the COUNT() window function and provides a performance improvement.
     *
     * @return bool
     */
    #[\Override]
    public function is_count_window_function_supported(): bool {
        return true;
    }
}

// Alias this class to the old name.
// This file will be autoloaded by the legacyclasses autoload system.
// In future all uses of this class will be corrected and the legacy references will be removed.
class_alias(database::class, \pgsql_native_moodle_database::class);
