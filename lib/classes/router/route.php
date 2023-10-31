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

use core\router\schema\parameter;
use core\router\schema\request_body;
use Attribute;

/**
 * Routing attribute.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD)]
class route {
    /** @var string[] The list of HTTP Methods */
    protected null|array $method = null;

    /**
     * The parent route, if relevant.
     *
     * A method-level route may have a class-level route as a parent. The two are combined to provide
     * a fully-qualified path.
     *
     * @var route|null
     */
    protected readonly ?route $parentroute;

    /**
     * Constructor for a new Moodle route.
     *
     * @param null|string $path The path to match
     * @param array|string $method The method, or methods, supported
     * @param array $pathtypes Validators for the path arguments
     * @param mixed $extra Any additional arguments not yet supported in this version of Moodle
     */
    public function __construct(
        /** @var string A title to briefly describe the route (not translated) */
        public readonly string $title = '',

        /** @var string A verbose explanation of the operation behavior (not translated) */
        public readonly string $description = '',

        /** @var string A short summary of what the operation does (not translated) */
        public readonly string $summary = '',

        /** @var array<string> A list of security mechanisms */
        public readonly ?array $security = null,

        /**
         * The path to the route.
         *
         * This is relative to the parent route, if one exists.
         * A route must be set on one, or both, of the class and method level routes.
         *
         * @var string|null
         */
        public ?string $path = null,

        null|array|string $method = null,

        /** @var param[] A list of param types for path arguments */
        public readonly array $pathtypes = [],

        /** @var \core\router\parameter[] A list of query parameters with matching types */
        public readonly array $queryparams = [],

        /** @var \core\router\parameter[] A list of header parameters */
        public readonly array $headerparams = [],

        /** @var \core\router\request_body A list of parameters found in the body */
        public readonly ?request_body $requestbody = null,

        /** @var response[] A list of possible response types */
        public readonly array $responses = [],

        /** @var bool Whether this endpoint is deprecated */
        public readonly bool $deprecated = false,

        /** @var string[] A list of tags */
        public readonly array $tags = [],

        /** @var bool Whether this request may use cookies */
        public readonly bool $cookies = true,

        /** @var bool Whether to abort after configuration */
        public readonly bool $abortafterconfig = false,

        // Note. We do not make use of these extras.
        // These allow us to add additional arguments in future versions, whilst allowing plugins to use this version.
        ...$extra,
    ) {
        // Normalise the method.
        if (is_string($method)) {
            $method = [$method];
        }
        $this->method = $method;

        // Validate the query parameters.
        if (count(array_filter($this->queryparams, fn($pathtype) => !is_a($pathtype, parameter::class)))) {
            throw new \coding_exception('All query parameters must be an instance of \core\router\parameter.');
        }
        if (count(array_filter($this->queryparams, fn($pathtype) => $pathtype->get_in() !== 'query'))) {
            throw new \coding_exception('All query parameters must be in the query.');
        }

        // Validate the path parameters.
        if (count(array_filter($this->pathtypes, fn($pathtype) => !is_a($pathtype, parameter::class)))) {
            throw new \coding_exception('All path parameters must be an instance of \core\router\parameter.');
        }
        if (count(array_filter($this->pathtypes, fn($pathtype) => $pathtype->get_in() !== 'path'))) {
            throw new \coding_exception('All path properties must be in the path.');
        }

        // Validate the header parameters.
        if (count(array_filter($this->headerparams, fn($pathtype) => !is_a($pathtype, parameter::class)))) {
            throw new \coding_exception('All path parameters must be an instance of \core\router\parameter.');
        }
        if (count(array_filter($this->headerparams, fn($pathtype) => $pathtype->get_in() !== 'header'))) {
            throw new \coding_exception('All header properties must be in the path.');
        }
    }

    /**
     * Set the parent route, usually a Class-level route.
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
     * This includes the path of any parent route.
     *
     * @return string
     */
    public function get_path(): string {
        $path = $this->path ?? '';

        if (isset($this->parentroute)) {
            $path = $this->parentroute->get_path() . $path;
        }
        return $path;
    }

    /**
     * Get the list of HTTP methods associated with this route.
     *
     * @param null|string[] $default The default methods to use if none are set
     * @return null|string[]
     */
    public function get_methods(?array $default = null): ?array {
        $methods = $this->method;

        if (isset($this->parentroute)) {
            $parentmethods = $this->parentroute->get_methods();
            if ($methods) {
                $methods = array_unique(
                    array_merge($parentmethods ?? [], $methods),
                );
            } else {
                $methods = $parentmethods;
            }
        }

        // If there are no methods from either this attribute or any parent, use the default.
        $methods = $methods ?? $default;

        if ($methods) {
            sort($methods);
        }

        return $methods;
    }

    /**
     * Get the list of path parameters, including any from the parent.
     *
     * @return array
     */
    public function get_path_parameters(): array {
        $parameters = [];
        if (isset($this->parentroute)) {
            $parameters = $this->parentroute->get_path_parameters();
        }
        foreach ($this->pathtypes as $parameter) {
            $parameters[$parameter->get_name()] = $parameter;
        }

        return $parameters;
    }

    /**
     * Whether this route expects a request body.
     *
     * @return bool
     */
    public function has_request_body(): bool {
        return $this->requestbody !== null;
    }

    /**
     * Whether this route expects any validatable parameters.
     * That is, any parameter in the path, query params, or the reqeust body.
     *
     * @return bool
     */
    public function has_any_validatable_parameter(): bool {
        return count($this->pathtypes) || count($this->queryparams) || $this->requestbody;
    }
}
