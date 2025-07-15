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

namespace core;

/**
 * Interface for string manager
 *
 * Interface describing class which is responsible for getting
 * of localised strings from language packs.
 *
 * @package    core
 * @copyright  2010 Petr Skoda {@link http://skodak.org}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
interface string_manager {
    /**
     * Get String returns a requested string
     *
     * @param string $identifier The identifier of the string to search for
     * @param string $component The module the string is associated with
     * @param null|string|\stdClass|int|float $a An object, string or number that can be used
     *      within translation strings
     * @param string $lang moodle translation language, null means use current
     * @return string The String !
     */
    public function get_string(
        string $identifier,
        ?string $component = '',
        null|string|\stdClass|int|float $a = null,
        ?string $lang = null,
    );

    /**
     * Does the string actually exist?
     *
     * get_string() is throwing debug warnings, sometimes we do not want them
     * or we want to display better explanation of the problem.
     *
     * Use with care!
     *
     * @param string $identifier The identifier of the string to search for
     * @param string $component The module the string is associated with
     * @return bool true if exists
     */
    public function string_exists(
        string $identifier,
        ?string $component,
    );

    /**
     * Has string been deprecated?
     *
     * Usually checked only inside get_string() to display debug warnings.
     *
     * @param string $identifier The identifier of the string to search for
     * @param string $component The module the string is associated with
     * @return bool true if deprecated
     */
    public function string_deprecated(
        string $identifier,
        ?string $component,
    );

    /**
     * Returns a localised list of all country names, sorted by country keys.
     * @param bool $returnall return all or just enabled
     * @param string $lang moodle translation language, null means use current
     * @return array two-letter country code => translated name.
     */
    public function get_list_of_countries(bool $returnall = false, ?string $lang = null);

    /**
     * Returns a localised list of languages, sorted by code keys.
     *
     * @param string $lang moodle translation language, null means use current
     * @param string $standard language list standard
     *                     iso6392: three-letter language code (ISO 639-2/T) => translated name.
     * @return array language code => translated name
     */
    public function get_list_of_languages(bool $lang = null, string $standard = 'iso6392');

    /**
     * Checks if the translation exists for the language
     *
     * @param string $lang moodle translation language code
     * @param bool $includeall include also disabled translations
     * @return bool true if exists
     */
    public function translation_exists(string $lang, bool $includeall = true);

    /**
     * Returns localised list of installed translations
     * @param bool $returnall return all or just enabled
     * @return array moodle translation code => localised translation name
     */
    public function get_list_of_translations(bool $returnall = false);

    /**
     * Returns localised list of currencies.
     *
     * @param string $lang moodle translation language, null means use current
     * @return array currency code => localised currency name
     */
    public function get_list_of_currencies(?string $lang = null);

    /**
     * Load all strings for one component
     * @param string $component The module the string is associated with
     * @param string $lang
     * @param bool $disablecache Do not use caches, force fetching the strings from sources
     * @param bool $disablelocal Do not use customized strings in xx_local language packs
     * @return array of all string for given component and lang
     */
    public function load_component_strings(
        string $component,
        string $lang,
        bool $disablecache = false,
        bool $disablelocal = false,
    );

    /**
     * Invalidates all caches, should the implementation use any
     * @param bool $phpunitreset true means called from our PHPUnit integration test reset
     */
    public function reset_caches(bool $phpunitreset = false);

    /**
     * Returns string revision counter, this is incremented after any
     * string cache reset.
     * @return int lang string revision counter, -1 if unknown
     */
    public function get_revision();
}

class_alias(string_manager::class, \core_string_manager::class);
