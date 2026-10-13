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

use core\param;
use core\router\schema\objects\collection_object;
use core\router\schema\objects\scalar_type;
use core\router\schema\objects\schema_object;
use core\router\schema\response\content\payload_response_type;

/**
 * A paginated collection of users.
 *
 * @package    core_user
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class user_collection_response extends \core\router\schema\response\response {
    /**
     * Constructor for a collection of users.
     */
    public function __construct() {
        parent::__construct(
            content: new payload_response_type(
                schema: new collection_object(
                    itemtype: new schema_object(
                        content: [
                            'id' => new scalar_type(param::INT, required: true),
                            'username' => new scalar_type(param::RAW),
                            'fullName' => new scalar_type(param::RAW, required: true),
                            'firstName' => new scalar_type(param::RAW),
                            'lastName' => new scalar_type(param::RAW),
                            'email' => new scalar_type(param::RAW),
                            'profileImageUrl' => new scalar_type(param::URL),
                            'profileImageUrlSmall' => new scalar_type(param::URL),
                            'timeZone' => new scalar_type(param::RAW),
                            'suspended' => new scalar_type(param::BOOL),
                            'firstAccess' => new scalar_type(param::RAW),
                            'lastAccess' => new scalar_type(param::RAW),
                        ],
                    ),
                ),
            ),
        );
    }
}
