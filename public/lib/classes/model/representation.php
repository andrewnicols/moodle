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
use core\model\attribute\expose;
use core\param;

/**
 * Shared, cached representation metadata and explicit scalar serialization.
 *
 * This is not an access-control layer. Only pass objects authorised for the viewer.
 * Unattributed fields, including stored model fields, are never exported.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class representation {
    /** @var array Cached exposure definitions by concrete class. */
    private static array $definitions = [];

    /**
     * Read metadata without constructing an object or invoking computed getters.
     *
     * @param class-string $class Representation class.
     * @return array External names mapped to attribute and reflection property.
     */
    public static function definitions(string $class): array {
        if (isset(self::$definitions[$class])) {
            return self::$definitions[$class];
        }
        $definitions = [];
        foreach ((new \ReflectionClass($class))->getProperties() as $property) {
            $attributes = $property->getAttributes(expose::class);
            if (!$attributes) {
                continue;
            }
            if (
                !$property->isPublic() || $property->isStatic()
                || ($property->isVirtual() && !$property->hasHook(\PropertyHookType::Get))
            ) {
                throw new coding_exception("Exposed properties must be publicly readable: {$property->getName()}.");
            }
            $expose = $attributes[0]->newInstance();
            $name = $expose->name ?? $property->getName();
            if ($name === '' || isset($definitions[$name])) {
                throw new coding_exception("Empty or duplicate exposed name: {$name}.");
            }
            $definitions[$name] = ['expose' => $expose, 'property' => $property];
        }
        return self::$definitions[$class] = $definitions;
    }

    /**
     * Export exposed getters, without cleaning or rewriting representation values.
     *
     * Invalid output is an application error, not something to silently sanitise.
     *
     * @param object $object Authorised representation.
     * @return array API payload.
     */
    public static function to_array(object $object): array {
        $result = [];
        foreach (self::definitions($object::class) as $name => $definition) {
            $property = $definition['property'];
            $expose = $definition['expose'];
            if (!$property->isVirtual() && !$property->isInitialized($object)) {
                if ($expose->required) {
                    throw new coding_exception("Uninitialised exposed property: {$name}.");
                }
                continue;
            }
            $value = $property->getValue($object);
            if ($value === null) {
                if (!$expose->nullable) {
                    throw new coding_exception("Null exposed property: {$name}.");
                }
            } else {
                $validtype = match ($expose->type) {
                    param::INT => is_int($value),
                    param::FLOAT => is_float($value) || is_int($value),
                    param::BOOL => is_bool($value),
                    default => is_string($value),
                };
                if (!$validtype) {
                    throw new coding_exception("Incorrect exposed scalar type: {$name}.");
                }
            }
            if ($expose->choices !== null && !in_array($value, $expose->choices, true)) {
                throw new coding_exception("Invalid exposed choice: {$name}.");
            }
            $result[$name] = $value;
        }
        return $result;
    }
}
