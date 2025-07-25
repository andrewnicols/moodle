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

use core\output\html_writer;
use OpenTelemetry\API\Globals;
use OpenTelemetry\API\Instrumentation\CachedInstrumentation;
use OpenTelemetry\API\Trace\Propagation\TraceContextPropagator;
use OpenTelemetry\API\Trace\Propagation\TraceContextValidator;
use OpenTelemetry\API\Trace\SpanContext;
use OpenTelemetry\API\Trace\SpanContextValidator;
use OpenTelemetry\API\Trace\SpanInterface;
use OpenTelemetry\API\Trace\SpanKind;
use OpenTelemetry\API\Trace\StatusCode;
use OpenTelemetry\API\Trace\TraceFlags;
use OpenTelemetry\API\Trace\TracerInterface;
use OpenTelemetry\Context\Propagation\ArrayAccessGetterSetter;
use OpenTelemetry\Context\ScopeInterface;
use OpenTelemetry\Contrib\Otlp\LogsExporterFactory;
use OpenTelemetry\Contrib\Otlp\MetricExporterFactory;
use OpenTelemetry\SDK\Common\Attribute\Attributes;
use OpenTelemetry\SDK\Common\Configuration\Configuration;
use OpenTelemetry\SDK\Common\Configuration\Variables;
use OpenTelemetry\SDK\Logs\LoggerProvider;
use OpenTelemetry\SDK\Logs\Processor\SimpleLogRecordProcessor;
use OpenTelemetry\SDK\Metrics\MeterProvider;
use OpenTelemetry\SDK\Metrics\MeterProviderFactory;
use OpenTelemetry\SDK\Metrics\MetricReader\ExportingReader;
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
use Slim\Factory\Psr17\ServerRequestCreator;
use Slim\Factory\ServerRequestCreatorFactory;

