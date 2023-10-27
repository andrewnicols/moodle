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

namespace core_course\route\shim;

use core\param;
use core\router\route_controller;
use core\router\schema\parameters\query_parameter;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use core\router\route;

/**
 * A shim for the course routes.
 *
 * @package    core_course
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class course_routes {
    use route_controller;

    /**
     * Shim /course/admin.php to /course/admin/{course}.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    #[route(
        path: '/admin.php',
        queryparams: [
            new query_parameter(
                name: 'id',
                type: param::INT,
                description: 'The course ID',
                required: true,
            ),
        ],
    )]
    public function administer_course(
        ServerRequestInterface $request,
        ResponseInterface $response,
    ): ResponseInterface {
        $params = $request->getQueryParams();
        return self::redirect_to_callable(
            $request,
            $response,
            \core_course\route\controller\course_controller::class . '::administer_course',
            pathparams: $params + ['course' => $params['id']],
            excludeparams: ['id'],
        );
    }
}
