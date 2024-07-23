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
 * Calendar information class
 *
 * This class is used simply to organise the information pertaining to a calendar
 * and is used primarily to make information easily available.
 *
 * @package core_calendar
 * @category calendar
 * @copyright 2010 Sam Hemelryk
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class calendar_information {

    /**
     * @var int The timestamp
     *
     * Rather than setting the day, month and year we will set a timestamp which will be able
     * to be used by multiple calendars.
     */
    public $time;

    /** @var int A course id */
    public $courseid = null;

    /** @var array An array of categories */
    public $categories = array();

    /** @var int The current category */
    public $categoryid = null;

    /** @var array An array of courses */
    public $courses = array();

    /** @var array An array of groups */
    public $groups = array();

    /** @var array An array of users */
    public $users = array();

    /** @var context The anticipated context that the calendar is viewed in */
    public $context = null;

    /** @var string The calendar's view mode. */
    protected $viewmode;

    /** @var \stdClass course data. */
    public $course;

    /** @var int day. */
    protected $day;

    /** @var int month. */
    protected $month;

    /** @var int year. */
    protected $year;

    /**
     * Creates a new instance
     *
     * @param int $day the number of the day
     * @param int $month the number of the month
     * @param int $year the number of the year
     * @param int $time the unixtimestamp representing the date we want to view, this is used instead of $calmonth
     *     and $calyear to support multiple calendars
     */
    public function __construct($day = 0, $month = 0, $year = 0, $time = 0) {
        // If a day, month and year were passed then convert it to a timestamp. If these were passed
        // then we can assume the day, month and year are passed as Gregorian, as no where in core
        // should we be passing these values rather than the time. This is done for BC.
        if (!empty($day) || !empty($month) || !empty($year)) {
            $date = usergetdate(time());
            if (empty($day)) {
                $day = $date['mday'];
            }
            if (empty($month)) {
                $month = $date['mon'];
            }
            if (empty($year)) {
                $year =  $date['year'];
            }
            if (checkdate($month, $day, $year)) {
                $time = make_timestamp($year, $month, $day);
            } else {
                $time = time();
            }
        }

        $this->set_time($time);
    }

    /**
     * Creates and set up a instance.
     *
     * @param   int                     $time the unixtimestamp representing the date we want to view.
     * @param   int                     $courseid The ID of the course the user wishes to view.
     * @param   int                     $categoryid The ID of the category the user wishes to view
     *                                  If a courseid is specified, this value is ignored.
     * @return  calendar_information
     */
    public static function create($time, int $courseid, int $categoryid = null): calendar_information {
        $calendar = new static(0, 0, 0, $time);
        if ($courseid != SITEID && !empty($courseid)) {
            // Course ID must be valid and existing.
            $course = get_course($courseid);
            $calendar->context = context_course::instance($course->id);

            if (!$course->visible && !is_role_switched($course->id)) {
                require_capability('moodle/course:viewhiddencourses', $calendar->context);
            }

            $courses = [$course->id => $course];
            $category = (\core_course_category::get($course->category, MUST_EXIST, true))->get_db_record();
        } else if (!empty($categoryid)) {
            $course = get_site();
            $courses = calendar_get_default_courses(null, 'id, category, groupmode, groupmodeforce');

            // Filter available courses to those within this category or it's children.
            $ids = [$categoryid];
            $category = \core_course_category::get($categoryid);
            $ids = array_merge($ids, array_keys($category->get_children()));
            $courses = array_filter($courses, function($course) use ($ids) {
                return array_search($course->category, $ids) !== false;
            });
            $category = $category->get_db_record();

            $calendar->context = context_coursecat::instance($categoryid);
        } else {
            $course = get_site();
            $courses = calendar_get_default_courses(null, 'id, category, groupmode, groupmodeforce');
            $category = null;

            $calendar->context = context_system::instance();
        }

        $calendar->set_sources($course, $courses, $category);

        return $calendar;
    }

    /**
     * Set the time period of this instance.
     *
     * @param   int $time the unixtimestamp representing the date we want to view.
     * @return  $this
     */
    public function set_time($time = null) {
        if (empty($time)) {
            $this->time = time();
        } else {
            $this->time = $time;
        }

        return $this;
    }

    /**
     * Initialize calendar information
     *
     * @deprecated 3.4
     * @param stdClass $course object
     * @param array $coursestoload An array of courses [$course->id => $course]
     * @param bool $ignorefilters options to use filter
     */
    public function prepare_for_view(stdClass $course, array $coursestoload, $ignorefilters = false) {
        debugging('The prepare_for_view() function has been deprecated. Please update your code to use set_sources()',
                DEBUG_DEVELOPER);
        $this->set_sources($course, $coursestoload);
    }

    /**
     * Set the sources for events within the calendar.
     *
     * If no category is provided, then the category path for the current
     * course will be used.
     *
     * @param   stdClass    $course The current course being viewed.
     * @param   stdClass[]  $courses The list of all courses currently accessible.
     * @param   stdClass    $category The current category to show.
     */
    public function set_sources(stdClass $course, array $courses, stdClass $category = null) {
        global $USER;

        // A cousre must always be specified.
        $this->course = $course;
        $this->courseid = $course->id;

        list($courseids, $group, $user) = calendar_set_filters($courses);
        $this->courses = $courseids;
        $this->groups = $group;
        $this->users = $user;

        // Do not show category events by default.
        $this->categoryid = null;
        $this->categories = null;

        // Determine the correct category information to show.
        // When called with a course, the category of that course is usually included too.
        // When a category was specifically requested, it should be requested with the site id.
        if (SITEID !== $this->courseid) {
            // A specific course was requested.
            // Fetch the category that this course is in, along with all parents.
            // Do not include child categories of this category, as the user many not have enrolments in those siblings or children.
            $category = \core_course_category::get($course->category, MUST_EXIST, true);
            $this->categoryid = $category->id;

            $this->categories = $category->get_parents();
            $this->categories[] = $category->id;
        } else if (null !== $category && $category->id > 0) {
            // A specific category was requested.
            // Fetch all parents of this category, along with all children too.
            $category = \core_course_category::get($category->id);
            $this->categoryid = $category->id;

            // Build the category list.
            // This includes the current category.
            $this->categories = $category->get_parents();
            $this->categories[] = $category->id;
            $this->categories = array_merge($this->categories, $category->get_all_children_ids());
        } else if (SITEID === $this->courseid) {
            // The site was requested.
            // Fetch all categories where this user has any enrolment, and all categories that this user can manage.

            // Grab the list of categories that this user has courses in.
            $coursecategories = array_flip(array_map(function($course) {
                return $course->category;
            }, $courses));

            $calcatcache = cache::make('core', 'calendar_categories');
            $this->categories = $calcatcache->get('site');
            if ($this->categories === false) {
                // Use the category id as the key in the following array. That way we do not have to remove duplicates.
                $categories = [];
                foreach (\core_course_category::get_all() as $category) {
                    if (isset($coursecategories[$category->id]) ||
                            has_capability('moodle/category:manage', $category->get_context(), $USER, false)) {
                        // If the user has access to a course in this category or can manage the category,
                        // then they can see all parent categories too.
                        $categories[$category->id] = true;
                        foreach ($category->get_parents() as $catid) {
                            $categories[$catid] = true;
                        }
                    }
                }
                $this->categories = array_keys($categories);
                $calcatcache->set('site', $this->categories);
            }
        }
    }

    /**
     * Ensures the date for the calendar is correct and either sets it to now
     * or throws a moodle_exception if not
     *
     * @param bool $defaultonow use current time
     * @throws moodle_exception
     * @return bool validation of checkdate
     */
    public function checkdate($defaultonow = true) {
        if (!checkdate($this->month, $this->day, $this->year)) {
            if ($defaultonow) {
                $now = usergetdate(time());
                $this->day = intval($now['mday']);
                $this->month = intval($now['mon']);
                $this->year = intval($now['year']);
                return true;
            } else {
                throw new moodle_exception('invaliddate');
            }
        }
        return true;
    }

    /**
     * Gets todays timestamp for the calendar
     *
     * @return int today timestamp
     */
    public function timestamp_today() {
        return $this->time;
    }
    /**
     * Gets tomorrows timestamp for the calendar
     *
     * @return int tomorrow timestamp
     */
    public function timestamp_tomorrow() {
        return strtotime('+1 day', $this->time);
    }
    /**
     * Adds the pretend blocks for the calendar
     *
     * @param core_calendar_renderer $renderer
     * @param bool $showfilters display filters, false is set as default
     * @param string|null $view preference view options (eg: day, month, upcoming)
     */
    public function add_sidecalendar_blocks(core_calendar_renderer $renderer, $showfilters=false, $view=null) {
        global $PAGE;

        if (!has_capability('moodle/block:view', $PAGE->context) ) {
            return;
        }

        if ($showfilters) {
            $filters = new block_contents();
            $filters->content = $renderer->event_filter();
            $filters->footer = '';
            $filters->title = get_string('eventskey', 'calendar');
            $renderer->add_pretend_calendar_block($filters, BLOCK_POS_RIGHT);
        }
    }

    /**
     * Getter method for the calendar's view mode.
     *
     * @return string
     */
    public function get_viewmode(): string {
        return $this->viewmode;
    }

    /**
     * Setter method for the calendar's view mode.
     *
     * @param string $viewmode
     */
    public function set_viewmode(string $viewmode): void {
        $this->viewmode = $viewmode;
    }
}
