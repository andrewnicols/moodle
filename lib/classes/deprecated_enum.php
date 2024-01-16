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
 * A deprecation helper for enums.
 *
 * @package    core
 * @copyright  2024 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
trait deprecated_enum {
    /**
     * Whether the parameter is deprecated.
     *
     * @return bool
     */
    public function is_deprecated(): bool {
        if ($this->get_deprecation_attribute()) {
            return true;
        }
        return false;
    }

    /**
     * Get the deprecation attribute for the parameter if it is set.
     *
     * @return null|deprecated
     */
    protected function get_deprecation_attribute(): ?deprecated {
        $ref = new \ReflectionClassConstant(self::class, $this->name);
        if ($attributes = $ref->getAttributes(deprecated::class)) {
            return $attributes[0]->newInstance();
        }

        return null;
    }

    /**
     * Emit a deprecation notice if the parameter is deprecated.
     */
    protected function emit_deprecation_notice(): void {
        if ($deprecation = $this->get_deprecation_attribute()) {
            $deprecation->emit_deprecation_notice();
        }
    }
}
