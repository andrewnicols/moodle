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

/**
 * Deprecated Property Helper for the deprecation of public and protected properties.
 *
 * Note: From Moodle 6.0 all uses of this should be converted to use property hooks.
 *
 * To use, ensure that the property is changed to be private, and that this trait is used in the class.
 * Then any access to the property will trigger deprecation warnings.
 *
 * This will work for any public properties accessed outside of the class, or from child classes.
 *
 * Note: All _internal_ accesses of the property (that is from methods of the same class) will not be detected.
 * This is because PHP magic methods are not triggered for internal accesses.
 * You *must* ensure that all internal accesses are deprecated correctly.
 * 
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
trait deprecated_property_trait {
    /**
     * Magic setter to detect deprecation of properties.
     *
     * @param string $field
     * @param mixed $value
     */
    public function __set(string $field, mixed $value): void {
        \core\deprecation::emit_deprecation_if_present([self::class, $field]);
        $this->$field = $value;
    }

    public function __get(string $field): mixed {
        \core\deprecation::emit_deprecation_if_present([self::class, $field]);
        return $this->$field;
    }
}
