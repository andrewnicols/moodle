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
use OpenTelemetry\API\Trace\SpanInterface;

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
    public function __construct(
        /** @var CachedInstrumentation The instrumentation instance */
        private CachedInstrumentation $instrumentation,
    ) {
    }

    /**
     * Initialise the observer.
     */
    abstract public function observe(): void;

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
}
