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
use OpenTelemetry\API\Trace\Span;
use OpenTelemetry\API\Trace\SpanInterface;
use OpenTelemetry\API\Trace\StatusCode;
use OpenTelemetry\Context\Context;
use OpenTelemetry\SDK\Sdk;
use OpenTelemetry\SemConv\TraceAttributes;
use ReflectionClass;


/**
 * Interface to describe an observer.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class abstract_observer {
    /** @var \OpenTelemetry\API\Trace\SpanInterface[] The list of spans tracked by this observer */
    private array $spanstack = [];

    /** @var \OpenTelemetry\Context\ScopeInterface[] The list of scopes tracked by this observer */
    private array $scopestack = [];

    /**
     * Construct a new instance of the database observer.
     *
     * @param \OpenTelemetry\API\Instrumentation\CachedInstrumentation $instrumentation
     */
    final public function __construct(
        /** @var CachedInstrumentation The instrumentation instance */
        private CachedInstrumentation $instrumentation,
    ) {
    }

    /**
     * Initialise the observer.
     */
    abstract protected function observe(): void;

    /**
     * Register the observer.
     */
    public function register(): void {
        if (Sdk::isInstrumentationDisabled(static::get_instrumentation_name()) === true) {
            return;
        }

        $this->observe();
    }

    /**
     * Get the name of the instrumentation.
     *
     * @return string
     */
    protected function get_instrumentation_name(): string {
        $classname = (new ReflectionClass(static::class))->getShortName();
        return 'moodle.' . preg_replace('/_observer$/', '', $classname);
    }

    protected function get_instrumentation(): CachedInstrumentation {
        return $this->instrumentation;
    }

    protected function push_span_and_scope(
        \OpenTelemetry\API\Trace\SpanInterface $span,
        ?\OpenTelemetry\Context\ScopeInterface $scope = null,
    ): void {
        $this->spanstack[] = $span;

        if ($scope === null) {
            $scope = $span->activate();
        }
        $this->scopestack[] = $scope;
    }

    /**
     * Pop the current span and scope from the stack.
     *
     * @return array<\OpenTelemetry\API\Trace\SpanInterface|\OpenTelemetry\Context\ScopeInterface|null>
     */
    protected function pop_span_and_scope(): array {
        $span = array_pop($this->spanstack);
        $scope = array_pop($this->scopestack);

        return [$span, $scope];
    }

    protected function add_backtrace(SpanInterface $span, int $skip = 0): void {
        $backtrace = debug_backtrace();
        if (!$backtrace) {
            return;
        }

        for ($i = 0; $i < $skip; $i++) {
            array_shift($backtrace);
        }

        $span->setAttribute(
            'backtrace',
            format_backtrace($backtrace, true),
        );
    }

    /**
     * End the span.
     *
     * @param mixed $attributes
     * @param mixed $exception
     * @param mixed $errorstatus=
     */
    protected static function end_span(
        ?iterable $attributes,
        ?\Throwable $exception,
        ?string $errorstatus,
    ): void {
        $scope = Context::storage()->scope();
        if (!$scope) {
            return;
        }
        $scope->detach();
        $span = Span::fromContext($scope->context());

        if ($attributes) {
            $span->setAttributes($attributes);
        }

        if ($errorstatus !== null) {
            $span->setAttribute(TraceAttributes::EXCEPTION_MESSAGE, $errorstatus);
            $span->setStatus(StatusCode::STATUS_ERROR, $errorstatus);
        }

        if ($exception) {
            $span->recordException($exception);
            $span->setAttribute(TraceAttributes::EXCEPTION_TYPE, $exception::class);
            $span->setStatus(StatusCode::STATUS_ERROR, $exception->getMessage());
        }

        $span->end();
    }
}
