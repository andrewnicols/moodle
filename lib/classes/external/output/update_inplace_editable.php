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

namespace core\external\output;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;

/**
 * Web Service to update an inplace editable value.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class update_inplace_editable extends external_api {
    /**
     * Parameters for function execute()
     *
     * @since Moodle 3.1
     * @return external_function_parameters
     */
    public static function execute_parameters() {
        return new external_function_parameters([
            'component' => new external_value(PARAM_COMPONENT, 'component responsible for the update', VALUE_REQUIRED),
            'itemtype' => new external_value(PARAM_NOTAGS, 'type of the updated item inside the component', VALUE_REQUIRED),
            'itemid' => new external_value(PARAM_RAW, 'identifier of the updated item', VALUE_REQUIRED),
            'value' => new external_value(PARAM_RAW, 'new value', VALUE_REQUIRED),
        ]);
    }

    /**
     * Update any component's editable value assuming that component implements necessary callback
     *
     * @since Moodle 3.1
     * @param string $component
     * @param string $itemtype
     * @param string $itemid
     * @param string $value
     */
    public static function execute($component, $itemtype, $itemid, $value) {
        global $PAGE;

        [
            'component' => $component,
            'itemtype' => $itemtype,
            'itemid' => $itemid,
            'value' => $value,
        ] = self::validate_parameters(self::execute_parameters(), [
            'component' => $component,
            'itemtype' => $itemtype,
            'itemid' => $itemid,
            'value' => $value,
        ]);

        $callback = new \core\callbacks\output\inplace_editable_object($itemtype, $itemid, $value);
        \core\di::get(\core\callback_manager::class)->dispatch($component, $callback);

        return $callback->get_renderable()->export_for_template($PAGE->get_renderer('core'));
    }

    /**
     * Return structure for execute()
     *
     * @since Moodle 3.1
     * @return external_single_structure
     */
    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'displayvalue' => new external_value(PARAM_RAW, 'display value (may contain link or other html tags)'),
            'component' => new external_value(PARAM_NOTAGS, 'component responsible for the update', VALUE_OPTIONAL),
            'itemtype' => new external_value(PARAM_NOTAGS, 'itemtype', VALUE_OPTIONAL),
            'value' => new external_value(PARAM_RAW, 'value of the item as it is stored', VALUE_OPTIONAL),
            'itemid' => new external_value(PARAM_RAW, 'identifier of the updated item', VALUE_OPTIONAL),
            'edithint' => new external_value(PARAM_NOTAGS, 'hint for editing element', VALUE_OPTIONAL),
            'editlabel' => new external_value(PARAM_RAW, 'label for editing element', VALUE_OPTIONAL),
            'editicon' => new external_single_structure([
                'key' => new external_value(PARAM_RAW, 'Edit icon key', VALUE_OPTIONAL),
                'component' => new external_value(PARAM_COMPONENT, 'Edit icon component', VALUE_OPTIONAL),
                'title' => new external_value(PARAM_NOTAGS, 'Edit icon title', VALUE_OPTIONAL),
            ], 'Edit icon', VALUE_OPTIONAL),
            'type' => new external_value(PARAM_ALPHA, 'type of the element (text, toggle, select)', VALUE_OPTIONAL),
            'options' => new external_value(PARAM_RAW, 'options of the element, format depends on type', VALUE_OPTIONAL),
            'linkeverything' => new external_value(PARAM_INT, 'Should everything be wrapped in the edit link or link displayed separately', VALUE_OPTIONAL),
        ]);
    }
}
