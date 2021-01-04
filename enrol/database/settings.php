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
 * Database enrolment plugin settings and presets.
 *
 * @package    enrol_database
 * @copyright  2010 Petr Skoda {@link http://skodak.org}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

if ($ADMIN->fulltree) {

    //--- general settings -----------------------------------------------------------------------------------
    $settings->add(new admin_setting_heading('enrol_database_settings', '', get_string('pluginname_desc', 'enrol_database')));

    $settings->add(new admin_setting_heading('enrol_database_exdbheader', get_string('settingsheaderdb', 'enrol_database'), ''));

    $options = array('', "access", "ado_access", "ado", "ado_mssql", "borland_ibase", "csv", "db2", "fbsql", "firebird", "ibase", "informix72", "informix", "mssql", "mssql_n", "mssqlnative", "mysql", "mysqli", "mysqlt", "oci805", "oci8", "oci8po", "odbc", "odbc_mssql", "odbc_oracle", "oracle", "pdo", "postgres64", "postgres7", "postgres", "proxy", "sqlanywhere", "sybase", "vfp");
    $options = array_combine($options, $options);
    $settings->add(new admin_setting_configselect('enrol_database/dbtype', get_string('dbtype', 'enrol_database'), get_string('dbtype_desc', 'enrol_database'), '', $options));

    $settings->add(new admin_setting_configtext('enrol_database/dbhost', get_string('dbhost', 'enrol_database'), get_string('dbhost_desc', 'enrol_database'), 'localhost'));

    $settings->add(new admin_setting_configtext('enrol_database/dbuser', get_string('dbuser', 'enrol_database'), '', ''));

    $settings->add(new admin_setting_configpasswordunmask('enrol_database/dbpass', get_string('dbpass', 'enrol_database'), '', ''));

    $settings->add(new admin_setting_configtext('enrol_database/dbname', get_string('dbname', 'enrol_database'), get_string('dbname_desc', 'enrol_database'), ''));

    $settings->add(new admin_setting_configtext('enrol_database/dbencoding', get_string('dbencoding', 'enrol_database'), '', 'utf-8'));

    $settings->add(new admin_setting_configtext('enrol_database/dbsetupsql', get_string('dbsetupsql', 'enrol_database'), get_string('dbsetupsql_desc', 'enrol_database'), ''));

    $settings->add(new admin_setting_configcheckbox('enrol_database/dbsybasequoting', get_string('dbsybasequoting', 'enrol_database'), get_string('dbsybasequoting_desc', 'enrol_database'), 0));

    $settings->add(new admin_setting_configcheckbox('enrol_database/debugdb', get_string('debugdb', 'enrol_database'), get_string('debugdb_desc', 'enrol_database'), 0));



    $settings->add(new admin_setting_heading('enrol_database_localheader', get_string('settingsheaderlocal', 'enrol_database'), ''));

    $options = array('id'=>'id', 'idnumber'=>'idnumber', 'shortname'=>'shortname');
    $settings->add(new admin_setting_configselect('enrol_database/localcoursefield', get_string('localcoursefield', 'enrol_database'), '', 'idnumber', $options));

    $options = array('id'=>'id', 'idnumber'=>'idnumber', 'email'=>'email', 'username'=>'username'); // only local users if username selected, no mnet users!
    $settings->add(new admin_setting_configselect('enrol_database/localuserfield', get_string('localuserfield', 'enrol_database'), '', 'idnumber', $options));

    $options = array('id'=>'id', 'shortname'=>'shortname');
    $settings->add(new admin_setting_configselect('enrol_database/localrolefield', get_string('localrolefield', 'enrol_database'), '', 'shortname', $options));

    $options = array('id'=>'id', 'idnumber'=>'idnumber');
    $settings->add(new admin_setting_configselect('enrol_database/localcategoryfield', get_string('localcategoryfield', 'enrol_database'), '', 'id', $options));


    $settings->add(new admin_setting_heading('enrol_database_remoteheader', get_string('settingsheaderremote', 'enrol_database'), ''));

    $settings->add(new admin_setting_configtext('enrol_database/remoteenroltable', get_string('remoteenroltable', 'enrol_database'), get_string('remoteenroltable_desc', 'enrol_database'), ''));

    $settings->add(new admin_setting_configtext('enrol_database/remotecoursefield', get_string('remotecoursefield', 'enrol_database'), get_string('remotecoursefield_desc', 'enrol_database'), ''));

    $settings->add(new admin_setting_configtext('enrol_database/remoteuserfield', get_string('remoteuserfield', 'enrol_database'), get_string('remoteuserfield_desc', 'enrol_database'), ''));

    $settings->add(new admin_setting_configtext('enrol_database/remoterolefield', get_string('remoterolefield', 'enrol_database'), get_string('remoterolefield_desc', 'enrol_database'), ''));

    $otheruserfieldlabel = get_string('remoteotheruserfield', 'enrol_database');
    $otheruserfielddesc  = get_string('remoteotheruserfield_desc', 'enrol_database');
    $settings->add(new admin_setting_configtext('enrol_database/remoteotheruserfield', $otheruserfieldlabel, $otheruserfielddesc, ''));

    if (!during_initial_install()) {
        $options = get_default_enrol_roles(context_system::instance());
        $student = get_archetype_roles('student');
        $student = reset($student);
        $settings->add(new admin_setting_configselect('enrol_database/defaultrole',
            get_string('defaultrole', 'enrol_database'),
            get_string('defaultrole_desc', 'enrol_database'),
            $student->id ?? null,
            $options));
    }

    $settings->add(new admin_setting_configcheckbox('enrol_database/ignorehiddencourses', get_string('ignorehiddencourses', 'enrol_database'), get_string('ignorehiddencourses_desc', 'enrol_database'), 0));

    $options = array(ENROL_EXT_REMOVED_UNENROL        => get_string('extremovedunenrol', 'enrol'),
                     ENROL_EXT_REMOVED_KEEP           => get_string('extremovedkeep', 'enrol'),
                     ENROL_EXT_REMOVED_SUSPEND        => get_string('extremovedsuspend', 'enrol'),
                     ENROL_EXT_REMOVED_SUSPENDNOROLES => get_string('extremovedsuspendnoroles', 'enrol'));
    $settings->add(new admin_setting_configselect('enrol_database/unenrolaction', get_string('extremovedaction', 'enrol'), get_string('extremovedaction_help', 'enrol'), ENROL_EXT_REMOVED_UNENROL, $options));


    // Settings relating to group synchronisation.
    // This includes:
    // - groupstable - the name of the table that describes the groups to create
    // -- groupscourseidnumber - the course idnumber which owns a group
    // -- groupsgroupidnumber - the idnumber for this group (unique within the course)
    // -- groupsname - the name of the group
    // -- removegroupsaction - how to handle group removal
    // - groupmemberstable - the name of the table that describes the mapping of users to groups
    // -- groupmemberscourseidnumber - the course idnumber which owns a group
    // -- groupmembersgroupidnumber - the idnumber for this group (unique within the course)
    // -- groupmembersuseridnumber - the idnumber of the user to put into this group
    $settings->add(
        new admin_setting_heading(
            'enrol_database_groupsync',
            get_string('settingsheadergroupsync', 'enrol_database'),
            get_string('settingsheadergroupsync_desc', 'enrol_database')
        )
    );

    $settings->add(
        new admin_setting_configtext(
            'enrol_database/remotegroupstable',
            get_string('remotegroupstable', 'enrol_database'),
            get_string('remotegroupstable_desc', 'enrol_database'),
            ''
        )
    );

    $settings->add(
        new admin_setting_configtext(
            'enrol_database/groupscourseidnumber',
            get_string('groupscourseidnumber', 'enrol_database'),
            get_string('groupscourseidnumber_desc', 'enrol_database'),
            'courseidnumber'
        )
    );

    $settings->add(
        new admin_setting_configtext(
            'enrol_database/groupsgroupidnumber',
            get_string('groupsgroupidnumber', 'enrol_database'),
            get_string('groupsgroupidnumber_desc', 'enrol_database'),
            'groupidnumber'
        )
    );

    $settings->add(
        new admin_setting_configtext(
            'enrol_database/groupsgroupname',
            get_string('groupsgroupname', 'enrol_database'),
            get_string('groupsgroupname_desc', 'enrol_database'),
            'groupname'
        )
    );

    $settings->add(
        new admin_setting_configselect(
            'enrol_database/removegroupsaction',
            get_string('removegroupsaction', 'enrol_database'),
            get_string('removegroupsaction_desc', 'enrol_database'),
            // 1 = Keep unused groups.
            1,
            [
                0 => get_string('removegroupsaction_remove', 'enrol_database'),
                1 => get_string('removegroupsaction_keep', 'enrol_database'),
            ]
        )
    );

    $settings->add(
        new admin_setting_configtext(
            'enrol_database/remotegroupmemberstable',
            get_string('remotegroupmemberstable', 'enrol_database'),
            get_string('remotegroupmemberstable_desc', 'enrol_database'),
            ''
        )
    );

    $settings->add(
        new admin_setting_configtext(
            'enrol_database/groupmemberscourseidnumber',
            get_string('groupmemberscourseidnumber', 'enrol_database'),
            get_string('groupmemberscourseidnumber_desc', 'enrol_database'),
            'courseidnumber'
        )
    );

    $settings->add(
        new admin_setting_configtext(
            'enrol_database/groupmembersgroupidnumber',
            get_string('groupmembersgroupidnumber', 'enrol_database'),
            get_string('groupmembersgroupidnumber_desc', 'enrol_database'),
            'groupidnumber'
        )
    );

    $settings->add(
        new admin_setting_configtext(
            'enrol_database/groupmembersuseridnumber',
            get_string('groupmembersuseridnumber', 'enrol_database'),
            get_string('groupmembersuseridnumber_desc', 'enrol_database'),
            'useridnumber'
        )
    );

    // Course creation.
    $settings->add(new admin_setting_heading('enrol_database_newcoursesheader', get_string('settingsheadernewcourses', 'enrol_database'), ''));

    $settings->add(new admin_setting_configtext('enrol_database/newcoursetable', get_string('newcoursetable', 'enrol_database'), get_string('newcoursetable_desc', 'enrol_database'), ''));

    $settings->add(new admin_setting_configtext('enrol_database/newcoursefullname', get_string('newcoursefullname', 'enrol_database'), '', 'fullname'));

    $settings->add(new admin_setting_configtext('enrol_database/newcourseshortname', get_string('newcourseshortname', 'enrol_database'), '', 'shortname'));

    $settings->add(new admin_setting_configtext('enrol_database/newcourseidnumber', get_string('newcourseidnumber', 'enrol_database'), '', 'idnumber'));

    $settings->add(new admin_setting_configtext('enrol_database/newcoursecategory', get_string('newcoursecategory', 'enrol_database'), '', ''));

    $settings->add(new admin_settings_coursecat_select('enrol_database/defaultcategory',
        get_string('defaultcategory', 'enrol_database'),
        get_string('defaultcategory_desc', 'enrol_database'), 1));

    $settings->add(new admin_setting_configtext('enrol_database/templatecourse', get_string('templatecourse', 'enrol_database'), get_string('templatecourse_desc', 'enrol_database'), ''));
}
