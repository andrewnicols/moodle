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

namespace core_reportbuilder\callbacks\output;

use core\callbacks\output\inplace_editable_interface;
use core\callbacks\output\inplace_editable_object;

/**
 * Inplace editable callback implementation.
 *
 * @package    core_reportbuilder
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class inplace_editable_callback implements
    inplace_editable_interface
{
    #[\Override]
    public function execute_inplace_editable(inplace_editable_object $callback): void {
        $itemid = $callback->itemid;
        $newvalue = $callback->newvalue;
        $value = match ($callback->itemtype) {
            'reportname' => \core_reportbuilder\output\report_name_editable::update($itemid, $newvalue),
            'columnheading' => \core_reportbuilder\output\column_heading_editable::update($itemid, $newvalue),
            'columnaggregation' => \core_reportbuilder\output\column_aggregation_editable::update($itemid, $newvalue),
            'filterheading' => \core_reportbuilder\output\filter_heading_editable::update($itemid, $newvalue),
            'audienceheading' => \core_reportbuilder\output\audience_heading_editable::update($itemid, $newvalue),
            'schedulename' => \core_reportbuilder\output\schedule_name_editable::update($itemid, $newvalue),
            default => null,
        };

        $callback->set_renderable($value);
    }
}
