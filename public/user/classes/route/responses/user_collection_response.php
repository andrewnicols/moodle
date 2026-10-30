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

use core\router\schema\objects\collection_object;
use core\router\schema\response\content\payload_response_type;
use core_user\route\schema\user_object;

/**
 * A paginated collection of users.
 *
 * @package    core_user
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class user_collection_response extends \core\router\schema\response\response {
    /**
     * Constructor for a collection of users.
     */
    public function __construct() {
        parent::__construct(
            content: new payload_response_type(
                schema: new collection_object(
                    itemtype: new user_object(),
                ),
            ),
        );
    }
}
