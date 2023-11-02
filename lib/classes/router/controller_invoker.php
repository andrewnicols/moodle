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
        global $OUTPUT;

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

        if ($result instanceof ResponseInterface) {
            // An object implementing ResponseInterface is returned, so we can just return it.
            return $result;
        }

        if ($result instanceof response\payload_response) {
            // A payload response is returned, so we need to handle it as a payload and convert it according to the
            // format requested in the request.
            return $this->handle_payload($result);
        }

        if ($result instanceof response\view_response) {
            // A ViewResponse is returned, so we need to render the template and return it as a response.
            return $response->withBody(Utils::streamFor(
                $OUTPUT->render_from_template(
                    $result->get_template_name(),
                    $result->get_parameters(),
                ),
            ));
        }

        if ($result instanceof response\response_type) {
            return $result->get_response();
        }

        throw new \coding_exception('Unknown response type');
    }

    private static function inject_route_arguments(
        ServerRequestInterface $request,
        array $routeargs,
    ): ServerRequestInterface {
        $args = $request;
        foreach ($routeargs as $key => $value) {
            $args = $args->withAttribute($key, $value);
        }
        return $args;
    }

    /**
     * Handle the response to a payload and convert it to the requested format.
     *
     * @param payload_response $payload
     * @return ResponseInterface
     */
    private function handle_payload(
        response\payload_response $payload,
    ): ResponseInterface {
        // Check the request header and emit either JSON or XML.
        $accept = $payload->get_request()->getHeaderLine('Accept');
        if (strpos($accept, 'application/xml') !== false) {
            // return $this->get_xml_response($payload);
        }

        return $this->get_json_response($payload);
    }

    private function get_xml_response(
        response\payload_response $payload,
    ): ResponseInterface {
        // TODO. Implement this.
        $response = $payload->get_response();
        $response->getBody()->write((string) $payload->get_payload());
        return $response->withHeader('Content-Type', 'application/xml; charset=utf-8');

    }

    /**
     * Handle the payload as JSON and return a JSON-formatted output.
     *
     * @param payload_response $payload
     * @return ResponseInterface
     */
    private function get_json_response(
        response\payload_response $payload,
    ): ResponseInterface {
        $response = $this->get_response($payload);
        $response->getBody()->write((string) json_encode(
            $payload->get_payload(),
            $this->get_json_flags(),
        ));
        return $response->withHeader('Content-Type', 'application/json; charset=utf-8');
    }

    /**
     * Get the flags to use when encoding JSON.
     *
     * @return int
     */
    private function get_json_flags(): int {
        global $CFG;

        $flags = \JSON_UNESCAPED_SLASHES | \JSON_UNESCAPED_UNICODE | \JSON_PRESERVE_ZERO_FRACTION;

        if ($CFG->debugdeveloper) {
            $flags |= \JSON_PRETTY_PRINT;
        }

        return $flags;
    }

    private function get_response(
        response\response_type $responsetype,
    ): ResponseInterface {
        $response = $responsetype->get_response();
        if ($response) {
            return $response;
        }

        $app = $this->container->get(App::class);
        $factory = $app->getResponseFactory();
        return $factory->createResponse();
    }
}
