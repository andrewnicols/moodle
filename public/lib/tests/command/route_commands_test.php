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

namespace core\command;

use PHPUnit\Framework\Attributes\CoversClass;
use Symfony\Component\Console\Command\Command;

/**
 * Tests for the core:route:* commands.
 *
 * @package    core
 * @category   test
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[CoversClass(route_list::class)]
#[CoversClass(route_show::class)]
#[CoversClass(route_cache_clear::class)]
final class route_commands_test extends \advanced_testcase {
    public function test_list(): void {
        $tester = $this->get_testable_command('core:route:list');
        $tester->execute([]);

        $tester->assertCommandIsSuccessful();
        $this->assertStringContainsString('Pattern', $tester->getDisplay());
        $this->assertStringContainsString('route(s) listed.', $tester->getDisplay());
    }

    public function test_list_search(): void {
        $tester = $this->get_testable_command('core:route:list');
        $tester->execute(['search' => 'no-route-will-ever-match-this']);

        $tester->assertCommandIsSuccessful();
        $this->assertStringContainsString('No routes match the given criteria.', $tester->getDisplay());
    }

    public function test_list_search_filters(): void {
        $tester = $this->get_testable_command('core:route:list');
        $tester->execute([]);
        preg_match('/(\d+) route\(s\) listed/', $tester->getDisplay(), $all);

        $tester->execute(['search' => 'GET']);
        $tester->assertCommandIsSuccessful();
        preg_match('/(\d+) route\(s\) listed/', $tester->getDisplay(), $filtered);

        $this->assertLessThanOrEqual((int) $all[1], (int) $filtered[1]);
    }

    public function test_list_verbose_shows_source(): void {
        $tester = $this->get_testable_command('core:route:list');
        $tester->execute([], ['verbosity' => \Symfony\Component\Console\Output\OutputInterface::VERBOSITY_VERBOSE]);

        $tester->assertCommandIsSuccessful();
        $this->assertStringContainsString('Source', $tester->getDisplay());
        $this->assertMatchesRegularExpression('/\.php:\d+/', $tester->getDisplay());

        $tester->execute([]);
        $this->assertStringNotContainsString('Source', $tester->getDisplay());
    }

    public function test_show_not_found(): void {
        $tester = $this->get_testable_command('core:route:show');
        $tester->execute(['uri' => '/no-route-will-ever-match-this']);

        $this->assertEquals(Command::FAILURE, $tester->getStatusCode());
        $this->assertStringContainsString('Route not found', $tester->getDisplay());
    }

    public function test_show_found(): void {
        $tester = $this->get_testable_command('core:route:list');
        $tester->execute([]);
        // Pick the first route without any placeholders from the table so that it can be resolved.
        $this->assertEquals(1, preg_match('/^\|\s+(\/[^\s{|]*)\s+\|\s+GET\b/m', $tester->getDisplay(), $matches));

        $tester = $this->get_testable_command('core:route:show');
        $tester->execute(['uri' => $matches[1]]);

        $tester->assertCommandIsSuccessful();
        $this->assertStringContainsString('Route callable', $tester->getDisplay());
        $this->assertMatchesRegularExpression('/Route source\s+: .+\.php:\d+/', $tester->getDisplay());
    }

    public function test_cache_clear(): void {
        $this->resetAfterTest();

        $tester = $this->get_testable_command('core:route:cache:clear');
        $tester->execute([]);

        $tester->assertCommandIsSuccessful();
        $this->assertStringContainsString('Route cache cleared.', $tester->getDisplay());
    }
}
