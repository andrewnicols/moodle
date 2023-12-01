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

use core\router\response\invalid_parameter_response;
use core\router\response\not_found_response;
use core\router\response_handler;
use core\router\route;
use moodle_url;
use Closure;
use GuzzleHttp\Psr7\Uri;
use Psr\Http\Message\RequestInterface;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use Slim\Routing\RouteContext;

/**
 * Moodle Router.
 *
 * This class represents the Moodle Router, which handles all aspects of Routing in Moodle.
 *
 * It should not normally be accessed or used outside of its own unit tests, the route_testcase, and the `r.php` handler.
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

    /** @var bool Whether Moodle is fully loaded or not */
    protected $fullyloaded = false;

    /**
     * Create a new Router.
     *
     * @param string $basepath The base path to use for all requests.
     */
    public function __construct(
        protected string $basepath,
    ) {
    }

    /**
     * Get the DI Container.
     *
     * @return ContainerInterface
     */
    protected function get_container(): ContainerInterface {
        if (!isset($this->container)) {
            $this->container = container::get_container();
        }

        return $this->container;
    }


    /**
     * Redirect to the specified URL, carrying all parameters across too.
     *
     * @param string|moodle_url $path
     * @param array $excludeparams Any parameters to exlude from the query params
     * @return never
     * @codeCoverageIgnore
     */
    public static function redirect_with_params(
        string|moodle_url $path,
        array $excludeparams = [],
    ): never {
        $params = $_GET;
        $url = new \moodle_url(
            $path,
            $params,
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

    /**
     * Create the configured SlimPHP Application.
     *
     * @return App
     */
    protected function create_app(
        string $basepath = '',
    ): App {
        global $CFG;

        // PHP Does not support autoloading functions.
        require_once("{$CFG->libdir}/nikic/fast-route/src/functions.php");

        // Create an App using the DI Bridge.
        $app = router\bridge::create(
            container: $this->get_container(),
        );

        // Add the body parsing middleware from Slim.
        // See https://www.slimframework.com/docs/v4/middleware/body-parsing.html for further information.
        $app->addBodyParsingMiddleware();

        // Add Middleware to Bootstrap Moodle from a request.
        $this->add_bootstrap_middlware($app);

        // Add the Routing Middleware as one of the outer-most middleware.
        // This allows the Route to be accessed before it is handled.
        // See https://www.slimframework.com/docs/v4/cookbook/retrieving-current-route.html for further information.
        $app->addRoutingMiddleware();

        // Add request normalisation middleware to standardise the URI.
        // This must be done after the Routing Middleware to ensure that the route is matched correctly.
        $this->add_request_normalisation_middleware($app);

        $this->configure_caching($app);
        $this->configure_routes($app);

        // Configure the basepath for Moodle.
        $app->setBasePath($basepath);

        return $app;
    }

    /**
     * Add Middleware to normalise the request path.
     *
     * This is required to ensure that the request path is matched correctly and includes:
     * - Removing duplicate slashes
     * - Ensuring that there is a path ('' is not a valid path for '/')
     * - Removing trailing slashes
     *
     * @param App $app
     */
    protected function add_request_normalisation_middleware(App $app): void {
        $app->add(function (ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface {
            $uri = $request->getUri();
            $path = $uri->getPath();

            // Remove duplicate slashes.
            $path = preg_replace('@/+@', '/', $path);

            // Remove trailing slashes.
            $path = rtrim($path, '/');

            // Ensure that there is always a path.
            // Note: This must be performed after handling removal of duplicate and trailing slashes.
            if ($path === '') {
                $path = '/';
            }

            if ($uri->getPath() !== $path) {
                // Path has changed. Update it.
                $request = $request->withUri($uri->withPath($path));
            }

            return $handler->handle($request);
        });
    }

    /**
     * Configure caching for the routes.
     *
     * @param App $app
     */
    protected function configure_caching(App $app): void {
        global $CFG;

        // TODO: Look into MUC caching instead of a file-based cache.
        $app->getRouteCollector()->setCacheFile(
            sprintf(
                "%s/routes.%s.cache",
                $CFG->cachedir,
                sha1($this->basepath),
            ),
        );
    }

    /**
     * Check whether Moodle is fully loaded.
     *
     * @return bool
     */
    public function is_full_moodle_loaded(): bool {
        return $this->fullyloaded;
    }

    /**
     * Load the full Moodle Framework.
     */
    protected function load_full_moodle(): void {
        global $CFG, $DB, $SESSION, $OUTPUT, $PAGE;

        if ($this->is_full_moodle_loaded()) {
            return;
        }

        // Ok, now we need to start normal moodle script, we need to load all libs and $DB.
        if (defined('ABORT_AFTER_CONFIG_CANCEL') && ABORT_AFTER_CONFIG_CANCEL) {
            return;
        }
        define('ABORT_AFTER_CONFIG_CANCEL', true);

        require("{$CFG->dirroot}/lib/setup.php");
        $this->fullyloaded = true;
    }

    /**
     * Handle the specified Request.
     *
     * @param ServerRequestInterface $request
     * @return ResponseInterface
     */
    public function handle_request(
        ServerRequestInterface $request,
    ): ResponseInterface {
        return $this->get_app()->handle($request);
    }

    /**
     * Serve the current request using global variables.
     *
     * @codeCoverageIgnore
     */
    public function serve(): void {
        $this->get_app()->run();
    }

    /**
     * Add Middleware to Bootstrap Moodle from a request.
     *
     * @param App $app
     */
    protected function add_bootstrap_middlware(App $app): void {
        // Middleware to set flags and define setup.
        $router = $this;
        $app->add(function (RequestInterface $request, $handler) use ($router) {
            if (str_contains($request->getUri(), '/api/rest/v2')) {
                define('AJAX_SCRIPT', true);
            }

            $route = router::get_route_instance_for_request($request);
            if ($route && !$route->can_access_cookies()) {
                // This request should not access Moodle cookies.
                define('NO_MOODLE_COOKIES', true);
            }

            if (!$route || !$route->abort_after_config()) {
                // Do not load the full Moodle stack. This is a lightweight request.
                $router->load_full_moodle();
            }

            $page = $this->get(\moodle_page::class);
            $page->set_url((string) $request->getUri());

            return $handler->handle($request);
        });
    }

    /**
     * Configure all routes.
     *
     * @param App $app
     */
    protected function configure_routes(App $app): void {
        // Handle the REST API.
        $this->configure_api_routes($app);

        // Add all standard routes.
        $this->add_all_standard_routes($app);

        // Add all shimmed routes for things which have been replaced.
        $this->add_all_shimmed_routes($app);
    }

    protected function configure_api_routes(App $app): void {
        $router = $this;
        $app->group('/api/rest/v2', function (
            RouteCollectorProxy $group,
        ): void {
            // Add all standard routes.
            $this->add_all_api_routes($group);

            $group->get('/openapi.json', [\core\router\apidocs::class, 'openapi_docs']);
        })->add(function (RequestInterface $request, $handler) use ($router) {
            // TODO Work out how to handle this situation.
            if (!PHPUNIT_TEST) {
                $router->load_full_moodle();
            }

            return $handler->handle($request);
        })->add(function (ServerRequestInterface $request, $handler) {
            try {
                $response = $handler->handle($request);
                // TODO Detect if a user login is required.
            } catch (\required_capability_exception $e) {
                // Capability not met.
                $response = $response->withStatus(403);
            } catch (not_found_exception $e) {
                $response = not_found_response::get_response(
                    $request,
                    $e,
                );
            } catch (\invalid_parameter_exception $e) {
                $response = invalid_parameter_response::get_response(
                    $request,
                    $e,
                );
            }

            return $this
                ->get(response_handler::class)
                ->standardise_response($response);
        })->add(function (RequestInterface $request, $handler): ResponseInterface {
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
                componentpathcallback: fn($component) => $this->normalise_component_to_path($component, false),
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

    protected function add_all_standard_routes(RouteCollectorProxy $group): void {
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
                    $routeattribute = self::get_route_instance_for_method($data['callable']);

                    // $classinfo = new \ReflectionClass($data['callable'][0]);
                    // $routeattribute = $classinfo->getMethod($data['callable'][1])
                    // ->getAttributes(\core\router\route::class)[0]
                    //     ->newInstance();
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

    /**
     * Redirect to the route at the callable supplied.
     *
     * @param callable $callable
     * @param array $params Any parameters to include in the path
     * @codeCoverageIgnore
     */
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
     * Get the route attribute for the specified request.
     *
     * @param ServerRequestInterface $request
     * @return null|route
     */
    protected static function get_route_instance_for_request(ServerRequestInterface $request): ?route {
        $context = RouteContext::fromRequest($request);
        if ($route = $context->getRoute()) {
            return self::get_route_instance_for_method($route->getCallable());
        }

        return null;
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

        if (is_a($callable, Closure::class)) {
            return null;
        }

        // Locate the Class for this callable.
        $classinfo = new \ReflectionClass($callable[0]);

        // Locate the method for this callable.
        $methodinfo = $classinfo->getMethod($callable[1]);
        if (!$methodinfo) {
            // The method does not exist. This shouldn't be possible because the resolver will throw an exception.
            return null; // @codeCoverageIgnore
        }

        $methodattributes = $methodinfo->getAttributes(\core\router\route::class);
        $methodroute = $methodattributes ? $methodattributes[0]->newInstance() : null;

        if (!$methodroute) {
            // No route found.
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
