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
 * Manage calendar events.
 *
 * This class provides the required functionality in order to manage calendar events.
 * It was introduced as part of Moodle 2.0 and was created in order to provide a
 * better framework for dealing with calendar events in particular regard to file
 * handling through the new file API.
 *
 * @package    core_calendar
 * @category   calendar
 * @copyright  Sam Hemelryk
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @property int $id The id within the event table
 * @property string $name The name of the event
 * @property string $description The description of the event
 * @property int $format The format of the description FORMAT_?
 * @property int $courseid The course the event is associated with (0 if none)
 * @property int $groupid The group the event is associated with (0 if none)
 * @property int $userid The user the event is associated with (0 if none)
 * @property int $repeatid If this is a repeated event this will be set to the
 *                          id of the original
 * @property string $component If created by a plugin/component (other than module), the full frankenstyle name of a component
 * @property string $modulename If added by a module this will be the module name
 * @property int $instance If added by a module this will be the module instance
 * @property string $eventtype The event type
 * @property int $timestart The start time as a timestamp
 * @property int $timeduration The duration of the event in seconds
 * @property int $timeusermidnight User midnight for the event
 * @property int $visible 1 if the event is visible
 * @property int $uuid ?
 * @property int $sequence ?
 * @property int $timemodified The time last modified as a timestamp
 */
class calendar_event {

    /** @var stdClass An object containing the event properties can be accessed via the magic __get/set methods */
    protected $properties = null;

    /** @var string The converted event discription with file paths resolved.
     *              This gets populated when someone requests description for the first time */
    protected $_description = null;

    /** @var array The options to use with this description editor */
    protected $editoroptions = array(
        'subdirs' => false,
        'forcehttps' => false,
        'maxfiles' => -1,
        'maxbytes' => null,
        'trusttext' => false);

    /** @var object The context to use with the description editor */
    protected $editorcontext = null;

    /**
     * Instantiates a new event and optionally populates its properties with the data provided.
     *
     * @param \stdClass $data Optional. An object containing the properties to for
     *                  an event
     */
    public function __construct($data = null) {
        global $CFG, $USER;

        // First convert to object if it is not already (should either be object or assoc array).
        if (!is_object($data)) {
            $data = (object) $data;
        }

        $this->editoroptions['maxbytes'] = $CFG->maxbytes;

        $data->eventrepeats = 0;

        if (empty($data->id)) {
            $data->id = null;
        }

        if (!empty($data->subscriptionid)) {
            $data->subscription = calendar_get_subscription($data->subscriptionid);
        }

        // Default to a user event.
        if (empty($data->eventtype)) {
            $data->eventtype = 'user';
        }

        // Default to the current user.
        if (empty($data->userid)) {
            $data->userid = $USER->id;
        }

        if (!empty($data->timeduration) && is_array($data->timeduration)) {
            $data->timeduration = make_timestamp(
                    $data->timeduration['year'], $data->timeduration['month'], $data->timeduration['day'],
                    $data->timeduration['hour'], $data->timeduration['minute']) - $data->timestart;
        }

        if (!empty($data->description) && is_array($data->description)) {
            $data->format = $data->description['format'];
            $data->description = $data->description['text'];
        } else if (empty($data->description)) {
            $data->description = '';
            $data->format = editors_get_preferred_format();
        }

        // Ensure form is defaulted correctly.
        if (empty($data->format)) {
            $data->format = editors_get_preferred_format();
        }

        if (empty($data->component)) {
            $data->component = null;
        }

        $this->properties = $data;
    }

    /**
     * Magic set method.
     *
     * Attempts to call a set_$key method if one exists otherwise falls back
     * to simply set the property.
     *
     * @param string $key property name
     * @param mixed $value value of the property
     */
    public function __set($key, $value) {
        if (method_exists($this, 'set_'.$key)) {
            $this->{'set_'.$key}($value);
        }
        $this->properties->{$key} = $value;
    }

