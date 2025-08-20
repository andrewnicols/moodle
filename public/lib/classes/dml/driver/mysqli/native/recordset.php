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

use mysqli_result;
use stdClass;

/**
 * Mysqli specific moodle recordset class
 *
 * @package    core
 * @subpackage dml_driver
 * @copyright  2008 Petr Skoda (http://skodak.org)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class recordset extends \core\dml\recordset {
    /** @var array|bool|null The current record value */
    protected array|bool|null $current;

    /**
     * Create a new instance of the MySQLi recordset.
     *
     * @param mysqli_result|null|bool $result The MySQLi result object.
     */
    public function __construct(
        /** @var mysqli_result|bool|null The MySQLi Result */
        protected mysqli_result|bool|null $result,
    ) {
        $this->current = $this->fetch_next();
    }

    /**
     * Destructor to ensure the recordset is closed.
     *
     * This will free resources and connections, making the recordset unusable.
     */
    public function __destruct() {
        $this->close();
    }

    /**
     * Fetch the next record.
     */
    private function fetch_next(): array|bool {
        if (!$this->result) {
            return false;
        }
        if (!$row = $this->result->fetch_assoc()) {
            $this->result->close();
            $this->result = null;
            return false;
        }

        $row = array_change_key_case($row, CASE_LOWER);
        return $row;
    }

    #[\Override]
    public function current(): stdClass {
        return (object) $this->current;
    }

    #[\ReturnTypeWillChange]
    #[\Override]
    public function key() {
        // Return first column value as key.
        if (!$this->current) {
            return false;
        }
        $key = reset($this->current);
        return $key;
    }

    #[\Override]
    public function next(): void {
        $this->current = $this->fetch_next();
    }

    #[\Override]
    public function valid(): bool {
        return !empty($this->current);
    }

    #[\Override]
    public function close() {
        if ($this->result) {
            $this->result->close();
            $this->result  = null;
        }
        $this->current = null;
    }
}

// Alias this class to the old name.
// This file will be autoloaded by the legacyclasses autoload system.
// In future all uses of this class will be corrected and the legacy references will be removed.
class_alias(recordset::class, \mysqli_native_moodle_recordset::class);
