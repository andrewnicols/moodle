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

use Psr\Http\Message\ServerRequestInterface;

/**
 * Parameters found in a document body.
 * TODO: These aren't really parameters.
 * https://spec.openapis.org/oas/v3.1.0#request-body-object
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class body_parameter extends validatable_parameter {
    public function __construct(
        ...$args,
    ) {
        $args['in'] = 'query';
        parent::__construct(...$args);
    }


    /**
     * Update the request parameters.
     *
     * @param ServerRequestInterface $request
     * @param array $params
     * @return ServerRequestInterface
     */
    protected function update_request_params(
        ServerRequestInterface $request,
        array $params,
    ): ServerRequestInterface {
        return $request->withParsedBody($params);
    }
}
