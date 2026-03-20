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

namespace core_user\route\controller;

use core\router\route;
use core\router\require_login;
use Psr\Http\Message\ResponseInterface;

/**
 * User dashboard page controller.
 *
 * @package    core_user
 * @copyright  2026 Moodle Pty Ltd
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class dashboard {
    use \core\router\route_controller;

    /**
     * Display the user dashboard.
     *
     * @param ResponseInterface $response
     * @return ResponseInterface
     */
    #[route(
        path: '/dashboard',
        requirelogin: new require_login(
            requirelogin: true,
        ),
    )]
    public function view(
        ResponseInterface $response,
    ): ResponseInterface {
        global $PAGE, $OUTPUT;

        $PAGE->set_pagelayout('mydashboard');
        $PAGE->set_title(get_string('myhome'));
        $PAGE->set_heading(get_string('myhome'));

        $response->getBody()->write($OUTPUT->header());
        $response->getBody()->write($OUTPUT->heading(get_string('myhome')));
        $response->getBody()->write($OUTPUT->footer());

        return $response;
    }
}
