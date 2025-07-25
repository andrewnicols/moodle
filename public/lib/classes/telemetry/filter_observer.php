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

use core_filters\filter_manager;
use core_filters\text_filter;
use OpenTelemetry\API\Trace\SpanKind;
use OpenTelemetry\SemConv\TraceAttributes;
use Throwable;
use function OpenTelemetry\Instrumentation\hook;

/**
 * Class database
 *
 * @package    core
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class filter_observer extends abstract_observer {
    #[\Override]
    public function observe(): void {
        hook(
            filter_manager::class,
            'apply_filter_chain',
            pre: function (
                filter_manager $manager,
                array $params,
                string $class,
                string $function,
                ?string $filename,
                ?int $lineno,
            ): void {
                [$text, $filterchain] = $params;

                $options = $params[2] ?? [];
                $skipfilters = $params[3] ?? null;

                $builder = $this->get_instrumentation()->tracer()
                    ->spanBuilder('moodle.filter.apply_filter_chain')
                    ->setSpanKind(SpanKind::KIND_INTERNAL)
                    ->setAttribute(TraceAttributes::CODE_FUNCTION_NAME, sprintf('%s::%s', $class, $function))
                    ->setAttribute(TraceAttributes::CODE_FILE_PATH, $filename)
                    ->setAttribute(TraceAttributes::CODE_LINE_NUMBER, $lineno)
                    ->setAttribute('moodle.filter.text_length', mb_strlen($params[0] ?? ''))
                    ->setAttribute('moodle.filter.filterchain', json_encode(array_keys($filterchain)))
                    ->setAttribute('moodle.filter.options', json_encode($options))
                    ->setAttribute('moodle.filter.skipfilters', json_encode($skipfilters));

                $span = $builder->startSpan();
                $this->push_span_and_scope($span);

                if ($text === null || $text === '') {
                    $span->addEvent('moodle.filter.apply_filter_chain.empty_text');
                }
            },
            post: function(
                $instance,
                array $params,
                mixed $result,
                ?Throwable $exception,
            ): mixed {
                [$span, $scope] = $this->pop_span_and_scope();

                $scope->detach();
                $span->end();

                return $result;
            }
        );

        hook(
            text_filter::class,
            'filter',
            pre: function (
                text_filter $filter,
                array $params,
                string $class,
                string $function,
                ?string $filename,
                ?int $lineno,
            ): void {
                [$text, $options] = $params;
                $builder = $this->get_instrumentation()->tracer()
                    ->spanBuilder(sprintf('moodle.filter.apply_filter_chain %s', $class))
                    ->setSpanKind(SpanKind::KIND_INTERNAL)
                    ->setAttribute(TraceAttributes::CODE_FUNCTION_NAME, sprintf('%s::%s', $class, $function))
                    ->setAttribute(TraceAttributes::CODE_FILE_PATH, $filename)
                    ->setAttribute(TraceAttributes::CODE_LINE_NUMBER, $lineno)
                    ->setAttribute('moodle.filter.text_length', mb_strlen($text ?? ''))
                    ->setAttribute('moodle.filter.options', json_encode($options));

                $span = $builder->startSpan();
                $this->push_span_and_scope($span);
            },
            post: function(
                $instance,
                array $params,
                mixed $result,
                ?Throwable $exception,
            ): mixed {
                [$span, $scope] = $this->pop_span_and_scope();

                $scope->detach();
                $span->end();

                return $result;
            }
        );
    }

    private function pre_call_external_function(
        $api,
        array $params,
        string $class,
        string $function,
        ?string $filename,
        ?int $lineno,
    ): void {
        $args = func_get_args();
    }
}
