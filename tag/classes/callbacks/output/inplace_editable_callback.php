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

namespace core_tag\callbacks\output;

use core\callbacks\output\inplace_editable_interface;
use core\callbacks\output\inplace_editable_object;

/**
 * Inplace editable callback implementation.
 *
 * @package    core_tag
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class inplace_editable_callback implements
    inplace_editable_interface
{
    #[\Override]
    public function execute_inplace_editable(inplace_editable_object $callback): void {
        $value = match ($callback->itemtype) {
            'tagname' => \core_tag\output\tagname::update($callback->itemid, $callback->newvalue),
            'tagareaenable' => \core_tag\output\tagareaenabled::update($callback->itemid, $callback->newvalue),
            'tagareacollection' => \core_tag\output\tagareacollection::update($callback->itemid, $callback->newvalue),
            'tagareashowstandard' => \core_tag\output\tagareashowstandard::update($callback->itemid, $callback->newvalue),
            'tagcollname' => \core_tag\output\tagcollname::update($callback->itemid, $callback->newvalue),
            'tagcollsearchable' => \core_tag\output\tagcollsearchable::update($callback->itemid, $callback->newvalue),
            'tagflag' => \core_tag\output\tagflag::update($callback->itemid, $callback->newvalue),
            'tagisstandard' => \core_tag\output\tagisstandard::update($callback->itemid, $callback->newvalue),
            default => null,
        };

        $callback->set_renderable($value);
    }
}
