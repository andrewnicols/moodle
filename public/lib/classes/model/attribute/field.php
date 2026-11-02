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
 * Declare a stored model field. Native property defaults define optional fields.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\Attribute(\Attribute::TARGET_PROPERTY)]
final class field {
    /**
     * Describe the field's cleaning and validation rules.
     *
     * @param param $type Parameter cleaning type.
     * @param bool $nullable Whether explicit null is valid.
     * @param array|null $choices Allowed values, or null for unrestricted values.
     */
    public function __construct(
        /** @var param Field cleaning type. */
        public readonly param $type,
        /** @var bool Whether explicit null is valid. */
        public readonly bool $nullable = false,
        /** @var array|null Allowed values. */
        public readonly ?array $choices = null,
    ) {
    }
}
