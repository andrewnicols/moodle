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
/**
 *
 * @package    block_accessreview
 * @copyright  2020 onward Brickfield Education Labs Ltd, https://www.brickfield.ie
 * @author     2020 Max Larkin <max@brickfieldlabs.ie>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
namespace block_accessreview\external;

use external_api;
use external_function_parameters;
use external_multiple_structure;
use external_single_structure;
use external_value;

defined('MOODLE_INTERNAL') || die();
require_once($CFG->libdir . '/externallib.php');

class update_toggle_preference extends external_api {
    /**
     * Describes the set_toggled_preference parameters.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters() {
        return new external_function_parameters([
            'toggle' => new external_value(PARAM_BOOL, 'The state of the toggle.'),
        ]);
    }

    public static function execute($toggle) {
        global $USER;

        [
            'toggle' => $toggle,
        ]  = self::validate_parameters(self::execute_parameters(), [
            'toggle' => $toggle
        ]);

        set_user_preference('block_accessreviewtogglestate', $toggle);

        return [
            'userid' => $USER->id,
            'toggle' => $toggle,
        ];
    }

    public static function execute_returns() {
        return new external_function_parameters([
            'userid' => new external_value(PARAM_INT, 'The user ID whose preference was changed.', VALUE_REQUIRED),
            'toggle' => new external_value(PARAM_BOOL, 'The state it has been changed to.', VALUE_REQUIRED)
        ]);
    }
}
