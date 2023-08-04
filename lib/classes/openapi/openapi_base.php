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

namespace core\openapi;

use coding_exception;
use core\openapi\schema;
use core\router\parameter;
use core\router\response;

/**
 * Routing parameter for validation.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class openapi_base {

    /**
     * Get the $ref for this class.
     *
     * @return string
     */
    public function get_reference(
        bool $qualify = true,
    ): string {
        return $this->get_reference_for_class(
            classname: get_class($this),
            qualify: $qualify,
        );
    }

    /**
     * Get the $ref a class name.
     *
     * https://swagger.io/docs/specification/using-ref/
     *
     * @param string $classname The class to get a reference for
     * @return string The reference
     * @throws coding_exception
     */
    public function get_reference_for_class(
        string $classname,
        bool $qualify = true,
    ): string {
        $reference = $this->escape_reference($classname);
        if (!$qualify) {
            return $reference;
        }
        if (is_a($classname, schema::class, true)) {
            return "#/components/schemas/{$reference}";
        }

        if (is_a($classname, parameter::class, true)) {
            return "#/components/parameters/{$reference}";
        }

        if (is_a($classname, response::class, true)) {
            return "#/components/responses/{$reference}";
        }

        throw new \coding_exception("Class {$classname} is not a schema.");
    }

    /**
     * Escape a reference following rules defined at https://swagger.io/docs/specification/using-ref/.
     *
     * @param string $reference
     * @return string
     */
    public function escape_reference(string $reference): string {
        // Note https://swagger.io/docs/specification/using-ref/ defines the following replacements:
        // ~ => ~0
        // / => ~1
        // These must be used in all reference names.
        return str_replace(
            ['~', '/'],
            ['~0', '~1'],
            $reference,
        );
    }
}
