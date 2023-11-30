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
use core\router\schema\parameters\path_parameter;
use core\router\schema\response\response;
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

    /**
     * @dataProvider add_path_provider
     */
    public function test_add_path(
        string $component,
        string $path,
        string $expectedpath,
    ): void {
        $spec = new specification();

        $spec->add_path(
            $component,
            [],
            new route(
                path: $path,
            ),
        );

        $schema = $spec->get_schema();
        $this->assertObjectHasAttribute($expectedpath, $schema->paths);
    }

    public static function add_path_provider(): array {
        return [
            'Core' => [
                'core',
                '/example/path',
                '/core/example/path',
            ],
            'Core Subsystem' => [
                'core_access',
                '/example/path',
                '/access/example/path',
            ],
            'An activity' => [
                'mod_assign',
                '/example/path',
                '/mod_assign/example/path',
            ],
        ];
    }

    public function test_add_path_with_option(): void {
        $spec = new specification();

        $spec->add_path(
            'core',
            [],
            new route(
                path: '/example/path/with[/{option}]',
                pathtypes: [
                    new path_parameter(name: 'option', type: param::INT),
                ],
            ),
        );

        $schema = $spec->get_schema();
        $this->assertObjectHasAttribute('/core/example/path/with', $schema->paths);
        $this->assertObjectHasAttribute('/core/example/path/with/{option}', $schema->paths);
    }

    public function test_add_path_with_options(): void {
        $spec = new specification();

        $spec->add_path(
            'core',
            [],
            new route(
                path: '/example/path/with[/{optional}][/{extras}]',
                pathtypes: [
                    new path_parameter(name: 'optional', type: param::INT),
                    new path_parameter(name: 'extras', type: param::INT),
                ],
            ),
        );

        $schema = $spec->get_schema();
        $this->assertObjectHasAttribute('/core/example/path/with', $schema->paths);
        $this->assertObjectHasAttribute('/core/example/path/with/{optional}', $schema->paths);
        $this->assertObjectHasAttribute('/core/example/path/with/{optional}/{extras}', $schema->paths);
    }

    public function test_add_parameter(): void {
        $spec = new specification();

        /** @var path_parameter&\PHPUnit\Framework\MockObject\MockObject */
        $child = $this->getMockBuilder(path_parameter::class)
            ->onlyMethods([])
            ->setConstructorArgs([
                'name' => 'example',
                'type' => param::INT,
            ])
            ->getMock();

        $this->assertFalse($spec->is_reference_defined($child->get_reference(true)));

        $spec->add_component($child);

        $schema = $spec->get_schema();
        $this->assertObjectHasAttribute($child->get_reference(false), $schema->components->parameters);
        $this->assertTrue($spec->is_reference_defined($child->get_reference(true)));
    }

    public function test_add_header(): void {
        $spec = new specification();

        /** @var header_object&\PHPUnit\Framework\MockObject\MockObject */
        $child = $this->getMockBuilder(header_object::class)
            ->onlyMethods([])
            ->setConstructorArgs([
                'name' => 'example',
                'type' => param::INT,
            ])
            ->getMock();

        $this->assertFalse($spec->is_reference_defined($child->get_reference(true)));

        $spec->add_component($child);

        $schema = $spec->get_schema();
        $this->assertObjectHasAttribute($child->get_reference(false), $schema->components->headers);
        $this->assertTrue($spec->is_reference_defined($child->get_reference(true)));
    }

    public function test_add_response(): void {
        $spec = new specification();

        /** @var response&\PHPUnit\Framework\MockObject\MockObject */
        $child = $this->getMockBuilder(response::class)
            ->onlyMethods([])
            ->setConstructorArgs([
            ])
            ->getMock();

        $this->assertFalse($spec->is_reference_defined($child->get_reference(true)));

        $spec->add_component($child);

        $schema = $spec->get_schema();
        $this->assertObjectHasAttribute($child->get_reference(false), $schema->components->responses);
        $this->assertTrue($spec->is_reference_defined($child->get_reference(true)));
    }

    public function test_add_example(): void {
        $spec = new specification();

        /** @var example&\PHPUnit\Framework\MockObject\MockObject */
        $child = $this->getMockBuilder(example::class)
            ->onlyMethods([])
            ->setConstructorArgs([
                'name' => 'An excellent example',
            ])
            ->getMock();
        $this->assertFalse($spec->is_reference_defined($child->get_reference(true)));

        $spec->add_component($child);

        $schema = $spec->get_schema();
        $this->assertObjectHasAttribute($child->get_reference(false), $schema->components->examples);
        $this->assertTrue($spec->is_reference_defined($child->get_reference(true)));
    }

    public function test_add_request_body(): void {
        $spec = new specification();

        /** @var request_body&\PHPUnit\Framework\MockObject\MockObject */
        $child = $this->getMockBuilder(request_body::class)
            ->onlyMethods([])
            ->setConstructorArgs([])
            ->getMock();

        $this->assertFalse($spec->is_reference_defined($child->get_reference(true)));

        $spec->add_component($child);

        $schema = $spec->get_schema();
        $this->assertObjectHasAttribute($child->get_reference(false), $schema->components->requestBodies);

        $this->assertTrue($spec->is_reference_defined($child->get_reference(true)));
    }

    public function test_is_reference_defined(): void {
        $spec = new specification();
        $this->assertFalse($spec->is_reference_defined('example'));
        $this->assertFalse($spec->is_reference_defined('#/components/fake/component'));
    }
}
