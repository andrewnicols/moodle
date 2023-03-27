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

declare(strict_types=1);

namespace communication_matrix\task;

/**
 * Ad-hoc task to perform the create new Communication category with its field for matrix user id.
 *
 * @package   communication_matrix
 * @copyright 2023 Stevani Andolo <stevani.andolo@moodle.com>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class post_install extends \core\task\adhoc_task {

    /**
     * Insert "Communication" and "matrixuserid" field.
     *
     * @return void
     */
    public function execute() : void {
        global $CFG, $DB;

        require_once($CFG->dirroot . '/user/profile/definelib.php');
        require_once($CFG->dirroot . '/user/profile/field/text/define.class.php');

        // Check if communication category exists.
        $categoryname = 'Communication';
        $category = $DB->count_records('user_info_category', ['name' => $categoryname]);
        if ($category < 1) {
            $data = new \stdClass();
            $data->sortorder = $DB->count_records('user_info_category') + 1;
            $data->name = $categoryname;
            $data->id = $DB->insert_record('user_info_category', $data, true);

            $createdcategory = $DB->get_record('user_info_category', array('id' => $data->id));
            $categoryid = $createdcategory->id;
            \core\event\user_info_category_created::create_from_category($createdcategory)->trigger();
        } else {
            $category = $DB->get_record('user_info_category', array('name' => $categoryname));
            $categoryid = $category->id;
        }
        set_config('communication_category_field', $categoryname, 'core_communication');

        // Check if matrixuserid exists in user_info_field table.
        $matrixuserid = $DB->count_records('user_info_field', [
            'shortname' => 'matrixuserid', 'categoryid' => $categoryid
        ]);
        if ($matrixuserid < 1) {
            $profileclass = new \profile_define_text();
            $data = (object) [
                'shortname' => 'matrixuserid',
                'name' => get_string('matrixuserid', 'communication_matrix'),
                'datatype' => 'text',
                'description' => get_string('matrixuserid_desc', 'communication_matrix'),
                'descriptionformat' => 1,
                'categoryid' => $categoryid,
                'forceunique' => 1,
                'visible' => 0,
                'locked' => 1,
                'param1' => 30,
                'param2' => 2048
            ];
            $profileclass->define_save($data);
            set_config('matrixuserid_field', 'matrixuserid', 'communication_matrix');
        }
    }
}
