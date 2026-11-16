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
 * Request preferences for text returned to an external consumer.
 *
 * Null values leave the existing caller's preference unchanged.
 *
 * @package core
 * @copyright 2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class text_formatting_options {
    /**
     * Create external text formatting preferences.
     *
     * @param bool|null $raw Return the stored text without formatting.
     * @param bool|null $filter Apply filters enabled in the context.
     */
    public function __construct(
        /** @var bool|null Return the stored text without formatting */
        public readonly ?bool $raw = null,
        /** @var bool|null Apply filters enabled in the context */
        public readonly ?bool $filter = null,
    ) {
    }
}