/**
 * Telemetry manager for Moodle.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class telemetry {
    /** @var TracerInterface The tracer in use */
    private static TracerInterface $tracer;

    /** @var bool Whether the telemetry manager has been initialised */
    private static bool $initialised = false;

    /** @var SpanInterface|null The span for the root request */
    private static ?SpanInterface $requestspan = null;

    /** @var ScopeInterface|null The scope for the root request */
    private static ?ScopeInterface $requestscope = null;

    /** @var  CachedInstrumentation The instrumentation instance */
    private static CachedInstrumentation $instrumentation;

    /**
     * Initialise the telemetry manager.
     */
    protected static function configure(): bool {
        if (static::$initialised) {
            return true;
        }

        if (!class_exists(Globals::class)) {
            return false;
        }

        static::$initialised = true;

        $resource = ResourceInfoFactory::emptyResource()->merge(ResourceInfo::create(Attributes::create([
            ResourceAttributes::SERVICE_NAMESPACE => 'moodle',
            ResourceAttributes::SERVICE_NAME => 'moodle',
            ResourceAttributes::SERVICE_VERSION => self::get_moodle_version(),
        ])));

        $spanexporter = (new ExporterFactory())->create();

        $logexporter = (new LogsExporterFactory())->create();

        $metricexporter = (new MetricExporterFactory())
            ->create();

        $reader = new ExportingReader($metricexporter);

        $meterprovider = (new MeterProviderFactory())->create(
            $resource,
        );

        $meterprovider = MeterProvider::builder()
            ->setResource($resource)
            ->addReader($reader)
            ->build();

        $emitmetrics = Configuration::getBoolean(Variables::OTEL_PHP_INTERNAL_METRICS_ENABLED);
        $emitmetrics = true;

        $tracerprovider = TracerProvider::builder()
            ->addSpanProcessor(
                (new SpanProcessorFactory())->create($spanexporter, $emitmetrics ? $meterprovider : null)
            )
            ->setResource($resource)
            ->setSampler(new ParentBased(new AlwaysOnSampler()))
            ->build();

        $loggerprovider = LoggerProvider::builder()
            ->setResource($resource)
            ->addLogRecordProcessor(
                new SimpleLogRecordProcessor($logexporter)
            )
            ->build();

        Sdk::builder()
            ->setTracerProvider($tracerprovider)
            ->setMeterProvider($meterprovider)
            ->setLoggerProvider($loggerprovider)
            ->setPropagator(TraceContextPropagator::getInstance())
            ->setAutoShutdown(true)
            ->buildAndRegisterGlobal();

        $instrumentation = self::get_instrumentation();

        (new telemetry\database_observer($instrumentation))->observe();
        (new telemetry\external_api_observer($instrumentation))->observe();
        (new telemetry\router_observer($instrumentation))->observe();
        (new telemetry\hook_observer($instrumentation))->observe();
        (new telemetry\filter_observer($instrumentation))->observe();
        (new telemetry\block_observer($instrumentation))->observe();
        (new telemetry\renderer_observer($instrumentation))->observe();
        (new telemetry\form_observer($instrumentation))->observe();
        (new telemetry\cron_observer($instrumentation))->observe();

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
    public static function get_page_span(): ?SpanInterface {
        if (!static::configure()) {
            return null;
        }

        if (self::$requestspan === null) {
            if (php_sapi_name() === 'cli') {
                $span = self::get_root_cli_span();
            } else if (array_key_exists('REQUEST_METHOD', $_SERVER)) {
                $span = self::get_root_http_span();
            } else {
                // We don't have a request method, so we assume this is a page that is not being served via HTTP.
                $span = static::start_span('moodle.page', self::get_trace_page_attributes());
            }

            self::$requestspan = $span;
            self::$requestscope = $span->activate();
        }

        return self::$requestspan;
    }

    /**
     * End the request span.
     * @return void
     */
    public static function end_request_span(): void {
        if (self::$requestspan === null) {
            return;
        }

        self::$requestscope->detach();

        $statuscode = http_response_code();
        self::$requestspan->setAttribute('http.response.status.code', $statuscode);
        if ($statuscode >= 100 && $statuscode < 400) {
            self::$requestspan->setStatus(StatusCode::STATUS_OK);
        } else if ($statuscode >= 400 && $statuscode < 600) {
            self::$requestspan->setStatus(StatusCode::STATUS_ERROR);
        } else {
            self::$requestspan->setStatus(StatusCode::STATUS_UNSET);
        }

        if (function_exists('get_performance_info')) {
            $meter = Globals::meterProvider()->getMeter('moodle.performance');
            $filtermanager = \core_filters\filter_manager::instance();
            if (method_exists($filtermanager, 'get_performance_summary')) {
                $data = $filtermanager->get_performance_summary();
                $meter->createCounter('contextswithfilter', 'filters', 'Contexts for which filters were loaded')
                    ->add($data['contextswithfilters'] ?? 0);

                $meter->createCounter('filterscreated', 'filters', 'Filters created')
                    ->add($data['filterscreated'] ?? 0);

                $meter->createCounter('textsfiltered', 'filters', 'Pieces of content filtered')
                    ->add($data['textsfiltered'] ?? 0);

                $meter->createCounter('stringsfiltered', 'filters', 'Strings created')
                    ->add($data['stringsfiltered'] ?? 0);
            }

            $meter->createGauge('memory_total', 'bytes', 'Total memory used by the script')
                ->record(memory_get_usage(true));

            Globals::meterProvider()->shutdown();

            // Add the performance info to the span.
            self::$requestspan->addEvent(
                'moodle.shutdown_handler',
                array_filter(
                    get_performance_info(),
                    fn ($key): bool => $key !== 'txt' && $key !== 'html',
                    ARRAY_FILTER_USE_KEY,
                ),
            );
        } else {
            // Fallback for older PHP versions.
            self::$requestspan->addEvent('moodle.shutdown_handler', ['message' => 'No performance info available']);
        }
        self::$requestspan->end();

        self::$requestspan = null;
        self::$requestscope = null;
    }

    public static function initialise_page_span(): void {
        if (!static::configure()) {
            return;
        }

        // This method is called to ensure the page span is initialised before any other telemetry is recorded.
        self::get_page_span();
    }

    /**
     * Get the rool CLI Span instance with attributes set.
     *
     * @return SpanInterface
     */
    private static function get_root_cli_span(): ?SpanInterface {
        // CLI Spans are documented in the spec at
        // https://opentelemetry.io/docs/specs/semconv/cli/cli-spans/#execution-callee-spans.
        $process = $_SERVER['_'] ?? 'unknown';

        $pageattributes['process.executable.path'] = $process;
        $pageattributes['process.command_args'] = $_SERVER['ARGV'] ?? [];
        if ($pid = getmypid()) {
            // The process ID is available in CLI mode.
            $pageattributes['process.pid'] = $pid;
        }

        return static::start_span(basename($process), array_merge(
            self::get_trace_page_attributes(),
            $pageattributes,
        ));
    }
    private static function xget_root_http_span(): ?SpanInterface {
        // HTTP Server Spans are documented in the spec at
        // https://opentelemetry.io/docs/specs/semconv/http/http-spans/#http-server.
        $pageattributes = static::get_trace_page_attributes();

        // The following attributes are required.
        $pageattributes['http.request.method'] = $_SERVER['REQUEST_METHOD'] ?? '';
        $pageattributes['http.path'] = $_SERVER['PHP_SELF'] ?? '';
        $pageattributes['url.scheme'] = $_SERVER['HTTPS'] ? 'https' : 'http';

        // The following attributes are conditionally required.
        $pageattributes['url.query'] = $_SERVER['QUERY_STRING'] ?? null;

        // The following attributes are recommended.
        $pageattributes['network.protocol.version'] = $_SERVER['SERVER_PROTOCOL'] ? explode('/', $_SERVER['SERVER_PROTOCOL'])[1] : null;
        $pageattributes['user_agent.original'] = $_SERVER['HTTP_USER_AGENT'] ?? null;

        $pageattributes['url.full'] = $_SERVER['REQUEST_URI'];
        $pageattributes['http.uri'] = $_SERVER['REQUEST_URI'];

        // The span name is the HTTP method and path.
        $name = "{$pageattributes['http.request.method']} {$pageattributes['http.path']}";

        $span = static::start_span($name, $pageattributes);

        header("X-Trace-Id: {$span->getContext()->getTraceId()}");

        return $span;
    }

    private static function get_root_http_span(): ?SpanInterface {
        if (!static::configure()) {
            return null;
        }

        $pageattributes = static::get_trace_page_attributes();

        // HTTP Server Spans are documented in the spec at
        // https://opentelemetry.io/docs/specs/semconv/http/http-spans/#http-server.

        $serverRequestCreator = ServerRequestCreatorFactory::create();
        $request = $serverRequestCreator->createServerRequestFromGlobals();
        $context = TraceContextPropagator::getInstance()->extract($request->getHeaders());


        $builder = self::get_instrumentation()->tracer()
            ->spanBuilder(sprintf('%s %s', $_SERVER['REQUEST_METHOD'], $_SERVER['PHP_SELF'] ?? ''))
            ->setParent($context)
            ->setSpanKind(SpanKind::KIND_SERVER)
            ->setAttribute(TraceAttributes::SERVICE_NAME, 'moodle')

            // The following attributes are required.
            ->setAttribute(TraceAttributes::HTTP_REQUEST_METHOD, $_SERVER['REQUEST_METHOD'] ?? '')
            ->setAttribute('http.path', $_SERVER['PHP_SELF'] ?? '')
            ->setAttribute(TraceAttributes::HTTP_SCHEME, isset($_SERVER['HTTPS']) ? 'https' : 'http')

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
            ->setAttributes($pageattributes);

        $builder->addLink(self::get_linked_span(getallheaders(), 'pageparent'));

        $span = $builder->startSpan();

        $span->setAttribute(TraceAttributes::SERVICE_NAME, 'moodle');
        header("X-Trace-Id: {$span->getContext()->getTraceId()}");

        return $span;
    }

    private static function get_linked_span(array $carrier, string $key): ?SpanContext {
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
     * Get the standard trace properties for the current request.
     *
     * @return array
     */
    protected static function get_trace_page_attributes(): array {
        global $CFG;

        // These are the standard Moodle attributes added to the wrapping span.
        $pageattributes = [
            'moodle.version' => self::get_moodle_version(),

            // HTTP Server Spans https://opentelemetry.io/docs/specs/semconv/http/http-spans/#http-server.
            // Note: In the context of HTTP server, server.address and server.port attributes capture the original host name and port.
            // They are intended, whenever possible, to be the same on the client and server sides.
            'server.address' => $CFG->wwwroot,
            // TODO: server.port from the CFG->wwwroot.
        ];


        return $pageattributes;
    }

    /**
     * Get the tracer for Moodle.
     *
     * @return null|TracerInterface
     */
    public static function get_tracer(): ?TracerInterface {
        if (!static::configure()) {
            return null;
        }

        if (!isset(static::$tracer)) {
            static::configure();
            static::$tracer = Globals::tracerProvider()->getTracer('moodle', '1.0.0');
        }
        return static::$tracer;
    }

    /**
     * Start a new trace span given the name and attributes.
     *
     * @param string $name
     * @param array $attributes
     * @return null|SpanInterface
     */
    public static function start_span(
        string $name,
        array $attributes = [],
    ): ?SpanInterface {
        if (!static::configure()) {
            return null;
        }

        return static::get_tracer()->spanBuilder($name)
            ->setAttributes($attributes)
            ->startSpan();
    }

    /**
     * Get the top span in the current trace.
     *
     * @return null|SpanInterface
     */
    public static function get_current_span(): ?SpanInterface {
        if (!static::configure()) {
            return null;
        }

        return \OpenTelemetry\API\Trace\Span::getCurrent();
    }

    /**
     * Get the page ID for the current request.
     *
     * @return string|null
     */
    public static function get_pageid(): ?string {
        if (!static::configure()) {
            return null;
        }

        $span = self::get_page_span();

        if ($span === null) {
            return null;
        }

        return $span->getContext()->getTraceId();
    }

    public static function get_trace_id(): ?string {
        if (!static::configure()) {
            return null;
        }

        $headers = [];
        Globals::propagator()->inject($headers);

        return $headers[TraceContextPropagator::TRACEPARENT] ?? null;
    }

    /**
     * Detach and end a scope/span.
     *
     * @param \OpenTelemetry\Context\ScopeInterface $scope
     * @param \OpenTelemetry\API\Trace\SpanInterface $span
     */
    public static function detach_and_end(
        ScopeInterface $scope,
        SpanInterface $span,
    ): void {
        if (!static::configure()) {
            return;
        }

        $scope->detach();
        $span->end();
    }

    /**
     * Get the CachedInstrumentation instance.
     *
     * @return CachedInstrumentation
     */
    private static function get_instrumentation(): CachedInstrumentation {
        if (!isset(self::$instrumentation)) {
            // Note: Do not use DI here. We want to be able to set up Telemetry as early as possible.
            self::$instrumentation = new CachedInstrumentation(
                'io.opentelemetry.contrib.php.moodle',
                self::get_moodle_version(),
                'https://opentelemetry.io/schemas/1.32.0',
                [
                    TraceAttributes::SERVICE_NAME => 'moodle',
                ],
            );
        }

        return self::$instrumentation;
    }

    /**
     * Add the trace id to the footer.
     *
     * @param \core\hook\output\before_standard_footer_html_generation $hook
     */
    public static function before_standard_footer_html_generation(
        \core\hook\output\before_standard_footer_html_generation $hook,
    ): void {
        if (self::is_initialised()) {
            $hook->add_html(
                html_writer::div(get_string('telemetrytraceid', 'core', self::get_pageid()), 'traceid'),
            );
        }
    }
}
