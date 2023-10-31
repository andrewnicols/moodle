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

namespace core\router\schema\response;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * A Payload Response for a Routed request.
 *
 * This response is a container for a response which contains a set of data.
 * It is used to pass data from a controller to the routing engine, where it will be formatted into the
 * response type requested by the client.
 *
 * This approach is inspired and based upon slim-routing https://github.com/juliangut/slim-routing
 * We only need a fraction of this functionality.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class payload_response extends abstract_response {
    public function __construct(
        private array $payload,
        ServerRequestInterface $request,
        ?ResponseInterface $response = null,
    ) {
        parent::__construct($request, $response);
    }

    /**
     * Get the payload data from the response.
     *
     * @return array 
     */
    public function get_payload(): array {
        return $this->payload;
    }
}
