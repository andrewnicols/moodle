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
 * Observer for the Moodle block manager.
 *
 * @package    core
 * @copyright  2025 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class block_observer extends abstract_observer {
    #[\Override]
    public function observe(): void {
        hook(
            \block_base::class,
            'get_content',
            pre: $this->pre_block_get_content(...),
            post: $this->generic_post(...),
        );
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
    private function pre_block_get_content(
        \block_base $block,
        array $params,
        string $class,
        string $function,
        ?string $filename,
        ?int $lineno,
    ): void {
        $builder = $this->get_instrumentation()->tracer()
            ->spanBuilder(sprintf('moodle.block.get_content %s', get_class($block)))
            ->setSpanKind(SpanKind::KIND_INTERNAL)
            ->setAttribute(TraceAttributes::CODE_FUNCTION_NAME, sprintf('%s::%s', $class, $function))
            ->setAttribute(TraceAttributes::CODE_FILE_PATH, $filename)
            ->setAttribute(TraceAttributes::CODE_LINE_NUMBER, $lineno)
        ;

        $span = $builder->startSpan();
        $this->push_span_and_scope($span);
    }

    /**
     * Generic post hook handler for Task execution.
     *
     * @param object $object
     * @param array $params
     * @param mixed $result
     * @param mixed $exception
     * @return mixed
     */
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
