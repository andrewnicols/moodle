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
use stdClass;


/**
 * Tests for \core\setup::initialise_database().
 *
 * @package    core
 * @category   test
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversMethod(setup::class, 'initialise_database')]
final class setup_initialise_database_test extends \basic_testcase {
    /** @var database */
    private database $db;

    /** @var stdClass */
    private stdClass $config;

    /**
     * Store the current database handler.
     */
    #[\PHPUnit\Framework\Attributes\Before]
    public function store_db_handler(): void {
        global $DB;

        $this->db = $DB;
    }

    /**
     * Store the standard site configuration.
     */
    #[\PHPUnit\Framework\Attributes\Before]
    public function store_config_handler(): void {
        global $CFG;

        $this->config = clone $CFG;
    }

    /**
     * Restore the database handler.
     */
    #[\PHPUnit\Framework\Attributes\After]
    public function restore_db_handler(): void {
        global $DB;

        $DB = $this->db;
    }

    /**
     * Restore the site configuration.
     */
    #[\PHPUnit\Framework\Attributes\After]
    public function restore_config_handler(): void {
        global $CFG;

        $CFG = $this->config;
    }

    /**
     * Clears the database connection.
     */
    private function clear_database(): void {
        global $DB;

        $DB = null;
    }

    /**
     * Initalise the database when it has already been loaded.
     */
    public function test_initialise_database_already_loaded(): void {
        $this->restore_db_handler();
        $this->assertFalse(setup::initialise_database());
        $this->assertTrue(setup::is_db_initialised());
    }

    /**
     * Check database intialisation when the database is not loaded.
     */
    public function test_initialise_database_not_loaded(): void {
        $this->clear_database();
        $this->assertFalse(setup::is_db_initialised());
        $this->assertTrue(setup::initialise_database());
        $this->assertTrue(setup::is_db_initialised());
    }

    public function test_initialise_with_fake_library(): void {
        global $CFG;

        $CFG->dblibrary = 'fake';

        $this->clear_database();
        $this->expectException(\core\dml\exception\exception::class);
        setup::initialise_database();
    }
}
