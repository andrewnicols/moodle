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

namespace core;

/**
 * Unit tests for lib/outputrenderers.
 *
 * @package   core
 * @category  test
 * @copyright 2023 Rodrigo Mady
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers \core_renderer
 */
final class outputrenderers_test extends \advanced_testcase {
    /**
     * Test generated url from course image.
     */
    public function test_get_generated_url_for_course_image() {
        global $OUTPUT;

        $this->resetAfterTest();

        $course = self::getDataGenerator()->create_course();
        $context = \context_course::instance($course->id, IGNORE_MISSING);

        // Get the image with correct course context.
        $courseimage = $OUTPUT->get_generated_url_for_course($context);
        $url = "https://www.example.com/moodle/pluginfile.php/{$context->id}/course/generated/course.svg";
        $this->assertEquals($url, $courseimage);
    }

    /**
     * Test that the user picture is rendered with a token file url in certain conditions.
     *
     * @dataProvider user_picture_url_provider
     */
    public function test_user_picture(
        ?string $target,
        array $options,
        bool $expecttoken,
    ): void {
        global $CFG, $PAGE;

        $this->resetAfterTest();

        $user = self::getDataGenerator()->create_user([
            'picture' => 1,
        ]);
        $usercontext = \core\context\user::instance($user->id, IGNORE_MISSING);

        $fs = get_file_storage();
        $fs->create_file_from_pathname((object) [
            'contextid' => $usercontext->id,
            'component' => 'user',
            'filearea' => 'icon',
            'itemid' => 0,
            'filepath' => '/',
            'filename' => 'f2',
        ], "{$CFG->dirroot}/lib/tests/fixtures/gd-logo.png");

        $renderer = $PAGE->get_renderer(
            component: 'core',
            target: $target,
        );

        // Get the image with correct user context.
        $userimage = $renderer->user_picture($user, $options);

        if ($expecttoken) {
            $this->assertStringContainsString('/tokenpluginfile.php/', $userimage);
        } else {
            $this->assertStringContainsString('/pluginfile.php/', $userimage);
            $this->assertStringNotContainsString('/tokenpluginfile.php/', $userimage);
        }
    }

    public static function user_picture_url_provider(): array {
        return [
            'Target CLI' => [
                RENDERER_TARGET_CLI,
                [],
                false,
            ],
            'Target AJAX' => [
                RENDERER_TARGET_AJAX,
                [],
                false,
            ],
            'Target General' => [
                RENDERER_TARGET_GENERAL,
                [],
                false,
            ],
            'Target HTML email' => [
                RENDERER_TARGET_HTMLEMAIL,
                [],
                true,
            ],
            'Target Text email' => [
                RENDERER_TARGET_TEXTEMAIL,
                [],
                true,
            ],
            'Target Maintenance' => [
                RENDERER_TARGET_MAINTENANCE,
                [],
                false,
            ],

            'Force off, Target CLI' => [
                RENDERER_TARGET_CLI,
                ['includetoken' => false],
                false,
            ],
            'Force off, Target AJAX' => [
                RENDERER_TARGET_AJAX,
                ['includetoken' => false],
                false,
            ],
            'Force off, Target General' => [
                RENDERER_TARGET_GENERAL,
                ['includetoken' => false],
                false,
            ],
            'Force off, Target HTML email' => [
                RENDERER_TARGET_HTMLEMAIL,
                ['includetoken' => false],
                false,
            ],
            'Force off, Target Text email' => [
                RENDERER_TARGET_TEXTEMAIL,
                ['includetoken' => false],
                false,
            ],
            'Force off, Target Maintenance' => [
                RENDERER_TARGET_MAINTENANCE,
                ['includetoken' => false],
                false,
            ],

            'Force on, Target CLI' => [
                RENDERER_TARGET_CLI,
                ['includetoken' => true],
                true,
            ],
            'Force on, Target AJAX' => [
                RENDERER_TARGET_AJAX,
                ['includetoken' => true],
                true,
            ],
            'Force on, Target General' => [
                RENDERER_TARGET_GENERAL,
                ['includetoken' => true],
                true,
            ],
            'Force on, Target HTML email' => [
                RENDERER_TARGET_HTMLEMAIL,
                ['includetoken' => true],
                true,
            ],
            'Force on, Target Text email' => [
                RENDERER_TARGET_TEXTEMAIL,
                ['includetoken' => true],
                true,
            ],
            'Force on, Target Maintenance' => [
                RENDERER_TARGET_MAINTENANCE,
                ['includetoken' => true],
                true,
            ],
        ];
    }
}
