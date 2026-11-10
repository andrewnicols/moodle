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

namespace core\router\schema;

/**
 * Sets the local operation name used to generate an OpenAPI operationId for an API route.
 *
 * The component and route handler namespace (including the class name, excluding route\api) are added automatically.
 * For handlers supporting multiple HTTP methods, the HTTP method is inserted before the local name.
 * Path parameter names are appended with With and And separators.
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\Attribute(\Attribute::TARGET_METHOD)]
final readonly class operationid {
    /**
     * Create an operation ID attribute.
     *
     * @param string $id The local operation name, in PascalCase
     */
    public function __construct(
        /** @var string The local name used after the component, namespace, and optional HTTP method prefix */
        public string $id,
    ) {
        if ($id === '') {
            throw new \core\exception\coding_exception('An operation ID cannot be empty.');
        }
    }
}