    /**
     * Magic get method.
     *
     * Attempts to call a get_$key method to return the property and ralls over
     * to return the raw property.
     *
     * @param string $key property name
     * @return mixed property value
     * @throws \coding_exception
     */
    public function __get($key) {
        if (method_exists($this, 'get_'.$key)) {
            return $this->{'get_'.$key}();
        }
        if (!property_exists($this->properties, $key)) {
            throw new \coding_exception('Undefined property requested');
        }
        return $this->properties->{$key};
    }

    /**
     * Magic isset method.
     *
     * PHP needs an isset magic method if you use the get magic method and
     * still want empty calls to work.
     *
     * @param string $key $key property name
     * @return bool|mixed property value, false if property is not exist
     */
    public function __isset($key) {
        return !empty($this->properties->{$key});
    }

    /**
     * Calculate the context value needed for an event.
     *
     * Event's type can be determine by the available value store in $data
     * It is important to check for the existence of course/courseid to determine
     * the course event.
     * Default value is set to CONTEXT_USER
     *
     * @return \stdClass The context object.
     */
    protected function calculate_context() {
        global $USER, $DB;

        $context = null;
        if (isset($this->properties->categoryid) && $this->properties->categoryid > 0) {
            $context = \context_coursecat::instance($this->properties->categoryid);
        } else if (isset($this->properties->courseid) && $this->properties->courseid > 0) {
            $context = \context_course::instance($this->properties->courseid);
        } else if (isset($this->properties->course) && $this->properties->course > 0) {
            $context = \context_course::instance($this->properties->course);
        } else if (isset($this->properties->groupid) && $this->properties->groupid > 0) {
            $group = $DB->get_record('groups', array('id' => $this->properties->groupid));
            $context = \context_course::instance($group->courseid);
        } else if (isset($this->properties->userid) && $this->properties->userid > 0
            && $this->properties->userid == $USER->id) {
            $context = \context_user::instance($this->properties->userid);
        } else if (isset($this->properties->userid) && $this->properties->userid > 0
            && $this->properties->userid != $USER->id &&
            !empty($this->properties->modulename) &&
            isset($this->properties->instance) && $this->properties->instance > 0) {
            $cm = get_coursemodule_from_instance($this->properties->modulename, $this->properties->instance, 0,
                false, MUST_EXIST);
            $context = \context_course::instance($cm->course);
        } else {
            $context = \context_user::instance($this->properties->userid);
        }

        return $context;
    }

    /**
     * Returns the context for this event. The context is calculated
     * the first time is is requested and then stored in a member
     * variable to be returned each subsequent time.
     *
     * This is a magical getter function that will be called when
     * ever the context property is accessed, e.g. $event->context.
     *
     * @return context
     */
    protected function get_context() {
        if (!isset($this->properties->context)) {
            $this->properties->context = $this->calculate_context();
        }

        return $this->properties->context;
    }

    /**
     * Returns an array of editoroptions for this event.
     *
     * @return array event editor options
     */
    protected function get_editoroptions() {
        return $this->editoroptions;
    }

    /**
     * Returns an event description: Called by __get
     * Please use $blah = $event->description;
     *
     * @return string event description
     */
    protected function get_description() {
        global $CFG;

        require_once($CFG->libdir . '/filelib.php');

        if ($this->_description === null) {
            // Check if we have already resolved the context for this event.
            if ($this->editorcontext === null) {
                // Switch on the event type to decide upon the appropriate context to use for this event.
                $this->editorcontext = $this->get_context();
                if (!calendar_is_valid_eventtype($this->properties->eventtype)) {
                    return clean_text($this->properties->description, $this->properties->format);
                }
            }

            // Work out the item id for the editor, if this is a repeated event
            // then the files will be associated with the original.
            if (!empty($this->properties->repeatid) && $this->properties->repeatid > 0) {
                $itemid = $this->properties->repeatid;
            } else {
                $itemid = $this->properties->id;
            }

            // Convert file paths in the description so that things display correctly.
            $this->_description = file_rewrite_pluginfile_urls($this->properties->description, 'pluginfile.php',
                $this->editorcontext->id, 'calendar', 'event_description', $itemid);
            // Clean the text so no nasties get through.
            $this->_description = clean_text($this->_description, $this->properties->format);
        }

        // Finally return the description.
        return $this->_description;
    }

