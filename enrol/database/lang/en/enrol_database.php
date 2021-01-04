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
 * Strings for component 'enrol_database', language 'en'.
 *
 * @package   enrol_database
 * @copyright 1999 onwards Martin Dougiamas  {@link http://moodle.com}
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

$string['database:config'] = 'Configure database enrol instances';
$string['database:unenrol'] = 'Unenrol suspended users';
$string['dbencoding'] = 'Database encoding';
$string['dbhost'] = 'Database host';
$string['dbhost_desc'] = 'Type database server IP address or host name. Use a system DSN name if using ODBC. Use a PDO DSN if using PDO.';
$string['dbname'] = 'Database name';
$string['dbname_desc'] = 'Leave empty if using a DSN name in database host.';
$string['dbpass'] = 'Database password';
$string['dbsetupsql'] = 'Database setup command';
$string['dbsetupsql_desc'] = 'SQL command for special database setup, often used to setup communication encoding - example for MySQL and PostgreSQL: <em>SET NAMES \'utf8\'</em>';
$string['dbsybasequoting'] = 'Use sybase quotes';
$string['dbsybasequoting_desc'] = 'Sybase style single quote escaping - needed for Oracle, MS SQL and some other databases. Do not use for MySQL!';
$string['dbtype'] = 'Database driver';
$string['dbtype_desc'] = 'ADOdb database driver name, type of the external database engine.';
$string['dbuser'] = 'Database user';
$string['debugdb'] = 'Debug ADOdb';
$string['debugdb_desc'] = 'Debug ADOdb connection to external database - use when getting empty page during login. Not suitable for production sites!';
$string['defaultcategory'] = 'Default new course category';
$string['defaultcategory_desc'] = 'The default category for auto-created courses. Used when no new category id specified or not found.';
$string['defaultrole'] = 'Default role';
$string['defaultrole_desc'] = 'The role that will be assigned by default if no other role is specified in external table.';
$string['groupmemberscourseidnumber'] = 'Course idnumber field for group membership';
$string['groupmemberscourseidnumber_desc'] = 'The name of the database column which contains the idnumber of the course that owns the group to synchronise';
$string['groupmembersgroupidnumber'] = 'Group idnumber field for group membership';
$string['groupmembersgroupidnumber_desc'] = 'The name of the database column which contains the idnumber of the group to synchronise';
$string['groupmembersuseridnumber'] = 'User idnumber field for group membership';
$string['groupmembersuseridnumber_desc'] = 'The name of the database column which contains the idnumber of the user to place into the group';
$string['groupscourseidnumber'] = 'Course idnumber field for groups';
$string['groupscourseidnumber_desc'] = 'The name of the database column which contains the idnumber of the course that owns the group to synchronise';
$string['groupsgroupidnumber'] = 'Group idnumber field';
$string['groupsgroupidnumber_desc'] = 'The name of the database column which contains the idnumber of the group to synchronise';
$string['groupsgroupname'] = 'Group name field';
$string['groupsgroupname_desc'] = 'The database column in the remote database which contains the name of the group to synchronise';
$string['ignorehiddencourses'] = 'Ignore hidden courses';
$string['usermembersuseridnumber_desc'] = 'The name of the database column which contains the idnumber of the user to be placed into a group';
$string['ignorehiddencourses_desc'] = 'If enabled users will not be enrolled on courses that are set to be unavailable to students.';
$string['localcategoryfield'] = 'Local category field';
$string['localcoursefield'] = 'Local course field';
$string['localrolefield'] = 'Local role field';
$string['localuserfield'] = 'Local user field';
$string['newcoursetable'] = 'Remote new courses table';
$string['newcoursetable_desc'] = 'Specify of the name of the table that contains list of courses that should be created automatically. Empty means no courses are created.';
$string['newcoursecategory'] = 'New course category field';
$string['newcoursefullname'] = 'New course full name field';
$string['newcourseidnumber'] = 'New course ID number field';
$string['newcourseshortname'] = 'New course short name field';
$string['pluginname'] = 'External database';
$string['pluginname_desc'] = 'You can use an external database (of nearly any kind) to control your enrolments. It is assumed your external database contains at least a field containing a course ID, and a field containing a user ID. These are compared against fields that you choose in the local course and user tables.';
$string['remotecoursefield'] = 'Remote course field';
$string['remotecoursefield_desc'] = 'The name of the field in the remote table that we are using to match entries in the course table.';
$string['remoteenroltable'] = 'Remote user enrolment table';
$string['remoteenroltable_desc'] = 'Specify the name of the table that contains list of user enrolments. Empty means no user enrolment sync.';
$string['remotegroupstable'] = 'Remote group table';
$string['remotegroupstable_desc'] = 'Specify a table which contains a list of groups to create and manage within the course. If not specified then groups will not be synchronised.';
$string['remotegroupmemberstable'] = 'Remote group membership table';
$string['remotegroupmemberstable_desc'] = 'Specify the name of the table that map users to their group membership within a course. If not specified then group membership will not be synchronised.';
$string['remoteotheruserfield'] = 'Remote Other User field';
$string['remoteotheruserfield_desc'] = 'The name of the field in the remote table that we are using to flag "Other User" role assignments.';
$string['remoterolefield'] = 'Remote role field';
$string['remoterolefield_desc'] = 'The name of the field in the remote table that we are using to match entries in the roles table.';
$string['remoteuserfield'] = 'Remote user field';
$string['removegroupsaction'] = 'Remote group removal action';
$string['removegroupsaction_remove'] = 'Remove unused groups';
$string['removegroupsaction_keep'] = 'Keep unused groups';
$string['removegroupsaction_desc'] = 'How to handle the case where a group has been removed from the remote system. Removal of groups should be used with caution as many activities store content against a specific group. Removal of groups is not reversible and can lead to inaccessible data.';
$string['settingsheaderdb'] = 'External database connection';
$string['settingsheadergroupsync'] = 'Remote group sync';
$string['settingsheadergroupsync_desc'] = 'You can synchronise a list of groups to be created within a course, and the membership of each group.';
$string['settingsheaderlocal'] = 'Local field mapping';
$string['settingsheaderremote'] = 'Remote enrolment sync';
$string['settingsheadernewcourses'] = 'Creation of new courses';
$string['syncenrolmentstask'] = 'Synchronise external database enrolments task';
$string['remoteuserfield_desc'] = 'The name of the field in the remote table that we are using to match entries in the user table.';
$string['templatecourse'] = 'New course template';
$string['templatecourse_desc'] = 'Optional: auto-created courses can copy their settings from a template course. Type here the shortname of the template course.';
$string['privacy:metadata'] = 'The External database enrolment plugin does not store any personal data.';
