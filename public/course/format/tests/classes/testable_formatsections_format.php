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

namespace core_courseformat\tests;

/**
 * Class format_testformatsections.
 *
 * A test class that simulates a course format with sections.
 *
 * @package   core_courseformat
 * @copyright 2023 ISB Bayern
 * @author    Philipp Memmel
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class testable_formatsections_format extends \core_courseformat\base {
    /**
     * @var int|null $forcemaxsections The maximum number of sections.
     */
    public ?int $forcemaxsections = null;

    #[\Override]
    public function uses_sections() {
        return true;
    }

    #[\Override]
    public function can_sections_be_removed_from_navigation(): bool {
        return true;
    }

    #[\Override]
    public function get_last_section_number(): int {
        if ($this->forcemaxsections !== null) {
            return $this->forcemaxsections;
        }
        return parent::get_last_section_number();
    }
}
