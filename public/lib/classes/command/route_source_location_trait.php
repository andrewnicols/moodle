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

namespace core\command;

/**
 * Find where the handler for a route is defined.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
trait route_source_location_trait {
    /**
     * Get the file, and line of the method, which handles a route.
     *
     * @param mixed $callable The route callable
     * @return string The path relative to the Moodle root with the line number, or an empty string if unknown
     */
    protected function get_source_location(mixed $callable): string {
        global $CFG;

        try {
            $reflection = is_array($callable)
                ? new \ReflectionMethod(...$callable)
                : new \ReflectionFunction(\Closure::fromCallable($callable));
        } catch (\ReflectionException) {
            return '';
        }

        $filename = $reflection->getFileName();
        if (!$filename) {
            return '';
        }

        $root = dirname($CFG->dirroot) . '/';
        if (str_starts_with($filename, $root)) {
            $filename = substr($filename, strlen($root));
        }

        return $filename . ':' . $reflection->getStartLine();
    }
}
