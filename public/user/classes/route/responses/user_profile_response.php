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
use core\router\schema\objects\scalar_type;
use core\router\schema\objects\schema_object;
use core\router\schema\response\content\payload_response_type;

/**
 * The profile information about a user.
 *
 * @package    core_user
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class user_profile_response extends \core\router\schema\response\response {
    /**
     * Constructor for a user profile.
     */
    public function __construct() {
        parent::__construct(
            content: new payload_response_type(
                schema: new schema_object(
                    content: [
                        'city' => new scalar_type(param::RAW),
                        'country' => new scalar_type(param::RAW),
                        'institution' => new scalar_type(param::RAW),
                        'department' => new scalar_type(param::RAW),
                        'phone' => new scalar_type(param::RAW),
                        'mobilePhone' => new scalar_type(param::RAW),
                        'address' => new scalar_type(param::RAW),
                        'description' => new scalar_type(param::RAW),
                        'descriptionFormat' => new scalar_type(param::INT),
                    ],
                ),
            ),
        );
    }
}
