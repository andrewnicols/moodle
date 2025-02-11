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

namespace core\callbacks;

/**
 * The base class for all callbacks objects.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class abstract_callback_object {
    /**
     * Method to return the name of the executor for this callback.
     *
     * The default implementation will return the name of the class with the prefix "execute_" and without the "_object" suffix.
     *
     * @return string
     */
    public function get_executor_name(): string {
        $shortname = (new \ReflectionClass($this))->getShortName();
        if (substr($shortname, -7) === "_object") {
            $shortname = substr($shortname, 0, -7);
        }
        return "execute_" . $shortname;
    }

    /**
     * Method to return the possible interfaces that this callback is a part of.
     *
     * Note: In most cases this will be a single value, but multiple values may be allowed to allow
     * for future deprecation of an interface and migration to a new version.
     *
     * Where multiple values are provided, these are listed in order of preference with the most preferred version first.
     *
     * @return string[] The interface name.
     */
    abstract public function get_implementing_interface_names(): array;
}
