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
use function OpenTelemetry\Instrumentation\hook;

/**
 * Form observer.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class form_observer extends abstract_observer {
    #[\Override]
    public function observe(): void {
        hook(
            \moodleform::class,
            'get_data',
            pre: $this->generic_pre(...),
            post: fn (...$args) => $this->generic_post(...$args),
        );
    }

    private function generic_pre(
        \moodleform $form,
        array $params,
        string $class,
        string $function,
        ?string $filename,
        ?int $lineno,
    ): void {
        $builder = $this->get_instrumentation()->tracer()
            ->spanBuilder(sprintf('form.%s', get_class($form)))
            ->setSpanKind(SpanKind::KIND_INTERNAL)
            ->setAttribute(TraceAttributes::CODE_FUNCTION_NAME, sprintf('%s::%s', $class, $function))
            ->setAttribute(TraceAttributes::CODE_FILE_PATH, $filename)
            ->setAttribute(TraceAttributes::CODE_LINE_NUMBER, $lineno);

        $span = $builder->startSpan();
        $this->push_span_and_scope($span);
    }

    private function generic_post(
        object $object,
        array $params,
        mixed $result,
        ?\Throwable $exception,
    ): mixed {
        [$span, $scope] = $this->pop_span_and_scope();

        $scope->detach();
        $span->end();
        return $result;
    }
}
