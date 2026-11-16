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

namespace core_external;

/**
 * Unit tests for core_external\util.
 *
 * @package     core_external
 * @category    test
 * @copyright   2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU Public License
 */
#[\PHPUnit\Framework\Attributes\CoversClass(util::class)]
#[\PHPUnit\Framework\Attributes\CoversFunction('external_format_text')]
final class util_test extends \advanced_testcase {
    /** @var \moodle_database The database connection */
    protected $db;

    public function test_request_preferences_override_external_settings(): void {
        $this->resetAfterTest();
        $context = \core\context\system::instance();
        $formatter = \core\di::get(\core\formatting::class);
        $settings = external_settings::get_instance();
        $settings->set_raw(false);
        $settings->set_fileurl(true);
        $text = '<p>@@PLUGINFILE@@/example.png</p>';

        try {
            $formatter->set_external_options(new \core\text_formatting_options(raw: true));
            $this->assertSame(
                [$text, FORMAT_HTML],
                util::format_text($text, FORMAT_HTML, $context, 'user', 'profile'),
            );
            $this->assertSame($text, util::format_string($text, $context));

            $formatter->set_external_options(new \core\text_formatting_options(raw: false, filter: false));
            [$formatted, $format] = util::format_text($text, FORMAT_HTML, $context, 'user', 'profile');
            $this->assertSame(FORMAT_HTML, $format);
            $this->assertStringNotContainsString('@@PLUGINFILE@@', $formatted);
            $this->assertNotSame($text, util::format_string($text, $context));
        } finally {
            $formatter->set_external_options(null);
        }
    }

    /**
     * Store the global DB for restore between tests.
     */
    public function setUp(): void {
        global $DB;
        parent::setUp();

        $this->db = $DB;
        external_settings::reset();
    }

    /**
     * A helper to include the legacy external functions.
     */
    protected function include_legacy_functions(): void {
        global $CFG;

        $this->assertTrue(
            $this->isInIsolation(),
            'Inclusion of the legacy test functions requires the test to be run in isolation.',
        );

        // Note: This is retained for testing of the old functions.
        require_once("{$CFG->libdir}/externallib.php");
    }

    /**
     * Reset the global DB between tests.
     */
    public function tearDown(): void {
        global $DB;
        if ($this->db !== null) {
            $DB = $this->db;
        }
        external_settings::reset();
        parent::tearDown();
    }

    /**
     * Validate courses, but still return courses even if they fail validation.
     */
    public function test_validate_courses_keepfails(): void {
        $this->resetAfterTest(true);

        $c1 = $this->getDataGenerator()->create_course();
        $c2 = $this->getDataGenerator()->create_course();
        $c3 = $this->getDataGenerator()->create_course();
        $u1 = $this->getDataGenerator()->create_user();
        $this->getDataGenerator()->enrol_user($u1->id, $c1->id);
        $courseids = [$c1->id, $c2->id, $c3->id];

        $this->setUser($u1);
        [$courses, $warnings] = util::validate_courses($courseids, [], false, true);
        $this->assertCount(2, $warnings);
        $this->assertEquals($c2->id, $warnings[0]['itemid']);
        $this->assertEquals($c3->id, $warnings[1]['itemid']);
        $this->assertCount(3, $courses);
        $this->assertTrue($courses[$c1->id]->contextvalidated);
        $this->assertFalse($courses[$c2->id]->contextvalidated);
        $this->assertFalse($courses[$c3->id]->contextvalidated);
    }

    /**
     * Validate courses can re-use an array of prefetched courses.
     */
    public function test_validate_courses_prefetch(): void {
        $this->resetAfterTest(true);

        $c1 = $this->getDataGenerator()->create_course();
        $c2 = $this->getDataGenerator()->create_course();
        $c3 = $this->getDataGenerator()->create_course();
        $c4 = $this->getDataGenerator()->create_course();
        $u1 = $this->getDataGenerator()->create_user();
        $this->getDataGenerator()->enrol_user($u1->id, $c1->id);
        $this->getDataGenerator()->enrol_user($u1->id, $c2->id);

        $courseids = [$c1->id, $c2->id, $c3->id];
        $courses = [$c2->id => $c2, $c3->id => $c3, $c4->id => $c4];

        $this->setUser($u1);
        [$courses, $warnings] = util::validate_courses($courseids, $courses);
        $this->assertCount(2, $courses);
        $this->assertCount(1, $warnings);
        $this->assertArrayHasKey($c1->id, $courses);
        $this->assertSame($c2, $courses[$c2->id]);
        $this->assertArrayNotHasKey($c3->id, $courses);
        // The extra course passed is not returned.
        $this->assertArrayNotHasKey($c4->id, $courses);
    }

