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

namespace core\dml\driver\mariadb\native;

/**
 * Native MariaDB class representing moodle database interface.
 *
 * @package    core_dml
 * @copyright  2013 Petr Skoda {@link http://skodak.org}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class database extends \core\dml\driver\mysqli\native\database {
    /**
     * Returns localised database type name
     * Note: can be used before connect()
     * @return string
     */
    public function get_name() {
        return get_string('nativemariadb', 'install');
    }

    /**
     * Returns localised database configuration help.
     * Note: can be used before connect()
     * @return string
     */
    public function get_configuration_help() {
        return get_string('nativemariadbhelp', 'install');
    }

    /**
     * Returns the database vendor.
     * Note: can be used before connect()
     * @return string The db vendor name, usually the same as db family name.
     */
    public function get_dbvendor() {
        return 'mariadb';
    }

    /**
     * Returns more specific database driver type
     * Note: can be used before connect()
     * @return string db type mysqli, pgsql, mssql, sqlsrv
     */
    protected function get_dbtype() {
        return 'mariadb';
    }

    protected function has_breaking_change_quoted_defaults() {
        $version = $this->get_server_info()['version'];
        // Breaking change since 10.2.7: MDEV-13132.
        return version_compare($version, '10.2.7', '>=');
    }

    public function has_breaking_change_sqlmode() {
        $version = $this->get_server_info()['version'];
        // Breaking change since 10.2.4: https://mariadb.com/kb/en/the-mariadb-library/sql-mode/#setting-sql_mode.
        return version_compare($version, '10.2.4', '>=');
    }

    /**
     * It is time to require transactions everywhere.
     *
     * MyISAM is NOT supported!
     *
     * @return bool
     */
    protected function transactions_supported() {
        if ($this->external) {
            return parent::transactions_supported();
        }
        return true;
    }

    /**
     * Does this mariadb instance support fulltext indexes?
     *
     * @return bool
     */
    public function is_fulltext_search_supported() {
        $info = $this->get_server_info();

        if (version_compare($info['version'], '10.0.5', '>=')) {
            return true;
        }
        return false;
    }

    /**
     * MariaDB supports the COUNT() window function and provides a performance improvement.
     *
     * @return bool
     */
    public function is_count_window_function_supported(): bool {
        return true;
    }
}

// Alias this class to the old name.
// This file will be autoloaded by the legacyclasses autoload system.
// In future all uses of this class will be corrected and the legacy references will be removed.
class_alias(database::class, \mariadb_native_moodle_database::class);
