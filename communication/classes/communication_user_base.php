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
 * Class communication_user_base to manage communication provider users.
 *
 * @package    core_communication
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class communication_user_base {

    /**
     * @var communication $communication The communicaiton object.
     */
    protected communication $communication;

    /**
     * Communication room constructor to get the communication object.
     *
     * @param communication $communication The communication object
     */
    public function __construct(communication $communication) {
        $this->communication = $communication;
        $this->init();
    }

    /**
     * Function to allow child classes load objects etc.
     *
     * @return void
     */
    protected function init(): void {
    }

    /**
     * Create members.
     *
     * @param array $userid The users ids to be created
     * @return void
     */
    public function create_members(array $userid): void {
    }

    /**
     * Add members to communication room.
     *
     * @param array $userids The user ids to be added
     * @return void
     */
    abstract public function add_members_to_room(array $userids): void;

    /**
     * Remove members from room.
     *
     * @param array $userids The user ids to be removed
     * @return void
     */
    abstract public function remove_members_from_room(array $userids): void;

}
