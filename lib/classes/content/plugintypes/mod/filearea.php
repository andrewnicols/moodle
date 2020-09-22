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
namespace core\content\plugintypes\mod;

use cm_info;
use core\content\filearea as parent_filearea;
use core\content\servable_item;
use core\context;
use course_modinfo;

/**
 * File area definition for the icon filearea of core_user.
 *
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class filearea extends parent_filearea {

    /**
     * Get the course_modinfo from a context.
     *
     * @param   context $modcontext
     * @return  course_modinfo
     */
    protected static function get_course_modinfo_from_context(context $modcontext): course_modinfo {
        $coursecontext = $modcontext->get_course_context();

        return get_fast_modinfo($coursecontext->instanceid);
    }

    /**
     * Get the cm_info from a context.
     *
     * @param   context $modcontext
     * @return  cm_info
     */
    protected static function get_cm_from_context(context $modcontext): cm_info {
        $modinfo = self::get_course_modinfo_from_context($modcontext);

        return $modinfo->get_cm($modcontext->instanceid);
    }

    public function get_require_course_login_params(servable_item $servable): ?array {
        $context = $servable->get_context();
        $modinfo = self::get_course_modinfo_from_context($context);
        $cminfo = self::get_cm_from_context($servable->get_context());

        // Automatically login guests.
        return [$modinfo->get_course(), true, $cminfo];
    }
}
