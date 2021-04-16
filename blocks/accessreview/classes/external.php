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
defined('MOODLE_INTERNAL') || die();

use tool_brickfield\manager;

require_once($CFG->libdir . '/externallib.php');

class block_accessreview_external extends external_api {
    /**
     * Describes the set_toggled_preference parameters.
     * @return external_function_parameters
     */
    public static function set_toggle_preference_parameters() {
        return new external_function_parameters([
            'toggle' => new external_value(PARAM_BOOL, 'The state of the toggle.'),
        ]);
    }

    public static function set_toggle_preference($toggle) {
        global $USER;
        $params = self::validate_parameters(self::set_toggle_preference_parameters(), [
            'toggle' => $toggle
        ]);
        set_user_preference('block_accessreviewtogglestate', $params['toggle']);
        return ['userid' => $USER->id, 'toggle' => $toggle];
    }

    public static function set_toggle_preference_returns() {
        return new external_function_parameters([
            'userid' => new external_value(PARAM_INT, 'The user ID whose preference was changed.', VALUE_REQUIRED),
            'toggle' => new external_value(PARAM_BOOL, 'The state it has been changed to.', VALUE_REQUIRED)
        ]);
    }

    /**
     * Describes the get_module_data parameters.
     * @return external_function_parameters
     */
    public static function get_module_data_parameters() {
        return new external_function_parameters([
            'courseid' => new external_value(PARAM_INT, 'The course id to obtain results for.', VALUE_REQUIRED),
        ]);
    }

    public static function get_module_data($courseid) {
        global $DB;

        $params = self::validate_parameters(self::get_module_data_parameters(), [
            'courseid' => $courseid
        ]);

        $sql = "SELECT area.cmid, sum(errorcount) as numerrors, count(errorcount) as numchecks
        FROM {" . manager::DB_AREAS . "} area
        INNER JOIN {" . manager::DB_CONTENT . "} ch ON ch.areaid = area.id AND ch.iscurrent = 1
        INNER JOIN {" . manager::DB_RESULTS . "} res ON res.contentid = ch.id
        WHERE area.courseid = :courseid AND component != :component
        GROUP BY cmid";

        $params = ['courseid' => $params['courseid'], 'component' => 'core_course'];
        $records = $DB->get_records_sql($sql, $params);
        return array_values($records);
    }

    public static function get_module_data_returns() {
        return new external_multiple_structure(
            new external_single_structure(
                [
                    'cmid' => new external_value(PARAM_INT, 'ID'),
                    'numerrors' => new external_value(PARAM_INT, 'Number of errors.'),
                    'numchecks' => new external_value(PARAM_INT, 'Number of checks.'),
                ]
            )
        );
    }

    /**
     * Describes the get_section_data parameters.
     * @return external_function_parameters
     */
    public static function get_section_data_parameters() {
        return new external_function_parameters([
            'courseid' => new external_value(PARAM_INT, 'The course id to obtain results for.', VALUE_REQUIRED),
        ]);
    }

    public static function get_section_data($courseid) {
        global $DB;

        $params = self::validate_parameters(self::get_section_data_parameters(), [
            'courseid' => $courseid
        ]);

        $sql = "SELECT section, sum(errorcount) AS numerrors, count(errorcount) as numchecks
        FROM {" . manager::DB_AREAS . "} area
        INNER JOIN {" . manager::DB_CONTENT . "} ch ON ch.areaid = area.id AND ch.iscurrent = 1
        INNER JOIN {" . manager::DB_RESULTS . "} res ON res.contentid = ch.id
        INNER JOIN {course_sections} sec ON area.itemid = sec.id
        WHERE tablename = :tablename AND courseid = :courseid
        GROUP BY sec.id";

        $params = ['courseid' => $params['courseid'], 'tablename' => 'course_sections'];
        $records = $DB->get_records_sql($sql, $params);

        return array_values($records);
    }

    public static function get_section_data_returns() {
        return new external_multiple_structure(
            new external_single_structure(
                [
                    'section' => new external_value(PARAM_INT, 'ID'),
                    'numerrors' => new external_value(PARAM_INT, 'Number of errors.'),
                    'numchecks' => new external_value(PARAM_INT, 'Number of checks.'),
                ]
            )
        );
    }
}