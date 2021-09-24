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
 * Single select form field class.
 *
 * @package    core_form
 * @category   test
 * @copyright  2012 David Monllaó
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// NOTE: no MOODLE_INTERNAL test here, this file may be required by behat before including /config.php.

require_once(__DIR__  . '/behat_form_field.php');

/**
 * Single select form field.
 *
 * @package    core_form
 * @category   test
 * @copyright  2012 David Monllaó
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class behat_form_select extends behat_form_field {

    /**
     * Sets the value(s) of a select element.
     *
     * Seems an easy select, but there are lots of combinations
     * of browsers and operative systems and each one manages the
     * autosubmits and the multiple option selects in a different way.
     *
     * @param string $value plain value or comma separated values if multiple. Commas in values escaped with backslash.
     * @return void
     */
    public function set_value($value) {
        // Is the select multiple?
        $multiple = $this->field->hasAttribute('multiple');

        // Here we select the option(s).
        if ($multiple) {
            // Split and decode values. Comma separated list of values allowed. With valuable commas escaped with backslash.
            $options = preg_replace('/\\\,/', ',',  preg_split('/(?<!\\\),/', trim($value)));
            // This is a multiple select, let's pass the multiple flag after first option.
            $afterfirstoption = false;
            foreach ($options as $option) {
                $this->field->selectOption(trim($option), $afterfirstoption);
                $afterfirstoption = true;
            }
        } else {
            // By default, assume the passed value is a non-multiple option.
            $this->field->selectOption(trim($value));
       }
    }

    /**
     * Returns the text of the currently selected options.
     *
     * @return string Comma separated if multiple options are selected. Commas in option texts escaped with backslash.
     */
    public function get_value() {
        return implode(', ', array_values($this->get_selected_options()));
    }

    /**
     * Returns whether the provided argument matches the current value.
     *
     * @param string $expectedvalue
     * @return bool
     */
    public function matches($expectedvalue): bool {
        $multiple = $this->field->hasAttribute('multiple');

        // Same implementation as the parent if it is a single select.
        $selectedoptions = $this->get_selected_options();

        if (!$multiple) {
            $expectedvalue = trim($expectedvalue);

            $selectedtexts = trim(implode(', ', array_values($selectedoptions)));
            $selectedvalues = trim(implode(', ', array_keys($selectedoptions)));
        } else {
            // We are dealing with a multi-select.

            // Unescape + trim all options and flip it to have the expected values as keys.
            $expectedvalues = preg_split('/(?<!\\\),/', $expectedvalue);
            $expectedvalues = preg_replace('/\\\,/', ',', $expectedvalues);

            // Normalise all values in the same way.
            $expectedvalue = $this->get_unescaped_options($expectedvalues);
            $selectedtexts = $this->get_unescaped_options($selectedoptions);
            $selectedvalues = $this->get_unescaped_options($selectedoptions);
        }

        if ($expectedvalue === $selectedvalues) {
            return true;
        }

        if ($expectedvalue === $selectedtexts) {
            return true;
        }

        return false;
    }

    /**
     * Cleans the list of options and returns it as a string separating options with |||.
     *
     * @param array $values
     * @return string The options
     */
    protected function get_unescaped_options(array $values) {
        $optionsarray = array_merge([], $values);

        // Trim all values to normalise.
        $optionsarray = array_map('trim', $values);

        // Sort by value (keeping the keys is irrelevant).
        core_collator::asort($optionsarray, SORT_STRING);

        // Returning it as a string which is easier to match against other values.
        return implode('|||', $optionsarray);
    }

    /**
     * Returns the field selected values.
     *
     * Externalized from the common behat_form_field API method get_value() as matches() needs to check against both
     * values and texts.
     *
     * @return string
     */
    protected function get_selected_options() {
        // Is the select multiple?
        $multiple = $this->field->hasAttribute('multiple');

        $selectedoptions = array(); // To accumulate found selected options.

        // Driver returns the values as an array or as a string depending
        // on whether multiple options are selected or not.
        $values = $this->field->getValue();

        if (!is_array($values)) {
            $values = array($values);
        }

        $selected = [];
        foreach ($values as $value) {
            $option = $this->field->find('xpath', "//option[@value='{$value}']", false, $this->field, 0);
            $textvalue = trim($option->getHtml());

            if ($multiple) {
                // If the select is multiple, text commas must be encoded.
                $textvalue = trim(str_replace(',', '\,', $textvalue));
            }

            $selected[$value] = $textvalue;
        }

        return $selected;
    }

    /**
     * Returns the opton XPath based on it's select xpath.
     *
     * @param string $option
     * @param string $selectxpath
     * @return string xpath
     */
    protected function get_option_xpath($option, $selectxpath) {
        $valueliteral = behat_context_helper::escape(trim($option));
        return $selectxpath . "/descendant::option[(./@value=$valueliteral or normalize-space(.)=$valueliteral)]";
    }
}
