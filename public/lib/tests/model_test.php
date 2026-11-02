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

use core\exception\coding_exception;
use core\model\attribute\field;
use PHPUnit\Framework\Attributes\CoversClass;

/**
 * Declared-property model tests.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(model::class)]
#[CoversClass(field::class)]
final class model_test extends \advanced_testcase {
    /**
     * Create a model with raw, boolean, nullable and required fields.
     *
     * @return model Test model.
     */
    private function make_model(): model {
        return new class extends model { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
            /** @var mixed Required numeric value. */
            #[field(param::INT)]
            public mixed $number;
            /** @var mixed Nullable but required unless explicitly supplied. */
            #[field(param::RAW, nullable: true)]
            public mixed $note;
            /** @var mixed Boolean with a default. */
            #[field(param::BOOL)]
            protected mixed $enabled = false;
            /** @var mixed Restricted status. */
            #[field(param::ALPHANUM, choices: ['draft', 'ready'])]
            public mixed $status = 'draft';
            /** @var string Non-persistent internal state. */
            public string $internal = 'not a field';

            /**
             * Reject negative numbers as a domain constraint.
             *
             * @param string $property Field name.
             * @param mixed $value Field value.
             * @return true|\lang_string Validation result.
             */
            protected function validate_value(string $property, mixed $value): true|\lang_string {
                if ($property === 'number' && $value < 0) {
                    return new \lang_string('invaliddata', 'error');
                }
                return true;
            }
        };
    }

    /**
     * Clean getters without mutating raw values or importing extra columns.
     */
    public function test_raw_roundtrip_and_cleaned_getters(): void {
        $model = $this->make_model();
        $model->from_record((object) ['number' => '42', 'note' => null, 'extra' => 'ignored']);
        $this->assertSame(42, $model->get('number'));
        $this->assertNull($model->get('note'));
        $this->assertFalse($model->get('enabled'));
        $this->assertSame('draft', $model->get('status'));
        $this->assertSame([
            'number' => '42',
            'note' => null,
            'enabled' => false,
            'status' => 'draft',
            'id' => 0,
            'timecreated' => 0,
            'timemodified' => 0,
            'usermodified' => 0,
        ], (array) $model->to_record());
        $this->assertTrue($model->validate());
    }

    /**
     * A nullable required field must still be supplied; explicit null is valid.
     */
    public function test_required_fields_and_explicit_null(): void {
        $model = $this->make_model();
        $this->assertNull($model->get('number'));
        $this->assertSame(['number', 'note'], array_keys($model->validate()));
        $model->set('number', 1)->set('note', null);
        $this->assertTrue($model->validate());
        $model->set('number', null);
        $this->assertArrayHasKey('number', $model->validate());
    }

    /**
     * Native typed fields distinguish a missing required value from optional null.
     */
    public function test_native_types_and_nullable_defaults(): void {
        $model = new class extends model { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
            /** @var int Required integer. */
            #[field(param::INT)]
            public int $number;
            /** @var int|null Optional integer. */
            #[field(param::INT, nullable: true)]
            public ?int $optional = null;
        };
        $this->assertSame(['number'], array_keys($model->validate()));
        $model->from_record((object) ['number' => '42']);
        $this->assertSame(42, $model->number);
        $this->assertSame(42, $model->to_record()->number);
        $this->assertNull($model->optional);
        $this->assertTrue($model->validate());
        $this->expectException(\TypeError::class);
        $model->set('number', null);
    }

    /**
     * Validation always observes direct writes, choices and custom rules.
     */
    public function test_validation_is_not_cached(): void {
        $model = $this->make_model()->set('number', 1)->set('note', null);
        $this->assertTrue($model->validate());
        $model->number = -1;
        $model->status = 'unknown';
        $this->assertSame(['number', 'status'], array_keys($model->validate()));
        $model->number = 'not an integer';
        $this->assertArrayHasKey('number', $model->validate());
        $model->number = 2;
        $model->status = 'ready';
        $this->assertTrue($model->validate());
    }

    /**
     * Setter and getter access invokes hooks, but raw record mapping bypasses them.
     */
    public function test_backed_property_hooks(): void {
        $model = new class extends model { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
            /** @var mixed Stored name with custom accessor behaviour. */
            #[field(param::RAW)]
            // PHPCS currently misparses property hook expressions as declarations.
            // phpcs:disable PSR2.Classes.PropertyDeclaration, moodle.Commenting.VariableComment, moodle.PHP.MemberVarScope
            public mixed $name {
                get => strtoupper($this->name);
                set => trim($value);
            }
            // phpcs:enable
        };
        $model->set('name', '  first  ');
        $this->assertSame('FIRST', $model->get('name'));
        $this->assertSame('first', $model->to_record()->name);
        $model->from_record((object) ['name' => '  second  ']);
        $this->assertSame('  SECOND  ', $model->name);
        $this->assertSame('  second  ', $model->to_record()->name);
        $this->assertTrue($model->validate());
    }

    /**
     * Undeclared fields cannot become dynamic properties through setters.
     */
    public function test_unknown_setter(): void {
        $this->expectException(coding_exception::class);
        $this->make_model()->set('internal', 'not mapped');
    }

    /**
     * Getters reject unrecognised fields.
     */
    public function test_unknown_getter(): void {
        $this->expectException(coding_exception::class);
        $this->make_model()->get('missing');
    }

    /**
     * Private fields cannot be safely accessed by the base model.
     */
    public function test_private_field_is_rejected(): void {
        $model = new class extends model { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
            /** @var mixed Inaccessible storage. */
            #[field(param::RAW)]
            private mixed $name;
        };
        $this->expectException(coding_exception::class);
        $model->to_record();
    }

    /**
     * Virtual hooks must not accidentally be treated as database storage.
     */
    public function test_virtual_field_is_rejected(): void {
        $model = new class extends model { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
            /** @var string Computed value with no backing slot. */
            #[field(param::TEXT)]
            public string $name {
                get => 'computed';
            }
        };
        $this->expectException(coding_exception::class);
        $model->to_record();
    }

    /**
     * Field metadata is cached separately for each concrete subclass.
     */
    public function test_schemas_are_isolated(): void {
        $first = $this->make_model()->set('number', 7)->set('note', null);
        $second = new class extends model { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
            /** @var mixed Different cleaning rules for the same property name. */
            #[field(param::RAW)]
            protected mixed $number = 'seven';
        };
        $this->assertSame('seven', $second->get('number'));
        $this->assertSame(7, $first->get('number'));
        $this->assertTrue($first->validate());
    }
}
