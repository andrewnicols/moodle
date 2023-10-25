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

use core\router\path_parameter;
use core\router\query_parameter;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use core\router\route;
use html_writer;
use moodle_database;

class course_routes {
    use \core\router\route_controller;

    #[route(
        path: '/view.php',
        queryparams: [
            new query_parameter(
                name: 'id',
                type: PARAM_INT,
                description: 'The course ID',
            ),
            new query_parameter(
                name: 'idnumber',
                type: PARAM_RAW,
                description: 'The course idnumber',
            ),
            new query_parameter(
                name: 'name',
                type: PARAM_TEXT,
                description: 'The course shortname',
            ),
        ],
    )]
    public function view_course(
        ServerRequestInterface $request,
        ResponseInterface $response,
    ): ResponseInterface {
        if ($this->get_param($request, 'id')) {
            return $this->redirect_to_callable($request, $response, \core_course\route\view_controller::class . '::view_course');
        }
        if ($this->get_param($request, 'idnumber')) {
            return $this->redirect_to_callable($request, $response, \core_course\route\view_controller::class . '::view_course_by_idnumber');
        }
        if ($this->get_param($request, 'name')) {
            return $this->redirect_to_callable($request, $response, \core_course\route\view_controller::class . '::view_course_by_shortname');
        }

        return $this->page_not_found($request, $response);
    }
}
