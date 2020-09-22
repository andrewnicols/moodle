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
 * Content API File Area definition.
 *
 * @package     core_files
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
namespace core\content\controllers;

use core_component;

/**
 * A class which describes how a component describes files.
 *
 * This class is responsible for returning information about a file area used in Moodle, to support translation of a
 * pluginfile URL into an item of servable content, and determining whether a user can access that file.
 *
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class component_file_controller extends file_controller {
    /**
     * Get the contentarea classname for the component.
     *
     * @param   string $component
     * @return  string The classname
     */
    public static function get_contentarea_classname_for_component(string $component): ?string {
        $component = core_component::normalize_componentname($component);
        [$plugintype] = core_component::normalize_component($component);

        // The list of possible controllers, in order of priority.
        $classnames = [
            "\\{$component}\\content\\file_controller",
            "\\core\\content\\plugintypes\\{$plugintype}\\file_controller",
        ];

        foreach ($classnames as $classname) {
            if (class_exists($classname)) {
                // TODO Add some tests for class validity.
                return $classname;
            }
        }

        return null;
    }
}
