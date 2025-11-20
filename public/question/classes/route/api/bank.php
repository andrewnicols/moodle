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

use core\context\course;
use core\context\module;
use core\exception\required_capability_exception;
use core\param;
use core\router\parameters\path_course;
use core\router\require_login;
use core\router\route;
use core\router\schema\example;
use core\router\schema\objects\array_of_things;
use core\router\schema\objects\scalar_type;
use core\router\schema\objects\schema_object;
use core\router\schema\parameters\path_parameter;
use core\router\schema\parameters\query_parameter;
use core\router\schema\response\content\json_media_type;
use core\router\schema\response\payload_response;
use core\router\schema\response\response;
use core_question\local\bank\formatted_bank;
use core_question\output\switch_question_bank;
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
     * @param int $courseid
     */
    #[route(
        path: '/bank/{courseid}/question_counts',
        method: ['GET'],
        pathtypes: [
            new path_parameter(
                name: 'courseid',
                type: param::INT,
                description: 'The course ID the fetch question counts for',
                required: true,
            ),
        ],
        requirelogin: new require_login(false, true, 'courseid'),
    )]
    public function question_counts(
        ServerRequestInterface $request,
        ResponseInterface $response,
        int $courseid,
    ): payload_response {
        global $DB;
        $coursecontext = course::instance($courseid);
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
            'module' => module::LEVEL,
            'contextpath' => "{$coursecontext->path}/%",
        ];
        $counts = $DB->get_records_sql_menu($sql, $params);
        return new payload_response(
            payload: [
                'counts' => $counts,
            ],
            request: $request,
            response: $response,
        );
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
        path: '/bank/{course}/switcher', // Resolves to /api/rest/v2/question/bank/1/switcher.
        pathtypes: [
            new path_course(),
        ],
        queryparams: [
            new query_parameter(
                name: 'currentcmid',
                type: param::INT,
            ),
        ],
        responses: [
            new response(
                statuscode: 200,
                description: 'OK',
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
                        example: new example(
                            name: 'Question bank switcher',
                            summary: 'Data for rendering the core_question/switch_question_bank template',
                            value: [
                                'contextid' => 1,
                                'hasactivitybank' => true,
                                'activitybank' => [
                                    'name' => 'Quiz 1',
                                    'cmid' => 1,
                                ],
                                'hascoursesharedbanks' => true,
                                'coursesharedbanks' => [
                                    0 => [
                                        'name' => 'Question bank 1',
                                        'modid' => '2',
                                    ],
                                    1 => [
                                        'name' => 'Question bank 2',
                                        'modid' => '3',
                                    ],
                                ],
                                'hasrecentlyviewedbanks' => true,
                                'recentlyviewedbanks' => [
                                    0 => [
                                        'modid' => '4',
                                        'coursenamebankname' => 'c2 - Question bank 4',
                                    ],
                                    1 => [
                                        'modid' => '6',
                                        'coursenamebankname' => 'c3 - Question bank 5',
                                    ],
                                ],
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
        course $coursecontext,
    ): payload_response {
        global $USER, $CFG, $PAGE;
        require_once($CFG->dirroot . '/question/renderer.php');
        $params = $request->getQueryParams();
        $cmid = $params['currentcmid'] ?? null;
        if ($cmid) {
            $context = module::instance($cmid);
        } else {
            $context = $coursecontext;
        }
        $PAGE->set_context($context);
        $switcher = new switch_question_bank($cmid, $course->id, $USER->id);
        $output = new \core_question_bank_renderer($PAGE, RENDERER_TARGET_AJAX);
        return new payload_response(
            request: $request,
            response: $response,
            payload: $switcher->export_for_template($output),
        );
    }

}
