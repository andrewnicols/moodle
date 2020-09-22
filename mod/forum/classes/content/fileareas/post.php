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
namespace mod_forum\content\fileareas;

use core\context;
use core\content\plugintypes\mod\filearea;
use mod_forum\local\container;
use stdClass;
use stored_file;

/**
 * The definition for a content controller for the mod_forum component.
 *
 * @copyright   2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class post extends filearea {

    /**
     * Get the itemid usage for this filearea.
     *
     * @param   context $context
     * @return  int
     */
    protected function get_itemid_usage(context $context): ?int {
        return self::ITEMID_PRESENT_IN_USE;
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
        // For both the post and attachment file areas, the itemid of the file is the postid of a forum post.
        $vaultfactory = container::get_vault_factory();

        $postvault = $vaultfactory->get_post_vault();
        $post = $postvault->get_from_id($file->get_itemid());

        $discussionvault = $vaultfactory->get_discussion_vault();
        $discussion = $discussionvault->get_from_id($post->get_discussion_id());

        $forumvault = $vaultfactory->get_forum_vault();
        $forum = $forumvault->get_from_id($discussion->get_forum_id());

        $managerfactory = container::get_manager_factory();
        $capabilitymanager = $managerfactory->get_capability_manager($forum);

        $user = static::get_user($user);
        if (!$capabilitymanager->can_view_discussions($user)) {
            return false;
        }

        if (!$capabilitymanager->can_view_post($user, $discussion, $post)) {
            return false;
        }

        return true;
    }
}
