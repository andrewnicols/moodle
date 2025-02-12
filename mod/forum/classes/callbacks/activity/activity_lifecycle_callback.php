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

namespace mod_forum\callbacks\activity;

use core_course\callbacks\activity\activity_lifecycle_interface;
use core_course\callbacks\activity\create_instance_object;
use core_course\callbacks\activity\update_instance_object;
use moodle_database;

/**
 * Class activity_lifecycle_callback
 *
 * @package    mod_forum
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class activity_lifecycle_callback implements activity_lifecycle_interface {
    /**
     * Constructor for the activity_lifecycle_callback class.
     *
     * @param \moodle_database $db
     */
    public function __construct(
        /** @var moodle_database The database instance */
        protected readonly moodle_database $db,
    ) {
    }

    #[\Override]
    public function execute_create_instance(
        create_instance_object $callback,
    ): void {
        global $CFG;

        require_once($CFG->dirroot . '/mod/forum/locallib.php');

        $forum = $callback->get_moduleinfo();
        $forum->timemodified = time();

        if (empty($forum->assessed)) {
            $forum->assessed = 0;
        }

        if (empty($forum->ratingtime) || empty($forum->assessed)) {
            $forum->assesstimestart  = 0;
            $forum->assesstimefinish = 0;
        }

        $forum->id = $this->db->insert_record('forum', $forum);
        $modcontext = \core\context\module::instance($forum->coursemodule);

        if ($forum->type == 'single') {  // Create related discussion.
            $discussion = (object) [
                'course'        => $forum->course,
                'forum'         => $forum->id,
                'name'          => $forum->name,
                'assessed'      => $forum->assessed,
                'message'       => $forum->intro,
                'messageformat' => $forum->introformat,
                'messagetrust'  => trusttext_trusted(\core\context\course::instance($forum->course)),
                'mailnow'       => false,
                'groupid'       => -1,
            ];

            $message = '';

            $discussion->id = forum_add_discussion($discussion, null, $message);

            if ($mform && $draftid = file_get_submitted_draft_itemid('introeditor')) {
                // Ugly hack - we need to copy the files somehow.
                $discussion = $this->db->get_record('forum_discussions', [
                    'id' => $discussion->id,
                ], '*', MUST_EXIST);
                $post = $this->db->get_record('forum_posts', [
                    'id' => $discussion->firstpost,
                ], '*', MUST_EXIST);

                $options = ['subdirs' => true]; // Use the same options as intro field.
                $post->message = file_save_draft_area_files(
                    $draftid,
                    $modcontext->id,
                    'mod_forum',
                    'post',
                    $post->id,
                    $options,
                    $post->message,
                );
                $this->db->set_field('forum_posts', 'message', $post->message, ['id' => $post->id]);
            }
        }

        forum_update_calendar($forum, $forum->coursemodule);
        forum_grade_item_update($forum);

        $completiontimeexpected = !empty($forum->completionexpected) ? $forum->completionexpected : null;
        \core_completion\api::update_completion_date_event($forum->coursemodule, 'forum', $forum->id, $completiontimeexpected);

        $callback->set_instanceid($forum->id);
        $callback->update_moduleinfo($forum);
    }

    #[\Override]
    public function execute_update_instance(
        update_instance_object $callback,
    ): void {
        global $CFG, $OUTPUT, $USER;

        require_once($CFG->dirroot . '/mod/forum/locallib.php');

        $forum = $callback->get_moduleinfo();

        $forum->timemodified = time();
        $forum->id = $forum->instance;

        if (empty($forum->assessed)) {
            $forum->assessed = 0;
        }

        if (empty($forum->ratingtime) || empty($forum->assessed)) {
            $forum->assesstimestart  = 0;
            $forum->assesstimefinish = 0;
        }

        $oldforum = $this->db->get_record('forum', array('id'=>$forum->id));

        // MDL-3942 - if the aggregation type or scale (i.e. max grade) changes then recalculate the grades for the entire forum
        // if  scale changes - do we need to recheck the ratings, if ratings higher than scale how do we want to respond?
        // for count and sum aggregation types the grade we check to make sure they do not exceed the scale (i.e. max score) when calculating the grade
        $updategrades = false;

        if ($oldforum->assessed <> $forum->assessed) {
            // Whether this forum is rated.
            $updategrades = true;
        }

        if ($oldforum->scale <> $forum->scale) {
            // The scale currently in use.
            $updategrades = true;
        }

        if (empty($oldforum->grade_forum) || $oldforum->grade_forum <> $forum->grade_forum) {
            // The whole forum grading.
            $updategrades = true;
        }

        if ($updategrades) {
            forum_update_grades($forum); // Recalculate grades for the forum.
        }

        if ($forum->type == 'single') {  // Update related discussion and post.
            $discussions = $this->db->get_records('forum_discussions', array('forum'=>$forum->id), 'timemodified ASC');
            if (!empty($discussions)) {
                if (count($discussions) > 1) {
                    echo $OUTPUT->notification(get_string('warnformorepost', 'forum'));
                }
                $discussion = array_pop($discussions);
            } else {
                // try to recover by creating initial discussion - MDL-16262
                $discussion = new stdClass();
                $discussion->course          = $forum->course;
                $discussion->forum           = $forum->id;
                $discussion->name            = $forum->name;
                $discussion->assessed        = $forum->assessed;
                $discussion->message         = $forum->intro;
                $discussion->messageformat   = $forum->introformat;
                $discussion->messagetrust    = true;
                $discussion->mailnow         = false;
                $discussion->groupid         = -1;

                $message = '';

                forum_add_discussion($discussion, null, $message);

                if (! $discussion = $this->db->get_record('forum_discussions', array('forum'=>$forum->id))) {
                    throw new \moodle_exception('cannotadd', 'forum');
                }
            }
            if (! $post = $this->db->get_record('forum_posts', array('id'=>$discussion->firstpost))) {
                throw new \moodle_exception('cannotfindfirstpost', 'forum');
            }

            $cm         = get_coursemodule_from_instance('forum', $forum->id);
            $modcontext = \core\context\module::instance($cm->id, MUST_EXIST);

            $post = $this->db->get_record('forum_posts', array('id'=>$discussion->firstpost), '*', MUST_EXIST);
            $post->subject       = $forum->name;
            $post->message       = $forum->intro;
            $post->messageformat = $forum->introformat;
            $post->messagetrust  = trusttext_trusted($modcontext);
            $post->modified      = $forum->timemodified;
            $post->userid        = $USER->id;    // MDL-18599, so that current teacher can take ownership of activities.

            if ($mform and $draftid = file_get_submitted_draft_itemid('introeditor')) {
                // Ugly hack - we need to copy the files somehow.
                $options = array('subdirs'=>true); // Use the same options as intro field!
                $post->message = file_save_draft_area_files($draftid, $modcontext->id, 'mod_forum', 'post', $post->id, $options, $post->message);
            }

            \mod_forum\local\entities\post::add_message_counts($post);
            $this->db->update_record('forum_posts', $post);
            $discussion->name = $forum->name;
            $this->db->update_record('forum_discussions', $discussion);
        }

        $this->db->update_record('forum', $forum);

        $modcontext = \core\context\module::instance($forum->coursemodule);
        if (($forum->forcesubscribe == FORUM_INITIALSUBSCRIBE) && ($oldforum->forcesubscribe <> $forum->forcesubscribe)) {
            $users = \mod_forum\subscriptions::get_potential_subscribers($modcontext, 0, 'u.id, u.email', '');
            foreach ($users as $user) {
                \mod_forum\subscriptions::subscribe_user($user->id, $forum, $modcontext);
            }
        }

        forum_update_calendar($forum, $forum->coursemodule);
        forum_grade_item_update($forum);

        $completiontimeexpected = !empty($forum->completionexpected) ? $forum->completionexpected : null;
        \core_completion\api::update_completion_date_event($forum->coursemodule, 'forum', $forum->id, $completiontimeexpected);
    }
}