    /**
     * Test the Validate courses standard functionality.
     */
    public function test_validate_courses(): void {
        $this->resetAfterTest(true);

        $c1 = $this->getDataGenerator()->create_course();
        $c2 = $this->getDataGenerator()->create_course();
        $c3 = $this->getDataGenerator()->create_course();
        $u1 = $this->getDataGenerator()->create_user();
        $this->getDataGenerator()->enrol_user($u1->id, $c1->id);
        $courseids = [$c1->id, $c2->id, $c3->id];

        $this->setAdminUser();
        [$courses, $warnings] = util::validate_courses($courseids);
        $this->assertEmpty($warnings);
        $this->assertCount(3, $courses);
        $this->assertArrayHasKey($c1->id, $courses);
        $this->assertArrayHasKey($c2->id, $courses);
        $this->assertArrayHasKey($c3->id, $courses);
        $this->assertEquals($c1->id, $courses[$c1->id]->id);
        $this->assertEquals($c2->id, $courses[$c2->id]->id);
        $this->assertEquals($c3->id, $courses[$c3->id]->id);

        $this->setUser($u1);
        [$courses, $warnings] = util::validate_courses($courseids);
        $this->assertCount(2, $warnings);
        $this->assertEquals($c2->id, $warnings[0]['itemid']);
        $this->assertEquals($c3->id, $warnings[1]['itemid']);
        $this->assertCount(1, $courses);
        $this->assertArrayHasKey($c1->id, $courses);
        $this->assertArrayNotHasKey($c2->id, $courses);
        $this->assertArrayNotHasKey($c3->id, $courses);
        $this->assertEquals($c1->id, $courses[$c1->id]->id);
    }

    /**
     * Text util::get_area_files
     */
    public function test_get_area_files(): void {
        global $CFG, $DB;

        $this->db = $DB;
        $DB = $this->getMockBuilder('moodle_database')->getMock();

        $content = base64_encode("Let us create a nice simple file.");
        $timemodified = 102030405;
        $itemid = 42;
        $filesize = strlen($content);

        $DB->method('get_records_sql')->willReturn([
            (object) [
                'filename'      => 'example.txt',
                'filepath'      => '/',
                'mimetype'      => 'text/plain',
                'filesize'      => $filesize,
                'timemodified'  => $timemodified,
                'itemid'        => $itemid,
                'pathnamehash'  => sha1('/example.txt'),
            ],
        ]);

        $component = 'mod_foo';
        $filearea = 'area';
        $context = 12345;

        $expectedfiles = [[
            'filename' => 'example.txt',
            'filepath' => '/',
            'fileurl' => "{$CFG->wwwroot}/webservice/pluginfile.php/{$context}/{$component}/{$filearea}/{$itemid}/example.txt",
            'timemodified' => $timemodified,
            'filesize' => $filesize,
            'mimetype' => 'text/plain',
            'isexternalfile' => false,
            'icon' => 'f/text',
        ],
        ];
        // Get all the files for the area.
        $files = util::get_area_files($context, $component, $filearea, false);
        $this->assertEquals($expectedfiles, $files);

        $DB->method('get_in_or_equal')->willReturn([
            '= :mock1',
            ['mock1' => $itemid],
        ]);

        // Get just the file indicated by $itemid.
        $files = util::get_area_files($context, $component, $filearea, $itemid);
        $this->assertEquals($expectedfiles, $files);
    }

    /**
     * Test default time for user created tokens.
     */
    public function test_user_created_tokens_duration(): void {
        global $CFG, $DB;
        $this->resetAfterTest(true);

        $CFG->enablewebservices = 1;
        $CFG->enablemobilewebservice = 1;
        $user1 = $this->getDataGenerator()->create_user();
        $user2 = $this->getDataGenerator()->create_user();
        $service = $DB->get_record('external_services', ['shortname' => MOODLE_OFFICIAL_MOBILE_SERVICE, 'enabled' => 1]);

        $this->setUser($user1);
        $timenow = time();
        $token = util::generate_token_for_current_user($service);
        $this->assertGreaterThanOrEqual($timenow + $CFG->tokenduration, $token->validuntil);

        // Change token default time.
        $this->setUser($user2);
        set_config('tokenduration', DAYSECS);
        $token = util::generate_token_for_current_user($service);
        $timenow = time();
        $this->assertLessThanOrEqual($timenow + DAYSECS, $token->validuntil);
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('format_text_provider')]
    public function test_format_text(
        bool $raw,
        bool $filter,
        string $text,
        string $textformat,
        string $correct,
        string $correctformat,
        ?array $options,
    ): void {
        $settings = external_settings::get_instance();

        $settings->set_raw($raw);
        $settings->set_filter($filter);
        $context = \core\context\system::instance();

        $this->assertSame(
            util::format_text($text, $textformat, $context, 'core', '', 0, $options),
            [$correct, $correctformat],
        );
    }

