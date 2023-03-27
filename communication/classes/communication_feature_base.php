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

namespace core_communication;

/**
 * Class communication_feature_base to manage communication provider features from provider plugins.
 *
 * Every provider plugin should implement this class to return the implemented room and user objects.
 *
 * @package    core_communication
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class communication_feature_base {

    /**
     * Get the provider room object.
     *
     * @param communication $communication The communication object
     * @return communication_room_base|null
     */
    public function get_provider_room(communication $communication): ?communication_room_base {
        return null;
    }

    /**
     * Get the provider user object.
     *
     * @param communication $communication The communication object
     * @return communication_user_base|null
     */
    public function get_provider_user(communication $communication): ?communication_user_base {
        return null;
    }

}
