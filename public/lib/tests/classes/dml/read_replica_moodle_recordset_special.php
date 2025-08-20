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

use stdClass;

/**
 * Database recordset mock test class
 *
 * @package    core
 * @category   dml
 * @copyright  2018 Catalyst IT
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class read_replica_moodle_recordset_special extends \core\dml\recordset {
    #[\Override]
    public function close() {
    }

    #[\Override]
    public function current(): stdClass {
        return new stdClass();
    }

    #[\Override]
    public function next(): void {
    }

    #[\Override]
    #[\ReturnTypeWillChange]
    public function key() {
    }

    #[\Override]
    public function valid(): bool {
        return false;
    }
}
