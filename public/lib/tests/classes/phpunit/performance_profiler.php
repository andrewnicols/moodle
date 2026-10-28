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

namespace core\tests\phpunit;

use PHPUnit\Event\Test\PreparationStarted;
use PHPUnit\Event\Test\PreparationStartedSubscriber;
use PHPUnit\Event\Test\Finished;
use PHPUnit\Event\Test\Prepared;

/**
 * Collects opt-in timings for PHPUnit tests and Moodle's reset operations.
 *
 * @package    core
 * @copyright  2026 Moodle Pty Ltd <support@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class performance_profiler implements PreparationStartedSubscriber {
    /** @var ?string Output file path. */
    private static ?string $outputfile = null;

    /** @var int Profile start time in nanoseconds. */
    private static int $starttime;

    /** @var array<string, array{started: int, prepared: ?int}> */
    private static array $teststarts = [];

    /** @var array<string, array{count: int, total: float, minimum: float, maximum: float, phase: string, context: array}> */
    private static array $metrics = [];

    /** @var int Number of finished tests. */
    private static int $testcount = 0;

    /** @var float Sum of test wall times in seconds. */
    private static float $testtotaltime = 0;

    /** @var list<array{test: string, setup_seconds: float, execution_and_teardown_seconds: float, total_seconds: float}> */
    private static array $slowtests = [];

    /**
     * Enable profiling and register shutdown output.
     *
     * @param string $outputfile
     */
    public static function enable(string $outputfile): void {
        self::$outputfile = $outputfile;
        self::$starttime = hrtime(true);
        register_shutdown_function([self::class, 'write_report']);
    }

    /**
     * Whether profiling is enabled.
     *
     * @return bool
     */
    public static function is_enabled(): bool {
        return self::$outputfile !== null;
    }

    /**
     * Record a timed Moodle operation.
     *
     * @param string $phase
     * @param float $seconds
     * @param array $context
     */
    public static function record_metric(string $phase, float $seconds, array $context = []): void {
        $key = json_encode([$phase, $context], JSON_THROW_ON_ERROR);
        if (!isset(self::$metrics[$key])) {
            self::$metrics[$key] = [
                'count' => 0,
                'total' => 0,
                'minimum' => $seconds,
                'maximum' => $seconds,
                'phase' => $phase,
                'context' => $context,
            ];
        }

        self::$metrics[$key]['count']++;
        self::$metrics[$key]['total'] += $seconds;
        self::$metrics[$key]['minimum'] = min(self::$metrics[$key]['minimum'], $seconds);
        self::$metrics[$key]['maximum'] = max(self::$metrics[$key]['maximum'], $seconds);
    }

    /**
     * Capture the beginning of PHPUnit test preparation.
     *
     * @param PreparationStarted $event
     */
    public function notify(PreparationStarted $event): void {
        self::$teststarts[$event->test()->id()] = [
            'started' => hrtime(true),
            'prepared' => null,
        ];
    }

    /**
     * Capture the end of test preparation, immediately before the test method.
     *
     * @param Prepared $event
     */
    public static function test_prepared(Prepared $event): void {
        $id = $event->test()->id();
        if (isset(self::$teststarts[$id])) {
            self::$teststarts[$id]['prepared'] = hrtime(true);
        }
    }

    /**
     * Capture test timings and retain only the slowest test cases.
     *
     * @param Finished $event
     */
    public static function test_finished(Finished $event): void {
        $id = $event->test()->id();
        if (!isset(self::$teststarts[$id])) {
            return;
        }

        $timings = self::$teststarts[$id];
        unset(self::$teststarts[$id]);
        $finished = hrtime(true);
        $prepared = $timings['prepared'] ?? $finished;
        $setup = ($prepared - $timings['started']) / 1_000_000_000;
        $executionandteardown = ($finished - $prepared) / 1_000_000_000;
        $total = ($finished - $timings['started']) / 1_000_000_000;

        self::$testcount++;
        self::$testtotaltime += $total;
        self::record_metric('test_preparation', $setup);
        self::record_metric('test_execution_and_teardown', $executionandteardown);
        self::record_metric('test_total', $total);

        self::$slowtests[] = [
            'test' => $id,
            'setup_seconds' => $setup,
            'execution_and_teardown_seconds' => $executionandteardown,
            'total_seconds' => $total,
        ];
        usort(self::$slowtests, static fn(array $a, array $b): int => $b['total_seconds'] <=> $a['total_seconds']);
        self::$slowtests = array_slice(self::$slowtests, 0, 100);
    }

    /**
     * Write the accumulated profile as JSON.
     */
    public static function write_report(): void {
        if (self::$outputfile === null) {
            return;
        }

        $metrics = array_values(self::$metrics);
        foreach ($metrics as &$metric) {
            $metric['total_seconds'] = $metric['total'];
            $metric['average_seconds'] = $metric['total'] / $metric['count'];
            unset($metric['total']);
        }
        unset($metric);

        $report = [
            'format_version' => 1,
            'profiled_process_seconds' => (hrtime(true) - self::$starttime) / 1_000_000_000,
            'test_count' => self::$testcount,
            'test_total_seconds' => self::$testtotaltime,
            'timing_note' => 'Test execution includes teardown; reset phase metrics are components of reset_all_data and should not be added to its total.',
            'metrics' => $metrics,
            'slow_tests' => self::$slowtests,
        ];

        $json = json_encode($report, JSON_PRETTY_PRINT | JSON_INVALID_UTF8_SUBSTITUTE);
        if ($json === false || file_put_contents(self::$outputfile, $json . PHP_EOL, LOCK_EX) === false) {
            fwrite(STDERR, 'Unable to write PHPUnit profile to ' . self::$outputfile . PHP_EOL);
        }
    }
}

/**
 * PHPUnit subscriber for the end of test preparation.
 *
 * @package    core
 * @copyright  2026 Moodle Pty Ltd <support@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class performance_profiler_prepared_subscriber implements \PHPUnit\Event\Test\PreparedSubscriber {
    /**
     * Capture the end of test preparation.
     *
     * @param Prepared $event
     */
    public function notify(Prepared $event): void {
        performance_profiler::test_prepared($event);
    }
}

/**
 * PHPUnit subscriber for completed test cases.
 *
 * @package    core
 * @copyright  2026 Moodle Pty Ltd <support@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class performance_profiler_finished_subscriber implements \PHPUnit\Event\Test\FinishedSubscriber {
    /**
     * Capture completed test timings.
     *
     * @param Finished $event
     */
    public function notify(Finished $event): void {
        performance_profiler::test_finished($event);
    }
}
