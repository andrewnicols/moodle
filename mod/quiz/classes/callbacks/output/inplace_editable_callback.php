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

namespace mod_quiz\callbacks\output;

use core\callbacks\output\inplace_editable_interface;
use core\callbacks\output\inplace_editable_object;
use mod_quiz\quiz_settings;

/**
 * Inplace editable callback implementation.
 *
 * @package    mod_quiz
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class inplace_editable_callback implements
    inplace_editable_interface
{
    #[\Override]
    public function execute_inplace_editable(inplace_editable_object $callback): void {
        $value = match ($callback->itemtype) {
            'slotdisplaynumber' => $this->inplace_editable_slotdisplaynumber($callback),
            default => null,
        };

        $callback->set_renderable($value);
    }

    /**
     * Inplace editable callback for slot display number.
     *
     * @param inplace_editable_object $callback
     * @return \core\output\inplace_editable
     */
    private function inplace_editable_slotdisplaynumber(inplace_editable_object $callback): \core\output\inplace_editable {
        global $DB;

        $itemid = $callback->itemid;
        $newvalue = $callback->newvalue;

        // Work out which quiz and slot this is.
        $slot = $DB->get_record('quiz_slots', ['id' => $itemid], '*', MUST_EXIST);
        $quizobj = quiz_settings::create($slot->quizid);

        // Validate the context, and check the required capability.
        $context = $quizobj->get_context();
        \core_external\external_api::validate_context($context);
        require_capability('mod/quiz:manage', $context);

        // Update the value - truncating the size of the DB column.
        $structure = $quizobj->get_structure();
        $structure->update_slot_display_number($itemid, \core_text::substr($newvalue, 0, 16));

        // Prepare the element for the output.
        return $structure->make_slot_display_number_in_place_editable($itemid, $context);
    }

}
