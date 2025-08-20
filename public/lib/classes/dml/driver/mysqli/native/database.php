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

namespace core\dml\driver\mysqli\native;

use core\dml\database_column_info;
use core\dml\exception\exception as dml_exception;
use core\dml\exception\connection_exception;
use core\dml\exception\read_exception;
use core\dml\exception\sessionwait_exception;
use core\dml\exception\write_exception;
use core\dml\read_replica_trait;
use core\exception\coding_exception;
use core\exception\moodle_exception;
use ddl_change_structure_exception;
use mysqli;
use stdClass;
use Traversable;

/**
 * Native mysqli class representing moodle database interface.
 *
 * @package    core_dml
 * @copyright  2008 Petr Skoda (http://skodak.org)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class database extends \core\dml\database {
    use read_replica_trait {
        can_use_readonly as read_replica_can_use_readonly;
    }

    /** @var array $sslmodes */
    private static array $sslmodes = [
        'require',
        'verify-full',
    ];

    /** @var mysqli|false|null $mysqli */
    protected mixed $mysqli = null;

    /** @var ?bool is compressed row format supported cache */
    protected ?bool $compressedrowformatsupported = null;

    /** @var ?string DB server actual version */
    protected ?string $serverversion = null;

    /** @var ?int DB server chunk size */
    private ?int $chunksize = null;

    /**
     * @var ?bool Whether transactions are supported or not.
     */
    private ?bool $transactionssupported = null;

    #[\Override]
    public function create_database(
        $dbhost,
        $dbuser,
        $dbpass,
        $dbname,
        ?array $dboptions = null,
    ): bool {
        $driverstatus = $this->driver_installed();

        if ($driverstatus !== true) {
            throw new dml_exception('dbdriverproblem', $driverstatus);
        }

        if (
            !empty($dboptions['dbsocket'])
            && (
                strpos($dboptions['dbsocket'], '/') !== false
                || strpos($dboptions['dbsocket'], '\\') !== false
            )
        ) {
            $dbsocket = $dboptions['dbsocket'];
        } else {
            $dbsocket = ini_get('mysqli.default_socket');
        }
        if (empty($dboptions['dbport'])) {
            $dbport = (int)ini_get('mysqli.default_port');
        } else {
            $dbport = (int)$dboptions['dbport'];
        }
        // Verify ini.get does not return nonsense.
        if (empty($dbport)) {
            $dbport = 3306;
        }
        ob_start();
        $conn = new mysqli($dbhost, $dbuser, $dbpass, '', $dbport, $dbsocket); // Connect without db.
        $dberr = ob_get_contents();
        ob_end_clean();
        $errorno = @$conn->connect_errno;

        if ($errorno !== 0) {
            throw new connection_exception($dberr);
        }

        // Normally a check would be done before setting utf8mb4, but the database can be created
        // before the enviroment checks are done. We'll proceed with creating the database and then do checks next.
        $charset = 'utf8mb4';
        if (
            isset($dboptions['dbcollation'])
            && (
                strpos($dboptions['dbcollation'], 'utf8_') === 0
                || strpos($dboptions['dbcollation'], 'utf8mb4_') === 0
            )
        ) {
            $collation = $dboptions['dbcollation'];
            $collationinfo = explode('_', $dboptions['dbcollation']);
            $charset = reset($collationinfo);
        } else {
            $collation = 'utf8mb4_unicode_ci';
        }

        $result = $conn->query("CREATE DATABASE $dbname DEFAULT CHARACTER SET $charset DEFAULT COLLATE " . $collation);

        $conn->close();

        if (!$result) {
            throw new dml_exception('cannotcreatedb');
        }

        return true;
    }

    #[\Override]
    public function driver_installed(): bool|string {
        if (!extension_loaded('mysqli')) {
            return get_string('mysqliextensionisnotpresentinphp', 'install');
        }
        return true;
    }

    #[\Override]
    public function get_dbfamily(): string {
        return 'mysql';
    }

    #[\Override]
    protected function get_dbtype(): string {
        return 'mysqli';
    }

    #[\Override]
    protected function get_dblibrary(): string {
        return 'native';
    }

    /**: string
     * Returns the current MySQL db engine.
     *
     * This is an ugly workaround for MySQL default engine problems,
     * Moodle is designed to work best on ACID compliant databases
     * with full transaction support. Do not use MyISAM.
     *
     * @return string or null MySQL engine name
     */
    public function get_dbengine(): string {
        if (isset($this->dboptions['dbengine'])) {
            return $this->dboptions['dbengine'];
        }

        if ($this->external) {
            return null;
        }

        $engine = null;

        // Look for current engine of our config table (the first table that gets created),
        // so that we create all tables with the same engine.
        $sql = "SELECT engine
                  FROM INFORMATION_SCHEMA.TABLES
                 WHERE table_schema = DATABASE() AND table_name = '{$this->prefix}config'";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = $this->mysqli->query($sql);
        $this->query_end($result);
        if ($rec = $result->fetch_assoc()) {
            // MySQL 8 BC: information_schema.* returns the fields in upper case.
            $rec = array_change_key_case($rec, CASE_LOWER);
            $engine = $rec['engine'];
        }
        $result->close();

        if ($engine) {
            // Cache the result to improve performance.
            $this->dboptions['dbengine'] = $engine;
            return $engine;
        }

        // Get the default database engine.
        $sql = "SELECT @@default_storage_engine engine";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = $this->mysqli->query($sql);
        $this->query_end($result);
        if ($rec = $result->fetch_assoc()) {
            $engine = $rec['engine'];
        }
        $result->close();

        if ($engine === 'MyISAM') {
            // We really do not want MyISAM for Moodle, InnoDB or XtraDB is a reasonable defaults if supported.
            $sql = "SHOW STORAGE ENGINES";
            $this->query_start($sql, null, SQL_QUERY_AUX);
            $result = $this->mysqli->query($sql);
            $this->query_end($result);
            $engines = [];
            while ($res = $result->fetch_assoc()) {
                if ($res['Support'] === 'YES' || $res['Support'] === 'DEFAULT') {
                    $engines[$res['Engine']] = true;
                }
            }
            $result->close();
            if (isset($engines['InnoDB'])) {
                $engine = 'InnoDB';
            }
            if (isset($engines['XtraDB'])) {
                $engine = 'XtraDB';
            }
        }

        // Cache the result to improve performance.
        $this->dboptions['dbengine'] = $engine;
        return $engine;
    }

    /**
     * Returns the current MySQL db collation.
     *
     * This is an ugly workaround for MySQL default collation problems.
     *
     * @return ?string or null MySQL collation name
     */
    public function get_dbcollation(): ?string {
        if (isset($this->dboptions['dbcollation'])) {
            return $this->dboptions['dbcollation'];
        }

        return null;
    }

    /**
     * Set 'dbcollation' option
     *
     * @return string|null $dbcollation
     */
    private function detect_collation(): ?string {
        if ($this->external) {
            return null;
        }

        $collation = null;

        // Look for current collation of our config table (the first table that gets created),
        // so that we create all tables with the same collation.
        $sql = "SELECT collation_name
                  FROM INFORMATION_SCHEMA.COLUMNS
                 WHERE table_schema = DATABASE() AND table_name = '{$this->prefix}config' AND column_name = 'value'";
        $result = $this->mysqli->query($sql);
        if ($rec = $result->fetch_assoc()) {
            // MySQL 8 BC: information_schema.* returns the fields in upper case.
            $rec = array_change_key_case($rec, CASE_LOWER);
            $collation = $rec['collation_name'];
        }
        $result->close();

        if (!$collation) {
            // Get the default database collation, but only if using UTF-8.
            $sql = "SELECT @@collation_database";
            $result = $this->mysqli->query($sql);
            if ($rec = $result->fetch_assoc()) {
                if (strpos($rec['@@collation_database'], 'utf8_') === 0 || strpos($rec['@@collation_database'], 'utf8mb4_') === 0) {
                    $collation = $rec['@@collation_database'];
                }
            }
            $result->close();
        }

        if (!$collation) {
            // We want only utf8 compatible collations.
            $collation = null;
            $sql = "SHOW COLLATION WHERE Collation LIKE 'utf8mb4\_%' AND Charset = 'utf8mb4'";
            $result = $this->mysqli->query($sql);
            while ($res = $result->fetch_assoc()) {
                $collation = $res['Collation'];
                if (strtoupper($res['Default']) === 'YES') {
                    $collation = $res['Collation'];
                    break;
                }
            }
            $result->close();
        }

        // Cache the result to improve performance.
        $this->dboptions['dbcollation'] = $collation;
        return $collation;
    }

    /**
     * Tests if the Antelope file format is still supported or it has been removed.
     * When removed, only Barracuda file format is supported, given the XtraDB/InnoDB engine.
     *
     * @return bool True if the Antelope file format has been removed; otherwise, false.
     */
    protected function is_antelope_file_format_no_more_supported(): bool {
        // Breaking change: Antelope file format support has been removed from both MySQL and MariaDB.
        // The following InnoDB file format configuration parameters were deprecated and then removed:
        // - innodb_file_format
        // - innodb_file_format_check
        // - innodb_file_format_max
        // - innodb_large_prefix
        // 1. MySQL: deprecated in 5.7.7 and removed 8.0.0+.
        $ismysqlge8d0d0 = ($this->get_dbtype() == 'mysqli' || $this->get_dbtype() == 'auroramysql')
            && version_compare($this->get_server_info()['version'], '8.0.0', '>=');
        // 2. MariaDB: deprecated in 10.2.0 and removed 10.3.1+.
        $ismariadbge10d3d1 = ($this->get_dbtype() == 'mariadb')
            && version_compare($this->get_server_info()['version'], '10.3.1', '>=');

        return $ismysqlge8d0d0 || $ismariadbge10d3d1;
    }

    /**
     * Get the row format from the database schema.
     *
     * @param string $table
     * @return ?string row_format name or null if not known or table does not exist.
     */
    public function get_row_format(?string $table = null): ?string {
        $rowformat = null;
        if (isset($table)) {
            $table = $this->mysqli->real_escape_string($table);
            $sql = "SELECT row_format
                      FROM INFORMATION_SCHEMA.TABLES
                     WHERE table_schema = DATABASE() AND table_name = '{$this->prefix}$table'";
        } else {
            if ($this->is_antelope_file_format_no_more_supported()) {
                // Breaking change: Antelope file format support has been removed, only Barracuda.
                $dbengine = $this->get_dbengine();
                $supporteddbengines = ['InnoDB', 'XtraDB'];
                if (in_array($dbengine, $supporteddbengines)) {
                    $rowformat = 'Barracuda';
                }

                return $rowformat;
            }

            $sql = "SHOW VARIABLES LIKE 'innodb_file_format'";
        }
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = $this->mysqli->query($sql);
        $this->query_end($result);
        if ($rec = $result->fetch_assoc()) {
            // MySQL 8 BC: information_schema.* returns the fields in upper case.
            $rec = array_change_key_case($rec, CASE_LOWER);
            if (isset($table)) {
                $rowformat = $rec['row_format'];
            } else {
                $rowformat = $rec['value'];
            }
        }
        $result->close();

        return $rowformat;
    }

    /**
     * Is this database compatible with compressed row format?
     * This feature is necessary for support of large number of text
     * columns in InnoDB/XtraDB database.
     *
     * @param bool $cached use cached result
     * @return bool true if table can be created or changed to compressed row format.
     */
    public function is_compressed_row_format_supported(bool $cached = true): bool {
        if ($cached && isset($this->compressedrowformatsupported)) {
            return $this->compressedrowformatsupported;
        }

        $engine = strtolower($this->get_dbengine());
        $info = $this->get_server_info();

        if (version_compare($info['version'], '5.5.0') < 0) {
            // MySQL 5.1 is not supported here because we cannot read the file format.
            $this->compressedrowformatsupported = false;
        } else if ($engine !== 'innodb' && $engine !== 'xtradb') {
            // Other engines are not supported, most probably not compatible.
            $this->compressedrowformatsupported = false;
        } else if (!$this->is_file_per_table_enabled()) {
            $this->compressedrowformatsupported = false;
        } else if ($this->get_row_format() !== 'Barracuda') {
            $this->compressedrowformatsupported = false;
        } else if ($this->get_dbtype() === 'auroramysql') {
            // Aurora MySQL doesn't support COMPRESSED and falls back to COMPACT if you try to use it.
            $this->compressedrowformatsupported = false;
        } else {
            // All the tests passed, we can safely use ROW_FORMAT=Compressed in sql statements.
            $this->compressedrowformatsupported = true;
        }

        return $this->compressedrowformatsupported;
    }

    /**
     * Check the database to see if innodb_file_per_table is on.
     *
     * @return bool True if on otherwise false.
     */
    public function is_file_per_table_enabled(): bool {
        if ($filepertable = $this->get_record_sql("SHOW VARIABLES LIKE 'innodb_file_per_table'")) {
            if ($filepertable->value === 'ON') {
                return true;
            }
        }
        return false;
    }

    /**
     * Check the database to see if innodb_large_prefix is on.
     *
     * @return bool True if on otherwise false.
     */
    public function is_large_prefix_enabled(): bool {
        if ($this->is_antelope_file_format_no_more_supported()) {
            // Breaking change: Antelope file format support has been removed, only Barracuda.
            return true;
        }

        if ($largeprefix = $this->get_record_sql("SHOW VARIABLES LIKE 'innodb_large_prefix'")) {
            if ($largeprefix->value === 'ON') {
                return true;
            }
        }
        return false;
    }

    /**
     * Determine if the row format should be set to compressed, dynamic, or default.
     *
     * Terrible kludge. If we're using utf8mb4 AND we're using InnoDB, we need to specify row format to
     * be either dynamic or compressed (default is compact) in order to allow for bigger indexes (MySQL
     * errors #1709 and #1071).
     *
     * @param  ?string $engine The database engine being used. Will be looked up if not supplied.
     * @param  ?string $collation The database collation to use. Will look up the current collation if not supplied.
     * @return string An sql fragment to add to sql statements.
     */
    public function get_row_format_sql(
        ?string $engine = null,
        ?string $collation = null,
    ): string {
        if (!isset($engine)) {
            $engine = $this->get_dbengine();
        }
        $engine = strtolower($engine);

        if (!isset($collation)) {
            $collation = $this->get_dbcollation();
        }

        $rowformat = '';
        if (($engine === 'innodb' || $engine === 'xtradb') && strpos($collation, 'utf8mb4_') === 0) {
            if ($this->is_compressed_row_format_supported()) {
                $rowformat = "ROW_FORMAT=Compressed";
            } else {
                $rowformat = "ROW_FORMAT=Dynamic";
            }
        }
        return $rowformat;
    }

    #[\Override]
    public function get_name(): string {
        return get_string('nativemysqli', 'install');
    }

    #[\Override]
    public function get_configuration_help(): string {
        return get_string('nativemysqlihelp', 'install');
    }

    /**: string
     * Connect to db.
     *
     * @param string $dbhost The database host
     * @param string $dbuser The database username
     * @param string $dbpass The database username's password
     * @param string $dbname The name of the database being connected to
     * @param mixed $prefix string means moodle db prefix, false used for external databases where prefix not used
     * @param array $dboptions driver specific options
     * @return bool success
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
        $driverstatus = $this->driver_installed();

        if ($driverstatus !== true) {
            throw new dml_exception('dbdriverproblem', $driverstatus);
        }

        $this->store_settings($dbhost, $dbuser, $dbpass, $dbname, $prefix, $dboptions);

        // The dbsocket option is used ONLY if host is null or 'localhost'.
        // You can not disable it because it is always tried if dbhost is 'localhost'.
        if (
            !empty($this->dboptions['dbsocket'])
            && (
                strpos($this->dboptions['dbsocket'], '/') !== false
                || strpos($this->dboptions['dbsocket'], '\\') !== false
            )
        ) {
            $dbsocket = $this->dboptions['dbsocket'];
        } else {
            $dbsocket = ini_get('mysqli.default_socket');
        }
        if (empty($this->dboptions['dbport'])) {
            $dbport = (int)ini_get('mysqli.default_port');
        } else {
            $dbport = (int)$this->dboptions['dbport'];
        }
        // Verify ini.get does not return nonsense.
        if (empty($dbport)) {
            $dbport = 3306;
        }
        if ($dbhost && !empty($this->dboptions['dbpersist'])) {
            $dbhost = "p:$dbhost";
        }

        // We want to keep exceptions out from the native driver.
        // TODO: See MDL-75761 for future improvements.
        mysqli_report(MYSQLI_REPORT_OFF); // Disable reporting (default before PHP 8.1).

        $this->mysqli = mysqli_init();
        if (!empty($this->dboptions['connecttimeout'])) {
            $this->mysqli->options(MYSQLI_OPT_CONNECT_TIMEOUT, $this->dboptions['connecttimeout']);
        }

        $flags = 0;
        if ($this->dboptions['clientcompress'] ?? false) {
            $flags |= MYSQLI_CLIENT_COMPRESS;
        }
        if (isset($this->dboptions['ssl'])) {
            $sslmode = $this->dboptions['ssl'];
            if (!in_array($sslmode, self::$sslmodes, true)) {
                throw new moodle_exception("Invalid 'dboptions''ssl' value '$sslmode'");
            }
            $flags |= MYSQLI_CLIENT_SSL;
            if ($sslmode === 'verify-full') {
                $flags |= MYSQLI_CLIENT_SSL_VERIFY_SERVER_CERT;
            }
        }

        $conn = null;
        $dberr = null;
        try {
            // The real_connect() function is doing things we don't expect.
            $conn = @$this->mysqli->real_connect($dbhost, $dbuser, $dbpass, $dbname, $dbport, $dbsocket, $flags);
        } catch (\Exception $e) {
            $dberr = "$e";
        }
        if (!$conn) {
            $dberr = $dberr ?: "{$this->mysqli->connect_error} ({$this->mysqli->connect_errno})";
            $this->mysqli = null;
            throw new connection_exception($dberr);
        }

        // Disable logging until we are fully setup.
        $this->query_log_prevent();

        if (isset($dboptions['dbcollation'])) {
            $collation = $this->dboptions['dbcollation'] = $dboptions['dbcollation'];
        } else {
            $collation = $this->detect_collation();
        }
        $collationinfo = explode('_', $collation);
        $charset = reset($collationinfo);

        $this->mysqli->set_charset($charset);

        // If available, enforce strict mode for the session. That guaranties
        // standard behaviour under some situations, avoiding some MySQL nasty
        // habits like truncating data or performing some transparent cast losses.
        // With strict mode enforced, Moodle DB layer will be consistently throwing
        // the corresponding exceptions as expected.
        $si = $this->get_server_info();
        if (version_compare($si['version'], '5.0.2', '>=')) {
            $sql = "SET SESSION sql_mode = 'STRICT_ALL_TABLES'";
            $result = $this->mysqli->query($sql);
        }

        // We can enable logging now.
        $this->query_log_allow();

        // Connection stabilised and configured, going to instantiate the temptables controller.
        $this->temptables = new temptables($this);

        return true;
    }

    #[\Override]
    public function dispose(): void {
        // Call parent dispose to write/close session and other common stuff before closing connection.
        parent::dispose();
        if ($this->mysqli) {
            $this->mysqli->close();
            $this->mysqli = null;
        }
    }

    /**
     * Gets db handle currently used with queries.
     *
     * @return bool|mysqli|null
     */
    protected function get_db_handle(): mixed {
        return $this->mysqli;
    }

    /**
     * Sets db handle to be used with subsequent queries.
     *
     * @param mysqli $dbh
     */
    protected function set_db_handle(mixed $dbh): void {
        $this->mysqli = $dbh;
    }

    /**
     * Check if The query qualifies for readonly connection execution.
     *
     * Logging queries are exempt, those are write operations that circumvent
     * standard query_start/query_end paths.
     *
     * @param int $type type of query
     * @param string $sql
     * @return bool
     */
    protected function can_use_readonly(int $type, string $sql): bool {
        // All *_LOCK queries always go to primary.
        if (preg_match('/\b(GET|RELEASE)_LOCK/i', $sql)) {
            return false;
        }

        return $this->read_replica_can_use_readonly($type, $sql);
    }

    /**
     * Returns the version of the MySQL server, as reported by the PHP client connection.
     *
     * Wrap $this->mysqli->server_info to improve testing strategy.
     *
     * @return string A string representing the version of the MySQL server that the MySQLi extension is connected to.
     */
    protected function get_mysqli_server_info(): string {
        return $this->mysqli->server_info;
    }

    /**
     * Returns the version of the MySQL server, as reported by 'SELECT VERSION()' query.
     *
     * @return string A string that indicates the MySQL server version.
     * @throws read_exception If the execution of 'SELECT VERSION()' query will fail.
     */
    protected function get_version_from_db(): string {
        $version = null;
        // Query the DB server for the server version.
        $sql = "SELECT VERSION() version;";
        try {
            $result = $this->mysqli->query($sql);
            if ($result) {
                if ($row = $result->fetch_assoc()) {
                    $version = $row['version'];
                }
                $result->close();
                unset($row);
            }
        } catch (\Throwable $e) { // Exceptions in case of MYSQLI_REPORT_STRICT.
            // It looks like we've an issue out of the expected boolean 'false' result above.
            throw new read_exception($e->getMessage(), $sql);
        }
        if (empty($version)) {
            // Exception read_exception usually reports raw mysqli errors i.e. not localised by Moodle.
            throw new read_exception("Unable to read the DB server version.", $sql);
        }

        return $version;
    }

    /**
     * Returns whether $CFG->dboptions['versionfromdb'] has been set to boolean `true`.
     *
     * @return bool True if $CFG->dboptions['versionfromdb'] has been set to boolean `true`. Otherwise, `false`.
     */
    protected function should_db_version_be_read_from_db(): bool {
        if (!empty($this->dboptions['versionfromdb'])) {
            return true;
        }

        return false;
    }

    #[\Override]
    public function get_server_info(): array {
        $version = $this->serverversion;
        if (empty($version)) {
            $version = $this->get_mysqli_server_info();
            // The version returned by the PHP client could not be the actual DB server version.
            // For example in MariaDB, it was prefixed by the RPL_VERSION_HACK, "5.5.5-" (MDEV-4088), starting from 10.x,
            // when not using an authentication plug-in.
            // Strip the RPL_VERSION_HACK prefix off - it will be "always" there in MariaDB until MDEV-28910 will be implemented.
            $version = str_replace('5.5.5-', '', $version);

            // Should we use the VERSION function to get the actual DB version instead of the PHP client version above?
            if ($this->should_db_version_be_read_from_db()) {
                // Try to query the actual version of the target database server: indeed some cloud providers, e.g. Azure,
                // put a gateway in front of the actual instance which reports its own version to the PHP client
                // and it doesn't represent the actual version of the DB server the PHP client is connected to.
                // Refs:
                // - https://learn.microsoft.com/en-us/azure/mariadb/concepts-supported-versions
                // - https://learn.microsoft.com/en-us/azure/mysql/single-server/concepts-connect-to-a-gateway-node .
                // Reset the version returned by the PHP client with the actual DB version reported by 'VERSION' function.
                $version = $this->get_version_from_db();
            }

            // The version here starts with the following naming scheme: 'X.Y.Z[-<suffix>]'.
            // Example: in MariaDB at least one suffix is "always" there, hardcoded in 'mysql_version.h.in':
            // #define MYSQL_SERVER_VERSION       "@VERSION@-MariaDB"
            // MariaDB and MySQL server version could have extra suffixes too, set by the compilation environment,
            // e.g. '-debug', '-embedded', '-log' or any other vendor specific suffix (e.g. build information).
            // Strip out any suffix.
            $parts = explode('-', $version, 2);
            // Finally, keep just major, minor and patch versions (X.Y.Z) from the reported DB server version.
            $this->serverversion = $parts[0];
        }

        return [
            'description' => $this->get_mysqli_server_info(),
            'version' => $this->serverversion,
        ];
    }

    #[\Override]
    protected function allowed_param_types(): int {
        return SQL_PARAMS_QM;
    }

    #[\Override]
    public function get_last_error(): string {
        return $this->mysqli->error;
    }

    #[\Override]
    public function get_tables(bool $usecache = true): array {
        if ($usecache && $this->tables !== null) {
            return $this->tables;
        }
        $this->tables = [];
        $prefix = str_replace('_', '\\_', $this->prefix);
        $sql = "SHOW TABLES LIKE '$prefix%'";
        $this->query_start($sql, null, $usecache ? SQL_QUERY_AUX_READONLY : SQL_QUERY_AUX);
        $result = $this->mysqli->query($sql);
        $this->query_end($result);
        $len = strlen($this->prefix);
        if ($result) {
            while ($arr = $result->fetch_assoc()) {
                $tablename = reset($arr);
                $tablename = substr($tablename, $len);
                $this->tables[$tablename] = $tablename;
            }
            $result->close();
        }

        // Add the currently available temptables.
        $this->tables = array_merge($this->tables, $this->temptables->get_temptables());
        return $this->tables;
    }

    #[\Override]
    public function get_indexes(string $table): array {
        $indexes = [];
        $fixedtable = $this->fix_table_name($table);
        $sql = "SHOW INDEXES FROM $fixedtable";
        $this->query_start($sql, null, SQL_QUERY_AUX_READONLY);
        $result = $this->mysqli->query($sql);
        try {
            $this->query_end($result);
        } catch (read_exception $e) {
            // The table does not exist so cannot have any indices.
            return $indexes;
        }
        if ($result) {
            while ($res = $result->fetch_object()) {
                if ($res->Key_name === 'PRIMARY') {
                    continue;
                }
                if (!isset($indexes[$res->Key_name])) {
                    $indexes[$res->Key_name] = ['unique' => empty($res->Non_unique), 'columns' => []];
                }
                $indexes[$res->Key_name]['columns'][$res->Seq_in_index - 1] = $res->Column_name;
            }
            $result->close();
        }
        return $indexes;
    }

    #[\Override]
    protected function fetch_columns(string $table): array {
        $structure = [];

        $sql = "SELECT column_name, data_type, character_maximum_length, numeric_precision,
                       numeric_scale, is_nullable, column_type, column_default, column_key, extra
                  FROM information_schema.columns
                 WHERE table_name = '" . $this->prefix . $table . "'
                       AND table_schema = '" . $this->dbname . "'
              ORDER BY ordinal_position";
        $this->query_start($sql, null, SQL_QUERY_AUX_READONLY);
        $result = $this->mysqli->query($sql);
        // Don't want to throw anything here ever. MDL-30147.
        $this->query_end(true);

        if ($result === false) {
            return [];
        }

        if ($result->num_rows > 0) {
            // Standard table exists.
            while ($rawcolumn = $result->fetch_assoc()) {
                // MySQL 8 BC: information_schema.* returns the fields in upper case.
                $rawcolumn = array_change_key_case($rawcolumn, CASE_LOWER);
                $info = (object)$this->get_column_info((object)$rawcolumn);
                $structure[$info->name] = new database_column_info($info);
            }
            $result->close();
        } else {
            // Temporary tables are not in information schema, let's try it the old way.
            $result->close();
            $fixedtable = $this->fix_table_name($table);
            $sql = "SHOW COLUMNS FROM $fixedtable";
            $this->query_start($sql, null, SQL_QUERY_AUX_READONLY);
            $result = $this->mysqli->query($sql);
            $this->query_end(true);
            if ($result === false) {
                return [];
            }
            while ($rawcolumn = $result->fetch_assoc()) {
                $rawcolumn = (object)array_change_key_case($rawcolumn, CASE_LOWER);
                $rawcolumn->column_name              = $rawcolumn->field;
                unset($rawcolumn->field);
                $rawcolumn->column_type              = $rawcolumn->type;
                unset($rawcolumn->type);
                $rawcolumn->character_maximum_length = null;
                $rawcolumn->numeric_precision        = null;
                $rawcolumn->numeric_scale            = null;
                $rawcolumn->is_nullable              = $rawcolumn->null;
                unset($rawcolumn->null);
                $rawcolumn->column_default           = $rawcolumn->default;
                unset($rawcolumn->default);
                $rawcolumn->column_key               = $rawcolumn->key;
                unset($rawcolumn->key);

                if (preg_match('/(enum|varchar)\((\d+)\)/i', $rawcolumn->column_type, $matches)) {
                    $rawcolumn->data_type = $matches[1];
                    $rawcolumn->character_maximum_length = $matches[2];
                } else if (preg_match('/([a-z]*int[a-z]*)\((\d+)\)/i', $rawcolumn->column_type, $matches)) {
                    $rawcolumn->data_type = $matches[1];
                    $rawcolumn->numeric_precision = $matches[2];
                    $rawcolumn->max_length = $rawcolumn->numeric_precision;

                    $type = strtoupper($matches[1]);
                    if ($type === 'BIGINT') {
                        $maxlength = 18;
                    } else if ($type === 'INT' || $type === 'INTEGER') {
                        $maxlength = 9;
                    } else if ($type === 'MEDIUMINT') {
                        $maxlength = 6;
                    } else if ($type === 'SMALLINT') {
                        $maxlength = 4;
                    } else if ($type === 'TINYINT') {
                        $maxlength = 2;
                    } else {
                        // This should not happen.
                        $maxlength = 0;
                    }
                    if ($maxlength < $rawcolumn->max_length) {
                        $rawcolumn->max_length = $maxlength;
                    }
                } else if (preg_match('/(decimal)\((\d+),(\d+)\)/i', $rawcolumn->column_type, $matches)) {
                    $rawcolumn->data_type = $matches[1];
                    $rawcolumn->numeric_precision = $matches[2];
                    $rawcolumn->numeric_scale = $matches[3];
                } else if (preg_match('/(double|float)(\((\d+),(\d+)\))?/i', $rawcolumn->column_type, $matches)) {
                    $rawcolumn->data_type = $matches[1];
                    $rawcolumn->numeric_precision = isset($matches[3]) ? $matches[3] : null;
                    $rawcolumn->numeric_scale = isset($matches[4]) ? $matches[4] : null;
                } else if (preg_match('/([a-z]*text)/i', $rawcolumn->column_type, $matches)) {
                    $rawcolumn->data_type = $matches[1];
                    $rawcolumn->character_maximum_length = -1; // Unknown.
                } else if (preg_match('/([a-z]*blob)/i', $rawcolumn->column_type, $matches)) {
                    $rawcolumn->data_type = $matches[1];
                } else {
                    $rawcolumn->data_type = $rawcolumn->column_type;
                }

                $info = $this->get_column_info($rawcolumn);
                $structure[$info->name] = new database_column_info($info);
            }
            $result->close();
        }

        return $structure;
    }

    /**
     * Indicates whether column information retrieved from `information_schema.columns` has default values quoted or not.
     *
     * @return bool True when default values are quoted (breaking change); otherwise, false.
     */
    protected function has_breaking_change_quoted_defaults(): bool {
        return false;
    }

    /**
     * Indicates whether SQL_MODE default value has changed in a not backward compatible way.
     *
     * @return bool True when SQL_MODE breaks BC; otherwise, false.
     */
    public function has_breaking_change_sqlmode(): bool {
        return false;
    }

    /**
     * Returns moodle column info for raw column from information schema.
     *
     * @param stdClass $rawcolumn
     * @return stdClass standardised colum info
     */
    private function get_column_info(stdClass $rawcolumn): stdClass {
        $rawcolumn = (object) $rawcolumn;
        $info = new stdClass();
        $info->name           = $rawcolumn->column_name;
        $info->type           = $rawcolumn->data_type;
        $info->meta_type      = $this->mysqltype2moodletype($rawcolumn->data_type);
        if ($this->has_breaking_change_quoted_defaults()) {
            $info->default_value = is_null($rawcolumn->column_default) ? null : trim($rawcolumn->column_default, "'");
            if ($info->default_value === 'NULL') {
                $info->default_value = null;
            }
        } else {
            $info->default_value = $rawcolumn->column_default;
        }
        $info->has_default    = !is_null($info->default_value);
        $info->not_null       = ($rawcolumn->is_nullable === 'NO');
        $info->primary_key    = ($rawcolumn->column_key === 'PRI');
        $info->binary         = false;
        $info->unsigned       = null;
        $info->auto_increment = false;
        $info->unique         = null;
        $info->scale          = null;

        if ($info->meta_type === 'C') {
            $info->max_length = $rawcolumn->character_maximum_length;
        } else if ($info->meta_type === 'I') {
            if ($info->primary_key) {
                $info->meta_type = 'R';
                $info->unique    = true;
            }
            // Return number of decimals, not bytes here.
            $info->max_length    = $rawcolumn->numeric_precision;
            if (preg_match('/([a-z]*int[a-z]*)\((\d+)\)/i', $rawcolumn->column_type, $matches)) {
                $type = strtoupper($matches[1]);
                if ($type === 'BIGINT') {
                    $maxlength = 18;
                } else if ($type === 'INT' || $type === 'INTEGER') {
                    $maxlength = 9;
                } else if ($type === 'MEDIUMINT') {
                    $maxlength = 6;
                } else if ($type === 'SMALLINT') {
                    $maxlength = 4;
                } else if ($type === 'TINYINT') {
                    $maxlength = 2;
                } else {
                    // This should not happen.
                    $maxlength = 0;
                }
                // It is possible that display precision is different from storage type length,
                // always use the smaller value to make sure our data fits.
                if ($maxlength < $info->max_length) {
                    $info->max_length = $maxlength;
                }
            }
            $info->unsigned      = (stripos($rawcolumn->column_type, 'unsigned') !== false);
            $info->auto_increment = (strpos($rawcolumn->extra, 'auto_increment') !== false);
        } else if ($info->meta_type === 'N') {
            $info->max_length    = $rawcolumn->numeric_precision;
            $info->scale         = $rawcolumn->numeric_scale;
            $info->unsigned      = (stripos($rawcolumn->column_type, 'unsigned') !== false);
        } else if ($info->meta_type === 'X') {
            // Watch out for PHP max int limits by casting this to string.
            // Note: This shouldn't be an issue any more since Moodle requires 62-bit PHP versions.
            if ("$rawcolumn->character_maximum_length" === '4294967295') {
                // Means maximum moodle size for text column, in other drivers it may also mean unknown size.
                $info->max_length = -1;
            } else {
                $info->max_length = $rawcolumn->character_maximum_length;
            }
            $info->primary_key   = false;
        } else if ($info->meta_type === 'B') {
            $info->max_length    = -1;
            $info->primary_key   = false;
            $info->binary        = true;
        }

        return $info;
    }

    /**
     * Normalise the MySQLi column type.
     *
     * @param string $type
     * @return string one character
     * @throws dml_exception
     */
    private function mysqltype2moodletype(string $type): string {
        switch (strtoupper($type)) {
            case 'BIT':
                return 'L';

            case 'TINYINT':
            case 'SMALLINT':
            case 'MEDIUMINT':
            case 'INT':
            case 'INTEGER':
            case 'BIGINT':
                return 'I';

            case 'FLOAT':
            case 'DOUBLE':
            case 'DECIMAL':
                return 'N';

            case 'CHAR':
            case 'ENUM':
            case 'SET':
            case 'VARCHAR':
                return 'C';

            case 'TINYTEXT':
            case 'TEXT':
            case 'MEDIUMTEXT':
            case 'LONGTEXT':
                return 'X';

            case 'BINARY':
            case 'VARBINARY':
            case 'BLOB':
            case 'TINYBLOB':
            case 'MEDIUMBLOB':
            case 'LONGBLOB':
                return 'B';

            case 'DATE':
            case 'TIME':
            case 'DATETIME':
            case 'TIMESTAMP':
            case 'YEAR':
                return 'D';
        }

        throw new dml_exception('invalidmysqlnativetype', $type);
    }

    #[\Override]
    protected function normalise_value(database_column_info $column, mixed $value): mixed {
        $this->detect_objects($value);

        if (is_bool($value)) {
            // Always, convert boolean to int.
            $value = (int)$value;
        } else if ($value === '') {
            if ($column->meta_type == 'I' || $column->meta_type == 'F' || $column->meta_type == 'N') {
                // Prevent '' problems in numeric fields.
                $value = 0;
            }
            // Any float value being stored in varchar or text field is converted to string to avoid
            // any implicit conversion by MySQL.
        } else if (is_float($value) && ($column->meta_type == 'C' || $column->meta_type == 'X')) {
            $value = "$value";
        }
        return $value;
    }

    #[\Override]
    public function setup_is_unicodedb(): bool {
        // All new tables are created with this collation, we just have to make sure it is utf8 compatible,
        // if config table already exists it has this collation too.
        $collation = $this->get_dbcollation();

        $collationinfo = explode('_', $collation);
        $charset = reset($collationinfo);

        $sql = "SHOW COLLATION WHERE Collation ='$collation' AND Charset = '$charset'";
        $this->query_start($sql, null, SQL_QUERY_AUX_READONLY);
        $result = $this->mysqli->query($sql);
        $this->query_end($result);
        if ($result->fetch_assoc()) {
            $return = true;
        } else {
            $return = false;
        }
        $result->close();

        return $return;
    }

    /**
     * Do NOT use in code, to be used by database_manager only!
     * @param string|array $sql query
     * @param array|null $tablenames an array of xmldb table names affected by this request.
     * @return bool true
     * @throws ddl_change_structure_exception A DDL specific exception is thrown for any errors.
     */
    #[\Override]
    public function change_database_structure(
        string|array $sql,
        ?array $tablenames = null,
    ): bool {
        $this->get_manager();
        if (is_array($sql)) {
            $sql = implode("\n;\n", $sql);
        }

        try {
            $this->query_start($sql, null, SQL_QUERY_STRUCTURE);
            $result = $this->mysqli->multi_query($sql);
            if ($result === false) {
                $this->query_end(false);
            }
            while ($this->mysqli->more_results()) {
                $result = $this->mysqli->next_result();
                if ($result === false) {
                    $this->query_end(false);
                }
            }
            $this->query_end(true);
        } catch (ddl_change_structure_exception $e) {
            while (@$this->mysqli->more_results()) {
                @$this->mysqli->next_result();
            }
            $this->reset_caches($tablenames);
            throw $e;
        }

        $this->reset_caches($tablenames);
        return true;
    }

    /**
     * Emulate the bound parameters in a query.
     *
     * Emulates bound parameters in queries because prepared statements do not use query cache.
     *
     * @param string $sql
     * @param null|array $params
     * @return string
     */
    protected function emulate_bound_params(string $sql, ?array $params = null): string {
        if (empty($params)) {
            return $sql;
        }
        // We have verified sql statement with ? and correct number of params.
        $parts = array_reverse(explode('?', $sql));
        $return = array_pop($parts);
        foreach ($params as $param) {
            if (is_bool($param)) {
                $return .= (int)$param;
            } else if (is_null($param)) {
                $return .= 'NULL';
            } else if (is_number($param)) {
                // We have to always use strings because mysql is using weird automatic int casting.
                $return .= "'" . $param . "'";
            } else if (is_float($param)) {
                $return .= $param;
            } else {
                $param = $this->mysqli->real_escape_string($param);
                $return .= "'$param'";
            }
            $return .= array_pop($parts);
        }
        return $return;
    }

    #[\Override]
    public function execute($sql, ?array $params = null): bool {
        [$sql, $params, $type] = $this->fix_sql_params($sql, $params);

        if (strpos($sql, ';') !== false) {
            throw new coding_exception(
                'moodle_database::execute() Multiple sql statements found or bound parameters not used properly in query!',
            );
        }

        $rawsql = $this->emulate_bound_params($sql, $params);

        $this->query_start($sql, $params, SQL_QUERY_UPDATE);
        $result = $this->mysqli->query($rawsql);
        $this->query_end($result);

        if ($result === true) {
            return true;
        } else {
            $result->close();
            return true;
        }
    }

    #[\Override]
    public function get_recordset_sql(
        string $sql,
        ?array $params = null,
        string|int|null $limitfrom = 0,
        string|int|null $limitnum = 0,
    ): \core\dml\recordset {
        [$limitfrom, $limitnum] = $this->normalise_limit_from_num($limitfrom, $limitnum);

        if ($limitfrom || $limitnum) {
            if ($limitnum < 1) {
                $limitnum = "18446744073709551615";
            }
            $sql .= " LIMIT $limitfrom, $limitnum";
        }

        [$sql, $params, $type] = $this->fix_sql_params($sql, $params);
        $rawsql = $this->emulate_bound_params($sql, $params);

        $this->query_start($sql, $params, SQL_QUERY_SELECT);
        // Do not use MYSQLI_USE_RESULT here, it would block write ops on affected tables.
        $result = $this->mysqli->query($rawsql, MYSQLI_STORE_RESULT);
        $this->query_end($result);

        return $this->create_recordset($result);
    }

    #[\Override]
    public function export_table_recordset($table): \core\dml\recordset {
        $sql = $this->fix_table_names("SELECT * FROM {{$table}}");

        $this->query_start($sql, [], SQL_QUERY_SELECT);
        // MYSQLI_STORE_RESULT may eat all memory for large tables, unfortunately MYSQLI_USE_RESULT blocks other queries.
        $result = $this->mysqli->query($sql, MYSQLI_USE_RESULT);
        $this->query_end($result);

        return $this->create_recordset($result);
    }

    /**
     * Create a recordset for a result.
     *
     * @param mixed $result
     * @return recordset
     */
    protected function create_recordset(\mysqli_result|bool $result): \core\dml\recordset {
        return new recordset($result);
    }

    #[\Override]
    public function get_records_sql(
        string $sql,
        ?array $params = null,
        string|int|null $limitfrom = 0,
        string|int|null $limitnum = 0,
    ): array {
        [$limitfrom, $limitnum] = $this->normalise_limit_from_num($limitfrom, $limitnum);

        if ($limitfrom || $limitnum) {
            if ($limitnum < 1) {
                $limitnum = "18446744073709551615";
            }
            $sql .= " LIMIT $limitfrom, $limitnum";
        }

        [$sql, $params, $type] = $this->fix_sql_params($sql, $params);
        $rawsql = $this->emulate_bound_params($sql, $params);

        $this->query_start($sql, $params, SQL_QUERY_SELECT);
        $result = $this->mysqli->query($rawsql, MYSQLI_STORE_RESULT);
        $this->query_end($result);

        $return = [];

        while ($row = $result->fetch_assoc()) {
            $row = array_change_key_case($row, CASE_LOWER);
            $id  = reset($row);
            if (isset($return[$id])) {
                $colname = key($row);
                debugging(
                    "Did you remember to make the first column something unique in your call to get_records? "
                        . "Duplicate value '$id' found in column '$colname'.",
                    DEBUG_DEVELOPER,
                );
            }
            $return[$id] = (object)$row;
        }
        $result->close();

        return $return;
    }

    #[\Override]
    public function get_fieldset_sql($sql, ?array $params = null): array {
        [$sql, $params, $type] = $this->fix_sql_params($sql, $params);
        $rawsql = $this->emulate_bound_params($sql, $params);

        $this->query_start($sql, $params, SQL_QUERY_SELECT);
        $result = $this->mysqli->query($rawsql, MYSQLI_STORE_RESULT);
        $this->query_end($result);

        $return = [];

        while ($row = $result->fetch_assoc()) {
            $return[] = reset($row);
        }
        $result->close();

        return $return;
    }

    #[\Override]
    public function insert_record_raw($table, $params, $returnid = true, $bulk = false, $customsequence = false): bool|int {
        if (!is_array($params)) {
            $params = (array)$params;
        }

        if ($customsequence) {
            if (!isset($params['id'])) {
                throw new coding_exception(
                    'moodle_database::insert_record_raw() id field must be specified if custom sequences used.',
                );
            }
            $returnid = false;
        } else {
            unset($params['id']);
        }

        if (empty($params)) {
            throw new coding_exception('moodle_database::insert_record_raw() no fields found.');
        }

        $fields = implode(',', array_keys($params));
        $qms    = array_fill(0, count($params), '?');
        $qms    = implode(',', $qms);
        $fixedtable = $this->fix_table_name($table);
        $sql = "INSERT INTO $fixedtable ($fields) VALUES($qms)";

        [$sql, $params, $type] = $this->fix_sql_params($sql, $params);
        $rawsql = $this->emulate_bound_params($sql, $params);

        $this->query_start($sql, $params, SQL_QUERY_INSERT);
        $result = $this->mysqli->query($rawsql);
        // Must be called before query_end() which may insert log into db.
        $id = @$this->mysqli->insert_id;
        $this->query_end($result);

        if (!$customsequence && !$id) {
            throw new write_exception('unknown error fetching inserted id');
        }

        if (!$returnid) {
            return true;
        } else {
            return (int)$id;
        }
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

    /**
     * Get chunk size for multiple records insert.
     *
     * @return int
     */
    private function insert_chunk_size(): int {
        // MySQL has a relatively small query length limit by default,
        // make sure 'max_allowed_packet' in my.cnf is high enough
        // if you change the following default.
        if ($this->chunksize === null) {
            if (!empty($this->dboptions['bulkinsertsize'])) {
                $this->chunksize = (int)$this->dboptions['bulkinsertsize'];
            } else {
                if (PHP_INT_SIZE === 4) {
                    // Bad luck for Windows, we cannot do any maths with large numbers.
                    $chunksize = 5;
                } else {
                    $sql = "SHOW VARIABLES LIKE 'max_allowed_packet'";
                    $this->query_start($sql, null, SQL_QUERY_AUX);
                    $result = $this->mysqli->query($sql);
                    $this->query_end($result);
                    $size = 0;
                    if ($rec = $result->fetch_assoc()) {
                        $size = $rec['Value'];
                    }
                    $result->close();
                    // Hopefully 200kb per object are enough.
                    $chunksize = (int)($size / 200000);
                    if ($chunksize > 50) {
                        $chunksize = 50;
                    }
                }
                $this->chunksize = $chunksize;
            }
        }
        return $this->chunksize;
    }

    #[\Override]
    public function insert_records(string $table, $dataobjects): void {
        if (!is_array($dataobjects) && !$dataobjects instanceof Traversable) {
            throw new coding_exception('insert_records() passed non-traversable object');
        }

        $chunksize = $this->insert_chunk_size();
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
     * Insert records in chunks.
     *
     * Note: can be used only from insert_records().
     *
     * @param string $table
     * @param array $chunk
     * @param database_column_info[] $columns
     */
    protected function insert_chunk(string $table, array $chunk, array $columns): void {
        $fieldssql = '(' . implode(',', array_keys($columns)) . ')';

        $valuessql = '(' . implode(',', array_fill(0, count($columns), '?')) . ')';
        $valuessql = implode(',', array_fill(0, count($chunk), $valuessql));

        $params = [];
        foreach ($chunk as $dataobject) {
            foreach ($columns as $field => $column) {
                $params[] = $this->normalise_value($column, $dataobject[$field]);
            }
        }

        $fixedtable = $this->fix_table_name($table);
        $sql = "INSERT INTO $fixedtable $fieldssql VALUES $valuessql";

        [$sql, $params, $type] = $this->fix_sql_params($sql, $params);
        $rawsql = $this->emulate_bound_params($sql, $params);

        $this->query_start($sql, $params, SQL_QUERY_INSERT);
        $result = $this->mysqli->query($rawsql);
        $this->query_end($result);
    }

    #[\Override]
    public function import_record($table, $dataobject): bool|int {
        $dataobject = (array)$dataobject;

        $columns = $this->get_columns($table);
        $cleaned = [];

        foreach ($dataobject as $field => $value) {
            if (!isset($columns[$field])) {
                continue;
            }
            $cleaned[$field] = $value;
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

        $sets = [];
        foreach ($params as $field => $value) {
            $sets[] = "$field = ?";
        }

        // The last ? in the WHERE condition.
        $params[] = $id;

        $sets = implode(',', $sets);
        $fixedtable = $this->fix_table_name($table);
        $sql = "UPDATE $fixedtable SET $sets WHERE id=?";

        [$sql, $params, $type] = $this->fix_sql_params($sql, $params);
        $rawsql = $this->emulate_bound_params($sql, $params);

        $this->query_start($sql, $params, SQL_QUERY_UPDATE);
        $result = $this->mysqli->query($rawsql);
        $this->query_end($result);

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
        [$select, $params, $type] = $this->fix_sql_params($select, $params);

        // Get column metadata.
        $columns = $this->get_columns($table);
        $column = $columns[$newfield];

        $normalisedvalue = $this->normalise_value($column, $newvalue);

        if (is_null($normalisedvalue)) {
            $newfield = "$newfield = NULL";
        } else {
            $newfield = "$newfield = ?";
            array_unshift($params, $normalisedvalue);
        }
        $fixedtable = $this->fix_table_name($table);
        $sql = "UPDATE $fixedtable SET $newfield $select";
        $rawsql = $this->emulate_bound_params($sql, $params);

        $this->query_start($sql, $params, SQL_QUERY_UPDATE);
        $result = $this->mysqli->query($rawsql);
        $this->query_end($result);

        return true;
    }

    #[\Override]
    public function delete_records_select($table, $select, ?array $params = null): bool {
        if ($select) {
            $select = "WHERE $select";
        }
        $fixedtable = $this->fix_table_name($table);
        $sql = "DELETE FROM $fixedtable $select";

        [$sql, $params, $type] = $this->fix_sql_params($sql, $params);
        $rawsql = $this->emulate_bound_params($sql, $params);

        $this->query_start($sql, $params, SQL_QUERY_UPDATE);
        $result = $this->mysqli->query($rawsql);
        $this->query_end($result);

        return true;
    }

    /**
     * Deletes records using a subquery, which is done with a strange DELETE...JOIN syntax in MySQL
     * because it performs very badly with normal subqueries.
     *
     * @param string $table Table to delete from
     * @param string $field Field in table to match
     * @param string $alias Name of single column in subquery e.g. 'id'
     * @param string $subquery Query that will return values of the field to delete
     * @param array $params Parameters for query
     * @throws dml_exception If there is any error
     */
    #[\Override]
    public function delete_records_subquery(
        string $table,
        string $field,
        string $alias,
        string $subquery,
        array $params = [],
    ): void {
        // Aliases mysql_deltable and mysql_subquery are chosen to be unlikely to conflict.
        $this->execute(
            "DELETE mysql_deltable FROM {" . $table . "} mysql_deltable JOIN "
                . "({$subquery}) mysql_subquery ON mysql_subquery.{$alias} = mysql_deltable.{$field}",
            $params,
        );
    }

    #[\Override]
    public function sql_cast_char2int(string $fieldname, bool $text = false): string {
        return " CAST({$fieldname} AS SIGNED) ";
    }

    #[\Override]
    public function sql_cast_char2real(string $fieldname, bool $text = false): string {
        // Set to 65 (max mysql 5.5 precision) with 7 as scale
        // because we must ensure at least 6 decimal positions
        // per casting given that postgres is casting to that scale (::real::).
        // Can be raised easily but that must be done in all DBs and tests.
        return " CAST({$fieldname} AS DECIMAL(65,7)) ";
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

        $collationinfo = explode('_', $this->get_dbcollation());
        $bincollate = reset($collationinfo) . '_bin';

        if ($casesensitive) {
            // Current MySQL versions do not support case sensitive and accent insensitive.
            return "$fieldname COLLATE $bincollate $equalop $param";
        } else if ($accentsensitive) {
            // Case insensitive and accent sensitive, we can force a binary comparison once all texts are using the same case.
            return "LOWER($fieldname) COLLATE $bincollate $equalop LOWER($param)";
        } else {
            // Case insensitive and accent insensitive. All collations are that way, but utf8_bin.
            $collation = '';
            if ($this->get_dbcollation() == 'utf8_bin') {
                $collation = 'COLLATE utf8_unicode_ci';
            } else if ($this->get_dbcollation() == 'utf8mb4_bin') {
                $collation = 'COLLATE utf8mb4_unicode_ci';
            }
            return "$fieldname $collation $equalop $param";
        }
    }

    /**
     * Returns 'LIKE' part of a query.
     *
     * Note that mysql does not support $casesensitive = true and $accentsensitive = false.
     * More information in http://bugs.mysql.com/bug.php?id=19567.
     *
     * @param string $fieldname usually name of the table column
     * @param string $param usually bound query parameter (?, :named)
     * @param bool $casesensitive use case sensitive search
     * @param bool $accensensitive use accent sensitive search (ignored if $casesensitive is true)
     * @param bool $notlike true means "NOT LIKE"
     * @param string $escapechar escape char for '%' and '_'
     * @return string SQL code fragment
     */
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
        // Prevents problems with C-style escapes of enclosing '\'.
        $escapechar = $this->mysqli->real_escape_string($escapechar);

        $collationinfo = explode('_', $this->get_dbcollation());
        $bincollate = reset($collationinfo) . '_bin';

        $like = $notlike ? 'NOT LIKE' : 'LIKE';

        if ($casesensitive) {
            // Current MySQL versions do not support case sensitive and accent insensitive.
            return "$fieldname $like $param COLLATE $bincollate ESCAPE '$escapechar'";
        } else if ($accentsensitive) {
            // Case insensitive and accent sensitive, we can force a binary comparison once all texts are using the same case.
            return "LOWER($fieldname) $like LOWER($param) COLLATE $bincollate ESCAPE '$escapechar'";
        } else {
            // Case insensitive and accent insensitive.
            $collation = '';
            if ($this->get_dbcollation() == 'utf8_bin') {
                // Force a case insensitive comparison if using utf8_bin.
                $collation = 'COLLATE utf8_unicode_ci';
            } else if ($this->get_dbcollation() == 'utf8mb4_bin') {
                // Force a case insensitive comparison if using utf8mb4_bin.
                $collation = 'COLLATE utf8mb4_unicode_ci';
            }

            return "$fieldname $like $param $collation ESCAPE '$escapechar'";
        }
    }

    #[\Override]
    public function sql_concat(...$arr): string {
        $s = implode(', ', $arr);
        if ($s === '') {
            return "''";
        }
        return "CONCAT({$s})";
    }

    #[\Override]
    public function sql_concat_join($separator = "' '", $elements = []): string {
        $s = implode(', ', $elements);

        if ($s === '') {
            return "''";
        }
        return "CONCAT_WS({$separator}, {$s})";
    }

    /**
     * Return SQL for performing group concatenation on given field/expression.
     *
     * @param string $field
     * @param string $separator
     * @param string $sort
     * @return string
     */
    public function sql_group_concat(string $field, string $separator = ', ', string $sort = ''): string {
        $fieldsort = $sort ? "ORDER BY {$sort}" : '';
        return "GROUP_CONCAT({$field} {$fieldsort} SEPARATOR '{$separator}')";
    }

    #[\Override]
    public function sql_length($fieldname): string {
        return "CHAR_LENGTH({$fieldname})";
    }

    #[\Override]
    public function sql_regex_supported(): bool {
        return true;
    }

    #[\Override]
    public function sql_regex(bool $positivematch = true, bool $casesensitive = false): string {
        $collation = '';
        if ($casesensitive) {
            if (substr($this->get_dbcollation(), -4) !== '_bin') {
                $collationinfo = explode('_', $this->get_dbcollation());
                $collation = 'COLLATE ' . $collationinfo[0] . '_bin ';
            }
        } else {
            if ($this->get_dbcollation() == 'utf8_bin') {
                $collation = 'COLLATE utf8_unicode_ci ';
            } else if ($this->get_dbcollation() == 'utf8mb4_bin') {
                $collation = 'COLLATE utf8mb4_unicode_ci ';
            }
        }

        return $collation . ($positivematch ? 'REGEXP' : 'NOT REGEXP');
    }

    #[\Override]
    public function sql_regex_get_word_beginning_boundary_marker(): string {
        $ismysql = ($this->get_dbtype() == 'mysqli' || $this->get_dbtype() == 'auroramysql');
        $ismysqlge8d0d4 = ($ismysql && version_compare($this->get_server_info()['version'], '8.0.4', '>='));
        if ($ismysqlge8d0d4) {
            return '\\b';
        }
        // Prior to MySQL 8.0.4, MySQL used the Henry Spencer regular expression library to support regular expression operations,
        // rather than International Components for Unicode (ICU).
        // MariaDB still supports the "old marker" (MDEV-5357).
        return '[[:<:]]';
    }

    #[\Override]
    public function sql_regex_get_word_end_boundary_marker(): string {
        $ismysql = ($this->get_dbtype() == 'mysqli' || $this->get_dbtype() == 'auroramysql');
        $ismysqlge8d0d4 = ($ismysql && version_compare($this->get_server_info()['version'], '8.0.4', '>='));
        if ($ismysqlge8d0d4) {
            return '\\b';
        }
        // Prior to MySQL 8.0.4, MySQL used the Henry Spencer regular expression library to support regular expression operations,
        // rather than International Components for Unicode (ICU).
        // MariaDB still supports the "old marker" (MDEV-5357).
        return '[[:>:]]';
    }

    #[\Override]
    public function sql_intersect(array $selects, string $fields): string {
        if (count($selects) <= 1) {
            return parent::sql_intersect($selects, $fields);
        }
        $fields = preg_replace('/\s/', '', $fields);
        static $aliascnt = 0;
        $falias = 'intsctal' . ($aliascnt++);
        $rv = "SELECT $falias." .
            preg_replace('/,/', ',' . $falias . '.', $fields) .
            " FROM ($selects[0]) $falias";
        for ($i = 1; $i < count($selects); $i++) {
            $alias = 'intsctal' . ($aliascnt++);
            $rv .= " JOIN (" . $selects[$i] . ") $alias ON " .
                join(
                    ' AND ',
                    array_map(
                        function ($a) use ($alias, $falias) {
                            return $falias . '.' . $a . ' = ' . $alias . '.' . $a;
                        },
                        preg_split('/,/', $fields)
                    )
                );
        }
        return $rv;
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
     */
    #[\Override]
    public function get_session_lock(int $rowid, int $timeout): void {
        parent::get_session_lock($rowid, $timeout);

        $fullname = $this->dbname . '-' . $this->prefix . '-session-' . $rowid;
        $sql = "SELECT GET_LOCK('$fullname', $timeout)";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = $this->mysqli->query($sql);
        $this->query_end($result);

        if ($result) {
            $arr = $result->fetch_assoc();
            $result->close();

            if (reset($arr) == 1) {
                return;
            } else {
                throw new sessionwait_exception();
            }
        }
    }

    #[\Override]
    public function release_session_lock(int $rowid): void {
        if (!$this->is_used_for_db_sessions()) {
            return;
        }

        parent::release_session_lock($rowid);
        $fullname = $this->dbname . '-' . $this->prefix . '-session-' . $rowid;
        $sql = "SELECT RELEASE_LOCK('$fullname')";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = $this->mysqli->query($sql);
        $this->query_end($result);

        if ($result) {
            $result->close();
        }
    }

    /**
     * Are transactions supported?
     * It is not responsible to run productions servers
     * on databases without transaction support ;-)
     *
     * MyISAM does not support support transactions.
     *
     * You can override this via the dbtransactions option.
     *
     * @return bool
     */
    #[\Override]
    protected function transactions_supported(): bool {
        if (!is_null($this->transactionssupported)) {
            return $this->transactionssupported;
        }

        // This is all just guessing, might be better to just specify it in config.php.
        if (isset($this->dboptions['dbtransactions'])) {
            $this->transactionssupported = $this->dboptions['dbtransactions'];
            return $this->transactionssupported;
        }

        $this->transactionssupported = false;

        $engine = $this->get_dbengine();

        // Only will accept transactions if using compatible storage engine (more engines can be added easily BDB, Falcon...).
        if (in_array($engine, ['InnoDB', 'INNOBASE', 'BDB', 'XtraDB', 'Aria', 'Falcon'])) {
            $this->transactionssupported = true;
        }

        return $this->transactionssupported;
    }

    /**
     * Driver specific start of real database transaction, this can not be used directly in code.
     */
    #[\Override]
    protected function begin_transaction(): void {
        if (!$this->transactions_supported()) {
            return;
        }

        $sql = "SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = $this->mysqli->query($sql);
        $this->query_end($result);

        $sql = "START TRANSACTION";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = $this->mysqli->query($sql);
        $this->query_end($result);
    }

    /**
     * Driver specific commit of real database transaction, this can not be used directly in code.
     */
    #[\Override]
    protected function commit_transaction(): void {
        if (!$this->transactions_supported()) {
            return;
        }

        $sql = "COMMIT";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = $this->mysqli->query($sql);
        $this->query_end($result);
    }

    /**
     * Driver specific abort of real database transaction, this can not be used directly in code.
     */
    #[\Override]
    protected function rollback_transaction(): void {
        if (!$this->transactions_supported()) {
            return;
        }

        $sql = "ROLLBACK";
        $this->query_start($sql, null, SQL_QUERY_AUX);
        $result = $this->mysqli->query($sql);
        $this->query_end($result);
    }

    /**
     * Converts a table to either 'Compressed' or 'Dynamic' row format.
     *
     * @param string $tablename Name of the table to convert to the new row format.
     */
    public function convert_table_row_format($tablename): void {
        $currentrowformat = $this->get_row_format($tablename);
        if ($currentrowformat == 'Compact' || $currentrowformat == 'Redundant') {
            $rowformat = ($this->is_compressed_row_format_supported(false)) ? "ROW_FORMAT=Compressed" : "ROW_FORMAT=Dynamic";
            $prefix = $this->get_prefix();
            $this->change_database_structure("ALTER TABLE {$prefix}$tablename $rowformat");
        }
    }

    #[\Override]
    public function is_fulltext_search_supported(): bool {
        $info = $this->get_server_info();

        if (version_compare($info['version'], '5.6.4', '>=')) {
            return true;
        }
        return false;
    }

    #[\Override]
    protected function fix_table_name(string $tablename): string {
        $prefixedtablename = parent::fix_table_name($tablename);
        // This function quotes the table name if it matches one of the MySQL reserved words, e.g. groups.
        return $this->get_manager()->generator->getEncQuoted($prefixedtablename);
    }
}

// Alias this class to the old name.
// This file will be autoloaded by the legacyclasses autoload system.
// In future all uses of this class will be corrected and the legacy references will be removed.
class_alias(database::class, \mysqli_native_moodle_database::class);
