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
 * Inspect the handler for a route.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
trait route_source_location_trait {
    /**
     * Reflect a route handler when possible.
     *
     * @param mixed $callable The route callable
     * @return \ReflectionFunctionAbstract|null
     */
    protected function get_route_reflection(mixed $callable): ?\ReflectionFunctionAbstract {
        try {
            return is_array($callable)
                ? new \ReflectionMethod(...$callable)
                : new \ReflectionFunction(\Closure::fromCallable($callable));
        } catch (\ReflectionException | \TypeError) {
            return null;
        }
    }

    /**
     * Get the route attribute for a handler.
     *
     * @param \ReflectionFunctionAbstract|null $reflection The reflected handler
     * @return \core\router\route|null
     */
    protected function get_route_metadata(?\ReflectionFunctionAbstract $reflection): ?\core\router\route {
        if (!$reflection instanceof \ReflectionMethod) {
            return null;
        }

        $attributes = $reflection->getAttributes(\core\router\route::class, \ReflectionAttribute::IS_INSTANCEOF);
        return $attributes ? $attributes[0]->newInstance() : null;
    }

    /**
     * Get the deprecation attribute for a route handler.
     *
     * @param \ReflectionFunctionAbstract|null $reflection The reflected handler
     * @return \core\attribute\deprecated|null
     */
    protected function get_route_deprecation(?\ReflectionFunctionAbstract $reflection): ?\core\attribute\deprecated {
        if (!$reflection instanceof \ReflectionMethod) {
            return null;
        }

        return \core\deprecation::from([$reflection->class, $reflection->name]);
    }

    /**
     * Get the file, and line of the method, which handles a route.
     *
     * @param \ReflectionFunctionAbstract|null $reflection The reflected handler
     * @return string The path relative to the Moodle root with the line number, or an empty string if unknown
     */
    protected function get_source_location(?\ReflectionFunctionAbstract $reflection): string {
        global $CFG;

        if (!$reflection) {
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
