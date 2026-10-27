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

namespace core\router;

use core\exception\invalid_parameter_exception;
use core\router\parameters\query_page;
use core\router\parameters\query_pagesize;
use core\router\parameters\query_sort;
use core\router\schema\collection;
use core\router\schema\response\collection_response;
use core\tests\router\route_testcase;
use GuzzleHttp\Psr7\ServerRequest;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;

/**
 * Tests for collection (pagination) support on routes.
 *
 * @package    core
 * @category   test
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(collection::class)]
#[CoversClass(pagination_request::class)]
#[CoversClass(collection_response::class)]
#[CoversClass(\core\router\schema\objects\collection_object::class)]
#[CoversClass(\core\router\schema\objects\array_of_items::class)]
#[CoversClass(query_page::class)]
#[CoversClass(query_pagesize::class)]
#[CoversClass(query_sort::class)]
final class collection_test extends route_testcase {
    /**
     * Run all of the collection parameters over a query string, as the request validator does.
     *
     * @param collection $collection
     * @param array $query
     * @return ServerRequest
     */
    private function validate(collection $collection, array $query): ServerRequest {
        $request = (new ServerRequest('GET', '/users'))->withQueryParams($query);
        foreach ($collection->get_query_parameters() as $parameter) {
            $request = $parameter->validate($request, $request->getQueryParams());
        }

        return $request;
    }

    public function test_route_without_collection_has_no_pagination_parameters(): void {
        $route = new route(path: '/users');
        $this->assertNull($route->collection);
        $this->assertEmpty($route->get_query_parameters());
    }

    /**
     * Create a route from the first method of an anonymous class with the given attributes.
     *
     * @param object $handler
     * @return route
     */
    private function route_from_handler(object $handler): route {
        $classinfo = new \ReflectionClass($handler);
        return route::from_reflection($classinfo, $classinfo->getMethod('handle'));
    }

    public function test_route_collection_attribute_uses_defaults(): void {
        $route = $this->route_from_handler(new class {
            #[route(path: '/users')]
            #[collection]
            public function handle(): void {
            }
        });

        $this->assertInstanceOf(collection::class, $route->collection);
        $this->assertEquals(['page', 'pagesize'], array_keys($route->get_query_parameters()));
    }

    public function test_route_collection_attribute_options(): void {
        $route = $this->route_from_handler(new class {
            #[route(path: '/users')]
            #[collection(pagesize: 10, maxpagesize: 50, sortable: ['username'])]
            public function handle(): void {
            }
        });

        $this->assertEquals(10, $route->collection->pagesize);
        $this->assertEquals(50, $route->collection->maxpagesize);
        $this->assertEquals(['page', 'pagesize', 'sort'], array_keys($route->get_query_parameters()));
    }

    public function test_route_without_collection_attribute(): void {
        $route = $this->route_from_handler(new class {
            #[route(path: '/users')]
            public function handle(): void {
            }
        });

        $this->assertNull($route->collection);
    }

    public function test_route_from_reflection_without_route(): void {
        $classinfo = new \ReflectionClass(new class {
            #[collection]
            public function handle(): void {
            }
        });

        $this->assertNull(route::from_reflection($classinfo, $classinfo->getMethod('handle')));
    }

    public function test_route_from_reflection_with_parent(): void {
        $handler = new #[route(path: '/parent')] class {
            #[route(path: '/users')]
            #[collection]
            public function handle(): void {
            }
        };

        $route = $this->route_from_handler($handler);
        $this->assertEquals('/parent/users', $route->get_path());
        $this->assertNotNull($route->collection);
    }

    public function test_route_collection_attribute_invalid_options(): void {
        $this->expectException(\core\exception\coding_exception::class);
        $this->route_from_handler(new class {
            #[route(path: '/users')]
            #[collection(pagesize: 200, maxpagesize: 100)]
            public function handle(): void {
            }
        });
    }

    public function test_route_set_collection(): void {
        $route = (new route(path: '/users'))->set_collection(new collection(sortable: ['username']));
        $this->assertEquals(['page', 'pagesize', 'sort'], array_keys($route->get_query_parameters()));
    }

    public function test_route_collection_overrides_query_params(): void {
        $custom = new query_page(default: 3);
        $route = (new route(path: '/users', queryparams: [$custom]))->set_collection(new collection());

        $this->assertNotSame($custom, $route->get_query_parameters()['page']);
        $this->assertEquals(['page', 'pagesize'], array_keys($route->get_query_parameters()));
    }

    public function test_route_query_params_kept_when_no_collection(): void {
        $custom = new query_page(default: 3);
        $route = new route(path: '/users', queryparams: [$custom]);

        $this->assertSame($custom, $route->get_query_parameters()['page']);
    }

    public function test_collection_invalid_sizes(): void {
        $this->expectException(\core\exception\coding_exception::class);
        new collection(pagesize: 200, maxpagesize: 100);
    }

    public function test_defaults(): void {
        $request = $this->validate(new collection(sortable: ['username']), []);
        $pagination = pagination_request::from_request($request);

        $this->assertEquals(1, $pagination->page);
        $this->assertEquals(25, $pagination->pagesize);
        $this->assertEquals([], $pagination->sort);
        $this->assertEquals(0, $pagination->get_offset());
        $this->assertEquals(25, $pagination->get_limit());
    }

    public function test_custom_defaults(): void {
        $request = $this->validate(new collection(pagesize: 10, maxpagesize: 50), []);
        $this->assertEquals(10, pagination_request::from_request($request)->pagesize);
    }

    public function test_offset(): void {
        $request = $this->validate(new collection(), ['page' => '3', 'pagesize' => '20']);
        $pagination = pagination_request::from_request($request);

        $this->assertEquals(40, $pagination->get_offset());
        $this->assertEquals(20, $pagination->get_limit());
    }

    public function test_sort(): void {
        $request = $this->validate(
            new collection(sortable: ['username', 'timecreated', 'lastname']),
            ['sort' => 'timecreated,-lastname'],
        );
        $pagination = pagination_request::from_request($request);

        $this->assertSame(['timecreated' => false, 'lastname' => true], $pagination->sort);
        $this->assertEquals(
            'u.timecreated ASC, u.lastname DESC',
            $pagination->get_order_by([
                'timecreated' => 'u.timecreated',
                'lastname' => 'u.lastname',
                'username' => 'u.username',
            ]),
        );
        $this->assertEquals('', $pagination->get_order_by([]));
    }

    #[DataProvider('invalid_query_provider')]
    public function test_invalid_query(array $query): void {
        $this->expectException(invalid_parameter_exception::class);
        $this->validate(new collection(sortable: ['username']), $query);
    }

    public static function invalid_query_provider(): \Generator {
        yield 'page zero' => [['page' => '0']];
        yield 'page negative' => [['page' => '-1']];
        yield 'page not a number' => [['page' => 'abc']];
        yield 'pagesize zero' => [['pagesize' => '0']];
        yield 'pagesize too large' => [['pagesize' => '101']];
        yield 'unknown sort field' => [['sort' => 'password']];
        yield 'one unknown sort field' => [['sort' => 'username,password']];
        yield 'double descending' => [['sort' => '--username']];
    }

    public function test_openapi_schema(): void {
        $parameters = (new collection(pagesize: 10, maxpagesize: 50, sortable: ['username']))->get_query_parameters();

        $page = $parameters['page']->get_schema_from_type(\core\param::INT);
        $this->assertEquals(1, $page->minimum);

        $pagesize = $parameters['pagesize']->get_schema_from_type(\core\param::INT);
        $this->assertEquals(50, $pagesize->maximum);
        $this->assertEquals(10, $pagesize->default);

        $sort = $parameters['sort']->get_schema_from_type(\core\param::RAW);
        $this->assertMatchesRegularExpression('/' . str_replace('/', '\/', $sort->pattern) . '/', '-username');
    }

    public function test_collection_response(): void {
        $request = $this->validate(new collection(), ['page' => '2', 'pagesize' => '2']);
        $response = new collection_response([['id' => 3], ['id' => 4]], null, true, $request);

        $this->assertSame(
            [
                'items' => [['id' => 3], ['id' => 4]],
                'pagination' => ['page' => 2, 'pageSize' => 2, 'totalItems' => null, 'hasMore' => true],
            ],
            $response->payload,
        );
    }

    public function test_collection_object_openapi_schema(): void {
        $schema = new \core\router\schema\objects\collection_object(
            new \core\router\schema\objects\schema_object([
                'id' => new \core\router\schema\objects\scalar_type(\core\param::INT),
            ]),
        );
        $api = $this->createMock(\core\router\schema\specification::class);
        $description = $schema->get_openapi_description($api);

        $this->assertEquals('object', $description->type);
        $this->assertEquals('array', $description->properties->items->type);
        $this->assertEquals('integer', $description->properties->items->items->properties->id->type);
        $this->assertEquals(['integer', 'null'], $description->properties->pagination->properties->totalItems->type);
        $this->assertEquals('boolean', $description->properties->pagination->properties->hasMore->type);

        $response = new collection_response([['id' => 3]], 8, false, $this->validate(new collection(), []));
        $this->assertSame(8, $response->payload['pagination']['totalItems']);
        $this->assertFalse($response->payload['pagination']['hasMore']);
    }
}
