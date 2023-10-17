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
 * The mform for exporting calendar events
 *
 * @package core_calendar
 * @copyright 2014 Brian Barnes
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// Always include formslib.
if (!defined('MOODLE_INTERNAL')) {
    die('Direct access to this script is forbidden.');    // It must be included from a Moodle page.
}

require_once($CFG->dirroot.'/lib/formslib.php');

/**
 * The mform class for creating and editing a calendar
 *
 * @copyright 2014 Brian Barnes
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class core_calendar_export_form extends moodleform {

    /**
     * The export form definition
     * @throws coding_exception
     */
    public function definition() {
        global $CFG;
        $mform = $this->_form;
        $mform->addElement('html', '<div class="mt-3 mb-xl-6">' . get_string('exporthelp', 'core_calendar') . '</div>');

        $export = array();
        $export[] = $mform->createElement('radio', 'exportevents', '', get_string('eventsall', 'core_calendar'), 'all');
        $export[] = $mform->createElement('radio', 'exportevents', '', get_string('eventsrelatedtocategories', 'core_calendar'), 'categories');
        $export[] = $mform->createElement('radio', 'exportevents', '', get_string('eventsrelatedtocourses', 'core_calendar'), 'courses');
        $export[] = $mform->createElement('radio', 'exportevents', '', get_string('eventsrelatedtogroups', 'core_calendar'), 'groups');
        $export[] = $mform->createElement('radio', 'exportevents', '', get_string('eventspersonal', 'core_calendar'), 'user');

        $mform->addGroup($export, 'events', get_string('eventstoexport', 'core_calendar'), '<br/>');
        $mform->addGroupRule('events', get_string('required'), 'required');
        $mform->setDefault('events', 'all');

        $range = array();
        if ($this->_customdata['allowthisweek']) {
            $range[] = $mform->createElement('radio', 'timeperiod', '', get_string('weekthis', 'core_calendar'), 'weeknow');
        }
        if ($this->_customdata['allownextweek']) {
            $range[] = $mform->createElement('radio', 'timeperiod', '', get_string('weeknext', 'core_calendar'), 'weeknext');
        }
        $range[] = $mform->createElement('radio', 'timeperiod', '', get_string('monththis', 'core_calendar'), 'monthnow');
        if ($this->_customdata['allownextmonth']) {
            $range[] = $mform->createElement('radio', 'timeperiod', '', get_string('monthnext', 'core_calendar'), 'monthnext');
        }
        $range[] = $mform->createElement('radio', 'timeperiod', '', get_string('recentupcoming', 'core_calendar'), 'recentupcoming');

        if ($CFG->calendar_customexport) {
            $a = new stdClass();
            $now = time();
            $time = $now - $CFG->calendar_exportlookback * DAYSECS;
            $a->timestart = userdate($time, get_string('strftimedatefullshort', 'core_langconfig'));
            $time = $now + $CFG->calendar_exportlookahead * DAYSECS;
            $a->timeend = userdate($time, get_string('strftimedatefullshort', 'core_langconfig'));

            $range[] = $mform->createElement('radio', 'timeperiod', '', get_string('customexport', 'core_calendar', $a), 'custom');
        }

        $mform->addGroup($range, 'period', get_string('timeperiod', 'core_calendar'), '<br/>');
        $mform->addGroupRule('period', get_string('required'), 'required');
        $mform->setDefault('period', 'recentupcoming');

        $buttons = array();
        $buttons[] = $mform->createElement('submit', 'generateurl', get_string('generateurlbutton', 'core_calendar'));
        $buttons[] = $mform->createElement('submit', 'export', get_string('exportbutton', 'core_calendar'));
        $mform->addGroup($buttons);
    }
}
