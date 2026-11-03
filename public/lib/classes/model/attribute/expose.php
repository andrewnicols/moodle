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

namespace core\model\attribute;

use core\param;

/**
 * Opt a property into an API representation, independently of database mapping.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\Attribute(\Attribute::TARGET_PROPERTY)]
final class expose {
    /**
     * Describe an exposed scalar value. Required means key presence, not non-null.
     *
     * @param param $type Value type.
     * @param string|null $name External name, or the property name.
     * @param bool $nullable Whether null is an allowed value.
     * @param bool $required Whether the key must be present.
     * @param bool $readonly Whether this is an output-only value.
     * @param string|null $description API documentation.
     * @param array|null $choices Allowed values.
     */
    public function __construct(
        /** @var param Value type. */
        public readonly param $type,
        /** @var string|null External name. */
        public readonly ?string $name = null,
        /** @var bool Whether null is allowed. */
        public readonly bool $nullable = false,
        /** @var bool Whether the key must be present. */
        public readonly bool $required = true,
        /** @var bool Whether this value is output-only. */
        public readonly bool $readonly = false,
        /** @var string|null API documentation. */
        public readonly ?string $description = null,
        /** @var array|null Allowed values. */
        public readonly ?array $choices = null,
    ) {
    }
}
