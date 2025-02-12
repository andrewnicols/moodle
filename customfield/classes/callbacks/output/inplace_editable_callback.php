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

namespace core_customfield\callbacks\output;

use core\callbacks\output\inplace_editable_interface;
use core\callbacks\output\inplace_editable_object;
use core\param;
use core_customfield\category_controller;
use core_external\external_api;

/**
 * Inplace editable callback implementation.
 *
 * @package    core_customfield
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class inplace_editable_callback implements
    inplace_editable_interface
{
    #[\Override]
    public function execute_inplace_editable(inplace_editable_object $callback): void {
        match ($callback->newvalue) {
            'category' => $this->inplace_editable_category($callback),
            default => null,
        };
    }

    /**
     * Inplace editable callback for customfield.
     *
     * @param inplace_editable_object $callback
     */
    private function inplace_editable_category(inplace_editable_object $callback): void {
        $category = category_controller::create($callback->itemid);
        $handler = $category->get_handler();
        external_api::validate_context($handler->get_configuration_context());

        if (!$handler->can_configure()) {
            throw new \core\exception\moodle_exception('nopermissionconfigure', 'core_customfield');
        }

        $handler->rename_category($category, param::TEXT->clean($callback->newvalue));
        $callback->set_renderable(\core_customfield\api::get_category_inplace_editable($category, true));
    }
}
