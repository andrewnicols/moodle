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
 * Helper functions for serving React modules.
 *
 * @package    core_lib
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Resolve a React module alias to a dirroot-relative JS build path.
 *
 * Example:
 *   "mod_book/travel" => "/mod/book/react/build/travel.js"
 *
 * @param string $identifier Alias like "mod_book/travel"
 * @return null|string Dirroot-relative path starting with "/"
 */
function react_resolve_module_identifier(string $identifier): ?string {
    global $CFG;

    $modulepath = explode('/', $identifier);

    $component = array_shift($modulepath);
    if ($component === null || $component === '' || empty($modulepath)) {
        return null;
    }

    if (!class_exists('\\core\\component')) {
        require_once($CFG->dirroot . '/lib/classes/component.php');
    }

    $dir = \core\component::get_component_directory($component);
    if ($dir === null) {
        return null;
    }

    return $dir . '/react/build/' . implode('/', $modulepath) . '.js';
}
