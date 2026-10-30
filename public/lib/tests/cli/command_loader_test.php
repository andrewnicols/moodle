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

namespace core\cli;

use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Component\Console\Command\LazyCommand;

/**
 * Tests for the command loader.
 *
 * @package    core
 * @category   test
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(command_loader::class)]
final class command_loader_test extends \advanced_testcase {
    public function test_commands_with_attribute_are_lazy(): void {
        $loader = \core\di::get(command_loader::class);

        $command = $loader->get('admin:cron');
        $this->assertInstanceOf(LazyCommand::class, $command);
        $this->assertEquals('admin:cron', $command->getName());
        $this->assertNotEmpty($command->getDescription());
    }
}
