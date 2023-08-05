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

use GuzzleHttp\Psr7\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use core\router\route;
use DI\Attribute\Inject;
use GuzzleHttp\Psr7\ServerRequest;
use moodle_database;
use stdClass;

class view_controller {
    use \core\router\route_controller;

    #[route(
        path: '/view/{courseid}',
        pathtypes: [
            new \core\router\path_parameter(
                name: 'courseid',
                type: PARAM_INT,
            ),
        ],
    )]
    public function view_course(
        ServerRequestInterface $request,
        ResponseInterface $response,
        int $courseid,
        \moodle_page $page,
        \moodle_database $db,
    ): ResponseInterface {
        global $CFG;

        $course = $db->get_record('course', ['id' => $courseid]);

        // Preload the course context, and all child contexts.
        \core\context_helper::preload_course($course->id);
        $context = \core\context\course::instance($course->id, MUST_EXIST);

        // TODO Unswitch Role.

        require_login($course);

        // TODO Switch Role.

        // Prevent caching of this page to stop confusion when changing page after making AJAX changes.
        $page->set_cacheable(false);
        $page->set_context(\core\context\course::instance($course->id));

        $redirect = $this->container->call(
            [$this, 'handle_external_course_redirect'],
            [
                'response' => $response,
                'course' => $course,
            ],
        );
        if ($redirect) {
            return $redirect;
        }

        // This is after login because it needs $USER.
        require_once($CFG->dirroot . '/calendar/lib.php');

        // Must set layout before gettting section info. See MDL-47555.
        $page->set_pagelayout('course');
        $page->add_body_class('limitedwidth');

        // TODO Section expansion.


        // Fix course format if it is no longer installed.
        $format = course_get_format($course);
        $course->format = $format->get_format();

        $page->set_pagetype("course-view-{$course->format}");
        $page->set_other_editing_capability('moodle/course:update');
        $page->set_other_editing_capability('moodle/course:manageactivities');
        $page->set_other_editing_capability('moodle/course:activityvisibility');
        if (course_format_uses_sections($course->format)) {
            $page->set_other_editing_capability('moodle/course:sectionvisibility');
            $page->set_other_editing_capability('moodle/course:movesections');
        }

        return $response;
    }

    public function handle_external_course_redirect(
        ResponseInterface $response,
        stdClass $course,
    ): ?ResponseInterface {
        global $CFG;
        // If course is hosted on an external server, redirect to corresponding
        // url with appropriate authentication attached as parameter.
        if (file_exists($CFG->dirroot . '/course/externservercourse.php')) {
            include($CFG->dirroot . '/course/externservercourse.php');
            if (function_exists('extern_server_course')) {
                if ($externurl = extern_server_course($course)) {
                    return $this->redirect($response, $externurl);
                    redirect($externurl);
                }
            }
        }
        return null;
    }
}
