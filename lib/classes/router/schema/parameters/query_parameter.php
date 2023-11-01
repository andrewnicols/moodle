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

namespace core\router\schema\parameters;

use core\router\schema\specification;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Routing query parameter for validation.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class query_parameter extends validatable_parameter {
    /**
     * Query parameter constructor to override the location of the parameter.
     *
     * @param array $extra
     */
    public function __construct(
        protected ?bool $allowreserved = null,
        ...$extra,
    ) {
        $extra['in'] = 'query';
        parent::__construct(...$extra);
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
        return $request->withQueryParams($params);
    }

    final public function get_openapi_description(
        specification $api,
        ?string $path = null,
    ): ?\stdClass {
        $data = parent::get_openapi_description($api, $path);

        if ($this->allowreserved) {
            // Determines whether the parameter value SHOULD allow reserved characters, as defined by [RFC3986]
            // :/?#[]@!$&'()*+,;=
            // to be included without percent-encoding.
            // This property only applies to parameters with an in value of query. The default value is false.
            $data->allowReserved = $this->allowreserved;
        }

        return $data;
    }
}
