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

namespace core_form;

use HTML_QuickForm_Rule;

/**
 * Required elements validation
 *
 * This class overrides QuickForm validation since it allowed space or empty tag as a value
 *
 * @package   core_form
 * @category  form
 * @copyright 2006 Jamie Pratt <me@jamiep.org>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class required_rule extends HTML_QuickForm_Rule {
    /**
     * Checks if an element is not empty.
     * This is a server-side validation, it works for both text fields and editor fields
     *
     * @param string $value Value to check
     * @param int|string|array $options Not used yet
     * @return bool true if value is not empty
     */
    function validate($value, $options = null) {
        global $CFG;
        if (is_array($value) && array_key_exists('text', $value)) {
            $value = $value['text'];
        }
        if (is_array($value)) {
            // nasty guess - there has to be something in the array, hopefully nobody invents arrays in arrays
            $value = implode('', $value);
        }
        $stripvalues = array(
            '#</?(?!img|canvas|hr).*?>#im', // all tags except img, canvas and hr
            '#(\xc2\xa0|\s|&nbsp;)#', // Any whitespaces actually.
        );
        if (!empty($CFG->strictformsrequired)) {
            $value = preg_replace($stripvalues, '', (string)$value);
        }
        if ((string)$value == '') {
            return false;
        }
        return true;
    }

    /**
     * This function returns Javascript code used to build client-side validation.
     * It checks if an element is not empty.
     *
     * @param int $format format of data which needs to be validated.
     * @return array
     */
    function getValidationScript($format = null) {
        global $CFG;
        if (!empty($CFG->strictformsrequired)) {
            if (!empty($format) && $format == FORMAT_HTML) {
                return array('', "{jsVar}.replace(/(<(?!img|hr|canvas)[^>]*>)|&nbsp;|\s+/ig, '') == ''");
            } else {
                return array('', "{jsVar}.replace(/^\s+$/g, '') == ''");
            }
        } else {
            return array('', "{jsVar} == ''");
        }
    }
}
