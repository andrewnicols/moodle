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
 * Tests for the single_button class.
 *
 * @package    core
 * @category   test
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(single_button::class)]
final class single_button_test extends \advanced_testcase {
    /**
     * Test for checking the template context data for the single_select element.
     */
    public function test_single_button(): void {
        global $PAGE;
        $url = new \moodle_url('/');
        $realname = 'realname';
        $attributes = [
            'data-dummy' => 'dummy',
        ];
        $singlebutton = new single_button($url, $realname, 'post', single_button::BUTTON_SECONDARY, $attributes);
        $renderer = $PAGE->get_renderer('core');
        $data = $singlebutton->export_for_template($renderer);

        $this->assertEquals($realname, $data->label);
        $this->assertEquals('post', $data->method);
        $this->assertEquals('singlebutton', $data->classes);
        $this->assertEquals('secondary', $data->type);
        $this->assertEquals($attributes['data-dummy'], $data->attributes[0]['value']);

        $singlebutton = new single_button($url, $realname, 'post', single_button::BUTTON_PRIMARY, $attributes);
        $renderer = $PAGE->get_renderer('core');
        $data = $singlebutton->export_for_template($renderer);

        $this->assertEquals($realname, $data->label);
        $this->assertEquals('post', $data->method);
        $this->assertEquals('singlebutton', $data->classes);
        $this->assertEquals('primary', $data->type);
        $this->assertEquals($attributes['data-dummy'], $data->attributes[0]['value']);
    }
}
