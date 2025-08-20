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

namespace core\dml\exception;

/**
 * DML read exception - triggered by some SQL syntax errors, etc.
 *
 * @package    core
 * @category   dml
 * @subpackage dml
 * @copyright  2008 Petr Skoda (http://skodak.org)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class read_exception extends exception {
    /**
     * Construct a new read exception.
     *
     * @param ?string $error The name of the string from error.php to print.
     * @param ?string $sql The SQL that ran just before this read error.
     * @param ?array $params The SQL's related parameters.(optional)
     */
    public function __construct(
        /** @var string The name of the string from error.php to print */
        public readonly ?string $error,
        /** @var string The SQL that ran just before this read error */
        public readonly ?string $sql = null,
        /** @var string The SQL that ran just before this read error */
        public readonly ?array $params = null,
    ) {
        $errorinfo = $error . "\n" . $sql . "\n[" . var_export($params, true) . ']';
        parent::__construct('dmlreadexception', null, $errorinfo);
    }
}

// Alias this class to the old name.
// This file will be autoloaded by the legacyclasses autoload system.
// In future all uses of this class will be corrected and the legacy references will be removed.
class_alias(read_exception::class, \dml_read_exception::class);
