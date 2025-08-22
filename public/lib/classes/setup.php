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

namespace core;

use core\dml\database;
use core\dml\exception\exception as dml_exception;
use core\exception\moodle_exception;

/**
 * Setup class used to configure and initialise Moodle.
 * 
 * Note: This class is critical to the setup and initialisation of Moodle.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class setup {
    /**
     * Sets up global $DB database instance.
     *
     * @return bool Whether the database was configured. Returns false if it is already configured.
     */
    public static function initialise_database(): bool {
        global $CFG, $DB;

        if (isset($DB)) {
            return false;
        }

        if (!isset($CFG->dbuser)) {
            $CFG->dbuser = '';
        }

        if (!isset($CFG->dbpass)) {
            $CFG->dbpass = '';
        }

        if (!isset($CFG->dbname)) {
            $CFG->dbname = '';
        }

        if (!isset($CFG->dblibrary)) {
            $CFG->dblibrary = 'native';
            // Use new drivers instead of the old adodb driver names.
            switch ($CFG->dbtype) {
                case 'postgres7':
                    $CFG->dbtype = 'pgsql';
                    break;

                case 'mysql':
                    $CFG->dbtype = 'mysqli';
                    break;
            }
        }

        if (!isset($CFG->dboptions)) {
            $CFG->dboptions = [];
        }

        if (isset($CFG->dbpersist)) {
            $CFG->dboptions['dbpersist'] = $CFG->dbpersist;
        }

        if (!$DB = database::get_driver_instance($CFG->dbtype, $CFG->dblibrary)) {
            throw new dml_exception('dbdriverproblem', "Unknown driver $CFG->dblibrary/$CFG->dbtype");
        }

        try {
            $DB->connect($CFG->dbhost, $CFG->dbuser, $CFG->dbpass, $CFG->dbname, $CFG->prefix, $CFG->dboptions);
        } catch (moodle_exception $e) {
            if (empty($CFG->noemailever) && !empty($CFG->emailconnectionerrorsto)) {
                $body = <<<EOF
                Connection error: {$CFG->wwwroot}

                Info:
                    Error code: {$e->errorcode}
                    Debug info: {$e->debuginfo}
                    Server: {$_SERVER['SERVER_NAME']} ({$_SERVER['SERVER_ADDR']})
                EOF;

                $emailcount = "{$CFG->dataroot}/emailcount";
                if (file_exists($emailcount)) {
                    $fp = @fopen($emailcount, 'r');
                    $content = @fread($fp, 24);
                    @fclose($fp);
                    if ((time() - (int)$content) > 600) {
                        // Email directly rather than using messaging.
                        @mail(
                            $CFG->emailconnectionerrorsto,
                            "WARNING: Database connection error: {$CFG->wwwroot}",
                            $body,
                        );
                        $fp = @fopen($emailcount, 'w');
                        @fwrite($fp, time());
                    }
                } else {
                    // Email directly rather than using messaging.
                    @mail(
                        $CFG->emailconnectionerrorsto,
                        "WARNING: Database connection error: {$CFG->wwwroot}",
                        $body,
                    );
                    $fp = @fopen($emailcount, 'w');
                    @fwrite($fp, time());
                }
            }
            // Rethrow the exception.
            throw $e;
        }

        $CFG->dbfamily = $DB->get_dbfamily();

        return true;
    }

    /**
     * Returns whether the database is initialised.
     *
     * @return bool
     */
    public static function is_db_initialised(): bool {
        global $DB;

        return $DB instanceof database;
    }
}
