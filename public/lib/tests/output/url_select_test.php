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

namespace core\output;

/**
 * Tests for the url_select class.
 *
 * @package    core
 * @category   test
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(url_select::class)]
final class url_select_test extends \advanced_testcase {
    /**
     * Test for checking the template context data for the url_select element.
     */
    public function test_url_select_disabled_options(): void {
        global $PAGE;
        $url1 = new \moodle_url("/#a");
        $url2 = new \moodle_url("/#b");
        $url3 = new \moodle_url("/#c");

        $urls = [
            $url1->out() => 'A',
            $url2->out() => 'B',
            $url3->out() => 'C',
        ];
        $urlselect = new url_select(
            $urls,
            null,
            null,
            'someformid',
            null,
        );
        $renderer = $PAGE->get_renderer('core');
        $urlselect->set_option_disabled($url2->out(), true);
        $data = $urlselect->export_for_template($renderer);
        $this->assertFalse($data->options[0]['disabled']);
        $this->assertTrue($data->options[1]['disabled']);
        $urlselect->set_option_disabled($url2->out(), false);
        $data = $urlselect->export_for_template($renderer);
        $this->assertFalse($data->options[0]['disabled']);
        $this->assertFalse($data->options[1]['disabled']);
    }
}
