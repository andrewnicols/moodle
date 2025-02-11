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

use core\callbacks\abstract_callback_object;
use core\callbacks\callback_interface;
use core\callbacks\must_exist_interface;
use core\callbacks\replaces_legacy_callback_interface;
use core\exception\coding_exception;

/**
 * Tests for the callback_manager class and related classes.
 *
 * @package    core
 * @category   test
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(callback_manager::class)]
final class callback_manager_test extends \advanced_testcase {
    #[\PHPUnit\Framework\Attributes\DataProvider('valid_interface_names')]
    public function test_get_class_instance_for_interface_name(
        string $interface,
        string $expected
    ): void {
        $this->assertEquals($expected, di::get(callback_manager::class)->get_class_name_for_interface_name('mod_example', $interface));
    }

    public static function valid_interface_names(): \Iterator {
        yield [
            'interface' => \core\callbacks\output\inplace_editable_interface::class,
            'expected' => '\mod_example\callbacks\output\inplace_editable_callback',
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('invalid_interface_names')]
    public function test_get_class_instance_for_interface_name_invalid(
        string $interface,
        string $expectedmessage,
    ): void {
        $this->expectException(\core\exception\coding_exception::class);
        $this->expectExceptionMessageMatches($expectedmessage);
        di::get(callback_manager::class)->get_class_name_for_interface_name('mod_example', $interface);
    }

    public static function invalid_interface_names(): \Iterator {
        yield 'Not in callbacks namespace' => [
            \core\output\inplace_editable::class,
            "/not in the callback namespace/",
        ];
        yield 'Too many namespace depths' => [
            \core\callbacks\output\form\inplace_editable::class,
            "/It should contain a valid Level 2 namespace and a name/",
        ];
        yield 'Not a valid API' => [
            \core\callbacks\notvalid\inplace_editable::class,
            "/The L3 namespace must be a valid API/",
        ];
        yield 'Interface does not suffix in _interface' => [
            \core\callbacks\output\inplace_editable::class,
            "/The name must end with '_interface'/",
        ];
    }

    public function test_dispatch_not_implemented_not_required(): void {
        $callback = $this->getMockBuilder(\core\callbacks\abstract_callback_object::class)
            ->getMock();
        $callback->method('get_implementing_interface_names')
            ->willReturn([\core\callbacks\output\fake_interface::class]);

        $this->assertFalse(di::get(callback_manager::class)->dispatch('mod_example', $callback));
    }

    public function test_dispatch_not_implemented_required(): void {
        $callback = new class () extends abstract_callback_object implements must_exist_interface {
            #[\Override]
            public function get_implementing_interface_names(): array {
                return [\core\callbacks\output\fake_interface::class];
            }
        };

        $this->expectException(coding_exception::class);
        di::get(callback_manager::class)->dispatch('mod_example', $callback);
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('get_interface_names')]
    public function test_dispatch_not_implemented_required_but_has_legacy(array $interfaces): void {
        $callback = new class ($interfaces) extends abstract_callback_object implements
            must_exist_interface,
            replaces_legacy_callback_interface
        {
            public function __construct(
                private array $interfaces,
            ) {
            }

            #[\Override]
            public function get_implementing_interface_names(): array {
                return $this->interfaces;
            }

            #[\Override]
            public function call_legacy_callback(
                string $component,
            ): bool {
                // Returns true when the legacy callback was able to be called.
                return true;
            }
        };

        $this->assertTrue(di::get(callback_manager::class)->dispatch('mod_example', $callback));
        $this->assertDebuggingCalled();
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('get_interface_names')]
    public function test_dispatch_not_implemented_required_supports_legacy_not_found(array $interfaces): void {
        $callback = new class ($interfaces) extends abstract_callback_object implements
            must_exist_interface,
            replaces_legacy_callback_interface
        {
            public function __construct(
                private array $interfaces,
            ) {
            }

            #[\Override]
            public function get_implementing_interface_names(): array {
                return $this->interfaces;
            }

            #[\Override]
            public function call_legacy_callback(
                string $component,
            ): bool {
                // Returns true when the legacy callback was able to be called.
                return false;
            }
        };

        $this->expectException(coding_exception::class);
        di::get(callback_manager::class)->dispatch('mod_example', $callback);
    }

    public function test_dispatch_implemented(): void {
        $this->load_fixture('core', 'callbacks/implemented_interface.php');
        $this->load_fixture('core', 'callbacks/implemented_callback.php');

        $callback = $this->getMockBuilder(\core\tests\fixtures\callbacks\implemented_callback::class)->getMock();

        $callback->method('get_implementing_interface_names')
            ->willReturn([\mod_example\callbacks\output\implemented_interface::class]);
        $callback->method('get_executor_name')->willReturn('')
            ->willReturn('execute');

        $manager = $this->getMockBuilder(callback_manager::class)
            ->onlyMethods(['get_class_instance_for_interface_name'])
            ->getMock();

        $manager->method('get_class_instance_for_interface_name')
            ->willReturn(new class () implements callback_interface {
                public function execute(abstract_callback_object $callback): void {
                    $callback->execute();
                }
            });

        // The method should be called only once.
        $callback->expects($this->once())
            ->method('execute');

        $this->assertTrue($manager->dispatch('mod_example', $callback));
    }

    public function test_dispatch_implemented_newer_interface_available(): void {
        $this->load_fixture('core', 'callbacks/implemented_interface.php');
        $this->load_fixture('core', 'callbacks/implemented_callback.php');

        $callback = $this->getMockBuilder(\core\tests\fixtures\callbacks\implemented_callback::class)->getMock();
        $callback->method('get_implementing_interface_names')
            ->willReturn([
                \core\callbacks\output\newer_fake_interface::class,
                \mod_example\callbacks\output\implemented_interface::class,
            ]);
        $callback->method('get_executor_name')->willReturn('')
            ->willReturn('execute');
        \core\di::set(\core\tests\fixtures\callbacks\implemented_callback::class, $callback);

        $manager = $this->getMockBuilder(callback_manager::class)
            ->onlyMethods(['get_class_name_for_interface_name'])
            ->getMock();

        $manager->method('get_class_name_for_interface_name')
            ->willReturn(
                \core\tests\fixtures\callbacks\not_implemented_callback::class,
                \core\tests\fixtures\callbacks\implemented_callback::class,
            );

        // The method should be called only once.
        $callback->expects($this->once())
            ->method('execute');

        $this->assertTrue($manager->dispatch('mod_example', $callback));
        $this->assertDebuggingCalled();
    }

    public static function get_interface_names(): \Iterator {
        yield 'Single interface' => [[\core\callbacks\output\fake_interface::class]];
        yield 'Multiple interface' => [[
            \core\callbacks\output\fake_interface::class,
            \core\callbacks\output\another_fake_interface::class,
        ]];
    }
}
