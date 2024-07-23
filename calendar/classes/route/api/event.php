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

namespace core_calendar\route\api;

use calendar_event;
use core\exception\access_denied_exception;
use core\param;
use core\router\response\empty_response;
use core\router\route;
use core\router\schema\parameters\query_parameter;
use core\router\schema\response\payload_response;
use moodle_database;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Class events
 *
 * @package    core_calendar
 * @copyright  2024 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[route(
    'Manage events',
    path: '/event',
)]
class event {
    /**
     * Create a new instance of the class.
     */
    public function __construct() {
        global $CFG;

        require_once("{$CFG->dirroot}/calendar/lib.php");
    }

    /**
     * Delete an event.
     *
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param moodle_database $database
     * @param calendar_event $event
     * @return ResponseInterface
     */
    #[route(
        path: '/{event}',
        method: 'DELETE',
        pathtypes: [
            new \core_calendar\router\parameters\path_event(),
        ],
        queryparams: [
            new query_parameter(
                name: 'repeat',
                type: param::BOOL,
                required: true,
            ),
        ],
        responses: [
            new empty_response(),
        ],
    )]
    public function delete_event(
        ServerRequestInterface $request,
        ResponseInterface $response,
        calendar_event $event,
    ): ResponseInterface {
        global $DB;

        $repeat = $request->getQueryParams()['repeat'];
        $transaction = $DB->start_delegated_transaction();

        // Let's check if the user is allowed to delete an event.
        if (!calendar_delete_event_allowed($event)) {
            throw new access_denied_exception('nopermissions', 'error', '', get_string('deleteevent', 'calendar'));
        }

        // Time to do the magic.
        $event->delete($repeat);

        // Everything done smoothly, let's commit.
        $transaction->allow_commit();

        return $response->withStatus(204);
    }
}
