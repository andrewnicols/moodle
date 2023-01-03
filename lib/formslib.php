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

/**
 * MoodleQuickForm renderer
 *
 * A renderer for MoodleQuickForm that only uses XHTML and CSS and no
 * table tags, extends PEAR class HTML_QuickForm_Renderer_Tableless
 *
 * Stylesheet is part of standard theme and should be automatically included.
 *
 * @package   core_form
 * @copyright 2007 Jamie Pratt <me@jamiep.org>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class MoodleQuickForm_Renderer extends HTML_QuickForm_Renderer_Tableless{

    /** @var array Element template array */
    var $_elementTemplates;

    /**
     * Template used when opening a hidden fieldset
     * (i.e. a fieldset that is opened when there is no header element)
     * @var string
     */
    var $_openHiddenFieldsetTemplate = "\n\t<fieldset class=\"hidden\"><div>";

    /** @var string Template used when opening a fieldset */
    var $_openFieldsetTemplate = "\n\t<fieldset class=\"{classes}\" {id}>";

    /** @var string Template used when closing a fieldset */
    var $_closeFieldsetTemplate = "\n\t\t</div></fieldset>";

    /** @var string Required Note template string */
    var $_requiredNoteTemplate =
        "\n\t\t<div class=\"fdescription required\">{requiredNote}</div>";

    /**
     * Collapsible buttons string template.
     *
     * Note that the <span> will be converted as a link. This is done so that the link is not yet clickable
     * until the Javascript has been fully loaded.
     *
     * @var string
     */
    var $_collapseButtonsTemplate =
        "\n\t<div class=\"collapsible-actions\"><span class=\"collapseexpand\">{strexpandall}</span></div>";

    /**
     * Array whose keys are element names. If the key exists this is a advanced element
     *
     * @var array
     */
    var $_advancedElements = array();

    /**
     * Array whose keys are element names and the the boolean values reflect the current state. If the key exists this is a collapsible element.
     *
     * @var array
     */
    var $_collapsibleElements = array();

    /**
     * @var string Contains the collapsible buttons to add to the form.
     */
    var $_collapseButtons = '';

    /**
     * Constructor
     */
    public function __construct() {
        // switch next two lines for ol li containers for form items.
        //        $this->_elementTemplates=array('default'=>"\n\t\t".'<li class="fitem"><label>{label}{help}<!-- BEGIN required -->{req}<!-- END required --></label><div class="qfelement<!-- BEGIN error --> error<!-- END error --> {typeclass}"><!-- BEGIN error --><span class="error">{error}</span><br /><!-- END error -->{element}</div></li>');
        $this->_elementTemplates = array(
        'default' => "\n\t\t".'<div id="{id}" class="fitem {advanced}<!-- BEGIN required --> required<!-- END required --> fitem_{typeclass} {emptylabel} {class}" {aria-live} {groupname}><div class="fitemtitle"><label>{label}<!-- BEGIN required -->{req}<!-- END required -->{advancedimg} </label>{help}</div><div class="felement {typeclass}<!-- BEGIN error --> error<!-- END error -->" data-fieldtype="{type}"><!-- BEGIN error --><span class="error" tabindex="0">{error}</span><br /><!-- END error -->{element}</div></div>',

        'actionbuttons' => "\n\t\t".'<div id="{id}" class="fitem fitem_actionbuttons fitem_{typeclass} {class}" {groupname}><div class="felement {typeclass}" data-fieldtype="{type}">{element}</div></div>',

        'fieldset' => "\n\t\t".'<div id="{id}" class="fitem {advanced} {class}<!-- BEGIN required --> required<!-- END required --> fitem_{typeclass} {emptylabel}" {groupname}><div class="fitemtitle"><div class="fgrouplabel"><label>{label}<!-- BEGIN required -->{req}<!-- END required -->{advancedimg} </label>{help}</div></div><fieldset class="felement {typeclass}<!-- BEGIN error --> error<!-- END error -->" data-fieldtype="{type}"><!-- BEGIN error --><span class="error" tabindex="0">{error}</span><br /><!-- END error -->{element}</fieldset></div>',

        'static' => "\n\t\t".'<div id="{id}" class="fitem {advanced} {emptylabel} {class}" {groupname}><div class="fitemtitle"><div class="fstaticlabel">{label}<!-- BEGIN required -->{req}<!-- END required -->{advancedimg} {help}</div></div><div class="felement fstatic <!-- BEGIN error --> error<!-- END error -->" data-fieldtype="static"><!-- BEGIN error --><span class="error" tabindex="0">{error}</span><br /><!-- END error -->{element}</div></div>',

        'warning' => "\n\t\t".'<div id="{id}" class="fitem {advanced} {emptylabel} {class}">{element}</div>',

        'nodisplay' => '');

        parent::__construct();
    }

    /**
     * Old syntax of class constructor. Deprecated in PHP7.
     *
     * @deprecated since Moodle 3.1
     */
    public function MoodleQuickForm_Renderer() {
        debugging('Use of class name as constructor is deprecated', DEBUG_DEVELOPER);
        self::__construct();
    }

    /**
     * Set element's as adavance element
     *
     * @param array $elements form elements which needs to be grouped as advance elements.
     */
    function setAdvancedElements($elements){
        $this->_advancedElements = $elements;
    }

    /**
     * Setting collapsible elements
     *
     * @param array $elements
     */
    function setCollapsibleElements($elements) {
        $this->_collapsibleElements = $elements;
    }

    /**
     * What to do when starting the form
     *
     * @param MoodleQuickForm $form reference of the form
     */
    function startForm(&$form){
        global $PAGE, $OUTPUT;
        $this->_reqHTML = $form->getReqHTML();
        $this->_elementTemplates = str_replace('{req}', $this->_reqHTML, $this->_elementTemplates);
        $this->_advancedHTML = $form->getAdvancedHTML();
        $this->_collapseButtons = '';
        $formid = $form->getAttribute('id');
        parent::startForm($form);
        if ($form->isFrozen()){
            $this->_formTemplate = "\n<div id=\"$formid\" class=\"mform frozen\">\n{collapsebtns}\n{content}\n</div>";
        } else {
            $this->_formTemplate = "\n<form{attributes}>\n\t<div style=\"display: none;\">{hidden}</div>\n{collapsebtns}\n{content}\n</form>";
            $this->_hiddenHtml .= $form->_pageparams;
        }

        if ($form->is_form_change_checker_enabled()) {
            $PAGE->requires->js_call_amd('core_form/changechecker', 'watchFormById', [$formid]);
            if ($form->is_dirty()) {
                $PAGE->requires->js_call_amd('core_form/changechecker', 'markFormAsDirtyById', [$formid]);
            }
        }
        if (!empty($this->_collapsibleElements)) {
            if (count($this->_collapsibleElements) > 1) {
                $this->_collapseButtons = $OUTPUT->render_from_template('core_form/collapsesections', (object)[]);
            }
            $PAGE->requires->yui_module('moodle-form-shortforms', 'M.form.shortforms', array(array('formid' => $formid)));
        }
        if (!empty($this->_advancedElements)){
            $PAGE->requires->js_call_amd('core_form/showadvanced', 'init', [$formid]);
        }
    }

    /**
     * Create advance group of elements
     *
     * @param MoodleQuickForm_group $group Passed by reference
     * @param bool $required if input is required field
     * @param string $error error message to display
     */
    function startGroup(&$group, $required, $error){
        global $OUTPUT;

        // Make sure the element has an id.
        $group->_generateId();

        // Prepend 'fgroup_' to the ID we generated.
        $groupid = 'fgroup_' . $group->getAttribute('id');

        // Update the ID.
        $group->updateAttributes(array('id' => $groupid));
        $advanced = isset($this->_advancedElements[$group->getName()]);

        $html = $OUTPUT->mform_element($group, $required, $advanced, $error, false);
        $fromtemplate = !empty($html);
        if (!$fromtemplate) {
            if (method_exists($group, 'getElementTemplateType')) {
                $html = $this->_elementTemplates[$group->getElementTemplateType()];
            } else {
                $html = $this->_elementTemplates['default'];
            }

            if (isset($this->_advancedElements[$group->getName()])) {
                $html = str_replace(' {advanced}', ' advanced', $html);
                $html = str_replace('{advancedimg}', $this->_advancedHTML, $html);
            } else {
                $html = str_replace(' {advanced}', '', $html);
                $html = str_replace('{advancedimg}', '', $html);
            }
            if (method_exists($group, 'getHelpButton')) {
                $html = str_replace('{help}', $group->getHelpButton(), $html);
            } else {
                $html = str_replace('{help}', '', $html);
            }
            $html = str_replace('{id}', $group->getAttribute('id'), $html);
            $html = str_replace('{name}', $group->getName(), $html);
            $html = str_replace('{groupname}', 'data-groupname="'.$group->getName().'"', $html);
            $html = str_replace('{typeclass}', 'fgroup', $html);
            $html = str_replace('{type}', 'group', $html);
            $html = str_replace('{class}', $group->getAttribute('class'), $html);
            $emptylabel = '';
            if ($group->getLabel() == '') {
                $emptylabel = 'femptylabel';
            }
            $html = str_replace('{emptylabel}', $emptylabel, $html);
        }
        $this->_templates[$group->getName()] = $html;
        // Fix for bug in tableless quickforms that didn't allow you to stop a
        // fieldset before a group of elements.
        // if the element name indicates the end of a fieldset, close the fieldset
        if (in_array($group->getName(), $this->_stopFieldsetElements) && $this->_fieldsetsOpen > 0) {
            $this->_html .= $this->_closeFieldsetTemplate;
            $this->_fieldsetsOpen--;
        }
        if (!$fromtemplate) {
            parent::startGroup($group, $required, $error);
        } else {
            $this->_html .= $html;
        }
    }

    /**
     * Renders element
     *
     * @param HTML_QuickForm_element $element element
     * @param bool $required if input is required field
     * @param string $error error message to display
     */
    function renderElement(&$element, $required, $error){
        global $OUTPUT;

        // Make sure the element has an id.
        $element->_generateId();
        $advanced = isset($this->_advancedElements[$element->getName()]);

        $html = $OUTPUT->mform_element($element, $required, $advanced, $error, false);
        $fromtemplate = !empty($html);
        if (!$fromtemplate) {
            // Adding stuff to place holders in template
            // check if this is a group element first.
            if (($this->_inGroup) and !empty($this->_groupElementTemplate)) {
                // So it gets substitutions for *each* element.
                $html = $this->_groupElementTemplate;
            } else if (method_exists($element, 'getElementTemplateType')) {
                $html = $this->_elementTemplates[$element->getElementTemplateType()];
            } else {
                $html = $this->_elementTemplates['default'];
            }
            if (isset($this->_advancedElements[$element->getName()])) {
                $html = str_replace(' {advanced}', ' advanced', $html);
                $html = str_replace(' {aria-live}', ' aria-live="polite"', $html);
            } else {
                $html = str_replace(' {advanced}', '', $html);
                $html = str_replace(' {aria-live}', '', $html);
            }
            if (isset($this->_advancedElements[$element->getName()]) || $element->getName() == 'mform_showadvanced') {
                $html = str_replace('{advancedimg}', $this->_advancedHTML, $html);
            } else {
                $html = str_replace('{advancedimg}', '', $html);
            }
            $html = str_replace('{id}', 'fitem_' . $element->getAttribute('id'), $html);
            $html = str_replace('{typeclass}', 'f' . $element->getType(), $html);
            $html = str_replace('{type}', $element->getType(), $html);
            $html = str_replace('{name}', $element->getName(), $html);
            $html = str_replace('{groupname}', '', $html);
            $html = str_replace('{class}', $element->getAttribute('class'), $html);
            $emptylabel = '';
            if ($element->getLabel() == '') {
                $emptylabel = 'femptylabel';
            }
            $html = str_replace('{emptylabel}', $emptylabel, $html);
            if (method_exists($element, 'getHelpButton')) {
                $html = str_replace('{help}', $element->getHelpButton(), $html);
            } else {
                $html = str_replace('{help}', '', $html);
            }
        } else {
            if ($this->_inGroup) {
                $this->_groupElementTemplate = $html;
            }
        }
        if (($this->_inGroup) and !empty($this->_groupElementTemplate)) {
            $this->_groupElementTemplate = $html;
        } else if (!isset($this->_templates[$element->getName()])) {
            $this->_templates[$element->getName()] = $html;
        }

        if (!$fromtemplate) {
            parent::renderElement($element, $required, $error);
        } else {
            if (in_array($element->getName(), $this->_stopFieldsetElements) && $this->_fieldsetsOpen > 0) {
                $this->_html .= $this->_closeFieldsetTemplate;
                $this->_fieldsetsOpen--;
            }
            $this->_html .= $html;
        }
    }

    /**
     * Called when visiting a form, after processing all form elements
     * Adds required note, form attributes, validation javascript and form content.
     *
     * @global moodle_page $PAGE
     * @param moodleform $form Passed by reference
     */
    function finishForm(&$form){
        global $PAGE;
        if ($form->isFrozen()){
            $this->_hiddenHtml = '';
        }
        parent::finishForm($form);
        $this->_html = str_replace('{collapsebtns}', $this->_collapseButtons, $this->_html);
        if (!$form->isFrozen()) {
            $args = $form->getLockOptionObject();
            if (count($args[1]) > 0) {
                $PAGE->requires->js_init_call('M.form.initFormDependencies', $args, true, moodleform::get_js_module());
            }
        }
    }
   /**
    * Called when visiting a header element
    *
    * @param HTML_QuickForm_header $header An HTML_QuickForm_header element being visited
    * @global moodle_page $PAGE
    */
    function renderHeader(&$header) {
        global $PAGE, $OUTPUT;

        $header->_generateId();
        $name = $header->getName();

        $collapsed = $collapseable = '';
        if (isset($this->_collapsibleElements[$header->getName()])) {
            $collapseable = true;
            $collapsed = $this->_collapsibleElements[$header->getName()];
        }

        $id = empty($name) ? '' : ' id="' . $header->getAttribute('id') . '"';
        if (!empty($name) && isset($this->_templates[$name])) {
            $headerhtml = str_replace('{header}', $header->toHtml(), $this->_templates[$name]);
        } else {
            $headerhtml = $OUTPUT->render_from_template('core_form/element-header',
                (object)[
                    'header' => $header->toHtml(),
                    'id' => $header->getAttribute('id'),
                    'collapseable' => $collapseable,
                    'collapsed' => $collapsed,
                    'helpbutton' => $header->getHelpButton(),
                ]);
        }

        if ($this->_fieldsetsOpen > 0) {
            $this->_html .= $this->_closeFieldsetTemplate;
            $this->_fieldsetsOpen--;
        }

        // Define collapsible classes for fieldsets.
        $arialive = '';
        $fieldsetclasses = array('clearfix');
        if (isset($this->_collapsibleElements[$header->getName()])) {
            $fieldsetclasses[] = 'collapsible';
            if ($this->_collapsibleElements[$header->getName()]) {
                $fieldsetclasses[] = 'collapsed';
            }
        }

        if (isset($this->_advancedElements[$name])){
            $fieldsetclasses[] = 'containsadvancedelements';
        }

        $openFieldsetTemplate = str_replace('{id}', $id, $this->_openFieldsetTemplate);
        $openFieldsetTemplate = str_replace('{classes}', join(' ', $fieldsetclasses), $openFieldsetTemplate);

        $this->_html .= $openFieldsetTemplate . $headerhtml;
        $this->_fieldsetsOpen++;
    }

    /**
     * Return Array of element names that indicate the end of a fieldset
     *
     * @return array
     */
    function getStopFieldsetElements(){
        return $this->_stopFieldsetElements;
    }
}

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
class MoodleQuickForm_Rule_Required extends HTML_QuickForm_Rule {
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

/**
 * @global object $GLOBALS['_HTML_QuickForm_default_renderer']
 * @name $_HTML_QuickForm_default_renderer
 */
$GLOBALS['_HTML_QuickForm_default_renderer'] = new MoodleQuickForm_Renderer();

/** Please keep this list in alphabetical order. */
MoodleQuickForm::registerElementType('advcheckbox', "$CFG->libdir/form/advcheckbox.php", 'MoodleQuickForm_advcheckbox');
MoodleQuickForm::registerElementType('autocomplete', "$CFG->libdir/form/autocomplete.php", 'MoodleQuickForm_autocomplete');
MoodleQuickForm::registerElementType('button', "$CFG->libdir/form/button.php", 'MoodleQuickForm_button');
MoodleQuickForm::registerElementType('cancel', "$CFG->libdir/form/cancel.php", 'MoodleQuickForm_cancel');
MoodleQuickForm::registerElementType('course', "$CFG->libdir/form/course.php", 'MoodleQuickForm_course');
MoodleQuickForm::registerElementType('cohort', "$CFG->libdir/form/cohort.php", 'MoodleQuickForm_cohort');
MoodleQuickForm::registerElementType('searchableselector', "$CFG->libdir/form/searchableselector.php", 'MoodleQuickForm_searchableselector');
MoodleQuickForm::registerElementType('checkbox', "$CFG->libdir/form/checkbox.php", 'MoodleQuickForm_checkbox');
MoodleQuickForm::registerElementType('date_selector', "$CFG->libdir/form/dateselector.php", 'MoodleQuickForm_date_selector');
MoodleQuickForm::registerElementType('date_time_selector', "$CFG->libdir/form/datetimeselector.php", 'MoodleQuickForm_date_time_selector');
MoodleQuickForm::registerElementType('duration', "$CFG->libdir/form/duration.php", 'MoodleQuickForm_duration');
MoodleQuickForm::registerElementType('editor', "$CFG->libdir/form/editor.php", 'MoodleQuickForm_editor');
MoodleQuickForm::registerElementType('filemanager', "$CFG->libdir/form/filemanager.php", 'MoodleQuickForm_filemanager');
MoodleQuickForm::registerElementType('filepicker', "$CFG->libdir/form/filepicker.php", 'MoodleQuickForm_filepicker');
MoodleQuickForm::registerElementType('filetypes', "$CFG->libdir/form/filetypes.php", 'MoodleQuickForm_filetypes');
MoodleQuickForm::registerElementType('float', "$CFG->libdir/form/float.php", 'MoodleQuickForm_float');
MoodleQuickForm::registerElementType('grading', "$CFG->libdir/form/grading.php", 'MoodleQuickForm_grading');
MoodleQuickForm::registerElementType('group', "$CFG->libdir/form/group.php", 'MoodleQuickForm_group');
MoodleQuickForm::registerElementType('header', "$CFG->libdir/form/header.php", 'MoodleQuickForm_header');
MoodleQuickForm::registerElementType('hidden', "$CFG->libdir/form/hidden.php", 'MoodleQuickForm_hidden');
MoodleQuickForm::registerElementType('listing', "$CFG->libdir/form/listing.php", 'MoodleQuickForm_listing');
MoodleQuickForm::registerElementType('defaultcustom', "$CFG->libdir/form/defaultcustom.php", 'MoodleQuickForm_defaultcustom');
MoodleQuickForm::registerElementType('modgrade', "$CFG->libdir/form/modgrade.php", 'MoodleQuickForm_modgrade');
MoodleQuickForm::registerElementType('modvisible', "$CFG->libdir/form/modvisible.php", 'MoodleQuickForm_modvisible');
MoodleQuickForm::registerElementType('password', "$CFG->libdir/form/password.php", 'MoodleQuickForm_password');
MoodleQuickForm::registerElementType('passwordunmask', "$CFG->libdir/form/passwordunmask.php", 'MoodleQuickForm_passwordunmask');
MoodleQuickForm::registerElementType('questioncategory', "$CFG->libdir/form/questioncategory.php", 'MoodleQuickForm_questioncategory');
MoodleQuickForm::registerElementType('radio', "$CFG->libdir/form/radio.php", 'MoodleQuickForm_radio');
MoodleQuickForm::registerElementType('recaptcha', "$CFG->libdir/form/recaptcha.php", 'MoodleQuickForm_recaptcha');
MoodleQuickForm::registerElementType('select', "$CFG->libdir/form/select.php", 'MoodleQuickForm_select');
MoodleQuickForm::registerElementType('selectgroups', "$CFG->libdir/form/selectgroups.php", 'MoodleQuickForm_selectgroups');
MoodleQuickForm::registerElementType('selectwithlink', "$CFG->libdir/form/selectwithlink.php", 'MoodleQuickForm_selectwithlink');
MoodleQuickForm::registerElementType('selectyesno', "$CFG->libdir/form/selectyesno.php", 'MoodleQuickForm_selectyesno');
MoodleQuickForm::registerElementType('static', "$CFG->libdir/form/static.php", 'MoodleQuickForm_static');
MoodleQuickForm::registerElementType('submit', "$CFG->libdir/form/submit.php", 'MoodleQuickForm_submit');
MoodleQuickForm::registerElementType('tags', "$CFG->libdir/form/tags.php", 'MoodleQuickForm_tags');
MoodleQuickForm::registerElementType('text', "$CFG->libdir/form/text.php", 'MoodleQuickForm_text');
MoodleQuickForm::registerElementType('textarea', "$CFG->libdir/form/textarea.php", 'MoodleQuickForm_textarea');
MoodleQuickForm::registerElementType('url', "$CFG->libdir/form/url.php", 'MoodleQuickForm_url');
MoodleQuickForm::registerElementType('warning', "$CFG->libdir/form/warning.php", 'MoodleQuickForm_warning');

MoodleQuickForm::registerRule('required', null, 'MoodleQuickForm_Rule_Required', "$CFG->libdir/formslib.php");
