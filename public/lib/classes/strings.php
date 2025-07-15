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

use core\exception\coding_exception;

/**
 * String Helper for fetching localised strings.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class strings {
    /**
     * Create an instnace of the strings helper class.
     *
     * @param string_manager $stringmanager
     */
    public function __construct(
        /** @var string_manager */
        protected string_manager $stringmanager,
    ) {
    }

    /**
     * Returns a localized string.
     *
     * Returns the translated string specified by $identifier as
     * for $module.  Uses the same format files as STphp.
     * $a is an object, string or number that can be used
     * within translation strings
     *
     * eg 'hello {$a->firstname} {$a->lastname}'
     * or 'hello {$a}'
     *
     * Example usage of this function involves finding the string you would
     * like a local equivalent of and using its identifier and module information
     * to retrieve it.<br/>
     * If you open moodle/lang/en/moodle.php and look near line 278
     * you will find a string to prompt a user for their word for 'course'
     * <code>
     * $string['course'] = 'Course';
     * </code>
     * So if you want to display the string 'Course'
     * in any language that supports it on your site
     * you just need to use the identifier 'course'
     * <code>
     * $mystring = '<strong>'. get_string('course') .'</strong>';
     * or
     * </code>
     * If the string you want is in another file you'd take a slightly
     * different approach. Looking in moodle/lang/en/calendar.php you find
     * around line 75:
     * <code>
     * $string['typecourse'] = 'Course event';
     * </code>
     * If you want to display the string "Course event" in any language
     * supported you would use the identifier 'typecourse' and the module 'calendar'
     * (because it is in the file calendar.php):
     * <code>
     * $mystring = '<h1>'. get_string('typecourse', 'calendar') .'</h1>';
     * </code>
     *
     * As a last resort, should the identifier fail to map to a string
     * the returned string will be [[ $identifier ]]
     *
     * In Moodle 2.3 there is a new argument to this function $lazyload.
     * Setting $lazyload to true causes get_string to return a lang_string object
     * rather than the string itself. The fetching of the string is then put off until
     * the string object is first used. The object can be used by calling it's out
     * method or by casting the object to a string, either directly e.g.
     *     (string)$stringobject
     * or indirectly by using the string within another string or echoing it out e.g.
     *     echo $stringobject
     *     return "<p>{$stringobject}</p>";
     * It is worth noting that using $lazyload and attempting to use the string as an
     * array key will cause a fatal error as objects cannot be used as array keys.
     * But you should never do that anyway!
     * For more information {@link lang_string}
     *
     * @category string
     * @param string $identifier The key identifier for the localized string
     * @param string $component The module where the key identifier is stored,
     *      usually expressed as the filename in the language pack without the
     *      .php on the end but can also be written as mod/forum or grade/export/xls.
     *      If none is specified then moodle.php is used.
     * @param null|string|\stdClass|int|float $a An object, string or number that can be used
     *      within translation strings
     * @param bool $lazyload If set to true a string object is returned instead of
     *      the string itself. The string then isn't calculated until it is first used.
     * @return string The localized string.
     * @throws coding_exception
     */
    public function get(
        string $identifier,
        ?string $component = null,
        null|string|\stdClass|int|float $a = null,
        bool $lazyload = false,
    ): lang_string|string {
        global $CFG;

        // If the lazy load argument has been supplied return a lang_string object instead.
        // We need to make sure it is true (and a bool) as you will see below there
        // used to be a forth argument at one point.
        if ($lazyload === true) {
            return new lang_string($identifier, $component, $a);
        }

        if ($CFG->debugdeveloper && clean_param($identifier, PARAM_STRINGID) === '') {
            throw new coding_exception('Invalid string identifier. The identifier cannot be empty. Please fix your get_string() call.', DEBUG_DEVELOPER);
        }

        // There is now a forth argument again, this time it is a boolean however so
        // we can still check for the old extralocations parameter.
        if (!is_bool($lazyload) && !empty($lazyload)) {
            debugging('extralocations parameter in get_string() is not supported any more, please use standard lang locations only.');
        }

        if ($component !== null && strpos((string)$component, '/') !== false) {
            throw new coding_exception(
                "The module name you passed to get_string is in a deprecated format which is no longer supported.",
            );
        }

        $result = $this->stringmanager->get_string($identifier, $component, $a);

        // Debugging feature lets you display string identifier and component.
        if (isset($CFG->debugstringids) && $CFG->debugstringids && optional_param('strings', 0, PARAM_INT)) {
            $result .= " {$identifier}/{$component}";
        }

        return $result;
    }

    /**
     * Checks if the string exists.
     *
     * @param string $identifier The identifier of the string to search for
     * @param string|null $component The module the string is associated with, null means moodle.php
     * @return bool true if the string exists
     */
    public function exists(
        string $identifier,
        ?string $component = null,
    ): bool {
        return $this->stringmanager->string_exists($identifier, $component);
    }

    /**
     * Checks if the string has been deprecated.
     *
     * @param string $identifier The identifier of the string to search for
     * @param string|null $component The module the string is associated with, null means moodle.php
     * @return bool true if the string has been deprecated
     */
    public function is_string_deprecated(
        string $identifier,
        ?string $component = null,
    ): bool {
        return $this->stringmanager->string_deprecated($identifier, $component);
    }
}
