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

namespace core\router\schema\objects;

use core\router\schema\referenced_object;
use core\router\schema\specification;

/**
 * Tests for the an array of other objects.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers     \core\router\schema\objects\array_of_things
 * @covers     \core\router\schema\objects\type_base
 * @covers     \core\router\schema\openapi_base
 */
class array_of_things_test extends \route_testcase {
    public function test_referenced_object(): void {
        $object = new class(
            thingtype: 'integer',
            content: [
                'example' => new schema_object(content: []),
            ],
        ) extends array_of_things implements referenced_object {
        };

        $schema = $object->get_openapi_description(new specification());
        $this->assertObjectNotHasAttribute('$ref', $schema);
        $this->assertObjectHasAttribute('type', $schema);
        $this->assertEquals('object', $schema->type);
        $this->assertObjectNotHasAttribute('properties', $schema);
        $this->assertObjectHasAttribute('additionalProperties', $schema);
        $this->assertArrayHasKey('type', $schema->additionalProperties);
        $this->assertEquals('integer', $schema->additionalProperties['type']);

        $reference = $object->get_openapi_schema(new specification());
        $this->assertObjectNotHasAttribute('type', $reference);
        $this->assertObjectHasAttribute('$ref', $reference);
    }

    public function test_basics(): void {
        $object = new array_of_things(
            thingtype: 'integer',
        );

        $schema = $object->get_openapi_description(new specification());
        $this->assertEquals((object) [
            'type' => 'object',
            'additionalProperties' => [
                'type' => 'integer',
            ],
        ], $schema);
    }
}
