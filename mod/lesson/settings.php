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
 * Settings used by the lesson module, were moved from mod_edit
 *
 * @package mod_lesson
 * @copyright  2009 Sam Hemelryk
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or late
 **/

defined('MOODLE_INTERNAL') || die;

if ($ADMIN->fulltree) {
    require_once($CFG->dirroot.'/mod/lesson/locallib.php');
    $yesno = array(0 => get_string('no'), 1 => get_string('yes'));

    // Introductory explanation that all the settings are defaults for the add lesson form.
    $settings->add(new admin_setting_heading('mod_lesson/lessonintro', '', get_string('configintro', 'mod_lesson')));

    // Appearance settings.
    $settings->add(new admin_setting_heading('mod_lesson/appearance', get_string('appearance'), ''));

    // Media file popup settings.
    $setting = new admin_setting_configempty('mod_lesson/mediafile', get_string('mediafile', 'mod_lesson'),
            get_string('mediafile_help', 'mod_lesson'));

    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, true);
    $settings->add($setting);

    $settings->add(new admin_setting_configtext('mod_lesson/mediawidth', get_string('mediawidth', 'mod_lesson'),
            get_string('configmediawidth', 'mod_lesson'), 640, PARAM_INT));

    $settings->add(new admin_setting_configtext('mod_lesson/mediaheight', get_string('mediaheight', 'mod_lesson'),
            get_string('configmediaheight', 'mod_lesson'), 480, PARAM_INT));

    $settings->add(new admin_setting_configcheckbox('mod_lesson/mediaclose', get_string('mediaclose', 'mod_lesson'),
            get_string('configmediaclose', 'mod_lesson'), false, PARAM_TEXT));

    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/progressbar',
        get_string('progressbar', 'mod_lesson'), get_string('progressbar_help', 'mod_lesson'),
        array('value' => 0, 'adv' => false), $yesno));

    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/ongoing',
        get_string('ongoing', 'mod_lesson'), get_string('ongoing_help', 'mod_lesson'),
        array('value' => 0, 'adv' => true), $yesno));

    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/displayleftmenu',
        get_string('displayleftmenu', 'mod_lesson'), get_string('displayleftmenu_help', 'mod_lesson'),
        array('value' => 0, 'adv' => false), $yesno));

    $percentage = array();
    for ($i = 100; $i >= 0; $i--) {
        $percentage[$i] = $i.'%';
    }
    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/displayleftif',
        get_string('displayleftif', 'mod_lesson'), get_string('displayleftif_help', 'mod_lesson'),
        array('value' => 0, 'adv' => true), $percentage));

    // Slideshow settings.
    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/slideshow',
        get_string('slideshow', 'mod_lesson'), get_string('slideshow_help', 'mod_lesson'),
        array('value' => 0, 'adv' => true), $yesno));

    $settings->add(new admin_setting_configtext('mod_lesson/slideshowwidth', get_string('slideshowwidth', 'mod_lesson'),
            get_string('configslideshowwidth', 'mod_lesson'), 640, PARAM_INT));

    $settings->add(new admin_setting_configtext('mod_lesson/slideshowheight', get_string('slideshowheight', 'mod_lesson'),
            get_string('configslideshowheight', 'mod_lesson'), 480, PARAM_INT));

    $settings->add(new admin_setting_configtext('mod_lesson/slideshowbgcolor', get_string('slideshowbgcolor', 'mod_lesson'),
            get_string('configslideshowbgcolor', 'mod_lesson'), '#FFFFFF', PARAM_TEXT));

    $numbers = array();
    for ($i = 20; $i > 1; $i--) {
        $numbers[$i] = $i;
    }

    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/maxanswers',
        get_string('maximumnumberofanswersbranches', 'mod_lesson'), get_string('maximumnumberofanswersbranches_help', 'mod_lesson'),
        array('value' => '5', 'adv' => true), $numbers));

    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/defaultfeedback',
        get_string('displaydefaultfeedback', 'mod_lesson'), get_string('displaydefaultfeedback_help', 'mod_lesson'),
        array('value' => 0, 'adv' => true), $yesno));

    $setting = new admin_setting_configempty('mod_lesson/activitylink', get_string('activitylink', 'mod_lesson'),
        '');

    $setting->set_advanced_flag_options(admin_setting_flag::ENABLED, true);
    $settings->add($setting);

    // Availability settings.
    $settings->add(new admin_setting_heading('mod_lesson/availibility', get_string('availability'), ''));

    $settings->add(new admin_setting_configduration_with_advanced('mod_lesson/timelimit',
        get_string('timelimit', 'mod_lesson'), get_string('configtimelimit_desc', 'mod_lesson'),
            array('value' => '0', 'adv' => false), 60));

    $settings->add(new admin_setting_configcheckbox_with_advanced('mod_lesson/password',
        get_string('password', 'mod_lesson'), get_string('configpassword_desc', 'mod_lesson'),
        array('value' => 0, 'adv' => true)));

    // Flow Control.
    $settings->add(new admin_setting_heading('lesson/flowcontrol', get_string('flowcontrol', 'mod_lesson'), ''));

    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/modattempts',
        get_string('modattempts', 'mod_lesson'), get_string('modattempts_help', 'mod_lesson'),
        array('value' => 0, 'adv' => false), $yesno));

    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/displayreview',
        get_string('displayreview', 'mod_lesson'), get_string('displayreview_help', 'mod_lesson'),
        array('value' => 0, 'adv' => false), $yesno));

    $attempts = ['0' => get_string('unlimited')];
    for ($i = 10; $i > 0; $i--) {
        $attempts[$i] = $i;
    }

    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/maximumnumberofattempts',
        get_string('maximumnumberofattempts', 'mod_lesson'), get_string('maximumnumberofattempts_help', 'mod_lesson'),
        array('value' => '1', 'adv' => false), $attempts));

    $defaultnextpages = array();
    $defaultnextpages[0] = get_string("normal", 'mod_lesson');
    $defaultnextpages[LESSON_UNSEENPAGE] = get_string("showanunseenpage", 'mod_lesson');
    $defaultnextpages[LESSON_UNANSWEREDPAGE] = get_string("showanunansweredpage", 'mod_lesson');

    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/defaultnextpage',
            get_string('actionaftercorrectanswer', 'mod_lesson'), '',
            array('value' => 0, 'adv' => true), $defaultnextpages));

    $pages = array();
    for ($i = 100; $i >= 0; $i--) {
        $pages[$i] = $i;
    }
    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/numberofpagestoshow',
        get_string('numberofpagestoshow', 'mod_lesson'), get_string('numberofpagestoshow_help', 'mod_lesson'),
        array('value' => '1', 'adv' => true), $pages));

    // Grade.
    $settings->add(new admin_setting_heading('lesson/grade', get_string('gradenoun'), ''));

    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/practice',
        get_string('practice', 'mod_lesson'), get_string('practice_help', 'mod_lesson'),
        array('value' => 0, 'adv' => false), $yesno));

    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/customscoring',
        get_string('customscoring', 'mod_lesson'), get_string('customscoring_help', 'mod_lesson'),
        array('value' => 1, 'adv' => true), $yesno));

    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/retakesallowed',
        get_string('retakesallowed', 'mod_lesson'), get_string('retakesallowed_help', 'mod_lesson'),
        array('value' => 0, 'adv' => false), $yesno));

    $options = array();
    $options[0] = get_string('usemean', 'mod_lesson');
    $options[1] = get_string('usemaximum', 'mod_lesson');

    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/handlingofretakes',
        get_string('handlingofretakes', 'mod_lesson'), get_string('handlingofretakes_help', 'mod_lesson'),
        array('value' => 0, 'adv' => true), $options));

    $settings->add(new admin_setting_configselect_with_advanced('mod_lesson/minimumnumberofquestions',
        get_string('minimumnumberofquestions', 'mod_lesson'), get_string('minimumnumberofquestions_help', 'mod_lesson'),
        array('value' => 0, 'adv' => true), $pages));

}
