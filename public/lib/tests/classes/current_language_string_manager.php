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

namespace core\tests;

/**
 * Test helper class for test which need Moodle to think there are other languages installed.
 *
 * @package    core
 * @copyright 2022 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class current_language_string_manager extends \core\standard_string_manager {
    /** @var array $installedlanguages list of languages which we want to pretend are installed. */
    protected array $installedlanguages;

    /**
     * Start pretending that the list of installed languages is other than what it is.
     *
     * You need to pass in an array like ['en' => 'English', 'fr' => 'French'].
     *
     * @param array $installedlanguages the list of languages to assume are installed.
     */
    public function set_installed_languages(array $installedlanguages): void {
        $this->installedlanguages = $installedlanguages;
    }

    #[\Override]
    public function get_list_of_translations($returnall = false) {
        return $this->installedlanguages;
    }
}