    /**
     * Return the number of repeat events there are in this events series.
     *
     * @return int number of event repeated
     */
    public function count_repeats() {
        global $DB;
        if (!empty($this->properties->repeatid)) {
            $this->properties->eventrepeats = $DB->count_records('event',
                array('repeatid' => $this->properties->repeatid));
            // We don't want to count ourselves.
            $this->properties->eventrepeats--;
        }
        return $this->properties->eventrepeats;
    }

    /**
     * Update or create an event within the database
     *
     * Pass in a object containing the event properties and this function will
     * insert it into the database and deal with any associated files
     *
     * Capability checking should be performed if the user is directly manipulating the event
     * and no other capability has been tested. However if the event is not being manipulated
     * directly by the user and another capability has been checked for them to do this then
     * capabilites should not be checked.
     *
     * For example if a user is editing an event in the calendar the check should be true,
     * but if you are updating an event in an activities settings are changed then the calendar
     * capabilites should not be checked.
     *
     * @see self::create()
     * @see self::update()
     *
     * @param \stdClass $data object of event
     * @param bool $checkcapability If Moodle should check the user can manage the calendar events for this call or not.
     * @return bool event updated
     */
    public function update($data, $checkcapability=true) {
        global $DB, $USER;

        foreach ($data as $key => $value) {
            $this->properties->$key = $value;
        }

        $this->properties->timemodified = time();
        $usingeditor = (!empty($this->properties->description) && is_array($this->properties->description));

        // Prepare event data.
        $eventargs = array(
            'context' => $this->get_context(),
            'objectid' => $this->properties->id,
            'other' => array(
                'repeatid' => empty($this->properties->repeatid) ? 0 : $this->properties->repeatid,
                'timestart' => $this->properties->timestart,
                'name' => $this->properties->name
            )
        );

        if (empty($this->properties->id) || $this->properties->id < 1) {
            if ($checkcapability) {
                if (!calendar_add_event_allowed($this->properties)) {
                    throw new \moodle_exception('nopermissiontoupdatecalendar');
                }
            }

            if ($usingeditor) {
                switch ($this->properties->eventtype) {
                    case 'user':
                        $this->properties->courseid = 0;
                        $this->properties->course = 0;
                        $this->properties->groupid = 0;
                        $this->properties->userid = $USER->id;
                        break;
                    case 'site':
                        $this->properties->courseid = SITEID;
                        $this->properties->course = SITEID;
                        $this->properties->groupid = 0;
                        $this->properties->userid = $USER->id;
                        break;
                    case 'course':
                        $this->properties->groupid = 0;
                        $this->properties->userid = $USER->id;
                        break;
                    case 'category':
                        $this->properties->groupid = 0;
                        $this->properties->category = 0;
                        $this->properties->userid = $USER->id;
                        break;
                    case 'group':
                        $this->properties->userid = $USER->id;
                        break;
                    default:
                        // We should NEVER get here, but just incase we do lets fail gracefully.
                        $usingeditor = false;
                        break;
                }

                // If we are actually using the editor, we recalculate the context because some default values
                // were set when calculate_context() was called from the constructor.
                if ($usingeditor) {
                    $this->properties->context = $this->calculate_context();
                    $this->editorcontext = $this->get_context();
                }

                $editor = $this->properties->description;
                $this->properties->format = $this->properties->description['format'];
                $this->properties->description = $this->properties->description['text'];
            }

            // Insert the event into the database.
            $this->properties->id = $DB->insert_record('event', $this->properties);

            if ($usingeditor) {
                $this->properties->description = file_save_draft_area_files(
                    $editor['itemid'],
                    $this->editorcontext->id,
                    'calendar',
                    'event_description',
                    $this->properties->id,
                    $this->editoroptions,
                    $editor['text'],
                    $this->editoroptions['forcehttps']);
                $DB->set_field('event', 'description', $this->properties->description,
                    array('id' => $this->properties->id));
            }

            // Log the event entry.
            $eventargs['objectid'] = $this->properties->id;
            $eventargs['context'] = $this->get_context();
            $event = \core\event\calendar_event_created::create($eventargs);
            $event->trigger();

            $repeatedids = array();

            if (!empty($this->properties->repeat)) {
                $this->properties->repeatid = $this->properties->id;
                $DB->set_field('event', 'repeatid', $this->properties->repeatid, array('id' => $this->properties->id));

                $eventcopy = clone($this->properties);
                unset($eventcopy->id);

                $timestart = new \DateTime('@' . $eventcopy->timestart);
                $timestart->setTimezone(\core_date::get_user_timezone_object());

                for ($i = 1; $i < $eventcopy->repeats; $i++) {

                    $timestart->add(new \DateInterval('P7D'));
                    $eventcopy->timestart = $timestart->getTimestamp();

                    // Get the event id for the log record.
                    $eventcopyid = $DB->insert_record('event', $eventcopy);

                    // If the context has been set delete all associated files.
                    if ($usingeditor) {
                        $fs = get_file_storage();
                        $files = $fs->get_area_files($this->editorcontext->id, 'calendar', 'event_description',
                            $this->properties->id);
                        foreach ($files as $file) {
                            $fs->create_file_from_storedfile(array('itemid' => $eventcopyid), $file);
                        }
                    }

                    $repeatedids[] = $eventcopyid;

                    // Trigger an event.
                    $eventargs['objectid'] = $eventcopyid;
                    $eventargs['other']['timestart'] = $eventcopy->timestart;
                    $event = \core\event\calendar_event_created::create($eventargs);
                    $event->trigger();
                }
            }

            return true;
        } else {

            if ($checkcapability) {
                if (!calendar_edit_event_allowed($this->properties)) {
                    throw new \moodle_exception('nopermissiontoupdatecalendar');
                }
            }

            if ($usingeditor) {
                if ($this->editorcontext !== null) {
                    $this->properties->description = file_save_draft_area_files(
                        $this->properties->description['itemid'],
                        $this->editorcontext->id,
                        'calendar',
                        'event_description',
                        $this->properties->id,
                        $this->editoroptions,
                        $this->properties->description['text'],
                        $this->editoroptions['forcehttps']);
                } else {
                    $this->properties->format = $this->properties->description['format'];
                    $this->properties->description = $this->properties->description['text'];
                }
            }

            $event = $DB->get_record('event', array('id' => $this->properties->id));

            $updaterepeated = (!empty($this->properties->repeatid) && !empty($this->properties->repeateditall));

            if ($updaterepeated) {

                $sqlset = 'name = ?,
                           description = ?,
                           timeduration = ?,
                           timemodified = ?,
                           groupid = ?,
                           courseid = ?';

                // Note: Group and course id may not be set. If not, keep their current values.
                $params = [
                    $this->properties->name,
                    $this->properties->description,
                    $this->properties->timeduration,
                    time(),
                    isset($this->properties->groupid) ? $this->properties->groupid : $event->groupid,
                    isset($this->properties->courseid) ? $this->properties->courseid : $event->courseid,
                ];

                // Note: Only update start date, if it was changed by the user.
                if ($this->properties->timestart != $event->timestart) {
                    $timestartoffset = $this->properties->timestart - $event->timestart;
                    $sqlset .= ', timestart = timestart + ?';
                    $params[] = $timestartoffset;
                }

                // Note: Only update location, if it was changed by the user.
                $updatelocation = (!empty($this->properties->location) && $this->properties->location !== $event->location);
                if ($updatelocation) {
                    $sqlset .= ', location = ?';
                    $params[] = $this->properties->location;
                }

                // Update all.
                $sql = "UPDATE {event}
                           SET $sqlset
                         WHERE repeatid = ?";

                $params[] = $event->repeatid;
                $DB->execute($sql, $params);

                // Trigger an update event for each of the calendar event.
                $events = $DB->get_records('event', array('repeatid' => $event->repeatid), '', '*');
                foreach ($events as $calendarevent) {
                    $eventargs['objectid'] = $calendarevent->id;
                    $eventargs['other']['timestart'] = $calendarevent->timestart;
                    $event = \core\event\calendar_event_updated::create($eventargs);
                    $event->add_record_snapshot('event', $calendarevent);
                    $event->trigger();
                }
            } else {
                $DB->update_record('event', $this->properties);
                $event = self::load($this->properties->id);
                $this->properties = $event->properties();

                // Trigger an update event.
                $event = \core\event\calendar_event_updated::create($eventargs);
                $event->add_record_snapshot('event', $this->properties);
                $event->trigger();
            }

            return true;
        }
    }

