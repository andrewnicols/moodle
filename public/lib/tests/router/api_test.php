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

/**
 * Tests which cover all API routes.
 *
 * @package    core
 * @category   test
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversNothing]
final class api_test extends \core\tests\router\route_testcase {
    /**
     * Test that every routed API endpoint declares the scopes it requires.
     *
     * @param string $classname
     * @param string $methodname
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('api_route_provider')]
    public function test_api_route_declares_scopes(string $classname, string $methodname): void {
        $this->assert_route_is_scoped([$classname, $methodname]);
    }

    /**
     * Test that the routed API endpoints are discovered at all.
     *
     * PHPUnit treats an empty data provider as a warning rather than a failure, so without this
     * the check above would silently cover nothing if the namespace it scans ever moved.
     */
    public function test_api_routes_are_discovered(): void {
        $generator = static::api_route_provider();
        $datasets = iterator_to_array($generator);

        $this->assertNotEmpty($datasets, 'The data provider yielded no data.');
        $this->assertGreaterThan(0, count($datasets));
    }

    /**
     * Data provider returning every route in the route\api namespace.
     *
     * @return \Generator
     */
    public static function api_route_provider(): \Generator {
        $classes = \core_component::get_component_classes_in_namespace(namespace: 'route\api');
        foreach (array_keys($classes) as $classname) {
            $classinfo = new \ReflectionClass($classname);
            $classattributes = $classinfo->getAttributes(route::class);

            foreach ($classinfo->getMethods(\ReflectionMethod::IS_PUBLIC) as $methodinfo) {
                $attributes = $methodinfo->getAttributes(route::class, \ReflectionAttribute::IS_INSTANCEOF);
                if (empty($attributes)) {
                    // No route attribute - no scopes expected.
                    continue;
                }

                yield "{$classname}::{$methodinfo->getName()}" => [$classname, $methodinfo->getName()];
            }
        }
    }
}
