<?php

if ($hassiteconfig) { // speedup for non-admins, add all caps used on this page

    $optionalsubsystems->add(new admin_setting_configcheckbox('enableoutcomes', new lang_string('enableoutcomes', 'core_grades'), new lang_string('enableoutcomes_help', 'core_grades'), 0));
    $optionalsubsystems->add(new admin_setting_configcheckbox('usecomments', new lang_string('enablecomments', 'core_admin'), new lang_string('configenablecomments', 'core_admin'), 1));

    $optionalsubsystems->add(new admin_setting_configcheckbox('usetags', new lang_string('usetags','core_admin'),new lang_string('configusetags', 'core_admin'), '1'));

    $optionalsubsystems->add(new admin_setting_configcheckbox('enablenotes', new lang_string('enablenotes', 'core_notes'), new lang_string('configenablenotes', 'core_notes'), 1));

    $optionalsubsystems->add(new admin_setting_configcheckbox('enableportfolios', new lang_string('enabled', 'core_portfolio'), new lang_string('enableddesc', 'core_portfolio'), 0));

    $optionalsubsystems->add(new admin_setting_configcheckbox('enablewebservices', new lang_string('enablewebservices', 'core_admin'), new lang_string('configenablewebservices', 'core_admin'), 0));

    $optionalsubsystems->add(new admin_setting_configcheckbox('enablestats', new lang_string('enablestats', 'core_admin'), new lang_string('configenablestats', 'core_admin'), 0));

    $optionalsubsystems->add(new admin_setting_configcheckbox('enablerssfeeds', new lang_string('enablerssfeeds', 'core_admin'), new lang_string('configenablerssfeeds', 'core_admin'), 0));

    $optionalsubsystems->add(new admin_setting_configcheckbox('enableblogs', new lang_string('enableblogs', 'core_admin'), new lang_string('configenableblogs', 'core_admin'), 1));

    $options = array('off'=>new lang_string('off', 'core_mnet'), 'strict'=>new lang_string('on', 'core_mnet'));
    $optionalsubsystems->add(new admin_setting_configselect('mnet_dispatcher_mode', new lang_string('net', 'core_mnet'), new lang_string('configmnet', 'core_mnet'), 'off', $options));

    // Conditional activities: completion and availability
    $optionalsubsystems->add(new admin_setting_configcheckbox('enablecompletion',
        new lang_string('enablecompletion','core_completion'),
        new lang_string('configenablecompletion', 'core_completion'), 1));

    $options = array(
        1 => get_string('completionactivitydefault', 'core_completion'),
        0 => get_string('completion_none', 'core_completion')
    );

    $optionalsubsystems->add($checkbox = new admin_setting_configcheckbox('enableavailability',
            new lang_string('enableavailability', 'core_availability'),
            new lang_string('enableavailability_desc', 'core_availability'), 1));
    $checkbox->set_affects_modinfo(true);

    $optionalsubsystems->add(new admin_setting_configcheckbox('enableplagiarism', new lang_string('enableplagiarism','core_plagiarism'), new lang_string('configenableplagiarism','core_plagiarism'), 0));

    $optionalsubsystems->add(new admin_setting_configcheckbox('enablebadges', new lang_string('enablebadges', 'core_badges'), new lang_string('configenablebadges', 'core_badges'), 1));

    $optionalsubsystems->add(new admin_setting_configcheckbox('enableglobalsearch', new lang_string('enableglobalsearch', 'core_admin'),
        new lang_string('enableglobalsearch_desc', 'core_admin'), 0, 1, 0));

    $optionalsubsystems->add(new admin_setting_configcheckbox('allowstealth', new lang_string('allowstealthmodules'),
        new lang_string('allowstealthmodules_help'), 0, 1, 0));

    $optionalsubsystems->add(new admin_setting_configcheckbox('enableanalytics', new lang_string('enableanalytics', 'core_admin'),
        new lang_string('configenableanalytics', 'core_admin'), 1, 1, 0));

    $optionalsubsystems->add(new admin_setting_configcheckbox('core_competency/enabled',
        new lang_string('enablecompetencies', 'core_competency'),
        new lang_string('enablecompetencies_desc', 'core_competency'),
        1)
    );

    $optionalsubsystems->add(new admin_setting_configcheckbox('messaging',
        new lang_string('messaging', 'core_admin'),
        new lang_string('configmessaging', 'core_admin'),
        1)
    );

    $optionalsubsystems->add(new admin_setting_configcheckbox('enablecustomreports',
        new lang_string('enablecustomreports', 'core_reportbuilder'),
        new lang_string('enablecustomreports_desc', 'core_reportbuilder'),
        1
    ));

    $fullunicodesupport = true;
    if ($DB->get_dbfamily() == 'mysql') {
        $collation = $DB->get_dbcollation();
        $collationinfo = explode('_', $collation);
        $charset = reset($collationinfo);
        $fullunicodesupport = $charset === 'utf8mb4';
    }

    if ($fullunicodesupport) {
        $optionalsubsystems->add(new admin_setting_configcheckbox(
            'allowemojipicker',
            new lang_string('allowemojipicker', 'core_admin'),
            new lang_string('configallowemojipicker', 'core_admin'),
            1
        ));
    } else {
        $optionalsubsystems->add(new admin_setting_description(
            'allowemojipicker',
            new lang_string('allowemojipicker', 'core_admin'),
            new lang_string('configallowemojipickerincompatible', 'core_admin')
        ));
    }
}
