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

require_once(__DIR__ . '/../../../../lib/behat/core_behat_file_helper.php');

use Behat\Mink\Element\NodeElement;
use Behat\Mink\Exception\DriverException as DriverException,
    Behat\Mink\Exception\ExpectationException as ExpectationException,
    Behat\Gherkin\Node\TableNode as TableNode;

/**
 * Steps definitions to deal with the upload repository.
 *
 * @package    repository_upload
 * @category   test
 * @copyright  2013 David Monllaó
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class behat_repository_upload extends behat_base {

    use core_behat_file_helper;

    /**
     * Upload a file to the specified filemanager leaving other fields in upload form default.
     * The paths should be relative to moodle codebase.
     *
     * @When /^I upload "(?P<filepath_string>(?:[^"]|\\")*)" file to "(?P<filemanager_field_string>(?:[^"]|\\")*)" filemanager$/
     * @throws DriverException
     * @throws ExpectationException Thrown by behat_base::find
     * @param string $filepath
     * @param string $filemanagerelement
     */
    public function i_upload_file_to_filemanager($filepath, $filemanagerelement): void {
        $this->upload_file_to_filemanager($filepath, $filemanagerelement, new TableNode(array()), false);
    }

    /**
     * Upload a file to the specified filemanager leaving other fields in upload form default and confirms to overwrite an existing file.
     * The paths should be relative to moodle codebase.
     *
     * @When /^I upload and overwrite "(?P<filepath_string>(?:[^"]|\\")*)" file to "(?P<filemanager_field_string>(?:[^"]|\\")*)" filemanager$/
     * @throws DriverException
     * @throws ExpectationException Thrown by behat_base::find
     * @param string $filepath
     * @param string $filemanagerelement
     */
    public function i_upload_and_overwrite_file_to_filemanager($filepath, $filemanagerelement): void {
        $this->upload_file_to_filemanager($filepath, $filemanagerelement, new TableNode(array()),
                get_string('overwrite', 'repository'));
    }

    /**
     * Upload a file to the specified filemanager and confirms to overwrite an existing file.
     * The paths should be relative to moodle codebase.
     *
     * @When /^I upload "(?P<filepath_string>(?:[^"]|\\")*)" file to "(?P<filemanager_field_string>(?:[^"]|\\")*)" filemanager as:$/
     * @throws DriverException
     * @throws ExpectationException Thrown by behat_base::find
     * @param string $filepath
     * @param string $filemanagerelement
     * @param TableNode $data Data to fill in upload form
     */
    public function i_upload_file_to_filemanager_as($filepath, $filemanagerelement, TableNode $data): void {
        $this->upload_file_to_filemanager($filepath, $filemanagerelement, $data, false);
    }

    /**
     * Upload a file to the specified filemanager. The paths should be relative to moodle codebase.
     *
     * @When /^I upload and overwrite "(?P<filepath_string>(?:[^"]|\\")*)" file to "(?P<filemanager_field_string>(?:[^"]|\\")*)" filemanager as:$/
     * @throws DriverException
     * @throws ExpectationException Thrown by behat_base::find
     * @param string $filepath
     * @param string $filemanagerelement
     * @param TableNode $data Data to fill in upload form
     */
    public function i_upload_and_overwrite_file_to_filemanager_as($filepath, $filemanagerelement, TableNode $data): void {
        $this->upload_file_to_filemanager(
            $filepath,
            $filemanagerelement,
            $data,
            get_string('overwrite', 'repository')
        );
    }

    /**
     * Uploads a file to filemanager
     *
     * @throws DriverException
     * @throws ExpectationException Thrown by behat_base::find
     * @param string $filepath Normally a path relative to $CFG->dirroot, but can be an absolute path too.
     * @param string $filemanagerelement
     * @param TableNode $data Data to fill in upload form
     * @param false|string $overwriteaction false if we don't expect that file with the same name already exists,
     *     or button text in overwrite dialogue ("Overwrite", "Rename to ...", "Cancel")
     */
    protected function upload_file_to_filemanager($filepath, $filemanagerelement, TableNode $data, $overwriteaction = false): void {
        if (!$this->has_tag('_file_upload')) {
            throw new DriverException('File upload tests must have the @_file_upload tag on either the scenario or feature.');
        }

        // Opening the select repository window and selecting the upload repository.
        $filemanagernode = $this->get_filepicker_node($filemanagerelement);
        $this->open_add_file_window($filemanagernode, get_string('pluginname', 'repository_upload'));

        // Grab the repository region of the file picker.
        $filepicker = $this->find('dialogue', get_string('filepicker', 'core_repository'));
        $reporegion = $filepicker->find('css', '.fp-repo-items');

        // Upload the file.
        $this->upload_the_file($reporegion, $filepath);

        // Fill the form in Upload window.
        $this->execute('behat_forms::i_set_the_following_fields_in_container_to_these_values', [
            $reporegion, 'NodeElement',
            $data,
        ]);

        // Submit the form.
        $this->execute('behat_general::i_click_on_in_the', [
            get_string('upload', 'repository'), 'button',
            $reporegion, 'NodeElement',
        ]);

        if ($overwriteaction !== false) {
            $overwritebutton = $this->find_button($overwriteaction);
            $this->execute('behat_general::i_click_on', [$overwritebutton, 'NodeElement']);
        }
    }

    /**
     * Try to get the filemanager node specified by the element
     *
     * @param string $filepickerelement
     * @return NodeElement
     * @throws ExpectationException
     */
    protected function get_filepicker_node($filepickerelement) {
        // More info about the problem (in case there is a problem).
        $exception = new ExpectationException('"' . $filepickerelement . '" filepicker can not be found', $this->getSession());

        // If no file picker label is mentioned take the first file picker from the page.
        if (empty($filepickerelement)) {
            $filepickercontainer = $this->find(
                    'xpath',
                    "//*[@class=\"form-filemanager\"]",
                    $exception
            );
        } else {
            // Gets the filemanager node specified by the locator which contains the filepicker container
            // either for filepickers created by mform or by admin config.
            $filepickerelement = behat_context_helper::escape($filepickerelement);
            $filepickercontainer = $this->find(
                    'xpath',
                    "//input[./@id = substring-before(//p[normalize-space(.)=$filepickerelement]/@id, '_label')]" .
                    "//ancestor::*[@data-fieldtype = 'filemanager' or @data-fieldtype = 'filepicker']",
                    $exception
            );
        }

        return $filepickercontainer;
    }

    /**
     * Upload a file in the file picker using the repository_upload plugin.
     *
     * Note: This step assumes we are already in the file picker.
     *
     * @Given /^I upload "(?P<filepath_string>(?:[^"]|\\")*)" to the file picker$/
     */
    public function i_upload_a_file_in_the_filepicker(string $filepath): void {
        // Ensure that we are on the "Upload a file" repository plugin.
        $filepicker = $this->select_upload_repository();

        // Grab the repository region of the file picker.
        $reporegion = $filepicker->find('css', '.fp-repo-items');

        // Upload the file.
        $this->upload_the_file($reporegion, $filepath);

        // Attach it.
        $this->execute('behat_general::i_click_on_in_the', [
            get_string('upload', 'repository'), 'button',
            $reporegion, 'NodeElement',
        ]);
    }

    /**
     * Select the "Upload a file" repository plugin from the filepicker.
     *
     * @return NodeElement The filepicker region.
     */
    protected function select_upload_repository(): NodeElement {
        if (!$this->has_tag('javascript')) {
            throw new DriverException('The file picker is only available with javascript enabled');
        }

        if (!$this->has_tag('_file_upload')) {
            throw new DriverException('File upload tests must have the @_file_upload tag on either the scenario or feature.');
        }

        $filepicker = $this->find('dialogue', get_string('filepicker', 'core_repository'));

        $this->execute('behat_general::i_click_on_in_the', [
            get_string('pluginname', 'repository_upload'), 'link',
            $filepicker, 'NodeElement',
        ]);

        return $filepicker;
    }

    /**
     * Upload the specified file into the repository_upload repository.
     *
     * Note: This action is synchronous and WebDriver will wait for it to return before proceeding.
     *
     * @param NodeElement $reporegion The region that the file input is contained in
     * @param string $filepath The filepath within the Moodle repository
     */
    protected function upload_the_file(NodeElement $reporegion, string $filepath): void {
        $fileinput = $this->find('field', get_string('attachment', 'core_repository'), false, $reporegion);
        $filepath = $this->normalise_fixture_filepath($filepath);
        $fileinput->attachFile($filepath);
    }

    /**
     * Normalise the path to a fixture file.
     *
     * @param string $filepath The path relative to the CFG->dirroot.
     * @return string A fully-qualified and normalised filepath
     * @throws ExpectationException If the file is not found
     */
    protected function normalise_fixture_filepath(string $filepath): string {
        global $CFG;

        $filepath = str_replace('/', DIRECTORY_SEPARATOR, $filepath);
        if (!is_readable($filepath)) {
            $filepath = $CFG->dirroot . DIRECTORY_SEPARATOR . $filepath;
            if (!is_readable($filepath)) {
                throw new ExpectationException('The file to be uploaded does not exist.', $this->getSession());
            }
        }

        return $filepath;
    }
}
