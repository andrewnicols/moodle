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

namespace core_user\route\responses;

use core\router\schema\parameters\etag;
use core\router\schema\response\content\payload_response_type;
use core_user\route\schema\user_object;

/**
 * A single user.
 *
 * @package    core_user
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class user_response extends \core\router\schema\response\response {
    /**
     * Constructor for a user.
     */
    public function __construct() {
        parent::__construct(
            headers: [new etag()],
            content: new payload_response_type(
                schema: new user_object(),
            ),
        );
    }
}
