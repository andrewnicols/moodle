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

use core_communication\communication_room_base;

/**
 * Class communication_room to manage the room operation of matrix provider.
 *
 * @package    communication_matrix
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class matrix_room_manager extends communication_room_base {

    /**
     * @var matrix_events_manager $eventmanager The event manager object to get the endpoints
     */
    private matrix_events_manager $eventmanager;

    /**
     * @var matrix_rooms $matrixrooms The matrix room object to update room information
     */
    private matrix_rooms $matrixrooms;

    protected function init(): void {
        $this->matrixrooms = new matrix_rooms($this->communication->communicationsettings->get_communication_instance_id());
        $this->eventmanager = new matrix_events_manager($this->matrixrooms->roomid);
    }

    public function create(): void {
        $alias = str_replace(' ', '', $this->communication->communicationsettings->get_room_name());
        $json = [
            'name' => $this->communication->communicationsettings->get_room_name(),
            'visibility' => 'private',
            'preset' => 'private_chat',
            'room_alias_name' => $alias,
            'initial_state' => [],
        ];

        $response = $this->eventmanager->request($json)->post($this->eventmanager->get_create_room_endpoint());
        $response = json_decode($response->getBody());

        if (!empty($roomid = $response->room_id)) {
            $this->matrixrooms->commid = $this->communication->communicationsettings->get_communication_instance_id();
            $this->matrixrooms->roomid = $roomid;
            $this->matrixrooms->roomalias = '#' . $alias . ':' .
                    matrix_user_manager::set_matrix_home_server($this->eventmanager->matrixhomeserverurl);
            $this->matrixrooms->create();
            $this->eventmanager->roomid = $roomid;
        } else {
            throw new \coding_exception('Can not create record without room id.');
        }

        $this->update_room_avatar();
    }

    public function delete(): void {
        $this->matrixrooms->delete();
    }

    public function update(): void {
        $matrixroomdata = $this->eventmanager->request()->get($this->eventmanager->get_room_info_endpoint());
        $matrixroomdata = json_decode($matrixroomdata->getBody(), false, 512, JSON_THROW_ON_ERROR);

        // Update the room name when its updated from the form.
        if ($matrixroomdata->name !== $this->communication->communicationsettings->get_room_name()) {
            $this->update_room_name();
        }

        // Update room avatar.
        $this->update_room_avatar();
    }

    /**
     * Update the matrix room name when a instance shortname is changed.
     *
     * @return void
     */
    public function update_room_name(): void {
        $json = ['name' => $this->communication->communicationsettings->get_room_name()];
        $this->eventmanager->request($json)->put($this->eventmanager->get_update_room_name_endpoint());
    }

    /**
     * Update the room avatar when an instance image is added or updated.
     *
     * @return void
     */
    public function update_room_avatar(): void {
        $instanceimage = $this->communication->instanceavatarurl;
        $contenturi = null;
        // If avatar is set for the instance, update in matrix.
        if (!empty($instanceimage)) {
            $instanceimage = file_get_contents($instanceimage);
            // First upload the content.
            $contenturi = $this->eventmanager->upload_matrix_content($instanceimage);
        }
        // Now update the room avatar.
        $json = [
            'url' => $contenturi,
        ];
        $this->eventmanager->request($json)->put($this->eventmanager->get_update_avatar_endpoint());
    }

    /**
     * Generate a room url if there is a room.
     *
     * @return string|null
     */
    public function generate_room_url(): ?string {
        // Check for room record in Moodle and that it exists in Matrix.
        if (!$this->matrixrooms->roomalias) {
            return null;
        }
        return $this->eventmanager->matrixwebclienturl . '#/room/' . $this->matrixrooms->roomalias;
    }

    /**
     * Check if a room exists in Matrix by comparing Moodle's and Matrix's room ids.
     *
     * @return bool
     */
    public function check_room_exists(): bool {
        $response = $this->eventmanager->request([], [], false)->get($this->eventmanager->get_room_info_endpoint());
        if ($response->getStatusCode() === 200) {
            $response = json_decode($response->getBody());
            // Check we have matching room ids.
            if ($response->room_id === $this->matrixrooms->roomid) {
                return true;
            }
        }
        return false;
    }
}
