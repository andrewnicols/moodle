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

namespace core\dml\driver\auroramysql\native;

/**
 * Native Aurora MySQL class representing moodle database interface.
 *
 * @package    core_dml
 * @copyright  2020 Lafayette College ITS
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class database extends \core\dml\driver\mysqli\native\database {
    /** @var bool is compressed row format supported cache */
    protected $compressedrowformatsupported = false;

    /**
     * Returns localised database type name.
     *
     * Returns localised database type name. Can be used before connect().
     * @return string
     */
    public function get_name(): ?string {
        return get_string('nativeauroramysql', 'install');
    }

    /**
     * Returns localised database configuration help.
     *
     * Returns localised database configuration help. Can be used before connect().
     * @return string
     */
    public function get_configuration_help(): ?string {
        return get_string('nativeauroramysql', 'install');
    }

    /**
     * Returns the database vendor.
     *
     * Returns the database vendor. Can be used before connect().
     * @return string The db vendor name, usually the same as db family name.
     */
    public function get_dbvendor(): ?string {
        return 'auroramysql';
    }

    /**
     * Returns more specific database driver type
     *
     * Returns more specific database driver type. Can be used before connect().
     * @return string db type mysqli, pgsql, mssql, sqlsrv
     */
    protected function get_dbtype(): ?string {
        return 'auroramysql';
    }

    /**
     * It is time to require transactions everywhere.
     *
     * MyISAM is NOT supported!
     *
     * @return bool
     */
    protected function transactions_supported(): ?bool {
        if ($this->external) {
            return parent::transactions_supported();
        }
        return true;
    }


}

// Alias this class to the old name.
// This file will be autoloaded by the legacyclasses autoload system.
// In future all uses of this class will be corrected and the legacy references will be removed.
class_alias(database::class, \auroramysql_native_moodle_database::class);
