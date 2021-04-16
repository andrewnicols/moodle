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
 * PHPUnit tool_brickfield data generator
 *
 * @package   tool_brickfield
 * @copyright  2020 onward: Brickfield Education Labs, www.brickfield.ie
 * @author     Jay Churchward (jay.churchward@poetopensource.org)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

class tool_brickfield_generator extends testing_module_generator {

    public function create_course_category() {
        $coursecategory = array (
            array('id', 'name', 'idnumber', 'description', 'descriptionformat', 'parent', 'sortorder', 'coursecount',
            'visible', 'visibleold', 'timemodified', 'depth', 'path', 'theme'),
            array(1, 'Test Category', null, null, 0, 0, 10000, 1, 1, 1, time(), 1, '/1', null)
        );
        $this->add_data($coursecategory, 'course_categories', 'brickfieldmap');
    }

    public function create_course($categoryid) {
        $course = array(
            array('id', 'category', 'sortorder', 'fullname', 'shortname', 'idnumber', 'summary', 'summaryformat',
                'format', 'showgrades', 'newsitems', 'startdate', 'enddate', 'relativedatesmode', 'marker', 'maxbytes',
                'legacyfiles', 'showreports', 'visible', 'visibleold', 'groupmode', 'groupmodeforce', 'defaultgroupingid',
                'lang', 'calendartype', 'theme', 'timecreated', 'timemodified', 'requested', 'enablecompletion',
                'completionnotify', 'cacherev'),
            array(1, $categoryid, 1, 'Test Course Full', 'Test Course Short', 0, null, 0, 'topics', 1, 5, time(), time(),
                0, 0, 0, 0, 0, 1, 1, 0, 0, 0, '', '', '', time(), time(), 0, 0, 0, 1586180184)
        );
        $this->add_data($course, 'course', 'brickfieldmap');

    }

    private function add_data(array $data, $datatable, $mapvar = '', array $replvars = null) {
        global $DB;

        if ($replvars === null) {
            $replvars = array();
        }
        $fields = array_shift($data);
        foreach ($data as $row) {
            $record = new stdClass();
            foreach ($row as $key => $fieldvalue) {
                if ($fields[$key] == 'id') {
                    if (!empty($mapvar)) {
                        $oldid = $fieldvalue;
                    }
                } else if (($replvar = array_search($fields[$key], $replvars)) !== false) {
                    $record->{$fields[$key]} = $this->{$replvar}[$fieldvalue];
                } else {
                    $record->{$fields[$key]} = $fieldvalue;
                }
            }
            $newid = $DB->insert_record($datatable, $record);
            if (!empty($mapvar)) {
                $this->{$mapvar}[$oldid] = $newid;
            }
        }
    }
}