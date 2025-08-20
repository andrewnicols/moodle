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
 * Tests for 
 *
 * @package    core
 * @category   test
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(database::class)]
final class database_test extends \database_driver_testcase {
    #[\PHPUnit\Framework\Attributes\DataProvider('invalid_data_driver_provider')]
    public function test_get_driver_instance_invalid(
        string $type,
        string $library,
    ): void {
        $this->assertNull(database::get_driver_instance($type, $library));
    }

    public static function invalid_data_driver_provider(): \Generator {
        yield ['invalid_type', 'invalid_library'];
        yield ['mysqli', 'pdo'];
        yield ['oci', 'native'];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('valid_data_driver_provider')]
    public function test_get_driver_instance(
        string $type,
        string $library,
    ): void {
        $this->assertInstanceOf(database::class, database::get_driver_instance($type, $library));
    }

    public static function valid_data_driver_provider(): \Generator {
        $drivers = [
            'auroramysql',
            'mysqli',
            'mariadb',
            'pgsql',
            'sqlsrv',
        ];

        foreach ($drivers as $driver) {
            yield [$driver, 'native'];
        }
    }

    public function test_get_transaction_start_backtrace(): void {
        $DB = $this->tdb;

        // No transactions, no backtrace.
        $this->assertNull($DB->get_transaction_start_backtrace());

        // One transaction, only backtrace.
        $transaction1 = $DB->start_delegated_transaction();

        $this->assertEquals($transaction1->get_backtrace(), $DB->get_transaction_start_backtrace());

        // Multiple transactions, final backtrace only.
        $transaction2 = $DB->start_delegated_transaction();
        $transaction3 = $DB->start_delegated_transaction();
        $this->assertEquals($transaction3->get_backtrace(), $DB->get_transaction_start_backtrace());

        $rollback = function ($transaction): void {
            $newexception = new class extends \Exception {};

            try {
                $transaction->rollback($newexception);
            } catch (\Throwable $e) {
                $this->assertSame($newexception, $e);
            }
        };

        $rollback($transaction3);
        $rollback($transaction2);
        $rollback($transaction1);
    }

    public function test_log_queries(): void {
        $DB = $this->tdb;
        $DB->get_manager();

        // Open second connection.
        $cfg = $DB->export_dbconfig();
        if (!isset($cfg->dboptions)) {
            $cfg->dboptions = [];
        }

        $cfg->dboptions['logall'] = true;
        $DB2 = database::get_driver_instance($cfg->dbtype, $cfg->dblibrary);
        $DB2->connect($cfg->dbhost, $cfg->dbuser, $cfg->dbpass, $cfg->dbname, $cfg->prefix, $cfg->dboptions);

        $DB2->get_records('user');

        $this->assertGreaterThan(0, $DB2->get_records('log_queries'));
        $this->assertGreaterThan(0, $DB2->get_records('log_queries'));
    }
}
