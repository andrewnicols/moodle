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
    $settings->add(new admin_setting_heading('chat_method_heading', get_string('generalconfig', 'mod_chat'),
                       get_string('explaingeneralconfig', 'mod_chat')));

    $options = array();
    $options['ajax']      = get_string('methodajax', 'mod_chat');
    $options['header_js'] = get_string('methodnormal', 'mod_chat');
    $options['sockets']   = get_string('methoddaemon', 'mod_chat');
    $settings->add(new admin_setting_configselect('chat_method', get_string('method', 'mod_chat'),
                       get_string('configmethod', 'mod_chat'), 'ajax', $options));

    $settings->add(new admin_setting_configtext('chat_refresh_userlist', get_string('refreshuserlist', 'mod_chat'),
                       get_string('configrefreshuserlist', 'mod_chat'), 10, PARAM_INT));

    $settings->add(new admin_setting_configtext('chat_old_ping', get_string('oldping', 'mod_chat'),
                       get_string('configoldping', 'mod_chat'), 35, PARAM_INT));

    $settings->add(new admin_setting_heading('chat_normal_heading', get_string('methodnormal', 'mod_chat'),
                       get_string('explainmethodnormal', 'mod_chat')));

    $settings->add(new admin_setting_configtext('chat_refresh_room', get_string('refreshroom', 'mod_chat'),
                       get_string('configrefreshroom', 'mod_chat'), 5, PARAM_INT));

    $options = array();
    $options['jsupdate']  = get_string('normalkeepalive', 'mod_chat');
    $options['jsupdated'] = get_string('normalstream', 'mod_chat');
    $settings->add(new admin_setting_configselect('chat_normal_updatemode', get_string('updatemethod', 'mod_chat'),
                       get_string('confignormalupdatemode', 'mod_chat'), 'jsupdate', $options));

    $settings->add(new admin_setting_heading('chat_daemon_heading', get_string('methoddaemon', 'mod_chat'),
                       get_string('explainmethoddaemon', 'mod_chat')));

    $settings->add(new admin_setting_configtext('chat_serverhost', get_string('serverhost', 'mod_chat'),
                       get_string('configserverhost', 'mod_chat'), get_host_from_url($CFG->wwwroot)));

    $settings->add(new admin_setting_configtext('chat_serverip', get_string('serverip', 'mod_chat'),
                       get_string('configserverip', 'mod_chat'), '127.0.0.1'));

    $settings->add(new admin_setting_configtext('chat_serverport', get_string('serverport', 'mod_chat'),
                       get_string('configserverport', 'mod_chat'), 9111, PARAM_INT));

    $settings->add(new admin_setting_configtext('chat_servermax', get_string('servermax', 'mod_chat'),
                       get_string('configservermax', 'mod_chat'), 100, PARAM_INT));
}
