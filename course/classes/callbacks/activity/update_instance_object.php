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

namespace core_course\callbacks\activity;

use core\callbacks\abstract_callback_object;
use core\callbacks\must_exist_interface;
use core\callbacks\replaces_legacy_callback_interface;
use moodleform;
use stdClass;

/**
 * Activity Update Callback Object.
 *
 * @package    core_course
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class update_instance_object extends abstract_callback_object implements
    must_exist_interface,
    replaces_legacy_callback_interface
{
    /**
     * Constructor for the update_instance callback object.
     *
     * @param \stdClass $course
     * @param \stdClass $moduleinfo
     * @param \moodleform $mform
     */
    public function __construct(
        /** @var stdClass The Moodle Course */
        protected readonly stdClass $course,
        /** @var stdClass The Module Information */
        protected stdClass $moduleinfo,
        /** @var moodleform The Moodle Form */
        protected readonly moodleform $mform,
    ) {
    }

    public function get_moduleinfo(): stdClass {
        return $this->moduleinfo;
    }

    public function get_course(): stdClass {
        return $this->course;
    }

    public function get_form(): moodleform {
        return $this->mform;
    }

    #[\Override]
    public function get_implementing_interface_names(): array {
        return ['core_course\callbacks\activity\activity_lifecycle_interface'];
    }

    #[\Override]
    public function call_legacy_callback(
        string $component,
    ): bool {
        $functionname = "{$component}_update_instance";
        if (!function_exists($functionname)) {
            return false;
        }

        $result = $functionname(
            $this->moduleinfo,
            $this->mform,
        );

        return !!$result;
    }
}
