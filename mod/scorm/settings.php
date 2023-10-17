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

defined('MOODLE_INTERNAL') || die;

if ($ADMIN->fulltree) {
    require_once($CFG->dirroot . '/mod/scorm/locallib.php');
    $yesno = array(0 => get_string('no'),
                   1 => get_string('yes'));

    // Default display settings.
    $settings->add(new admin_setting_heading('scorm/displaysettings', get_string('defaultdisplaysettings', 'mod_scorm'), ''));

    $settings->add(new admin_setting_configselect_with_advanced('scorm/displaycoursestructure',
        get_string('displaycoursestructure', 'mod_scorm'), get_string('displaycoursestructuredesc', 'mod_scorm'),
        array('value' => 0, 'adv' => false), $yesno));

    $settings->add(new admin_setting_configselect_with_advanced('scorm/popup',
        get_string('display', 'mod_scorm'), get_string('displaydesc', 'mod_scorm'),
        array('value' => 0, 'adv' => false), scorm_get_popup_display_array()));

    $settings->add(new admin_setting_configtext_with_advanced('scorm/framewidth',
        get_string('width', 'mod_scorm'), get_string('framewidth', 'mod_scorm'),
        array('value' => '100', 'adv' => true)));

    $settings->add(new admin_setting_configtext_with_advanced('scorm/frameheight',
        get_string('height', 'mod_scorm'), get_string('frameheight', 'mod_scorm'),
        array('value' => '500', 'adv' => true)));

    $settings->add(new admin_setting_configcheckbox('scorm/winoptgrp_adv',
         get_string('optionsadv', 'mod_scorm'), get_string('optionsadv_desc', 'mod_scorm'), 1));

    foreach (scorm_get_popup_options_array() as $key => $value) {
        $settings->add(new admin_setting_configcheckbox('scorm/'.$key,
            get_string($key, 'mod_scorm'), '', $value));
    }

    $settings->add(new admin_setting_configselect_with_advanced('scorm/skipview',
        get_string('skipview', 'mod_scorm'), get_string('skipviewdesc', 'mod_scorm'),
        array('value' => 0, 'adv' => true), scorm_get_skip_view_array()));

    $settings->add(new admin_setting_configselect_with_advanced('scorm/hidebrowse',
        get_string('hidebrowse', 'mod_scorm'), get_string('hidebrowsedesc', 'mod_scorm'),
        array('value' => 0, 'adv' => true), $yesno));

    $settings->add(new admin_setting_configselect_with_advanced('scorm/hidetoc',
        get_string('hidetoc', 'mod_scorm'), get_string('hidetocdesc', 'mod_scorm'),
        array('value' => 0, 'adv' => true), scorm_get_hidetoc_array()));

    $settings->add(new admin_setting_configselect_with_advanced('scorm/nav',
        get_string('nav', 'mod_scorm'), get_string('navdesc', 'mod_scorm'),
        array('value' => SCORM_NAV_UNDER_CONTENT, 'adv' => true), scorm_get_navigation_display_array()));

    $settings->add(new admin_setting_configtext_with_advanced('scorm/navpositionleft',
        get_string('fromleft', 'mod_scorm'), get_string('navpositionleft', 'mod_scorm'),
        array('value' => -100, 'adv' => true)));

    $settings->add(new admin_setting_configtext_with_advanced('scorm/navpositiontop',
        get_string('fromtop', 'mod_scorm'), get_string('navpositiontop', 'mod_scorm'),
        array('value' => -100, 'adv' => true)));

    $settings->add(new admin_setting_configtext_with_advanced('scorm/collapsetocwinsize',
        get_string('collapsetocwinsize', 'mod_scorm'), get_string('collapsetocwinsizedesc', 'mod_scorm'),
        array('value' => 767, 'adv' => true)));

    $settings->add(new admin_setting_configselect_with_advanced('scorm/displayattemptstatus',
        get_string('displayattemptstatus', 'mod_scorm'), get_string('displayattemptstatusdesc', 'mod_scorm'),
        array('value' => 1, 'adv' => false), scorm_get_attemptstatus_array()));

    // Default grade settings.
    $settings->add(new admin_setting_heading('scorm/gradesettings', get_string('defaultgradesettings', 'mod_scorm'), ''));
    $settings->add(new admin_setting_configselect('scorm/grademethod',
        get_string('grademethod', 'mod_scorm'), get_string('grademethoddesc', 'mod_scorm'),
        GRADEHIGHEST, scorm_get_grade_method_array()));

    for ($i = 0; $i <= 100; $i++) {
        $grades[$i] = "$i";
    }

    $settings->add(new admin_setting_configselect('scorm/maxgrade',
        get_string('maximumgrade'), get_string('maximumgradedesc', 'mod_scorm'), 100, $grades));

    $settings->add(new admin_setting_heading('scorm/othersettings', get_string('defaultothersettings', 'mod_scorm'), ''));

    // Default attempts settings.
    $settings->add(new admin_setting_configselect('scorm/maxattempt',
        get_string('maximumattempts', 'mod_scorm'), '', '0', scorm_get_attempts_array()));

    $settings->add(new admin_setting_configselect('scorm/whatgrade',
        get_string('whatgrade', 'mod_scorm'), get_string('whatgradedesc', 'mod_scorm'), HIGHESTATTEMPT, scorm_get_what_grade_array()));

    $settings->add(new admin_setting_configselect('scorm/forcecompleted',
        get_string('forcecompleted', 'mod_scorm'), get_string('forcecompleteddesc', 'mod_scorm'), 0, $yesno));

    $forceattempts = scorm_get_forceattempt_array();
    $settings->add(new admin_setting_configselect('scorm/forcenewattempt',
        get_string('forcenewattempts', 'mod_scorm'), get_string('forcenewattempts_help', 'mod_scorm'), 0, $forceattempts));

    $settings->add(new admin_setting_configselect('scorm/autocommit',
    get_string('autocommit', 'mod_scorm'), get_string('autocommitdesc', 'mod_scorm'), 0, $yesno));

    $settings->add(new admin_setting_configselect('scorm/masteryoverride',
        get_string('masteryoverride', 'mod_scorm'), get_string('masteryoverridedesc', 'mod_scorm'), 1, $yesno));

    $settings->add(new admin_setting_configselect('scorm/lastattemptlock',
        get_string('lastattemptlock', 'mod_scorm'), get_string('lastattemptlockdesc', 'mod_scorm'), 0, $yesno));

    $settings->add(new admin_setting_configselect('scorm/auto',
        get_string('autocontinue', 'mod_scorm'), get_string('autocontinuedesc', 'mod_scorm'), 0, $yesno));

    $settings->add(new admin_setting_configselect('scorm/updatefreq',
        get_string('updatefreq', 'mod_scorm'), get_string('updatefreqdesc', 'mod_scorm'), 0, scorm_get_updatefreq_array()));

    // Admin level settings.
    $settings->add(new admin_setting_heading('scorm/adminsettings', get_string('adminsettings', 'mod_scorm'), ''));

    $settings->add(new admin_setting_configcheckbox('scorm/scormstandard', get_string('scormstandard', 'mod_scorm'),
                                                    get_string('scormstandarddesc', 'mod_scorm'), 0));

    $settings->add(new admin_setting_configcheckbox('scorm/allowtypeexternal', get_string('allowtypeexternal', 'mod_scorm'), '', 0));

    $settings->add(new admin_setting_configcheckbox('scorm/allowtypelocalsync', get_string('allowtypelocalsync', 'mod_scorm'), '', 0));

    $settings->add(new admin_setting_configcheckbox('scorm/allowtypeexternalaicc',
        get_string('allowtypeexternalaicc', 'mod_scorm'), get_string('allowtypeexternalaicc_desc', 'mod_scorm'), 0));

    $settings->add(new admin_setting_configcheckbox('scorm/allowaicchacp', get_string('allowtypeaicchacp', 'mod_scorm'),
                                                    get_string('allowtypeaicchacp_desc', 'mod_scorm'), 0));

    $settings->add(new admin_setting_configtext('scorm/aicchacptimeout',
        get_string('aicchacptimeout', 'mod_scorm'), get_string('aicchacptimeout_desc', 'mod_scorm'),
        30, PARAM_INT));

    $settings->add(new admin_setting_configtext('scorm/aicchacpkeepsessiondata',
        get_string('aicchacpkeepsessiondata', 'mod_scorm'), get_string('aicchacpkeepsessiondata_desc', 'mod_scorm'),
        1, PARAM_INT));

    $settings->add(new admin_setting_configcheckbox('scorm/aiccuserid', get_string('aiccuserid', 'mod_scorm'),
                                                    get_string('aiccuserid_desc', 'mod_scorm'), 1));

    $settings->add(new admin_setting_configcheckbox('scorm/forcejavascript', get_string('forcejavascript', 'mod_scorm'),
                                                    get_string('forcejavascript_desc', 'mod_scorm'), 1));

    $settings->add(new admin_setting_configcheckbox('scorm/allowapidebug', get_string('allowapidebug', 'mod_scorm'), '', 0));

    $settings->add(new admin_setting_configtext('scorm/apidebugmask', get_string('apidebugmask', 'mod_scorm'), '', '.*'));

    $settings->add(new admin_setting_configcheckbox('scorm/protectpackagedownloads', get_string('protectpackagedownloads', 'mod_scorm'),
                                                    get_string('protectpackagedownloads_desc', 'mod_scorm'), 0));

}
