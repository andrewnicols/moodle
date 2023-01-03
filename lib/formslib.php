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

/**
 * MoodleQuickForm implementation
 *
 * You never extend this class directly. The class methods of this class are available from
 * the private $this->_form property on moodleform and its children. You generally only
 * call methods on this class from within abstract methods that you override on moodleform such
 * as definition and definition_after_data
 *
 * @package   core_form
 * @category  form
 * @copyright 2006 Jamie Pratt <me@jamiep.org>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class MoodleQuickForm extends HTML_QuickForm_DHTMLRulesTableless {
    /** @var array type (PARAM_INT, PARAM_TEXT etc) of element value */
    var $_types = array();

    /** @var array dependent state for the element/'s */
    var $_dependencies = array();

    /**
     * @var array elements that will become hidden based on another element
     */
    protected $_hideifs = array();

    /** @var array Array of buttons that if pressed do not result in the processing of the form. */
    var $_noSubmitButtons=array();

    /** @var array Array of buttons that if pressed do not result in the processing of the form. */
    var $_cancelButtons=array();

    /** @var array Array whose keys are element names. If the key exists this is a advanced element */
    var $_advancedElements = array();

    /**
     * Array whose keys are element names and values are the desired collapsible state.
     * True for collapsed, False for expanded. If not present, set to default in
     * {@link self::accept()}.
     *
     * @var array
     */
    var $_collapsibleElements = array();

    /**
     * Whether to enable shortforms for this form
     *
     * @var boolean
     */
    var $_disableShortforms = false;

    /** @var bool whether to automatically initialise the form change detector this form. */
    protected $_use_form_change_checker = true;

    /**
     * The initial state of the dirty state.
     *
     * @var bool
     */
    protected $_initial_form_dirty_state = false;

    /**
     * The form name is derived from the class name of the wrapper minus the trailing form
     * It is a name with words joined by underscores whereas the id attribute is words joined by underscores.
     * @var string
     */
    var $_formName = '';

    /**
     * String with the html for hidden params passed in as part of a moodle_url
     * object for the action. Output in the form.
     * @var string
     */
    var $_pageparams = '';

    /** @var array names of new repeating elements that should not expect to find submitted data */
    protected $_newrepeats = array();

    /** @var array $_ajaxformdata submitted form data when using mforms with ajax */
    protected $_ajaxformdata;

    /**
     * Whether the form contains any client-side validation or not.
     * @var bool
     */
    protected $clientvalidation = false;

    /**
     * Is this a 'disableIf' dependency ?
     */
    const DEP_DISABLE = 0;

    /**
     * Is this a 'hideIf' dependency?
     */
    const DEP_HIDE = 1;

    /**
     * Class constructor - same parameters as HTML_QuickForm_DHTMLRulesTableless
     *
     * @staticvar int $formcounter counts number of forms
     * @param string $formName Form's name.
     * @param string $method Form's method defaults to 'POST'
     * @param string|moodle_url $action Form's action
     * @param string $target (optional)Form's target defaults to none
     * @param mixed $attributes (optional)Extra attributes for <form> tag
     * @param array $ajaxformdata Forms submitted via ajax, must pass their data here, instead of relying on _GET and _POST.
     */
    public function __construct($formName, $method, $action, $target = '', $attributes = null, $ajaxformdata = null) {
        global $CFG, $OUTPUT;

        static $formcounter = 1;

        // TODO MDL-52313 Replace with the call to parent::__construct().
        HTML_Common::__construct($attributes);
        $target = empty($target) ? array() : array('target' => $target);
        $this->_formName = $formName;
        if (is_a($action, 'moodle_url')){
            $this->_pageparams = html_writer::input_hidden_params($action);
            $action = $action->out_omit_querystring();
        } else {
            $this->_pageparams = '';
        }
        // No 'name' atttribute for form in xhtml strict :
        $attributes = array('action' => $action, 'method' => $method, 'accept-charset' => 'utf-8') + $target;
        if (is_null($this->getAttribute('id'))) {
            // Append a random id, forms can be loaded in different requests using Fragments API.
            $attributes['id'] = 'mform' . $formcounter . '_' . random_string();
        }
        $formcounter++;
        $this->updateAttributes($attributes);

        // This is custom stuff for Moodle :
        $this->_ajaxformdata = $ajaxformdata;
        $oldclass=   $this->getAttribute('class');
        if (!empty($oldclass)){
            $this->updateAttributes(array('class'=>$oldclass.' mform'));
        }else {
            $this->updateAttributes(array('class'=>'mform'));
        }
        $this->_reqHTML = '<span class="req">' . $OUTPUT->pix_icon('req', get_string('requiredelement', 'form')) . '</span>';
        $this->_advancedHTML = '<span class="adv">' . $OUTPUT->pix_icon('adv', get_string('advancedelement', 'form')) . '</span>';
        $this->setRequiredNote(get_string('somefieldsrequired', 'form', $OUTPUT->pix_icon('req', get_string('requiredelement', 'form'))));
    }

    /**
     * Old syntax of class constructor. Deprecated in PHP7.
     *
     * @deprecated since Moodle 3.1
     */
    public function MoodleQuickForm($formName, $method, $action, $target='', $attributes=null) {
        debugging('Use of class name as constructor is deprecated', DEBUG_DEVELOPER);
        self::__construct($formName, $method, $action, $target, $attributes);
    }

    /**
     * Use this method to indicate an element in a form is an advanced field. If items in a form
     * are marked as advanced then 'Hide/Show Advanced' buttons will automatically be displayed in the
     * form so the user can decide whether to display advanced form controls.
     *
     * If you set a header element to advanced then all elements it contains will also be set as advanced.
     *
     * @param string $elementName group or element name (not the element name of something inside a group).
     * @param bool $advanced default true sets the element to advanced. False removes advanced mark.
     */
    function setAdvanced($elementName, $advanced = true) {
        if ($advanced){
            $this->_advancedElements[$elementName]='';
        } elseif (isset($this->_advancedElements[$elementName])) {
            unset($this->_advancedElements[$elementName]);
        }
    }

    /**
     * Checks if a parameter was passed in the previous form submission
     *
     * @param string $name the name of the page parameter we want
     * @param mixed  $default the default value to return if nothing is found
     * @param string $type expected type of parameter
     * @return mixed
     */
    public function optional_param($name, $default, $type) {
        if (isset($this->_ajaxformdata[$name])) {
            return clean_param($this->_ajaxformdata[$name], $type);
        } else {
            return optional_param($name, $default, $type);
        }
    }

    /**
     * Use this method to indicate that the fieldset should be shown as expanded.
     * The method is applicable to header elements only.
     *
     * @param string $headername header element name
     * @param boolean $expanded default true sets the element to expanded. False makes the element collapsed.
     * @param boolean $ignoreuserstate override the state regardless of the state it was on when
     *                                 the form was submitted.
     * @return void
     */
    function setExpanded($headername, $expanded = true, $ignoreuserstate = false) {
        if (empty($headername)) {
            return;
        }
        $element = $this->getElement($headername);
        if ($element->getType() != 'header') {
            debugging('Cannot use setExpanded on non-header elements', DEBUG_DEVELOPER);
            return;
        }
        if (!$headerid = $element->getAttribute('id')) {
            $element->_generateId();
            $headerid = $element->getAttribute('id');
        }
        if ($this->getElementType('mform_isexpanded_' . $headerid) === false) {
            // See if the form has been submitted already.
            $formexpanded = $this->optional_param('mform_isexpanded_' . $headerid, -1, PARAM_INT);
            if (!$ignoreuserstate && $formexpanded != -1) {
                // Override expanded state with the form variable.
                $expanded = $formexpanded;
            }
            // Create the form element for storing expanded state.
            $this->addElement('hidden', 'mform_isexpanded_' . $headerid);
            $this->setType('mform_isexpanded_' . $headerid, PARAM_INT);
            $this->setConstant('mform_isexpanded_' . $headerid, (int) $expanded);
        }
        $this->_collapsibleElements[$headername] = !$expanded;
    }

    /**
     * Use this method to add show more/less status element required for passing
     * over the advanced elements visibility status on the form submission.
     *
     * @param string $headerName header element name.
     * @param boolean $showmore default false sets the advanced elements to be hidden.
     */
    function addAdvancedStatusElement($headerid, $showmore=false){
        // Add extra hidden element to store advanced items state for each section.
        if ($this->getElementType('mform_showmore_' . $headerid) === false) {
            // See if we the form has been submitted already.
            $formshowmore = $this->optional_param('mform_showmore_' . $headerid, -1, PARAM_INT);
            if (!$showmore && $formshowmore != -1) {
                // Override showmore state with the form variable.
                $showmore = $formshowmore;
            }
            // Create the form element for storing advanced items state.
            $this->addElement('hidden', 'mform_showmore_' . $headerid);
            $this->setType('mform_showmore_' . $headerid, PARAM_INT);
            $this->setConstant('mform_showmore_' . $headerid, (int)$showmore);
        }
    }

    /**
     * This function has been deprecated. Show advanced has been replaced by
     * "Show more.../Show less..." in the shortforms javascript module.
     *
     * @deprecated since Moodle 2.5
     * @param bool $showadvancedNow if true will show advanced elements.
      */
    function setShowAdvanced($showadvancedNow = null){
        debugging('Call to deprecated function setShowAdvanced. See "Show more.../Show less..." in shortforms yui module.');
    }

    /**
     * This function has been deprecated. Show advanced has been replaced by
     * "Show more.../Show less..." in the shortforms javascript module.
     *
     * @deprecated since Moodle 2.5
     * @return bool (Always false)
      */
    function getShowAdvanced(){
        debugging('Call to deprecated function setShowAdvanced. See "Show more.../Show less..." in shortforms yui module.');
        return false;
    }

    /**
     * Use this method to indicate that the form will not be using shortforms.
     *
     * @param boolean $disable default true, controls if the shortforms are disabled.
     */
    function setDisableShortforms ($disable = true) {
        $this->_disableShortforms = $disable;
    }

    /**
     * Set the initial 'dirty' state of the form.
     *
     * @param bool $state
     * @since Moodle 3.7.1
     */
    public function set_initial_dirty_state($state = false) {
        $this->_initial_form_dirty_state = $state;
    }

    /**
     * Is the form currently set to dirty?
     *
     * @return boolean Initial dirty state.
     * @since Moodle 3.7.1
     */
    public function is_dirty() {
        return $this->_initial_form_dirty_state;
    }

    /**
     * Call this method if you don't want the formchangechecker JavaScript to be
     * automatically initialised for this form.
     */
    public function disable_form_change_checker() {
        $this->_use_form_change_checker = false;
    }

    /**
     * If you have called {@link disable_form_change_checker()} then you can use
     * this method to re-enable it. It is enabled by default, so normally you don't
     * need to call this.
     */
    public function enable_form_change_checker() {
        $this->_use_form_change_checker = true;
    }

    /**
     * @return bool whether this form should automatically initialise
     *      formchangechecker for itself.
     */
    public function is_form_change_checker_enabled() {
        return $this->_use_form_change_checker;
    }

    /**
    * Accepts a renderer
    *
    * @param HTML_QuickForm_Renderer $renderer An HTML_QuickForm_Renderer object
    */
    function accept(&$renderer) {
        if (method_exists($renderer, 'setAdvancedElements')){
            //Check for visible fieldsets where all elements are advanced
            //and mark these headers as advanced as well.
            //Also mark all elements in a advanced header as advanced.
            $stopFields = $renderer->getStopFieldSetElements();
            $lastHeader = null;
            $lastHeaderAdvanced = false;
            $anyAdvanced = false;
            $anyError = false;
            foreach (array_keys($this->_elements) as $elementIndex){
                $element =& $this->_elements[$elementIndex];

                // if closing header and any contained element was advanced then mark it as advanced
                if ($element->getType()=='header' || in_array($element->getName(), $stopFields)){
                    if ($anyAdvanced && !is_null($lastHeader)) {
                        $lastHeader->_generateId();
                        $this->setAdvanced($lastHeader->getName());
                        $this->addAdvancedStatusElement($lastHeader->getAttribute('id'), $anyError);
                    }
                    $lastHeaderAdvanced = false;
                    unset($lastHeader);
                    $lastHeader = null;
                } elseif ($lastHeaderAdvanced) {
                    $this->setAdvanced($element->getName());
                }

                if ($element->getType()=='header'){
                    $lastHeader =& $element;
                    $anyAdvanced = false;
                    $anyError = false;
                    $lastHeaderAdvanced = isset($this->_advancedElements[$element->getName()]);
                } elseif (isset($this->_advancedElements[$element->getName()])){
                    $anyAdvanced = true;
                    if (isset($this->_errors[$element->getName()])) {
                        $anyError = true;
                    }
                }
            }
            // the last header may not be closed yet...
            if ($anyAdvanced && !is_null($lastHeader)){
                $this->setAdvanced($lastHeader->getName());
                $lastHeader->_generateId();
                $this->addAdvancedStatusElement($lastHeader->getAttribute('id'), $anyError);
            }
            $renderer->setAdvancedElements($this->_advancedElements);
        }
        if (method_exists($renderer, 'setCollapsibleElements') && !$this->_disableShortforms) {

            // Count the number of sections.
            $headerscount = 0;
            foreach (array_keys($this->_elements) as $elementIndex){
                $element =& $this->_elements[$elementIndex];
                if ($element->getType() == 'header') {
                    $headerscount++;
                }
            }

            $anyrequiredorerror = false;
            $headercounter = 0;
            $headername = null;
            foreach (array_keys($this->_elements) as $elementIndex){
                $element =& $this->_elements[$elementIndex];

                if ($element->getType() == 'header') {
                    $headercounter++;
                    $element->_generateId();
                    $headername = $element->getName();
                    $anyrequiredorerror = false;
                } else if (in_array($element->getName(), $this->_required) || isset($this->_errors[$element->getName()])) {
                    $anyrequiredorerror = true;
                } else {
                    // Do not reset $anyrequiredorerror to false because we do not want any other element
                    // in this header (fieldset) to possibly revert the state given.
                }

                if ($element->getType() == 'header') {
                    if ($headercounter === 1 && !isset($this->_collapsibleElements[$headername])) {
                        // By default the first section is always expanded, except if a state has already been set.
                        $this->setExpanded($headername, true);
                    } else if (($headercounter === 2 && $headerscount === 2) && !isset($this->_collapsibleElements[$headername])) {
                        // The second section is always expanded if the form only contains 2 sections),
                        // except if a state has already been set.
                        $this->setExpanded($headername, true);
                    }
                } else if ($anyrequiredorerror) {
                    // If any error or required field are present within the header, we need to expand it.
                    $this->setExpanded($headername, true, true);
                } else if (!isset($this->_collapsibleElements[$headername])) {
                    // Define element as collapsed by default.
                    $this->setExpanded($headername, false);
                }
            }

            // Pass the array to renderer object.
            $renderer->setCollapsibleElements($this->_collapsibleElements);
        }
        parent::accept($renderer);
    }

    /**
     * Adds one or more element names that indicate the end of a fieldset
     *
     * @param string $elementName name of the element
     */
    function closeHeaderBefore($elementName){
        $renderer =& $this->defaultRenderer();
        $renderer->addStopFieldsetElements($elementName);
    }

    /**
     * Set an element to be forced to flow LTR.
     *
     * The element must exist and support this functionality. Also note that
     * when setting the type of a field (@link self::setType} we try to guess the
     * whether the field should be force to LTR or not. Make sure you're always
     * calling this method last.
     *
     * @param string $elementname The element name.
     * @param bool $value When false, disables force LTR, else enables it.
     */
    public function setForceLtr($elementname, $value = true) {
        $this->getElement($elementname)->set_force_ltr($value);
    }

    /**
     * Should be used for all elements of a form except for select, radio and checkboxes which
     * clean their own data.
     *
     * @param string $elementname
     * @param int $paramtype defines type of data contained in element. Use the constants PARAM_*.
     *        {@link lib/moodlelib.php} for defined parameter types
     */
    function setType($elementname, $paramtype) {
        $this->_types[$elementname] = $paramtype;

        // This will not always get it right, but it should be accurate in most cases.
        // When inaccurate use setForceLtr().
        if (!is_rtl_compatible($paramtype)
                && $this->elementExists($elementname)
                && ($element =& $this->getElement($elementname))
                && method_exists($element, 'set_force_ltr')) {

            $element->set_force_ltr(true);
        }
    }

    /**
     * This can be used to set several types at once.
     *
     * @param array $paramtypes types of parameters.
     * @see MoodleQuickForm::setType
     */
    function setTypes($paramtypes) {
        foreach ($paramtypes as $elementname => $paramtype) {
            $this->setType($elementname, $paramtype);
        }
    }

    /**
     * Return the type(s) to use to clean an element.
     *
     * In the case where the element has an array as a value, we will try to obtain a
     * type defined for that specific key, and recursively until done.
     *
     * This method does not work reverse, you cannot pass a nested element and hoping to
     * fallback on the clean type of a parent. This method intends to be used with the
     * main element, which will generate child types if needed, not the other way around.
     *
     * Example scenario:
     *
     * You have defined a new repeated element containing a text field called 'foo'.
     * By default there will always be 2 occurence of 'foo' in the form. Even though
     * you've set the type on 'foo' to be PARAM_INT, for some obscure reason, you want
     * the first value of 'foo', to be PARAM_FLOAT, which you set using setType:
     * $mform->setType('foo[0]', PARAM_FLOAT).
     *
     * Now if you call this method passing 'foo', along with the submitted values of 'foo':
     * array(0 => '1.23', 1 => '10'), you will get an array telling you that the key 0 is a
     * FLOAT and 1 is an INT. If you had passed 'foo[1]', along with its value '10', you would
     * get the default clean type returned (param $default).
     *
     * @param string $elementname name of the element.
     * @param mixed $value value that should be cleaned.
     * @param int $default default constant value to be returned (PARAM_...)
     * @return string|array constant value or array of constant values (PARAM_...)
     */
    public function getCleanType($elementname, $value, $default = PARAM_RAW) {
        $type = $default;
        if (array_key_exists($elementname, $this->_types)) {
            $type = $this->_types[$elementname];
        }
        if (is_array($value)) {
            $default = $type;
            $type = array();
            foreach ($value as $subkey => $subvalue) {
                $typekey = "$elementname" . "[$subkey]";
                if (array_key_exists($typekey, $this->_types)) {
                    $subtype = $this->_types[$typekey];
                } else {
                    $subtype = $default;
                }
                if (is_array($subvalue)) {
                    $type[$subkey] = $this->getCleanType($typekey, $subvalue, $subtype);
                } else {
                    $type[$subkey] = $subtype;
                }
            }
        }
        return $type;
    }

    /**
     * Return the cleaned value using the passed type(s).
     *
     * @param mixed $value value that has to be cleaned.
     * @param int|array $type constant value to use to clean (PARAM_...), typically returned by {@link self::getCleanType()}.
     * @return mixed cleaned up value.
     */
    public function getCleanedValue($value, $type) {
        if (is_array($type) && is_array($value)) {
            foreach ($type as $key => $param) {
                $value[$key] = $this->getCleanedValue($value[$key], $param);
            }
        } else if (!is_array($type) && !is_array($value)) {
            $value = clean_param($value, $type);
        } else if (!is_array($type) && is_array($value)) {
            $value = clean_param_array($value, $type, true);
        } else {
            throw new coding_exception('Unexpected type or value received in MoodleQuickForm::getCleanedValue()');
        }
        return $value;
    }

    /**
     * Updates submitted values
     *
     * @param array $submission submitted values
     * @param array $files list of files
     */
    function updateSubmission($submission, $files) {
        $this->_flagSubmitted = false;

        if (empty($submission)) {
            $this->_submitValues = array();
        } else {
            foreach ($submission as $key => $s) {
                $type = $this->getCleanType($key, $s);
                $submission[$key] = $this->getCleanedValue($s, $type);
            }
            $this->_submitValues = $submission;
            $this->_flagSubmitted = true;
        }

        if (empty($files)) {
            $this->_submitFiles = array();
        } else {
            $this->_submitFiles = $files;
            $this->_flagSubmitted = true;
        }

        // need to tell all elements that they need to update their value attribute.
         foreach (array_keys($this->_elements) as $key) {
             $this->_elements[$key]->onQuickFormEvent('updateValue', null, $this);
         }
    }

    /**
     * Returns HTML for required elements
     *
     * @return string
     */
    function getReqHTML(){
        return $this->_reqHTML;
    }

    /**
     * Returns HTML for advanced elements
     *
     * @return string
     */
    function getAdvancedHTML(){
        return $this->_advancedHTML;
    }

    /**
     * Initializes a default form value. Used to specify the default for a new entry where
     * no data is loaded in using moodleform::set_data()
     *
     * note: $slashed param removed
     *
     * @param string $elementName element name
     * @param mixed $defaultValue values for that element name
     */
    function setDefault($elementName, $defaultValue){
        $this->setDefaults(array($elementName=>$defaultValue));
    }

    /**
     * Add a help button to element, only one button per element is allowed.
     *
     * This is new, simplified and preferable method of setting a help icon on form elements.
     * It uses the new $OUTPUT->help_icon().
     *
     * Typically, you will provide the same identifier and the component as you have used for the
     * label of the element. The string identifier with the _help suffix added is then used
     * as the help string.
     *
     * There has to be two strings defined:
     *   1/ get_string($identifier, $component) - the title of the help page
     *   2/ get_string($identifier.'_help', $component) - the actual help page text
     *
     * @since Moodle 2.0
     * @param string $elementname name of the element to add the item to
     * @param string $identifier help string identifier without _help suffix
     * @param string $component component name to look the help string in
     * @param string $linktext optional text to display next to the icon
     * @param bool $suppresscheck set to true if the element may not exist
     */
    function addHelpButton($elementname, $identifier, $component = 'moodle', $linktext = '', $suppresscheck = false) {
        global $OUTPUT;
        if (array_key_exists($elementname, $this->_elementIndex)) {
            $element = $this->_elements[$this->_elementIndex[$elementname]];
            $element->_helpbutton = $OUTPUT->help_icon($identifier, $component, $linktext);
        } else if (!$suppresscheck) {
            debugging(get_string('nonexistentformelements', 'form', $elementname));
        }
    }

    /**
     * Set constant value not overridden by _POST or _GET
     * note: this does not work for complex names with [] :-(
     *
     * @param string $elname name of element
     * @param mixed $value
     */
    function setConstant($elname, $value) {
        $this->_constantValues = HTML_QuickForm::arrayMerge($this->_constantValues, array($elname=>$value));
        $element =& $this->getElement($elname);
        $element->onQuickFormEvent('updateValue', null, $this);
    }

    /**
     * export submitted values
     *
     * @param string $elementList list of elements in form
     * @return array
     */
    function exportValues($elementList = null){
        $unfiltered = array();
        if (null === $elementList) {
            // iterate over all elements, calling their exportValue() methods
            foreach (array_keys($this->_elements) as $key) {
                if ($this->_elements[$key]->isFrozen() && !$this->_elements[$key]->_persistantFreeze) {
                    $value = '';
                    if (isset($this->_elements[$key]->_attributes['name'])) {
                        $varname = $this->_elements[$key]->_attributes['name'];
                        // If we have a default value then export it.
                        if (isset($this->_defaultValues[$varname])) {
                            $value = $this->prepare_fixed_value($varname, $this->_defaultValues[$varname]);
                        }
                    }
                } else {
                    $value = $this->_elements[$key]->exportValue($this->_submitValues, true);
                }

                if (is_array($value)) {
                    // This shit throws a bogus warning in PHP 4.3.x
                    $unfiltered = HTML_QuickForm::arrayMerge($unfiltered, $value);
                }
            }
        } else {
            if (!is_array($elementList)) {
                $elementList = array_map('trim', explode(',', $elementList));
            }
            foreach ($elementList as $elementName) {
                $value = $this->exportValue($elementName);
                if ((new PEAR())->isError($value)) {
                    return $value;
                }
                //oh, stock QuickFOrm was returning array of arrays!
                $unfiltered = HTML_QuickForm::arrayMerge($unfiltered, $value);
            }
        }

        if (is_array($this->_constantValues)) {
            $unfiltered = HTML_QuickForm::arrayMerge($unfiltered, $this->_constantValues);
        }
        return $unfiltered;
    }

    /**
     * This is a bit of a hack, and it duplicates the code in
     * HTML_QuickForm_element::_prepareValue, but I could not think of a way or
     * reliably calling that code. (Think about date selectors, for example.)
     * @param string $name the element name.
     * @param mixed $value the fixed value to set.
     * @return mixed the appropriate array to add to the $unfiltered array.
     */
    protected function prepare_fixed_value($name, $value) {
        if (null === $value) {
            return null;
        } else {
            if (!strpos($name, '[')) {
                return array($name => $value);
            } else {
                $valueAry = array();
                $myIndex  = "['" . str_replace(array(']', '['), array('', "']['"), $name) . "']";
                eval("\$valueAry$myIndex = \$value;");
                return $valueAry;
            }
        }
    }

    /**
     * Adds a validation rule for the given field
     *
     * If the element is in fact a group, it will be considered as a whole.
     * To validate grouped elements as separated entities,
     * use addGroupRule instead of addRule.
     *
     * @param string $element Form element name
     * @param string $message Message to display for invalid data
     * @param string $type Rule type, use getRegisteredRules() to get types
     * @param string $format (optional)Required for extra rule data
     * @param string $validation (optional)Where to perform validation: "server", "client"
     * @param bool $reset Client-side validation: reset the form element to its original value if there is an error?
     * @param bool $force Force the rule to be applied, even if the target form element does not exist
     */
    function addRule($element, $message, $type, $format=null, $validation='server', $reset = false, $force = false)
    {
        parent::addRule($element, $message, $type, $format, $validation, $reset, $force);
        if ($validation == 'client') {
            $this->clientvalidation = true;
        }

    }

    /**
     * Adds a validation rule for the given group of elements
     *
     * Only groups with a name can be assigned a validation rule
     * Use addGroupRule when you need to validate elements inside the group.
     * Use addRule if you need to validate the group as a whole. In this case,
     * the same rule will be applied to all elements in the group.
     * Use addRule if you need to validate the group against a function.
     *
     * @param string $group Form group name
     * @param array|string $arg1 Array for multiple elements or error message string for one element
     * @param string $type (optional)Rule type use getRegisteredRules() to get types
     * @param string $format (optional)Required for extra rule data
     * @param int $howmany (optional)How many valid elements should be in the group
     * @param string $validation (optional)Where to perform validation: "server", "client"
     * @param bool $reset Client-side: whether to reset the element's value to its original state if validation failed.
     */
    function addGroupRule($group, $arg1, $type='', $format=null, $howmany=0, $validation = 'server', $reset = false)
    {
        parent::addGroupRule($group, $arg1, $type, $format, $howmany, $validation, $reset);
        if (is_array($arg1)) {
             foreach ($arg1 as $rules) {
                foreach ($rules as $rule) {
                    $validation = (isset($rule[3]) && 'client' == $rule[3])? 'client': 'server';
                    if ($validation == 'client') {
                        $this->clientvalidation = true;
                    }
                }
            }
        } elseif (is_string($arg1)) {
            if ($validation == 'client') {
                $this->clientvalidation = true;
            }
        }
    }

    /**
     * Returns the client side validation script
     *
     * The code here was copied from HTML_QuickForm_DHTMLRulesTableless who copied it from  HTML_QuickForm
     * and slightly modified to run rules per-element
     * Needed to override this because of an error with client side validation of grouped elements.
     *
     * @return string Javascript to perform validation, empty string if no 'client' rules were added
     */
    function getValidationScript()
    {
        global $PAGE;

        if (empty($this->_rules) || $this->clientvalidation === false) {
            return '';
        }

        include_once('HTML/QuickForm/RuleRegistry.php');
        $registry =& HTML_QuickForm_RuleRegistry::singleton();
        $test = array();
        $js_escape = array(
            "\r"    => '\r',
            "\n"    => '\n',
            "\t"    => '\t',
            "'"     => "\\'",
            '"'     => '\"',
            '\\'    => '\\\\'
        );

        foreach ($this->_rules as $elementName => $rules) {
            foreach ($rules as $rule) {
                if ('client' == $rule['validation']) {
                    unset($element); //TODO: find out how to properly initialize it

                    $dependent  = isset($rule['dependent']) && is_array($rule['dependent']);
                    $rule['message'] = strtr($rule['message'], $js_escape);

                    if (isset($rule['group'])) {
                        $group    =& $this->getElement($rule['group']);
                        // No JavaScript validation for frozen elements
                        if ($group->isFrozen()) {
                            continue 2;
                        }
                        $elements =& $group->getElements();
                        foreach (array_keys($elements) as $key) {
                            if ($elementName == $group->getElementName($key)) {
                                $element =& $elements[$key];
                                break;
                            }
                        }
                    } elseif ($dependent) {
                        $element   =  array();
                        $element[] =& $this->getElement($elementName);
                        foreach ($rule['dependent'] as $elName) {
                            $element[] =& $this->getElement($elName);
                        }
                    } else {
                        $element =& $this->getElement($elementName);
                    }
                    // No JavaScript validation for frozen elements
                    if (is_object($element) && $element->isFrozen()) {
                        continue 2;
                    } elseif (is_array($element)) {
                        foreach (array_keys($element) as $key) {
                            if ($element[$key]->isFrozen()) {
                                continue 3;
                            }
                        }
                    }
                    //for editor element, [text] is appended to the name.
                    $fullelementname = $elementName;
                    if (is_object($element) && $element->getType() == 'editor') {
                        if ($element->getType() == 'editor') {
                            $fullelementname .= '[text]';
                            // Add format to rule as moodleform check which format is supported by browser
                            // it is not set anywhere... So small hack to make sure we pass it down to quickform.
                            if (is_null($rule['format'])) {
                                $rule['format'] = $element->getFormat();
                            }
                        }
                    }
                    // Fix for bug displaying errors for elements in a group
                    $test[$fullelementname][0][] = $registry->getValidationScript($element, $fullelementname, $rule);
                    $test[$fullelementname][1]=$element;
                    //end of fix
                }
            }
        }

        // Fix for MDL-9524. If you don't do this, then $element may be left as a reference to one of the fields in
        // the form, and then that form field gets corrupted by the code that follows.
        unset($element);

        $js = '

require([
    "core_form/events",
    "jquery",
], function(
    FormEvents,
    $
) {

    function qf_errorHandler(element, _qfMsg, escapedName) {
        const event = FormEvents.notifyFieldValidationFailure(element, _qfMsg);
        if (event.defaultPrevented) {
            return _qfMsg == \'\';
        } else {
            // Legacy mforms.
            var div = element.parentNode;

            if ((div == undefined) || (element.name == undefined)) {
                // No checking can be done for undefined elements so let server handle it.
                return true;
            }

            if (_qfMsg != \'\') {
                var errorSpan = document.getElementById(\'id_error_\' + escapedName);
                if (!errorSpan) {
                    errorSpan = document.createElement("span");
                    errorSpan.id = \'id_error_\' + escapedName;
                    errorSpan.className = "error";
                    element.parentNode.insertBefore(errorSpan, element.parentNode.firstChild);
                    document.getElementById(errorSpan.id).setAttribute(\'TabIndex\', \'0\');
                    document.getElementById(errorSpan.id).focus();
                }

                while (errorSpan.firstChild) {
                    errorSpan.removeChild(errorSpan.firstChild);
                }

                errorSpan.appendChild(document.createTextNode(_qfMsg.substring(3)));

                if (div.className.substr(div.className.length - 6, 6) != " error"
                        && div.className != "error") {
                    div.className += " error";
                    linebreak = document.createElement("br");
                    linebreak.className = "error";
                    linebreak.id = \'id_error_break_\' + escapedName;
                    errorSpan.parentNode.insertBefore(linebreak, errorSpan.nextSibling);
                }

                return false;
            } else {
                var errorSpan = document.getElementById(\'id_error_\' + escapedName);
                if (errorSpan) {
                    errorSpan.parentNode.removeChild(errorSpan);
                }
                var linebreak = document.getElementById(\'id_error_break_\' + escapedName);
                if (linebreak) {
                    linebreak.parentNode.removeChild(linebreak);
                }

                if (div.className.substr(div.className.length - 6, 6) == " error") {
                    div.className = div.className.substr(0, div.className.length - 6);
                } else if (div.className == "error") {
                    div.className = "";
                }

                return true;
            } // End if.
        } // End if.
    } // End function.
    ';
        $validateJS = '';
        foreach ($test as $elementName => $jsandelement) {
            // Fix for bug displaying errors for elements in a group
            //unset($element);
            list($jsArr,$element)=$jsandelement;
            //end of fix
            $escapedElementName = preg_replace_callback(
                '/[_\[\]-]/',
                function($matches) {
                    return sprintf("_%2x", ord($matches[0]));
                },
                $elementName);
            $valFunc = 'validate_' . $this->_formName . '_' . $escapedElementName . '(ev.target, \''.$escapedElementName.'\')';

            if (!is_array($element)) {
                $element = [$element];
            }
            foreach ($element as $elem) {
                if (key_exists('id', $elem->_attributes)) {
                    $js .= '
    function validate_' . $this->_formName . '_' . $escapedElementName . '(element, escapedName) {
      if (undefined == element) {
         //required element was not found, then let form be submitted without client side validation
         return true;
      }
      var value = \'\';
      var errFlag = new Array();
      var _qfGroups = {};
      var _qfMsg = \'\';
      var frm = element.parentNode;
      if ((undefined != element.name) && (frm != undefined)) {
          while (frm && frm.nodeName.toUpperCase() != "FORM") {
            frm = frm.parentNode;
          }
        ' . join("\n", $jsArr) . '
          return qf_errorHandler(element, _qfMsg, escapedName);
      } else {
        //element name should be defined else error msg will not be displayed.
        return true;
      }
    }

    document.getElementById(\'' . $elem->_attributes['id'] . '\').addEventListener(\'blur\', function(ev) {
        ' . $valFunc . '
    });
    document.getElementById(\'' . $elem->_attributes['id'] . '\').addEventListener(\'change\', function(ev) {
        ' . $valFunc . '
    });
';
                }
            }
            // This handles both randomised (MDL-65217) and non-randomised IDs.
            $errorid = preg_replace('/^id_/', 'id_error_', $elem->_attributes['id']);
            $validateJS .= '
      ret = validate_' . $this->_formName . '_' . $escapedElementName.'(frm.elements[\''.$elementName.'\'], \''.$escapedElementName.'\') && ret;
      if (!ret && !first_focus) {
        first_focus = true;
        const element = document.getElementById("' . $errorid . '");
        if (element) {
          FormEvents.notifyFormError(element);
          element.focus();
        }
      }
';

            // Fix for bug displaying errors for elements in a group
            //unset($element);
            //$element =& $this->getElement($elementName);
            //end of fix
            //$onBlur = $element->getAttribute('onBlur');
            //$onChange = $element->getAttribute('onChange');
            //$element->updateAttributes(array('onBlur' => $onBlur . $valFunc,
                                             //'onChange' => $onChange . $valFunc));
        }
//  do not rely on frm function parameter, because htmlarea breaks it when overloading the onsubmit method
        $js .= '

    function validate_' . $this->_formName . '() {
      if (skipClientValidation) {
         return true;
      }
      var ret = true;

      var frm = document.getElementById(\''. $this->_attributes['id'] .'\')
      var first_focus = false;
    ' . $validateJS . ';
      return ret;
    }

    var form = document.getElementById(\'' . $this->_attributes['id'] . '\').closest(\'form\');
    form.addEventListener(FormEvents.eventTypes.formSubmittedByJavascript, () => {
        try {
            var myValidator = validate_' . $this->_formName . ';
        } catch(e) {
            return;
        }
        if (myValidator) {
            myValidator();
        }
    });

    document.getElementById(\'' . $this->_attributes['id'] . '\').addEventListener(\'submit\', function(ev) {
        try {
            var myValidator = validate_' . $this->_formName . ';
        } catch(e) {
            return true;
        }
        if (typeof window.tinyMCE !== \'undefined\') {
            window.tinyMCE.triggerSave();
        }
        if (!myValidator()) {
            ev.preventDefault();
        }
    });

});
';

        $PAGE->requires->js_amd_inline($js);

        // Global variable used to skip the client validation.
        return html_writer::tag('script', 'var skipClientValidation = false;');
    } // end func getValidationScript

    /**
     * Sets default error message
     */
    function _setDefaultRuleMessages(){
        foreach ($this->_rules as $field => $rulesarr){
            foreach ($rulesarr as $key => $rule){
                if ($rule['message']===null){
                    $a=new stdClass();
                    $a->format=$rule['format'];
                    $str=get_string('err_'.$rule['type'], 'form', $a);
                    if (strpos($str, '[[')!==0){
                        $this->_rules[$field][$key]['message']=$str;
                    }
                }
            }
        }
    }

    /**
     * Get list of attributes which have dependencies
     *
     * @return array
     */
    function getLockOptionObject(){
        $result = array();
        foreach ($this->_dependencies as $dependentOn => $conditions){
            $result[$dependentOn] = array();
            foreach ($conditions as $condition=>$values) {
                $result[$dependentOn][$condition] = array();
                foreach ($values as $value=>$dependents) {
                    $result[$dependentOn][$condition][$value][self::DEP_DISABLE] = array();
                    foreach ($dependents as $dependent) {
                        $elements = $this->_getElNamesRecursive($dependent);
                        if (empty($elements)) {
                            // probably element inside of some group
                            $elements = array($dependent);
                        }
                        foreach($elements as $element) {
                            if ($element == $dependentOn) {
                                continue;
                            }
                            $result[$dependentOn][$condition][$value][self::DEP_DISABLE][] = $element;
                        }
                    }
                }
            }
        }
        foreach ($this->_hideifs as $dependenton => $conditions) {
            if (!isset($result[$dependenton])) {
                $result[$dependenton] = array();
            }
            foreach ($conditions as $condition => $values) {
                if (!isset($result[$dependenton][$condition])) {
                    $result[$dependenton][$condition] = array();
                }
                foreach ($values as $value => $dependents) {
                    $result[$dependenton][$condition][$value][self::DEP_HIDE] = array();
                    foreach ($dependents as $dependent) {
                        $elements = $this->_getElNamesRecursive($dependent);
                        if (!in_array($dependent, $elements)) {
                            // Always want to hide the main element, even if it contains sub-elements as well.
                            $elements[] = $dependent;
                        }
                        foreach ($elements as $element) {
                            if ($element == $dependenton) {
                                continue;
                            }
                            $result[$dependenton][$condition][$value][self::DEP_HIDE][] = $element;
                        }
                    }
                }
            }
        }
        return array($this->getAttribute('id'), $result);
    }

    /**
     * Get names of element or elements in a group.
     *
     * @param HTML_QuickForm_group|element $element element group or element object
     * @return array
     */
    function _getElNamesRecursive($element) {
        if (is_string($element)) {
            if (!$this->elementExists($element)) {
                return array();
            }
            $element = $this->getElement($element);
        }

        if (is_a($element, 'HTML_QuickForm_group')) {
            $elsInGroup = $element->getElements();
            $elNames = array();
            foreach ($elsInGroup as $elInGroup){
                if (is_a($elInGroup, 'HTML_QuickForm_group')) {
                    // Groups nested in groups: append the group name to the element and then change it back.
                    // We will be appending group name again in MoodleQuickForm_group::export_for_template().
                    $oldname = $elInGroup->getName();
                    if ($element->_appendName) {
                        $elInGroup->setName($element->getName() . '[' . $oldname . ']');
                    }
                    $elNames = array_merge($elNames, $this->_getElNamesRecursive($elInGroup));
                    $elInGroup->setName($oldname);
                } else {
                    $elNames[] = $element->getElementName($elInGroup->getName());
                }
            }

        } else if (is_a($element, 'HTML_QuickForm_header')) {
            return array();

        } else if (is_a($element, 'HTML_QuickForm_hidden')) {
            return array();

        } else if (method_exists($element, 'getPrivateName') &&
                !($element instanceof HTML_QuickForm_advcheckbox)) {
            // The advcheckbox element implements a method called getPrivateName,
            // but in a way that is not compatible with the generic API, so we
            // have to explicitly exclude it.
            return array($element->getPrivateName());

        } else {
            $elNames = array($element->getName());
        }

        return $elNames;
    }

    /**
     * Adds a dependency for $elementName which will be disabled if $condition is met.
     * If $condition = 'notchecked' (default) then the condition is that the $dependentOn element
     * is not checked. If $condition = 'checked' then the condition is that the $dependentOn element
     * is checked. If $condition is something else (like "eq" for equals) then it is checked to see if the value
     * of the $dependentOn element is $condition (such as equal) to $value.
     *
     * When working with multiple selects, the dependentOn has to be the real name of the select, meaning that
     * it will most likely end up with '[]'. Also, the value should be an array of required values, or a string
     * containing the values separated by pipes: array('red', 'blue') or 'red|blue'.
     *
     * @param string $elementName the name of the element which will be disabled
     * @param string $dependentOn the name of the element whose state will be checked for condition
     * @param string $condition the condition to check
     * @param mixed $value used in conjunction with condition.
     */
    function disabledIf($elementName, $dependentOn, $condition = 'notchecked', $value='1') {
        // Multiple selects allow for a multiple selection, we transform the array to string here as
        // an array cannot be used as a key in an associative array.
        if (is_array($value)) {
            $value = implode('|', $value);
        }
        if (!array_key_exists($dependentOn, $this->_dependencies)) {
            $this->_dependencies[$dependentOn] = array();
        }
        if (!array_key_exists($condition, $this->_dependencies[$dependentOn])) {
            $this->_dependencies[$dependentOn][$condition] = array();
        }
        if (!array_key_exists($value, $this->_dependencies[$dependentOn][$condition])) {
            $this->_dependencies[$dependentOn][$condition][$value] = array();
        }
        $this->_dependencies[$dependentOn][$condition][$value][] = $elementName;
    }

    /**
     * Adds a dependency for $elementName which will be hidden if $condition is met.
     * If $condition = 'notchecked' (default) then the condition is that the $dependentOn element
     * is not checked. If $condition = 'checked' then the condition is that the $dependentOn element
     * is checked. If $condition is something else (like "eq" for equals) then it is checked to see if the value
     * of the $dependentOn element is $condition (such as equal) to $value.
     *
     * When working with multiple selects, the dependentOn has to be the real name of the select, meaning that
     * it will most likely end up with '[]'. Also, the value should be an array of required values, or a string
     * containing the values separated by pipes: array('red', 'blue') or 'red|blue'.
     *
     * @param string $elementname the name of the element which will be hidden
     * @param string $dependenton the name of the element whose state will be checked for condition
     * @param string $condition the condition to check
     * @param mixed $value used in conjunction with condition.
     */
    public function hideIf($elementname, $dependenton, $condition = 'notchecked', $value = '1') {
        // Multiple selects allow for a multiple selection, we transform the array to string here as
        // an array cannot be used as a key in an associative array.
        if (is_array($value)) {
            $value = implode('|', $value);
        }
        if (!array_key_exists($dependenton, $this->_hideifs)) {
            $this->_hideifs[$dependenton] = array();
        }
        if (!array_key_exists($condition, $this->_hideifs[$dependenton])) {
            $this->_hideifs[$dependenton][$condition] = array();
        }
        if (!array_key_exists($value, $this->_hideifs[$dependenton][$condition])) {
            $this->_hideifs[$dependenton][$condition][$value] = array();
        }
        $this->_hideifs[$dependenton][$condition][$value][] = $elementname;
    }

    /**
     * Registers button as no submit button
     *
     * @param string $buttonname name of the button
     */
    function registerNoSubmitButton($buttonname){
        $this->_noSubmitButtons[]=$buttonname;
    }

    /**
     * Checks if button is a no submit button, i.e it doesn't submit form
     *
     * @param string $buttonname name of the button to check
     * @return bool
     */
    function isNoSubmitButton($buttonname){
        return (array_search($buttonname, $this->_noSubmitButtons)!==FALSE);
    }

    /**
     * Registers a button as cancel button
     *
     * @param string $addfieldsname name of the button
     */
    function _registerCancelButton($addfieldsname){
        $this->_cancelButtons[]=$addfieldsname;
    }

    /**
     * Displays elements without HTML input tags.
     * This method is different to freeze() in that it makes sure no hidden
     * elements are included in the form.
     * Note: If you want to make sure the submitted value is ignored, please use setDefaults().
     *
     * This function also removes all previously defined rules.
     *
     * @param string|array $elementList array or string of element(s) to be frozen
     * @return object|bool if element list is not empty then return error object, else true
     */
    function hardFreeze($elementList=null)
    {
        if (!isset($elementList)) {
            $this->_freezeAll = true;
            $elementList = array();
        } else {
            if (!is_array($elementList)) {
                $elementList = preg_split('/[ ]*,[ ]*/', $elementList);
            }
            $elementList = array_flip($elementList);
        }

        foreach (array_keys($this->_elements) as $key) {
            $name = $this->_elements[$key]->getName();
            if ($this->_freezeAll || isset($elementList[$name])) {
                $this->_elements[$key]->freeze();
                $this->_elements[$key]->setPersistantFreeze(false);
                unset($elementList[$name]);

                // remove all rules
                $this->_rules[$name] = array();
                // if field is required, remove the rule
                $unset = array_search($name, $this->_required);
                if ($unset !== false) {
                    unset($this->_required[$unset]);
                }
            }
        }

        if (!empty($elementList)) {
            return self::raiseError(null, QUICKFORM_NONEXIST_ELEMENT, null, E_USER_WARNING, "Nonexistant element(s): '" . implode("', '", array_keys($elementList)) . "' in HTML_QuickForm::freeze()", 'HTML_QuickForm_Error', true);
        }
        return true;
    }

    /**
     * Hard freeze all elements in a form except those whose names are in $elementList or hidden elements in a form.
     *
     * This function also removes all previously defined rules of elements it freezes.
     *
     * @throws HTML_QuickForm_Error
     * @param array $elementList array or string of element(s) not to be frozen
     * @return bool returns true
     */
    function hardFreezeAllVisibleExcept($elementList)
    {
        $elementList = array_flip($elementList);
        foreach (array_keys($this->_elements) as $key) {
            $name = $this->_elements[$key]->getName();
            $type = $this->_elements[$key]->getType();

            if ($type == 'hidden'){
                // leave hidden types as they are
            } elseif (!isset($elementList[$name])) {
                $this->_elements[$key]->freeze();
                $this->_elements[$key]->setPersistantFreeze(false);

                // remove all rules
                $this->_rules[$name] = array();
                // if field is required, remove the rule
                $unset = array_search($name, $this->_required);
                if ($unset !== false) {
                    unset($this->_required[$unset]);
                }
            }
        }
        return true;
    }

   /**
    * Tells whether the form was already submitted
    *
    * This is useful since the _submitFiles and _submitValues arrays
    * may be completely empty after the trackSubmit value is removed.
    *
    * @return bool
    */
    function isSubmitted()
    {
        return parent::isSubmitted() && (!$this->isFrozen());
    }

    /**
     * Add the element name to the list of newly-created repeat elements
     * (So that elements that interpret 'no data submitted' as a valid state
     * can tell when they should get the default value instead).
     *
     * @param string $name the name of the new element
     */
    public function note_new_repeat($name) {
        $this->_newrepeats[] = $name;
    }

    /**
     * Check if the element with the given name has just been added by clicking
     * on the 'Add repeating elements' button.
     *
     * @param string $name the name of the element being checked
     * @return bool true if the element is newly added
     */
    public function is_new_repeat($name) {
        return in_array($name, $this->_newrepeats);
    }
}

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
