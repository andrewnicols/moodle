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
namespace core\content\plugintypes\mod\fileareas;

use core\context;
use core\content\plugintypes\mod\filearea;
use core\content\servable_item;
use core_component;
use stdClass;
use stored_file;

/**
 * File area definition for the profile filearea of core_user.
 *
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class intro extends filearea {

    /**
     * The activity intro filearea does not contain any itemid in the URL.
     *
     * @param   context $context
     * @return  int
     */
    protected function get_itemid_usage(context $context): ?int {
        return self::ITEMID_NOT_PRESENT;
    }

    /**
     * Check whether the specified use can access the supplied stored_file in the supplied context.
     *
     * @param   stored_file $file
     * @param   stdClass $user
     * @param   context $context
     * @return  bool
     */
    protected static function can_user_access_content_from_context(
        string $component,
        context $filecontext,
        stdClass $user,
        context $viewcontext,
    ): bool {
        [, $modname] = core_component::normalize_component($component);
        if (!plugin_supports('mod', $modname, FEATURE_MOD_INTRO, true)) {
            // This plugin does not support the MOD_INTRO feature at all.
            return false;
        }

        if ($filecontext->contextlevel != CONTEXT_MODULE) {
            // Activity files must belong to a course module.
            return false;
        }

        $cminfo = self::get_cm_from_context($filecontext);

        if ($cminfo->modname != $modname) {
            // The context of the file does not match the component in the file.
            return false;
        }

        // All users may access the intro.
        return true;
    }

    /**
     * Course login is always required to access the intro filearea.
     *
     * @param   servable_item $servable
     * @return  bool
     */
    public function requires_course_login(servable_item $servable): bool {
        return true;
    }

    /**
     * Get arguments to pass to require_course_login(), or null if course login is not required.
     *
     * @param   servable_item $servable
     * @return  null|array
     */
    public function get_require_course_login_params(servable_item $servable): ?array {
        $context = $servable->get_context();

        $modinfo = self::get_course_modinfo_from_context($context);

        // Automatically login guests.
        $args = [$modinfo->get_course(), true];
        $cminfo = self::get_cm_from_context($servable->get_context());

        if (!$cminfo->uservisible) {
            if (!$cminfo->showdescription || !$cminfo->is_visible_on_course_page()) {
                // Module intro is not visible on the course page and module is not available, show access error.
                $args[] = $cminfo;
            }
        }

        return $args;
    }

    /**
     * Set whether the content should be forcibly downloaded.
     *
     * If a null value is returned, then the user-requested value is used, otherwise download is either forcibly set, or
     * forcibly unset.
     *
     * @return  null|bool
     */
    public function should_force_download(servable_item $servable): ?bool {
        return false;
    }

    /**
     * Return the cache time to use for this file.
     *
     * @param   servable_item $servable
     * @return  null|int
     */
    public function get_sendfile_cache_time(servable_item $servable): ?int {
        return 0;
    }
}
