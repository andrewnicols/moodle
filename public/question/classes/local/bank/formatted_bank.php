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

namespace core_question\local\bank;

use core_course\cm_info;

/**
 * Formatted question bank data for display
 *
 * @package   core_question
 * @copyright 2026 onwards Catalyst IT EU {@link https://catalyst-eu.net}
 * @author    Mark Johnson <mark.johnson@catalyst-eu.net>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class formatted_bank {
    /**
     * Constructor
     *
     * @param string $name The formatted bank name.
     * @param int $modid The course module ID of the bank.
     * @param int $contextid The course module context ID.
     * @param string $coursebankname The formatted bank name, prefixed with the course name.
     * @param cm_info $cminfo Course module info.
     * @param array $questioncategories Array of categories belonging to the bank.
     */
    public function __construct(
        /** @var string $name The formatted bank name. */
        public string $name,
        /** @var int $modid The course module ID of the bank. */
        public int $modid,
        /** @var int $contextid The course module context ID. */
        public int $contextid,
        /** @var  string $coursebankname The formatted bank name, prefixed with the course name. */
        public string $coursebankname,
        /** @var cm_info $cminfo Course module info. */
        public cm_info $cminfo,
        /** @var array $questioncategories Array of categories belonging to the bank. */
        public array $questioncategories,
    ) {
    }
}
