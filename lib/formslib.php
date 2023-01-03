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
 * formslib.php - library of classes for creating forms in Moodle, based on PEAR QuickForms.
 *
 * To use formslib then you will want to create a new file purpose_form.php eg. edit_form.php
 * and you want to name your class something like {modulename}_{purpose}_form. Your class will
 * extend moodleform overriding abstract classes definition and optionally defintion_after_data
 * and validation.
 *
 * See examples of use of this library in course/edit.php and course/edit_form.php
 *
 * A few notes :
 *      form definition is used for both printing of form and processing and should be the same
 *              for both or you may lose some submitted data which won't be let through.
 *      you should be using setType for every form element except select, radio or checkbox
 *              elements, these elements clean themselves.
 *
 * @package   core_form
 * @copyright 2006 Jamie Pratt <me@jamiep.org>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/** setup.php includes our hacked pear libs first */
require_once 'HTML/QuickForm.php';
require_once 'HTML/QuickForm/DHTMLRulesTableless.php';
require_once 'HTML/QuickForm/Renderer/Tableless.php';
require_once 'HTML/QuickForm/Rule.php';

require_once $CFG->libdir.'/filelib.php';

/**
 * EDITOR_UNLIMITED_FILES - hard-coded value for the 'maxfiles' option
 */
define('EDITOR_UNLIMITED_FILES', -1);

/**
 * Callback called when PEAR throws an error
 *
 * @param PEAR_Error $error
 */
function pear_handle_error($error){
    echo '<strong>'.$error->GetMessage().'</strong> '.$error->getUserInfo();
    echo '<br /> <strong>Backtrace </strong>:';
    print_object($error->backtrace);
}

if ($CFG->debugdeveloper) {
    //TODO: this is a wrong place to init PEAR!
    $GLOBALS['_PEAR_default_error_mode'] = PEAR_ERROR_CALLBACK;
    $GLOBALS['_PEAR_default_error_options'] = 'pear_handle_error';
}

/**
 * Initalize javascript for date type form element
 *
 * @staticvar bool $done make sure it gets initalize once.
 * @global moodle_page $PAGE
 */
function form_init_date_js() {
    global $PAGE;
    static $done = false;
    if (!$done) {
        $done = true;
        $calendar = \core_calendar\type_factory::get_calendar_instance();
        if ($calendar->get_name() !== 'gregorian') {
            // The YUI2 calendar only supports the gregorian calendar type.
            return;
        }
        $module   = 'moodle-form-dateselector';
        $function = 'M.form.dateselector.init_date_selectors';
        $defaulttimezone = date_default_timezone_get();

        $config = array(array(
            'firstdayofweek'    => $calendar->get_starting_weekday(),
            'mon'               => date_format_string(strtotime("Monday"), '%a', $defaulttimezone),
            'tue'               => date_format_string(strtotime("Tuesday"), '%a', $defaulttimezone),
            'wed'               => date_format_string(strtotime("Wednesday"), '%a', $defaulttimezone),
            'thu'               => date_format_string(strtotime("Thursday"), '%a', $defaulttimezone),
            'fri'               => date_format_string(strtotime("Friday"), '%a', $defaulttimezone),
            'sat'               => date_format_string(strtotime("Saturday"), '%a', $defaulttimezone),
            'sun'               => date_format_string(strtotime("Sunday"), '%a', $defaulttimezone),
            'january'           => date_format_string(strtotime("January 1"), '%B', $defaulttimezone),
            'february'          => date_format_string(strtotime("February 1"), '%B', $defaulttimezone),
            'march'             => date_format_string(strtotime("March 1"), '%B', $defaulttimezone),
            'april'             => date_format_string(strtotime("April 1"), '%B', $defaulttimezone),
            'may'               => date_format_string(strtotime("May 1"), '%B', $defaulttimezone),
            'june'              => date_format_string(strtotime("June 1"), '%B', $defaulttimezone),
            'july'              => date_format_string(strtotime("July 1"), '%B', $defaulttimezone),
            'august'            => date_format_string(strtotime("August 1"), '%B', $defaulttimezone),
            'september'         => date_format_string(strtotime("September 1"), '%B', $defaulttimezone),
            'october'           => date_format_string(strtotime("October 1"), '%B', $defaulttimezone),
            'november'          => date_format_string(strtotime("November 1"), '%B', $defaulttimezone),
            'december'          => date_format_string(strtotime("December 1"), '%B', $defaulttimezone)
        ));
        $PAGE->requires->yui_module($module, $function, $config);
    }
}

class_alias(\core_form\moodleform::class, 'moodleform');
class_alias(\core_form\quickform::class, 'MoodleQuickForm');
class_alias(\core_form\quickform_renderer::class, 'MoodleQuickForm_Renderer');
class_alias(\core_form\required_rule::class, 'MoodleQuickForm_Rule_Required');

/**
 * @global object $GLOBALS['_HTML_QuickForm_default_renderer']
 * @name $_HTML_QuickForm_default_renderer
 */
$GLOBALS['_HTML_QuickForm_default_renderer'] = new MoodleQuickForm_Renderer();
\core_form\quickform::registerStandardElements();
