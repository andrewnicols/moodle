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

namespace core_groupcallbacks\output;

use core\callbacks\output\inplace_editable_interface;
use core\callbacks\output\inplace_editable_object;
use core\param;
use core_external\external_api;

/**
 * Callbacks for the component.
 *
 * @package    core_groups
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class callbacks implements
    inplace_editable_interface
{
    #[\Override]
    public function execute_inplace_editable(inplace_editable_object $callback): void {
        $value = match ($callback->newvalue) {
            'user_groups' => \core_group\output\user_groups_editable::update($callback->itemid, $callback->newvalue);,
            default => null,
        };

        $callback->set_renderable($value);
    }
}