    /**
     * Deletes an event and if selected an repeated events in the same series
     *
     * This function deletes an event, any associated events if $deleterepeated=true,
     * and cleans up any files associated with the events.
     *
     * @see self::delete()
     *
     * @param bool $deleterepeated  delete event repeatedly
     * @return bool succession of deleting event
     */
    public function delete($deleterepeated = false) {
        global $DB;

        // If $this->properties->id is not set then something is wrong.
        if (empty($this->properties->id)) {
            debugging('Attempting to delete an event before it has been loaded', DEBUG_DEVELOPER);
            return false;
        }
        $calevent = $DB->get_record('event',  array('id' => $this->properties->id), '*', MUST_EXIST);
        // Delete the event.
        $DB->delete_records('event', array('id' => $this->properties->id));

        // Trigger an event for the delete action.
        $eventargs = array(
            'context' => $this->get_context(),
            'objectid' => $this->properties->id,
            'other' => array(
                'repeatid' => empty($this->properties->repeatid) ? 0 : $this->properties->repeatid,
                'timestart' => $this->properties->timestart,
                'name' => $this->properties->name
            ));
        $event = \core\event\calendar_event_deleted::create($eventargs);
        $event->add_record_snapshot('event', $calevent);
        $event->trigger();

        // If we are deleting parent of a repeated event series, promote the next event in the series as parent.
        if (($this->properties->id == $this->properties->repeatid) && !$deleterepeated) {
            $newparent = $DB->get_field_sql("SELECT id from {event} where repeatid = ? order by id ASC",
                array($this->properties->id), IGNORE_MULTIPLE);
            if (!empty($newparent)) {
                $DB->execute("UPDATE {event} SET repeatid = ? WHERE repeatid = ?",
                    array($newparent, $this->properties->id));
                // Get all records where the repeatid is the same as the event being removed.
                $events = $DB->get_records('event', array('repeatid' => $newparent));
                // For each of the returned events trigger an update event.
                foreach ($events as $calendarevent) {
                    // Trigger an event for the update.
                    $eventargs['objectid'] = $calendarevent->id;
                    $eventargs['other']['timestart'] = $calendarevent->timestart;
                    $event = \core\event\calendar_event_updated::create($eventargs);
                    $event->add_record_snapshot('event', $calendarevent);
                    $event->trigger();
                }
            }
        }

        // If the editor context hasn't already been set then set it now.
        if ($this->editorcontext === null) {
            $this->editorcontext = $this->get_context();
        }

        // If the context has been set delete all associated files.
        if ($this->editorcontext !== null) {
            $fs = get_file_storage();
            $files = $fs->get_area_files($this->editorcontext->id, 'calendar', 'event_description', $this->properties->id);
            foreach ($files as $file) {
                $file->delete();
            }
        }

        // If we need to delete repeated events then we will fetch them all and delete one by one.
        if ($deleterepeated && !empty($this->properties->repeatid) && $this->properties->repeatid > 0) {
            // Get all records where the repeatid is the same as the event being removed.
            $events = $DB->get_records('event', array('repeatid' => $this->properties->repeatid));
            // For each of the returned events populate an event object and call delete.
            // make sure the arg passed is false as we are already deleting all repeats.
            foreach ($events as $event) {
                $event = new calendar_event($event);
                $event->delete(false);
            }
        }

        return true;
    }

