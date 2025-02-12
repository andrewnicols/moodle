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

namespace tool_usertours\callbacks\output;

use core\callbacks\output\inplace_editable_interface;
use core\callbacks\output\inplace_editable_object;
use core_external\external_api;
use tool_usertours\helper;

/**
 * Inplace editable callback implementation.
 *
 * @package    tool_usertours
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class inplace_editable_callback implements
    inplace_editable_interface
{
    #[\Override]
    public function execute_inplace_editable(inplace_editable_object $callback): void {
        $context = \core\context\system::instance();
        external_api::validate_context($context);
        require_capability('tool/usertours:managetours', $context);

        match ($callback->itemtype) {
            'tourname' => $this->inplace_editable_tourname($callback),
            'tourdescription' => $this->inplace_editable_tourdescription($callback),
            'tourenabled' => $this->inplace_editable_tourenabled($callback),
            'stepname' => $this->inplace_editable_stepname($callback),
            default => null,
        };
    }

    /**
     * Inplace editable callback for tour name.
     *
     * @param inplace_editable_object $callback
     */
    private function inplace_editable_tourname(inplace_editable_object $callback): void {
        $tour = helper::get_tour($callback->itemid);
        $tour->set_name($callback->newvalue)->persist();

        $callback->set_renderable(helper::render_tourname_inplace_editable($tour));
    }

    /**
     * Inplace editable callback for tour description.
     *
     * @param inplace_editable_object $callback
     */
    private function inplace_editable_tourdescription(inplace_editable_object $callback): void {
        $tour = helper::get_tour($callback->itemid);
        $tour->set_description($callback->newvalue)->persist();

        $callback->set_renderable(helper::render_tourdescription_inplace_editable($tour));
    }

    /**
     * Inplace editable callback for tour enabled.
     *
     * @param inplace_editable_object $callback
     */
    private function inplace_editable_tourenabled(inplace_editable_object $callback): void {
        $tour = helper::get_tour($callback->itemid);
        $tour->set_enabled(!!$callback->newvalue)->persist();

        $callback->set_renderable(helper::render_tourenabled_inplace_editable($tour));
    }

    /**
     * Inplace editable callback for step name.
     *
     * @param inplace_editable_object $callback
     */
    private function inplace_editable_stepname(inplace_editable_object $callback): void {
        $step = helper::get_step($callback->itemid);
        $step->set_title($callback->newvalue)->persist();

        $callback->set_renderable(helper::render_stepname_inplace_editable($step));
    }
}
