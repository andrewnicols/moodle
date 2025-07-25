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

use core\hook\manager as hook_manager;
use OpenTelemetry\API\Trace\SpanKind;
use OpenTelemetry\SemConv\TraceAttributes;
use Psr\EventDispatcher\StoppableEventInterface;
use Throwable;
use function OpenTelemetry\Instrumentation\hook;

/**
 * Class database
 *
 * @package    core
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class hook_observer extends abstract_observer {
    #[\Override]
    public function observe(): void {
        hook(
            hook_manager::class,
            'dispatch',
            pre: function (
                hook_manager $manager,
                array $params,
                string $class,
                string $function,
                ?string $filename,
                ?int $lineno,
            ): void {
                [$hook] = $params;

                $builder = $this->get_instrumentation()->tracer()
                    ->spanBuilder(sprintf('moodle.hook.dispatch %s', $hook::class))
                    ->setSpanKind(SpanKind::KIND_INTERNAL)
                    ->setAttribute(TraceAttributes::CODE_FUNCTION_NAME, sprintf('%s::%s', $class, $function))
                    ->setAttribute(TraceAttributes::CODE_FILE_PATH, $filename)
                    ->setAttribute(TraceAttributes::CODE_LINE_NUMBER, $lineno);

                $span = $builder->startSpan();
                $this->push_span_and_scope($span);
            },
            post: function (
                $instance,
                array $params,
                mixed $result,
                ?Throwable $exception,
            ): mixed {
                [$span, $scope] = $this->pop_span_and_scope();

                [$hook] = $params;
                if ($hook instanceof StoppableEventInterface && $hook->isPropagationStopped()) {
                    $span->addEvent('Event Stopped');
                }

                $scope->detach();
                $span->end();

                return $result;
            }
        );

        hook(
            hook_manager::class,
            'dispatch_to_callback',
            pre: function (
                hook_manager $manager,
                array $params,
                string $class,
                string $function,
                ?string $filename,
                ?int $lineno,
            ): void {
                [$callback, $hook] = $params;

                $builder = $this->get_instrumentation()->tracer()
                    ->spanBuilder(sprintf('moodle.hook.dispatch_to_hook %s => %s', $hook::class, $callback))
                    ->setSpanKind(SpanKind::KIND_INTERNAL)
                    ->setAttribute(TraceAttributes::CODE_FUNCTION_NAME, sprintf('%s::%s', $class, $function))
                    ->setAttribute(TraceAttributes::CODE_FILE_PATH, $filename)
                    ->setAttribute(TraceAttributes::CODE_LINE_NUMBER, $lineno);

                $span = $builder->startSpan();
                $this->push_span_and_scope($span);
            },
            post: function (
                $instance,
                array $params,
                mixed $result,
                ?Throwable $exception,
            ): mixed {
                [$span, $scope] = $this->pop_span_and_scope();

                [, $hook] = $params;
                if ($hook instanceof StoppableEventInterface && $hook->isPropagationStopped()) {
                    $span->addEvent('Event Stopped');
                }

                $scope->detach();
                $span->end();

                return $result;
            }
        );
    }
}
