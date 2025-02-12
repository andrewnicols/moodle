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

namespace format_weeks\callbacks\output;

use core\callbacks\output\inplace_editable_interface;
use core\callbacks\output\inplace_editable_object;

/**
 * Inplace editable callback implementation.
 *
 * @package    format_weeks
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class inplace_editable_callback implements
    inplace_editable_interface
{
    #[\Override]
    public function execute_inplace_editable(inplace_editable_object $callback): void {
        match ($callback->itemtype) {
            'sectionname' => $this->inplace_editable_sectionname($callback),
            'sectionnamenl' => $this->inplace_editable_sectionname($callback),
            default => null,
        };
    }

    /**
     * Inplace editable callback for section name.
     *
     * @param inplace_editable_object $callback
     */
    private function inplace_editable_sectionname(inplace_editable_object $callback): void {
        global $DB;

        $section = $DB->get_record_sql(
            'SELECT s.* FROM {course_sections} s JOIN {course} c ON s.course = c.id WHERE s.id = ? AND c.format = ?',
            [$callback->itemid, 'weeks'],
            MUST_EXIST,
        );
        $callback->set_renderable(
            course_get_format($section->course)->inplace_editable_update_section_name(
                $section,
                $callback->itemtype,
                $callback->newvalue,
            ),
        );
    }
}
