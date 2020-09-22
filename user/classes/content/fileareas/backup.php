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
namespace core_user\content\fileareas;

use context;
use core\content\filearea;
use core\content\servable_item;
use core\content\servable_items\servable_local_file;
use core\content\servable_items\servable_stored_file;
use core\content\servable_items\servable_redirect;
use mod_forum\local\container;
use stdClass;
use stored_file;
use theme_config;

/**
 * File area definition for the profile filearea of core_user.
 *
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class backup extends filearea {

    /**
     * Get the itemid usage for this filearea.
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
    public static function can_user_access_stored_file_from_context(stored_file $file, stdClass $user, context $context): ?bool {
        if (isguestuser()) {
            // Guests never have access to files.
            return false;
        }

        $context = self::get_context_for_stored_file($file);

        if ($context->contextlevel != CONTEXT_USER) {
            // The file must be in a user context.
            return false;
        }

        if ($context->instanceid != $user->id) {
            // The file ust be owned by the current user.
            return false;
        }

        return true;
    }

    /**
     * Login is always required for access to user backup files.
     *
     * @param   servable_item $servable
     * @return  bool
     */
    public function requires_login(servable_item $servable): bool {
        return true;
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
        return true;
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
