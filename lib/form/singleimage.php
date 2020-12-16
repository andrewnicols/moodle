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
 * Float type form element
 *
 * Contains HTML class for a float type element
 *
 * @package   core_form
 * @category  form
 * @copyright 2020 Bas Brands <bas@moodle.com>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->libdir . '/form/filepicker.php');

/**
 * Float type form element.
 *
 * This is preferred over the text element when working with float numbers, and takes care of the fact that different languages
 * may use different symbols as the decimal separator.
 * Using this element, submitted float numbers will be automatically translated from the localised format into the computer format,
 * and vice versa when they are being displayed.
 *
 * @copyright 2020 Bas Brands <bas@moodle.com>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class MoodleQuickForm_singleimage extends MoodleQuickForm_filepicker {


    protected $_options = [
        'currentimage' => '',
        'defaultimage' => '',
        'rounded' => false,
        'component' => 'user',
        'contextid' => '',
        'filearea' => 'draft'
    ];

    /**
     * Constructor
     *
     * @param string $elementName (optional) name of the singleimagefield
     * @param string $elementLabel (optional) singleimage label
     * @param array $attributes (optional) Either a typical HTML attribute string
     *              or an associative array
     * @param array $options set of options to initalize singleimage
     */
    public function __construct($elementName=null, $elementLabel=null, $attributes=null, $options=null) {
        parent::__construct($elementName, $elementLabel, $attributes, $options);
        $this->_type = 'singleimage';
    }

    /**
     * Returns HTML for filepicker form element.
     *
     * @return string
     */
    function toHtml() {
        global $OUTPUT;

        $id     = $this->_attributes['id'];
        $elname = $this->_attributes['name'];

        if ($this->_flagFrozen) {
            return $this->getFrozenHtml();
        }
        if (!$draftitemid = (int)$this->getValue()) {
            // no existing area info provided - let's use fresh new draft area
            $draftitemid = file_get_unused_draft_itemid();
            $this->setValue($draftitemid);
        }

        $data = (object) [
            'currentimage' => $this->_options['currentimage'],
            'defaultimage' => $this->_options['defaultimage'],
            'size' => 200,
            'rounded' => $this->_options['rounded'],
            'component' => $this->_options['component'],
            'contextid' => $this->_options['contextid'],
            'filearea' => $this->_options['filearea'],
            'draftitemid' => $draftitemid,
            'formelements' => ['name' => $elname, 'id' => $id, 'value' => $draftitemid]
        ];
        $editable = new \core\output\image_editable($data);
        return $OUTPUT->render($editable);
    }

    /**
     * export uploaded file
     *
     * @param array $submitValues values submitted.
     * @param bool $assoc specifies if returned array is associative
     * @return array
     */
    function exportValue(&$submitValues, $assoc = false) {

        $draftitemid = $this->_findValue($submitValues);
        if (null === $draftitemid) {
            $draftitemid = $this->getValue();
        }

        return $this->_prepareValue($draftitemid, true);
    }

    /**
     * Check that the file has the allowed type.
     *
     * @param array $value Draft item id with the uploaded files.
     * @return string|null Validation error message or null.
     */
    public function validateSubmitValue($value) {

        $draftfiles = file_get_drafarea_files($value);
        $wrongfiles = array();

        if (empty($draftfiles)) {
            // No file uploaded, nothing to check here.
            return 'no draftfiles';
        }

        return;
    }

}
