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

namespace core_calendar\callbacks\output;

use core\callbacks\output\inplace_editable_interface;
use core\callbacks\output\inplace_editable_object;
use core_external\external_api;

/**
 * Inplace editable callback implementation.
 *
 * @package    core_calendar
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class inplace_editable_callback implements
    inplace_editable_interface
{
    #[\Override]
    public function execute_inplace_editable(inplace_editable_object $callback): void {
        match ($callback->itemtype) {
            'refreshinterval' => $this->inplace_editable_refreshinterval($callback),
            default => null,
        };
    }

    /**
     * Inplace editable callback for refresh interval.
     *
     * @param inplace_editable_object $callback
     */
    private function inplace_editable_refreshinterval(inplace_editable_object $callback): void {
        global $OUTPUT;

        $subscription = calendar_get_subscription($callback->itemid);
        $context = calendar_get_calendar_context($subscription);
        external_api::validate_context($context);

        $updateresult = \core_calendar\output\refreshintervalcollection::update($callback->itemid, $callback->newvalue);

        $refreshresults = calendar_update_subscription_events($callback->itemid);
        \core\notification::add($OUTPUT->render_from_template(
            'core_calendar/subscription_update_result',
            array_merge($refreshresults, [
                'subscriptionname' => s($subscription->name),
            ]),
        ), \core\notification::INFO);

        $callback->set_renderable($updateresult);
    }
}
