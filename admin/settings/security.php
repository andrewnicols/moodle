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
 * Adds security related settings links for security category to admin tree.
 *
 * @copyright  1999 Martin Dougiamas  http://dougiamas.com
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

use core_admin\local\settings\filesize;

if ($hassiteconfig) { // speedup for non-admins, add all caps used on this page

    // "ip blocker" settingpage
    $temp = new admin_settingpage('ipblocker', new lang_string('ipblocker', 'core_admin'));
    $temp->add(new admin_setting_configcheckbox('allowbeforeblock', new lang_string('allowbeforeblock', 'core_admin'), new lang_string('allowbeforeblockdesc', 'core_admin'), 0));
    $temp->add(new admin_setting_configiplist('allowedip', new lang_string('allowediplist', 'core_admin'),
                                                new lang_string('ipblockersyntax', 'core_admin'), ''));
    $temp->add(new admin_setting_configiplist('blockedip', new lang_string('blockediplist', 'core_admin'),
                                                new lang_string('ipblockersyntax', 'core_admin'), ''));
    $ADMIN->add('security', $temp);

    // "sitepolicies" settingpage
    $temp = new admin_settingpage('sitepolicies', new lang_string('sitepolicies', 'core_admin'));
    $temp->add(new admin_setting_configcheckbox('protectusernames', new lang_string('protectusernames', 'core_admin'), new lang_string('configprotectusernames', 'core_admin'), 1));
    $temp->add(new admin_setting_configcheckbox('forcelogin', new lang_string('forcelogin', 'core_admin'), new lang_string('configforcelogin', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('forceloginforprofiles', new lang_string('forceloginforprofiles', 'core_admin'), new lang_string('configforceloginforprofiles', 'core_admin'), 1));
    $temp->add(new admin_setting_configcheckbox('forceloginforprofileimage', new lang_string('forceloginforprofileimage', 'core_admin'), new lang_string('forceloginforprofileimage_help', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('opentowebcrawlers', new lang_string('opentowebcrawlers', 'core_admin'), new lang_string('configopentowebcrawlers', 'core_admin'), 0));
    $temp->add(new admin_setting_configselect('allowindexing', new lang_string('allowindexing', 'core_admin'), new lang_string('allowindexing_desc', 'core_admin'),
        0,
        array(0 => new lang_string('allowindexingexceptlogin', 'core_admin'),
              1 => new lang_string('allowindexingeverywhere', 'core_admin'),
              2 => new lang_string('allowindexingnowhere', 'core_admin'))));
    $temp->add(new admin_setting_pickroles('profileroles',
        new lang_string('profileroles','core_admin'),
        new lang_string('configprofileroles', 'core_admin'),
        array('student', 'teacher', 'editingteacher')));

    $maxbytes = 0;
    if (!empty($CFG->maxbytes)) {
        $maxbytes = $CFG->maxbytes;
    }
    $max_upload_choices = get_max_upload_sizes(0, 0, 0, $maxbytes);
    // maxbytes set to 0 will allow the maximum server limit for uploads
    $temp->add(new admin_setting_configselect('maxbytes', new lang_string('maxbytes', 'core_admin'), new lang_string('configmaxbytes', 'core_admin'), 0, $max_upload_choices));
    // 100MB
    $defaultuserquota = 100 * filesize::UNIT_MB;
    $temp->add(new filesize('userquota', new lang_string('userquota', 'core_admin'),
            new lang_string('userquota_desc', 'core_admin'), $defaultuserquota));

    $temp->add(new admin_setting_configcheckbox('allowobjectembed', new lang_string('allowobjectembed', 'core_admin'), new lang_string('configallowobjectembed', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('enabletrusttext', new lang_string('enabletrusttext', 'core_admin'), new lang_string('configenabletrusttext', 'core_admin'), 0));
    $temp->add(new admin_setting_configselect('maxeditingtime', new lang_string('maxeditingtime','core_admin'), new lang_string('configmaxeditingtime','core_admin'), 1800,
                 array(60 => new lang_string('numminutes', '', 1),
                       300 => new lang_string('numminutes', '', 5),
                       900 => new lang_string('numminutes', '', 15),
                       1800 => new lang_string('numminutes', '', 30),
                       2700 => new lang_string('numminutes', '', 45),
                       3600 => new lang_string('numminutes', '', 60))));

    $temp->add(new admin_setting_configcheckbox('extendedusernamechars', new lang_string('extendedusernamechars', 'core_admin'), new lang_string('configextendedusernamechars', 'core_admin'), 0));

    $temp->add(new admin_setting_configcheckbox('extendedusernamechars', new lang_string('extendedusernamechars', 'core_admin'), new lang_string('configextendedusernamechars', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('keeptagnamecase', new lang_string('keeptagnamecase','core_admin'),new lang_string('configkeeptagnamecase', 'core_admin'),'1'));

    $temp->add(new admin_setting_configcheckbox('profilesforenrolledusersonly', new lang_string('profilesforenrolledusersonly','core_admin'),new lang_string('configprofilesforenrolledusersonly', 'core_admin'),'1'));

    $temp->add(new admin_setting_configcheckbox('cronclionly', new lang_string('cronclionly', 'core_admin'), new lang_string
            ('configcronclionly', 'core_admin'), 1));
    $temp->add(new admin_setting_configpasswordunmask('cronremotepassword', new lang_string('cronremotepassword', 'core_admin'), new lang_string('configcronremotepassword', 'core_admin'), ''));
    $temp->add(new admin_setting_configcheckbox('tool_task/enablerunnow', new lang_string('enablerunnow', 'tool_task'),
            new lang_string('enablerunnow_desc', 'tool_task'), 1));

    $options = array(0=>get_string('no'), 3=>3, 5=>5, 7=>7, 10=>10, 20=>20, 30=>30, 50=>50, 100=>100);
    $temp->add(new admin_setting_configselect('lockoutthreshold', new lang_string('lockoutthreshold', 'core_admin'), new lang_string('lockoutthreshold_desc', 'core_admin'), 0, $options));
    $temp->add(new admin_setting_configduration('lockoutwindow', new lang_string('lockoutwindow', 'core_admin'), new lang_string('lockoutwindow_desc', 'core_admin'), 60*30));
    $temp->add(new admin_setting_configduration('lockoutduration', new lang_string('lockoutduration', 'core_admin'), new lang_string('lockoutduration_desc', 'core_admin'), 60*30));

    $temp->add(new admin_setting_configcheckbox('passwordpolicy', new lang_string('passwordpolicy', 'core_admin'), new lang_string('configpasswordpolicy', 'core_admin'), 1));
    $temp->add(new admin_setting_configtext('minpasswordlength', new lang_string('minpasswordlength', 'core_admin'), new lang_string('configminpasswordlength', 'core_admin'), 8, PARAM_INT));
    $temp->add(new admin_setting_configtext('minpassworddigits', new lang_string('minpassworddigits', 'core_admin'), new lang_string('configminpassworddigits', 'core_admin'), 1, PARAM_INT));
    $temp->add(new admin_setting_configtext('minpasswordlower', new lang_string('minpasswordlower', 'core_admin'), new lang_string('configminpasswordlower', 'core_admin'), 1, PARAM_INT));
    $temp->add(new admin_setting_configtext('minpasswordupper', new lang_string('minpasswordupper', 'core_admin'), new lang_string('configminpasswordupper', 'core_admin'), 1, PARAM_INT));
    $temp->add(new admin_setting_configtext('minpasswordnonalphanum', new lang_string('minpasswordnonalphanum', 'core_admin'), new lang_string('configminpasswordnonalphanum', 'core_admin'), 1, PARAM_INT));
    $temp->add(new admin_setting_configtext('maxconsecutiveidentchars', new lang_string('maxconsecutiveidentchars', 'core_admin'), new lang_string('configmaxconsecutiveidentchars', 'core_admin'), 0, PARAM_INT));
    $temp->add(new admin_setting_configcheckbox('passwordpolicycheckonlogin',
        new lang_string('passwordpolicycheckonlogin', 'core_admin'),
        new lang_string('configpasswordpolicycheckonlogin', 'core_admin'), 0));

    $temp->add(new admin_setting_configtext('passwordreuselimit',
        new lang_string('passwordreuselimit', 'core_admin'),
        new lang_string('passwordreuselimit_desc', 'core_admin'), 0, PARAM_INT));

    $pwresetoptions = array(
        300 => new lang_string('numminutes', '', 5),
        900 => new lang_string('numminutes', '', 15),
        1800 => new lang_string('numminutes', '', 30),
        2700 => new lang_string('numminutes', '', 45),
        3600 => new lang_string('numminutes', '', 60),
        7200 => new lang_string('numminutes', '', 120),
        14400 => new lang_string('numminutes', '', 240)
    );
    $adminsetting = new admin_setting_configselect(
            'pwresettime',
            new lang_string('passwordresettime','core_admin'),
            new lang_string('configpasswordresettime','core_admin'),
            1800,
            $pwresetoptions);
    $temp->add($adminsetting);
    $temp->add(new admin_setting_configcheckbox('passwordchangelogout',
        new lang_string('passwordchangelogout', 'core_admin'),
        new lang_string('passwordchangelogout_desc', 'core_admin'), 0));

    $temp->add(new admin_setting_configcheckbox('passwordchangetokendeletion',
        new lang_string('passwordchangetokendeletion', 'core_admin'),
        new lang_string('passwordchangetokendeletion_desc', 'core_admin'), 0));

    $temp->add(new admin_setting_configduration('tokenduration',
        new lang_string('tokenduration', 'core_admin'),
        new lang_string('tokenduration_desc', 'core_admin'), 12 * WEEKSECS, WEEKSECS));

    $temp->add(new admin_setting_configcheckbox('groupenrolmentkeypolicy', new lang_string('groupenrolmentkeypolicy', 'core_admin'), new lang_string('groupenrolmentkeypolicy_desc', 'core_admin'), 1));
    $temp->add(new admin_setting_configcheckbox('disableuserimages', new lang_string('disableuserimages', 'core_admin'), new lang_string('configdisableuserimages', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('emailchangeconfirmation', new lang_string('emailchangeconfirmation', 'core_admin'), new lang_string('configemailchangeconfirmation', 'core_admin'), 1));
    $temp->add(new admin_setting_configselect('rememberusername', new lang_string('rememberusername','core_admin'), new lang_string('rememberusername_desc','core_admin'), 2, array(1=>new lang_string('yes'), 0=>new lang_string('no'), 2=>new lang_string('optional'))));
    $temp->add(new admin_setting_configcheckbox('strictformsrequired', new lang_string('strictformsrequired', 'core_admin'), new lang_string('configstrictformsrequired', 'core_admin'), 0));

    $temp->add(new admin_setting_heading('adminpresets', new lang_string('siteadminpresetspluginname', 'core_adminpresets'), ''));
    $sensiblesettingsdefault = 'recaptchapublickey@@none, recaptchaprivatekey@@none, googlemapkey3@@none, ';
    $sensiblesettingsdefault .= 'secretphrase@@url, cronremotepassword@@none, smtpuser@@none, ';
    $sensiblesettingsdefault .= 'smtppass@@none, proxypassword@@none, quizpassword@@quiz, allowedip@@none, blockedip@@none, ';
    $sensiblesettingsdefault .= 'dbpass@@logstore_database, messageinbound_hostpass@@none, ';
    $sensiblesettingsdefault .= 'bind_pw@@auth_cas, pass@@auth_db, bind_pw@@auth_ldap, ';
    $sensiblesettingsdefault .= 'dbpass@@enrol_database, bind_pw@@enrol_ldap, ';
    $sensiblesettingsdefault .= 'server_password@@search_solr, ssl_keypassword@@search_solr, ';
    $sensiblesettingsdefault .= 'alternateserver_password@@search_solr, alternatessl_keypassword@@search_solr, ';
    $sensiblesettingsdefault .= 'test_password@@cachestore_redis, password@@mlbackend_python, ';
    $sensiblesettingsdefault .= 'badges_badgesalt@@none, calendar_exportsalt@@none';
    $temp->add(new admin_setting_configtextarea('adminpresets/sensiblesettings',
            get_string('sensiblesettings', 'core_adminpresets'),
            get_string('sensiblesettingstext', 'core_adminpresets'),
            $sensiblesettingsdefault, PARAM_TEXT));

    $ADMIN->add('security', $temp);

    // "httpsecurity" settingpage
    $temp = new admin_settingpage('httpsecurity', new lang_string('httpsecurity', 'core_admin'));

    $temp->add(new admin_setting_configcheckbox('cookiesecure', new lang_string('cookiesecure', 'core_admin'), new lang_string('configcookiesecure', 'core_admin'), 1));
    $temp->add(new admin_setting_configcheckbox('allowframembedding', new lang_string('allowframembedding', 'core_admin'), new lang_string('allowframembedding_help', 'core_admin'), 0));

    // Settings elements used by the \core\files\curl_security_helper class.
    $blockedhostsdefault = [
        '127.0.0.0/8',
        '192.168.0.0/16',
        '10.0.0.0/8',
        '172.16.0.0/12',
        '0.0.0.0',
        'localhost',
        '169.254.169.254',
        '0000::1',
    ];
    $allowedportsdefault = ['443', '80'];

    // By default, block various common internal network or cloud provider hosts.
    $temp->add(new admin_setting_configmixedhostiplist('curlsecurityblockedhosts',
        new lang_string('curlsecurityblockedhosts', 'core_admin'),
        new lang_string('curlsecurityblockedhostssyntax', 'core_admin'), implode(PHP_EOL, $blockedhostsdefault)));

    // By default, only allow web ports.
    $temp->add(new admin_setting_configportlist('curlsecurityallowedport',
        new lang_string('curlsecurityallowedport', 'core_admin'),
        new lang_string('curlsecurityallowedportsyntax', 'core_admin'), implode(PHP_EOL, $allowedportsdefault)));

    // HTTP Header referrer policy settings.
    $referreroptions = [
        'default' => get_string('referrernone', 'core_admin'),
        'no-referrer' => 'no-referrer',
        'no-referrer-when-downgrade' => 'no-referrer-when-downgrade',
        'origin' => 'origin',
        'origin-when-cross-origin' => 'origin-when-cross-origin',
        'same-origin' => 'same-origin',
        'strict-origin' => 'strict-origin',
        'strict-origin-when-cross-origin' => 'strict-origin-when-cross-origin',
        'unsafe-url' => 'unsafe-url',
    ];
    $temp->add(new admin_setting_configselect('referrerpolicy',
            new lang_string('referrerpolicy', 'core_admin'),
            new lang_string('referrerpolicydesc', 'core_admin'), 'default', $referreroptions));

    $ADMIN->add('security', $temp);

    // "notifications" settingpage
    $temp = new admin_settingpage('notifications', new lang_string('notifications', 'core_admin'));
    $temp->add(new admin_setting_configcheckbox('displayloginfailures', new lang_string('displayloginfailures', 'core_admin'),
            new lang_string('configdisplayloginfailures', 'core_admin'), 0));
    $temp->add(new admin_setting_users_with_capability('notifyloginfailures', new lang_string('notifyloginfailures', 'core_admin'), new lang_string('confignotifyloginfailures', 'core_admin'), array(), 'moodle/site:config'));
    $options = array();
    for ($i = 1; $i <= 100; $i++) {
        $options[$i] = $i;
    }
    $temp->add(new admin_setting_configselect('notifyloginthreshold', new lang_string('notifyloginthreshold', 'core_admin'), new lang_string('confignotifyloginthreshold', 'core_admin'), '10', $options));
    $ADMIN->add('security', $temp);
} // end of speedup
