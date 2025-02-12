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

declare(strict_types=1);

namespace core_reportbuilder\output;

use advanced_testcase;
use core\callback_manager;
use core\callbacks\output\inplace_editable_object;
use core_reportbuilder_generator;
use core_reportbuilder\exception\report_access_exception;
use core_user\reportbuilder\datasource\users;

/**
 * Unit tests for the audience heading editable class
 *
 * @package     core_reportbuilder
 * @copyright   Paul Holden <paulh@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(audience_heading_editable::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(inplace_editable_callback::class)]
final class audience_heading_editable_test extends advanced_testcase {
    /**
     * Test update method
     */
    public function test_update(): void {
        global $PAGE;

        $this->resetAfterTest();
        $this->setAdminUser();

        /** @var core_reportbuilder_generator $generator */
        $generator = $this->getDataGenerator()->get_plugin_generator('core_reportbuilder');

        $report = $generator->create_report(['name' => 'My report', 'source' => users::class]);
        $audience = $generator->create_audience(['reportid' => $report->get('id'), 'configdata' => []]);

        $persistent = $audience->get_persistent();

        $editable = audience_heading_editable::update($persistent->get('id'), 'New name');
        $result = $editable->export_for_template($PAGE->get_renderer('core'));
        $this->assertEquals('New name', $result['value']);

        // Reload persistent, assert update.
        $this->assertEquals('New name', $persistent->read()->get('heading'));
    }

    /**
     * Test update method for a user without permission to edit reports
     */
    public function test_update_access_exception(): void {
        $this->resetAfterTest();

        /** @var core_reportbuilder_generator $generator */
        $generator = $this->getDataGenerator()->get_plugin_generator('core_reportbuilder');

        $report = $generator->create_report(['name' => 'My report', 'source' => users::class]);
        $audience = $generator->create_audience(['reportid' => $report->get('id'), 'configdata' => []]);

        $user = $this->getDataGenerator()->create_user();
        $this->setUser($user);

        $this->expectException(report_access_exception::class);
        $this->expectExceptionMessage('You cannot edit this report');
        audience_heading_editable::update($audience->get_persistent()->get('id'), 'New name');
    }

    /**
     * Test update method via component callback
     */
    public function test_update_callback(): void {
        $this->resetAfterTest();
        $this->setAdminUser();

        /** @var core_reportbuilder_generator $generator */
        $generator = $this->getDataGenerator()->get_plugin_generator('core_reportbuilder');

        $report = $generator->create_report(['name' => 'My report', 'source' => users::class]);
        $audience = $generator->create_audience(['reportid' => $report->get('id'), 'configdata' => []]);

        $persistent = $audience->get_persistent();

        // Ensure that the value is updated.
        $callback = new inplace_editable_object('audienceheading', $persistent->get('id'), 'New name');

        \core\di::get(callback_manager::class)->dispatch('core_reportbuilder', $callback);

        $renderable = $callback->get_renderable();
        $this->assertInstanceOf(audience_heading_editable::class, $renderable);

        // Reload persistent, assert update.
        $this->assertEquals('New name', $persistent->read()->get('heading'));
    }
}
