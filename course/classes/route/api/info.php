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

namespace core_course\route\api;

use core\param;
use core\router\response\invalid_parameter_response;
use core\router\route;
use core\router\schema\response\payload_response;
use core\router\schema\response\content\payload_response_type;
use core\router\schema\response\response_type;
use core_user;
use core_user\route\responses\user_preferences_response;
use GuzzleHttp\Psr7\Response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use stdClass;

/**
 * User preference API handler.
 *
 * @package    core
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


class info {

    #[route(
        path: '/{course}',
        title: 'Fetch information about a course',
        pathtypes: [
            new \core\router\parameters\path_course(),
        ],
    )]
    public function get_info(
        ResponseInterface $response,
        ServerRequestInterface $request,
        stdClass $course,
    ): response_type {
        $result = (array) $course;

        return new payload_response($result, $request, $response);
    }
}
