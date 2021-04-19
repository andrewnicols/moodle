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
use tool_brickfield\manager;

defined('MOODLE_INTERNAL') || die();
require_once($CFG->libdir . '/externallib.php');

class get_section_data extends external_api {
    /**
     * Describes the parameters.
     * @return external_function_parameters
     */
    public static function execute_parameters() {
        return new external_function_parameters([
            'courseid' => new external_value(PARAM_INT, 'The course id to obtain results for.', VALUE_REQUIRED),
        ]);
    }

    public static function execute($courseid) {
        global $DB;

        [
            'courseid' => $courseid,
        ] = self::validate_parameters(self::execute_parameters(), [
            'courseid' => $courseid,
        ]);

        $sql = "
        SELECT sec.section, sum(errorcount) AS numerrors, count(errorcount) as numchecks
         FROM {" . manager::DB_AREAS . "} area
         JOIN {" . manager::DB_CONTENT . "} ch ON ch.areaid = area.id AND ch.iscurrent = 1
         JOIN {" . manager::DB_RESULTS . "} res ON res.contentid = ch.id
         JOIN {course_sections} sec ON area.itemid = sec.id
        WHERE area.tablename = :tablename AND area.courseid = :courseid
     GROUP BY sec.id";

        $params = [
            'courseid' => $courseid,
            'tablename' => 'course_sections'
        ];
        $records = $DB->get_records_sql($sql, $params);

        return array_values($records);
    }

    public static function execute_returns() {
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
