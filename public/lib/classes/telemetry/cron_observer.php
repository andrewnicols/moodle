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

namespace core\telemetry;

use OpenTelemetry\API\Instrumentation\CachedInstrumentation;
use OpenTelemetry\API\Trace\SpanKind;
use OpenTelemetry\Context\Context;
use OpenTelemetry\SemConv\TraceAttributes;
use function OpenTelemetry\Instrumentation\hook;

/**
 * Cron and task observer for Moodle.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class cron_observer extends abstract_observer {
    #[\Override]
    protected function observe(): void {
        $instrumentation = $this->get_instrumentation();

        hook(
            \core\cron::class,
            'run_inner_scheduled_task',
            pre: static function (...$args) use ($instrumentation): void {
                self::pre_scheduled_task($instrumentation, ...$args);
            },
            post: static function (string $class, array $params,  $returnvalue, ?\Throwable $exception): void {
                self::end_span([], $returnvalue, $exception);
            },
        );
        hook(
            \core\cron::class,
            'run_inner_adhoc_task',
            pre: static function (...$args) use ($instrumentation): void {
                self::pre_adhoc_task($instrumentation, ...$args);
            },
            post: static function (string $class, array $params,  $returnvalue, ?\Throwable $exception): void {
                self::end_span([], $returnvalue, $exception);
            },
        );
    }

    /**
     * Pre hook handler for Scheduled Task execution.
     *
     * @param \core\cron $cron
     * @param array $params
     * @param string $class
     * @param string $function
     * @param mixed $filename
     * @param mixed $lineno
     * @return void
     */
    private static function pre_scheduled_task(
        CachedInstrumentation $instrumentation,
        \core\cron|string $cron,
        array $params,
        string $class,
        string $function,
        ?string $filename,
        ?int $lineno,
    ): void {
        [$task] = $params;

        $parent = Context::getCurrent();
        $builder = $instrumentation->tracer()
            ->spanBuilder(sprintf('moodle.task.scheduled %s', get_class($task)))
            ->setParent($parent)
            ->setSpanKind(SpanKind::KIND_INTERNAL)
            ->setAttribute(TraceAttributes::CODE_FUNCTION_NAME, sprintf('%s::%s', $class, $function))
            ->setAttribute(TraceAttributes::CODE_FILE_PATH, $filename)
            ->setAttribute(TraceAttributes::CODE_LINE_NUMBER, $lineno)
            ->setAttribute('moodle.task.time_started', $task->get_timestarted())
            ->setAttribute('moodle.task.last_run_time', $task->get_last_run_time())
            ->setAttribute('moodle.task.next_run_time', $task->get_next_run_time())
            ->setAttribute('moodle.task.fail_delay', $task->get_fail_delay());

        $span = $builder->startSpan();
        $context = $span->storeInContext($parent);

        Context::storage()->attach($context);
    }

    /**
     * Pre hook handler for Adhoc Task execution.
     *
     * @param \core\cron $cron
     * @param array $params
     * @param string $class
     * @param string $function
     * @param mixed $filename
     * @param mixed $lineno
     * @return void
     */
    private static function pre_adhoc_task(
        CachedInstrumentation $instrumentation,
        \core\cron|string $cron,
        array $params,
        string $class,
        string $function,
        ?string $filename,
        ?int $lineno,
    ): void {
        [$task] = $params;
        $parent = Context::getCurrent();
        $builder = $instrumentation->tracer()
            ->spanBuilder(sprintf('moodle.task.adhoc %s', get_class($task)))
            ->setParent($parent)
            ->setSpanKind(SpanKind::KIND_INTERNAL)
            ->setAttribute(TraceAttributes::CODE_FUNCTION_NAME, sprintf('%s::%s', $class, $function))
            ->setAttribute(TraceAttributes::CODE_FILE_PATH, $filename)
            ->setAttribute(TraceAttributes::CODE_LINE_NUMBER, $lineno)
            ->setAttribute('moodle.task.id', $task->get_id())
            ->setAttribute('moodle.task.time_started', $task->get_timestarted())
            ->setAttribute('moodle.task.next_run_time', $task->get_next_run_time())
            ->setAttribute('moodle.task.fail_delay', $task->get_fail_delay())
            // ->setAttribute('moodle.task.customdata', $task->get_custom_data())
            ->setAttribute('moodle.task.userid', $task->get_userid())
            ->setAttribute('moodle.task.attempts_available', $task->get_attempts_available())
            ->setAttribute('moodle.task.retry_until_success', $task->retry_until_success());

        $span = $builder->startSpan();
        $context = $span->storeInContext($parent);

        Context::storage()->attach($context);
    }
}
