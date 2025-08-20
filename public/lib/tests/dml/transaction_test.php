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

use core\dml\exception\transaction_exception;
use xmldb_table;

/**
 * DML layer tests.
 *
 * @package    core
 * @category   test
 * @copyright  2008 Nicolas Connault
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(transaction::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(transaction_exception::class)]
final class transaction_test extends \database_driver_testcase {
    #[\Override]
    protected function setUp(): void {
        parent::setUp();
        $dbman = $this->tdb->get_manager(); // Loads DDL libs.
    }

    /**
     * Get a xmldb_table object for testing, deleting any existing table
     * of the same name, for example if one was left over from a previous test
     * run that crashed.
     *
     * @param string $suffix table name suffix, use if you need more test tables
     * @return xmldb_table the table object.
     */
    private function get_test_table(string $suffix = ''): xmldb_table {
        $tablename = "test_table";
        if ($suffix !== '') {
            $tablename .= $suffix;
        }

        $table = new xmldb_table($tablename);
        $table->setComment("This is a test'n drop table. You can drop it safely");
        return $table;
    }

    public function test_onelevel_commit(): void {
        $DB = $this->tdb;
        $dbman = $DB->get_manager();

        $table = $this->get_test_table();
        $tablename = $table->getName();

        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('course', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, '0');
        $table->add_key('primary', XMLDB_KEY_PRIMARY, ['id']);
        $dbman->create_table($table);

        $transaction = $DB->start_delegated_transaction();
        $data = (object)['course' => 3];
        $this->assertEquals(0, $DB->count_records($tablename));
        $DB->insert_record($tablename, $data);
        $this->assertEquals(1, $DB->count_records($tablename));
        $transaction->allow_commit();
        $this->assertEquals(1, $DB->count_records($tablename));

        $this->expectException(transaction_exception::class);
        $transaction->allow_commit();
    }

    public function test_transaction_ignore_error_trouble(): void {
        $DB = $this->tdb;

        $dbman = $DB->get_manager();

        $table = $this->get_test_table();
        $tablename = $table->getName();

        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('course', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, '0');
        $table->add_key('primary', XMLDB_KEY_PRIMARY, ['id']);
        $table->add_index('course', XMLDB_INDEX_UNIQUE, ['course']);
        $dbman->create_table($table);

        // Test error on SQL_QUERY_INSERT.
        $transaction = $DB->start_delegated_transaction();
        $this->assertEquals(0, $DB->count_records($tablename));
        $DB->insert_record($tablename, (object)['course' => 1]);
        $this->assertEquals(1, $DB->count_records($tablename));
        try {
            $DB->insert_record($tablename, (object)['course' => 1]);
        } catch (\Exception $e) {
            // This must be ignored and it must not roll back the whole transaction.
        }
        $DB->insert_record($tablename, (object)['course' => 2]);
        $this->assertEquals(2, $DB->count_records($tablename));
        $transaction->allow_commit();
        $this->assertEquals(2, $DB->count_records($tablename));
        $this->assertFalse($DB->is_transaction_started());

        // Test error on SQL_QUERY_SELECT.
        $DB->delete_records($tablename);
        $transaction = $DB->start_delegated_transaction();
        $this->assertEquals(0, $DB->count_records($tablename));
        $DB->insert_record($tablename, (object)['course' => 1]);
        $this->assertEquals(1, $DB->count_records($tablename));
        try {
            $DB->get_records_sql('s e l e c t');
        } catch (\moodle_exception $e) {
            // This must be ignored and it must not roll back the whole transaction.
        }
        $DB->insert_record($tablename, (object)['course' => 2]);
        $this->assertEquals(2, $DB->count_records($tablename));
        $transaction->allow_commit();
        $this->assertEquals(2, $DB->count_records($tablename));
        $this->assertFalse($DB->is_transaction_started());

        // Test error on structure SQL_QUERY_UPDATE.
        $DB->delete_records($tablename);
        $transaction = $DB->start_delegated_transaction();
        $this->assertEquals(0, $DB->count_records($tablename));
        $DB->insert_record($tablename, (object)['course' => 1]);
        $this->assertEquals(1, $DB->count_records($tablename));
        try {
            $DB->execute('xxxx');
        } catch (\moodle_exception $e) {
            // This must be ignored and it must not roll back the whole transaction.
        }
        $DB->insert_record($tablename, (object)['course' => 2]);
        $this->assertEquals(2, $DB->count_records($tablename));
        $transaction->allow_commit();
        $this->assertEquals(2, $DB->count_records($tablename));
        $this->assertFalse($DB->is_transaction_started());

        // Test error on structure SQL_QUERY_STRUCTURE.
        $DB->delete_records($tablename);
        $transaction = $DB->start_delegated_transaction();
        $this->assertEquals(0, $DB->count_records($tablename));
        $DB->insert_record($tablename, (object)['course' => 1]);
        $this->assertEquals(1, $DB->count_records($tablename));
        try {
            $DB->change_database_structure('xxxx');
        } catch (\moodle_exception $e) {
            // This must be ignored and it must not roll back the whole transaction.
        }
        $DB->insert_record($tablename, (object)['course' => 2]);
        $this->assertEquals(2, $DB->count_records($tablename));
        $transaction->allow_commit();
        $this->assertEquals(2, $DB->count_records($tablename));
        $this->assertFalse($DB->is_transaction_started());

        // NOTE: SQL_QUERY_STRUCTURE is intentionally not tested here because it should never fail.
    }

    public function test_onelevel_rollback(): void {
        $DB = $this->tdb;
        $dbman = $DB->get_manager();

        $table = $this->get_test_table();
        $tablename = $table->getName();

        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('course', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, '0');
        $table->add_key('primary', XMLDB_KEY_PRIMARY, ['id']);
        $dbman->create_table($table);

        // This might in fact encourage ppl to migrate from myisam to innodb.

        $transaction = $DB->start_delegated_transaction();
        $data = (object)['course' => 3];
        $this->assertEquals(0, $DB->count_records($tablename));
        $DB->insert_record($tablename, $data);
        $this->assertEquals(1, $DB->count_records($tablename));
        try {
            $transaction->rollback(new \Exception('test'));
            $this->fail('transaction rollback must rethrow exception');
        } catch (\Exception $e) {
            // Ignored.
        }
        $this->assertEquals(0, $DB->count_records($tablename));
    }

    public function test_nested_transactions(): void {
        $DB = $this->tdb;
        $dbman = $DB->get_manager();

        $table = $this->get_test_table();
        $tablename = $table->getName();

        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('course', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, '0');
        $table->add_key('primary', XMLDB_KEY_PRIMARY, ['id']);
        $dbman->create_table($table);

        // Two level commit.
        $this->assertFalse($DB->is_transaction_started());
        $transaction1 = $DB->start_delegated_transaction();
        $this->assertTrue($DB->is_transaction_started());
        $data = (object)['course' => 3];
        $DB->insert_record($tablename, $data);
        $transaction2 = $DB->start_delegated_transaction();
        $data = (object)['course' => 4];
        $DB->insert_record($tablename, $data);
        $transaction2->allow_commit();
        $this->assertTrue($DB->is_transaction_started());
        $transaction1->allow_commit();
        $this->assertFalse($DB->is_transaction_started());
        $this->assertEquals(2, $DB->count_records($tablename));

        $DB->delete_records($tablename);

        // Rollback from top level.
        $transaction1 = $DB->start_delegated_transaction();
        $data = (object)['course' => 3];
        $DB->insert_record($tablename, $data);
        $transaction2 = $DB->start_delegated_transaction();
        $data = (object)['course' => 4];
        $DB->insert_record($tablename, $data);
        $transaction2->allow_commit();
        try {
            $transaction1->rollback(new \Exception('test'));
            $this->fail('transaction rollback must rethrow exception');
        } catch (\Exception $e) {
            $this->assertEquals(get_class($e), 'Exception');
        }
        $this->assertEquals(0, $DB->count_records($tablename));

        $DB->delete_records($tablename);

        // Rollback from nested level.
        $transaction1 = $DB->start_delegated_transaction();
        $data = (object)['course' => 3];
        $DB->insert_record($tablename, $data);
        $transaction2 = $DB->start_delegated_transaction();
        $data = (object)['course' => 4];
        $DB->insert_record($tablename, $data);
        try {
            $transaction2->rollback(new \Exception('test'));
            $this->fail('transaction rollback must rethrow exception');
        } catch (\Exception $e) {
            $this->assertEquals(get_class($e), 'Exception');
        }
        $this->assertEquals(2, $DB->count_records($tablename)); // Not rolled back yet.
        try {
            $transaction1->allow_commit();
        } catch (\moodle_exception $e) {
            $this->assertInstanceOf('dml_transaction_exception', $e);
        }
        $this->assertEquals(2, $DB->count_records($tablename)); // Not rolled back yet.
        // The forced rollback is done from the default_exception handler and similar places,
        // let's do it manually here.
        $this->assertTrue($DB->is_transaction_started());
        $DB->force_transaction_rollback();
        $this->assertFalse($DB->is_transaction_started());
        $this->assertEquals(0, $DB->count_records($tablename)); // Finally rolled back.

        $DB->delete_records($tablename);

        // Test interactions of recordset and transactions - this causes problems in SQL Server.
        $table2 = $this->get_test_table('2');
        $tablename2 = $table2->getName();

        $table2->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table2->add_field('course', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, '0');
        $table2->add_key('primary', XMLDB_KEY_PRIMARY, ['id']);
        $dbman->create_table($table2);

        $DB->insert_record($tablename, ['course' => 1]);
        $DB->insert_record($tablename, ['course' => 2]);
        $DB->insert_record($tablename, ['course' => 3]);

        $DB->insert_record($tablename2, ['course' => 5]);
        $DB->insert_record($tablename2, ['course' => 6]);
        $DB->insert_record($tablename2, ['course' => 7]);
        $DB->insert_record($tablename2, ['course' => 8]);

        $rs1 = $DB->get_recordset($tablename);
        $i = 0;
        foreach ($rs1 as $record1) {
            $i++;
            $rs2 = $DB->get_recordset($tablename2);
            $j = 0;
            foreach ($rs2 as $record2) {
                $t = $DB->start_delegated_transaction();
                $DB->set_field($tablename, 'course', $record1->course + 1, ['id' => $record1->id]);
                $DB->set_field($tablename2, 'course', $record2->course + 1, ['id' => $record2->id]);
                $t->allow_commit();
                $j++;
            }
            $rs2->close();
            $this->assertEquals(4, $j);
        }
        $rs1->close();
        $this->assertEquals(3, $i);

        // Test nested recordsets isolation without transaction.
        $DB->delete_records($tablename);
        $DB->insert_record($tablename, ['course' => 1]);
        $DB->insert_record($tablename, ['course' => 2]);
        $DB->insert_record($tablename, ['course' => 3]);

        $DB->delete_records($tablename2);
        $DB->insert_record($tablename2, ['course' => 5]);
        $DB->insert_record($tablename2, ['course' => 6]);
        $DB->insert_record($tablename2, ['course' => 7]);
        $DB->insert_record($tablename2, ['course' => 8]);

        $rs1 = $DB->get_recordset($tablename);
        $i = 0;
        foreach ($rs1 as $record1) {
            $i++;
            $rs2 = $DB->get_recordset($tablename2);
            $j = 0;
            foreach ($rs2 as $record2) {
                $DB->set_field($tablename, 'course', $record1->course + 1, ['id' => $record1->id]);
                $DB->set_field($tablename2, 'course', $record2->course + 1, ['id' => $record2->id]);
                $j++;
            }
            $rs2->close();
            $this->assertEquals(4, $j);
        }
        $rs1->close();
        $this->assertEquals(3, $i);
    }

    public function test_transactions_forbidden(): void {
        $DB = $this->tdb;
        $dbman = $DB->get_manager();

        $table = $this->get_test_table();
        $tablename = $table->getName();

        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('course', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, '0');
        $table->add_key('primary', XMLDB_KEY_PRIMARY, ['id']);
        $dbman->create_table($table);

        $DB->transactions_forbidden();
        $transaction = $DB->start_delegated_transaction();
        $data = (object)['course' => 1];
        $DB->insert_record($tablename, $data);
        try {
            $DB->transactions_forbidden();
        } catch (\moodle_exception $e) {
            $this->assertInstanceOf('dml_transaction_exception', $e);
        }
        // The previous test does not force rollback.
        $transaction->allow_commit();
        $this->assertFalse($DB->is_transaction_started());
        $this->assertEquals(1, $DB->count_records($tablename));
    }

    public function test_wrong_transactions(): void {
        $DB = $this->tdb;
        $dbman = $DB->get_manager();

        $table = $this->get_test_table();
        $tablename = $table->getName();

        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('course', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, '0');
        $table->add_key('primary', XMLDB_KEY_PRIMARY, ['id']);
        $dbman->create_table($table);

        // Wrong order of nested commits.
        $transaction1 = $DB->start_delegated_transaction();
        $data = (object)['course' => 3];
        $DB->insert_record($tablename, $data);
        $transaction2 = $DB->start_delegated_transaction();
        $data = (object)['course' => 4];
        $DB->insert_record($tablename, $data);
        try {
            $transaction1->allow_commit();
            $this->fail('wrong order of commits must throw exception');
        } catch (\moodle_exception $e) {
            $this->assertInstanceOf('dml_transaction_exception', $e);
        }
        try {
            $transaction2->allow_commit();
            $this->fail('first wrong commit forces rollback');
        } catch (\moodle_exception $e) {
            $this->assertInstanceOf('dml_transaction_exception', $e);
        }
        // This is done in default exception handler usually.
        $this->assertTrue($DB->is_transaction_started());
        $this->assertEquals(2, $DB->count_records($tablename)); // Not rolled back yet.
        $DB->force_transaction_rollback();
        $this->assertEquals(0, $DB->count_records($tablename));
        $DB->delete_records($tablename);

        // Wrong order of nested rollbacks.
        $transaction1 = $DB->start_delegated_transaction();
        $data = (object)['course' => 3];
        $DB->insert_record($tablename, $data);
        $transaction2 = $DB->start_delegated_transaction();
        $data = (object)['course' => 4];
        $DB->insert_record($tablename, $data);
        try {
            // This first rollback should prevent all other rollbacks.
            $transaction1->rollback(new \Exception('test'));
        } catch (\Exception $e) {
            $this->assertEquals(get_class($e), 'Exception');
        }
        try {
            $transaction2->rollback(new \Exception('test'));
        } catch (\Exception $e) {
            $this->assertEquals(get_class($e), 'Exception');
        }
        try {
            $transaction1->rollback(new \Exception('test'));
        } catch (\moodle_exception $e) {
            $this->assertInstanceOf('dml_transaction_exception', $e);
        }
        // This is done in default exception handler usually.
        $this->assertTrue($DB->is_transaction_started());
        $DB->force_transaction_rollback();
        $DB->delete_records($tablename);

        // Unknown transaction object.
        $transaction1 = $DB->start_delegated_transaction();
        $data = (object)['course' => 3];
        $DB->insert_record($tablename, $data);
        $transaction2 = new transaction($DB);
        try {
            $transaction2->allow_commit();
            $this->fail('foreign transaction must fail');
        } catch (\moodle_exception $e) {
            $this->assertInstanceOf('dml_transaction_exception', $e);
        }
        try {
            $transaction1->allow_commit();
            $this->fail('first wrong commit forces rollback');
        } catch (\moodle_exception $e) {
            $this->assertInstanceOf('dml_transaction_exception', $e);
        }
        $DB->force_transaction_rollback();
        $DB->delete_records($tablename);
    }

    public function test_concurent_transactions(): void {
        // Notes about this test:
        // 1- MySQL needs to use one engine with transactions support (InnoDB).
        // 2- MSSQL needs to have enabled versioning for read committed
        // transactions (ALTER DATABASE xxx SET READ_COMMITTED_SNAPSHOT ON)
        $DB = $this->tdb;
        $dbman = $DB->get_manager();

        $table = $this->get_test_table();
        $tablename = $table->getName();

        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('course', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, '0');
        $table->add_key('primary', XMLDB_KEY_PRIMARY, ['id']);
        $dbman->create_table($table);

        $transaction = $DB->start_delegated_transaction();
        $data = (object)['course' => 1];
        $this->assertEquals(0, $DB->count_records($tablename));
        $DB->insert_record($tablename, $data);
        $this->assertEquals(1, $DB->count_records($tablename));

        // Open second connection.
        $cfg = $DB->export_dbconfig();
        if (!isset($cfg->dboptions)) {
            $cfg->dboptions = [];
        }
        // If we have a readonly replica situation, we need to either observe
        // the latency, or if the latency is not specified we need to take
        // the replica out because the table may not have propagated yet.
        if (isset($cfg->dboptions['readonly'])) {
            if (isset($cfg->dboptions['readonly']['latency'])) {
                usleep(intval(1000000 * $cfg->dboptions['readonly']['latency']));
            } else {
                unset($cfg->dboptions['readonly']);
            }
        }
        $DB2 = database::get_driver_instance($cfg->dbtype, $cfg->dblibrary);
        $DB2->connect($cfg->dbhost, $cfg->dbuser, $cfg->dbpass, $cfg->dbname, $cfg->prefix, $cfg->dboptions);

        // Second instance should not see pending inserts.
        $this->assertEquals(0, $DB2->count_records($tablename));
        $data = (object)['course' => 2];
        $DB2->insert_record($tablename, $data);
        $this->assertEquals(1, $DB2->count_records($tablename));

        // First should see the changes done from second.
        $this->assertEquals(2, $DB->count_records($tablename));

        // Now commit and we should see it finally in second connections.
        $transaction->allow_commit();
        $this->assertEquals(2, $DB2->count_records($tablename));

        // Let's try delete all is also working on (this checks MDL-29198).
        // Initially both connections see all the records in the table (2).
        $this->assertEquals(2, $DB->count_records($tablename));
        $this->assertEquals(2, $DB2->count_records($tablename));
        $transaction = $DB->start_delegated_transaction();

        // Delete all from within transaction.
        $DB->delete_records($tablename);

        // Transactional $DB, sees 0 records now.
        $this->assertEquals(0, $DB->count_records($tablename));

        // Others ($DB2) get no changes yet.
        $this->assertEquals(2, $DB2->count_records($tablename));

        // Now commit and we should see changes.
        $transaction->allow_commit();
        $this->assertEquals(0, $DB2->count_records($tablename));

        $DB2->dispose();
    }

    public function test_get_backtrace(): void {
        $DB = $this->tdb;
        $transaction = $DB->start_delegated_transaction();
        $this->assertIsArray($transaction->get_backtrace());
        $transaction->allow_commit();
    }
}
    