    /**
     * Fetch all event properties.
     *
     * This function returns all of the events properties as an object and optionally
     * can prepare an editor for the description field at the same time. This is
     * designed to work when the properties are going to be used to set the default
     * values of a moodle forms form.
     *
     * @param bool $prepareeditor If set to true a editor is prepared for use with
     *              the mforms editor element. (for description)
     * @return \stdClass Object containing event properties
     */
    public function properties($prepareeditor = false) {
        global $DB;

        // First take a copy of the properties. We don't want to actually change the
        // properties or we'd forever be converting back and forwards between an
        // editor formatted description and not.
        $properties = clone($this->properties);
        // Clean the description here.
        $properties->description = clean_text($properties->description, $properties->format);

        // If set to true we need to prepare the properties for use with an editor
        // and prepare the file area.
        if ($prepareeditor) {

            // We may or may not have a property id. If we do then we need to work
            // out the context so we can copy the existing files to the draft area.
            if (!empty($properties->id)) {

                if ($properties->eventtype === 'site') {
                    // Site context.
                    $this->editorcontext = $this->get_context();
                } else if ($properties->eventtype === 'user') {
                    // User context.
                    $this->editorcontext = $this->get_context();
                } else if ($properties->eventtype === 'group' || $properties->eventtype === 'course') {
                    // First check the course is valid.
                    $course = $DB->get_record('course', array('id' => $properties->courseid));
                    if (!$course) {
                        throw new \moodle_exception('invalidcourse');
                    }
                    // Course context.
                    $this->editorcontext = $this->get_context();
                    // We have a course and are within the course context so we had
                    // better use the courses max bytes value.
                    $this->editoroptions['maxbytes'] = $course->maxbytes;
                } else if ($properties->eventtype === 'category') {
                    // First check the course is valid.
                    \core_course_category::get($properties->categoryid, MUST_EXIST, true);
                    // Course context.
                    $this->editorcontext = $this->get_context();
                } else {
                    // If we get here we have a custom event type as used by some
                    // modules. In this case the event will have been added by
                    // code and we won't need the editor.
                    $this->editoroptions['maxbytes'] = 0;
                    $this->editoroptions['maxfiles'] = 0;
                }

                if (empty($this->editorcontext) || empty($this->editorcontext->id)) {
                    $contextid = false;
                } else {
                    // Get the context id that is what we really want.
                    $contextid = $this->editorcontext->id;
                }
            } else {

                // If we get here then this is a new event in which case we don't need a
                // context as there is no existing files to copy to the draft area.
                $contextid = null;
            }

            // If the contextid === false we don't support files so no preparing
            // a draft area.
            if ($contextid !== false) {
                // Just encase it has already been submitted.
                $draftiddescription = file_get_submitted_draft_itemid('description');
                // Prepare the draft area, this copies existing files to the draft area as well.
                $properties->description = file_prepare_draft_area($draftiddescription, $contextid, 'calendar',
                    'event_description', $properties->id, $this->editoroptions, $properties->description);
            } else {
                $draftiddescription = 0;
            }

            // Structure the description field as the editor requires.
            $properties->description = array('text' => $properties->description, 'format' => $properties->format,
                'itemid' => $draftiddescription);
        }

        // Finally return the properties.
        return $properties;
    }

