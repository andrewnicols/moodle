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

use coding_exception;
use core\router\route;
use moodle_exception;
use HTMLPurifier_Exception;
use moodle_url;
use Psr\Http\Message\RequestInterface;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

/**
 * Moodle Router.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class router {
    /** @var ContainerInterface The DI Container */
    protected ContainerInterface $container;

    /** @var App The SlimPHP App */
    protected App $app;

    public function __construct(
        protected string $basepath,
    ) {
        $this->container = container::get_container();
    }

    /**
     * Redirect to the specified URL, carrying all parameters across too.
     *
     * @param string|moodle_url $path
     * @param array $excludeparams Any parameters to exlude from the query params
     * @return never
     */
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

    /**
     * Get the configured SlimPHP Application.
     *
     * @return App
     */
    public function get_app(): App {
        if (!isset($this->app )) {
            $this->app = $this->create_app($this->basepath);
        }

        return $this->app;
    }

    protected function create_app(
        string $basepath = '',
    ): App {
        global $CFG;

        // PHP Does not support autoloading functions.
        require_once("{$CFG->libdir}/nikic/fast-route/src/functions.php");

        // Create an App using the DI Bridge.
        $app = \DI\Bridge\Slim\Bridge::create(
            container: $this->container,
        );
        $this->configure_error_handling($app);

        $app->addBodyParsingMiddleware();


        // TODO: Look into MUC caching instead of a file-based cache.
        if (!$CFG->debugdeveloper) {
            $app->getRouteCollector()->setCacheFile(
                $CFG->cachedir . '/routes.cache',
            );
        }

        $this->configure_routes($app);

        $app->setBasePath($basepath);

        return $app;
    }

    public function handle_request(
        ServerRequestInterface $request,
    ): ResponseInterface {
        return $this->get_app()->handle($request);
    }

    public function serve(): void {
        $this->get_app()->run();
    }

    /**
     * Configure error handling features of Slim.
     *
     * @param App $app
     */
    protected function configure_error_handling(App $app): void {
        $app->add(function(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface {
            global $CFG;

            $developerautoloadpath = $CFG->dirroot . '/vendor/autoload.php';
            if ($CFG->debugdeveloper && file_exists($developerautoloadpath)) {
                require_once($developerautoloadpath);
                $whoopsGuard = new \Zeuxisoo\Whoops\Slim\WhoopsGuard([
                    'enable' => true,
                    'editor' => $CFG->debug_developer_editor ?: null,
                ]);
                $whoopsGuard->setRequest($request);
                $whoopsGuard->install();
            } else {
                // Some other standard error handling.
            }
            return $handler->handle($request);
        });
    }

    protected function configure_routes(App $app): void {
        // Handle the REST API.
        $this->configure_api_routes($app);

        // Middleware to set flags and define setup.
        $app->add(function (RequestInterface $request, $handler) {
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
    }

    protected function configure_api_routes(App $app): void {
        $app->group('/api/rest/v2', function (
            RouteCollectorProxy $group,
        ): void {
            // Add all standard routes.
            $this->add_all_api_routes($group);

            $group->get('/openapi.json', [\core\router\apidocs::class, 'openapi_docs']);
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
    }

    /**
     * Add all routes relating to the REST API.
     *
     * @param RouteCollectorProxy $group
     */
    protected function add_all_api_routes(RouteCollectorProxy $group): void {
        $routedata = $this->get_all_api_routes();
        foreach ($routedata as $data) {
            $group
                ->map(...$data)
                ->setName(implode('::', $data['callable']))
                ->add(function (ServerRequestInterface $request, $handler) use ($data) {
                    // Fetch route information.
                    $classinfo = new \ReflectionClass($data['callable'][0]);
                    $routeattribute = $classinfo->getMethod($data['callable'][1])
                        ->getAttributes(\core\router\route::class)[0]
                        ->newInstance();

                    // Validate the request.
                    $request = $routeattribute->validate_request($request);

                    // Process the remaining middleware to fetch the final repsonse.
                    $response = $handler->handle($request);

                    // Validate the response.
                    $routeattribute->validate_response($response);

                    return $response;
                });

                ;
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

    protected function add_all_user_routes(RouteCollectorProxy $group): void {
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
                    // Add a Route middleware to validate the path, and parameters.
                    $classinfo = new \ReflectionClass($data['callable'][0]);
                    $routeattribute = $classinfo->getMethod($data['callable'][1])
                        ->getAttributes(\core\router\route::class)[0]
                        ->newInstance();
                    $request = $routeattribute->validate_request($request);

                    // Pass to the next Middleware.
                    return $handler->handle($request);
                });
        }
    }

    protected function add_all_shimmed_routes(RouteCollectorProxy $group): void {
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
