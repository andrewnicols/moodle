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

use Attribute;
use ReflectionClass;

/**
 * Attribute to describe a deprecated item.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[Attribute]
class deprecated {
    /**
     * A deprecated item.
     *
     * This attribute can be applied to any function, class, method, constant, property, enum, etc.
     *
     * Note: The mere presence of the attribute does not do anything. It must be checked by some part of the code.
     *
     * @param mixed $descriptor A brief descriptor of the thing that was deprecated.
     * @param null|string $since When it was deprecated
     * @param null|string $reason Why it was deprecated
     * @param null|string $replacement Any replacement for the deprecated thing
     * @param null|string $mdl Link to the Moodle Tracker issue for more information
     */
    public function __construct(
        public readonly mixed $descriptor,
        public readonly ?string $since = null,
        public readonly ?string $reason = null,
        public readonly ?string $replacement = null,
        public readonly ?string $mdl = null,
        public readonly bool $final = false,
        public readonly bool $emit = true,
    ) {
    }

    /**
     * Get the attribute from a reference.
     *
     * The reference can be:
     * - a string, in which case it will be checked for a function, class, method, property, constant, or enum.
     * - an array
     * - an instantiated object, in which case the object will be checked for a class, method, property, or constant.
     *
     * @param array|string|object $reference A reference to a potentially deprecated thing.
     * @return null|deprecated
     */
    public static function from(array|string|object $reference): ?self {
        if (is_string($reference)) {
            if (str_contains($reference, '::')) {
                // The reference is a string but it looks to be in the format `object::item`.
                return self::from(explode('::', $reference));
            }

            if (class_exists($reference)) {
                // The reference looks to be a class name.
                return self::from([$reference]);
            }

            if (function_exists($reference)) {
                // The reference looks to be a global function.
                $ref = new \ReflectionFunction($reference);
                if ($attributes = $ref->getAttributes(self::class)) {
                    return $attributes[0]->newInstance();
                }
            }

            return null;
        }

        if (is_object($reference)) {
            // The reference is an object. Normalise and check again.
            return self::from([$reference]);
        }

        if (is_array($reference) && count($reference)) {
            if (is_object($reference[0])) {
                $rc = new \ReflectionObject($reference[0]);

                if ($rc->isEnum() && $reference[0]->name) {
                    // Enums can be passed via ::from([enum::NAME]).
                    // In this case they will have a 'name', which must exist.
                    return self::from_reflected_object($rc, $reference[0]->name);
                }
                return self::from_reflected_object($rc, $reference[1] ?? null);
            }

            if (is_string($reference[0]) && class_exists($reference[0])) {
                $rc = new \ReflectionClass($reference[0]);
                return self::from_reflected_object($rc, $reference[1] ?? null);
            }

            // The reference is an array, but it's not an object or a class that currently exists.
            return null;
        }

        return null;
    }

    /**
     * Check if a reference is deprecated.
     *
     * @param array|string|object $reference
     * @return bool
     */
    public static function is_deprecated(array|string|object $reference): bool {
        return self::from($reference) !== null;
    }

    /**
     * Emit a deprecation notice if the reference is deprecated.
     *
     * @param array|string|object $reference
     */
    public static function emit_deprecation_if_present(array|string|object $reference): void {
        if ($deprecation = self::from($reference)) {
            $deprecation->emit_deprecation_notice();
        }
    }

    /**
     * Fetch a deprecation attribute from a reflected object.
     *
     * @param ReflectionClass $rc The reflected object
     * @param null|string $name The name of the thing to check for deprecation
     * @return null|deprecated
     */
    protected static function from_reflected_object(
        \ReflectionClass $rc,
        ?string $name,
    ): ?self {
        if ($name === null) {
            // No name specified. This may be a deprecated class.
            if ($attributes = $rc->getAttributes(self::class)) {
                return $attributes[0]->newInstance();
            }
            return null;
        }

        if ($rc->hasConstant($name)) {
            // This class has a constant with the specified name.
            // Note: This also applies to enums.
            $ref = $rc->getReflectionConstant($name);
            if ($attributes = $ref->getAttributes(self::class)) {
                return $attributes[0]->newInstance();
            }
        }

        if ($rc->hasMethod($name)) {
            // This class has a method with the specified name.
            $ref = $rc->getMethod($name);
            if ($attributes = $ref->getAttributes(self::class)) {
                return $attributes[0]->newInstance();
            }
        }

        if ($rc->hasProperty($name)) {
            // This class has a property with the specified name.
            $ref = $rc->getProperty($name);
            if ($attributes = $ref->getAttributes(self::class)) {
                return $attributes[0]->newInstance();
            }
        }

        return null;
    }

    /**
     * Get a string describing the deprecation.
     *
     * @return string
     */
    public function get_deprecation_string(): string {
        $output = "Deprecation: {$this->descriptor} has been deprecated";
        if ($this->since) {
            $output .= " since {$this->since}";
        }

        $output .= ".";

        if ($this->reason) {
            $output .= " {$this->reason}.";
        }

        if ($this->replacement) {
            $output .= " Use {$this->replacement} instead.";
        }

        if ($this->mdl) {
            $output .= " See {$this->mdl} for more information.";
        }

        return $output;
    }

    /**
     * Emit the relevant deprecation notice.
     */
    public function emit_deprecation_notice(): void {
        if (!$this->emit) {
            return;
        }
        if ($this->final) {
            throw new \coding_exception(
                $this->get_deprecation_string(),
            );
        }

        debugging(
            $this->get_deprecation_string(),
            DEBUG_DEVELOPER,
        );
    }
}
