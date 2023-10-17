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
 * @package   mod_forum
 * @copyright  2009 Petr Skoda (http://skodak.org)
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die;

if ($ADMIN->fulltree) {
    require_once($CFG->dirroot.'/mod/forum/lib.php');

    $settings->add(new admin_setting_configselect('forum_displaymode', get_string('displaymode', 'mod_forum'),
                       get_string('configdisplaymode', 'mod_forum'), FORUM_MODE_NESTED, forum_get_layout_modes()));

    // Less non-HTML characters than this is short
    $settings->add(new admin_setting_configtext('forum_shortpost', get_string('shortpost', 'mod_forum'),
                       get_string('configshortpost', 'mod_forum'), 300, PARAM_INT));

    // More non-HTML characters than this is long
    $settings->add(new admin_setting_configtext('forum_longpost', get_string('longpost', 'mod_forum'),
                       get_string('configlongpost', 'mod_forum'), 600, PARAM_INT));

    // Number of discussions on a page
    $settings->add(new admin_setting_configtext('forum_manydiscussions', get_string('manydiscussions', 'mod_forum'),
                       get_string('configmanydiscussions', 'mod_forum'), 100, PARAM_INT));

    if (isset($CFG->maxbytes)) {
        $maxbytes = 0;
        if (isset($CFG->forum_maxbytes)) {
            $maxbytes = $CFG->forum_maxbytes;
        }
        $settings->add(new admin_setting_configselect('forum_maxbytes', get_string('maxattachmentsize', 'mod_forum'),
                           get_string('configmaxbytes', 'mod_forum'), 512000, get_max_upload_sizes($CFG->maxbytes, 0, 0, $maxbytes)));
    }

    // Default number of attachments allowed per post in all forums
    $settings->add(new admin_setting_configtext('forum_maxattachments', get_string('maxattachments', 'mod_forum'),
                       get_string('configmaxattachments', 'mod_forum'), 9, PARAM_INT));

    // Default Subscription mode setting.
    $options = forum_get_subscriptionmode_options();
    $settings->add(new admin_setting_configselect('forum_subscription', get_string('subscriptionmode', 'mod_forum'),
        get_string('configsubscriptiontype', 'mod_forum'), FORUM_CHOOSESUBSCRIBE, $options));

    // Default Read Tracking setting.
    $options = array();
    $options[FORUM_TRACKING_OPTIONAL] = get_string('trackingoptional', 'mod_forum');
    $options[FORUM_TRACKING_OFF] = get_string('trackingoff', 'mod_forum');
    $options[FORUM_TRACKING_FORCED] = get_string('trackingon', 'mod_forum');
    $settings->add(new admin_setting_configselect('forum_trackingtype', get_string('trackingtype', 'mod_forum'),
                       get_string('configtrackingtype', 'mod_forum'), FORUM_TRACKING_OPTIONAL, $options));

    // Default whether user needs to mark a post as read
    $settings->add(new admin_setting_configcheckbox('forum_trackreadposts', get_string('trackforum', 'mod_forum'),
                       get_string('configtrackreadposts', 'mod_forum'), 1));

    // Default whether user needs to mark a post as read.
    $settings->add(new admin_setting_configcheckbox('forum_allowforcedreadtracking', get_string('forcedreadtracking', 'mod_forum'),
                       get_string('forcedreadtracking_desc', 'mod_forum'), 0));

    // Default number of days that a post is considered old
    $settings->add(new admin_setting_configtext('forum_oldpostdays', get_string('oldpostdays', 'mod_forum'),
                       get_string('configoldpostdays', 'mod_forum'), 14, PARAM_INT));

    // Default whether user needs to mark a post as read
    $settings->add(new admin_setting_configcheckbox('forum_usermarksread', get_string('usermarksread', 'mod_forum'),
                       get_string('configusermarksread', 'mod_forum'), 0));

    $options = array();
    for ($i = 0; $i < 24; $i++) {
        $options[$i] = sprintf("%02d",$i);
    }
    // Default time (hour) to execute 'clean_read_records' cron
    $settings->add(new admin_setting_configselect('forum_cleanreadtime', get_string('cleanreadtime', 'mod_forum'),
                       get_string('configcleanreadtime', 'mod_forum'), 2, $options));

    // Default time (hour) to send digest email
    $settings->add(new admin_setting_configselect('digestmailtime', get_string('digestmailtime', 'mod_forum'),
                       get_string('configdigestmailtime', 'mod_forum'), 17, $options));

    if (empty($CFG->enablerssfeeds)) {
        $options = array(0 => get_string('rssglobaldisabled', 'core_admin'));
        $str = get_string('configenablerssfeeds', 'mod_forum').'<br />'.get_string('configenablerssfeedsdisabled2', 'core_admin');

    } else {
        $options = array(0=>get_string('no'), 1=>get_string('yes'));
        $str = get_string('configenablerssfeeds', 'mod_forum');
    }
    $settings->add(new admin_setting_configselect('forum_enablerssfeeds', get_string('enablerssfeeds', 'core_admin'),
                       $str, 0, $options));

    if (!empty($CFG->enablerssfeeds)) {
        $options = array(
            0 => get_string('none'),
            1 => get_string('discussions', 'mod_forum'),
            2 => get_string('posts', 'mod_forum')
        );
        $settings->add(new admin_setting_configselect('forum_rsstype', get_string('rsstypedefault', 'mod_forum'),
                get_string('configrsstypedefault', 'mod_forum'), 0, $options));
        $settings->hide_if('forum_rsstype', 'forum_enablerssfeeds', 'neq', '1');

        $options = array(
            0  => '0',
            1  => '1',
            2  => '2',
            3  => '3',
            4  => '4',
            5  => '5',
            10 => '10',
            15 => '15',
            20 => '20',
            25 => '25',
            30 => '30',
            40 => '40',
            50 => '50'
        );
        $settings->add(new admin_setting_configselect('forum_rssarticles', get_string('rssarticles', 'mod_forum'),
                get_string('configrssarticlesdefault', 'mod_forum'), 0, $options));
        $settings->hide_if('forum_rssarticles', 'forum_enablerssfeeds', 'neq', '1');
    }

    $settings->add(new admin_setting_configcheckbox('forum_enabletimedposts', get_string('timedposts', 'mod_forum'),
                       get_string('configenabletimedposts', 'mod_forum'), 1));
}

