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

namespace communication_matrix;

use core_communication\communication_user_base;
use communication_matrix\matrix_events_manager;

/**
 * Class matrix_user to manage matrix provider users.
 *
 * @package    communication_matrix
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class matrix_user extends communication_user_base {

    /**
     * @var matrix_events_manager $eventmanager The event manager object to get the endpoints
     */
    private matrix_events_manager $eventmanager;

    /**
     * @var matrix_rooms $matrixrooms The matrix room object to update room information
     */
    private matrix_rooms $matrixrooms;

    /**
     * @var string $matrixhomeserverurl The matrix home server url
     */
    private string $matrixhomeserverurl;

    protected function init(): void {
        $this->matrixrooms = new matrix_rooms($this->communication->communicationsettings->get_communication_instance_id());
        $this->eventmanager = new matrix_events_manager($this->matrixrooms->roomid);
    }

    /**
     * Create members.
     *
     * @param array $userids The Moodle user ids to create
     * @return void
     */
    public function create_members(array $userids): void {
        foreach ($userids as $userid) {
            $user = matrix_user_manager::get_moodle_user_data($userid);
            // Proceed if we have a user's full name and email to work with.
            if (!empty($user->fullname) && !empty($user->email)) {
                $json = [
                    'displayname' => $user->fullname,
                    'threepids' => [(object)[
                        'medium' => 'email',
                        'address' => $user->email
                    ]],
                    'external_ids' => []
                ];

                list($qualifiedmuid, $pureusername) = matrix_user_manager::set_qualified_matrix_user_id(
                    $userid,
                    $this->eventmanager->matrixhomeserverurl
                );

                // First create user in matrix.
                $response = $this->eventmanager->request($json)->put($this->eventmanager->get_create_user_endpoint($qualifiedmuid));
                $response = json_decode($response->getBody());

                if (!empty($matrixuserid = $response->name)) {
                    // Then create matrix user id in moodle.
                    matrix_user_manager::add_user_matrix_id_to_moodle($userid, $pureusername);
                    $this->add_registered_matrix_user_to_room($matrixuserid);
                }
            }
        }
    }

    /**
     * Add members to a room.
     *
     * @param array $userids The user ids to add
     * @return void
     */
    public function add_members_to_room(array $userids): void {
        $unregisteredmembers = [];

        foreach ($userids as $userid) {
            $matrixuserid = matrix_user_manager::get_matrixid_from_moodle(
                $userid,
                $this->eventmanager->matrixhomeserverurl
            );
            if ($matrixuserid && $this->check_user_exists($matrixuserid)) {
                $this->add_registered_matrix_user_to_room($matrixuserid);
            } else {
                $unregisteredmembers[] = $userid;
            }
        }

        // Create Matrix users.
        if (count($unregisteredmembers) > 0) {
            $this->create_members($unregisteredmembers);
        }
    }

    /**
     * Adds the registered matrix user id to room.
     *
     * @param string $matrixuserid Registered matrix user id
     * @return void
     */
    private function add_registered_matrix_user_to_room(string $matrixuserid) : void {
        if (!$this->check_room_membership($matrixuserid)) {
            $json = ['user_id' => $matrixuserid];
            $headers = ['Content-Type' => 'application/json'];
            $this->eventmanager->request($json, $headers)->post($this->eventmanager->get_room_membership_join_endpoint());
        }
    }

    /**
     * Remove members from a room.
     *
     * @param array $userids The Moodle user ids to remove
     * @return void
     */
    public function remove_members_from_room(array $userids): void {
        foreach ($userids as $userid) {
            // Check user is member of room first.
            $matrixuserid = matrix_user_manager::get_matrixid_from_moodle(
                $userid,
                $this->eventmanager->matrixhomeserverurl
            );

            // Check if user is the room admin and halt removal of this user.
            $matrixroomdata = $this->eventmanager->request()->get($this->eventmanager->get_room_info_endpoint());
            $matrixroomdata = json_decode($matrixroomdata->getBody(), false, 512, JSON_THROW_ON_ERROR);
            $roomadmin = $matrixroomdata->creator;
            $isadmin = $matrixuserid === $roomadmin;

            if (!$isadmin && $matrixuserid && $this->check_user_exists($matrixuserid) &&
                    $this->check_room_membership($matrixuserid)) {
                $json = ['user_id' => $matrixuserid];
                $headers = ['Content-Type' => 'application/json'];
                $this->eventmanager->request($json, $headers)->post($this->eventmanager->get_room_membership_kick_endpoint());
            }
        }
    }

    /**
     * Check if a user exists in Matrix.
     * Use if user existence is needed before doing something else.
     *
     * @param string $matrixuserid The Matrix user id to check
     * @return bool
     */
    public function check_user_exists(string $matrixuserid): bool {
        $response = $this->eventmanager->request([], [], false)->get($this->eventmanager->get_user_info_endpoint($matrixuserid));
        $response = json_decode($response->getBody());
        return (isset($response->name)) ? true : false;
    }

    /**
     * Check if a user is a member of a room.
     * Use if membership confirmation is needed before doing something else.
     *
     * @param string $matrixuserid The Matrix user id to check
     * @return bool
     */
    public function check_room_membership(string $matrixuserid): bool {
        $response = $this->eventmanager->request([], [], false)->get($this->eventmanager->get_room_membership_joined_endpoint());
        $response = json_decode($response->getBody(), true);
        // Check user id is in the returned room member ids.
        if (isset($response['joined']) && in_array($matrixuserid, array_keys($response['joined']))) {
            return true;
        }
        return false;
    }
}
