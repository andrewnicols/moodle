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

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;

trait route_controller {
    /**
     * Constructor for Route Controllers.
     *
     * @param ContainerInterface $container
     */
    public function __construct(
        protected ContainerInterface $container,
    ) {
    }

    /**
     * Create a response for a value not found with an optional message.
     *
     * @param ResponseInterface $response
     * @param string $message
     * @return ResponseInterface
     */
    protected function value_not_found_response(
        ResponseInterface $response,
        string $message = 'Value Not Found',
    ): ResponseInterface {
        return $this->json_response(
            response: $response->withStatus(404),
            data: $message,
        );
    }

    /**
     * Create a response for JSON Content.
     *
     * @param ResponseInterface $response
     * @param mixed $data
     * @return ResponseInterface
     */
    protected function json_response(
        ResponseInterface $response,
        mixed $data,
    ): ResponseInterface {
        [
            'function' => $function,
            'class' => $class,
        ] = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 3)[1];

        $rc = new \ReflectionClass($class);
        $attributes = $rc->getMethod($function)->getAttributes();

        return $response
            ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(
                json_encode($data)
            ));
    }

    protected function page_response(
        ResponseInterface $reponse,
        \core_renderer $renderer,
    ): ResponseInterface {
        return $response;
    }

    protected function redirect(
        ResponseInterface $redirect,
        string|moodle_url $url,
    ): ResponseInterface {
        return $response
            ->withStatus(302)
            ->withHeader('Location', (string) $url);
    }
}
