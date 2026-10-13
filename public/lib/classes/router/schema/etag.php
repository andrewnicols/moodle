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
 * Marks a route as supporting conditional requests using an ETag.
 *
 * Add `#[etag]` to the handler method alongside `#[route]`. The If-Match (for writes) or If-None-Match (for reads)
 * request header, the ETag response header, and the 304 and 412 responses are then documented centrally in the
 * OpenAPI specification.
 *
 * The attribute does not change request handling. The handler is responsible for using
 * {@see \core\router\conditional_request} to compute and check the ETag. Both request headers are optional.
 *
 * As this is a separate attribute, plugins supporting versions of Moodle without this class may use it freely:
 * the attribute is only instantiated when it exists.
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\Attribute(\Attribute::TARGET_METHOD)]
class etag {
}
