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
use core\model\attribute\expose;
use core\model\attribute\field;
use core\param;
use core\router\schema\objects\exposed_scalar;
use core\router\schema\objects\representation_schema;
use core\router\schema\specification;
use PHPUnit\Framework\Attributes\CoversClass;

/**
 * Tests for shared exposure serialization and schema metadata.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(expose::class)]
#[CoversClass(representation::class)]
#[CoversClass(representation_schema::class)]
#[CoversClass(exposed_scalar::class)]
final class representation_test extends \advanced_testcase {
    /**
     * Exposed model getters never become stored fields and remain live.
     */
    public function test_computed_model_serialization(): void {
        $model = new class extends model { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
            /** @var string Stored name. */
            #[field(param::TEXT)]
            #[expose(param::TEXT, name: 'firstName')]
            public string $name = 'Alice';

            /** @var string Unexposed secret. */
            #[field(param::RAW)]
            public string $secret = 'private';

            // phpcs:disable PSR2.Classes.PropertyDeclaration, moodle.Commenting.VariableComment, moodle.PHP.MemberVarScope
            /** @var string Computed name. */
            #[expose(param::TEXT, name: 'displayName')]
            public string $displayname {
                get => $this->name . ' Example';
            }
            // phpcs:enable
        };
        $this->assertSame(['firstName' => 'Alice', 'displayName' => 'Alice Example'], representation::to_array($model));
        $this->assertFalse(property_exists($model->to_record(), 'displayName'));
        $model->from_record((object) ['name' => 'Bob', 'displayName' => 'Ignored']);
        $this->assertSame('Bob Example', representation::to_array($model)['displayName']);
        $this->assertTrue($model->validate());
    }

    /**
     * Optional uninitialised values are omitted; required nullable values remain present.
     */
    public function test_optional_and_nullable_fields(): void {
        $object = new class { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
            /** @var string Optional, absent property. */
            #[expose(param::TEXT, required: false)]
            public string $optional;

            /** @var string|null Required, nullable property. */
            #[expose(param::TEXT, nullable: true)]
            public ?string $value = null;
        };
        $this->assertSame(['value' => null], representation::to_array($object));
        $schema = new representation_schema($object::class);
        $data = $schema->get_openapi_description(new specification());
        $this->assertSame(['value'], $data->required);
        $this->assertSame(['string', 'null'], $data->properties->value->type);
        $this->assertSame(['value' => null], $schema->validate_data(['value' => null]));
        $this->expectException(\invalid_parameter_exception::class);
        $schema->validate_data([]);
    }

    /**
     * Missing required backing storage is not silently exported as null.
     */
    public function test_uninitialised_required_field(): void {
        $object = new class { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
            /** @var string Required property. */
            #[expose(param::TEXT)]
            public string $name;
        };
        $this->expectException(coding_exception::class);
        representation::to_array($object);
    }

    /**
     * Schema inspection never invokes computed getters and references distinguish classes.
     */
    public function test_schema_metadata_and_references(): void {
        $object = new class { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
            /** @var int Getter invocation count. */
            public static int $calls = 0;

            // phpcs:disable PSR2.Classes.PropertyDeclaration, moodle.Commenting.VariableComment, moodle.PHP.MemberVarScope
            /** @var string Computed status. */
            #[expose(param::TEXT, description: 'Current status.', choices: ['ready'])]
            public string $status {
                get {
                    self::$calls++;
                    return 'ready';
                }
            }
            // phpcs:enable
        };
        $schema = new representation_schema($object::class);
        $api = new specification();
        $data = $schema->get_openapi_description($api);
        $this->assertSame(0, $object::$calls);
        $this->assertTrue($data->properties->status->readOnly);
        $this->assertSame('Current status.', $data->properties->status->description);
        $this->assertSame(['ready'], $data->properties->status->enum);
        $this->assertSame($schema->get_reference(), (new representation_schema($object::class))->get_reference());
        $this->assertNotSame(
            $schema->get_reference(),
            (new representation_schema(\core_user\local\user_object::class))->get_reference(),
        );
        $this->assertSame($schema->get_reference(), $schema->get_openapi_schema($api)->{'$ref'});
        $this->assertTrue($api->is_reference_defined($schema->get_reference()));
        $this->assertSame(['status' => 'ready'], representation::to_array($object));
        $this->assertSame(1, $object::$calls);
        $this->expectException(\invalid_parameter_exception::class);
        $schema->validate_data(['status' => 'invalid']);
    }

    /**
     * Ambiguous external names fail during metadata inspection.
     */
    public function test_duplicate_names_rejected(): void {
        $object = new class { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
            /** @var string First property. */
            #[expose(param::TEXT, name: 'same')]
            public string $first = '';

            /** @var string Second property. */
            #[expose(param::TEXT, name: 'same')]
            public string $second = '';
        };
        $this->expectException(coding_exception::class);
        representation::definitions($object::class);
    }

    /**
     * Explicit nullability is enforced by both serialization and router validation.
     */
    public function test_nonnullable_null_rejected(): void {
        $object = new class { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
            /** @var string|null Native null does not imply API nullability. */
            #[expose(param::TEXT)]
            public ?string $value = null;
        };
        $this->expectException(coding_exception::class);
        representation::to_array($object);
    }

    /**
     * Serialization rejects values whose JSON type disagrees with the schema.
     */
    public function test_incorrect_scalar_type_rejected(): void {
        $object = new class { // phpcs:ignore moodle.Commenting.MissingDocblock.Class
            /** @var string A numeric string is not a JSON integer. */
            #[expose(param::INT)]
            public string $id = '12';
        };
        $this->expectException(coding_exception::class);
        representation::to_array($object);
    }
}
