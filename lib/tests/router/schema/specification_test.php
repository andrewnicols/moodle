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

namespace core\router\schema;

use core\param;
use core\router\route;
use core\router\schema\objects\array_of_strings;
use core\router\schema\objects\schema_object;
use core\router\schema\specification;

/**
 * Tests for the specification.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers     \core\router\schema\specification
 */
class specification_test extends \route_testcase {
    public function test_basics(): void {
        global $CFG;

        $spec = new specification();
        $schema = $spec->get_schema();

        $this->assertIsObject($schema);

        // We comply with OpenAPI 3.1.0.
        $this->assertObjectHasAttribute('openapi', $schema);
        $this->assertEquals('3.1.0', $schema->openapi);

        // INfo should include our license.
        $this->assertObjectHasAttribute('info', $schema);
        $this->assertObjectHasAttribute('license', $schema->info);
        $this->assertStringContainsString('GNU GPL v3 or later', $schema->info->license->name);
        $this->assertObjectHasAttribute('url', $schema->info->license);

        // The server list should contain the currenet URI during finalisation.
        $this->assertObjectHasAttribute('servers', $schema);
        $this->assertIsArray($schema->servers);
        $this->assertCount(1, $schema->servers);
        $server = $schema->servers[0];
        $this->assertStringStartsWith($CFG->wwwroot, $server->url);

        $this->assertObjectHasAttribute('paths', $schema);
        $this->assertObjectHasAttribute('components', $schema);
        $this->assertObjectHasAttribute('security', $schema);
        $this->assertObjectHasAttribute('externalDocs', $schema);

        // Calculated parameters should only be set once.
        $schema = $spec->get_schema();
        $this->assertCount(1, $schema->servers);

        $this->assertJson(json_encode($spec));
    }
}
