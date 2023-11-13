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

use GuzzleHttp\Psr7\Utils;
use Invoker\InvokerInterface;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\App;
use core\router\schema\response;

/**
 * Controller Invoker for the Moodle Router.
 *
 * This class handles invocation of the route callable, and the conversion of the response into an appropriate format.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class controller_invoker extends \DI\Bridge\Slim\ControllerInvoker {
    /** @var ContainerInterface */
    private $container;

    /** @var InvokerInterface */
    private $invoker;

    public function __construct(
        ContainerInterface $container,
        InvokerInterface $invoker,
    ) {
        $this->container = $container;
        $this->invoker = $invoker;
    }

    /**
     * Invoke a route callable.
     *
     * Note: Much of this is copied from the parent class, but we need to handle the response differently.
     *
     * @param callable               $callable       The callable to invoke using the strategy.
     * @param ServerRequestInterface $request        The request object.
     * @param ResponseInterface      $response       The response object.
     * @param array                  $routeargs The route's placeholder arguments
     *
     * @return ResponseInterface|string The response from the callable.
     */
    public function __invoke(
        callable $callable,
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $routeargs,
    ): ResponseInterface {
        // Inject the request and response by parameter name.
        $parameters = [
            'request'  => self::inject_route_arguments($request, $routeargs),
            'response' => $response,
        ];

        // Inject the route arguments by name.
        $parameters += $routeargs;

        // Inject the attributes defined on the request.
        $parameters += $request->getAttributes();

        $result = $this->invoker->call($callable, $parameters);

        return $this
            ->container
            ->get(response_handler::class)
            ->standardise_response($result);
    }

    /**
     * Helper to inject route arguments.
     *
     * This is based on the ControllerInvoker.
     *
     * @param ServerRequestInterface $request 
     * @param array $routeargs 
     * @return ServerRequestInterface 
     */
    private static function inject_route_arguments(
        ServerRequestInterface $request,
        array $routeargs,
    ): ServerRequestInterface {
        $args = $request;
        foreach ($routeargs as $key => $value) {
            if (!$args->getAttribute($key)) {
                $args = $args->withAttribute($key, $value);
            }
        }
        return $args;
    }
}
