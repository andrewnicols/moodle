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

namespace core_question\route\api;

use core\exception\required_capability_exception;
use core\param;
use core\router\headers\count_header;
use core\router\parameters\path_course;
use core\router\parameters\query_course;
use core\router\parameters\query_coursemodule;
use core\router\require_login;
use core\router\route;
use core\router\schema\objects\array_of_things;
use core\router\schema\objects\scalar_type;
use core\router\schema\objects\schema_object;
use core\router\schema\response\content\json_media_type;
use core\router\schema\response\payload_response;
use core\router\schema\response\response;
use core_question\local\bank\formatted_bank;
use core_question\local\bank\question_bank_helper;
use core_question\local\bank\question_edit_contexts;
use core_question\local\bank\question_version_status;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Web service functions related to question banks
 *
 * @package   core_question
 * @copyright 2025 onwards Catalyst IT EU {@link https://catalyst-eu.net}
 * @author    Mark Johnson <mark.johnson@catalyst-eu.net>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class bank {
    /**
     * Return the total number of questions in each question bank for the given course.
     *
     * This will count all top-level questions (no subquestions) that are not hidden.
     *
     * @param \stdClass $course The course ID the fetch question counts for.
     * @param \core\context\course $coursecontext The course context.
     */
    #[route(
        path: '/questions',
        method: ['GET', 'HEAD'],
        queryparams: [
            new query_course(),
        ],
        responses: [
            new response(
                statuscode: 200,
                description: 'OK',
                headers: [
                    new count_header(),
                ],
            ),
        ],
        requirelogin: new require_login(false, true, 'course'),
    )]
    public function question_counts(
        ServerRequestInterface $request,
        ResponseInterface $response,
        \core\context\course $coursecontext,
    ): payload_response {
        global $DB;

        // TODO: This belongs in a service that can be injected using DI.
        // This can be injected into the route method as a parameter, or the route constructor.
        //
        // $bankhelper = $this->get(\core_question\local\bank\question_bank_helper::class); // This line not needed if using the method / constructor injection.
        // $bankhelper->get_question_count_in_course($course);
        // Doing this will mean that we can easily test this code without needing to mock the DB, or even run `resetAfterTest()`

        // Doing this means that this whole method becomes
        /*

    public function question_counts(
        ServerRequestInterface $request,
        ResponseInterface $response,
        \stdClass $course,
        \core_question\local\bank\question_bank_helper $bankhelper,
    ): ResponseInterface {
        return $response->withAddedHeader('X-Total-Count', $bankhelper->get_question_count_in_course($course));
    }

         */

        // There is also a query as to where capability checking belongs.
        // This really belongs in the service.
        $capabilities = array_merge(question_edit_contexts::$caps['editq'], question_edit_contexts::$caps['categories']);

        if (!has_any_capability($capabilities, $coursecontext)) {
            throw new required_capability_exception(
                $coursecontext,
                reset($capabilities),
                'missingcapability',
                'question',
            );
        }

        $contextpathlike = $DB->sql_like('c.path', ':contextpath');

        // Get a count of all questions in each module context within this course, keyed by cmid.
        // Only include modules that have question category records, so we don't get a count for modules that don't use questions.
        // Return a count of 0 for those modules with no questions.
        // The double LEFT JOIN of question_versions ensures we only get the latest version for a question bank entry.
        $sql = "
            SELECT c.instanceid,
                   COUNT(
                       CASE
                           WHEN q.id IS NOT NULL THEN 1
                       END
                   ) AS count
              FROM {context} c
              JOIN {question_categories} qc ON qc.contextid = c.id
         LEFT JOIN {question_bank_entries} qbe ON qbe.questioncategoryid = qc.id
         LEFT JOIN {question_versions} qv ON qv.questionbankentryid = qbe.id
         LEFT JOIN {question_versions} qv1 ON qv1.questionbankentryid = qbe.id AND qv.version < qv1.version
         LEFT JOIN {question} q ON q.id = qv.questionid
             WHERE c.contextlevel = :module
                   AND {$contextpathlike}
                   AND (q.parent = '0' OR q.id IS NULL)
                   AND (qv1.questionbankentryid IS NULL OR q.id IS NULL)
          GROUP BY c.instanceid
        ";
        $params = [
            'hidden' => question_version_status::QUESTION_STATUS_HIDDEN,
            'module' => \core\context\module::LEVEL,
            'contextpath' => "{$coursecontext->path}/%",
        ];
        $counts = $DB->get_records_sql_menu($sql, $params);
        $response = $response->withAddedHeader('X-Total-Count', count($counts));

        // TODO Note:
        // If you want to, you can include the actual data here, even for the HEAD request.
        // Slim will automatically remove any body content from a HEAD request.
        // However, the chances are that you don't want to do this because it is more costly to fetch the data anyway.
        // This is just a note to say that you _can_ do so if it suits your case.
        // This would mean that the data is available from a single definition.
        // If this is not what you want (and it probably isn't what you want) then you shoudl change the method part of the attribute back to 'HEAD' only and not return any data.
        $data = ['some', 'data', 'here'];
        return new payload_response(
            request: $request,
            response: $response,
            payload: $data,
        );

        // If you are going with just the HEAD response you can use a Response directly:
        return $response->withAddedHeader('X-Total-Count', count($counts));
    }

    /**
     * Return the data for rendering the bank switcher UI using the switch_question_bank template.
     *
     * There is no capability check here as this may be used for different reasons (for example, adding questions to a quiz,
     * or managing question categories). The output component does its own capability checks when building the list of banks
     * to display.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param int $course The ID of the course to display banks from.
     * @param int $coursecontext The course context
     * @return payload_response The template context for core_question/switch_question_bank.
     */
    #[route(
        path: '/banks', // Resolves to /api/rest/v2/question/bank/1/switcher.
        queryparams: [
            new query_course(),
            new query_coursemodule('currentmodule'),
        ],
        responses: [
            new response(
                statuscode: 200,
                description: 'OK',
                headers: [
                    new count_header(),
                ],
                content: [
                    new json_media_type(
                        schema: new schema_object(
                            content: [
                                'contextid' => new scalar_type(type: param::INT),
                                'hasactivitybank' => new scalar_type(type: param::BOOL),
                                'activitybank' => new schema_object(
                                    content: [
                                        'name' => new scalar_type(type: param::NOTAGS),
                                        'cmid' => new scalar_type(type: param::INT),
                                    ],
                                ),
                                'hascoursesharedbanks' => new scalar_type(type: param::BOOL),
                                'coursesharedbanks' => new array_of_things(thingtype: formatted_bank::class),
                                'hasrecentlyviewedbanks' => new scalar_type(type: param::BOOL),
                                'recentlyviewedbanks' => new array_of_things(thingtype: formatted_bank::class),
                            ],
                        ),
                    ),
                ],
            ),
        ],
        requirelogin: new require_login(true, courseattributename: 'course'),
    )]
    public function switcher(
        ServerRequestInterface $request,
        ResponseInterface $response,
        \stdClass $course,
        \core\context\course $coursecontext,
        \stdClass $currentmoduledata,
        \core\context\module $currentmodulecontext,
    ): payload_response {
        xdebug_break();
        $cminfo = \cm_info::create($currentmoduledata);

        $capabilities = ['moodle/question:useall', 'moodle/question:usemine'];

        // TODO: This belongs in a service that can be injected using DI.
        $coursesharedbanks = question_bank_helper::get_activity_instances_with_shareable_questions(
            incourseids: [$course->id],
            havingcap: $capabilities,
            filtercontext: $currentmodulecontext,
        );

        $data = array_map(
            function ($bank) {
                $bank->isactivitybank = false;
                $bank->recentlyviewed = true;
                return $bank;
            },
            $coursesharedbanks,
        );

        $response = $response->withAddedHeader('X-Total-Count', count($data));

        return new payload_response(
            request: $request,
            response: $response,
            payload: $data,
        );
    }
}
