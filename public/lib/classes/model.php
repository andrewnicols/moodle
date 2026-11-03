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
use ReflectionClass;
use stdClass;

/**
 * An in-memory model backed by declared, attributed properties.
 *
 * Declare stored fields as protected or public properties with the field attribute.
 * Uninitialised fields are required; native defaults make fields optional. Prefer
 * mixed properties when raw database values must be preserved without type coercion.
 * Public fields may be accessed directly, but only get() guarantees PARAM cleaning.
 *
 * Schema reflection is cached per class. Instances contain only declared field values,
 * not a data array, schema, manager, error list or validation cache. Validation runs
 * afresh so direct property writes and PHP 8.4 hooks cannot leave stale results.
 *
 * Hydration and export bypass backed property hooks on PHP 8.4. Virtual, private,
 * readonly and static fields are not supported. Dynamic defaults can be initialised
 * by the subclass constructor. Database access belongs to core\model\manager.
 *
 * This is an opt-in model, not a replacement for persistent's lifecycle API.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class model {
    /** @var array Cached field definitions, reflection and hook information per class. */
    private static array $schemas = [];

    /** @var int Record ID. */
    #[field(param::INT)]
    protected int $id = 0;

    /**
     * Get cached schema metadata, checking unsupported declarations once per class.
     *
     * @return array Field name to definition, reflection property and hook flag.
     */
    private static function schema(): array {
        if (isset(self::$schemas[static::class])) {
            return self::$schemas[static::class];
        }
        $schema = [];
        foreach ((new ReflectionClass(static::class))->getProperties() as $property) {
            $attributes = $property->getAttributes(field::class);
            if (!$attributes) {
                continue;
            }
            $hooked = $property->getHooks() !== [];
            if (
                $property->isPrivate() || $property->isStatic() || $property->isReadOnly()
                || ($hooked && $property->isVirtual())
            ) {
                throw new coding_exception("Unsupported model field: {$property->getName()}.");
            }
            $schema[$property->getName()] = [
                'field' => $attributes[0]->newInstance(),
                'property' => $property,
                'hooked' => $hooked,
            ];
        }
        return self::$schemas[static::class] = $schema;
    }

    /**
     * Get a known field definition.
     *
     * @param string $property Field name.
     * @return array Field metadata.
     */
    private static function definition(string $property): array {
        return static::schema()[$property]
            ?? throw new coding_exception("Unexpected model field: {$property}.");
    }

    /**
     * Set a field, invoking any declared property setter hook.
     *
     * @param string $property Field name.
     * @param mixed $value Field value.
     * @return $this
     */
    final public function set(string $property, mixed $value): static {
        static::definition($property);
        $this->{$property} = $value;
        return $this;
    }

    /**
     * Read a field through its getter hook and PARAM cleaning rules.
     *
     * @param string $property Field name.
     * @return mixed Cleaned value, or null for an uninitialised field or nullable null.
     */
    final public function get(string $property): mixed {
        $definition = static::definition($property);
        if (!$definition['property']->isInitialized($this)) {
            return null;
        }
        $value = $this->{$property};
        $field = $definition['field'];
        if ($value === null && $field->nullable) {
            return null;
        }
        return $field->type === param::BOOL ? (bool) $value : $field->type->clean($value);
    }

    /**
     * Read backing storage without invoking getter hooks.
     *
     * @param array $definition Field metadata.
     * @return mixed Raw field value.
     */
    private function raw_value(array $definition): mixed {
        $property = $definition['property'];
        if (!$property->isInitialized($this)) {
            return null;
        }
        return $definition['hooked'] ? $property->getRawValue($this) : $property->getValue($this);
    }

    /**
     * Populate known fields from raw database values, bypassing setter hooks.
     *
     * Unknown columns are ignored, as in persistent::from_record(). Native PHP types,
     * if declared, still apply. The model's constructor is not bypassed by the manager.
     *
     * @param stdClass $record Database record.
     * @return $this
     */
    final public function from_record(stdClass $record): static {
        $schema = static::schema();
        foreach ($record as $name => $value) {
            if (!isset($schema[$name])) {
                continue;
            }
            $definition = $schema[$name];
            if ($definition['hooked']) {
                $definition['property']->setRawValue($this, $value);
            } else {
                $this->{$name} = $value;
            }
        }
        return $this;
    }

    /**
     * Export raw backing values, not cleaned or computed getters.
     *
     * @return stdClass Database record. Uninitialised fields are exported as null.
     */
    final public function to_record(): stdClass {
        $record = new stdClass();
        foreach (static::schema() as $name => $definition) {
            $record->{$name} = $this->raw_value($definition);
        }
        return $record;
    }

    /**
     * Validate current raw field values without retaining per-object validation state.
     *
     * @return true|array True, or field names mapped to language-string errors.
     */
    final public function validate(): true|array {
        $errors = [];
        foreach (static::schema() as $name => $definition) {
            $field = $definition['field'];
            if (!$definition['property']->isInitialized($this)) {
                $errors[$name] = new \lang_string('requiredelement', 'form');
                continue;
            }
            $value = $this->raw_value($definition);
            try {
                $checked = $field->type === param::BOOL && $value === false ? 0 : $value;
                if ($field->type === param::CLEANHTML) {
                    $checked = $field->type->clean($checked);
                }
                $field->type->validate_param($checked, $field->nullable ? NULL_ALLOWED : NULL_NOT_ALLOWED);
            } catch (\invalid_parameter_exception $e) {
                $errors[$name] = new \lang_string('invaliddata', 'error');
                continue;
            }
            if ($field->choices !== null && !in_array($value, $field->choices)) {
                $errors[$name] = new \lang_string('invaliddata', 'error');
                continue;
            }
            $valid = $this->validate_value($name, $value);
            if ($valid !== true) {
                $errors[$name] = $valid;
            }
        }
        return $errors ?: true;
    }

    /**
     * Extend validation without performing it during assignment or hydration.
     *
     * Other fields may still be invalid. Database-dependent rules belong in the
     * calling application, which also remains responsible for access control.
     *
     * @param string $property Field name.
     * @param mixed $value Raw value.
     * @return true|\lang_string Validation result.
     */
    protected function validate_value(string $property, mixed $value): true|\lang_string {
        return true;
    }
}
