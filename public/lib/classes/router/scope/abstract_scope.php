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
 * @copyright  2026 Mihail Geshoski <mihailgesoski@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class abstract_scope implements \League\OAuth2\Server\Entities\ScopeEntityInterface, \Stringable {
    use \League\OAuth2\Server\Entities\Traits\ScopeTrait;

    #[\Override]
    final public function getIdentifier(): string {
        return static::get_qualified_name();
    }

    #[\Override]
    public function __toString(): string {
        return $this->getIdentifier();
    }

    /**
     * Get the fully-qualified name of the scope.
     *
     * @return string
     */
    final public static function get_qualified_name(): string {
        $parts = [];
        $classname = static::class;

        // Walk up the class hierarchy to get the fully-qualified scope name.
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
     * Get the human-readable name of the scope.
     *
     * @return string
     */
    final public static function get_human_name(): string {
        $attribute = attribute_helper::instance(static::class, human_name_attribute::class);

        if ($attribute !== null) {
            return $attribute->out();
        }

        return '';
    }

    /**
     * Get the description of the scope.
     *
     * @return string
     */
    final public static function get_description(): string {
        $attribute = attribute_helper::instance(static::class, description_attribute::class);

        if ($attribute !== null) {
            return $attribute->out();
        }

        return '';
    }

    /**
     * Determine if the provided scopes satisfy this scope.
     *
     * @param string[] $providedscopes The provided scopes
     * @return bool
     */
    final public function is_satisfied_by(array $providedscopes): bool {
        return in_array($this->get_qualified_name(), $providedscopes);
    }
}
