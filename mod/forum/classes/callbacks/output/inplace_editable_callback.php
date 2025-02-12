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

namespace mod_forum\callbacks\output;

use core\callbacks\output\inplace_editable_interface;
use core\callbacks\output\inplace_editable_object;

/**
 * Inplace editable callback implementation.
 *
 * @package    mod_forum
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class inplace_editable_callback implements
    inplace_editable_interface
{
    #[\Override]
    public function execute_inplace_editable(inplace_editable_object $callback): void {
        match ($callback->itemtype) {
            'digestoptions' => $this->inplace_editable_digestoptions($callback),
            default => null,
        };
    }

    /**
     * Inplace editable callback for digest options.
     */
    private function inplace_editable_digestoptions(inplace_editable_object $callback): void {
        global $DB, $PAGE;

        // The itemid is the forumid.
        $forum = $DB->get_record('forum', ['id' => $callback->itemid], '*', MUST_EXIST);
        $course = $DB->get_record('course', ['id' => $forum->course], '*', MUST_EXIST);
        $cm = get_coursemodule_from_instance('forum', $forum->id, $course->id, false, MUST_EXIST);
        $context = \core\context\module::instance($cm->id);

        $PAGE->set_context($context);
        require_login($course, false, $cm);
        forum_set_user_maildigest($forum, $callback->newvalue);

        $renderer = $PAGE->get_renderer('mod_forum');
        $callback->set_renderable($renderer->render_digest_options($forum, $callback->newvalue));
    }
}
