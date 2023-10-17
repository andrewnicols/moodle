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
 * Url module admin settings and defaults
 *
 * @package    mod_url
 * @copyright  2009 Petr Skoda  {@link http://skodak.org}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die;

if ($ADMIN->fulltree) {
    require_once("$CFG->libdir/resourcelib.php");

    $displayoptions = resourcelib_get_displayoptions(array(RESOURCELIB_DISPLAY_AUTO,
                                                           RESOURCELIB_DISPLAY_EMBED,
                                                           RESOURCELIB_DISPLAY_FRAME,
                                                           RESOURCELIB_DISPLAY_OPEN,
                                                           RESOURCELIB_DISPLAY_NEW,
                                                           RESOURCELIB_DISPLAY_POPUP,
                                                          ));
    $defaultdisplayoptions = array(RESOURCELIB_DISPLAY_AUTO,
                                   RESOURCELIB_DISPLAY_EMBED,
                                   RESOURCELIB_DISPLAY_OPEN,
                                   RESOURCELIB_DISPLAY_POPUP,
                                  );

    //--- general settings -----------------------------------------------------------------------------------
    $settings->add(new admin_setting_configtext('url/framesize',
        get_string('framesize', 'mod_url'), get_string('configframesize', 'mod_url'), 130, PARAM_INT));
    $settings->add(new admin_setting_configpasswordunmask('url/secretphrase', get_string('password'),
        get_string('configsecretphrase', 'mod_url'), ''));
    $settings->add(new admin_setting_configcheckbox('url/rolesinparams',
        get_string('rolesinparams', 'mod_url'), get_string('configrolesinparams', 'mod_url'), false));
    $settings->add(new admin_setting_configmultiselect('url/displayoptions',
        get_string('displayoptions', 'mod_url'), get_string('configdisplayoptions', 'mod_url'),
        $defaultdisplayoptions, $displayoptions));

    //--- modedit defaults -----------------------------------------------------------------------------------
    $settings->add(new admin_setting_heading('urlmodeditdefaults', get_string('modeditdefaults', 'core_admin'), get_string('condifmodeditdefaults', 'core_admin')));

    $settings->add(new admin_setting_configcheckbox('url/printintro',
        get_string('printintro', 'mod_url'), get_string('printintroexplain', 'mod_url'), 1));
    $settings->add(new admin_setting_configselect('url/display',
        get_string('displayselect', 'mod_url'), get_string('displayselectexplain', 'mod_url'), RESOURCELIB_DISPLAY_AUTO, $displayoptions));
    $settings->add(new admin_setting_configtext('url/popupwidth',
        get_string('popupwidth', 'mod_url'), get_string('popupwidthexplain', 'mod_url'), 620, PARAM_INT, 7));
    $settings->add(new admin_setting_configtext('url/popupheight',
        get_string('popupheight', 'mod_url'), get_string('popupheightexplain', 'mod_url'), 450, PARAM_INT, 7));
}
