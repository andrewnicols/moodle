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
use GuzzleHttp\Psr7\ServerRequest;
use Psr\Http\Message\RequestInterface;
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

    public function get_path(
        array $parents = [],
    ): string {
        $path = $this->path ?? '';

        if (count($parents)) {
            $parent = array_shift($parents);
            $path = $parent->get_path($parents) . $path;
        }
        return $path;
    }

    public function get_methods(
        ?route $parent = null,
    ): array {
        return array_merge(
            $parent ? $parent->get_methods() : [],
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
        if (count($this->pathtypes) !== count($route->getArguments())) {
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

    public function get_operationid(
        ?route $parentroute = null,
    ): string {
        $operationid = $this->title;
        if ($parentroute) {
            $operationid = $parentroute->get_operationid() . $operationid;
        }
        return $operationid;
    }

    public function get_openapi_description(
        specification $api,
        string $component,
        array $parentcontexts = [],
    ): \stdClass {
        $searchcontexts = [$this, ...$parentcontexts];

        $data = (object) [
            'description' => $this->description,
            'summary' => $this->title,
            'tags' => [$component, ...$this->tags],
            'parameters' => array_map(
                fn($param) => $param->get_openapi_description($api, $component, $searchcontexts),
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
            $data->operationId = sha1(sprintf(
                "%s/%s/%s",
                $method,
                $component,
                $this->get_path($parentcontexts),
            ));
            $methoddata[strtolower($method)] = $data;
        }

        $methoddata['parameters'] = array_map(
            fn ($param) => $param->get_openapi_description($api, $component, $searchcontexts),
            $this->pathtypes,
        );

        return (object) $methoddata;
    }
}
