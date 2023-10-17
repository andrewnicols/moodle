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
 * Auto group form
 *
 * @package    core_group
 * @copyright  2007 mattc-catalyst (http://moodle.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
if (!defined('MOODLE_INTERNAL')) {
    die('Direct access to this script is forbidden.');    ///  It must be included from a Moodle page
}

require_once($CFG->dirroot.'/lib/formslib.php');
require_once($CFG->dirroot.'/cohort/lib.php');

/**
 * Auto group form class
 *
 * @package    core_group
 * @copyright  2007 mattc-catalyst (http://moodle.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class autogroup_form extends moodleform {

    /**
     * Form Definition
     */
    function definition() {
        global $USER, $COURSE;
        $coursecontext = context_course::instance($COURSE->id);

        $mform =& $this->_form;

        $mform->addElement('header', 'autogroup', get_string('general'));

        $mform->addElement('text', 'namingscheme', get_string('namingscheme', 'core_group'));
        $mform->addHelpButton('namingscheme', 'namingscheme', 'group');
        $mform->addRule('namingscheme', get_string('required'), 'required', null, 'client');
        $mform->setType('namingscheme', PARAM_TEXT);
        // There must not be duplicate group names in course.
        $template = get_string('grouptemplate', 'core_group');
        $gname = groups_parse_name($template, 0);
        if (!groups_get_group_by_name($COURSE->id, $gname)) {
            $mform->setDefault('namingscheme', $template);
        }

        $options = array('groups' => get_string('numgroups', 'core_group'),
                         'members' => get_string('nummembers', 'core_group'));
        $mform->addElement('select', 'groupby', get_string('groupby', 'core_group'), $options);

        $mform->addElement('text', 'number', get_string('number', 'core_group'),'maxlength="4" size="4"');
        $mform->setType('number', PARAM_INT);
        $mform->addRule('number', null, 'numeric', null, 'client');
        $mform->addRule('number', get_string('required'), 'required', null, 'client');

        // Enable group messaging for the groups to be auto-created.
        if (\core_message\api::can_create_group_conversation($USER->id, $coursecontext)) {
            $mform->addElement('selectyesno', 'enablemessaging', get_string('enablemessaging', 'core_group'));
            $mform->addHelpButton('enablemessaging', 'enablemessaging', 'group');
        }

        $mform->addElement('header', 'groupmembershdr', get_string('groupmembers', 'core_group'));
        $mform->setExpanded('groupmembershdr', true);

        $options = array(0=>get_string('all'));
        $options += $this->_customdata['roles'];
        $mform->addElement('select', 'roleid', get_string('selectfromrole', 'core_group'), $options);

        $student = get_archetype_roles('student');
        $student = reset($student);

        if ($student and array_key_exists($student->id, $options)) {
            $mform->setDefault('roleid', $student->id);
        }

        $coursecontext = context_course::instance($COURSE->id);
        if ($cohorts = cohort_get_available_cohorts($coursecontext, COHORT_WITH_ENROLLED_MEMBERS_ONLY, 0, 0)) {
            $options = array(0 => get_string('anycohort', 'core_cohort'));
            foreach ($cohorts as $c) {
                $options[$c->id] = format_string($c->name, true, context::instance_by_id($c->contextid));
            }
            $mform->addElement('select', 'cohortid', get_string('selectfromcohort', 'core_cohort'), $options);
            $mform->setDefault('cohortid', '0');
        } else {
            $mform->addElement('hidden','cohortid');
            $mform->setType('cohortid', PARAM_INT);
            $mform->setConstant('cohortid', '0');
        }

        if ($groupings = groups_get_all_groupings($COURSE->id)) {
            $options = array();
            $options[0] = get_string('none');
            foreach ($groupings as $grouping) {
                $options[$grouping->id] = format_string($grouping->name);
            }
            $mform->addElement('select', 'groupingid', get_string('selectfromgrouping', 'core_group'), $options);
            $mform->setDefault('groupingid', 0);
            $mform->disabledIf('groupingid', 'notingroup', 'checked');
        } else {
            $mform->addElement('hidden', 'groupingid');
            $mform->setType('groupingid', PARAM_INT);
            $mform->setConstant('groupingid', 0);
        }

        if ($groups = groups_get_all_groups($COURSE->id)) {
            $options = array();
            $options[0] = get_string('none');
            foreach ($groups as $group) {
                $options[$group->id] = format_string($group->name);
            }
            $mform->addElement('select', 'groupid', get_string('selectfromgroup', 'core_group'), $options);
            $mform->setDefault('groupid', 0);
            $mform->disabledIf('groupid', 'notingroup', 'checked');
        } else {
            $mform->addElement('hidden', 'groupid');
            $mform->setType('groupid', PARAM_INT);
            $mform->setConstant('groupid', 0);
        }

        $options = array('no'        => get_string('noallocation', 'core_group'),
                         'random'    => get_string('random', 'core_group'),
                         'firstname' => get_string('byfirstname', 'core_group'),
                         'lastname'  => get_string('bylastname', 'core_group'),
                         'idnumber'  => get_string('byidnumber', 'core_group'));
        $mform->addElement('select', 'allocateby', get_string('allocateby', 'core_group'), $options);
        $mform->setDefault('allocateby', 'random');

        $mform->addElement('checkbox', 'nosmallgroups', get_string('nosmallgroups', 'core_group'));
        $mform->disabledIf('nosmallgroups', 'groupby', 'noteq', 'members');

        $mform->addElement('checkbox', 'notingroup', get_string('notingroup', 'core_group'));
        $mform->disabledIf('notingroup', 'groupingid', 'neq', 0);
        $mform->disabledIf('notingroup', 'groupid', 'neq', 0);

        if (has_capability('moodle/course:viewsuspendedusers', $coursecontext)) {
            $mform->addElement('checkbox', 'includeonlyactiveenrol', get_string('includeonlyactiveenrol', 'core_group'), '');
            $mform->addHelpButton('includeonlyactiveenrol', 'includeonlyactiveenrol', 'group');
            $mform->setDefault('includeonlyactiveenrol', true);
        }

        $mform->addElement('header', 'groupinghdr', get_string('grouping', 'core_group'));

        $options = array('0' => get_string('nogrouping', 'core_group'),
                         '-1'=> get_string('newgrouping', 'core_group'));
        if ($groupings = groups_get_all_groupings($COURSE->id)) {
            foreach ($groupings as $grouping) {
                $options[$grouping->id] = strip_tags(format_string($grouping->name));
            }
        }
        $mform->addElement('select', 'grouping', get_string('createingrouping', 'core_group'), $options);
        if ($groupings) {
            $mform->setDefault('grouping', '-1');
        }

        $mform->addElement('text', 'groupingname', get_string('groupingname', 'core_group'), $options);
        $mform->setType('groupingname', PARAM_TEXT);
        $mform->disabledIf('groupingname', 'grouping', 'noteq', '-1');

        $mform->addElement('hidden','courseid');
        $mform->setType('courseid', PARAM_INT);

        $mform->addElement('hidden','seed');
        $mform->setType('seed', PARAM_INT);

        $buttonarray = array();
        $buttonarray[] = &$mform->createElement('submit', 'preview', get_string('preview'));
        $buttonarray[] = &$mform->createElement('submit', 'submitbutton', get_string('submit'));
        $buttonarray[] = &$mform->createElement('cancel');
        $mform->addGroup($buttonarray, 'buttonar', '', array(' '), false);
        $mform->closeHeaderBefore('buttonar');
    }

    /**
     * Performs validation of the form information
     *
     * @param array $data
     * @param array $files
     * @return array $errors An array of $errors
     */
    function validation($data, $files) {
        global $CFG, $COURSE;
        $errors = parent::validation($data, $files);

        if ($data['allocateby'] != 'no') {
            $source = array();
            if ($data['cohortid']) {
                $source['cohortid'] = $data['cohortid'];
            }
            if ($data['groupingid']) {
                $source['groupingid'] = $data['groupingid'];
            }
            if ($data['groupid']) {
                $source['groupid'] = $data['groupid'];
            }
            if (!$users = groups_get_potential_members($data['courseid'], $data['roleid'], $source)) {
                $errors['roleid'] = get_string('nousersinrole', 'core_group');
            }

           /// Check the number entered is sane
            if ($data['groupby'] == 'groups') {
                $usercnt = count($users);

                if ($data['number'] > $usercnt || $data['number'] < 1) {
                    $errors['number'] = get_string('toomanygroups', 'core_group', $usercnt);
                }
            }
        }

        //try to detect group name duplicates
        $name = groups_parse_name(trim($data['namingscheme']), 0);
        if (groups_get_group_by_name($COURSE->id, $name)) {
            $errors['namingscheme'] = get_string('groupnameexists', 'core_group', $name);
        }

        // check grouping name duplicates
        if ( isset($data['grouping']) && $data['grouping'] == '-1') {
            $name = trim($data['groupingname']);
            if (empty($name)) {
                $errors['groupingname'] = get_string('required');
            } else if (groups_get_grouping_by_name($COURSE->id, $name)) {
                $errors['groupingname'] = get_string('groupingnameexists', 'core_group', $name);
            }
        }

       /// Check the naming scheme
        if ($data['groupby'] == 'groups' and $data['number'] == 1) {
            // we can use the name as is because there will be only one group max
        } else {
            $matchcnt = preg_match_all('/[#@]{1,1}/', $data['namingscheme'], $matches);
            if ($matchcnt != 1) {
                $errors['namingscheme'] = get_string('badnamingscheme', 'core_group');
            }
        }

        return $errors;
    }
}
