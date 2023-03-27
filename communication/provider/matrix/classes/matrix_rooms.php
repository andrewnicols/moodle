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

/**
 * Class matrix_rooms to manage the updates to the room information in db.
 *
 * @package    communication_matrix
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class matrix_rooms {

    /**
     * @var null|string $roomid The id of the room from matrix
     */
    public ?string $roomid = null;

    /**
     * @var null|string $roomalias The alias of the room from matrix
     */
    public ?string $roomalias = null;

    /**
     * @var int $commid The id of the communicaiton instance
     */
    public int $commid;


    /**
     * Matrix rooms constructor to load the matrix room information from matrix_rooms table.
     *
     * @param int $commid The id of the communication record
     */
    public function __construct(int $commid) {
        $this->commid = $commid;
        if ($roomrecord = $this->get_matrix_room_data()) {
            $this->roomid = $roomrecord->roomid;
            $this->roomalias = $roomrecord->alias;
        }
    }

    /**
     * Get the matrix room data from database. Either get the data object or return false if no data found.
     *
     * @return \stdClass|bool
     */
    public function get_matrix_room_data(): bool|\stdClass {
        global $DB;
        return $DB->get_record('matrix_rooms', ['commid' => $this->commid]);
    }

    /**
     * Create matrix room data.
     *
     * @return void
     */
    public function create(): void {
        global $DB;
        $roomrecord = new \stdClass();
        $roomrecord->commid = $this->commid;
        $roomrecord->roomid = $this->roomid;
        $roomrecord->alias = $this->roomalias;
        $DB->insert_record('matrix_rooms', $roomrecord);
    }

    /**
     * Update matrix room data.
     *
     * @return void
     */
    public function update(): void {
        global $DB;
        if ($roomrecord = $this->get_matrix_room_data()) {
            $roomrecord->roomid = $this->roomid;
            $roomrecord->alias = $this->roomalias;
            $DB->update_record('matrix_rooms', $roomrecord);
        }
    }

    /**
     * Delete matrix room data.
     *
     * @return void
     */
    public function delete(): void {
        global $DB;
        $DB->delete_records('matrix_rooms', ['commid' => $this->commid]);
    }
}
