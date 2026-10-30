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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

namespace core_user\route\schema;

use core\param;
use core\router\schema\objects\scalar_type;
use core\router\schema\objects\schema_object;
use core\router\schema\referenced_object;

/**
 * The schema of the key information about a user.
 *
 * @package    core_user
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class user_object extends schema_object implements referenced_object {
    /**
     * Constructor.
     *
     * @param mixed[] ...$extra
     */
    public function __construct(...$extra) {
        $extra['content'] = [
            'id' => new scalar_type(param::INT, required: true),
            'username' => new scalar_type(param::USERNAME),
            'idnumber' => new scalar_type(param::RAW),
            'fullName' => new scalar_type(param::NOTAGS, required: true),
            'firstName' => new scalar_type(param::NOTAGS),
            'lastName' => new scalar_type(param::NOTAGS),
            'firstNamePhonetic' => new scalar_type(param::NOTAGS),
            'lastNamePhonetic' => new scalar_type(param::NOTAGS),
            'middleName' => new scalar_type(param::NOTAGS),
            'alternateName' => new scalar_type(param::NOTAGS),
            'email' => new scalar_type(param::EMAIL),
            'lang' => new scalar_type(param::LANG),
            'confirmed' => new scalar_type(param::BOOL),
            'auth' => new scalar_type(param::AUTH),
            'profileImageUrl' => new scalar_type(param::URL),
            'profileImageUrlSmall' => new scalar_type(param::URL),
            'profileImageAlt' => new scalar_type(param::TEXT),
            'timeZone' => new scalar_type(param::TIMEZONE),
            'timeZonePreference' => new scalar_type(param::TIMEZONE),
            'suspended' => new scalar_type(param::BOOL),
            'deleted' => new scalar_type(param::BOOL),
        ];

        parent::__construct(...$extra);
    }
}
