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

namespace core;

use OpenTelemetry\API\Globals;
use OpenTelemetry\API\Instrumentation\CachedInstrumentation;
use OpenTelemetry\API\Trace\Propagation\TraceContextPropagator;
use OpenTelemetry\API\Trace\Propagation\TraceContextValidator;
use OpenTelemetry\API\Trace\Span;
use OpenTelemetry\API\Trace\SpanContext;
use OpenTelemetry\API\Trace\SpanContextValidator;
use OpenTelemetry\API\Trace\SpanInterface;
use OpenTelemetry\API\Trace\SpanKind;
use OpenTelemetry\API\Trace\StatusCode;
use OpenTelemetry\API\Trace\TraceFlags;
use OpenTelemetry\API\Trace\TracerInterface;
use OpenTelemetry\Context\Context;
use OpenTelemetry\Context\Propagation\ArrayAccessGetterSetter;
use OpenTelemetry\Context\ScopeInterface;
use OpenTelemetry\Contrib\Otlp\LogsExporterFactory;
use OpenTelemetry\SDK\Common\Attribute\Attributes;
use OpenTelemetry\SDK\Logs\LoggerProvider;
use OpenTelemetry\SDK\Logs\Processor\SimpleLogRecordProcessor;
use OpenTelemetry\SDK\Resource\ResourceInfo;
use OpenTelemetry\SDK\Resource\ResourceInfoFactory;
use OpenTelemetry\SDK\Sdk;
use OpenTelemetry\SDK\Trace\ExporterFactory;
use OpenTelemetry\SDK\Trace\Sampler\AlwaysOnSampler;
use OpenTelemetry\SDK\Trace\Sampler\ParentBased;
use OpenTelemetry\SDK\Trace\SpanProcessorFactory;
use OpenTelemetry\SDK\Trace\TracerProvider;
use OpenTelemetry\SemConv\ResourceAttributes;
use OpenTelemetry\SemConv\TraceAttributes;

