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
use core\router\schema\response\content\json_media_type;
use core\router\schema\response\content\payload_response_type;
use core\router\schema\specification;
use GuzzleHttp\Psr7\ServerRequest;

/**
 * Tests for the request_body object.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers     \core\router\schema\request_body
 * @covers     \core\router\schema\openapi_base
 */
class request_body_test extends \route_testcase {
    public function test_basics(): void {
        $object = new request_body();

        $schema = $object->get_openapi_description(new specification());
        $this->assertEquals((object) [
            'description' => '',
            'required' => false,
            'content' => [],
        ], $schema);
        $this->assertFalse($schema->required);
    }

    public function test_content_is_required(): void {
        $object = new request_body(
            content: [
                new json_media_type(content: []),
            ],
            required: false,
        );

        $schema = $object->get_openapi_schema(new specification());
        $this->assertTrue($schema->required);
    }

    public function test_content_wrong_type(): void {
        $this->expectException(\coding_exception::class);
        new request_body(
            content: [new schema_object(content: [])],
        );
    }

    public function test_content_array(): void {
        $object = new request_body(
            content: [
                new json_media_type(content: []),
            ],
        );

        $schema = $object->get_openapi_schema(new specification());
        $this->assertObjectHasAttribute('content', $schema);
        $this->assertObjectHasAttribute('application/json', (object) $schema->content);
        $this->assertTrue($schema->required);

        $request = new ServerRequest('GET', 'http://example.com', [
            'Content-Type' => json_media_type::get_encoding(),
        ]);
        $body = $object->get_body_for_request($request);
        $this->assertInstanceOf(json_media_type::class, $body);
    }

    public function test_content_not_matching(): void {
        $object = new request_body(
            content: [
                new json_media_type(content: []),
            ],
        );
        $this->expectException(\invalid_parameter_exception::class);
        $object->get_body_for_request(new ServerRequest('GET', 'http://example.com'));
    }

    public function test_content_payload_type(): void {
        $content = new payload_response_type(content: []);
        $object = new request_body(
            content: $content,
        );

        $schema = $object->get_openapi_schema(new specification());
        $this->assertObjectHasAttribute('content', $schema);

        foreach ($content->get_supported_content_types() as $contenttypeclass) {
            $encoding = $contenttypeclass::get_encoding();
            $this->assertObjectHasAttribute($encoding, $schema->content);
            $this->assertObjectNotHasAttribute('$ref', $schema->content->{$encoding});

            $request = new ServerRequest('GET', 'http://example.com', [
                'Content-Type' => $encoding,
            ]);
            $body = $object->get_body_for_request($request);
            $this->assertInstanceOf($contenttypeclass, $body);
        }

        $this->assertTrue($schema->required);
    }

    /**
     * @covers \core\router\schema\openapi_base
     */
    public function test_referenced_object(): void {
        $object = new class extends request_body implements referenced_object {
        };

        // Note: The status code is not in the OpenAPI schema, but in the parent.
        $schema = $object->get_openapi_description(new specification());
        $this->assertObjectNotHasAttribute('$ref', $schema);
        $this->assertObjectHasAttribute('description', $schema);

        $reference = $object->get_openapi_schema(new specification());
        $this->assertObjectNotHasAttribute('description', $reference);
        $this->assertObjectHasAttribute('$ref', $reference);
    }

    public function test_reference_content(): void {
        $object = new request_body(
            content: [],
        );
        $object = new class extends request_body implements referenced_object {
        };

        $schema = $object->get_openapi_schema(new specification());
        $this->assertObjectNotHasAttribute('content', $schema);
    }
}