    /**
     * Toggles the visibility of an event
     *
     * @param null|bool $force If it is left null the events visibility is flipped,
     *                   If it is false the event is made hidden, if it is true it
     *                   is made visible.
     * @return bool if event is successfully updated, toggle will be visible
     */
    public function toggle_visibility($force = null) {
        global $DB;

        // Set visible to the default if it is not already set.
        if (empty($this->properties->visible)) {
            $this->properties->visible = 1;
        }

        if ($force === true || ($force !== false && $this->properties->visible == 0)) {
            // Make this event visible.
            $this->properties->visible = 1;
        } else {
            // Make this event hidden.
            $this->properties->visible = 0;
        }

        // Update the database to reflect this change.
        $success = $DB->set_field('event', 'visible', $this->properties->visible, array('id' => $this->properties->id));
        $calendarevent = $DB->get_record('event',  array('id' => $this->properties->id), '*', MUST_EXIST);

        // Prepare event data.
        $eventargs = array(
            'context' => $this->get_context(),
            'objectid' => $this->properties->id,
            'other' => array(
                'repeatid' => empty($this->properties->repeatid) ? 0 : $this->properties->repeatid,
                'timestart' => $this->properties->timestart,
                'name' => $this->properties->name
            )
        );
        $event = \core\event\calendar_event_updated::create($eventargs);
        $event->add_record_snapshot('event', $calendarevent);
        $event->trigger();

        return $success;
    }

