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
use moodle_database;
use moodle_url;

class edit_controller {
    use \core\router\route_controller;

    #[route(
        path: '/edit/{id:[0-9]+}',
        pathtypes: [
            new path_parameter(
                name: 'id',
                type: PARAM_INT,
            ),
        ],
        method: [
            'GET',
            'POST',
        ],
    )]
    public function edit(
        ServerRequestInterface $request,
        ResponseInterface $response,
        int $id,
        moodle_database $db,
        \moodle_page $PAGE,
        \core\config $CFG,
    ): ResponseInterface {
        if ($id == SITEID) {
            // TODO Redirect to the site settings page.
            // Don't allow editing of 'site course' using this form.
            throw new \moodle_exception('cannoteditsiteform');
        }

        // Login to the course and retrieve also all fields defined by course format.
        $course = get_course($id);
        require_login($course);
        $course = course_get_format($course)->get_course();

        $category = $db->get_record('course_categories', ['id' => $course->category], '*', MUST_EXIST);
        $coursecontext = \core\context\course::instance($course->id);
        require_capability('moodle/course:update', $coursecontext);

        // Prepare course and the editor.
        $editoroptions = $this->get_editor_options();
        $overviewfilesoptions = course_overviewfiles_options($course);

        // Add context for editor.
        $editoroptions['context'] = $coursecontext;
        $editoroptions['subdirs'] = file_area_contains_subdirs($coursecontext, 'course', 'summary', 0);
        $course = file_prepare_standard_editor($course, 'summary', $editoroptions, $coursecontext, 'course', 'summary', 0);
        if ($overviewfilesoptions) {
            file_prepare_standard_filemanager($course, 'overviewfiles', $overviewfilesoptions, $coursecontext, 'course', 'overviewfiles', 0);
        }

        // Populate course tags.
        $course->tags = \core_tag_tag::get_item_tags_array('core', 'course', $course->id);

        $returnurl = $this->get_returnto($request);
        $args = array_filter([
            'course' => $course,
            'category' => $category,
            'editoroptions' => $editoroptions,
            'returnto' => $this->get_param($request, 'returnto', null),
            'returnurl' => $returnurl,
        ], fn($arg) => $arg !== null);
        // TODO Move this form to the correct namespace.
        $editform = new \course_edit_form(null, $args);

        // TODO: Move this to a dedicated POST handler?
        if ($editform->is_cancelled()) {
            // The form has been cancelled, take them back to what ever the return to is.
            return $returnurl;
        }
        if ($data = $editform->get_data()) {
            // Process data if submitted.
            if (empty($course->id)) {
                // In creating the course.
                $course = create_course($data, $editoroptions);

                // Get the context of the newly created course.
                $context = \core\context\course::instance($course->id, MUST_EXIST);

                // Admins have all capabilities, so is_viewing is returning true for admins.
                // We are checking 'enroladminnewcourse' setting to decide to enrol them or not.
                if (is_siteadmin($USER->id)) {
                    $enroluser = $CFG->enroladminnewcourse;
                } else {
                    $enroluser = !is_viewing($coursecontext, null, 'moodle/role:assign');
                }

                if (!empty($CFG->creatornewroleid) && $enroluser && !is_enrolled($context, null, 'moodle/role:assign')) {
                    // Deal with course creators - enrol them internally with default role.
                    // Note: This does not respect capabilities, the creator will be assigned the default role.
                    // This is an expected behaviour. See MDL-66683 for further details.
                    enrol_try_internal_enrol($course->id, $USER->id, $CFG->creatornewroleid);
                }
            } else {
                // Save any changes to the files used in the editor.
                update_course($data, $editoroptions);
            }

            if (isset($data->saveanddisplay)) {
                return $this->redirect_to_callable(
                    request: $request,
                    response: $response,
                    callable: [view_controller::class, 'view_course'],
                    pathparams: [
                        'id' => $course->id,
                    ],
                );
            } else {
                // Save and return. Take them back to wherever.
                return $this->redirect($response, $returnurl);
            }
        }

        $streditcoursesettings = get_string("editcoursesettings");

        // Navigation note: The user is editing a course, the course will exist within the navigation and settings.
        // The navigation will automatically find the Edit settings page under course navigation.
        $pagedesc = $streditcoursesettings;
        $title = $streditcoursesettings;
        $fullname = $course->fullname;

        $PAGE->set_title($title);
        $PAGE->add_body_class('limitedwidth');
        $PAGE->set_heading($fullname);

        $response->getBody()->write($OUTPUT->header());
        $response->getBody()->write($OUTPUT->heading($pagedesc));
        $response->getBody()->write($editform->render());
        $response->getBody()->write($OUTPUT->footer());

        return $response;
    }

    protected function get_editor_options(): array {
        $cfg = $this->container()->get(\core\config::class);
        return [
            'maxfiles' => EDITOR_UNLIMITED_FILES,
            'maxbytes' => $cfg->maxbytes,
            'trusttext' => false,
            'noclean' => true,
        ];
    }

    #[route(
        path: '/create',
        queryparams: [
            new query_parameter(
                name: 'category',
                type: PARAM_INT,
                description: 'The category ID',
            ),
        ],
    )]
    public function create(
        ServerRequestInterface $request,
        ResponseInterface $response,
        int $id,
        moodle_database $db,
    ): ResponseInterface {
    }

    protected function get_returnto(
        ServerRequestInterface $request,
        ResponseInterface $response,
    ): ResponseInterface {
        $returnurl = $this->get_param($request, 'returnurl', null);
        $returnto = $this->get_param($request, 'returnto', null);
        if ($returnto === 'url' && confirm_sesskey() && $returnurl) {
            // If returnto is 'url' then $returnurl may be used as the destination to return to after saving or cancelling.
            // Sesskey must be specified, and would be set by the form anyway.
            return $this->redirect($response, new moodle_url($returnurl));
        } else {
            if (!empty($id)) {
                return $this->redirect_to_callable(
                    request: $request,
                    response: $response,
                    callable: [view_controller::class, 'view_course'],
                    pathparams: [
                        'id' => $id,
                    ],
                );
            } else {
                return $this->redirect($response, new moodle_url('/course/'));
            }
            if ($returnto !== 0) {
                switch ($returnto) {
                    case 'category':
                        return $this->redirect($response, new moodle_url('/course/index.php', [
                            'categoryid' => $this->get_param($request, 'categoryid', 0),
                        ]));
                    case 'catmanage':
                        return $this->redirect($response, new moodle_url('/course/management.php', [
                            'categoryid' => $this->get_param($request, 'categoryid', 0),
                        ]));
                    case 'topcatmanage':
                        return $this->redirect($response, new moodle_url('/course/management.php'));
                    case 'topcat':
                        return $this->redirect($response, new moodle_url('/course/'));
                    case 'pending':
                        return $this->redirect($response, new moodle_url('/course/pending.php'));
                }
            }
        }
    }
}
