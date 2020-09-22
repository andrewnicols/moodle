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

namespace core_user\content\fileareas;

use core\context;
use core\content\filearea;
use mod_forum\local\container;
use stdClass;
use stored_file;

/**
 * File area definition for the private files filearea of core_user.
 *
 * @package     core_files
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class private_files extends filearea {

    /**
     * Get the itemid usage for this filearea.
     *
     * @param   context $context
     * @return  int
     */
    protected function get_itemid_usage(context $context): ?int {
        return self::ITEMID_PRESENT_NOT_PRESENT;
    }

    /**
     * Check whether the specified use can access the supplied stored_file in the supplied context.
     *
     * @param   stored_file $file
     * @param   stdClass $user
     * @param   context $context
     * @return  bool
     */
    public static function can_access_stored_file_from_context(stored_file $file, stdClass $user, context $context): ?bool {
        if (isguestuser()) {
            // Guests cannot access private files.
            return false;
        }

        $context = context::instance_by_id($file->get_contextid());
        if ($user->id !== $context->instanceid) {
            // This file does not belong to the current user.
            return false;
        }

        // A user always has access to their own files. No further capability checks.
        return true;
    }

    /**
     * Forcibly download the content.
     *
     * @param   servable_item $servable
     * @return  null|bool
     */
    public function should_force_download(servable_item $servable): ?bool {
        return true;
    }

    /**
     * Return the cache time to use for this file.
     *
     * @param   servable_item $servable
     * @return  null|int
     */
    public function get_sendfile_cache_time(servable_item $servable): ?int {
        // Do not allow caching.
        return 0;
    }
}
