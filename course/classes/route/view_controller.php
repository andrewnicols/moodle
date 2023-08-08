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

namespace core_course\route;

use core\router\path_parameter;
use core\router\query_parameter;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use core\router\route;
use html_writer;
use moodle_database;

class view_controller {
    use \core\router\route_controller;

    #[route(
        path: '/view/byidnumber/{idnumber:[0-9]+}',
        pathtypes: [
            new path_parameter(
                name: 'idnumber',
                type: PARAM_RAW,
            ),
        ],
    )]
    public function view_by_idnumber(
        ServerRequestInterface $request,
        ResponseInterface $response,
        string $idnumber,
        moodle_database $db,
    ): response {
        $id = $db->get_field('course', 'id', ['idnumber' => $idnumber], MUST_EXIST);
        \core\router::redirect_with_params(
            "/course/view/{$id}",
            ['idnumber'],
        );
    }

    #[route(
        path: '/view/byshortname/{shortname}',
        pathtypes: [
            new path_parameter(
                name: 'shortname',
                type: PARAM_TEXT,
            ),
        ],
    )]
    public function view_by_shortname(
        ServerRequestInterface $request,
        ResponseInterface $response,
        string $shortname,
        moodle_database $db,
    ): response {
        $id = $db->get_field('course', 'id', ['shortname' => $shortname], MUST_EXIST);
        \core\router::redirect_with_params(
            "/course/view/{$id}",
            ['idnumber'],
        );
    }

    #[route(
        path: '/view/{id:[0-9]+}',
        pathtypes: [
            new \core\router\path_parameter(
                name: 'id',
                type: PARAM_INT,
            ),
        ],
        queryparams: [
            new query_parameter(
                name: 'sectionid',
                type: PARAM_INT,
                description: 'The database ID of the section to highlight',
            ),
            new query_parameter(
                name: 'section',
                type: PARAM_INT,
                description: 'The zero-indexed section number of the section to highlight',
            ),
            new query_parameter(
                name: 'expandsection',
                type: PARAM_INT,
            ),
            new query_parameter(
                name: 'edit',
                type: PARAM_INT,
                default: -1,
            ),
            new query_parameter(
                name: 'hide',
                type: PARAM_INT,
                default: null,
            ),
            new query_parameter(
                name: 'show',
                type: PARAM_INT,
                default: null,
            ),
            new query_parameter(
                name: 'switchrole',
                type: PARAM_INT,
            ),
            new query_parameter(
                name: 'duplicatesection',
                type: PARAM_INT,
            ),
            new query_parameter(
                name: 'return',
                type: PARAM_LOCALURL,
            ),
            new query_parameter(
                name: 'move',
                type: PARAM_INT,
            ),
            new query_parameter(
                name: 'marker',
                type: PARAM_INT,
                default: -1,
            ),
        ]

    )]
    public function view_course(
        ServerRequestInterface $request,
        ResponseInterface $response,
        int $id,
        \moodle_page $PAGE,
        \moodle_database $db,
        \core\config $CFG,
        \core\container $container,
    ): ResponseInterface {
        global $USER, $OUTPUT, $SESSION;

        $edit = $this->get_param($request, 'edit');
        $hide = $this->get_param($request, 'hide');
        $show = $this->get_param($request, 'show');
        $duplicatesection = $this->get_param($request, 'duplicatesection');
        $sectionid = $this->get_param($request, 'sectionid');
        $section = $this->get_param($request, 'section');
        $expandsection = $this->get_param($request, 'expandsection');
        $move = $this->get_param($request, 'move');
        // Note: This is required by the course format.
        // This is _nasty_. We should not be using globals.
        $marker = $this->get_param($request, 'marker');
        $switchrole = $this->get_param($request, 'switchrole');
        $return = $this->get_param($request, 'return');

        $course = $db->get_record('course', ['id' => $id]);

        // Preload the course context, and all child contexts.
        \core\context_helper::preload_course($course->id);
        $context = \core\context\course::instance($course->id, MUST_EXIST);

        $urlparams = ['id' => $course->id];

        // Sectionid should get priority over section number.
        $section = null;
        if ($sectionid) {
            $section = $db->get_field('course_sections', 'section', ['id' => $sectionid, 'course' => $course->id], MUST_EXIST);
        }
        if ($section) {
            $urlparams['section'] = $section;
        }

        if ($expandsection = $this->get_param($request, 'expandsection', null)) {
            $urlparams['expandsection'] = $expandsection;
        }

        $PAGE->set_url("/course/view/{$id}", $urlparams); // Defined here to avoid notices on errors etc.

        // Prevent caching of this page to stop confusion when changing page after making AJAX changes.
        $PAGE->set_cacheable(false);

        \core\context_helper::preload_course($course->id);
        $context = \core\context\course::instance($course->id, MUST_EXIST);

        // Remove any switched roles before checking login.
        if ($switchrole = $this->get_param($request, 'switchrole', null)) {
            if ($switchrole == 0 && confirm_sesskey()) {
                role_switch($switchrole, $context);
            }
        }

        require_login($course);

        // Switchrole - sanity check in cost-order...
        $resetuserallowedediting = false;
        if (
            $switchrole > 0 && confirm_sesskey() &&
            has_capability('moodle/role:switchroles', $context)
        ) {
            // Is this role assignable in this context?
            // Inquiring minds want to know.
            $aroles = get_switchable_roles($context);
            if (is_array($aroles) && isset($aroles[$switchrole])) {
                role_switch($switchrole, $context);
                // Double check that this role is allowed here.
                require_login($course);
            }
            // Reset course page state. This prevents some weird problems.
            $USER->activitycopy = false;
            $USER->activitycopycourse = null;
            unset($USER->activitycopyname);
            unset($SESSION->modform);
            $USER->editing = 0;
            $resetuserallowedediting = true;
        }

        // If course is hosted on an external server, redirect to corresponding
        // url with appropriate authentication attached as parameter.
        if (file_exists($CFG->dirroot . '/course/externservercourse.php')) {
            include($CFG->dirroot . '/course/externservercourse.php');
            if (function_exists('extern_server_course')) {
                if ($externurl = extern_server_course($course)) {
                    redirect($externurl);
                }
            }
        }

        require_once($CFG->dirroot . '/calendar/lib.php'); // This is after login because it needs $USER.

        // Must set layout before gettting section info. See MDL-47555.
        $PAGE->set_pagelayout('course');
        $PAGE->add_body_class('limitedwidth');

        if ($section && $section > 0) {

            // Get section details and check it exists.
            $modinfo = get_fast_modinfo($course);
            $coursesections = $modinfo->get_section_info($section, MUST_EXIST);

            // Check user is allowed to see it.
            if (!$coursesections->uservisible) {
                // Check if coursesection has conditions affecting availability and if
                // so, output availability info.
                if ($coursesections->visible && $coursesections->availableinfo) {
                    $sectionname = get_section_name($course, $coursesections);
                    $message = get_string('notavailablecourse', '', $sectionname);
                    redirect(course_get_url($course), $message, null, \core\output\notification::NOTIFY_ERROR);
                } else {
                    // Note: We actually already know they don't have this capability
                    // or uservisible would have been true; this is just to get the
                    // correct error message shown.
                    require_capability('moodle/course:viewhiddensections', $context);
                }
            }
        }

        // Fix course format if it is no longer installed.
        $format = course_get_format($course);
        $course->format = $format->get_format();

        $PAGE->set_pagetype('course-view-' . $course->format);
        $PAGE->set_other_editing_capability('moodle/course:update');
        $PAGE->set_other_editing_capability('moodle/course:manageactivities');
        $PAGE->set_other_editing_capability('moodle/course:activityvisibility');
        if (course_format_uses_sections($course->format)) {
            $PAGE->set_other_editing_capability('moodle/course:sectionvisibility');
            $PAGE->set_other_editing_capability('moodle/course:movesections');
        }

        // Preload course format renderer before output starts.
        // This is a little hacky but necessary since
        // format.php is not included until after output starts.
        $renderer = $format->get_renderer($PAGE);

        $response->getBody()->write($renderer->header());

        if ($resetuserallowedediting) {
            // Ugly hack.
            unset($PAGE->_user_allowed_editing);
        }

        if (!isset($USER->editing)) {
            $USER->editing = 0;
        }
        $edit = $this->get_param($request, 'edit', -1);
        if ($PAGE->user_allowed_editing()) {
            if (($edit == 1) && confirm_sesskey()) {
                $USER->editing = 1;
                // Redirect to site root if Editing is toggled on frontpage.
                if ($course->id == SITEID) {
                    redirect($CFG->wwwroot . '/?redirect=0');
                } else if (!empty($return)) {
                    redirect($CFG->wwwroot . $return);
                } else {
                    $url = new moodle_url($PAGE->url, ['notifyeditingon' => 1]);
                    redirect($url);
                }
            } else if (($edit == 0) && confirm_sesskey()) {
                $USER->editing = 0;
                if (!empty($USER->activitycopy) && $USER->activitycopycourse == $course->id) {
                    $USER->activitycopy = false;
                    $USER->activitycopycourse = null;
                }
                // Redirect to site root if Editing is toggled on frontpage.
                if ($course->id == SITEID) {
                    redirect($CFG->wwwroot . '/?redirect=0');
                } else if (!empty($return)) {
                    redirect($CFG->wwwroot . $return);
                } else {
                    redirect($PAGE->url);
                }
            }

            if (has_capability('moodle/course:sectionvisibility', $context)) {
                $hide = $this->get_param($request, 'hide');
                $show = $this->get_param($request, 'show');
                if ($hide && confirm_sesskey()) {
                    set_section_visible($course->id, $hide, '0');
                    redirect($PAGE->url);
                }

                if ($show && confirm_sesskey()) {
                    set_section_visible($course->id, $show, '1');
                    redirect($PAGE->url);
                }
            }

            if (
                !empty($section) && !empty($coursesections) && !empty($duplicatesection)
                && has_capability('moodle/course:update', $context) && confirm_sesskey()
            ) {
                $newsection = $format->duplicate_section($coursesections);
                redirect(course_get_url($course, $newsection->section));
            }

            if (
                !empty($section) && !empty($move) &&
                has_capability('moodle/course:movesections', $context) && confirm_sesskey()
            ) {
                $destsection = $section + $move;
                if (move_section_to($course, $section, $destsection)) {
                    if ($course->id == SITEID) {
                        redirect($CFG->wwwroot . '/?redirect=0');
                    } else {
                        if ($format->get_course_display() == COURSE_DISPLAY_MULTIPAGE) {
                            redirect(course_get_url($course));
                        } else {
                            redirect(course_get_url($course, $destsection));
                        }
                    }
                } else {
                    $response->getBody()->write(
                        $OUTPUT->notification('An error occurred while moving a section'),
                    );
                }
            }
        } else {
            $USER->editing = 0;
        }

        $SESSION->fromdiscussion = $PAGE->url->out(false);
        // \Fiber::suspend($response);

        if ($course->id == SITEID) {
            // This course is not a real course.
            redirect($CFG->wwwroot . '/?redirect=0');
        }

        // Determine whether the user has permission to download course content.
        $candownloadcourse = \core\content::can_export_context($context, $USER);

        // We are currently keeping the button here from 1.x to help new teachers figure out
        // what to do, even though the link also appears in the course admin block.  It also
        // means you can back out of a situation where you removed the admin block.
        if ($PAGE->user_allowed_editing()) {
            $buttons = $OUTPUT->edit_button($PAGE->url);
            $PAGE->set_button($buttons);
        }

        // If viewing a section, make the title more specific.
        if ($section && $section > 0 && course_format_uses_sections($course->format)) {
            $sectionname = get_string('sectionname', "format_$course->format");
            $sectiontitle = get_section_name($course, $section);
            $PAGE->set_title(
                get_string(
                    'coursesectiontitle',
                    'moodle',
                    ['course' => $course->fullname, 'sectiontitle' => $sectiontitle, 'sectionname' => $sectionname]
                )
            );
        } else {
            $PAGE->set_title(get_string('coursetitle', 'moodle', ['course' => $course->fullname]));
        }

        // Add bulk editing control.
        $bulkbutton = $renderer->bulk_editing_button($format);
        if (!empty($bulkbutton)) {
            $PAGE->add_header_action($bulkbutton);
        }

        $PAGE->set_heading($course->fullname);

        // Show communication room status notification.
        if (\core_communication\api::is_available() && has_capability('moodle/course:update', $context)) {
            $communication = \core_communication\api::load_by_instance(
                'core_course',
                'coursecommunication',
                $course->id
            );
            $communication->show_communication_room_status_notification();
        }

        if ($USER->editing == 1) {
            // MDL-65321 The backup libraries are quite heavy, only require the bare minimum.
            require_once($CFG->dirroot . '/backup/util/helper/async_helper.class.php');

            if (\async_helper::is_async_pending($id, 'course', 'backup')) {
                $response->getBody()->write(
                    $OUTPUT->notification(get_string('pendingasyncedit', 'backup'), 'warning'),
                );
            }
        }

        // Course wrapper start.
        $response->getBody()->write(
            html_writer::start_tag('div', ['class' => 'course-content']),
        );

        // Make sure that section 0 exists (this function will create one if it is missing).
        course_create_sections_if_missing($course, 0);

        // Get information about course modules and existing module types.
        // format.php in course formats may rely on presence of these variables.
        $modinfo = get_fast_modinfo($course);
        $modnames = get_module_types_names();
        $modnamesplural = get_module_types_names(true);
        $modnamesused = $modinfo->get_used_module_names();
        $mods = $modinfo->get_cms();
        $sections = $modinfo->get_section_info_all();

        // CAUTION, hacky fundamental variable defintion to follow!
        // Note that because of the way course fromats are constructed though
        // inclusion we pass parameters around this way.
        $displaysection = $section;

        // Include course AJAX.
        include_course_ajax($course, $modnamesused);

        // Include the actual course format.
        ob_start();
        require($CFG->dirroot . '/course/format/' . $course->format . '/format.php');
        $response->getBody()->write(ob_get_clean());
        // Content wrapper end.

        $response->getBody()->write(html_writer::end_tag('div'));

        // Trigger course viewed event.
        // We don't trust $context here. Course format inclusion above executes in the global space. We can't assume
        // anything after that point.
        course_view(\core\context\course::instance($course->id), $section);

        // If available, include the JS to prepare the download course content modal.
        if ($candownloadcourse) {
            $PAGE->requires->js_call_amd('core_course/downloadcontent', 'init');
        }

        // Load the view JS module if completion tracking is enabled for this course.
        $completion = new \completion_info($course);
        if ($completion->is_enabled()) {
            $PAGE->requiresv->js_call_amd('core_course/view', 'init');
        }

        $response->getBody()->write($renderer->footer());
        return $response;
    }

    protected function get_param(
        ServerRequestInterface $request,
        string $key,
        mixed $default = null,
    ): mixed {
        $params = $request->getQueryParams();
        if (array_key_exists($key, $params)) {
            return $params[$key];
        } else {
            debugging("Missing parameter: $key");
        }

        return $default;
    }
}
