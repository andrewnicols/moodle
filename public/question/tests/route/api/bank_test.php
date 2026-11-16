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

use core\router\route_loader_interface;
use core\tests\router\route_testcase;
use core\context\course;
use core\context\module;
use core\formatting;
use core_question\local\bank\question_bank_helper;
use core_question\local\bank\question_counts_test;
use core_question\local\bank\question_version_status;
use core_question\output\question_category_selector;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;

/**
 * Unit tests for \core_question\route\api\bank
 *
 * This tests that the route correct calls {@see question_counts::by_course()} and returns the results in the correct format.
 * Full coverage of {@see question_counts::by_course()} is in {@see question_counts_test}.
 *
 * @package   core_question
 * @copyright 2025 onwards Catalyst IT EU {@link https://catalyst-eu.net}
 * @author    Mark Johnson <mark.johnson@catalyst-eu.net>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(bank::class)]
final class bank_test extends route_testcase {
    public function test_uses_injected_formatter(): void {
        $this->resetAfterTest();
        $this->setAdminUser();
        $course = $this->getDataGenerator()->create_course();
        $bank = $this->getDataGenerator()->create_module('qbank', ['course' => $course->id]);
        $modulecontext = module::instance($bank->cmid);
        $formatter = $this->createMock(formatting::class);
        $formatter->method('format_short_string')->willReturn('Injected name');
        $formatter->method('format_content')->willReturn(['Injected info', FORMAT_HTML]);
        $controller = new bank($formatter);

        $selector = $this->createMock(question_category_selector::class);
        $selector->method('get_categories_for_contexts')->willReturn([
            (object) ['name' => 'Original', 'info' => 'Original', 'infoformat' => FORMAT_MARKDOWN],
        ]);
        $categories = $controller->categories(
            new ServerRequest('GET', '/categories'),
            new Response(),
            $modulecontext,
            $selector,
        )->payload['categories'];
        $this->assertSame('Injected name', $categories[0]->name);
        $this->assertSame('Injected info', $categories[0]->info);
        $this->assertSame((int) FORMAT_HTML, $categories[0]->infoformat);

        $request = (new ServerRequest('GET', '/banks'))->withQueryParams([
            'includeshared' => true,
            'includerecent' => false,
            'includeprivate' => false,
        ]);
        $banks = $controller->banks(
            $request,
            new Response(),
            course::instance($course->id),
            $modulecontext,
            new question_bank_helper(),
        )->payload['banks'];
        $selected = array_column($banks, null, 'modid')[$bank->cmid];
        $this->assertSame('Injected name', $selected->name);
    }

    public function test_categories_text_representations(): void {
        $this->resetAfterTest();
        $this->setAdminUser();
        $this->add_class_routes_to_route_loader(bank::class);
        $course = $this->getDataGenerator()->create_course();
        $bank = $this->getDataGenerator()->create_module('qbank', ['course' => $course->id]);
        $context = module::instance($bank->cmid);
        $category = $this->getDataGenerator()->get_plugin_generator('core_question')->create_question_category([
            'contextid' => $context->id,
            'name' => '<span lang="en" class="multilang">English</span><span lang="fr" class="multilang">French</span>',
            'info' => '**Category info**',
            'infoformat' => FORMAT_MARKDOWN,
        ]);
        filter_set_global_state('multilang', TEXTFILTER_ON);
        filter_set_applies_to_strings('multilang', 1);
        \filter_manager::instance()->reset_caches();
        force_current_language('en');

        try {
            $path = "/categories?coursemodule={$bank->cmid}";
            $response = $this->process_api_request('GET', "{$path}&textMode=raw");
            $this->assert_valid_response($response);
            $raw = $this->decode_response($response, true)['categories'][$category->id];
            $this->assertSame($category->name, $raw['name']);
            $this->assertSame('**Category info**', $raw['info']);
            $this->assertSame((int) FORMAT_MARKDOWN, $raw['infoformat']);

            $response = $this->process_api_request('GET', "{$path}&applyContextFilters=true");
            $this->assert_valid_response($response);
            $formatted = $this->decode_response($response, true)['categories'][$category->id];
            $this->assertSame('English', $formatted['name']);
            $this->assertStringContainsString('<strong>Category info</strong>', $formatted['info']);
            $this->assertSame((int) FORMAT_HTML, $formatted['infoformat']);

            $response = $this->process_api_request('GET', "{$path}&applyContextFilters=false");
            $this->assert_valid_response($response);
            $unfiltered = $this->decode_response($response, true)['categories'][$category->id];
            $this->assertSame('EnglishFrench', $unfiltered['name']);
            $this->assertSame((int) FORMAT_HTML, $unfiltered['infoformat']);
        } finally {
            force_current_language(null);
        }
    }

    public function test_bank_text_representations(): void {
        $this->resetAfterTest();
        $this->setAdminUser();
        $this->add_class_routes_to_route_loader(bank::class);
        $course = $this->getDataGenerator()->create_course();
        $name = '<span lang="en" class="multilang">English</span><span lang="fr" class="multilang">French</span>';
        $bank = $this->getDataGenerator()->create_module('qbank', ['course' => $course->id, 'name' => $name]);
        filter_set_global_state('multilang', TEXTFILTER_ON);
        filter_set_applies_to_strings('multilang', 1);
        \filter_manager::instance()->reset_caches();
        force_current_language('en');

        try {
            $path = "/banks?course={$course->id}&currentmodule={$bank->cmid}";
            foreach (
                [
                    'textMode=raw' => $name,
                    'applyContextFilters=true' => 'English',
                    'applyContextFilters=false' => 'EnglishFrench',
                ] as $query => $expected
            ) {
                $response = $this->process_api_request('GET', "{$path}&{$query}");
                $this->assert_valid_response($response);
                $banks = $this->decode_response($response, true)['banks'];
                $selected = array_column($banks, null, 'modid')[$bank->cmid];
                $this->assertSame($expected, $selected['name']);
            }
        } finally {
            force_current_language(null);
        }
    }

    /**
     * All course modules using the question bank should have their count returned.
     */
    public function test_question_count_multiple_banks(): void {
        $this->resetAfterTest();
        $this->setAdminUser();
        $this->add_class_routes_to_route_loader(
            bank::class,
            route_loader_interface::ROUTE_GROUP_API,
        );
        $course = self::getDataGenerator()->create_course();
        $qbank1 = self::getDataGenerator()->create_module('qbank', ['course' => $course->id]);
        $qbank2 = self::getDataGenerator()->create_module('qbank', ['course' => $course->id]);
        $qbank3 = self::getDataGenerator()->create_module('qbank', ['course' => $course->id]);
        // Quizzes can have questions too.
        $quiz = self::getDataGenerator()->create_module('quiz', ['course' => $course->id]);
        // Pages can't have questions. This cmid should not be in the list of counts.
        self::getDataGenerator()->create_module('page', ['course' => $course->id]);

        $questiongenerator = self::getDataGenerator()->get_plugin_generator('core_question');
        // Generate questions.
        // 1 in qbank 1.
        $bank1context = module::instance($qbank1->cmid);
        $category1 = question_get_default_category($bank1context->id, true);
        $questiongenerator->create_question('truefalse', overrides: ['category' => $category1->id]);
        // None in qbank 2.
        // 3 in qbank 3.
        $bank3context = module::instance($qbank3->cmid);
        $category3 = question_get_default_category($bank3context->id, true);
        $questiongenerator->create_question('truefalse', overrides: ['category' => $category3->id]);
        $questiongenerator->create_question('truefalse', overrides: ['category' => $category3->id]);
        $questiongenerator->create_question('truefalse', overrides: ['category' => $category3->id]);
        // 2 in the quiz.
        $quizcontext = module::instance($quiz->cmid);
        $category4 = question_get_default_category($quizcontext->id, true);
        $questiongenerator->create_question('truefalse', overrides: ['category' => $category4->id]);
        $questiongenerator->create_question('truefalse', overrides: ['category' => $category4->id]);

        $response = $this->process_api_request('GET', "/counts?course={$course->id}");
        $this->assert_valid_response($response);
        $payload = $this->decode_response($response, true);

        $this->assertEquals(
            ['counts' =>
                [
                    $qbank1->cmid => 1,
                    $qbank2->cmid => 0,
                    $qbank3->cmid => 3,
                    $quiz->cmid => 2,
                ],
            ],
            $payload,
        );
    }

    /**
     * Each of the bank API routes require the caller to hold the course:content:read scope, since they
     * expose read-only information about question banks within a course.
     *
     * @param string $method
     */
    #[DataProvider('required_scopes_provider')]
    public function test_required_scopes(string $method): void {
        $this->assert_route_required_scopes(
            [['core_course:course:content:read']],
            [bank::class, $method],
        );
    }

    /**
     * Data provider for test_required_scopes.
     *
     * @return array
     */
    public static function required_scopes_provider(): array {
        return [
            'question_counts' => ['question_counts'],
            'banks' => ['banks'],
            'categories' => ['categories'],
        ];
    }
}
