<?php

namespace core\router;

use GuzzleHttp\Psr7\Utils;
use Invoker\InvokerInterface;
use Jgut\Slim\Routing\Response\PayloadResponse;
use Jgut\Slim\Routing\Response\ResponseType;
use Jgut\Slim\Routing\Response\ViewResponse;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Interfaces\InvocationStrategyInterface;

class controller_invoker implements InvocationStrategyInterface
{
    /** @var InvokerInterface $invoker */

    public function __construct(
        private InvokerInterface $invoker,
    ) {

}
    /**
     * Invoke a route callable.
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
        array $routeargs
    ): ResponseInterface {
        global $OUTPUT;

        // Inject the request and response by parameter name
        $parameters = [
            'request'  => self::inject_route_arguments($request, $routeargs),
            'response' => $response,
        ];

        // Inject the route arguments by name
        $parameters += $routeargs;

        // Inject the attributes defined on the request
        $parameters += $request->getAttributes();

        $result = $this->invoker->call($callable, $parameters);

        if ($result instanceof ResponseInterface) {
            return $result;
        }

        if ($result instanceof PayloadResponse) {
            return $this->handle_payload($request, $result);
        }

        if ($result instanceof ViewResponse) {
            return $respons->withBody(Utils::streamFor(
                // Ideally render_from_tempalte should be capable of streaming?
                $OUTPUT->render_from_template(
                    $result->getTemplate(),
                    $result->getParameters(),
                ),
            ));
        }

        if ($result instanceof ResponseType) {
            return $result->getResponse();
        }

        throw new \coding_exception('Oops');
    }

    private static function inject_route_arguments(
        ServerRequestInterface $request,
        array $routeargs
    ): ServerRequestInterface {
        $requestwithargs = $request;
        foreach ($routeargs as $key => $value) {
            $requestwithargs = $requestwithargs->withAttribute($key, $value);
        }
        return $requestwithargs;
    }

    private function handle_payload(
        RequestInterface $request,
        PayloadResponse $payload,
    ): ResponseInterface {
        $response = $payload->getResponse();

        // Check the request header and emit either JSON or XML.
        $accept = $request->getHeaderLine('Accept');
        if (strpos($accept, 'application/xml') !== false) {
            // return $this->get_xml_response($payload);
        }

        return $this->get_json_response($payload);
    }

    private function get_xml_response(
        PayloadResponse $payload,
    ): ResponseInterface {
        // TODO. Implement this.
        $response = $payload->getResponse();
        $response->getBody()->write((string) $payload->getPayload());
        return $response->withHeader('Content-Type', 'application/xml; charset=utf-8');

    }

    private function get_json_response(
        PayloadResponse $payload,
    ): ResponseInterface {
        $response = $payload->getResponse();
        $response->getBody()->write((string) json_encode(
            $payload->getPayload(),
            $this->get_json_flags(),
        ));
        return $response->withHeader('Content-Type', 'application/json; charset=utf-8');
    }

    private function get_json_flags(): int {
        global $CFG;

        $flags = \JSON_UNESCAPED_SLASHES | \JSON_UNESCAPED_UNICODE | \JSON_PRESERVE_ZERO_FRACTION;

        if ($CFG->debugdeveloper) {
            $flags |= \JSON_PRETTY_PRINT;
        }

        return $flags;
    }
}
