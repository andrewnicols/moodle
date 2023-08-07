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
use FastRoute\RouteCollector;
use GuzzleHttp\Psr7\Uri;
use Invoker\Reflection\CallableReflection;
use moodle_url;
use Psr\Http\Message\RequestInterface;
use Slim\Routing\RouteCollectorProxy;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use ReflectionClass;
use Slim\App;
use Slim\Routing\RouteContext;

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

        // $app = \DI\Bridge\Slim\Bridge::create();
        $app->addBodyParsingMiddleware();

        // TODO: Configure caching properly.
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
            define('AJAX_SCRIPT', true);

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

        $app->add(function(RequestInterface $request, $handler) {
            \core\bootstrap::full_setup();
            $page = $this->get(\moodle_page::class);

            // TODO - Do this from the Route somehow?
            $response = $handler->handle($request);

            $page->set_url($request->getUri());

            if (!defined('AJAX_SCRIPT') || !AJAX_SCRIPT) {
                $renderer = $this->get(\core_renderer::class);
                $existingcontent = (string) $response->getBody();
                $response = $response->withBody(\GuzzleHttp\Psr7\Utils::streamFor(
                    $renderer->header() .
                    $existingcontent .
                    $renderer->footer(),
                ));
            }

            return $response;
        });

        $this->add_all_user_routes($app);

        $parser = $app->getRouteCollector()->getRouteParser();

        return $app;
    }

    /**
     * Fetch all paths to API components.
     *
     * @return array
     */
    public function get_all_paths(
        string $subpath = 'api',
    ): array {
        global $CFG;

        $componentlist = \core_component::get_component_list();
        $componentpaths = [];
        $componentlist['core']['core'] = $CFG->libdir;
        foreach ($componentlist as $componenttype) {
            $componentsintype = array_filter($componenttype, fn($path) => $path !== null);
            $componentpaths = array_merge(
                $componentpaths,
                array_map(fn($path) => "{$path}/classes/{$subpath}", $componentsintype),
            );
        }

        return $componentpaths;
    }

    public function add_all_api_routes(RouteCollectorProxy $group): void {
        $classes = \core_component::get_component_classes_in_namespace(namespace: 'api');
        foreach (array_keys($classes) as $classname) {
            $classinfo = new \ReflectionClass($classname);
            [$component] = explode('\\', $classinfo->getNamespaceName());

            $classroutes = $classinfo->getAttributes(\core\router\route::class);
            if ($classroutes) {
                foreach ($classroutes as $classroute) {
                    $parentroute = $classroute->newInstance();
                    $this->add_api_routes_for_methods(
                        $group,
                        $component,
                        $classinfo,
                        $parentroute,
                    );
                }
            } else {
                $this->add_api_routes_for_methods(
                    $group,
                    $component,
                    $classinfo,
                );
            }
        }
    }

    public function add_all_user_routes(RouteCollectorProxy $group): void {
        $classes = \core_component::get_component_classes_in_namespace(namespace: 'route');
        foreach (array_keys($classes) as $classname) {
            $classinfo = new \ReflectionClass($classname);

            [$component] = explode('\\', $classinfo->getNamespaceName());

            $classroutes = $classinfo->getAttributes(\core\router\route::class);
            if ($classroutes) {
                foreach ($classroutes as $classroute) {
                    $parentroute = $classroute->newInstance();
                    $this->add_routes_for_methods(
                        $group,
                        $component,
                        $classinfo,
                        $parentroute,
                    );
                }
            } else {
                $this->add_routes_for_methods(
                    $group,
                    $component,
                    $classinfo,
                );
            }
        }
    }

    protected function add_api_routes_for_methods(
        RouteCollectorProxy $group,
        string $component,
        ReflectionClass $classinfo,
        ?route $parentroute = null,
    ): void {
        $methods = $classinfo->getMethods();
        foreach ($methods as $method) {
            foreach ($method->getAttributes(\core\router\route::class) as $methodroute) {
                $routeattribute = $methodroute->newInstance();
                $path = $routeattribute->get_path([$parentroute]);
                $methods = $routeattribute->get_methods($parentroute);
                $group->map(
                    $methods,
                    "/{$component}{$path}",
                    [$classinfo->getName(), $method->getName()],
                )
                ->add(function(ServerRequestInterface $request, $handler) use ($routeattribute) {
                    // Add a Route middleware to validate the path, and parameters.
                    $routeattribute->validate_request($request);

                    // Pass to the next Middleware.
                    return $handler->handle($request);
                })
                ->add(function(ServerRequestInterface $request, $handler) use ($routeattribute) {
                    // Add a Route middleware to response.
                    // This happens after the request has been handled.
                    $response = $handler->handle($request);
                    $routeattribute->validate_response($response);

                    return $response;
                });
            }
        }
    }

    protected function add_routes_for_methods(
        RouteCollectorProxy $group,
        string $component,
        ReflectionClass $classinfo,
        ?route $parentroute = null,
    ): void {
        $methods = $classinfo->getMethods();
        foreach ($methods as $method) {
            foreach ($method->getAttributes(\core\router\route::class) as $methodroute) {
                $routeattribute = $methodroute->newInstance();
                if ($parentroute) {
                    $path = $routeattribute->get_path([$parentroute]);
                } else {
                    $path = $routeattribute->get_path();
                }
                $methods = $routeattribute->get_methods($parentroute);
                if (empty($methods)) {
                    $methods = ['GET'];
                }

                [$type, $subsystem] = \core_component::normalize_component($component);
                if ($type === 'core') {
                    $component = $subsystem;
                }

                $group->map(
                    $methods,
                    "/{$component}{$path}",
                    [$classinfo->getName(), $method->getName()],
                )
                ->setName($classinfo->getName() . '::' . $method->getName())
                ->add(function(ServerRequestInterface $request, $handler) use ($routeattribute) {
                    // Add a Route middleware to validate the path, and parameters.
                    $request = $routeattribute->validate_request($request);

                    // Pass to the next Middleware.
                    return $handler->handle($request);
                })
                ->add(function(ServerRequestInterface $request, $handler) use ($routeattribute) {
                    // Add a Route middleware to response.
                    // This happens after the request has been handled.
                    $response = $handler->handle($request);
                    $routeattribute->validate_response($response);

                    return $response;
                });
            }
        }
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
        $container = \core\container::get_container();

        $resolver = $container->get(\Invoker\CallableResolver::class);
        [
            $classinstance,
            $methodname,
        ] = $resolver->resolve($callable);

        return get_class($classinstance) . '::' . $methodname;
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
