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
 * Class event_observer
 *
 * @package    core
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class event_observer extends abstract_observer {
    #[\Override]
    protected function observe(): void {
        $instrumentation = $this->get_instrumentation();

        hook(
            \core\event\manager::class,
            'dispatch',
            pre: static function (...$args) use ($instrumentation): void {
                self::pre_event($instrumentation, ...$args);
            },
            post: static function (string $class, array $params,  $returnvalue, ?\Throwable $exception): void {
                self::end_span([], $returnvalue, $exception);
            },
        );

        hook(
            \core\event\manager::class,
            'process_buffers',
            pre: static function (...$args) use ($instrumentation): void {
                self::pre_process_buffers($instrumentation, ...$args);
            },
            post: static function (string $class, array $params,  $returnvalue, ?\Throwable $exception): void {
                self::end_span([], $returnvalue, $exception);
            },
        );
    }

    /**
     * Pre hook handler for Moodle events.
     *
     * @param \core\event\manager $manager
     * @param array $params
     * @param string $class
     * @param string $function
     * @param mixed $filename
     * @param mixed $lineno
     * @return void
     */
    private static function pre_event(
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
            ->spanBuilder(sprintf('moodle.event %s', get_class($task)))
            ->setParent($parent)
            ->setSpanKind(SpanKind::KIND_INTERNAL)
            ->setAttribute(TraceAttributes::CODE_FUNCTION_NAME, sprintf('%s::%s', $class, $function))
            ->setAttribute(TraceAttributes::CODE_FILE_PATH, $filename)
            ->setAttribute(TraceAttributes::CODE_LINE_NUMBER, $lineno);

        $span = $builder->startSpan();
        $context = $span->storeInContext($parent);

        Context::storage()->attach($context);
    }

    /**
     * Pre hook handler for Buffer processing.
     *
     * @param \core\event\manager $manager
     * @param array $params
     * @param string $class
     * @param string $function
     * @param mixed $filename
     * @param mixed $lineno
     * @return void
     */
    private static function pre_process_buffers(
        CachedInstrumentation $instrumentation,
        \core\cron|string $cron,
        array $params,
        string $class,
        string $function,
        ?string $filename,
        ?int $lineno,
    ): void {
        $parent = Context::getCurrent();
        $builder = $instrumentation->tracer()
            ->spanBuilder('moodle.event.process_buffers')
            ->setParent($parent)
            ->setSpanKind(SpanKind::KIND_INTERNAL)
            ->setAttribute(TraceAttributes::CODE_FUNCTION_NAME, sprintf('%s::%s', $class, $function))
            ->setAttribute(TraceAttributes::CODE_FILE_PATH, $filename)
            ->setAttribute(TraceAttributes::CODE_LINE_NUMBER, $lineno);

        $span = $builder->startSpan();
        $context = $span->storeInContext($parent);

        Context::storage()->attach($context);
    }
}
