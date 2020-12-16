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
 * The core_course/imageeditable for the image_editable output component.
 *
 * @package    core_course
 * @since      Moodle 3.11
 * @copyright  2020 Bas Brands <bas@moodle.com>
 */

namespace core_course\imageeditable;

defined('MOODLE_INTERNAL') || die();

/**
 * Class core_course/imageeditable/handler for the image_editable output component.
 *
 * @package    core_course
 * @since      Moodle 3.11
 * @copyright  2020 Bas Brands <bas@moodle.com>
 */
class handler {

    /**
     * Check permissions for storing the image.
     *
     * @param int $contextid The contextid.
     */
    public static function check_permissions(int $contextid) {
        $context = \context::instance_by_id($contextid);
        require_capability('moodle/course:update', $context);
    }

    /**
     * Process the image and return the new image URL.
     *
     * @param int $contextid The course context id.
     * @param string $filearea The filearea where this image should be stored.
     * @param string $filename The image file name.
     * @param binary string $binary The image binary data.
     * @param int $draftitemid The draftitemid for the image.
     */
    public static function store(int $contextid, string $filearea, string $filename, string $binary) {

        $context = \context::instance_by_id($contextid);
        self::check_permissions($contextid);

        $fs = get_file_storage();

        self::delete($contextid, 'overviewfiles');
        $newimage = [
            'contextid' => $context->id,
            'component' => 'course',
            'filearea' => $filearea,
            'itemid' => 0,
            'filepath' => '/',
            'filename' => $filename
        ];
        $fs->create_file_from_string($newimage, $binary);
    }

    /**
     * Process the formdata from the singleimage form element.
     *
     * @param int $draftitemid The draftitemid for the image
     * @param array $singleimageoptions The configuration for the singleimage form field.
     */
    public static function process_formdata(int $draftitemid, array $singleimageoptions) {
        global $USER;

        $contextid = $singleimageoptions['contextid'];
        $filearea = $singleimageoptions['filearea'];
        self::check_permissions($contextid);

        if ($draftitemid == -1) {
            self::delete($contextid, $filearea);
            return;
        }

        $personalcontext = \context_user::instance($USER->id);

        $fs = get_file_storage();

        foreach ($fs->get_area_files($personalcontext->id, 'user', 'draft', $draftitemid) as $draftfile) {
            if ($draftfile->is_valid_image()) {
                self::delete($contextid, $filearea);
                $newimage = array(
                    'contextid' => $contextid,
                    'component' => 'course',
                    'filearea' => $filearea,
                    'itemid' => 0,
                    'filepath' => '/',
                    'filename' => $draftfile->get_filename()
                );
                $fs->create_file_from_storedfile($newimage, $draftfile);
            }
            $draftfile->delete();
        }
    }

    /**
     * Delete the image
     *
     * @param int $contextid The course context id.
     * @param string $filearea The filearea for this file.
     */
    public static function delete(int $contextid, string $filearea) {

        self::check_permissions($contextid);
        $fs = get_file_storage();

        foreach ($fs->get_area_files($contextid, 'course', $filearea) as $deletefile) {
            if ($deletefile->is_valid_image()) {
                $deletefile->delete();
            }
        }
    }

}
