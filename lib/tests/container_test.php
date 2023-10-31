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

namespace core;

use PHPUnit\Framework\MockObject\Stub;
use Psr\Container\ContainerInterface;

/**
 * Tests for Moodle's Container.
 *
 * @package   core
 * @copyright 2923 Andrew Nicols <andrew@nicols.co.uk>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers    \core\container
 */
class container_test extends \advanced_testcase {
    /**
     * Test that the get_container method returns the Container Instance and stores it statically.
     */
    public function test_get_container(): void {
        $container = \core\container::get_container();
        $this->assertInstanceOf(ContainerInterface::class, $container);

        $this->assertTrue($container === \core\container::get_container());
    }

    /**
     * Test that the reset_container method resets the container such that a different instance is returned.
     */
    public function test_reset_container(): void {
        $instance = \core\container::get_container();
        $this->assertInstanceOf(ContainerInterface::class, $instance);

        \core\container::reset_container();
        $this->assertFalse($instance === \core\container::get_container());
    }

    /**
     * This test just ensures that a container can return an autowired client.
     *
     * This is standard behaviour for a Container, but we want to actually check it.
     */
    public function test_autowired_client(): void {
        $container = \core\container::get_container();
        $client = $container->get(http_client::class);

        $this->assertInstanceOf(http_client::class, $client);

        // Fetching the same again.
        $this->assertEquals(
            $client,
            $container->get(http_client::class),
        );
    }

    /**
     * Test that we can mock a client and set it in the container for other consumers to get.
     */
    public function test_mocked_client(): void {
        $container = \core\container::get_container();

        // Create a mocked http_client.
        $mockedclient = $this->createStub(http_client::class);

        // Set it in the container.
        $container->set(http_client::class, $mockedclient);

        // Fetching it out will give us the same mocked client.
        $client = $container->get(http_client::class);
        $this->assertEquals(
            $mockedclient,
            $client,
        );

        // And the returned client will of course still be an http_client and a Stub.
        $this->assertInstanceOf(http_client::class, $client);
        $this->assertInstanceOf(Stub::class, $client);

        // Even after getting a new container instance.
        $this->assertEquals(
            \core\container::get_container()->get(http_client::class),
            $client,
        );

        // Resetting the container will give us a new, unmocked, instance.
        \core\container::reset_container();

        $client = \core\container::get_container()->get(http_client::class);
        $this->assertInstanceOf(http_client::class, $client);
        $this->assertNotInstanceOf(Stub::class, $client);
        $this->assertNotEquals(
            $mockedclient,
            $client,
        );
    }

    /**
     * Test that a mocked client can be set in one test, but is not preserved across tests.
     *
     * @return Stub The mocked client to pass to the dependant test
     */
    public function test_mocked_client_test_one(): Stub {
        \core\container::get_container()
            ->set(http_client::class, $this->createStub(http_client::class));

        $mockedclient = \core\container::get_container()->get(http_client::class);
        $this->assertInstanceOf(http_client::class, $mockedclient);
        $this->assertInstanceOf(Stub::class, $mockedclient);

        return $mockedclient;
    }

    /**
     * Test that a client mocked in a previous test does not bleed.
     *
     * @depends test_mocked_client_test_one
     */
    public function test_mocked_client_test_two(Stub $mockedclient): void {
        $client = \core\container::get_container()->get(http_client::class);
        $this->assertInstanceOf(http_client::class, $client);
        $this->assertNotInstanceOf(Stub::class, $client);
        $this->assertNotEquals($mockedclient, $client);
    }

    /**
     * Test that the container will return the $DB global as a moodle_database instance.
     */
    public function test_fetch_moodle_database(): void {
        global $DB;

        $this->assertEquals($DB, \core\container::get(\moodle_database::class));
    }

    /**
     * Test that the hook manager is in the container.
     */
    public function test_fetch_hook_manager(): void {
        $manager = container::get(hook\manager::class);
        $this->assertEquals($manager, hook\manager::get_instance());
    }

    public function test_fetch_string_manager(): void {
        $stringmanager = container::get(\core_string_manager::class);
        $this->assertEquals(
            get_string_manager(),
            $stringmanager,
        );
    }
}
