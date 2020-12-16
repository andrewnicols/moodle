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
 * The core_user/imageeditable for the image_editable output component.
 *
 * @package    core_user
 * @since      Moodle 3.11
 * @copyright  2020 Bas Brands <bas@moodle.com>
 */

namespace core_user\imageeditable;

defined('MOODLE_INTERNAL') || die();

/**
 * Class core_user/imageeditable/handler for the image_editable output component.
 *
 * @package    core_user
 * @since      Moodle 3.11
 * @copyright  2020 Bas Brands <bas@moodle.com>
 */
class handler {

    /**
     * Check permissions for storing the image.
     *
     * @param int $contextid The contextid
     */
    public static function check_permissions($contextid) {
        global $USER;
        $context = \context::instance_by_id($contextid);

        $user = \core_user::get_user($context->instanceid, '*', MUST_EXIST);
        $systemcontext = \context_system::instance();

        if ($user->id == $USER->id) {
            require_capability('moodle/user:editownprofile', $systemcontext);
        } else {
            require_capability('moodle/user:editprofile', $context);
            if (is_siteadmin($user) and !is_siteadmin($USER)) {  // Only admins may edit other admins.
                throw new moodle_exception('useradmineditadmin');
            }
        }
    }

    /**
     * Process the image and return the new image URL.
     *
     * @param int $userid The user id to store this file for.
     * @param int $draftitemid The draftitemid for the image.
     */
    public static function store(int $contextid, string $filearea, string $filename, string $binary) {
        global $CFG;

        self::check_permissions($contextid);
        $context = \context::instance_by_id($contextid);

        $draftitemid = file_get_unused_draft_itemid();
        self::store_draftfile($filename, $binary, $draftitemid);

        $user = \core_user::get_user($context->instanceid, '*', MUST_EXIST);
        $user->imagefile = $draftitemid;
        $filemanageroptions = ['maxbytes' => $CFG->maxbytes,
            'subdirs'        => 0,
            'maxfiles'       => 1,
            'accepted_types' => 'optimised_image'];
        \core_user::update_picture($user, $filemanageroptions);
    }

    /**
     * Process the formdata from the singleimage form element.
     *
     * @param int $draftitemid The draftitemid for the image
     * @param array $singleimageoptions The configuration for the singleimage form field.
     */
    public static function process_formdata(int $draftitemid, array $singleimageoptions) {
        global $USER, $CFG;

        $contextid = $singleimageoptions['contextid'];
        $filearea = $singleimageoptions['filearea'];
        self::check_permissions($contextid);

        if ($draftitemid == -1) {
            self::delete($contextid, $filearea);
            return;
        }

        $context = \context::instance_by_id($contextid);

        $personalcontext = \context_user::instance($USER->id);

        $fs = get_file_storage();

        foreach ($fs->get_area_files($personalcontext->id, 'user', 'draft', $draftitemid) as $draftfile) {
            if ($draftfile->is_valid_image()) {
                $user = \core_user::get_user($context->instanceid, '*', MUST_EXIST);
                $user->imagefile =  $draftfile->get_itemid();
                $filemanageroptions = ['maxbytes' => $CFG->maxbytes,
                    'subdirs'        => 0,
                    'maxfiles'       => 1,
                    'accepted_types' => 'optimised_image'];
                \core_user::update_picture($user, $filemanageroptions);
                $draftfile->delete();
            }
        }
    }

    /**
     * Delete the image
     *
     * @param int $userid The userid to delete the image for.
     * @param string $filearea The filearea for this file.
     */
    public static function delete(int $contextid, string $filearea) {
        global $DB;

        self::check_permissions($contextid);
        $context = \context::instance_by_id($contextid);

        $fs = get_file_storage();
        $fs->delete_area_files($contextid, 'user', $filearea);
        $DB->set_field('user', 'picture', 0, array('id' => $context->instanceid));
    }
}
