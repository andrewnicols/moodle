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
use core\openapi\specification;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Routing\Route as RoutingRoute;
use Slim\Routing\RouteContext;

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
    protected array $method = [];

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

        /** @var string|string[] The method to match on */
        array|string $method = [],

        /** @var param[] A list of param types for path arguments */
        protected array $pathtypes = [],

        /** @var \core\router\query_parameter[] A list of query parameters with matching types */
        protected array $queryparams = [],

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

    public function set_parent(route $parent) {
        $this->parentroute = $parent;
    }

    public function get_path(): string {
        $path = $this->path ?? '';

        if ($this->parentroute) {
            $path = $this->parentroute->get_path() . $path;
        }
        return $path;
    }

    public function get_methods(): array {
        return array_merge(
            $this->parentroute ? $this->parentroute->get_methods() : [],
            $this->method,
        );
    }

    public function validate_request(ServerRequestInterface $request): ServerRequestInterface {
        // Add a Route middleware to validate the path, and parameters.
        $routecontext = RouteContext::fromRequest($request);
        $route = $routecontext->getRoute();

        $this->validate_path($route);
        return $this->validate_query($request, $route);
    }

    /**
     * Validate that the path arguments match those supplied in the route.
     *
     * @param RoutingRoute $route The route to validate.
     * @throws coding_exception 
     */
    public function validate_path(RoutingRoute $route): void {
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
            )
            );
        }

        foreach ($this->pathtypes as $pathtype) {
            $pathtype->validate($route);
        }
    }

    public function validate_query(
        ServerRequestInterface $request,
        RoutingRoute $route,
    ): ServerRequestInterface {
        foreach ($this->queryparams as $queryparam) {
            $request = $queryparam->validate($request, $route);
        }

        return $request;
    }

    public function validate_response(ResponseInterface $response): void {
        if (!array_key_exists($response->getStatusCode(), $this->responses)) {
            // Decide what we should do here.
            // Probably just throw heaps of debugging information.
            // Maybe Except with debugging enabled.
            return;
        }

        $this->responses[$response->getStatusCode()]->validate($response);
    }

    public function get_operationid(): string {
        $operationid = $this->title;
        if ($this->parentroute) {
            $operationid = $this->parentroute->get_operationid() . $operationid;
        }
        return $operationid;
    }

    public function get_openapi_description(
        specification $api,
        string $component,
        string $path,
        array $parentcontexts = [],
    ): \stdClass {
        $searchcontexts = [$this];
        if ($this->parentroute) {
            $searchcontexts[] = $this->parentroute;
        }

        $data = (object) [
            'description' => $this->description,
            'summary' => $this->title,
            'tags' => [$component, ...$this->tags],
            'parameters' => array_map(
                fn($param) => $param->get_openapi_description(
                    api: $api,
                    component: $component,
                    path: $path,
                    parentcontexts: $searchcontexts,
                ),
                array_merge(
                    $this->queryparams,
                ),
            ),
            'responses' => [],
        ];

        if ($this->security !== null) {
            $data->security = $this->security;
        }

        if ($this->deprecated) {
            $data->deprecated = true;
        }

        foreach ($this->responses as $response) {
            $data->responses[$response->get_statuscode()] = $response->get_openapi_description(
                $api,
                $component,
                $searchcontexts,
            );
        }

        $methoddata = [];
        foreach ($this->method as $method) {
            $methoddata[strtolower($method)] = $data;
        }

        $methoddata['parameters'] = array_filter(
            array_map(
                fn($param) => $param->get_openapi_description(
                    api: $api,
                    component: $component,
                    path: $path,
                    parentcontexts: $searchcontexts,
                ),
                $this->pathtypes,
            ),
            fn($param) => $param !== null,
        );

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
}
