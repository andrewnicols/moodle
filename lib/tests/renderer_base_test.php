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

/**
 * Unit tests for the renderer_base class.
 *
 * @package   core
 * @category  test
 * @copyright 2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die;

global $CFG;
require_once($CFG->libdir . '/outputrenderers.php');

// phpcs:ignoreFile moodle.PHPUnit.TestCaseNames.MissingNS

/**
 * Unit tests for the renderer_base class.
 *
 * @coversDefaultClass \renderer_base
 */
class renderer_base_test extends \advanced_testcase {
    /**
     * Data provider fo the image_url_candidates tests.
     *
     * @return array[]
     */
    public function image_url_candidates_provider(): array {
        return [
            'One value only' => [
                'mod_forum', ['icon'], 'icon',
            ],
            'Two values with first selected' => [
                'mod_forum', ['icon', 'foo'], 'icon',
            ],
            'Two values with second selected' => [
                'mod_forum', ['foo', 'icon'], 'icon',
            ],
            'One values with no valid match' => [
                'mod_forum', ['foo'], null,
            ],
            'Two values with no valid match' => [
                'mod_forum', ['foo', 'bar'], null,
            ],
            'One value with invalid component' => [
                'mod_nonexistent_plugin', ['icon'], null,
            ],
        ];
    }

    /**
     * Test that the image_url_candidates function works as expected.
     *
     * @dataProvider image_url_candidates_provider
     * @param string $component
     * @param array $candidates
     * @param string|null $correctmatch
     * @covers ::image_url_candidates
     */
    public function test_image_url_candidates(
        string $component,
        array $candidates,
        ?string $correctmatch
    ): void {
        $page = new moodle_page();
        $page->set_url('/course/view.php');
        $page->set_context(context_system::instance());
        $renderer = $page->get_renderer('core');

        $result = $renderer->image_url_candidates($component, $candidates);

        if ($correctmatch) {
            $this->assertInstanceOf(\moodle_url::class, $result);
            $this->assertMatchesRegularExpression("_.*/{$correctmatch}\$_", $result->get_path());
        } else if ($correctmatch === null) {
            $this->assertNull($result);
        }
    }
}
