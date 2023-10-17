<?php

// This file defines settingpages and externalpages under the "appearance" category

use core_admin\local\settings\setting_scheduled_task_status;

if ($hassiteconfig) {

    // "languageandlocation" settingpage
    $temp = new admin_settingpage('langsettings', new lang_string('languagesettings', 'core_admin'));
    $temp->add(new admin_setting_configcheckbox('autolang', new lang_string('autolang', 'core_admin'), new lang_string('configautolang', 'core_admin'), 1));
    $temp->add(new admin_setting_configselect('lang', new lang_string('lang', 'core_admin'), new lang_string('configlang', 'core_admin'), current_language(), get_string_manager()->get_list_of_translations())); // $CFG->lang might be set in installer already, default en is in setup.php
    $temp->add(new admin_setting_configcheckbox('autolangusercreation', new lang_string('autolangusercreation', 'core_admin'),
        new lang_string('configautolangusercreation', 'core_admin'), 1));
    $temp->add(new admin_setting_configcheckbox('langmenu', new lang_string('langmenu', 'core_admin'), new lang_string('configlangmenu', 'core_admin'), 1));
    $temp->add(new admin_setting_langlist());
    $temp->add(new admin_setting_configcheckbox('langcache', new lang_string('langcache', 'core_admin'), new lang_string('langcache_desc', 'core_admin'), 1));
    $temp->add(new admin_setting_configcheckbox('langstringcache', new lang_string('langstringcache', 'core_admin'), new lang_string('configlangstringcache', 'core_admin'), 1));
    $temp->add(new admin_setting_configtext('locale', new lang_string('localetext', 'core_admin'), new lang_string('configlocale', 'core_admin'), '', PARAM_FILE));
    $temp->add(new admin_setting_configselect('latinexcelexport', new lang_string('latinexcelexport', 'core_admin'), new lang_string('configlatinexcelexport', 'core_admin'), '0', array('0'=>'Unicode','1'=>'Latin')));
    $temp->add(new admin_setting_configcheckbox('enablepdfexportfont', new lang_string('enablepdfexportfont', 'core_admin'),
        new lang_string('enablepdfexportfont_desc', 'core_admin'), 0));
    $temp->add(new setting_scheduled_task_status('langimporttaskstatus', '\tool_langimport\task\update_langpacks_task'));

    $ADMIN->add('language', $temp);

} // end of speedup
