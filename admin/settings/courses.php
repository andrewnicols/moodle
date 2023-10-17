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
 * This file defines settingpages and externalpages under the "courses" category
 *
 * @package core
 * @copyright 2002 onwards Martin Dougiamas (http://dougiamas.com)
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/pdflib.php');

use core_admin\local\settings\filesize;

$capabilities = array(
    'moodle/backup:backupcourse',
    'moodle/category:manage',
    'moodle/course:create',
    'moodle/site:approvecourse',
    'moodle/restore:restorecourse'
);
if ($hassiteconfig or has_any_capability($capabilities, $systemcontext)) {
    // Speedup for non-admins, add all caps used on this page.
    $ADMIN->add('courses',
        new admin_externalpage('coursemgmt', new lang_string('coursemgmt', 'core_admin'),
            $CFG->wwwroot . '/course/management.php',
            array('moodle/category:manage', 'moodle/course:create')
        )
    );
    $ADMIN->add('courses',
        new admin_externalpage('addcategory', new lang_string('addcategory', 'core_admin'),
            new moodle_url('/course/editcategory.php', array('parent' => 0)),
            array('moodle/category:manage')
        )
    );
    $ADMIN->add('courses',
        new admin_externalpage('addnewcourse', new lang_string('addnewcourse'),
            new moodle_url('/course/edit.php', array('category' => 0)),
            array('moodle/category:manage')
        )
    );
    $ADMIN->add('courses',
        new admin_externalpage('restorecourse', new lang_string('restorecourse', 'core_admin'),
            new moodle_url('/backup/restorefile.php', array('contextid' => context_system::instance()->id)),
            array('moodle/restore:restorecourse')
        )
    );

    // Download course content.
    $downloadcoursedefaulturl = new moodle_url('/admin/settings.php', ['section' => 'coursesettings']);
    $temp = new admin_settingpage('downloadcoursecontent', new lang_string('downloadcoursecontent', 'core_course'));
    $temp->add(new admin_setting_configcheckbox('downloadcoursecontentallowed',
            new lang_string('downloadcoursecontentallowed', 'core_admin'),
            new lang_string('downloadcoursecontentallowed_desc', 'core_admin', $downloadcoursedefaulturl->out()), 0));

    // 50MB default maximum size per file when downloading course content.
    $defaultmaxdownloadsize = 50 * filesize::UNIT_MB;
    $temp->add(new filesize('maxsizeperdownloadcoursefile', new lang_string('maxsizeperdownloadcoursefile', 'core_admin'),
            new lang_string('maxsizeperdownloadcoursefile_desc', 'core_admin'), $defaultmaxdownloadsize, filesize::UNIT_MB));
    $temp->hide_if('maxsizeperdownloadcoursefile', 'downloadcoursecontentallowed');

    $ADMIN->add('courses', $temp);

    // "courserequests" settingpage.
    $temp = new admin_settingpage('courserequest', new lang_string('courserequest'));
    $temp->add(new admin_setting_configcheckbox('enablecourserequests',
        new lang_string('enablecourserequests', 'core_admin'),
        new lang_string('configenablecourserequests', 'core_admin'), 1));
    $temp->add(new admin_settings_coursecat_select('defaultrequestcategory',
        new lang_string('defaultrequestcategory', 'core_admin'),
        new lang_string('configdefaultrequestcategory', 'core_admin'), 1));
    $temp->add(new admin_setting_configcheckbox('lockrequestcategory',
        new lang_string('lockrequestcategory', 'core_admin'),
        new lang_string('configlockrequestcategory', 'core_admin'), 0));
    $temp->add(new admin_setting_users_with_capability(
        'courserequestnotify',
        new lang_string('courserequestnotify', 'core_admin'),
        new lang_string('configcourserequestnotify2', 'core_admin'),
        [],
        'moodle/site:approvecourse'
    ));
    $ADMIN->add('courses', $temp);

    // Pending course requests.
    if (!empty($CFG->enablecourserequests)) {
        $ADMIN->add('courses', new admin_externalpage('coursespending', new lang_string('pendingrequests'),
                $CFG->wwwroot . '/course/pending.php', array('moodle/site:approvecourse')));
    }

    // Add a category for the course Default settings.
    $ADMIN->add('courses', new admin_category('coursedefaultsettings', new lang_string('defaultsettingscategory', 'core_course')));
    // Course Default Settings Page.
    // NOTE: these settings must be applied after all other settings because they depend on them.

    // Main course settings.
    $temp = new admin_settingpage('coursesettings', new lang_string('coursesettings'));
    require_once($CFG->dirroot.'/course/lib.php');

    $choices = array();
    $choices['0'] = new lang_string('hide');
    $choices['1'] = new lang_string('show');
    $temp->add(new admin_setting_configselect('moodlecourse/visible', new lang_string('visible'), new lang_string('visible_help'),
        1, $choices));

    // Enable/disable download course content.
    $choices = [
        DOWNLOAD_COURSE_CONTENT_DISABLED => new lang_string('no'),
        DOWNLOAD_COURSE_CONTENT_ENABLED => new lang_string('yes'),
    ];
    $downloadcontentsitedefault = new admin_setting_configselect('moodlecourse/downloadcontentsitedefault',
            new lang_string('enabledownloadcoursecontent', 'core_course'),
            new lang_string('downloadcoursecontent_help', 'core_course'), 0, $choices);
    $downloadcontentsitedefault->add_dependent_on('downloadcoursecontentallowed');
    $temp->add($downloadcontentsitedefault);

    $temp->add(
            new admin_setting_configtext(
                'moodlecourse/participantsperpage',
                new lang_string('participants:perpage', 'core_course'),
                new lang_string('participants:perpage_help', 'core_course'),
                20
            )
        );

    // Course format.
    $temp->add(new admin_setting_heading('courseformathdr', new lang_string('type_format', 'mod_plugin'), ''));

    $courseformats = get_sorted_course_formats(true);
    $formcourseformats = array();
    foreach ($courseformats as $courseformat) {
        $formcourseformats[$courseformat] = new lang_string('pluginname', "format_$courseformat");
    }
    $temp->add(new admin_setting_configselect('moodlecourse/format', new lang_string('format'), new lang_string('coursehelpformat'),
        'topics', $formcourseformats));

    $temp->add(new admin_setting_configtext('moodlecourse/maxsections', new lang_string('maxnumberweeks'),
        new lang_string('maxnumberweeks_desc'), 52));

    $temp->add(new admin_settings_num_course_sections('moodlecourse/numsections', new lang_string('numberweeks'),
        new lang_string('coursehelpnumberweeks'), 4));

    $choices = array();
    $choices['0'] = new lang_string('hiddensectionscollapsed');
    $choices['1'] = new lang_string('hiddensectionsinvisible');
    $temp->add(new admin_setting_configselect('moodlecourse/hiddensections', new lang_string('hiddensections'),
        new lang_string('coursehelphiddensections'), 1, $choices));

    $choices = array();
    $choices[COURSE_DISPLAY_SINGLEPAGE] = new lang_string('coursedisplay_single');
    $choices[COURSE_DISPLAY_MULTIPAGE] = new lang_string('coursedisplay_multi');
    $temp->add(new admin_setting_configselect('moodlecourse/coursedisplay', new lang_string('coursedisplay'),
        new lang_string('coursedisplay_help'), COURSE_DISPLAY_SINGLEPAGE, $choices));

    $temp->add(new admin_setting_configcheckbox('moodlecourse/courseenddateenabled', get_string('courseenddateenabled'),
        get_string('courseenddateenabled_desc'), 1));

    $temp->add(new admin_setting_configduration('moodlecourse/courseduration', get_string('courseduration'),
        get_string('courseduration_desc'), YEARSECS));

    // Appearance.
    $temp->add(new admin_setting_heading('appearancehdr', new lang_string('appearance'), ''));

    $languages = array();
    $languages[''] = new lang_string('forceno');
    $languages += get_string_manager()->get_list_of_translations();
    $temp->add(new admin_setting_configselect('moodlecourse/lang', new lang_string('forcelanguage'), '', key($languages),
        $languages));

    $options = range(0, 10);
    $temp->add(new admin_setting_configselect('moodlecourse/newsitems', new lang_string('newsitemsnumber'),
        new lang_string('coursehelpnewsitemsnumber'), 5, $options));
    $temp->add(new admin_setting_configselect('moodlecourse/showgrades', new lang_string('showgrades'),
        new lang_string('coursehelpshowgrades'), 1, array(0 => new lang_string('no'), 1 => new lang_string('yes'))));
    $temp->add(new admin_setting_configselect('moodlecourse/showreports', new lang_string('showreports'), '', 0,
        array(0 => new lang_string('no'), 1 => new lang_string('yes'))));
    $temp->add(new admin_setting_configselect('moodlecourse/showactivitydates',
        new lang_string('showactivitydates'),
        new lang_string('showactivitydates_help'), 1, [
            0 => new lang_string('no'),
            1 => new lang_string('yes')
        ]
    ));

    // Files and uploads.
    $temp->add(new admin_setting_heading('filesanduploadshdr', new lang_string('filesanduploads'), ''));

    if (!empty($CFG->legacyfilesinnewcourses)) {
        $choices = array('0'=>new lang_string('no'), '2'=>new lang_string('yes'));
        $temp->add(new admin_setting_configselect('moodlecourse/legacyfiles', new lang_string('courselegacyfiles'),
            new lang_string('courselegacyfiles_help'), key($choices), $choices));
    }

    $currentmaxbytes = get_config('moodlecourse', 'maxbytes');
    if (isset($CFG->maxbytes)) {
        $choices = get_max_upload_sizes($CFG->maxbytes, 0, 0, $currentmaxbytes);
    } else {
        $choices = get_max_upload_sizes(0, 0, 0, $currentmaxbytes);
    }
    $temp->add(new admin_setting_configselect('moodlecourse/maxbytes', new lang_string('maximumupload'),
        new lang_string('coursehelpmaximumupload'), key($choices), $choices));

    if (!empty($CFG->enablepdfexportfont)) {
        $pdf = new \pdf;
        $fontlist = $pdf->get_export_fontlist();
        // Show the option if the font is defined more than one.
        if (count($fontlist) > 1) {
            $temp->add(new admin_setting_configselect('moodlecourse/pdfexportfont',
                new lang_string('pdfexportfont', 'core_course'),
                new lang_string('pdfexportfont_help', 'core_course'),
                'freesans', $fontlist
            ));
        }
    }

    // Completion tracking.
    $temp->add(new admin_setting_heading('progress', new lang_string('completion','core_completion'), ''));
    $temp->add(new admin_setting_configselect('moodlecourse/enablecompletion', new lang_string('completion', 'core_completion'),
        new lang_string('enablecompletion_help', 'core_completion'), 1, array(0 => new lang_string('no'), 1 => new lang_string('yes'))));

    // Display completion conditions.
    $temp->add(new admin_setting_configselect('moodlecourse/showcompletionconditions',
        new lang_string('showcompletionconditions', 'core_completion'),
        new lang_string('showcompletionconditions_help', 'core_completion'), 1, [
            0 => new lang_string('no'),
            1 => new lang_string('yes')
        ]
    ));

    // Groups.
    $temp->add(new admin_setting_heading('groups', new lang_string('groups', 'core_group'), ''));
    $choices = array();
    $choices[NOGROUPS] = new lang_string('groupsnone', 'core_group');
    $choices[SEPARATEGROUPS] = new lang_string('groupsseparate', 'core_group');
    $choices[VISIBLEGROUPS] = new lang_string('groupsvisible', 'core_group');
    $temp->add(new admin_setting_configselect('moodlecourse/groupmode', new lang_string('groupmode'), '', key($choices),$choices));
    $temp->add(new admin_setting_configselect('moodlecourse/groupmodeforce', new lang_string('force'), new lang_string('coursehelpforce'), 0,array(0 => new lang_string('no'), 1 => new lang_string('yes'))));

    // Communication.
    $temp->add(new admin_setting_heading('communication',
        new lang_string('communication', 'core_communication'), ''));

    list($communicationproviders, $defaulprovider) = \core_communication\api::
        get_enabled_providers_and_default();

    $temp->add(new admin_setting_configselect('moodlecourse/coursecommunicationprovider',
        new lang_string('selectcommunicationprovider', 'core_communication'),
        new lang_string('coursecommunication_desc', 'core_course'),
        $defaulprovider, $communicationproviders));

    $ADMIN->add('coursedefaultsettings', $temp);
    if (!empty($CFG->enablecompletion)) {
        $ADMIN->add('coursedefaultsettings', new admin_externalpage(
                'sitedefaultcompletion',
                new lang_string('defaultcompletion', 'core_completion'),
                new moodle_url('/course/defaultcompletion.php', ['id' => $SITE->id]),
                ['moodle/course:manageactivities'])
        );
    }
    $ADMIN->add('coursedefaultsettings', new admin_externalpage(
        'course_customfield',
        new lang_string('course_customfield', 'core_admin'),
        $CFG->wwwroot . '/course/customfield.php',
        ['moodle/course:configurecustomfields'])
    );

    $temp = new admin_settingpage('activitychoosersettings', new lang_string('activitychoosersettings', 'core_course'));
    // Tab mode for the activity chooser.
    $temp->add(
        new admin_setting_configselect(
            'activitychoosertabmode',
            new lang_string('activitychoosertabmode', 'core_course'),
            new lang_string('activitychoosertabmode_desc', 'core_course'),
            3,
            [
                3 => new lang_string('activitychoosertabmodefour', 'core_course'),
                4 => new lang_string('activitychoosertabmodefive', 'core_course'),
                5 => new lang_string('activitychoosertabmodesix', 'core_course'),
                0 => new lang_string('activitychoosertabmodeone', 'core_course'),
                1 => new lang_string('activitychoosertabmodetwo', 'core_course'),
                2 => new lang_string('activitychoosertabmodethree', 'core_course'),
            ]
        )
    );

    // Add a category for the Groups.
    $ADMIN->add('courses', new admin_category('groups', new lang_string('groups')));
    $ADMIN->add(
        'groups',
        new admin_externalpage(
            'group_customfield',
            new lang_string('group_customfield', 'core_admin'),
            $CFG->wwwroot . '/group/customfield.php',
            ['moodle/group:configurecustomfields']
        )
    );
    $ADMIN->add(
        'groups',
        new admin_externalpage(
            'grouping_customfield',
            new lang_string('grouping_customfield', 'core_admin'),
            $CFG->wwwroot . '/group/grouping_customfield.php',
            ['moodle/group:configurecustomfields']
        )
    );

    // Add a category for the Activity Chooser.
    $ADMIN->add('courses', new admin_category('activitychooser', new lang_string('activitychoosercategory', 'core_course')));
    $temp = new admin_settingpage('activitychoosersettings', new lang_string('activitychoosersettings', 'core_course'));
    // Tab mode for the activity chooser.
    $temp->add(
        new admin_setting_configselect(
            'activitychoosertabmode',
            new lang_string('activitychoosertabmode', 'core_course'),
            new lang_string('activitychoosertabmode_desc', 'core_course'),
            3,
            [
                3 => new lang_string('activitychoosertabmodefour', 'core_course'),
                4 => new lang_string('activitychoosertabmodefive', 'core_course'),
                5 => new lang_string('activitychoosertabmodesix', 'core_course'),
                0 => new lang_string('activitychoosertabmodeone', 'core_course'),
                1 => new lang_string('activitychoosertabmodetwo', 'core_course'),
                2 => new lang_string('activitychoosertabmodethree', 'core_course'),
            ]
        )
    );

    // Build a list of plugins that use the footer callback.
    $pluginswithfunction = get_plugins_with_function('custom_chooser_footer', 'lib.php');
    $pluginsoptions = [];
    $pluginsoptions[COURSE_CHOOSER_FOOTER_NONE] = get_string('activitychooserhidefooter', 'core_course');
    if ($pluginswithfunction) {
        foreach ($pluginswithfunction as $plugintype => $plugins) {
            foreach ($plugins as $pluginname => $pluginfunction) {
                $plugin = $plugintype.'_'.$pluginname;
                $pluginsoptions[$plugin] = get_string('pluginname', $plugin);
            }
        }
    }

    // Select what plugin to show in the footer.
    $temp->add(
        new admin_setting_configselect(
            'activitychooseractivefooter',
            new lang_string('activitychooseractivefooter', 'core_course'),
            new lang_string('activitychooseractivefooter_desc', 'core_course'),
            COURSE_CHOOSER_FOOTER_NONE,
            $pluginsoptions
        )
    );

    $ADMIN->add('activitychooser', $temp);
    $ADMIN->add('activitychooser',
        new admin_externalpage('activitychooserrecommended', new lang_string('activitychooserrecommendations', 'core_course'),
            new moodle_url('/course/recommendations.php'),
            array('moodle/course:recommendactivity')
        )
    );

    // Add a category for backups.
    $ADMIN->add('courses', new admin_category('backups', new lang_string('backups','core_admin')));

    // Create a page for general backups configuration and defaults.
    $temp = new admin_settingpage('backupgeneralsettings', new lang_string('generalbackdefaults', 'core_backup'), 'moodle/backup:backupcourse');

    // General configuration section.
    $temp->add(new admin_setting_configselect('backup/loglifetime', new lang_string('loglifetime', 'core_backup'), new lang_string('configloglifetime', 'core_backup'), 30, array(
        1   => new lang_string('numdays', '', 1),
        2   => new lang_string('numdays', '', 2),
        3   => new lang_string('numdays', '', 3),
        5   => new lang_string('numdays', '', 5),
        7   => new lang_string('numdays', '', 7),
        10  => new lang_string('numdays', '', 10),
        14  => new lang_string('numdays', '', 14),
        20  => new lang_string('numdays', '', 20),
        30  => new lang_string('numdays', '', 30),
        60  => new lang_string('numdays', '', 60),
        90  => new lang_string('numdays', '', 90),
        120 => new lang_string('numdays', '', 120),
        180 => new lang_string('numdays', '', 180),
        365 => new lang_string('numdays', '', 365)
    )));

    // General defaults section.
    $temp->add(new admin_setting_heading('generalsettings', new lang_string('generalsettings', 'core_backup'), ''));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_users', new lang_string('generalusers','core_backup'), new lang_string('configgeneralusers','core_backup'), array('value'=>1, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_anonymize', new lang_string('generalanonymize','core_backup'), new lang_string('configgeneralanonymize','core_backup'), array('value'=>0, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_role_assignments', new lang_string('generalroleassignments','core_backup'), new lang_string('configgeneralroleassignments','core_backup'), array('value'=>1, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_activities', new lang_string('generalactivities','core_backup'), new lang_string('configgeneralactivities','core_backup'), array('value'=>1, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_blocks', new lang_string('generalblocks','core_backup'), new lang_string('configgeneralblocks','core_backup'), array('value'=>1, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock(
            'backup/backup_general_files',
            new lang_string('generalfiles', 'core_backup'),
            new lang_string('configgeneralfiles', 'core_backup'),
            array('value' => '1', 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_filters', new lang_string('generalfilters','core_backup'), new lang_string('configgeneralfilters','core_backup'), array('value'=>1, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_comments', new lang_string('generalcomments','core_backup'), new lang_string('configgeneralcomments','core_backup'), array('value'=>1, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_badges', new lang_string('generalbadges','core_backup'), new lang_string('configgeneralbadges','core_backup'), array('value'=>1,'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_calendarevents', new lang_string('generalcalendarevents','core_backup'), new lang_string('configgeneralcalendarevents','core_backup'), array('value'=>1, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_userscompletion', new lang_string('generaluserscompletion','core_backup'), new lang_string('configgeneraluserscompletion','core_backup'), array('value'=>1, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_logs', new lang_string('generallogs','core_backup'), new lang_string('configgenerallogs','core_backup'), array('value'=>0, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_histories', new lang_string('generalhistories','core_backup'), new lang_string('configgeneralhistories','core_backup'), array('value'=>0, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_questionbank', new lang_string('generalquestionbank','core_backup'), new lang_string('configgeneralquestionbank','core_backup'), array('value'=>1, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_groups',
            new lang_string('generalgroups', 'core_backup'), new lang_string('configgeneralgroups', 'core_backup'),
            array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_competencies', new lang_string('generalcompetencies','core_backup'), new lang_string('configgeneralcompetencies','core_backup'), array('value'=>1, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_contentbankcontent',
        new lang_string('generalcontentbankcontent', 'core_backup'),
        new lang_string('configgeneralcontentbankcontent', 'core_backup'),
        ['value' => 1, 'locked' => 0])
    );
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_xapistate',
        new lang_string('generalxapistate', 'core_backup'),
        new lang_string('configgeneralxapistate', 'core_backup'),
        ['value' => 1, 'locked' => 0])
    );


    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_general_legacyfiles',
        new lang_string('generallegacyfiles', 'core_backup'),
        new lang_string('configlegacyfiles', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $ADMIN->add('backups', $temp);

    // Create a page for general import configuration and defaults.
    $temp = new admin_settingpage('importgeneralsettings', new lang_string('importgeneralsettings', 'core_backup'), 'moodle/backup:backupcourse');
    $temp->add(new admin_setting_configtext('backup/import_general_maxresults', new lang_string('importgeneralmaxresults', 'core_backup'), new lang_string('importgeneralmaxresults_desc', 'core_backup'), 10));
    $temp->add(new admin_setting_configcheckbox('backup/import_general_duplicate_admin_allowed',
            new lang_string('importgeneralduplicateadminallowed', 'core_backup'),
            new lang_string('importgeneralduplicateadminallowed_desc', 'core_backup'), 0));

    // Import defaults section.
    $temp->add(new admin_setting_heading('importsettings', new lang_string('importsettings', 'core_backup'), ''));
    $temp->add(new admin_setting_configcheckbox_with_lock(
            'backup/backup_import_permissions',
            new lang_string('generalpermissions', 'core_backup'),
            new lang_string('configgeneralpermissions', 'core_backup'),
            array('value' => 0, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_import_activities', new lang_string('generalactivities','core_backup'), new lang_string('configgeneralactivities','core_backup'), array('value'=>1, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_import_blocks', new lang_string('generalblocks','core_backup'), new lang_string('configgeneralblocks','core_backup'), array('value'=>1, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_import_filters', new lang_string('generalfilters','core_backup'), new lang_string('configgeneralfilters','core_backup'), array('value'=>1, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_import_calendarevents', new lang_string('generalcalendarevents','core_backup'), new lang_string('configgeneralcalendarevents','core_backup'), array('value'=>1, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_import_questionbank', new lang_string('generalquestionbank','core_backup'), new lang_string('configgeneralquestionbank','core_backup'), array('value'=>1, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_import_groups',
            new lang_string('generalgroups', 'core_backup'), new lang_string('configgeneralgroups', 'core_backup'),
            array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_import_competencies', new lang_string('generalcompetencies','core_backup'), new lang_string('configgeneralcompetencies','core_backup'), array('value'=>1, 'locked'=>0)));
    $temp->add(new admin_setting_configcheckbox_with_lock(
        'backup/backup_import_contentbankcontent',
        new lang_string('generalcontentbankcontent', 'core_backup'),
        new lang_string('configgeneralcontentbankcontent', 'core_backup'),
        ['value' => 1, 'locked' => 0])
    );
    $temp->add(new admin_setting_configcheckbox_with_lock('backup/backup_import_legacyfiles',
        new lang_string('generallegacyfiles', 'core_backup'),
        new lang_string('configlegacyfiles', 'core_backup'), array('value' => 1, 'locked' => 0)));

    $ADMIN->add('backups', $temp);

    // Create a page for automated backups configuration and defaults.
    $temp = new admin_settingpage('automated', new lang_string('automatedsetup','core_backup'), 'moodle/backup:backupcourse');

    // Automated configuration section.
    $temp->add(new admin_setting_configselect('backup/backup_auto_active', new lang_string('active'),  new lang_string('autoactivedescription', 'core_backup'), 0, array(
        0 => new lang_string('autoactivedisabled', 'core_backup'),
        1 => new lang_string('autoactiveenabled', 'core_backup'),
        2 => new lang_string('autoactivemanual', 'core_backup')
    )));
    $temp->add(new admin_setting_special_backupdays());
    $temp->add(new admin_setting_configtime('backup/backup_auto_hour', 'backup_auto_minute', new lang_string('executeat'),
            new lang_string('backupexecuteathelp'), array('h' => 0, 'm' => 0)));
    $storageoptions = array(
        0 => new lang_string('storagecourseonly', 'core_backup'),
        1 => new lang_string('storageexternalonly', 'core_backup'),
        2 => new lang_string('storagecourseandexternal', 'core_backup')
    );
    $temp->add(new admin_setting_configselect('backup/backup_auto_storage', new lang_string('automatedstorage', 'core_backup'), new lang_string('automatedstoragehelp', 'core_backup'), 0, $storageoptions));
    $temp->add(new admin_setting_special_backup_auto_destination());

    $maxkeptoptions = array(
        0 => new lang_string('all'), 1 => '1',
        2 => '2',
        3 => '3',
        4 => '4',
        5 => '5',
        10 => '10',
        20 => '20',
        30 => '30',
        40 => '40',
        50 => '50',
        100 => '100',
        200 => '200',
        300 => '300',
        400 => '400',
        500 => '500');
    $temp->add(new admin_setting_configselect('backup/backup_auto_max_kept', new lang_string('automatedmaxkept', 'core_backup'),
            new lang_string('automatedmaxkepthelp', 'core_backup'), 1, $maxkeptoptions));

    $automateddeletedaysoptions = array(
        0 => new lang_string('never'),
        1000 => new lang_string('numdays', '', 1000),
        365  => new lang_string('numdays', '', 365),
        180  => new lang_string('numdays', '', 180),
        150  => new lang_string('numdays', '', 150),
        120  => new lang_string('numdays', '', 120),
        90   => new lang_string('numdays', '', 90),
        60   => new lang_string('numdays', '', 60),
        35   => new lang_string('numdays', '', 35),
        10   => new lang_string('numdays', '', 10),
        5    => new lang_string('numdays', '', 5),
        2    => new lang_string('numdays', '', 2)
    );
    $temp->add(new admin_setting_configselect('backup/backup_auto_delete_days', new lang_string('automateddeletedays', 'core_backup'),
            '', 0, $automateddeletedaysoptions));

    $minkeptoptions = array(
        0 => new lang_string('none'),
        1 => '1',
        2 => '2',
        5 => '5',
        10 => '10',
        20 => '20',
        30 => '30',
        40 => '40',
        50 => '50',
        100 => '100',
        200 => '200',
        300 => '300',
        400 => '400'
    );
    $temp->add(new admin_setting_configselect('backup/backup_auto_min_kept', new lang_string('automatedminkept', 'core_backup'),
            new lang_string('automatedminkepthelp', 'core_backup'), 0, $minkeptoptions));

    $temp->add(new admin_setting_configcheckbox('backup/backup_shortname', new lang_string('backup_shortname', 'core_admin'), new lang_string('backup_shortnamehelp', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_skip_hidden', new lang_string('skiphidden', 'core_backup'), new lang_string('skiphiddenhelp', 'core_backup'), 1));
    $temp->add(new admin_setting_configselect('backup/backup_auto_skip_modif_days', new lang_string('skipmodifdays', 'core_backup'), new lang_string('skipmodifdayshelp', 'core_backup'), 30, array(
        0 => new lang_string('never'),
        1 => new lang_string('numdays', '', 1),
        2 => new lang_string('numdays', '', 2),
        3 => new lang_string('numdays', '', 3),
        5 => new lang_string('numdays', '', 5),
        7 => new lang_string('numdays', '', 7),
        10 => new lang_string('numdays', '', 10),
        14 => new lang_string('numdays', '', 14),
        20 => new lang_string('numdays', '', 20),
        30 => new lang_string('numdays', '', 30),
        60 => new lang_string('numdays', '', 60),
        90 => new lang_string('numdays', '', 90),
        120 => new lang_string('numdays', '', 120),
        180 => new lang_string('numdays', '', 180),
        365 => new lang_string('numdays', '', 365)
    )));
    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_skip_modif_prev', new lang_string('skipmodifprev', 'core_backup'), new lang_string('skipmodifprevhelp', 'core_backup'), 0));

    // Automated defaults section.
    $temp->add(new admin_setting_heading('automatedsettings', new lang_string('automatedsettings','core_backup'), new lang_string('recyclebin_desc', 'core_backup')));
    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_users', new lang_string('generalusers', 'core_backup'), new lang_string('configgeneralusers', 'core_backup'), 1));
    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_role_assignments', new lang_string('generalroleassignments','core_backup'), new lang_string('configgeneralroleassignments','core_backup'), 1));
    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_activities', new lang_string('generalactivities', 'core_backup'),
        new lang_string('backupautoactivitiesdescription', 'core_backup'), 1));
    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_blocks', new lang_string('generalblocks','core_backup'), new lang_string('configgeneralblocks','core_backup'), 1));
    $temp->add(new admin_setting_configcheckbox(
            'backup/backup_auto_files',
            new lang_string('generalfiles', 'core_backup'),
            new lang_string('configgeneralfiles', 'core_backup'), '1'));
    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_filters', new lang_string('generalfilters','core_backup'), new lang_string('configgeneralfilters','core_backup'), 1));
    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_comments', new lang_string('generalcomments','core_backup'), new lang_string('configgeneralcomments','core_backup'), 1));
    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_badges', new lang_string('generalbadges','core_backup'), new lang_string('configgeneralbadges','core_backup'), 1));
    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_calendarevents', new lang_string('generalcalendarevents','core_backup'), new lang_string('configgeneralcalendarevents','core_backup'), 1));
    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_userscompletion', new lang_string('generaluserscompletion','core_backup'), new lang_string('configgeneraluserscompletion','core_backup'), 1));
    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_logs', new lang_string('generallogs', 'core_backup'), new lang_string('configgenerallogs', 'core_backup'), 0));
    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_histories', new lang_string('generalhistories','core_backup'), new lang_string('configgeneralhistories','core_backup'), 0));
    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_questionbank', new lang_string('generalquestionbank','core_backup'), new lang_string('configgeneralquestionbank','core_backup'), 1));
    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_groups', new lang_string('generalgroups', 'core_backup'),
            new lang_string('configgeneralgroups', 'core_backup'), 1));
    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_competencies', new lang_string('generalcompetencies','core_backup'), new lang_string('configgeneralcompetencies','core_backup'), 1));
    $temp->add(new admin_setting_configcheckbox(
        'backup/backup_auto_contentbankcontent',
        new lang_string('generalcontentbankcontent', 'core_backup'),
        new lang_string('configgeneralcontentbankcontent', 'core_backup'),
        1)
    );
    $temp->add(new admin_setting_configcheckbox(
        'backup/backup_auto_xapistate',
        new lang_string('generalxapistate', 'core_backup'),
        new lang_string('configgeneralxapistate', 'core_backup'),
        1)
    );

    $temp->add(new admin_setting_configcheckbox('backup/backup_auto_legacyfiles',
        new lang_string('generallegacyfiles', 'core_backup'),
        new lang_string('configlegacyfiles', 'core_backup'), 1));

    //$temp->add(new admin_setting_configcheckbox('backup/backup_auto_messages', new lang_string('messages', 'message'), new lang_string('backupmessageshelp','message'), 0));
    //$temp->add(new admin_setting_configcheckbox('backup/backup_auto_blogs', new lang_string('blogs', 'blog'), new lang_string('backupblogshelp','blog'), 0));

    $ADMIN->add('backups', $temp);

    // Create a page for general restore configuration and defaults.
    $temp = new admin_settingpage('restoregeneralsettings', new lang_string('generalrestoredefaults', 'core_backup'));

    // General restore defaults.
    $temp->add(new admin_setting_heading('generalsettings', new lang_string('generalrestoresettings', 'core_backup'), ''));

    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_users',
        new lang_string('generalusers', 'core_backup'), new lang_string('configrestoreusers', 'core_backup'),
        array('value' => 1, 'locked' => 0)));
    // Can not use actual constants here because we'd need to include 100 of backup/restore files.
    $options = [
        0/*backup::ENROL_NEVER*/     => get_string('rootsettingenrolments_never', 'core_backup'),
        1/*backup::ENROL_WITHUSERS*/ => get_string('rootsettingenrolments_withusers', 'core_backup'),
        2/*backup::ENROL_ALWAYS*/    => get_string('rootsettingenrolments_always', 'core_backup'),
    ];
    $temp->add(new admin_setting_configselect_with_lock('restore/restore_general_enrolments',
        new lang_string('generalenrolments', 'core_backup'), new lang_string('configrestoreenrolments', 'core_backup'),
        array('value' => 1/*backup::ENROL_WITHUSERS*/, 'locked' => 0), $options));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_role_assignments',
        new lang_string('generalroleassignments', 'core_backup'),
        new lang_string('configrestoreroleassignments', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_permissions',
        new lang_string('generalpermissions', 'core_backup'),
        new lang_string('configrestorepermissions', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_activities',
        new lang_string('generalactivities', 'core_backup'),
        new lang_string('configrestoreactivities', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_blocks',
        new lang_string('generalblocks', 'core_backup'),
        new lang_string('configrestoreblocks', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_filters',
        new lang_string('generalfilters', 'core_backup'),
        new lang_string('configrestorefilters', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_comments',
        new lang_string('generalcomments', 'core_backup'),
        new lang_string('configrestorecomments', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_badges',
        new lang_string('generalbadges', 'core_backup'),
        new lang_string('configrestorebadges', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_calendarevents',
        new lang_string('generalcalendarevents', 'core_backup'),
        new lang_string('configrestorecalendarevents', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_userscompletion',
        new lang_string('generaluserscompletion', 'core_backup'),
        new lang_string('configrestoreuserscompletion', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_logs',
        new lang_string('generallogs', 'core_backup'),
        new lang_string('configrestorelogs', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_histories',
        new lang_string('generalhistories', 'core_backup'),
        new lang_string('configrestorehistories', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_groups',
        new lang_string('generalgroups', 'core_backup'), new lang_string('configrestoregroups', 'core_backup'),
        array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_competencies',
        new lang_string('generalcompetencies', 'core_backup'),
        new lang_string('configrestorecompetencies', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_contentbankcontent',
        new lang_string('generalcontentbankcontent', 'core_backup'),
        new lang_string('configrestorecontentbankcontent', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_xapistate',
        new lang_string('generalxapistate', 'core_backup'),
        new lang_string('configrestorexapistate', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_general_legacyfiles',
        new lang_string('generallegacyfiles', 'core_backup'),
        new lang_string('configlegacyfiles', 'core_backup'), array('value' => 1, 'locked' => 0)));

    // Restore defaults when merging into another course.
    $temp->add(new admin_setting_heading('mergerestoredefaults', new lang_string('mergerestoredefaults', 'core_backup'), ''));

    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_merge_overwrite_conf',
        new lang_string('setting_overwrite_conf', 'core_backup'),
    new lang_string('config_overwrite_conf', 'core_backup'), array('value' => 0, 'locked' => 0)));

    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_merge_course_fullname',
        new lang_string('setting_overwrite_course_fullname', 'core_backup'),
        new lang_string('config_overwrite_course_fullname', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_merge_course_shortname',
        new lang_string('setting_overwrite_course_shortname', 'core_backup'),
        new lang_string('config_overwrite_course_shortname', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_merge_course_startdate',
        new lang_string('setting_overwrite_course_startdate', 'core_backup'),
        new lang_string('config_overwrite_course_startdate', 'core_backup'), array('value' => 1, 'locked' => 0)));

    // Restore defaults when replacing course contents.
    $temp->add(new admin_setting_heading('replacerestoredefaults', new lang_string('replacerestoredefaults', 'core_backup'), ''));

    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_replace_overwrite_conf',
        new lang_string('setting_overwrite_conf', 'core_backup'),
        new lang_string('config_overwrite_conf', 'core_backup'), array('value' => 0, 'locked' => 0)));

    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_replace_course_fullname',
        new lang_string('setting_overwrite_course_fullname', 'core_backup'),
        new lang_string('config_overwrite_course_fullname', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_replace_course_shortname',
        new lang_string('setting_overwrite_course_shortname', 'core_backup'),
        new lang_string('config_overwrite_course_shortname', 'core_backup'), array('value' => 1, 'locked' => 0)));
    $temp->add(new admin_setting_configcheckbox_with_lock('restore/restore_replace_course_startdate',
        new lang_string('setting_overwrite_course_startdate', 'core_backup'),
        new lang_string('config_overwrite_course_startdate', 'core_backup'), array('value' => 1, 'locked' => 0)));

    $temp->add(new admin_setting_configselect_with_lock('restore/restore_replace_keep_roles_and_enrolments',
        new lang_string('setting_keep_roles_and_enrolments', 'core_backup'),
        new lang_string('config_keep_roles_and_enrolments', 'core_backup'), array('value' => 0, 'locked' => 0),
        array(1 => get_string('yes'), 0 => get_string('no'))));
    $temp->add(new admin_setting_configselect_with_lock('restore/restore_replace_keep_groups_and_groupings',
        new lang_string('setting_keep_groups_and_groupings', 'core_backup'),
        new lang_string('config_keep_groups_and_groupings', 'core_backup'), array('value' => 0, 'locked' => 0),
        array(1 => get_string('yes'), 0 => get_string('no'))));

    $ADMIN->add('backups', $temp);

    // Create a page for asynchronous backup and restore configuration and defaults.
    $temp = new admin_settingpage('asyncgeneralsettings', new lang_string('asyncgeneralsettings', 'core_backup'));

    $temp->add(new admin_setting_configcheckbox('enableasyncbackup', new lang_string('enableasyncbackup', 'core_backup'),
            new lang_string('enableasyncbackup_help', 'core_backup'), 0, 1, 0));

    $temp->add(new admin_setting_configcheckbox(
            'backup/backup_async_message_users',
            new lang_string('asyncemailenable', 'core_backup'),
            new lang_string('asyncemailenabledetail', 'core_backup'), 0));
    $temp->hide_if('backup/backup_async_message_users', 'enableasyncbackup');

    $temp->add(new admin_setting_configtext(
            'backup/backup_async_message_subject',
            new lang_string('asyncmessagesubject', 'core_backup'),
            new lang_string('asyncmessagesubjectdetail', 'core_backup'),
            new lang_string('asyncmessagesubjectdefault', 'core_backup')));
    $temp->hide_if('backup/backup_async_message_subject', 'backup/backup_async_message_users');

    $temp->add(new admin_setting_confightmleditor(
            'backup/backup_async_message',
            new lang_string('asyncmessagebody', 'core_backup'),
            new lang_string('asyncmessagebodydetail', 'core_backup'),
            new lang_string('asyncmessagebodydefault', 'core_backup')));
    $temp->hide_if('backup/backup_async_message', 'backup/backup_async_message_users');

    $ADMIN->add('backups', $temp);

}
