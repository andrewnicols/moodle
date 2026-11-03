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

namespace core\model;

use core\exception\coding_exception;
use core\model;
use core\model\attribute\field;
use core\model\attribute\table;
use core\param;
use PHPUnit\Framework\Attributes\CoversClass;
use xmldb_table;

/**
 * Model manager integration tests.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(manager::class)]
#[CoversClass(table::class)]
final class manager_test extends \advanced_testcase {
    /**
     * Create an isolated model table.
     */
    protected function setUp(): void {
        parent::setUp();
        $this->resetAfterTest();
        global $DB;
        $table = new xmldb_table('core_model_test');
        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE);
        $table->add_field('name', XMLDB_TYPE_CHAR, '100', null, XMLDB_NOTNULL);
        $table->add_field('timecreated', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL);
        $table->add_field('timemodified', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL);
        $table->add_field('usermodified', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL);
        $table->add_key('primary', XMLDB_KEY_PRIMARY, ['id']);
        $DB->get_manager()->create_table($table);
    }

    /**
     * Drop only this test's table.
     */
    protected function tearDown(): void {
        global $DB;
        $DB->get_manager()->drop_table(new xmldb_table('core_model_test'));
        parent::tearDown();
    }

    /**
     * Create the mapped model.
     *
     * @return model Model fixture.
     */
    private function make_model(): model {
        return new #[table('core_model_test')] class extends model { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
            /** @var int Creation time. */
            #[field(param::INT)]
            protected int $timecreated = 0;
            /** @var int Modification time. */
            #[field(param::INT)]
            protected int $timemodified = 0;
            /** @var int Modifying user ID. */
            #[field(param::INT)]
            protected int $usermodified = 0;
            /** @var mixed Required alphanumeric name. */
            #[field(param::ALPHANUM)]
            public mixed $name;
        };
    }

    /**
     * Save, load, update and delete with audit fields and ID tracking.
     */
    public function test_crud_and_audit_fields(): void {
        global $DB;
        $manager = new manager($DB);
        $model = $this->make_model()->set('name', 'first');
        $this->assertSame(0, $DB->count_records('core_model_test'));
        $before = time();
        $manager->save($model, 12);
        $id = $model->get('id');
        $this->assertGreaterThan(0, $id);
        $this->assertGreaterThanOrEqual($before, $model->get('timecreated'));
        $this->assertSame($model->get('timecreated'), $model->get('timemodified'));
        $this->assertSame(12, $model->get('usermodified'));
        $loaded = $manager->get($model::class, $id);
        $this->assertSame('first', $loaded->get('name'));
        $this->assertSame($id, $loaded->get('id'));
        $created = $loaded->get('timecreated');
        $loaded->name = 'second';
        $manager->save($loaded, 34);
        $record = $DB->get_record('core_model_test', ['id' => $id], '*', MUST_EXIST);
        $this->assertSame('second', $record->name);
        $this->assertSame($created, (int) $record->timecreated);
        $this->assertSame(34, (int) $record->usermodified);
        $this->assertSame(1, $DB->count_records('core_model_test'));
        $this->assertTrue($manager->delete($loaded));
        $this->assertSame(0, $loaded->get('id'));
        $this->assertFalse($DB->record_exists('core_model_test', ['id' => $id]));
    }

    /**
     * Models without audit mappings can be created, updated and deleted.
     */
    public function test_crud_without_audit_fields(): void {
        global $DB;
        $table = new xmldb_table('core_model_noaudit_test');
        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE);
        $table->add_field('name', XMLDB_TYPE_CHAR, '100', null, XMLDB_NOTNULL);
        $table->add_key('primary', XMLDB_KEY_PRIMARY, ['id']);
        $DB->get_manager()->create_table($table);
        try {
            // phpcs:ignore moodle.Commenting.MissingDocblock.Class
            $model = new #[table('core_model_noaudit_test')] class extends model {
                /** @var string Name. */
                #[field(param::TEXT)]
                public string $name = 'First';
            };
            $manager = new manager($DB);
            $manager->save($model, 12);
            $this->assertGreaterThan(0, $model->get('id'));
            $this->assertEqualsCanonicalizing(['id', 'name'], array_keys((array) $model->to_record()));
            $model->name = 'Second';
            $manager->save($model, 34);
            $this->assertSame('Second', $manager->get($model::class, $model->get('id'))->get('name'));
            $this->assertTrue($manager->delete($model));
        } finally {
            $DB->get_manager()->drop_table($table);
        }
    }

    /**
     * An invalid direct write must be revalidated and never reach the database.
     */
    public function test_invalid_mutation_does_not_write(): void {
        global $DB;
        $manager = new manager($DB);
        $model = $this->make_model()->set('name', 'valid');
        $manager->save($model, 1);
        $model->name = 'not valid!';
        try {
            $manager->save($model, 2);
            $this->fail('Invalid model was saved.');
        } catch (\invalid_parameter_exception $e) {
            $this->assertStringContainsString('name', $e->getMessage());
        }
        $this->assertSame('valid', $DB->get_field('core_model_test', 'name', ['id' => $model->get('id')]));
    }

    /**
     * CRUD routes by the stored ID, not an accessor's computed representation.
     */
    public function test_crud_uses_raw_id(): void {
        global $DB;
        $model = new #[table('core_model_test')] class extends model { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
            /** @var int Creation time. */
            #[field(param::INT)]
            protected int $timecreated = 0;
            /** @var int Modification time. */
            #[field(param::INT)]
            protected int $timemodified = 0;
            /** @var int Modifying user ID. */
            #[field(param::INT)]
            protected int $usermodified = 0;
            // PHPCS currently misparses property hook expressions as declarations.
            // phpcs:disable PSR2.Classes.PropertyDeclaration, moodle.Commenting.VariableComment, moodle.PHP.MemberVarScope
            /** @var int ID with a computed public representation. */
            #[field(param::INT)]
            public int $id = 0 {
                get => $this->id + 10000;
            }
            // phpcs:enable
            /** @var string Valid stored name. */
            #[field(param::ALPHANUM)]
            public string $name = 'hooked';
        };
        $manager = new manager($DB);
        $manager->save($model, 1);
        $id = $model->to_record()->id;
        $this->assertGreaterThan(0, $id);
        $this->assertSame($id + 10000, $model->get('id'));
        $manager->save($model, 2);
        $this->assertSame(1, $DB->count_records('core_model_test'));
        $this->assertSame($id, $manager->get($model::class, $id)->to_record()->id);
        $this->assertTrue($manager->delete($model));
        $this->assertSame(0, $model->to_record()->id);
    }

    /**
     * Missing models use Moodle's normal missing-record exception.
     */
    public function test_missing_record(): void {
        global $DB;
        $model = $this->make_model();
        $this->expectException(\dml_missing_record_exception::class);
        (new manager($DB))->get($model::class, 999);
    }

    /**
     * A missing table mapping must fail before attempting database operations.
     */
    public function test_unmapped_model(): void {
        global $DB;
        $model = new class extends model { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
        };
        $this->expectException(coding_exception::class);
        (new manager($DB))->save($model, 1);
    }

    /**
     * Table attributes reject SQL fragments rather than treating them as identifiers.
     */
    public function test_invalid_table_attribute(): void {
        global $DB;
        $model = new #[table('core_model_test WHERE 1=1')] class extends model { // phpcs:ignore
        };
        $this->expectException(coding_exception::class);
        (new manager($DB))->save($model, 1);
    }

    /**
     * Unsaved models cannot delete records.
     */
    public function test_delete_unsaved_model(): void {
        global $DB;
        $this->expectException(coding_exception::class);
        (new manager($DB))->delete($this->make_model());
    }

    /**
     * Native ID storage rejects malformed values before they can select another record.
     */
    public function test_invalid_id_is_rejected(): void {
        $this->expectException(\TypeError::class);
        $this->make_model()->set('id', '1notanid');
    }
}
