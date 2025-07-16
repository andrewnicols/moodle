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

namespace tool_behat\tests;

/**
 * Customised values that will be used instead of standard manager one.
 *
 * If an existing component/identifier is found, return it instead of the real
 * one from language files. Note this doesn't support place holders or another niceties.
 *
 * @package    tool_behat
 * @category   test
 * @copyright  onwards Eloy Lafuente (stronk7) {@link https://stronk7.com}
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class phpunit_string_manager extends \core\standard_string_manager {
    /** @var array language customisations provided by the manager without asking for real contents */
    protected array $customstrings = [];

    #[\Override]
    public function get_string($identifier, $component = '', $a = null, $lang = null) {
        $key = trim($component) . '/' . trim($identifier);
        if (isset($this->customstrings[$key])) {
            return $this->customstrings[$key];
        }
        return parent::get_string($identifier, $component, $a, $lang);
    }

    /**
     * Sets a custom string to be returned by the string manager instead of the language file one.
     *
     * @param string $identifier The identifier of the string to search for
     * @param string $component The module the string is associated with
     * @param string $value the contents of the language string to be returned by get_string()
     */
    public function set_string(
        string $identifier,
        string $component,
        string $value,
    ) {
        $key = trim($component) . '/' . trim($identifier);
        $this->customstrings[$key] = $value;
    }
}
