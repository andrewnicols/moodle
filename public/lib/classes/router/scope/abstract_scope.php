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

namespace core\router\scope;

use core\attribute_helper;

/**
 * The abstract base class for all scopes.
 *
 * All scopes must extend this class, or one of it's derived classes.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class abstract_scope implements \Stringable {
    /**
     * Create a new scope.
     *
     * @param bool $write Whether this is write scope
     * @param bool $read Whether this is read scope
     */
    final public function __construct(
        public readonly bool $write = false,
        public readonly bool $read = true,
    ) {
    }

    /**
     * Get the fully-qualified name of the scope.
     *
     * @return string
     */
    final public static function get_qualified_name(): string {
        $classname = static::class;
        while ($classname) {
            $attribute = attribute_helper::instance($classname, name_attribute::class);

            if ($attribute !== null) {
                $parts[] = $attribute->get_name();
            }
            $classname = get_parent_class($classname);
        }

        return implode(':', array_reverse($parts));
    }

    /**
     * Get the description of the scope.
     *
     * @return string
     */
    final public static function get_description(): string {
        $attribute = attribute_helper::instance(static::class, description_attribute::class);

        if ($attribute !== null) {
            return (string)$attribute;
        }

        return "Scope for: " . static::get_qualified_name();
    }

    /**
     * String representation of the scope.
     *
     * @return string
     */
    final public function __toString(): string {
        return $this->get_qualified_name();
    }

    /**
     * Whether the scope requires write.
     * @return bool
     */
    final public function is_write(): bool {
        return $this->write;
    }

    /**
     * Whether the scope requires read.
     *
     * @return bool
     */
    final public function is_read(): bool {
        return $this->read;
    }
}
