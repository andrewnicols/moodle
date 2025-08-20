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

use core\exception\response_aware_exception;
use core\router\response\not_found_response;

/**
 * Caused by missing record that is required for normal operation.
 *
 * @package    core
 * @category   dml
 * @subpackage dml
 * @copyright  2008 Petr Skoda (http://skodak.org)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class missing_record_exception extends exception implements response_aware_exception {
    /** @var string A table's name.*/
    public $tablename;
    /** @var string An SQL query.*/
    public $sql;
    /** @var array The SQL's parameters.*/
    public $params;

    /**
     * Constructor
     * @param string $tablename The table name if known, '' if unknown.
     * @param string $sql Optional SQL query.
     * @param array $params Optional SQL query's parameters.
     */
    function __construct($tablename, $sql = '', ?array $params = null) {
        // If the debug is disabled the database information should not be displayed.
        if (empty($tablename) || !debugging()) {
            $tablename = null;
        }
        $this->tablename = $tablename;
        $this->sql       = $sql;
        $this->params    = $params;

        switch ($tablename) {
            case null:
                $errcode = 'invalidrecordunknown';
                break;
            case 'course':
                $errcode = empty($sql) ? 'invalidcourseid' : 'invalidrecord';
                break;
            case 'course_modules':
                $errcode = 'invalidcoursemodule';
                break;
            case 'user':
                $errcode = 'invaliduser';
                break;
            default:
                $errcode = 'invalidrecord';
                break;
        }
        $errorinfo = $sql . "\n[" . var_export($params, true) . ']';
        parent::__construct($errcode, $tablename, $errorinfo);
    }

    #[\Override]
    public function get_response_classname(): string {
        return not_found_response::class;
    }
}

// Alias this class to the old name.
// This file will be autoloaded by the legacyclasses autoload system.
// In future all uses of this class will be corrected and the legacy references will be removed.
class_alias(missing_record_exception::class, \dml_missing_record_exception::class);