    /**
     * Returns an event object when provided with an event id.
     *
     * This function makes use of MUST_EXIST, if the event id passed in is invalid
     * it will result in an exception being thrown.
     *
     * @param int|object $param event object or event id
     * @return calendar_event
     */
    public static function load($param) {
        global $DB;
        if (is_object($param)) {
            $event = new calendar_event($param);
        } else {
            $event = $DB->get_record('event', array('id' => (int)$param), '*', MUST_EXIST);
            $event = new calendar_event($event);
        }
        return $event;
    }

    /**
     * Creates a new event and returns an event object.
     *
     * Capability checking should be performed if the user is directly creating the event
     * and no other capability has been tested. However if the event is not being created
     * directly by the user and another capability has been checked for them to do this then
     * capabilites should not be checked.
     *
     * For example if a user is creating an event in the calendar the check should be true,
     * but if you are creating an event in an activity when it is created then the calendar
     * capabilites should not be checked.
     *
     * @param \stdClass|array $properties An object containing event properties
     * @param bool $checkcapability If Moodle should check the user can manage the calendar events for this call or not.
     * @throws \coding_exception
     *
     * @return calendar_event|bool The event object or false if it failed
     */
    public static function create($properties, $checkcapability = true) {
        if (is_array($properties)) {
            $properties = (object)$properties;
        }
        if (!is_object($properties)) {
            throw new \coding_exception('When creating an event properties should be either an object or an assoc array');
        }
        $event = new calendar_event($properties);
        if ($event->update($properties, $checkcapability)) {
            return $event;
        } else {
            return false;
        }
    }

    /**
     * Format the event name using the external API.
     *
     * This function should we used when text formatting is required in external functions.
     *
     * @return string Formatted name.
     */
    public function format_external_name() {
        if ($this->editorcontext === null) {
            // Switch on the event type to decide upon the appropriate context to use for this event.
            $this->editorcontext = $this->get_context();
        }

        return \core_external\util::format_string($this->properties->name, $this->editorcontext->id);
    }

    /**
     * Format the text using the external API.
     *
     * This function should we used when text formatting is required in external functions.
     *
     * @return array an array containing the text formatted and the text format
     */
    public function format_external_text() {

        if ($this->editorcontext === null) {
            // Switch on the event type to decide upon the appropriate context to use for this event.
            $this->editorcontext = $this->get_context();

            if (!calendar_is_valid_eventtype($this->properties->eventtype)) {
                // We don't have a context here, do a normal format_text.
                return \core_external\util::format_text(
                    $this->properties->description,
                    $this->properties->format,
                    $this->editorcontext
                );
            }
        }

        // Work out the item id for the editor, if this is a repeated event then the files will be associated with the original.
        if (!empty($this->properties->repeatid) && $this->properties->repeatid > 0) {
            $itemid = $this->properties->repeatid;
        } else {
            $itemid = $this->properties->id;
        }

        return \core_external\util::format_text(
            $this->properties->description,
            $this->properties->format,
            $this->editorcontext,
            'calendar',
            'event_description',
            $itemid
        );
    }
}
