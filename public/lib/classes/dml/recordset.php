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
 * Abstract class for resultsets returned from database functions.
 *
 * This is a simple Iterator with needed recordset closing support.
 *
 * The difference from old recorset is that the records are returned
 * as objects, not arrays. You should use "foreach ($recordset as $record) {}"
 * followed by "$recordset->close()".
 *
 * Do not forget to close all recordsets when they are not needed anymore!
 *
 * @package    core
 * @copyright  Petr Skoda (http://skodak.org)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class recordset implements \Iterator {
    /**
     * Rewinds are not supported!
     */
    #[\Override]
    public function rewind(): void {
        // Seeking not supported inside a recordset.
        // Return and ignore the request.
        return;
    }

    /**
     * Free resources and connections, recordset can not be used anymore.
     */
    abstract public function close();
}

// Alias this class to the old name.
// This file will be autoloaded by the legacyclasses autoload system.
// In future all uses of this class will be corrected and the legacy references will be removed.
class_alias(recordset::class, \moodle_recordset::class);
