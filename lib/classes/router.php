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

use core\openapi\specification;
use core\router\route;
use moodle_url;
use Psr\Http\Message\RequestInterface;
use Slim\Routing\RouteCollectorProxy;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use ReflectionClass;
use Slim\App;

/**
 * Moodle Router.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class router {
    protected ContainerInterface $container;

    public function __construct() {
        $this->container = container::get_container();
    }

    public static function redirect_with_params(
        string|moodle_url $path,
        array $excludeparams = [],
    ): never {
        $params = $_GET;
        $url = new \moodle_url(
            $path,
            $params,
            // TODO Anchor.
        );
        $url->remove_params($excludeparams);

        redirect($url);
    }

    public function get_app(): App {
        global $CFG;

        // PHP Does not support autoloading functions.
        require_once("{$CFG->libdir}/nikic/fast-route/src/functions.php");

        // Create an App using the DI Bridge.
        $app = \DI\Bridge\Slim\Bridge::create(
            container: $this->container,
        );

        $app->addBodyParsingMiddleware();

        // TODO: Look into MUC caching instead of a file-based cache.
        if (!$CFG->debugdeveloper) {
            $app->getRouteCollector()->setCacheFile(
                $CFG->cachedir . '/routes.cache',
            );
        }

        // Handle the REST API.
        $app->group('/api/rest/v2', function (
            RouteCollectorProxy $group,
        ): void {
            // Add all standard routes.
            $this->add_all_api_routes($group);

            $this->get_api_docs($group);

            // Add the OpenAPI generator route.
            // $this->container->get(openapi::class)->add_openapi_generator_routes($group);
        })->add(function (RequestInterface $request, $handler) {
            \core\bootstrap::full_setup();

            $this->get(\moodle_page::class)->set_context(\core\context\system::instance());

            // Add a Middleware to set the CORS headers for all REST Responses.
            $response = $handler->handle($request);
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withHeader('Content-Disposition', 'inline')
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, OPTIONS')
                ->withHeader('Access-Control-Allow-Headers', 'Content-Type, api_key, Authorization');
        });

        // Middleware to set flags and define setup.
        $app->add(function(RequestInterface $request, $handler) {
            global $CFG;
            if (str_contains($request->getUri(), '/api/rest/v2')) {
                define('AJAX_SCRIPT', true);
            }
            \core\bootstrap::full_setup();
            $page = $this->get(\moodle_page::class);
            $page->set_url($request->getUri());

            $response = $handler->handle($request);

            return $response;
        });

        // Add all standard routes.
        $this->add_all_user_routes($app);

        // Add all shimmed routes for things which have been replaced.
        $this->add_all_shimmed_routes($app);

        return $app;
    }

    /**
     * Add all routes relating to the REST API.
     *
     * @param RouteCollectorProxy $group
     */
    protected function add_all_api_routes(RouteCollectorProxy $group): void {
        $routedata = $this->get_all_api_routes();
        foreach ($routedata as $route) {
            $group->map(...$route);
        }
    }

    protected function get_flat_route_data(
        string $componentpath,
        \ReflectionClass $classinfo,
        ?route $parentroute = null,
    ): array {
        $cachedata = [];
        $parentroutedata = $parentroute ? [$parentroute] : [];
        $methods = $classinfo->getMethods();
        foreach ($methods as $method) {
            foreach ($method->getAttributes(\core\router\route::class) as $methodroute) {
                $routeattribute = $methodroute->newInstance();
                $path = $routeattribute->get_path($parentroutedata);
                $methods = $routeattribute->get_methods($parentroute);
                if (empty($methods)) {
                    $methods = ['GET'];
                }
                $cachedata[] = [
                    'methods' => $methods,
                    'pattern' => "/{$componentpath}{$path}",
                    'callable' => [$classinfo->getName(), $method->getName()],
                ];
            }
        }

        return $cachedata;
    }

    protected function get_route_data_for_namespace(
        string $namespace,
        callable $componentpathcallback,
        callable $filtercallback = null,
    ): array {
        $cachedata = [];

        $classes = \core_component::get_component_classes_in_namespace(namespace: $namespace);
        foreach (array_keys($classes) as $classname) {
            $classinfo = new \ReflectionClass($classname);
            if ($filtercallback && !$filtercallback($classname)) {
                continue;
            }
            [$component] = explode('\\', $classinfo->getNamespaceName());
            $componentpath = $componentpathcallback($component);

            $classroutes = $classinfo->getAttributes(\core\router\route::class);
            if ($classroutes) {
                foreach ($classroutes as $classroute) {
                    $parentroute = $classroute->newInstance();
                    $cachedata += $this->get_flat_route_data(
                        $componentpath,
                        $classinfo,
                        $parentroute,
                    );
                }
            } else {
                $cachedata += $this->get_flat_route_data(
                    $componentpath,
                    $classinfo,
                );
            }
        }
        return $cachedata;
    }

    protected function get_all_api_routes(): array {
        $cache = \cache::make('core', 'routes');

        if (!($cachedata = $cache->get('api_routes'))) {
            $cachedata = $this->get_route_data_for_namespace(
                namespace: 'api',
                componentpathcallback: fn($component) => $this->normalise_component_to_path($component, true),
            );

            $cache->set('api_routes', $cachedata);
        }

        return $cachedata;
    }

    protected function get_all_shimmed_routes(): array {
        global $CFG;

        $cache = \cache::make('core', 'routes');

        if (!($cachedata = $cache->get('shimmed_routes'))) {
            $cachedata = $this->get_route_data_for_namespace(
                namespace: 'route\shim',
                componentpathcallback: fn($component) => substr(
                    \core_component::get_component_directory($component),
                    strlen($CFG->dirroot) + 1,
                ),
            );

            $cache->set('shimmed_routes', $cachedata);
        }

        return $cachedata;
    }

    protected function get_all_standard_routes(): array {
        global $CFG;
        $cache = \cache::make('core', 'routes');

        if (!($cachedata = $cache->get('standard_routes'))) {
            $cachedata = $this->get_route_data_for_namespace(
                namespace: 'route',
                componentpathcallback: fn($component) => substr(
                    \core_component::get_component_directory($component),
                    strlen($CFG->dirroot) + 1,
                ),
                filtercallback: fn(string $classname) => !str_contains($classname, '\\shim\\'),
            );

            $cache->set('standard_routes', $cachedata);
        }

        return $cachedata;
    }

    public function add_all_user_routes(RouteCollectorProxy $group): void {
        $routedata = $this->get_all_standard_routes();
        foreach ($routedata as $data) {
            $group
                ->map(
                    methods: $data['methods'],
                    pattern: $data['pattern'],
                    callable: $data['callable'],
                )
                ->setName(implode('::', $data['callable']))
                ->add(function (ServerRequestInterface $request, $handler) use ($data) {
                    $classinfo = new \ReflectionClass($data['callable'][0]);
                    $routeattribute = $classinfo->getMethod($data['callable'][1])
                        ->getAttributes(\core\router\route::class)[0]
                        ->newInstance();
                    // Add a Route middleware to validate the path, and parameters.
                    $request = $routeattribute->validate_request($request);

                    // Pass to the next Middleware.
                    return $handler->handle($request);
                });
        }
    }

    public function add_all_shimmed_routes(RouteCollectorProxy $group): void {
        $routedata = $this->get_all_shimmed_routes();
        foreach ($routedata as $data) {
            $group
                ->map(...$data)
                ->add(function (ServerRequestInterface $request, $handler) use ($data) {
                    $classinfo = new \ReflectionClass($data['callable'][0]);
                    $routeattribute = $classinfo->getMethod($data['callable'][1])
                    ->getAttributes(\core\router\route::class)[0]
                        ->newInstance();
                    // Add a Route middleware to validate the path, and parameters.
                    $request = $routeattribute->validate_request($request);

                    // Pass to the next Middleware.
                    return $handler->handle($request);
                })
                ->add(function(ServerRequestInterface $request, $handler) {
                    \core\notification::add(
                        'This page has been replaced by a newer version. Please update your code.',
                        \core\notification::WARNING,
                    );

                    return $handler->handle($request);
                });
        }
    }

    protected function normalise_component_to_path(
        string $component,
        bool $includecore = true,
    ): string {
        [$type, $subsystem] = \core_component::normalize_component($component);
        if ($type === 'core') {
            if (!$includecore) {
                $component = $subsystem;
            }
        }

        if ($component === null) {
            $component = '';
        }

        return $component;
    }

    public function get_api_docs(RouteCollectorProxy $group): void {
        $group->get('/openapi.json', function(
            ServerRequestInterface $request,
            ResponseInterface $response,
        ): ResponseInterface {
            $api = new specification();

            $classes = \core_component::get_component_classes_in_namespace(namespace: 'api');
            foreach (array_keys($classes) as $classname) {
                $classinfo = new \ReflectionClass($classname);
                [$component] = explode('\\', $classinfo->getNamespaceName());

                $classroutes = $classinfo->getAttributes(\core\router\route::class);
                if ($classroutes) {
                    foreach ($classroutes as $classroute) {
                        $parentroute = $classroute->newInstance();
                        $this->get_api_docs_for_route(
                            component: $component,
                            classinfo: $classinfo,
                            api: $api,
                            parentcontexts: [$parentroute],
                        );
                    }
                } else {
                    $this->get_api_docs_for_route(
                        component: $component,
                        classinfo: $classinfo,
                        api: $api,
                    );
                }
            }

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(
                    json_encode(
                        $api,
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES,
                    ),
                ));
        });
    }

    protected function get_api_docs_for_route(
        string $component,
        ReflectionClass $classinfo,
        specification $api,
        array $parentcontexts = [],
    ): \stdClass {
        $methods = $classinfo->getMethods();

        foreach ($methods as $method) {
            foreach ($method->getAttributes(\core\router\route::class) as $methodroute) {
                $routeattribute = $methodroute->newInstance();

                $api->add_path(
                    component: $component,
                    parentcontexts: $parentcontexts,
                    route: $routeattribute,
                );
            }
        }

        return new \stdClass();
    }

    public static function redirect_to_callable(
        $callable,
        array $params = [],
    ): never {
        $params = array_merge(
            $_GET,
            $params,
        );

        $url = self::get_path_for_callable($callable, $params, $params);

        redirect($url);
    }

    public static function get_route_name_for_callable($callable): string {
        [
            'classinstance' => $instance,
            'methodname' => $methodname,
        ] = self::parse_callable($callable);

        return get_class($instance) . '::' . $methodname;
    }

    protected static function parse_callable($callable): array {
        $container = \core\container::get_container();

        $resolver = $container->get(\Invoker\CallableResolver::class);
        $callable = $resolver->resolve($callable);

        return [
            'classinstance' => $callable[0],
            'methodname' => $callable[1],
        ];
    }

    public static function get_path_for_callable(
        $callable,
        array $params,
        array $queryparams,
    ): moodle_url {
        $container = \core\container::get_container();
        $router = $container->get(self::class);
        $app = $router->get_app();
        $parser = $app->getRouteCollector()->getRouteParser();

        $routename = self::get_route_name_for_callable($callable);

        return new moodle_url(
            url: $parser->urlFor(
                $routename,
                $params,
                $queryparams,
            ),
        );
    }
}
