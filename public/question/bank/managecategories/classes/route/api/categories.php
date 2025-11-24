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

namespace qbank_managecategories\route\api;

use core\context\module;
use core\output\core_renderer;
use core\param;
use core\router\route;
use core\router\schema\parameters\path_parameter;
use core\router\schema\response\payload_response;
use qbank_managecategories\output\move_context_list;
use qbank_managecategories\question_categories;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * API routes for category management
 *
 * @package   qbank_managecategories
 * @copyright 2025 onwards Catalyst IT EU {@link https://catalyst-eu.net}
 * @author    Mark Johnson <mark.johnson@catalyst-eu.net>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class categories {
    /**
     * Return a tree of valid locations to move a question category to within the given course module.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param int $categoryid The category we are moving.
     * @param int $cmid The course module we are moving the category to.
     * @return payload_response The template context for core_question/move_context_list.
     */
    #[route(
        // Resolves to /api/rest/v2/qbank_managecategories/categories/1/movetree/2.
        path: '/categories/{categoryid}/movetree/{cmid}',
        pathtypes: [
            new path_parameter(
                name: 'categoryid',
                type: param::INT,
            ),
            new path_parameter(
                name: 'cmid',
                type: param::INT,
            ),
        ],
    )]
    public function movetree(
        ServerRequestInterface $request,
        ResponseInterface $response,
        int $categoryid,
        int $cmid,
    ): payload_response {
        global $PAGE;
        [$course, $cm] = get_course_and_cm_from_cmid($cmid);
        require_login($course);
        $renderer = new core_renderer($PAGE, RENDERER_TARGET_AJAX);
        $context = module::instance($cmid);
        require_capability('moodle/question:managecategory', $context);
        $categories = new question_categories(new \moodle_url('/'), cmid: $cmid);
        $list = new move_context_list($categories, $categoryid, $cm, $context);
        return new payload_response(
            request: $request,
            response: $response,
            payload: $list->export_for_template($renderer),
        );
    }
}
