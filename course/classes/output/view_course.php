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

namespace core_course\output;

use Psr\Http\Message\ResponseInterface;
use stdClass;

class view_course {
    use \core\router\route_controller;

    public function show_course(
        ResponseInterface $response,
        stdClass $course,
        ?int $sectionid = null,
        int $expandsection = -1,
        \moodle_page $page,
        ?int $switchrole = null,
    ): ResponseInterface {
        global $CFG, $USER, $DB;

        $urlparams = ['id' => $course->id];

        // Sectionid should get priority over section number.
        if ($sectionid) {
            $section = $DB->get_field('course_sections', 'section', ['id' => $sectionid, 'course' => $course->id], MUST_EXIST);
        }
        if ($section) {
            $urlparams['section'] = $section;
        }
        if ($expandsection !== -1) {
            $urlparams['expandsection'] = $expandsection;
        }

        $page->set_url('/course/view.php', $urlparams); // Defined here to avoid notices on errors etc.

        // Prevent caching of this page to stop confusion when changing page after making AJAX changes.
        $page->set_cacheable(false);

        \core\context_helper::preload_course($course->id);
        $context = \core\context\course::instance($course->id, MUST_EXIST);

        // Remove any switched roles before checking login.
        if ($switchrole == 0 && confirm_sesskey()) {
            role_switch($switchrole, $context);
        }

        require_login($course);

        // Switchrole - sanity check in cost-order...
        $resetuserallowedediting = false;
        if ($switchrole > 0 && confirm_sesskey() &&
            has_capability('moodle/role:switchroles', $context)) {
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

        require_once($CFG->dirroot.'/calendar/lib.php'); // This is after login because it needs $USER.

        // Must set layout before gettting section info. See MDL-47555.
        $page->set_pagelayout('course');
        $page->add_body_class('limitedwidth');

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

        $page->set_pagetype('course-view-' . $course->format);
        $page->set_other_editing_capability('moodle/course:update');
        $page->set_other_editing_capability('moodle/course:manageactivities');
        $page->set_other_editing_capability('moodle/course:activityvisibility');
        if (course_format_uses_sections($course->format)) {
            $page->set_other_editing_capability('moodle/course:sectionvisibility');
            $page->set_other_editing_capability('moodle/course:movesections');
        }

        // Preload course format renderer before output starts.
        // This is a little hacky but necessary since
        // format.php is not included until after output starts.
        $renderer = $format->get_renderer($page);

        if ($resetuserallowedediting) {
            // Ugly hack.
            unset($page->_user_allowed_editing);
        }

        if (!isset($USER->editing)) {
            $USER->editing = 0;
        }
        if ($page->user_allowed_editing()) {
            if (($edit == 1) && confirm_sesskey()) {
                $USER->editing = 1;
                // Redirect to site root if Editing is toggled on frontpage.
                if ($course->id == SITEID) {
                    redirect($CFG->wwwroot .'/?redirect=0');
                } else if (!empty($return)) {
                    redirect($CFG->wwwroot . $return);
                } else {
                    $url = new moodle_url($page->url, ['notifyeditingon' => 1]);
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
                    redirect($CFG->wwwroot .'/?redirect=0');
                } else if (!empty($return)) {
                    redirect($CFG->wwwroot . $return);
                } else {
                    redirect($page->url);
                }
            }

            if (has_capability('moodle/course:sectionvisibility', $context)) {
                if ($hide && confirm_sesskey()) {
                    set_section_visible($course->id, $hide, '0');
                    redirect($page->url);
                }

                if ($show && confirm_sesskey()) {
                    set_section_visible($course->id, $show, '1');
                    redirect($page->url);
                }
            }

            if (
                !empty($section) && !empty($coursesections) && !empty($duplicatesection)
                && has_capability('moodle/course:update', $context) && confirm_sesskey()
            ) {
                $newsection = $format->duplicate_section($coursesections);
                redirect(course_get_url($course, $newsection->section));
            }

            if (!empty($section) && !empty($move) &&
                    has_capability('moodle/course:movesections', $context) && confirm_sesskey()) {
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

        $SESSION->fromdiscussion = $page->url->out(false);


        if ($course->id == SITEID) {
            // This course is not a real course.
            redirect($CFG->wwwroot .'/?redirect=0');
        }

        // Determine whether the user has permission to download course content.
        $candownloadcourse = \core\content::can_export_context($context, $USER);

        // We are currently keeping the button here from 1.x to help new teachers figure out
        // what to do, even though the link also appears in the course admin block.  It also
        // means you can back out of a situation where you removed the admin block.
        if ($page->user_allowed_editing()) {
            $buttons = $OUTPUT->edit_button($page->url);
            $page->set_button($buttons);
        }

        // If viewing a section, make the title more specific.
        if ($section && $section > 0 && course_format_uses_sections($course->format)) {
            $sectionname = get_string('sectionname', "format_$course->format");
            $sectiontitle = get_section_name($course, $section);
            $page->set_title(
                get_string(
                    'coursesectiontitle',
                    'moodle',
                    ['course' => $course->fullname, 'sectiontitle' => $sectiontitle, 'sectionname' => $sectionname]
                )
            );
        } else {
            $page->set_title(get_string('coursetitle', 'moodle', ['course' => $course->fullname]));
        }

        // Add bulk editing control.
        $bulkbutton = $renderer->bulk_editing_button($format);
        if (!empty($bulkbutton)) {
            $page->add_header_action($bulkbutton);
        }

        $page->set_heading($course->fullname);

        // Show communication room status notification.
        if (core_communication\api::is_available() && has_capability('moodle/course:update', $context)) {
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

            if (async_helper::is_async_pending($id, 'course', 'backup')) {
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
        require($CFG->dirroot .'/course/format/'. $course->format .'/format.php');
        // Content wrapper end.

        $response->getBody()->write(html_writer::end_tag('div'));

        // Trigger course viewed event.
        // We don't trust $context here. Course format inclusion above executes in the global space. We can't assume
        // anything after that point.
        course_view(context_course::instance($course->id), $section);

        // If available, include the JS to prepare the download course content modal.
        if ($candownloadcourse) {
            $page->requires->js_call_amd('core_course/downloadcontent', 'init');
        }

        // Load the view JS module if completion tracking is enabled for this course.
        $completion = new completion_info($course);
        if ($completion->is_enabled()) {
            $page->requiresv->js_call_amd('core_course/view', 'init');
        }

        return $response;
    }
}
