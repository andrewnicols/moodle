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

use core_external\external_api;
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
class external_api_observer extends abstract_observer {
    #[\Override]
    public function observe(): void {
        hook(
            external_api::class,
            'call_external_function',
            pre: function (
                $instance,
                array $params,
                string $class,
                string $function,
                ?string $filename,
                ?int $lineno,
            ): void {
                [$service, , $ajaxonly] = $params;

                $builder = $this->get_instrumentation()->tracer()
                    ->spanBuilder(sprintf('moodle.external.call %s', $service))
                    ->setSpanKind(SpanKind::KIND_SERVER)
                    ->setAttribute(TraceAttributes::CODE_FUNCTION_NAME, sprintf('%s::%s', $class, $function))
                    ->setAttribute(TraceAttributes::CODE_FILE_PATH, $filename)
                    ->setAttribute(TraceAttributes::CODE_LINE_NUMBER, $lineno)
                    ->setAttribute('ajaxonly', $ajaxonly ? 'true' : 'false');

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
                if (array_key_exists('error', $result) && $result['error']) {
                    $span->setStatus(
                        \OpenTelemetry\API\Trace\StatusCode::STATUS_ERROR,
                        $result['error']['message'] ?? 'Unknown error',
                    );

                    // Note: Unfortunately we cannot add the Exception if it exists because
                    // it is not an \Exception object, but an array of data.
                }

                $scope->detach();
                $span->end();

                return $result;
            }
        );
    }
}
