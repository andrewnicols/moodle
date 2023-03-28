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

use stdClass;

/**
 * Class communication to manage the base operations of the providers.
 *
 * @package    core_communication
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class communication {

    /** @var user_provider|room_provider|room_user_provider The provider class */
    private user_provider|room_provider|room_user_provider $provider;

    protected function __construct(
        private stdClass $instancedata,
    ) {
        $providercomponent = $this->instancedata->provider;
        if (!\core\plugininfo\communication::is_plugin_enabled($providercomponent)) {
            throw new \moodle_exception('communicationproviderdisabled', 'core_communication', '', $providercomponent);
        }
        $providerclass = $this->get_classname_for_provider($providercomponent);
        if (!class_exists($providerclass)) {
            throw new \moodle_exception('communicationproviderclassnotfound', 'core_communication', '', $providerclass);
        }

        $this->provider = new $providerclass($this);
    }

    public static function create_instance(
        string $provider,
        int $instanceid,
        string $component,
        string $instancetype,
        string $roomname,
        string $avatarurl,
    ): self {
        global $DB;

        $record = (object) [
            'provider' => $provider,
            'instanceid' => $instanceid,
            'component' => $component,
            'instancetype' => $instancetype,
            'roomname' => $roomname,
            'avatarurl' => $avatarurl,
        ];
        $record->id = $DB->insert_record('communication', $record);

        return new self($record);
    }

    public function update_instance(
        string $provider,
        string $roomname,
    ): void {
        global $DB;
        $this->instancedata->provider = $provider;
        $this->instancedata->roomname = $roomname;
        $DB->update_record('communication', $this->instancedata);
    }

    /**
     * Delete communication data.
     *
     * @return void
     */
    public function delete_instance(): void {
        global $DB;
        $DB->delete_records('communication', ['id' => $this->instancedata->id]);
    }

    public static function load_by_id(int $id): ?self {
        global $DB;

        if ($record = $DB->get_record('communication', ['id' => $id])) {
            return new self($record);
        }

        return null;
    }

    public static function load_by_instance(int $instanceid, string $component, string $instancetype): ?self {
        global $DB;

        $record = $DB->get_record('communication', [
            'instanceid' => $instanceid,
            'component' => $component,
            'instancetype' => $instancetype,
        ]);

        if ($record) {
            return new self($record);
        }

        return null;
    }

    private function get_classname_for_provider(string $component): string {
        return "{$component}\\communication_feature";
    }

    /**
     * Get communication instance id after creating the instance in communication table.
     *
     * @return int
     */
    public function get_id(): int {
        return $this->instancedata->id;
    }

    public function get_component(): string {
        return $this->instancedata->component;
    }

    public function get_instanceid(): int {
        return $this->instancedata->instanceid;
    }

    public function get_instancetype(): string {
        return $this->instancedata->instancetype;
    }

    /**
     * Get communication provider.
     *
     * @return string|null
     */
    public function get_provider(): ?string {
        return $this->instancedata->provider;
    }

    /**
     * Get room name.
     *
     * @return string|null
     */
    public function get_room_name(): ?string {
        return $this->instancedata->roomname;
    }

    public function get_avatar_url(): ?string {
        return $this->instancedata->avatarurl;
    }

    public function get_room_provider(): room_provider {
        $this->require_room_features();
        return $this->provider;
    }

    public function get_user_provider(): user_provider {
        $this->require_user_features();
        return $this->provider;
    }

    public function get_room_user_provider(): room_user_provider {
        $this->require_room_features();
        $this->require_user_features();
        $this->require_room_user_features();
        return $this->provider;
    }

    public function supports_user_features(): bool {
        return ($this->provider instanceof user_provider);
    }

    public function supports_room_user_features(): bool {
        if (!$this->supports_user_features()) {
            return false;
        }

        if (!$this->supports_room_features()) {
            return false;
        }

        return ($this->provider instanceof room_user_provider);
    }

    public function require_user_features(): void {
        if (!$this->supports_user_features()) {
            throw new \coding_exception('User features are not supported by the provider');
        }
    }

    public function supports_room_features(): bool {
        return ($this->provider instanceof room_provider);
    }

    public function require_room_features(): void {
        if (!$this->supports_room_features()) {
            throw new \coding_exception('room features are not supported by the provider');
        }
    }

    public function require_room_user_features(): void {
        if (!$this->supports_room_user_features()) {
            throw new \coding_exception('room features are not supported by the provider');
        }
    }

    /**
     * Create operation for the communication api.
     */
    public function create_room(): void {
        $this->get_room_provider()->create_or_update_room();
    }

    /**
     * Update operation for the communication api.
     */
    public function update_room(): void {
        $this->get_room_provider()->create_or_update_room();
    }

    /**
     * Delete operation for the communication api.
     */
    public function delete_room(): void {
        $this->get_room_provider()->delete_room();
    }

    /**
     * Get a room url.
     *
     * @return string
     */
    public function get_room_url(): string {
        return $this->get_room_provider()->get_room_url();
    }

    /**
     * Add members to the room.
     */
    public function add_members(array $userids): void {
        $this->get_room_user_provider()->add_members_to_room($userids);
    }

    /**
     * Remove members from room.
     */
    public function remove_members(array $userids): void {
        $this->get_room_user_provider()->remove_members_from_room($userids);
    }
}
