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
    protected ?bool $compressedrowformatsupported = false;

    #[\Override]
    public function get_name(): string {
        return get_string('nativeauroramysql', 'install');
    }

    #[\Override]
    public function get_configuration_help(): string {
        return get_string('nativeauroramysql', 'install');
    }

    #[\Override]
    public function get_dbvendor(): string {
        return 'auroramysql';
    }

    #[\Override]
    protected function get_dbtype(): string {
        return 'auroramysql';
    }

    /**
     * It is time to require transactions everywhere.
     *
     * MyISAM is NOT supported!
     *
     * @return bool
     */
    #[\Override]
    protected function transactions_supported(): bool {
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
