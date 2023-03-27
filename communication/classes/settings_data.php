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
class settings_data {

    /**
     * @var string $provider The communication provider
     */
    public string $provider = '';

    /**
     * @var string $roomname The room of the room
     */
    public string $roomname = '';

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

    /** @var \stdClass|null $record */
    private ?\stdClass $record = null;

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
        $this->load_record();
    }

    public static function load_by_id(int $id): ?settings_data {
        global $DB;
        $record = $DB->get_record('communication', ['id' => $id]);
        if ($record) {
            return new settings_data($record->instanceid, $record->component, $record->instancetype);
        }
        return null;
    }

    /**
     * Get the communication data from database. Either get the data object or return false if no data found.
     *
     * @return void
     */
    private function load_record(): void {
        global $DB;
        $record = $DB->get_record('communication', [
            'instanceid' => $this->instanceid,
            'component' => $this->component,
            'instancetype' => $this->instancetype,
        ]);

        if ($record) {
            $this->record = $record;
        }
    }

    public function update(string $provider, string $roomname): void {
        global $DB;

        if (empty($this->record)) {
            $this->record = (object) [
                'instanceid' => $this->instanceid,
                'component' => $this->component,
                'instancetype' => $this->instancetype,
                'provider' => $provider,
                'roomname' => $roomname,
            ];
            $this->record->id = $DB->insert_record('communication', $this->record);
        } else {
            $this->record->provider = $provider;
            $this->record->roomname = $roomname;
            $DB->update_record('communication', $this->record);
        }
    }

    /**
     * Get communication instance id after creating the instance in communication table.
     *
     * @return int
     */
    public function get_id(): int {
        return $this->record->id;
    }

    public function get_component(): string {
        return $this->record->component;
    }

    public function get_instanceid(): int {
        return $this->record->instanceid;
    }

    public function get_instancetype(): string {
        return $this->record->instancetype;
    }

    /**
     * Get communication provider.
     *
     * @return string|null
     */
    public function get_provider(): ?string {
        return $this->record->provider;
    }

    /**
     * Get room name.
     *
     * @return string|null
     */
    public function get_room_name(): ?string {
        return $this->record->roomname;
    }

    /**
     * Save the communication settings data.
     *
     * @return void
     */
    public function save(): void {
        global $DB;

        if (empty($this->record)) {
            $this->record = (object) [
                'instanceid' => $this->instanceid,
                'component' => $this->component,
                'instancetype' => $this->instancetype,
                'provider' => $this->provider,
                'roomname' => $this->roomname,
            ];
            $this->record->id = $DB->insert_record('communication', $this->record);
        }
        $DB->update_record('communication', $this->record);
    }

    /**
     * Delete communication data.
     *
     * @return void
     */
    public function delete(): void {
        global $DB;
        $DB->delete_records('communication', ['id' => $this->record->id]);
    }

    /**
     * Check if the record for communication exist or not.
     *
     * @return bool
     */
    public function record_exist(): bool {
        return !empty($this->record);
    }
}
