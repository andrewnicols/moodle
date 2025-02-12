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

use context_helper;
use core\callbacks\abstract_callback_object;
use core\callbacks\must_exist_interface;
use core\callbacks\replaces_legacy_callback_interface;
use core\exception\moodle_exception;
use moodleform;
use stdClass;

/**
 * Activity Creation Object.
 *
 * @package    core_course
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class create_instance_object extends abstract_callback_object implements
    must_exist_interface,
    replaces_legacy_callback_interface
{
    protected int $instanceid = 0;

    /**
     * Constructor for the create_instance callback object.
     *
     * @param stdClass $course
     * @param stdClass $moduleinfo
     * @param moodleform $mform
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

    public function update_moduleinfo(stdClass $moduleinfo): void {
        $this->moduleinfo = $moduleinfo;
    }

    #[\Override]
    public function get_implementing_interface_names(): array {
        return ['core_course\callbacks\activity\activity_lifecycle_interface'];
    }

    #[\Override]
    public function call_legacy_callback(
        string $component,
    ): bool {
        global $DB;
        $functionname = "{$component}_add_instance";
        if (!function_exists($functionname)) {
            return false;
        }

        $result = $functionname(
            $this->moduleinfo,
            $this->mform,
        );

        if (is_numeric($result)) {
            $this->set_instanceid($result);

            return true;
        }

        // Something went wrong.
        // Undo everything we can. This is not necessary for databases which
        // support transactions, but improves consistency for other databases.

        context_helper::delete_instance(CONTEXT_MODULE, $this->moduleinfo->coursemodule);
        $DB->delete_records('course_modules', ['id' => $this->moduleinfo->coursemodule]);

        if ($result instanceof moodle_exception) {
            throw $result;
        } else if (!is_number($result)) {
            throw new moodle_exception('invalidfunction', '', course_get_url($this->course, $this->moduleinfo->section));
        }
        throw new \moodle_exception(
            'cannotaddnewmodule',
            '',
            course_get_url($this->course, $this->moduleinfo->section),
            $this->moduleinfo->modulename,
        );
    }

    /**
     * Set the instance id.
     *
     * @param int $instanceid
     */
    public function set_instanceid(int $instanceid): void {
        $this->instanceid = $instanceid;
    }

    /**
     * Get the instance id.
     *
     * @return int
     */
    public function get_instanceid(): int {
        return $this->instanceid;
    }
}
