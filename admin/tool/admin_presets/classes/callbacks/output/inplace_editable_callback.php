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

namespace tool_admin_presets\callbacks\output;

use core\callbacks\output\inplace_editable_interface;
use core\callbacks\output\inplace_editable_object;
use core\param;

/**
 * Inplace editable callback implementation.
 *
 * @package    tool_admin_presets
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class inplace_editable_callback implements
    inplace_editable_interface
{
    #[\Override]
    public function execute_inplace_editable(inplace_editable_object $callback): void {
        $value = match ($callback->itemtype) {
            'presetname' => $this->inplace_editable_presetname($callback),
            default => null,
        };

        $callback->set_renderable($value);
    }

    /**
     * Inplace editable callback for report name.
     *
     * @param inplace_editable_object $callback
     * @return \core\output\inplace_editable
     */
    private function inplace_editable_presetname(inplace_editable_object $callback): \core\output\inplace_editable {
        global $DB;

        $newvalue = param::TEXT->clean($callback->newvalue);
        $edithint = get_string('editadminpresetname', 'tool_admin_presets');
        $displayvalue = format_string($newvalue, true, [
            'context' => \core\context\system::instance(),
            'escape' => false,
        ]);
        $editlabel = get_string('newvaluefor', 'form', $displayvalue);

        // Update value in database.
        $DB->set_field('adminpresets', 'name', $newvalue, [
            'id' => $callback->itemid,
            'iscore' => \core_adminpresets\manager::NONCORE_PRESET,
        ]);

        return new \core\output\inplace_editable(
            'tool_admin_presets',
            $callback->itemtype,
            $callback->itemid,
            true,
            $displayvalue,
            $callback->newvalue,
            $edithint,
            $editlabel,
        );
    }
}
