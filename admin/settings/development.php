<?php

// * Miscellaneous settings

if ($hassiteconfig) { // speedup for non-admins, add all caps used on this page

    // Experimental settings page
    $ADMIN->add('development', new admin_category('experimental', new lang_string('experimental','core_admin')));

    $temp = new admin_settingpage('experimentalsettings', new lang_string('experimentalsettings', 'core_admin'));
    //TODO: Re-enable cc-import once re-implemented in 2.0.x
    //$temp->add(new admin_setting_configcheckbox('enableimsccimport', new lang_string('enable_cc_import', 'imscc'), new lang_string('enable_cc_import_description', 'imscc'), 0));

    $temp->add(new admin_setting_configcheckbox('dndallowtextandlinks', new lang_string('dndallowtextandlinks', 'core_admin'), new lang_string('configdndallowtextandlinks', 'core_admin'), 0));

    $temp->add(new admin_setting_configexecutable('pathtosassc', new lang_string('pathtosassc', 'core_admin'), new lang_string('pathtosassc_help', 'core_admin'), ''));

    $temp->add(new admin_setting_configcheckbox('contextlocking', new lang_string('contextlocking', 'core_admin'),
        new lang_string('contextlocking_desc', 'core_admin'), 0));

    $temp->add(new admin_setting_configcheckbox(
            'contextlockappliestoadmin',
            new lang_string('contextlockappliestoadmin', 'core_admin'),
            new lang_string('contextlockappliestoadmin_desc', 'core_admin'),
            1
        ));

    $temp->add(new admin_setting_configcheckbox('forceclean', new lang_string('forceclean', 'core_admin'),
        new lang_string('forceclean_desc', 'core_admin'), 0));

    // Relative course dates mode setting.
    $temp->add(new admin_setting_configcheckbox('enablecourserelativedates',
        new lang_string('enablecourserelativedates', 'core_admin'),
        new lang_string('enablecourserelativedates_desc', 'core_admin'), 0));

    // Sharing to MoodleNet setting.
    $temp->add(new admin_setting_configcheckbox('enablesharingtomoodlenet',
        new lang_string('enablesharingtomoodlenet', 'core_admin'),
        new lang_string('enablesharingtomoodlenet_desc', 'core_admin'), 0));

    // New communication subsystem setting.
    $temp->add(new admin_setting_configcheckbox('enablecommunicationsubsystem',
        new lang_string('enablecommunicationsubsystem', 'core_admin'),
        new lang_string('enablecommunicationsubsystem_desc', 'core_admin'), 0));

    $ADMIN->add('experimental', $temp);

    // "debugging" settingpage
    $temp = new admin_settingpage('debugging', new lang_string('debugging', 'core_admin'));
    $temp->add(new admin_setting_special_debug());
    $temp->add(new admin_setting_configcheckbox('debugdisplay', new lang_string('debugdisplay', 'core_admin'),
        new lang_string('configdebugdisplay', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('perfdebug', new lang_string('perfdebug', 'core_admin'), new lang_string('configperfdebug', 'core_admin'), '7', '15', '7'));
    $temp->add(new admin_setting_configcheckbox('debugstringids', new lang_string('debugstringids', 'core_admin'), new lang_string('debugstringids_desc', 'core_admin'), 0));
    $temp->add(new admin_setting_configselect('debugsqltrace',
            new lang_string('debugsqltrace', 'core_admin'),
            new lang_string('debugsqltrace_desc', 'core_admin'), 0, array(
               0 => new lang_string('disabled', 'core_admin'),
               1 => new lang_string('debugsqltrace1', 'core_admin'),
               2 => new lang_string('debugsqltrace2', 'core_admin'),
             100 => new lang_string('debugsqltrace100', 'core_admin'))));
    $temp->add(new admin_setting_configcheckbox('debugvalidators', new lang_string('debugvalidators', 'core_admin'), new lang_string('configdebugvalidators', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('debugpageinfo', new lang_string('debugpageinfo', 'core_admin'), new lang_string('configdebugpageinfo', 'core_admin'), 0));
    $temp->add(new admin_setting_configcheckbox('debugtemplateinfo', new lang_string('debugtemplateinfo', 'core_admin'), new lang_string('debugtemplateinfo_desc', 'core_admin'), 0));
    $ADMIN->add('development', $temp);

    // "Profiling" settingpage (conditionally if the 'xhprof' extension is available only).
    $xhprofenabled = extension_loaded('tideways_xhprof');
    $xhprofenabled = $xhprofenabled || extension_loaded('tideways');
    $xhprofenabled = $xhprofenabled || extension_loaded('xhprof');
    $temp = new admin_settingpage('profiling', new lang_string('profiling', 'core_admin'), 'moodle/site:config', !$xhprofenabled);
    // Main profiling switch.
    $temp->add(new admin_setting_configcheckbox('profilingenabled', new lang_string('profilingenabled', 'core_admin'), new lang_string('profilingenabled_help', 'core_admin'), false));
    // List of URLs that will be automatically profiled.
    $temp->add(new admin_setting_configtextarea('profilingincluded', new lang_string('profilingincluded', 'core_admin'), new lang_string('profilingincluded_help', 'core_admin'), ''));
    // List of URLs that won't be profiled ever.
    $temp->add(new admin_setting_configtextarea('profilingexcluded', new lang_string('profilingexcluded', 'core_admin'), new lang_string('profilingexcluded_help', 'core_admin'), ''));
    // Allow random profiling each XX requests.
    $temp->add(new admin_setting_configtext('profilingautofrec', new lang_string('profilingautofrec', 'core_admin'), new lang_string('profilingautofrec_help', 'core_admin'), 0, PARAM_INT));
    // Allow PROFILEME/DONTPROFILEME GPC.
    $temp->add(new admin_setting_configcheckbox('profilingallowme', new lang_string('profilingallowme', 'core_admin'), new lang_string('profilingallowme_help', 'core_admin'), false));
    // Allow PROFILEALL/PROFILEALLSTOP GPC.
    $temp->add(new admin_setting_configcheckbox('profilingallowall', new lang_string('profilingallowall', 'core_admin'), new lang_string('profilingallowall_help', 'core_admin'), false));
    $temp->add(new admin_setting_configtext('profilingslow', new lang_string('profilingslow', 'core_admin'),
        new lang_string('profilingslow_help', 'core_admin'), 0, PARAM_FLOAT));
    // TODO: Allow to skip PHP functions (XHPROF_FLAGS_NO_BUILTINS)
    // TODO: Allow to skip call_user functions (ignored_functions array)
    // Specify the life time (in minutes) of profiling runs.
    $temp->add(new admin_setting_configselect('profilinglifetime', new lang_string('profilinglifetime', 'core_admin'), new lang_string('profilinglifetime_help', 'core_admin'), 24*60, array(
               0 => new lang_string('neverdeleteruns', 'core_admin'),
        30*24*60 => new lang_string('numdays', '', 30),
        15*24*60 => new lang_string('numdays', '', 15),
         7*24*60 => new lang_string('numdays', '', 7),
         4*24*60 => new lang_string('numdays', '', 4),
         2*24*60 => new lang_string('numdays', '', 2),
           24*60 => new lang_string('numhours', '', 24),
           16*80 => new lang_string('numhours', '', 16),
            8*60 => new lang_string('numhours', '', 8),
            4*60 => new lang_string('numhours', '', 4),
            2*60 => new lang_string('numhours', '', 2),
              60 => new lang_string('numminutes', '', 60),
              30 => new lang_string('numminutes', '', 30),
              15 => new lang_string('numminutes', '', 15))));
    // Define the prefix to be added to imported profiling runs.
    $temp->add(new admin_setting_configtext('profilingimportprefix',
            new lang_string('profilingimportprefix', 'core_admin'),
            new lang_string('profilingimportprefix_desc', 'core_admin'), '(I)', PARAM_TAG, 10));

    // Add the 'profiling' page to admin block.
    $ADMIN->add('development', $temp);

     // Web service test clients DO NOT COMMIT : THE EXTERNAL WEB PAGE IS NOT AN ADMIN PAGE !!!!!
    $ADMIN->add('development', new admin_externalpage('testclient', new lang_string('testclient', 'core_webservice'), "$CFG->wwwroot/$CFG->admin/webservice/testclient.php"));


    if ($CFG->mnet_dispatcher_mode !== 'off') {
        $ADMIN->add('development', new admin_externalpage('mnettestclient', new lang_string('testclient', 'core_mnet'), "$CFG->wwwroot/$CFG->admin/mnet/testclient.php"));
    }

    $ADMIN->add('development', new admin_externalpage('purgecaches', new lang_string('purgecachespage', 'core_admin'),
            "$CFG->wwwroot/$CFG->admin/purgecaches.php"));

    $ADMIN->add('development', new admin_externalpage('thirdpartylibs', new lang_string('thirdpartylibs','core_admin'), "$CFG->wwwroot/$CFG->admin/thirdpartylibs.php"));

    $ADMIN->add('development', new admin_externalpage('hooksoverview',
        new lang_string('hooksoverview', 'core_admin'), "$CFG->wwwroot/$CFG->admin/hooks.php"));
} // end of speedup
