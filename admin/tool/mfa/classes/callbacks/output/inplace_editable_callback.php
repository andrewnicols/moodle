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

namespace tool_mfacallbacks\output;

use core\callbacks\output\inplace_editable_object;
use core\url;
use navigation_node;
use stdClass;

/**
 * Component callbacks for tool_mfa.
 *
 * @package    tool_mfa
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class callbacks implements
    \core\callbacks\navigation\user_navigation_interface
{

    /**
     * Extend the user navigation.
     *
     * @param navigation_node $navigation The navigation node to extend.
     * @param stdClass $user The user object.
     * @param ?stdClass $course The course object if the navigation is within a course context.
     */
    public function extend_user_navigation(
        navigation_node $navigation,
        stdClass $user,
        ?stdClass $course,
    ): void {
        global $PAGE;

        // Only inject if user is on the preferences page.
        $onpreferencepage = $PAGE->url->compare(new url('/user/preferences.php'), URL_MATCH_BASE);
        if (!$onpreferencepage) {
            return;
        }

        if (\tool_mfa\manager::is_ready() && \tool_mfa\manager::possible_factor_setup()) {
            $url = new url('/admin/tool/mfa/user_preferences.php');
            $node = navigation_node::create(
                get_string('preferences:header', 'tool_mfa'),
                $url,
                navigation_node::TYPE_SETTING,
            );
            $usernode = $navigation->find('useraccount', navigation_node::TYPE_CONTAINER);
            $usernode->add_node($node);
        }

        if (!empty($user->id) && !empty($user->id) && !empty($user->id)) {
            $url = new url('/admin/tool/mfa/index.php');
            $node = $navigation->add(get_string('mfa', 'tool_mfa'), $url, navigation_node::TYPE_SETTING);
            $node->showinflatnavigation = true;
        }
    }
}
