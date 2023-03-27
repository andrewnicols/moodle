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
 * Class communication_settings_data to manage the communication settings data in db.
 *
 * @package    core_communication
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class communication_settings_data {

    /**
     * @var string $provider The communication provider
     */
    public string $provider = '';

    /**
     * @var string $roomname The room of the room
     */
    public string $roomname = '';

    /**
     * @var bool $recordexist The record available or not
     */
    public bool $recordexist = false;

    /**
     * @var int $id The id of the communication instance
     */
    public int $id;

    /**
     * @var int $instanceid The instance id of the associated element
     */
    public int $instanceid;

    /**
     * @var string $component The component of the instance eg 'core_course'
     */
    public string $component;

    /**
     * @var string $instancetype The type of the instance for the component
     */
    public string $instancetype;

    /**
     * @var ?string The disables provider use after updating associated tasks.
     */
    public ?string $disableprovider = null;

    /**
     * Communication data constructor to load the communication information from communication table.
     *
     * @param int $instanceid The id of the instance
     * @param string $component The component of the instance
     * @param string $instancetype The id of the communication record
     */
    public function __construct(int $instanceid, string $component, string $instancetype) {
        $this->instanceid = $instanceid;
        $this->component = $component;
        $this->instancetype = $instancetype;

        if (!empty($this->instanceid) && !empty($this->component) && !empty($this->instancetype) &&
                $commrecord = $this->get_communication_data_from_instance($this->instanceid, $this->component,
                        $this->instancetype)) {

            $this->set_communication_data($commrecord);
        }
    }

    /**
     * Set the data to the object.
     *
     * @param \stdClass $commrecord The communication record from db
     */
    public function set_communication_data(\stdClass $commrecord): void {
        $this->id = $commrecord->id;
        $this->instanceid = $commrecord->instanceid;
        $this->component = $commrecord->component;
        $this->instancetype = $commrecord->instancetype;
        $this->provider = $commrecord->provider;
        $this->roomname = $commrecord->roomname;
    }

    /**
     * Get the communication data from database. Either get the data object or return false if no data found.
     *
     * @param int $instanceid The id of the instance
     * @param string $component The component of the instance
     * @param string $instancetype The id of the communication record
     * @return \stdClass|bool
     */
    public function get_communication_data_from_instance(int $instanceid, string $component, string $instancetype): bool|\stdClass {
        global $DB;
        $record = $DB->get_record('communication',
                ['instanceid' => $instanceid, 'component' => $component, 'instancetype' => $instancetype]);
        if ($record) {
            $this->recordexist = true;
        }
        return $record;
    }

    /**
     * Get communication instance id after creating the instance in communication table.
     *
     * @return int
     */
    public function get_communication_instance_id(): int {
        return $this->id;
    }

    /**
     * Get communication provider.
     *
     * @return string|null
     */
    public function get_provider(): ?string {
        return $this->provider;
    }

    /**
     * Get room name.
     *
     * @return string|null
     */
    public function get_room_name(): ?string {
        return $this->roomname;
    }

    /**
     * Save the communication settings data.
     *
     * @return void
     */
    public function save(): void {
        global $DB;
        if ($this->recordexist) {
            $DB->update_record('communication', $this);
        } else {
            $commrecord = new \stdClass();
            $commrecord->instanceid = $this->instanceid;
            $commrecord->component = $this->component;
            $commrecord->instancetype = $this->instancetype;
            $commrecord->provider = $this->provider;
            $commrecord->roomname = $this->roomname;
            $this->id = $DB->insert_record('communication', $commrecord);
            $this->recordexist = true;
        }
    }

    /**
     * Delete communication data.
     *
     * @return void
     */
    public function delete(): void {
        global $DB;
        $DB->delete_records('communication', ['id' => $this->id]);
        $this->recordexist = false;
    }

    /**
     * Check if the record for communication exist or not.
     *
     * @return bool
     */
    public function record_exist(): bool {
        return $this->recordexist;
    }

}
