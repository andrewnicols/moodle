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

use core\router\route;
use GuzzleHttp\Psr7\Uri;
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

    /**
     * Create a new Router.
     *
     * @param string $basepath The base path to use for all requests.
     */
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
        $app = router\bridge::create(
            container: $this->container,
        );
        $this->configure_error_handling($app);

        $app->addBodyParsingMiddleware();

        $app->add(function(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface {
            $uri = $request->getUri();
            $path = $uri->getPath();

            if ($path === '') {
                // Ensure that there is always a path.
                $path = '/';
            }

            // Remove duplicate slashes.
            $path = preg_replace('@/+@', '/', $path);

            // Remove trailing slashes.
            $path = rtrim($path, '/');

            if ($uri->getPath() !== $path) {
                // Path has changed. Update it.
                $request = $request->withUri($uri->withPath($path));
            }

            return $handler->handle($request);
        });

        // TODO: Look into MUC caching instead of a file-based cache.
        $app->getRouteCollector()->setCacheFile(
            sprintf(
                "%s/routes.%s.cache",
                $CFG->cachedir,
                sha1($this->basepath),
            ),
        );

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
                $guard = new \Zeuxisoo\Whoops\Slim\WhoopsGuard([
                    'enable' => true,
                    'editor' => $CFG->debug_developer_editor ?: null,
                ]);
                $guard->setRequest($request);
                $guard->install();
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
                    $routeattribute = self::get_route_instance_for_method($data['callable']);

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
    ): array {
        $cachedata = [];
        $methods = $classinfo->getMethods();
        foreach ($methods as $method) {
            if (!$method->isPublic()) {
                continue;
            }
            $routeattribute = self::get_route_instance_for_method(
                [$classinfo->getName(), $method->getName()],
            );

            if ($routeattribute === null) {
                continue;
            }

            $path = $routeattribute->get_path();
            $httpmethods = $routeattribute->get_methods();
            if (empty($httpmethods)) {
                $httpmethods = ['GET'];
            }
            $cachedata[] = [
                'methods' => $httpmethods,
                'pattern' => "/{$componentpath}{$path}",
                'callable' => [$classinfo->getName(), $method->getName()],
            ];
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

            array_push($cachedata, ...$this->get_flat_route_data(
                $componentpath,
                $classinfo,
            ));
        }
        return $cachedata;
    }

    protected function get_all_api_routes(): array {
        $cache = \cache::make('core', 'routes');

        if (!($cachedata = $cache->get('api_routes'))) {
            $cachedata = $this->get_route_data_for_namespace(
                namespace: 'route\api',
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
                namespace: 'route\controller',
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
                        'The URL for this page has changed. Please update your links.',
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

    /**
     * Get the route name for the specified callable.
     *
     * @param mixed $callable
     * @return string
     */
    public static function get_route_name_for_callable($callable): string {
        [
            'classinstance' => $instance,
            'methodname' => $methodname,
        ] = self::parse_callable($callable);

        return get_class($instance) . '::' . $methodname;
    }

    /**
     * Parse the callable into an array of class instance and method name.
     *
     * @param mixed $callable
     * @return array
     */
    protected static function parse_callable($callable): array {
        $container = \core\container::get_container();

        $resolver = $container->get(\Invoker\CallableResolver::class);
        $callable = $resolver->resolve($callable);

        return [
            'classinstance' => $callable[0],
            'methodname' => $callable[1],
        ];
    }

    /**
     * Get the URI path for the specified callable.
     *
     * @param callable $callable the Callable to get the URI for
     * @param array $params Any parameters to include in the path
     * @param array $queryparams Any parameters to include in the query string
     * @return moodle_url
     */
    public static function get_path_for_callable(
        $callable,
        array $params,
        array $queryparams,
    ): moodle_url {
        global $CFG;

        $container = \core\container::get_container();
        $router = $container->get(self::class);
        $app = $router->get_app();
        $parser = $app->getRouteCollector()->getRouteParser();

        $routename = self::get_route_name_for_callable($callable);

        return new moodle_url(
            url: $parser->fullUrlFor(
                new Uri($CFG->wwwroot),
                $routename,
                $params,
                $queryparams,
            ),
        );
    }

    /**
     * Get the instance of the \route\router\route attribute for the specified callable if one is available.
     *
     * @param callable $callable
     * @return null|route The route if one was found.
     */
    public static function get_route_instance_for_method($callable): ?route {
        // Normalise the callable using the resolver.
        // This happens in the same way that Slim does so.
        $container = \core\container::get_container();
        $resolver = $container->get(\Invoker\CallableResolver::class);
        $callable = $resolver->resolve($callable);

        // Locate the Class for this callable.
        $classinfo = new \ReflectionClass($callable[0]);

        // Locate the method for this callable.
        $methodinfo = $classinfo->getMethod($callable[1]);
        if (!$methodinfo) {
            // The method does not exist - could be anonymous somehow?
            return null;
        }

        $methodattributes = $methodinfo->getAttributes(\core\router\route::class);
        $methodroute = $methodattributes ? $methodattributes[0]->newInstance() : null;

        if (!$methodroute) {
            // No route found
            return null;
        }

        $classattributes = $classinfo->getAttributes(\core\router\route::class);
        if ($classattributes) {
            // The class has a #route attribute.
            $methodroute->set_parent($classattributes[0]->newInstance());
        }

        return $methodroute;
    }
}
