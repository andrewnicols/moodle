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

use Psr\Http\Message\ResponseInterface;

/**
 * Moodle Router.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class apidocs {
    /**
     * Constructor for OpenAPI docs.
     *
     * @param \core\openapi $openapi
     */
    public function __construct(
        /** @var \core\openapi The OpenAPI instance */
        private \core\openapi $openapi,
    ) {
    }

    /**
     * Generate the API docs for the API.
     *
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    public function openapi_docs(
        ResponseInterface $response,
    ): ResponseInterface {
        global $PAGE;
        $PAGE->set_context(\core\context\system::instance());

        $api = $this->openapi->get_openapi_specification();

        // At the moment only json is supported. This could be extended to support other formats in future.
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withBody(\GuzzleHttp\Psr7\Utils::streamFor(
                json_encode(
                    $api,
                    JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES,
                ),
            ));
    }
}
