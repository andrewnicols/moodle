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
 * List of User Tours for the tool_usertours plugin.
 *
 * @package    tool_usertours
 * @copyright  2021 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


return new class extends \tool_usertours\tourlist {
    /**
     * Get a list of shipped tours in the format filename => version to install or update.
     *
     * @return array
     */
    public function get_shipped_tours(): array {
        return [
            '311_activity_information_activity_page_student.json' => 2,
            '311_activity_information_activity_page_teacher.json' => 2,
            '311_activity_information_course_page_student.json' => 2,
            '311_activity_information_course_page_teacher.json' => 2
        ];
    }

    /**
     * Get a list of unshipped tours in the format filename => version to disable.
     *
     * @return array
     */
    public function get_unshipped_tours(): array {
        return [
            // Formerly included in Moodle 3.2.0.
            'boost_administrator.json' => 1,
            'boost_course_view.json' => 1,

            // Formerly included in Moodle 3.6.0.
            '36_dashboard.json' => 3,
            '36_messaging.json' => 3,
        ];
    }
};
