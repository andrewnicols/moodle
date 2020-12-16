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
 * Steps definitions for the upload repository type.
 *
 * @package    repository_upload
 * @category   test
 * @copyright  2013 David Monllaó
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// NOTE: no MOODLE_INTERNAL test here, this file may be required by behat before including /config.php.

require_once(__DIR__ . '/../../../lib/behat/core_behat_file_helper.php');

use Behat\Mink\Exception\DriverException as DriverException,
    Behat\Mink\Exception\ExpectationException as ExpectationException;

/**
 * Steps definitions to deal with the singleimage upload.
 *
 * @package    singleimage_upload
 * @category   test
 * @copyright  2021 Bas Brands
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class behat_singleimage_upload extends behat_base {

    use core_behat_file_helper;

    /**
     * Uploads a file to the specified singleimage form element.
     *
     * @When /^I upload "(?P<filepath_string>(?:[^"]|\\")*)" file to "(?P<filemanager_field_string>(?:[^"]|\\")*)" singleimage$/
     * @throws DriverException
     * @throws ExpectationException Thrown by behat_base::find
     * @param string $filepath
     * @param string $singleimageelement
     */
    public function i_upload_file_to_singleimage($filepath, $singleimageelement) {
        global $CFG;

        if (!$this->has_tag('_file_upload')) {
            throw new DriverException('File upload tests must have the @_file_upload tag on either the scenario or feature.');
        }

        // Attaching specified file to the node.
        // Replace 'admin/' if it is in start of path with $CFG->admin .
        if (substr($filepath, 0, 6) === 'admin/') {
            $filepath = $CFG->dirroot . DIRECTORY_SEPARATOR . $CFG->admin .
                    DIRECTORY_SEPARATOR . substr($filepath, 6);
        }
        $filepath = str_replace('/', DIRECTORY_SEPARATOR, $filepath);
        if (!is_readable($filepath)) {
            $filepath = $CFG->dirroot . DIRECTORY_SEPARATOR . $filepath;
            if (!is_readable($filepath)) {
                throw new ExpectationException('The file to be uploaded does not exist.', $this->getSession());
            }
        }

        // Form elements to interact with.
        $file = $this->find_file('uploadimage');

        $file->attachFile($filepath);

        // Submit the file.
        $submit = $this->find_button(get_string('save', 'moodle'));
        $submit->press();
    }
}