/**
 * OpenTelemetry Telemetry manager class for Moodle.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class telemetry {
    /** @var TracerInterface The tracer in use */
    protected static TracerInterface $tracer;

    /** @var bool Whether the telemetry manager has been initialised */
    protected static bool $initialised = false;

    /** @var SpanInterface|null The span for the root request */
    protected static ?SpanInterface $rootspan = null;

    /** @var ScopeInterface|null The scope for the root request */
    protected static ?ScopeInterface $rootscope = null;

    /** @var  CachedInstrumentation The instrumentation instance */
    protected static CachedInstrumentation $instrumentation;

    /**
     * Initialise the telemetry system.
     *
     * This method is called to ensure the page span is initialised before any other telemetry is recorded.
     *
     * Typically this should only be called in the Moodle bootstrap process.
     *
     * Note: This method should be safe to call, even if open-telemetry is not configured.
     */
    public static function initialise(): void {
        if (!static::configure()) {
            return;
        }

        // This method is called to ensure the page span is initialised before any other telemetry is recorded.
        self::get_root_span();
    }

    /**
     * Add the trace id to the footer.
     *
     * Note: This method is called via the before_standard_footer_html_generation hook.
     *
     * @param \core\hook\output\before_standard_footer_html_generation $hook
     */
    public static function before_standard_footer_html_generation(
        \core\hook\output\before_standard_footer_html_generation $hook,
    ): void {
        if (self::is_initialised()) {
            $hook->add_html(
                \core\output\html_writer::div(get_string('telemetrytraceid', 'core', self::get_page_id()), 'traceid'),
            );
        }
    }

    /**
     * Get the page ID for the current request.
     *
     * @return string|null
     */
    public static function get_page_id(): ?string {
        if (!static::configure()) {
            return null;
        }

        $span = self::get_root_span();

        if ($span === null) {
            return null;
        }

        return $span->getContext()->getTraceId();
    }

    /**
     * A helper method to get the trace id for the current request.
     *
     * @return string|null Null if OpenTelemetry is not configured
     */
    public static function get_trace_id(): ?string {
        if (!static::configure()) {
            return null;
        }

        $headers = [];
        Globals::propagator()->inject($headers);

        return $headers[TraceContextPropagator::TRACEPARENT] ?? null;
    }

    /**
     * Record an error, or exception to the current span.
     *
     * @param \Throwable $ex The exception to record.
     */
    public static function record_throwable(\Throwable $ex): void {
        $span = Span::fromContext(Context::getCurrent());
        $span->recordException($ex);
    }

    /**
     * Shut down the telemetry manager, ending the request span.
     *
     * This method is called from the shutdown manager.
     * @internal
     */
    public static function shutdown(): void {
        if (self::$rootspan === null) {
            return;
        }

        self::$rootscope->detach();

        $statuscode = http_response_code();
        self::$rootspan->setAttribute(TraceAttributes::HTTP_RESPONSE_STATUS_CODE, $statuscode);
        if ($statuscode >= 100 && $statuscode < 400) {
            self::$rootspan->setStatus(StatusCode::STATUS_OK);
        } else if ($statuscode >= 400 && $statuscode < 600) {
            self::$rootspan->setStatus(StatusCode::STATUS_ERROR);
        } else {
            self::$rootspan->setStatus(StatusCode::STATUS_UNSET);
        }

        if (function_exists('get_performance_info')) {
            // Add the performance info to the span.
            self::$rootspan->addEvent(
                'moodle.shutdown_handler',
                array_filter(
                    get_performance_info(),
                    fn ($key): bool => $key !== 'txt' && $key !== 'html',
                    ARRAY_FILTER_USE_KEY,
                ),
            );
        } else {
            // Fallback for older PHP versions.
            self::$rootspan->addEvent('moodle.shutdown_handler', ['message' => 'No performance info available']);
        }
        self::$rootspan->end();

        self::$rootspan = null;
        self::$rootscope = null;
    }

    /**
     * Whether Telemetry is available and configured.
     * 
     * @return bool
     */
    protected static function is_configured(): bool {
        if (class_exists(Sdk::class) && Sdk::isInstrumentationDisabled('all') === true) {
            return false;
        }

        if (!class_exists(Globals::class)) {
            return false;
        }

        if (extension_loaded('opentelemetry') === false) {
            return false;
        }

        return true;
    }

    /**
     * Check if the telemetry manager has been initialised.
     *
     * @return bool
     */
    protected static function is_initialised(): bool {
        return static::$initialised;
    }

    /**
     * Initialise the telemetry manager.
     */
    protected static function configure(): bool {
        if (!static::is_configured()) {
            return false;
        }

        if (static::$initialised) {
            return true;
        }

        static::$initialised = true;

        $resource = ResourceInfoFactory::emptyResource()->merge(ResourceInfo::create(Attributes::create([
            ResourceAttributes::SERVICE_NAMESPACE => 'moodle',
            ResourceAttributes::SERVICE_NAME => 'moodle',
            ResourceAttributes::SERVICE_VERSION => self::get_moodle_version(),
        ])));

        $spanexporter = (new ExporterFactory())->create();
        $tracerprovider = TracerProvider::builder()
            ->addSpanProcessor(
                (new SpanProcessorFactory())->create($spanexporter)
            )
            ->setResource($resource)
            ->setSampler(new ParentBased(new AlwaysOnSampler()))
            ->build();

        $logexporter = (new LogsExporterFactory())->create();
        $loggerprovider = LoggerProvider::builder()
            ->setResource($resource)
            ->addLogRecordProcessor(
                new SimpleLogRecordProcessor($logexporter)
            )
            ->build();

        Sdk::builder()
            ->setTracerProvider($tracerprovider)
            ->setLoggerProvider($loggerprovider)
            ->setPropagator(TraceContextPropagator::getInstance())
            ->setAutoShutdown(true)
            ->buildAndRegisterGlobal();

        self::add_moodle_observers();
        return true;
    }

    /**
     * Add Moodle specific observers to the telemetry system.
     */
    protected static function add_moodle_observers(): void {
        $instrumentation = self::get_instrumentation();
        (new telemetry\external_api_observer($instrumentation))->register();
        (new telemetry\cron_observer($instrumentation))->register();
        (new telemetry\event_observer($instrumentation))->register();
    }

    /**
     * Helper function to get the Moodle version.
     *
     * @return float
     */
    protected static function get_moodle_version(): float {
        global $CFG;

        if (isset($CFG->version)) {
            return $CFG->version;
        }

        require(dirname(__DIR__, 2) . '/version.php');

        return $version;
    }

    /**
     * Get the page trace for the current request.
     *
     * @return null|SpanInterface
     */
    protected static function get_root_span(): ?SpanInterface {
        if (!static::configure()) {
            return null;
        }
        if (self::$rootspan === null) {
            $parent = Context::getCurrent();
            $builder = self::get_instrumentation()->tracer()
                ->spanBuilder('moodle')
                ->setParent($parent)
                ->setAttributes(self::get_standard_page_attributes())
                ->setSpanKind(SpanKind::KIND_SERVER);

            if (php_sapi_name() === 'cli') {
                $builder->setSpanKind(SpanKind::KIND_INTERNAL);
                $span = $builder->startSpan();

                self::set_root_cli_span($span);
            } else if (array_key_exists('REQUEST_METHOD', $_SERVER)) {
                $span = $builder->startSpan();
                self::set_root_http_span($span);
            } else {
                $span = $builder->startSpan();
                // We don't have a request method, so we assume this is a page that is not being served via HTTP.
                $span->updateName('moodle.page');
            }

            self::$rootspan = $span;
            self::$rootscope = $span->activate();
        }

        return self::$rootspan;
    }

    /**
     * Get the rool CLI Span instance with attributes set.
     *
     * @return SpanInterface
     */
    protected static function set_root_cli_span(SpanInterface $span): void {
        // CLI Spans are documented in the spec at
        // https://opentelemetry.io/docs/specs/semconv/cli/cli-spans/#execution-callee-spans.
        $process = $_SERVER['_'] ?? 'unknown';

        $span
            ->updateName(sprintf('moodle.cli %s', $_SERVER['argv'][0] ?? ''))
            ->setAttribute(TraceAttributes::PROCESS_EXECUTABLE_PATH, $process)
            ->setAttribute(TraceAttributes::PROCESS_COMMAND_ARGS, $_SERVER['argv'] ?? []);

        if ($pid = getmypid()) {
            // The process ID is available in CLI mode.
            $span->setAttribute(TraceAttributes::PROCESS_PID, $pid);
        }
    }

    /**
     * Get the root HTTP Span instance with attributes set.
     *
     * @return SpanInterface|null
     */
    protected static function set_root_http_span(SpanInterface $span): void {
        // HTTP Server Spans are documented in the spec at
        // https://opentelemetry.io/docs/specs/semconv/http/http-spans/#http-server.

        $span
            ->updateName(sprintf('%s %s', $_SERVER['REQUEST_METHOD'], $_SERVER['PHP_SELF'] ?? ''))
            ->setAttribute(TraceAttributes::SERVICE_NAME, 'moodle')

            // The following attributes are required.
            ->setAttribute(TraceAttributes::HTTP_REQUEST_METHOD, $_SERVER['REQUEST_METHOD'] ?? '')
            ->setAttribute(TraceAttributes::HTTP_SCHEME, isset($_SERVER['HTTPS']) ? 'https' : 'http')
            ->setAttribute(TraceAttributes::URL_PATH, $_SERVER['PHP_SELF'] ?? '')

            // The following attributes are conditionally required.
            ->setAttribute(TraceAttributes::URL_QUERY, $_SERVER['QUERY_STRING'] ?? '')

            // The following attributes are recommended.
            ->setAttribute(
                TraceAttributes::NET_PROTOCOL_VERSION,
                $_SERVER['SERVER_PROTOCOL'] ? explode('/', $_SERVER['SERVER_PROTOCOL'])[1] : null,
            )
            ->setAttribute(TraceAttributes::USER_AGENT_ORIGINAL, $_SERVER['HTTP_USER_AGENT'] ?? '')

            // Other things.
            ->setAttribute(TraceAttributes::URL_FULL, $_SERVER['REQUEST_URI'] ?? '')
            ->setAttribute(TraceAttributes::HTTP_CLIENT_IP, $_SERVER['REMOTE_ADDR'] ?? '')

            // Link to parent page span if available.
            ->addLink(self::get_linked_span(getallheaders(), 'pageparent'));

        header("X-Trace-Id: {$span->getContext()->getTraceId()}");
    }

    /**
     * Get a linked SpanContext from the given carrier and key.
     *
     * @param array $carrier The carrier to extract from.
     * @param string $key The key to extract.
     * @return SpanContext|null
     */
    protected static function get_linked_span(array $carrier, string $key): ?SpanContext {
        $getter = ArrayAccessGetterSetter::getInstance();

        $parentid = $getter->get($carrier, $key);

        if ($parentid === null) {
            return SpanContext::getInvalid();
        }

        $pieces = explode('-', $parentid);

        if (count($pieces) < 4) {
            return SpanContext::getInvalid();
        }

        [$version, $traceid, $spanid, $traceflags] = $pieces;

        if (
            !TraceContextValidator::isValidTraceVersion($version)
            || !SpanContextValidator::isValidTraceId($traceid)
            || !SpanContextValidator::isValidSpanId($spanid)
            || !TraceContextValidator::isValidTraceFlag($traceflags)
        ) {
            return SpanContext::getInvalid();
        }

        // Return invalid if the trace version is not a future version but still has > 4 pieces.
        $versionisfuture = hexdec($version) > hexdec('00');
        if (count($pieces) > 4 && !$versionisfuture) {
            return SpanContext::getInvalid();
        }

        // Only the sampled flag is extracted from the trace flags (00000001).
        $convertedtraceflags = hexdec($traceflags);
        $issampled = ($convertedtraceflags & TraceFlags::SAMPLED) === TraceFlags::SAMPLED;

        // Only traceparent header is extracted. No tracestate.
        return SpanContext::createFromRemoteParent(
            $traceid,
            $spanid,
            $issampled ? TraceFlags::SAMPLED : TraceFlags::DEFAULT
        );
    }

    /**
     * Set the standard trace properties for the current request.
     *
     * @return array The standard page attributes.
     */
    protected static function get_standard_page_attributes(): array {
        global $CFG;

        return [
            TraceAttributes::SERVICE_VERSION => self::get_moodle_version(),

            // HTTP Server Spans https://opentelemetry.io/docs/specs/semconv/http/http-spans/#http-server.
            // Note: In the context of HTTP server, server.address and server.port attributes
            // capture the original host name and port.
            // They are intended, whenever possible, to be the same on the client and server sides.
            TraceAttributes::SERVER_ADDRESS => $CFG->wwwroot,
        ];
    }

    /**
     * Get the CachedInstrumentation instance.
     *
     * @return CachedInstrumentation
     */
    protected static function get_instrumentation(): CachedInstrumentation {
        if (!isset(self::$instrumentation)) {
            // Note: Do not use DI here. We want to be able to set up Telemetry as early as possible.
            self::$instrumentation = new CachedInstrumentation(
                'io.opentelemetry.contrib.php.moodle',
                self::get_moodle_version(),
                'https://opentelemetry.io/schemas/1.38.0',
                [
                    TraceAttributes::SERVICE_NAME => 'moodle',
                ],
            );
        }

        return self::$instrumentation;
    }
}
