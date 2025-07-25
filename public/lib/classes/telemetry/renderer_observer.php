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

use OpenTelemetry\API\Trace\SpanKind;
use OpenTelemetry\SemConv\TraceAttributes;
use Throwable;
use function OpenTelemetry\Instrumentation\hook;

/**
 * Renderer observer.
 *
 * @package    core
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class renderer_observer extends abstract_observer {
    #[\Override]
    public function observe(): void {
        hook(
            \core\output\renderer_base::class,
            'render',
            pre: function (
                \renderer_base $renderer,
                array $params,
                string $class,
                string $function,
                ?string $filename,
                ?int $lineno,
            ): void {
                [$widget] = $params;
                $builder = $this->get_instrumentation()->tracer()
                    ->spanBuilder(sprintf('moodle.render %s', get_class($widget)))
                    ->setSpanKind(SpanKind::KIND_INTERNAL)
                    ->setAttribute(TraceAttributes::CODE_FUNCTION_NAME, sprintf('%s::%s', $class, $function))
                    ->setAttribute(TraceAttributes::CODE_FILE_PATH, $filename)
                    ->setAttribute(TraceAttributes::CODE_LINE_NUMBER, $lineno);

                $span = $builder->startSpan();
                $this->add_backtrace($span);
                $this->push_span_and_scope($span);
            },
            post: function (
                \renderer_base $middleware,
                array $params,
                mixed $result,
                ?Throwable $exception,
            ): mixed {
                [$span, $scope] = $this->pop_span_and_scope();

                $scope->detach();
                $span->end();

                return $result;
            },
        );
    }
}
