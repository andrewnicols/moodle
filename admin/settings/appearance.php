<?php

// This file defines settingpages and externalpages under the "appearance" category

$capabilities = array(
    'moodle/my:configsyspages',
    'moodle/tag:manage'
);

if ($hassiteconfig or has_any_capability($capabilities, $systemcontext)) { // speedup for non-admins, add all caps used on this page

    $ADMIN->add('appearance', new admin_category('themes', new lang_string('themes')));
    // "themesettings" settingpage
    $temp = new admin_settingpage('themesettings', new lang_string('themesettings', 'core_admin'));
    $setting = new admin_setting_configtext('themelist', new lang_string('themelist', 'core_admin'),
        new lang_string('configthemelist', 'core_admin'), '', PARAM_NOTAGS);
    $setting->set_force_ltr(true);
    $temp->add($setting);
    $setting = new admin_setting_configcheckbox('themedesignermode', new lang_string('themedesignermode', 'core_admin'), new lang_string('configthemedesignermode', 'core_admin'), 0);
    $setting->set_updatedcallback('theme_reset_all_caches');
    $temp->add($setting);
    $temp->add(new admin_setting_configcheckbox('allowuserthemes', new lang_string('allowuserthemes', 'core_admin'), new lang_string('configallowuserthemes', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('allowcoursethemes', new lang_string('allowcoursethemes', 'core_admin'), new lang_string('configallowcoursethemes', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('allowcategorythemes',  new lang_string('allowcategorythemes', 'core_admin'), new lang_string('configallowcategorythemes', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('allowcohortthemes',  new lang_string('allowcohortthemes', 'core_admin'), new lang_string('configallowcohortthemes', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('allowthemechangeonurl',  new lang_string('allowthemechangeonurl', 'core_admin'), new lang_string('configallowthemechangeonurl', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('allowuserblockhiding', new lang_string('allowuserblockhiding', 'core_admin'), new lang_string('configallowuserblockhiding', 'core_admin'), 1));
    $temp->add(new admin_setting_configcheckbox('langmenuinsecurelayout',
        new lang_string('langmenuinsecurelayout', 'core_admin'),
        new lang_string('langmenuinsecurelayout_desc', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('logininfoinsecurelayout',
        new lang_string('logininfoinsecurelayout', 'core_admin'),
        new lang_string('logininfoinsecurelayout_desc', 'core_admin'), 0));
    $temp->add(new admin_setting_configtextarea('custommenuitems', new lang_string('custommenuitems', 'core_admin'),
        new lang_string('configcustommenuitems', 'core_admin'), '', PARAM_RAW, '50', '10'));
    $temp->add(new admin_setting_configtextarea(
        'customusermenuitems',
        new lang_string('customusermenuitems', 'core_admin'),
        new lang_string('configcustomusermenuitems', 'core_admin'),
        'profile,moodle|/user/profile.php
grades,grades|/grade/report/mygrades.php
calendar,core_calendar|/calendar/view.php?view=month
privatefiles,moodle|/user/files.php
reports,core_reportbuilder|/reportbuilder/index.php',
        PARAM_RAW,
        '50',
        '10'
    ));
    $ADMIN->add('themes', $temp);
    $ADMIN->add('themes', new admin_externalpage('themeselector', new lang_string('themeselector','core_admin'), $CFG->wwwroot . '/theme/index.php'));

    // settings for each theme
    foreach (core_component::get_plugin_list('theme') as $theme => $themedir) {
        $settings_path = "$themedir/settings.php";
        if (file_exists($settings_path)) {
            $settings = new admin_settingpage('themesetting'.$theme, new lang_string('pluginname', 'theme_'.$theme));
            include($settings_path);
            if ($settings) {
                $ADMIN->add('themes', $settings);
            }
        }
    }

    // Logos section.
    $temp = new admin_settingpage('logos', new lang_string('logossettings', 'core_admin'));

    // Logo file setting.
    $title = get_string('logo', 'core_admin');
    $description = get_string('logo_desc', 'core_admin');
    $setting = new admin_setting_configstoredfile('core_admin/logo', $title, $description, 'logo', 0,
        ['maxfiles' => 1, 'accepted_types' => ['.jpg', '.png']]);
    $setting->set_updatedcallback('theme_reset_all_caches');
    $temp->add($setting);

    // Small logo file setting.
    $title = get_string('logocompact', 'core_admin');
    $description = get_string('logocompact_desc', 'core_admin');
    $setting = new admin_setting_configstoredfile('core_admin/logocompact', $title, $description, 'logocompact', 0,
        ['maxfiles' => 1, 'accepted_types' => ['.jpg', '.png']]);
    $setting->set_updatedcallback('theme_reset_all_caches');
    $temp->add($setting);

    // Favicon file setting.
    $title = get_string('favicon', 'core_admin');
    $description = get_string('favicon_desc', 'core_admin');
    $setting = new admin_setting_configstoredfile('core_admin/favicon', $title, $description, 'favicon', 0,
        ['maxfiles' => 1, 'accepted_types' => ['image']]);
    $setting->set_updatedcallback('theme_reset_all_caches');
    $temp->add($setting);

    $ADMIN->add('appearance', $temp);

    // Course colours section.
    $temp = new admin_settingpage('coursecolors', new lang_string('coursecolorsettings', 'core_admin'));
    $temp->add(new admin_setting_heading('coursecolorheading', '',
        new lang_string('coursecolorheading_desc', 'core_admin')));

    $basecolors = ['#81ecec', '#74b9ff', '#a29bfe', '#dfe6e9', '#00b894',
            '#0984e3', '#b2bec3', '#fdcb6e', '#fd79a8', '#6c5ce7'];

    foreach ($basecolors as $key => $color) {
        $number = $key + 1;
        $name = 'core_admin/coursecolor' . $number;
        $title = get_string('coursecolor', 'core_admin', $number);
        $setting = new admin_setting_configcolourpicker($name, $title, '', $color);
        $temp->add($setting);
    }

    $ADMIN->add('appearance', $temp);

    // Calendar settings.
    $temp = new admin_settingpage('calendar', new lang_string('calendarsettings','core_admin'));

    $temp->add(new admin_setting_configselect('calendartype', new lang_string('calendartype', 'core_admin'),
        new lang_string('calendartype_desc', 'core_admin'), 'gregorian', \core_calendar\type_factory::get_list_of_calendar_types()));
    $temp->add(new admin_setting_special_adminseesall());
    //this is hacky because we do not want to include the stuff from calendar/lib.php
    $temp->add(new admin_setting_configselect('calendar_site_timeformat', new lang_string('pref_timeformat', 'core_calendar'),
                                              new lang_string('explain_site_timeformat', 'core_calendar'), '0',
                                              array('0'        => new lang_string('default', 'core_calendar'),
                                                    '%I:%M %p' => new lang_string('timeformat_12', 'core_calendar'),
                                                    '%H:%M'    => new lang_string('timeformat_24', 'core_calendar'))));
    $temp->add(new admin_setting_configselect('calendar_startwday', new lang_string('configstartwday', 'core_admin'),
        new lang_string('helpstartofweek', 'core_admin'), get_string('firstdayofweek', 'core_langconfig'),
    array(
            0 => new lang_string('sunday', 'core_calendar'),
            1 => new lang_string('monday', 'core_calendar'),
            2 => new lang_string('tuesday', 'core_calendar'),
            3 => new lang_string('wednesday', 'core_calendar'),
            4 => new lang_string('thursday', 'core_calendar'),
            5 => new lang_string('friday', 'core_calendar'),
            6 => new lang_string('saturday', 'core_calendar')
        )));
    $temp->add(new admin_setting_special_calendar_weekend());
    $options = array(365 => new lang_string('numyear', '', 1),
            270 => new lang_string('nummonths', '', 9),
            180 => new lang_string('nummonths', '', 6),
            150 => new lang_string('nummonths', '', 5),
            120 => new lang_string('nummonths', '', 4),
            90  => new lang_string('nummonths', '', 3),
            60  => new lang_string('nummonths', '', 2),
            30  => new lang_string('nummonth', '', 1),
            21  => new lang_string('numweeks', '', 3),
            14  => new lang_string('numweeks', '', 2),
            7  => new lang_string('numweek', '', 1),
            6  => new lang_string('numdays', '', 6),
            5  => new lang_string('numdays', '', 5),
            4  => new lang_string('numdays', '', 4),
            3  => new lang_string('numdays', '', 3),
            2  => new lang_string('numdays', '', 2),
            1  => new lang_string('numday', '', 1));
    $temp->add(new admin_setting_configselect('calendar_lookahead', new lang_string('configlookahead', 'core_admin'), new lang_string('helpupcominglookahead', 'core_admin'), 21, $options));
    $options = array();
    for ($i=1; $i<=20; $i++) {
        $options[$i] = $i;
    }
    $temp->add(new admin_setting_configselect('calendar_maxevents',new lang_string('configmaxevents','core_admin'),new lang_string('helpupcomingmaxevents', 'core_admin'),10,$options));
    $temp->add(new admin_setting_configcheckbox('enablecalendarexport', new lang_string('enablecalendarexport', 'core_admin'), new lang_string('configenablecalendarexport','core_admin'), 1));

    // Calendar custom export settings.
    $days = array(365 => new lang_string('numdays', '', 365),
            180 => new lang_string('numdays', '', 180),
            150 => new lang_string('numdays', '', 150),
            120 => new lang_string('numdays', '', 120),
            90  => new lang_string('numdays', '', 90),
            60  => new lang_string('numdays', '', 60),
            30  => new lang_string('numdays', '', 30),
            5  => new lang_string('numdays', '', 5));
    $temp->add(new admin_setting_configcheckbox('calendar_customexport', new lang_string('configcalendarcustomexport', 'core_admin'), new lang_string('helpcalendarcustomexport','core_admin'), 1));
    $temp->add(new admin_setting_configselect('calendar_exportlookahead', new lang_string('configexportlookahead','core_admin'), new lang_string('helpexportlookahead', 'core_admin'), 365, $days));
    $temp->add(new admin_setting_configselect('calendar_exportlookback', new lang_string('configexportlookback','core_admin'), new lang_string('helpexportlookback', 'core_admin'), 5, $days));
    $temp->add(new admin_setting_configtext('calendar_exportsalt', new lang_string('calendarexportsalt','core_admin'), new lang_string('configcalendarexportsalt', 'core_admin'), random_string(60)));
    $temp->add(new admin_setting_configcheckbox('calendar_showicalsource', new lang_string('configshowicalsource', 'core_admin'), new lang_string('helpshowicalsource','core_admin'), 1));
    $ADMIN->add('appearance', $temp);

    // blog
    $temp = new admin_settingpage('blog', new lang_string('blog','core_blog'), 'moodle/site:config', empty($CFG->enableblogs));
    $temp->add(new admin_setting_configcheckbox('useblogassociations', new lang_string('useblogassociations', 'core_blog'), new lang_string('configuseblogassociations','core_blog'), 1));
    $temp->add(new admin_setting_bloglevel('bloglevel', new lang_string('bloglevel', 'core_admin'), new lang_string('configbloglevel', 'core_admin'), 4, array(BLOG_GLOBAL_LEVEL => new lang_string('worldblogs','core_blog'),
                                                                                                                                           BLOG_SITE_LEVEL => new lang_string('siteblogs','core_blog'),
                                                                                                                                           BLOG_USER_LEVEL => new lang_string('personalblogs','core_blog'))));
    $temp->add(new admin_setting_configcheckbox('useexternalblogs', new lang_string('useexternalblogs', 'core_blog'), new lang_string('configuseexternalblogs','core_blog'), 1));
    $temp->add(new admin_setting_configselect('externalblogcrontime', new lang_string('externalblogcrontime', 'core_blog'), new lang_string('configexternalblogcrontime', 'core_blog'), 86400,
        array(43200 => new lang_string('numhours', '', 12),
              86400 => new lang_string('numhours', '', 24),
              172800 => new lang_string('numdays', '', 2),
              604800 => new lang_string('numdays', '', 7))));
    $temp->add(new admin_setting_configtext('maxexternalblogsperuser', new lang_string('maxexternalblogsperuser','core_blog'), new lang_string('configmaxexternalblogsperuser', 'core_blog'), 1));
    $temp->add(new admin_setting_configcheckbox('blogusecomments', new lang_string('enablecomments', 'core_admin'), new lang_string('configenablecomments', 'core_admin'), 1));
    $temp->add(new admin_setting_configcheckbox('blogshowcommentscount', new lang_string('showcommentscount', 'core_admin'), new lang_string('configshowcommentscount', 'core_admin'), 1));
    $ADMIN->add('appearance', $temp);

    // Navigation settings
    $temp = new admin_settingpage('navigation', new lang_string('navigation'));
    $temp->add(new admin_setting_configcheckbox(
        'enabledashboard',
        new lang_string('enabledashboard', 'core_admin'),
        new lang_string('enabledashboard_help', 'core_admin'),
        1
    ));

    $choices = [HOMEPAGE_SITE => new lang_string('home')];
    if (!empty($CFG->enabledashboard)) {
        $choices[HOMEPAGE_MY] = new lang_string('mymoodle', 'core_admin');
    }
    $choices[HOMEPAGE_MYCOURSES] = new lang_string('mycourses', 'core_admin');
    $choices[HOMEPAGE_USER] = new lang_string('userpreference', 'core_admin');
    $temp->add(new admin_setting_configselect('defaulthomepage', new lang_string('defaulthomepage', 'core_admin'),
            new lang_string('configdefaulthomepage', 'core_admin'), get_default_home_page(), $choices));
    if (!empty($CFG->enabledashboard)) {
        $temp->add(new admin_setting_configcheckbox(
            'allowguestmymoodle',
            new lang_string('allowguestmymoodle', 'core_admin'),
            new lang_string('configallowguestmymoodle', 'core_admin'),
            1
        ));
    }
    $temp->add(new admin_setting_configcheckbox('navshowfullcoursenames', new lang_string('navshowfullcoursenames', 'core_admin'), new lang_string('navshowfullcoursenames_help', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('navshowcategories', new lang_string('navshowcategories', 'core_admin'), new lang_string('confignavshowcategories', 'core_admin'), 1));
    $temp->add(new admin_setting_configcheckbox('navshowmycoursecategories', new lang_string('navshowmycoursecategories', 'core_admin'), new lang_string('navshowmycoursecategories_help', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('navshowallcourses', new lang_string('navshowallcourses', 'core_admin'), new lang_string('confignavshowallcourses', 'core_admin'), 0));
    $sortoptions = array(
        'sortorder' => new lang_string('sort_sortorder', 'core_admin'),
        'fullname' => new lang_string('sort_fullname', 'core_admin'),
        'shortname' => new lang_string('sort_shortname', 'core_admin'),
        'idnumber' => new lang_string('sort_idnumber', 'core_admin'),
    );
    $temp->add(new admin_setting_configselect('navsortmycoursessort', new lang_string('navsortmycoursessort', 'core_admin'), new lang_string('navsortmycoursessort_help', 'core_admin'), 'sortorder', $sortoptions));
    $temp->add(new admin_setting_configcheckbox('navsortmycourseshiddenlast',
            new lang_string('navsortmycourseshiddenlast', 'core_admin'),
            new lang_string('navsortmycourseshiddenlast_help', 'core_admin'),
            1));
    $temp->add(new admin_setting_configtext('navcourselimit', new lang_string('navcourselimit', 'core_admin'),
        new lang_string('confignavcourselimit', 'core_admin'), 10, PARAM_INT));
    $temp->add(new admin_setting_configcheckbox('usesitenameforsitepages', new lang_string('usesitenameforsitepages', 'core_admin'), new lang_string('configusesitenameforsitepages', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('linkadmincategories', new lang_string('linkadmincategories', 'core_admin'), new lang_string('linkadmincategories_help', 'core_admin'), 1));
    $temp->add(new admin_setting_configcheckbox('linkcoursesections', new lang_string('linkcoursesections', 'core_admin'), new lang_string('linkcoursesections_help', 'core_admin'), 1));
    $temp->add(new admin_setting_configcheckbox('navshowfrontpagemods', new lang_string('navshowfrontpagemods', 'core_admin'), new lang_string('navshowfrontpagemods_help', 'core_admin'), 1));
    $temp->add(new admin_setting_configcheckbox('navadduserpostslinks', new lang_string('navadduserpostslinks', 'core_admin'), new lang_string('navadduserpostslinks_help', 'core_admin'), 1));

    $ADMIN->add('appearance', $temp);

    // "htmlsettings" settingpage
    $temp = new admin_settingpage('htmlsettings', new lang_string('htmlsettings', 'core_admin'));
    $sitenameintitleoptions = [
        'shortname' => new lang_string('shortname'),
        'fullname' => new lang_string('fullname'),
    ];
    $sitenameintitleconfig = new admin_setting_configselect(
        'sitenameintitle',
        new lang_string('sitenameintitle', 'core_admin'),
        new lang_string('sitenameintitle_help', 'core_admin'),
        'shortname',
        $sitenameintitleoptions
    );
    $temp->add($sitenameintitleconfig);
    $temp->add(new admin_setting_configcheckbox('formatstringstriptags', new lang_string('stripalltitletags', 'core_admin'), new lang_string('configstripalltitletags', 'core_admin'), 1));
    $temp->add(new admin_setting_emoticons());
    $ADMIN->add('appearance', $temp);
    $ADMIN->add('appearance', new admin_externalpage('resetemoticons', new lang_string('emoticonsreset', 'core_admin'),
        new moodle_url('/admin/resetemoticons.php'), 'moodle/site:config', true));

    // "documentation" settingpage
    $temp = new admin_settingpage('documentation', new lang_string('moodledocs'));
    $temp->add(new admin_setting_configtext('docroot', new lang_string('docroot', 'core_admin'), new lang_string('configdocroot', 'core_admin'), 'https://docs.moodle.org', PARAM_URL));
    $ltemp = array('' => get_string('forceno'));
    $ltemp += get_string_manager()->get_list_of_translations(true);
    $temp->add(new admin_setting_configselect('doclang', get_string('doclang', 'core_admin'), get_string('configdoclang', 'core_admin'), '', $ltemp));
    $temp->add(new admin_setting_configcheckbox('doctonewwindow', new lang_string('doctonewwindow', 'core_admin'), new lang_string('configdoctonewwindow', 'core_admin'), 0));
    $temp->add(new admin_setting_configtext(
        'coursecreationguide',
        new lang_string('coursecreationguide', 'core_admin'),
        new lang_string('coursecreationguide_help', 'core_admin'),
        'https://moodle.academy/coursequickstart',
        PARAM_URL
    ));
    $ADMIN->add('appearance', $temp);

    if (!empty($CFG->enabledashboard)) {
        $temp = new admin_externalpage('mypage', new lang_string('mypage', 'core_admin'), $CFG->wwwroot . '/my/indexsys.php',
                'moodle/my:configsyspages');
        $ADMIN->add('appearance', $temp);
    }

    $temp = new admin_externalpage('profilepage', new lang_string('myprofile', 'core_admin'), $CFG->wwwroot . '/user/profilesys.php',
            'moodle/my:configsyspages');
    $ADMIN->add('appearance', $temp);

    // coursecontact is the person responsible for course - usually manages enrolments, receives notification, etc.
    $temp = new admin_settingpage('coursecontact', new lang_string('courses'));
    $temp->add(new admin_setting_special_coursecontact());
    $temp->add(new admin_setting_configcheckbox('coursecontactduplicates',
            new lang_string('coursecontactduplicates', 'core_admin'),
            new lang_string('coursecontactduplicates_desc', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('courselistshortnames',
            new lang_string('courselistshortnames', 'core_admin'),
            new lang_string('courselistshortnames_desc', 'core_admin'), 0));
    $temp->add(new admin_setting_configtext('coursesperpage', new lang_string('coursesperpage', 'core_admin'), new lang_string('configcoursesperpage', 'core_admin'), 20, PARAM_INT));
    $temp->add(new admin_setting_configtext('courseswithsummarieslimit', new lang_string('courseswithsummarieslimit', 'core_admin'), new lang_string('configcourseswithsummarieslimit', 'core_admin'), 10, PARAM_INT));

    $temp->add(new admin_setting_configtext('courseoverviewfileslimit', new lang_string('courseoverviewfileslimit'),
            new lang_string('configcourseoverviewfileslimit', 'core_admin'), 1, PARAM_INT));
    $temp->add(new admin_setting_filetypes('courseoverviewfilesext', new lang_string('courseoverviewfilesext'),
        new lang_string('configcourseoverviewfilesext', 'core_admin'), 'web_image'
    ));

    $temp->add(new admin_setting_configtext('coursegraceperiodbefore', new lang_string('coursegraceperiodbefore', 'core_admin'),
        new lang_string('configcoursegraceperiodbefore', 'core_admin'), 0, PARAM_INT));
    $temp->add(new admin_setting_configtext('coursegraceperiodafter', new lang_string('coursegraceperiodafter', 'core_admin'),
        new lang_string('configcoursegraceperiodafter', 'core_admin'), 0, PARAM_INT));
    $ADMIN->add('appearance', $temp);

    $temp = new admin_settingpage('ajax', new lang_string('ajaxuse'));
    $temp->add(new admin_setting_configcheckbox('yuicomboloading', new lang_string('yuicomboloading', 'core_admin'), new lang_string('configyuicomboloading', 'core_admin'), 1));
    $setting = new admin_setting_configcheckbox('cachejs', new lang_string('cachejs', 'core_admin'), new lang_string('cachejs_help', 'core_admin'), 1);
    $setting->set_updatedcallback('js_reset_all_caches');
    $temp->add($setting);
    $ADMIN->add('appearance', $temp);

    // Link to tag management interface.
    $url = new moodle_url('/tag/manage.php');
    $hidden = empty($CFG->usetags);
    $page = new admin_externalpage('managetags', new lang_string('managetags', 'core_tag'), $url, 'moodle/tag:manage', $hidden);
    $ADMIN->add('appearance', $page);

    $temp = new admin_settingpage('additionalhtml', new lang_string('additionalhtml', 'core_admin'));
    $temp->add(new admin_setting_heading('additionalhtml_heading', new lang_string('additionalhtml_heading', 'core_admin'), new lang_string('additionalhtml_desc', 'core_admin')));
    $temp->add(new admin_setting_configtextarea('additionalhtmlhead', new lang_string('additionalhtmlhead', 'core_admin'), new lang_string('additionalhtmlhead_desc', 'core_admin'), '', PARAM_RAW));
    $temp->add(new admin_setting_configtextarea('additionalhtmltopofbody', new lang_string('additionalhtmltopofbody', 'core_admin'), new lang_string('additionalhtmltopofbody_desc', 'core_admin'), '', PARAM_RAW));
    $temp->add(new admin_setting_configtextarea('additionalhtmlfooter', new lang_string('additionalhtmlfooter', 'core_admin'), new lang_string('additionalhtmlfooter_desc', 'core_admin'), '', PARAM_RAW));
    $ADMIN->add('appearance', $temp);

    $setting = new admin_setting_configcheckbox('cachetemplates', new lang_string('cachetemplates', 'core_admin'),
        new lang_string('cachetemplates_help', 'core_admin'), 1);
    $setting->set_updatedcallback('template_reset_all_caches');
    $temp = new admin_settingpage('templates', new lang_string('templates', 'core_admin'));
    $temp->add($setting);
    $ADMIN->add('appearance', $temp);
} // end of speedup