    public static function format_text_provider(): \Iterator {
        $text = '$$ \pi $$';

        yield [
            'raw' => true,
            'filter' => false,
            'text' => $text,
            'textformat' => FORMAT_MARKDOWN,
            'correct' => $text,
            'correctformat' => FORMAT_MARKDOWN,
            'options' => null,
        ];

        yield [
            'raw' => false,
            'filter' => true,
            'text' => $text,
            'textformat' => FORMAT_MARKDOWN,
            'correct' => "<span class=\"filter_mathjaxloader_equation\"><p><span class=\"nolink\">{$text}</span></p>
</span>",
            'correctformat' => FORMAT_HTML,
            'options' => null,
        ];

        // Filters can be opted out from by the developer.
        yield [
            'raw' => false,
            'filter' => true,
            'text' => $text,
            'textformat' => FORMAT_MARKDOWN,
            'correct' => "<p>{$text}</p>\n",
            'correctformat' => FORMAT_HTML,
            'options' => [
                'filter' => false,
            ],
        ];

        yield [
            'raw' => false,
            'filter' => true,
            'text' => '<p><a id="test"></a><a href="#test">Text</a></p>',
            'textformat' => FORMAT_HTML,
            'correct' => '<p><a id="test"></a><a href="#test">Text</a></p>',
            'correctformat' => FORMAT_HTML,
            'options' => [
                'allowid' => true,
            ],
        ];

        yield [
            'raw' => false,
            'filter' => true,
            'text' => '<p><a id="test"></a><a href="#test">Text</a></p>',
            'textformat' => FORMAT_HTML,
            'correct' => '<p><a></a><a href="#test">Text</a></p>',
            'correctformat' => FORMAT_HTML,
            'options' => [
                'allowid' => false,
            ],
        ];

        yield [
            'raw' => false,
            'filter' => true,
            'text' => '<p><a id="test"></a><a href="#test">Text</a></p>' . "\n" . 'Newline',
            'textformat' => FORMAT_MOODLE,
            'correct' => '<p><a id="test"></a><a href="#test">Text</a></p> Newline',
            'correctformat' => FORMAT_HTML,
            'options' => [
                'newlines' => false,
            ],
        ];

        $text = '<p><a id="test"></a><a href="#test">Text</a></p>';
        yield [
            'raw' => false,
            'filter' => true,
            'text' => $text,
            'textformat' => FORMAT_MOODLE,
            'correct' => '<div class="text_to_html">' . $text . '</div>',
            'correctformat' => FORMAT_HTML,
            'options' => [
                'para' => true,
            ],
        ];

        $text = '<p><a id="test"></a><a href="#test">Text</a></p>';
    }

    public function test_format_string_with_context_options(): void {
        $settings = external_settings::get_instance();

        $settings->set_raw(false);
        $settings->set_filter(true);

        $context = \core\context\system::instance();

        $text = '<p><a id="test"></a><a href="#test">Text</a></p>';
        $options = [
            'context' => $context,
        ];

        $this->assertSame(
            util::format_text($text, FORMAT_MOODLE, $context, 'core', '', 0, $options),
            [$text, FORMAT_HTML],
        );
    }

    public static function external_format_string_provider(): \Iterator {
        $text = '<span lang="en" class="multilang">EN</span><span lang="fr" class="multilang">FR</span> ';
        $text .= '<script>hi</script> <h3>there</h3>!';
        yield [
            'raw' => true,
            'filter' => true,
            'text' => $text,
            'correct' => $text,
            'options' => null,
        ];

        $text = '<span lang="en" class="multilang">EN</span><span lang="fr" class="multilang">FR</span> ';
        $text .= '<script>hi</script> <h3>there</h3>?';
        yield [
            'raw' => false,
            'filter' => false,
            'text' => $text,
            'correct' => 'ENFR hi there?',
            'options' => null,
        ];

        $text = '<span lang="en" class="multilang">EN</span><span lang="fr" class="multilang">FR</span> ';
        $text .= '<script>hi</script> <h3>there</h3>@';
        yield [
            'raw' => false,
            'filter' => true,
            'text' => $text,
            'correct' => 'EN hi there@',
            'options' => null,
        ];

        // Filters can be opted out.
        $text = '<span lang="en" class="multilang">EN</span><span lang="fr" class="multilang">FR</span> ';
        $text .= '<script>hi</script> <h3>there</h3>%';
        yield [
            'raw' => false,
            'filter' => true,
            'text' => $text,
            'correct' => 'ENFR hi there%',
            'options' => [
                'filter' => false,
            ],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('external_format_string_provider')]
    public function test_format_string_with_external(
        bool $raw,
        bool $filter,
        string $text,
        string $correct,
        ?array $options,
    ): void {
        $this->resetAfterTest();
        $settings = external_settings::get_instance();

        // Enable multilang filter to on content and heading.
        filter_set_global_state('multilang', TEXTFILTER_ON);
        filter_set_applies_to_strings('multilang', 1);
        $filtermanager = \filter_manager::instance();
        $filtermanager->reset_caches();

        $settings->set_raw($raw);
        $settings->set_filter($filter);
        $context = \context_system::instance();

        $this->assertSame($correct, util::format_string($text, $context, options: $options));
    }
}
