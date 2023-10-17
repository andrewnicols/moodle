<?php

// This file defines settingpages and externalpages under the "grades" section

if (has_capability('moodle/grade:manage', $systemcontext)
 or has_capability('moodle/grade:manageletters', $systemcontext)) { // speedup for non-admins, add all caps used on this page

    require_once $CFG->libdir.'/grade/constants.php';
    $display_types = array(GRADE_DISPLAY_TYPE_REAL => new lang_string('real', 'core_grades'),
                           GRADE_DISPLAY_TYPE_PERCENTAGE => new lang_string('percentage', 'core_grades'),
                           GRADE_DISPLAY_TYPE_LETTER => new lang_string('letter', 'core_grades'),
                           GRADE_DISPLAY_TYPE_REAL_PERCENTAGE => new lang_string('realpercentage', 'core_grades'),
                           GRADE_DISPLAY_TYPE_REAL_LETTER => new lang_string('realletter', 'core_grades'),
                           GRADE_DISPLAY_TYPE_LETTER_REAL => new lang_string('letterreal', 'core_grades'),
                           GRADE_DISPLAY_TYPE_LETTER_PERCENTAGE => new lang_string('letterpercentage', 'core_grades'),
                           GRADE_DISPLAY_TYPE_PERCENTAGE_LETTER => new lang_string('percentageletter', 'core_grades'),
                           GRADE_DISPLAY_TYPE_PERCENTAGE_REAL => new lang_string('percentagereal', 'core_grades')
                           );
    asort($display_types);

    // General settings

    $temp = new admin_settingpage('gradessettings', new lang_string('generalsettings', 'core_grades'), 'moodle/grade:manage');
    if ($ADMIN->fulltree) {

        // new CFG variable for gradebook (what roles to display)
        $temp->add(new admin_setting_special_gradebookroles());

        // enable outcomes checkbox now in subsystems area

        $temp->add(new admin_setting_grade_profilereport());

        $temp->add(new admin_setting_configselect('grade_aggregationposition', new lang_string('aggregationposition', 'core_grades'),
                                                  new lang_string('aggregationposition_help', 'core_grades'), GRADE_REPORT_AGGREGATION_POSITION_LAST,
                                                  array(GRADE_REPORT_AGGREGATION_POSITION_FIRST => new lang_string('positionfirst', 'core_grades'),
                                                        GRADE_REPORT_AGGREGATION_POSITION_LAST => new lang_string('positionlast', 'core_grades'))));

        $temp->add(new admin_setting_regradingcheckbox('grade_includescalesinaggregation', new lang_string('includescalesinaggregation', 'core_grades'), new lang_string('includescalesinaggregation_help', 'core_grades'), 1));

        $temp->add(new admin_setting_configcheckbox('grade_hiddenasdate', new lang_string('hiddenasdate', 'core_grades'), new lang_string('hiddenasdate_help', 'core_grades'), 0));

        // enable publishing in exports/imports
        $temp->add(new admin_setting_configcheckbox('gradepublishing', new lang_string('gradepublishing', 'core_grades'), new lang_string('gradepublishing_help', 'core_grades'), 0));

        $temp->add(new admin_setting_configcheckbox('grade_export_exportfeedback', new lang_string('exportfeedback', 'core_grades'),
                                                  new lang_string('exportfeedback_desc', 'core_grades'), 0));

        $temp->add(new admin_setting_configselect('grade_export_displaytype', new lang_string('gradeexportdisplaytype', 'core_grades'),
                                                  new lang_string('gradeexportdisplaytype_desc', 'core_grades'), GRADE_DISPLAY_TYPE_REAL, $display_types));

        $temp->add(new admin_setting_configselect('grade_export_decimalpoints', new lang_string('gradeexportdecimalpoints', 'core_grades'),
                                                  new lang_string('gradeexportdecimalpoints_desc', 'core_grades'), 2,
                                                  array( '0' => '0',
                                                         '1' => '1',
                                                         '2' => '2',
                                                         '3' => '3',
                                                         '4' => '4',
                                                         '5' => '5')));

        $setting = new admin_setting_configtext('grade_export_userprofilefields',
            new lang_string('gradeexportuserprofilefields', 'core_grades'),
            new lang_string('gradeexportuserprofilefields_desc', 'core_grades'),
            'firstname,lastname,idnumber,institution,department,email', PARAM_TEXT);
        $setting->set_force_ltr(true);
        $temp->add($setting);

        $setting = new admin_setting_configtext('grade_export_customprofilefields',
            new lang_string('gradeexportcustomprofilefields', 'core_grades'),
            new lang_string('gradeexportcustomprofilefields_desc', 'core_grades'), '', PARAM_TEXT);
        $setting->set_force_ltr(true);
        $temp->add($setting);

        $temp->add(new admin_setting_configcheckbox('recovergradesdefault', new lang_string('recovergradesdefault', 'core_grades'), new lang_string('recovergradesdefault_help', 'core_grades'), 0));

        $temp->add(new admin_setting_special_gradeexport());

        $temp->add(new admin_setting_special_gradelimiting());

        $temp->add(new admin_setting_configcheckbox('grade_report_showmin',
                                                    get_string('minimum_show', 'core_grades'),
                                                    get_string('minimum_show_help', 'core_grades'), '1'));

        $temp->add(new admin_setting_special_gradepointmax());

        $temp->add(new admin_setting_special_gradepointdefault());

        $temp->add(new admin_setting_special_grademinmaxtouse());

        $temp->add(new admin_setting_my_grades_report());

        $temp->add(new admin_setting_configtext('gradereport_mygradeurl', new lang_string('externalurl', 'core_grades'),
                new lang_string('externalurl_desc', 'core_grades'), ''));
    }
    $ADMIN->add('grades', $temp);

    /// Grade category settings
    $temp = new admin_settingpage('gradecategorysettings', new lang_string('gradecategorysettings', 'core_grades'), 'moodle/grade:manage');
    if ($ADMIN->fulltree) {
        $temp->add(new admin_setting_configcheckbox('grade_hideforcedsettings', new lang_string('hideforcedsettings', 'core_grades'), new lang_string('hideforcedsettings_help', 'core_grades'), '1'));

        $strnoforce = new lang_string('noforce', 'core_grades');

        // Aggregation type
        $options = array(GRADE_AGGREGATE_MEAN            =>new lang_string('aggregatemean', 'core_grades'),
                         GRADE_AGGREGATE_WEIGHTED_MEAN   =>new lang_string('aggregateweightedmean', 'core_grades'),
                         GRADE_AGGREGATE_WEIGHTED_MEAN2  =>new lang_string('aggregateweightedmean2', 'core_grades'),
                         GRADE_AGGREGATE_EXTRACREDIT_MEAN=>new lang_string('aggregateextracreditmean', 'core_grades'),
                         GRADE_AGGREGATE_MEDIAN          =>new lang_string('aggregatemedian', 'core_grades'),
                         GRADE_AGGREGATE_MIN             =>new lang_string('aggregatemin', 'core_grades'),
                         GRADE_AGGREGATE_MAX             =>new lang_string('aggregatemax', 'core_grades'),
                         GRADE_AGGREGATE_MODE            =>new lang_string('aggregatemode', 'core_grades'),
                         GRADE_AGGREGATE_SUM             =>new lang_string('aggregatesum', 'core_grades'));

        $defaultvisible = array(GRADE_AGGREGATE_SUM);

        $defaults = array('value' => GRADE_AGGREGATE_SUM, 'forced' => false, 'adv' => false);
        $temp->add(new admin_setting_gradecat_combo('grade_aggregation', new lang_string('aggregation', 'core_grades'), new lang_string('aggregation_help', 'core_grades'), $defaults, $options));

        $temp->add(new admin_setting_configmultiselect('grade_aggregations_visible', new lang_string('aggregationsvisible', 'core_grades'),
                                                       new lang_string('aggregationsvisiblehelp', 'core_grades'), $defaultvisible, $options));

        $options = array(0 => new lang_string('no'), 1 => new lang_string('yes'));

        $defaults = array('value'=>1, 'forced'=>false, 'adv'=>true);
        $temp->add(new admin_setting_gradecat_combo('grade_aggregateonlygraded', new lang_string('aggregateonlygraded', 'core_grades'),
                    new lang_string('aggregateonlygraded_help', 'core_grades'), $defaults, $options));
        $defaults = array('value'=>0, 'forced'=>false, 'adv'=>true);
        $temp->add(new admin_setting_gradecat_combo('grade_aggregateoutcomes', new lang_string('aggregateoutcomes', 'core_grades'),
                    new lang_string('aggregateoutcomes_help', 'core_grades'), $defaults, $options));

        $options = array(0 => new lang_string('none'));
        for ($i=1; $i<=20; $i++) {
            $options[$i] = $i;
        }

        $defaults['value'] = 0;
        $defaults['forced'] = true;
        $temp->add(new admin_setting_gradecat_combo('grade_keephigh', new lang_string('keephigh', 'core_grades'),
                    new lang_string('keephigh_help', 'core_grades'), $defaults, $options));
        $defaults['forced'] = false;
        $temp->add(new admin_setting_gradecat_combo('grade_droplow', new lang_string('droplow', 'core_grades'),
                    new lang_string('droplow_help', 'core_grades'), $defaults, $options));

        $temp->add(new admin_setting_configcheckbox('grade_overridecat', new lang_string('overridecat', 'core_grades'),
                   new lang_string('overridecat_help', 'core_grades'), 1));
    }
    $ADMIN->add('grades', $temp);


    /// Grade item settings
    $temp = new admin_settingpage('gradeitemsettings', new lang_string('gradeitemsettings', 'core_grades'), 'moodle/grade:manage');
    if ($ADMIN->fulltree) {
        $temp->add(new admin_setting_configselect('grade_displaytype', new lang_string('gradedisplaytype', 'core_grades'),
                                                  new lang_string('gradedisplaytype_help', 'core_grades'), GRADE_DISPLAY_TYPE_REAL, $display_types));

        $temp->add(new admin_setting_configselect('grade_decimalpoints', new lang_string('decimalpoints', 'core_grades'),
                                                  new lang_string('decimalpoints_help', 'core_grades'), 2,
                                                  array( '0' => '0',
                                                         '1' => '1',
                                                         '2' => '2',
                                                         '3' => '3',
                                                         '4' => '4',
                                                         '5' => '5')));

        $temp->add(new admin_setting_configmultiselect('grade_item_advanced', new lang_string('gradeitemadvanced', 'core_grades'), new lang_string('gradeitemadvanced_help', 'core_grades'),
                                                       array('iteminfo', 'idnumber', 'gradepass', 'plusfactor', 'multfactor', 'display', 'decimals', 'hiddenuntil', 'locktime'),
                                                       array('iteminfo' => new lang_string('iteminfo', 'core_grades'),
                                                             'idnumber' => new lang_string('idnumbermod'),
                                                             'gradetype' => new lang_string('gradetype', 'core_grades'),
                                                             'scaleid' => new lang_string('scale'),
                                                             'grademin' => new lang_string('grademin', 'core_grades'),
                                                             'grademax' => new lang_string('grademax', 'core_grades'),
                                                             'gradepass' => new lang_string('gradepass', 'core_grades'),
                                                             'plusfactor' => new lang_string('plusfactor', 'core_grades'),
                                                             'multfactor' => new lang_string('multfactor', 'core_grades'),
                                                             'display' => new lang_string('gradedisplaytype', 'core_grades'),
                                                             'decimals' => new lang_string('decimalpoints', 'core_grades'),
                                                             'hidden' => new lang_string('hidden', 'core_grades'),
                                                             'hiddenuntil' => new lang_string('hiddenuntil', 'core_grades'),
                                                             'locked' => new lang_string('locked', 'core_grades'),
                                                             'locktime' => new lang_string('locktime', 'core_grades'),
                                                             'aggregationcoef' => new lang_string('aggregationcoef', 'core_grades'),
                                                             'parentcategory' => new lang_string('parentcategory', 'core_grades'))));
    }
    $ADMIN->add('grades', $temp);


    /// Scales and outcomes

    $scales = new admin_externalpage('scales', new lang_string('scales'), $CFG->wwwroot.'/grade/edit/scale/index.php', 'moodle/grade:manage');
    $ADMIN->add('grades', $scales);
    if (!empty($CFG->enableoutcomes)) {
        $outcomes = new admin_externalpage('outcomes', new lang_string('outcomes', 'core_grades'), $CFG->wwwroot.'/grade/edit/outcome/index.php', 'moodle/grade:manage');
        $ADMIN->add('grades', $outcomes);
    }
    $letters = new admin_externalpage('letters', new lang_string('letters', 'core_grades'), $CFG->wwwroot.'/grade/edit/letter/index.php', 'moodle/grade:manageletters');
    $ADMIN->add('grades', $letters);

    // The plugins must implement a settings.php file that adds their admin settings to the $settings object

    // Reports
    $ADMIN->add('grades', new admin_category('gradereports', new lang_string('reportsettings', 'core_grades')));
    foreach (core_component::get_plugin_list('gradereport') as $plugin => $plugindir) {
     // Include all the settings commands for this plugin if there are any
        if (file_exists($plugindir.'/settings.php')) {
            $settings = new admin_settingpage('gradereport'.$plugin, new lang_string('pluginname', 'gradereport_'.$plugin), 'moodle/grade:manage');
            include($plugindir.'/settings.php');
            if ($settings) {
                $ADMIN->add('gradereports', $settings);
            }
        }
    }

    // Imports
    $ADMIN->add('grades', new admin_category('gradeimports', new lang_string('importsettings', 'core_grades')));
    foreach (core_component::get_plugin_list('gradeimport') as $plugin => $plugindir) {

     // Include all the settings commands for this plugin if there are any
        if (file_exists($plugindir.'/settings.php')) {
            $settings = new admin_settingpage('gradeimport'.$plugin, new lang_string('pluginname', 'gradeimport_'.$plugin), 'moodle/grade:manage');
            include($plugindir.'/settings.php');
            if ($settings) {
                $ADMIN->add('gradeimports', $settings);
            }
        }
    }


    // Exports
    $ADMIN->add('grades', new admin_category('gradeexports', new lang_string('exportsettings', 'core_grades')));
    foreach (core_component::get_plugin_list('gradeexport') as $plugin => $plugindir) {
     // Include all the settings commands for this plugin if there are any
        if (file_exists($plugindir.'/settings.php')) {
            $settings = new admin_settingpage('gradeexport'.$plugin, new lang_string('pluginname', 'gradeexport_'.$plugin), 'moodle/grade:manage');
            include($plugindir.'/settings.php');
            if ($settings) {
                $ADMIN->add('gradeexports', $settings);
            }
        }
    }

} // end of speedup

