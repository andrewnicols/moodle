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

namespace core_admin\adminsetting;

use core_admin\setting;
use core_text;

/**
 * Select one value from list
 *
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class configselect extends setting {
    /** @var array Array of choices value=>label */
    public $choices;
    /** @var array Array of choices grouped using optgroups */
    public $optgroups;
    /** @var callable|null Loader function for choices */
    protected $choiceloader = null;
    /** @var callable|null Validation function */
    protected $validatefunction = null;

    /**
     * Constructor.
     *
     * If you want to lazy-load the choices, pass a callback function that returns a choice
     * array for the $choices parameter.
     *
     * @param string $name unique ascii name, either 'mysetting' for settings that in config, or 'myplugin/mysetting' for ones in config_plugins.
     * @param string $visiblename localised
     * @param string $description long localised info
     * @param string|int $defaultsetting
     * @param array|callable|null $choices array of $value=>$label for each selection, or callback
     */
    public function __construct($name, $visiblename, $description, $defaultsetting, $choices) {
        // Look for optgroup and single options.
        if (is_array($choices)) {
            $this->choices = [];
            foreach ($choices as $key => $val) {
                if (is_array($val)) {
                    $this->optgroups[$key] = $val;
                    $this->choices = array_merge($this->choices, $val);
                } else {
                    $this->choices[$key] = $val;
                }
            }
        }
        if (is_callable($choices)) {
            $this->choiceloader = $choices;
        }

        parent::__construct($name, $visiblename, $description, $defaultsetting);
    }

    /**
     * Sets a validate function.
     *
     * The callback will be passed one parameter, the new setting value, and should return either
     * an empty string '' if the value is OK, or an error message if not.
     *
     * @param callable|null $validatefunction Validate function or null to clear
     * @since Moodle 3.10
     */
    public function set_validate_function(?callable $validatefunction = null) {
        $this->validatefunction = $validatefunction;
    }

    /**
     * This function may be used in ancestors for lazy loading of choices
     *
     * Override this method if loading of choices is expensive, such
     * as when it requires multiple db requests.
     *
     * @return bool true if loaded, false if error
     */
    public function load_choices() {
        if ($this->choiceloader) {
            if (!is_array($this->choices)) {
                $this->choices = call_user_func($this->choiceloader);
            }
            return true;
        }
        return true;
    }

    /**
     * Check if this is $query is related to a choice
     *
     * @param string $query
     * @return bool true if related, false if not
     */
    public function is_related($query) {
        if (parent::is_related($query)) {
            return true;
        }
        if (!$this->load_choices()) {
            return false;
        }
        foreach ($this->choices as $key => $value) {
            if (strpos(core_text::strtolower($key), $query) !== false) {
                return true;
            }
            if (strpos(core_text::strtolower($value), $query) !== false) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return the setting
     *
     * @return mixed returns config if successful else null
     */
    public function get_setting() {
        return $this->config_read($this->name);
    }

    /**
     * Save a setting
     *
     * @param string $data
     * @return string empty of error string
     */
    public function write_setting($data) {
        if (!$this->load_choices() or empty($this->choices)) {
            return '';
        }
        if (!array_key_exists($data, $this->choices)) {
            return ''; // ignore it
        }

        // Validate the new setting.
        $error = $this->validate_setting($data);
        if ($error) {
            return $error;
        }

        return ($this->config_write($this->name, $data) ? '' : get_string('errorsetting', 'admin'));
    }

    /**
     * Validate the setting. This uses the callback function if provided; subclasses could override
     * to carry out validation directly in the class.
     *
     * @param string $data New value being set
     * @return string Empty string if valid, or error message text
     * @since Moodle 3.10
     */
    protected function validate_setting(string $data): string {
        // If validation function is specified, call it now.
        if ($this->validatefunction) {
            return call_user_func($this->validatefunction, $data);
        } else {
            return '';
        }
    }

    /**
     * Returns XHTML select field
     *
     * Ensure the options are loaded, and generate the XHTML for the select
     * element and any warning message. Separating this out from output_html
     * makes it easier to subclass this class.
     *
     * @param string $data the option to show as selected.
     * @param string $current the currently selected option in the database, null if none.
     * @param string $default the default selected option.
     * @return array the HTML for the select element, and a warning message.
     * @deprecated since Moodle 3.2
     */
    public function output_select_html($data, $current, $default, $extraname = '') {
        debugging('The method admin_setting_configselect::output_select_html is depreacted, do not use any more.', DEBUG_DEVELOPER);
    }

    /**
     * Returns XHTML select field and wrapping div(s)
     *
     * @see output_select_html()
     *
     * @param string $data the option to show as selected
     * @param string $query
     * @return string XHTML field and wrapping div
     */
    public function output_html($data, $query = '') {
        global $OUTPUT;

        $default = $this->get_defaultsetting();
        $current = $this->get_setting();

        if (!$this->load_choices() || empty($this->choices)) {
            return '';
        }

        $context = (object) [
            'id' => $this->get_id(),
            'name' => $this->get_full_name(),
        ];

        if (!is_null($default) && array_key_exists($default, $this->choices)) {
            $defaultinfo = $this->choices[$default];
        } else {
            $defaultinfo = NULL;
        }

        // Warnings.
        $warning = '';
        if ($current === null) {
            // First run.
        } else if (empty($current) && (array_key_exists('', $this->choices) || array_key_exists(0, $this->choices))) {
            // No warning.
        } else if (!array_key_exists($current, $this->choices)) {
            $warning = get_string('warningcurrentsetting', 'admin', $current);
            if (!is_null($default) && $data == $current) {
                $data = $default; // Use default instead of first value when showing the form.
            }
        }

        $options = [];
        $template = 'core_admin/setting_configselect';

        if (!empty($this->optgroups)) {
            $optgroups = [];
            foreach ($this->optgroups as $label => $choices) {
                $optgroup = array('label' => $label, 'options' => []);
                foreach ($choices as $value => $name) {
                    $optgroup['options'][] = [
                        'value' => $value,
                        'name' => $name,
                        'selected' => (string) $value == $data
                    ];
                    unset($this->choices[$value]);
                }
                $optgroups[] = $optgroup;
            }
            $context->options = $options;
            $context->optgroups = $optgroups;
            $template = 'core_admin/setting_configselect_optgroup';
        }

        foreach ($this->choices as $value => $name) {
            $options[] = [
                'value' => $value,
                'name' => $name,
                'selected' => (string) $value == $data
            ];
        }
        $context->options = $options;
        $context->readonly = $this->is_readonly();

        $element = $OUTPUT->render_from_template($template, $context);

        return format_admin_setting($this, $this->visiblename, $element, $this->description, true, $warning, $defaultinfo, $query);
    }
}
