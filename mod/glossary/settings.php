<?php

defined('MOODLE_INTERNAL') || die;

if ($ADMIN->fulltree) {
    require_once($CFG->dirroot.'/mod/glossary/lib.php');

    $settings->add(new admin_setting_heading('glossary_normal_header', get_string('glossaryleveldefaultsettings', 'mod_glossary'), ''));

    $settings->add(new admin_setting_configtext('glossary_entbypage', get_string('entbypage', 'mod_glossary'),
                       get_string('entbypage', 'mod_glossary'), 10, PARAM_INT));


    $settings->add(new admin_setting_configcheckbox('glossary_dupentries', get_string('allowduplicatedentries', 'mod_glossary'),
                       get_string('cnfallowdupentries', 'mod_glossary'), 0));

    $settings->add(new admin_setting_configcheckbox('glossary_allowcomments', get_string('allowcomments', 'mod_glossary'),
                       get_string('cnfallowcomments', 'mod_glossary'), 0));

    $settings->add(new admin_setting_configcheckbox('glossary_linkbydefault', get_string('usedynalink', 'mod_glossary'),
                       get_string('cnflinkglossaries', 'mod_glossary'), 1));

    $settings->add(new admin_setting_configcheckbox('glossary_defaultapproval', get_string('defaultapproval', 'mod_glossary'),
                       get_string('cnfapprovalstatus', 'mod_glossary'), 1));


    if (empty($CFG->enablerssfeeds)) {
        $options = array(0 => get_string('rssglobaldisabled', 'admin'));
        $str = get_string('configenablerssfeeds', 'mod_glossary').'<br />'.get_string('configenablerssfeedsdisabled2', 'admin');

    } else {
        $options = array(0=>get_string('no'), 1=>get_string('yes'));
        $str = get_string('configenablerssfeeds', 'mod_glossary');
    }
    $settings->add(new admin_setting_configselect('glossary_enablerssfeeds', get_string('enablerssfeeds', 'admin'),
                       $str, 0, $options));


    $settings->add(new admin_setting_heading('glossary_levdev_header', get_string('entryleveldefaultsettings', 'mod_glossary'), ''));

    $settings->add(new admin_setting_configcheckbox('glossary_linkentries', get_string('usedynalink', 'mod_glossary'),
                       get_string('cnflinkentry', 'mod_glossary'), 0));

    $settings->add(new admin_setting_configcheckbox('glossary_casesensitive', get_string('casesensitive', 'mod_glossary'),
                       get_string('cnfcasesensitive', 'mod_glossary'), 0));

    $settings->add(new admin_setting_configcheckbox('glossary_fullmatch', get_string('fullmatch', 'mod_glossary'),
                       get_string('cnffullmatch', 'mod_glossary'), 0));

    // This is unfortunately necessary to ensure that the glossary_formats table is populated and up to date.
    // Ensure the table is in sync with what display formats are available in code.
    glossary_get_available_formats();

    $settings->add(new mod_glossary_admin_setting_display_formats());
}
