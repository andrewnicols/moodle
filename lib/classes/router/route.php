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

namespace core\router;

use Attribute;
use coding_exception;
use core\router\schema\parameter;
use core\router\schema\specification;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Routing\Route as RoutingRoute;
use Slim\Routing\RouteContext;
use stdClass;
use core\router\schema\request_body;

/**
 * Routing attribute.
 *
 * TODO Move OpenAPI features into \core\openapi and somehow merge them into the route.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD)]
class route {
    /** @var string[] The list of HTTP Methods */
    protected null|array $method = null;

    /** @var route|null The parent route */
    protected ?route $parentroute = null;

    /**
     * Constructor for a new Moodle route.
     *
     * @param null|string $path The path to match
     * @param array|string $method The method, or methods, supported
     * @param array $pathtypes Validators for the path arguments
     * @param mixed $extra Any additional arguments not yet supported in this version of Moodle
     */
    public function __construct(
        /** @var string The Title */
        public string $title = '',

        /** @var string A verbose explanation of the operation behavior */
        public string $description = '',

        /** @var string A short summary of what the operation does */
        public string $summary = '',

        /** @var array<string> A list of security mechanisms */
        public ?array $security = null,

        /** @var string|null The path to the route */
        public ?string $path = null,

        /** @var null|string|string[] The method to match on */
        null|array|string $method = null,

        /** @var param[] A list of param types for path arguments */
        protected array $pathtypes = [],

        /** @var \core\router\query_parameter[] A list of query parameters with matching types */
        protected array $queryparams = [],

        /** @var \core\router\request_body A list of parameters found in the body */
        protected ?request_body $requestbody = null,

        /** @var response[] A list of possible response types */
        protected array $responses = [],

        /** @var bool Whether this endpoint is deprecated */
        protected bool $deprecated = false,

        /** @var string[] A list of tags */
        protected array $tags = [],

        // Note. We do not make use of these extras.
        // These allow us to add additional arguments in future versions, whilst allowing plugins to use this version.
        ...$extra,
    ) {
        // Normalise the method.
        if (is_string($method)) {
            $method = [$method];
        }
        $this->method = $method;

        // Validate the path and query parameters.
        $allparams = array_merge(
            $this->pathtypes,
            $this->queryparams,
        );
        array_walk($allparams, fn($pathtype) => assert(
            $pathtype instanceof parameter,
            new \coding_exception('All properties must be an instance of \core\router\parameter.'),
        ));
    }

    /**
     * Set the parent route, usualyl a Class-level route.
     *
     * @param route $parent
     * @return self
     */
    public function set_parent(route $parent): self {
        $this->parentroute = $parent;
        return $this;
    }

    /**
     * Get the fully-qualified path for this route relative to root.
     *
     * @return string
     */
    public function get_path(): string {
        $path = $this->path ?? '';

        if ($this->parentroute) {
            $path = $this->parentroute->get_path() . $path;
        }
        return $path;
    }

    /**
     * Get the list of HTTP methods associated with this route.
     *
     * @return null|string[]
     */
    public function get_methods(): ?array {
        $parentmethods = $this->parentroute?->get_methods();
        $methods = $this->method;

        if ($parentmethods) {
            if ($methods) {
                return array_merge($parentmethods, $methods);
            }
            return $parentmethods;
        }
        return $methods;
    }

    /**
     * Validate the request content.
     *
     * @param ServerRequestInterface $request
     * @return ServerRequestInterface
     */
    public function validate_request(ServerRequestInterface $request): ServerRequestInterface {
        // Add a Route middleware to validate the path, and parameters.
        $routecontext = RouteContext::fromRequest($request);
        $route = $routecontext->getRoute();

        // Validate that the path arguments are valid.
        // If they are not, then an Exception should be thrown.
        $this->validate_path($route);

        // Validate query parameters.
        $request = $this->validate_query($request, $route);

        // Validate request body parameters.
        // Found in POST, PUT, DELETE, etc.
        $request = $this->validate_request_body($request, $route);

        return $request;
    }

    /**
     * Validate that the path arguments match those supplied in the route.
     *
     * @param RoutingRoute $route The route to validate.
     * @throws coding_exception
     */
    protected function validate_path(RoutingRoute $route): void {
        $requiredparams = count(array_filter(
            $this->pathtypes,
            fn($pathtype) => $pathtype->is_required($this),
        ));
        if ($requiredparams > count($route->getArguments())) {
            throw new \coding_exception(sprintf(
                "Route %s has %d arguments, but %d pathtypes were specified.",
                $route->getPattern(),
                count($route->getArguments()),
                count($this->pathtypes),
            ));
        }

        foreach ($this->pathtypes as $pathtype) {
            $pathtype->validate($route);
        }
    }

    /**
     * Validate that the query parameters match those supplied in the route.
     * @param ServerRequestInterface $request
     * @param RoutingRoute $route
     * @return ServerRequestInterface
     */
    protected function validate_query(
        ServerRequestInterface $request,
        RoutingRoute $route,
    ): ServerRequestInterface {
        $requestparams = $request->getQueryParams();
        $paramnames = array_map(
            fn($param) => $param->get_name($this),
            $this->queryparams,
        );

        // Check for any undeclared parameters.
        $unknownparams = array_diff(
            array_keys($requestparams),
            $paramnames,
        );

        // Remove these from the URL.
        // They will still be accessible via optional_param.
        $request = $request->withQueryParams(
            array_diff_key(
                $requestparams,
                array_flip($unknownparams),
            ),
        );

        foreach ($this->queryparams as $queryparam) {
            $request = $queryparam->validate($request, $request->getQueryParams());
        }

        return $request;
    }

    /**
     * Validate that the request body matches the schema.
     *
     * @param ServerRequestInterface $request
     * @param RoutingRoute $route
     * @return ServerRequestInterface
     */
    protected function validate_request_body(
        ServerRequestInterface $request,
        RoutingRoute $route,
    ): ServerRequestInterface {
        if ($this->requestbody === null) {
            // Clear the parsed body if there should not be one.
            return $request->withParsedBody([]);
        }

        $bodyconfig = $this->requestbody->get_body_for_request($request);
        $bodyschema = $bodyconfig->get_schema();

        return $request->withParsedBody(
            $bodyschema->validate_data($request->getParsedBody()),
        );
    }

    /**
     * Validate that the response matches the schema if a schema was specified.
     *
     * @param ResponseInterface $response
     */
    public function validate_response(ResponseInterface $response): void {
        if (!array_key_exists($response->getStatusCode(), $this->responses)) {
            // Decide what we should do here.
            // Probably just throw heaps of debugging information.
            // Maybe Except with debugging enabled.
            return;
        }

        $this->responses[$response->getStatusCode()]->validate($response);
    }

    // TODO Remove?
    public function get_operationid(): string {
        $operationid = $this->title;
        if ($this->parentroute) {
            $operationid = $this->parentroute->get_operationid() . $operationid;
        }
        return $operationid;
    }

    /**
     * Get the OpenAPI description for this route.
     *
     * @param specification $api
     * @param string $component
     * @param string $path
     * @param array $parentcontexts TODO remove.
     * @return stdClass
     */
    public function get_openapi_schema(
        specification $api,
        string $component,
        string $path,
        array $parentcontexts = [],
        array $commonresponses = [],
    ): \stdClass {
        $searchcontexts = [$this];
        if ($this->parentroute) {
            $searchcontexts[] = $this->parentroute;
        }

        $data = (object) [
            'description' => $this->description,
            'summary' => $this->title,
            'tags' => [$component, ...$this->tags],
            'parameters' => [],
            'responses' => [],
        ];

        if ($this->requestbody) {
            $data->requestBody = $this->requestbody->get_openapi_schema(
                api: $api,
                path: $path,
            );
        }

        if ($this->security !== null) {
            $data->security = $this->security;
        }

        if ($this->deprecated) {
            $data->deprecated = true;
        }

        foreach ($this->responses as $response) {
            $data->responses[$response->get_statuscode()] = $response->get_openapi_schema(
                api: $api,
                path: $path,
            );
        }

        $data->parameters = array_filter(
            array_map(
                fn($param) => $param->get_openapi_schema(
                    api: $api,
                    path: $path,
                ),
                array_merge(
                    $this->pathtypes,
                    $this->queryparams,
                ),
            ),
            fn($param) => $param !== null,
        );

        foreach ($api->get_common_request_responses() as $callable) {
            $data = $callable($this, $data);
        }

        $methoddata = [];
        $methods = $this->get_methods() ?? ['GET'];
        foreach ($methods as $method) {
            $methoddata[strtolower($method)] = $data;
        }

        return (object) $methoddata;
    }

    public function get_path_parameters(): array {
        $parameters = [];
        if ($this->parentroute) {
            $parameters = $this->parentroute->get_path_parameters();
        }
        foreach ($this->pathtypes as $parameter) {
            $parameters[$parameter->get_name()] = $parameter;
        }

        return $parameters;
    }

    public function has_request_body(): bool {
        return $this->requestbody !== null;
    }

    public function has_any_validatable_parameter(): bool {
        return count($this->pathtypes) || count($this->queryparams) || $this->requestbody;
    }
}
