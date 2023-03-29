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

use core_communication\task\add_members_to_room_task;
use core_communication\task\remove_members_from_room_task;
use core_communication\task\create_room_task;
use core_communication\task\delete_room_task;
use core_communication\task\update_room_task;
use stdClass;
use stored_file;

/**
 * Class communication to manage the base operations of the providers.
 *
 * @package    core_communication
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class communication {

    /** @var string The magic 'none' provider */
    public const PROVIDER_NONE = 'none';

    /** @var communication_provider|user_provider|room_provider|room_user_provider The provider class */
    private communication_provider|user_provider|room_provider|room_user_provider $provider;

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

        if (!is_a($providerclass, communication_provider::class, true)) {
            // A the moment we only have one communication provider interface.
            // In future we may have others, at which point we will support the newest first and emit a debugging notice for older ones.
            throw new \moodle_exception('communicationproviderclassinvalid', 'core_communication', '', $providerclass);
        }

        $this->provider = $providerclass::load_for_instance($this);
    }

    public static function create_instance(
        string $provider,
        string $component,
        string $instancetype,
        int $instanceid,
        string $roomname,
    ): self {
        global $DB;

        $record = (object) [
            'provider' => $provider,
            'instanceid' => $instanceid,
            'component' => $component,
            'instancetype' => $instancetype,
            'roomname' => $roomname,
        ];
        $record->id = $DB->insert_record('communication', $record);

        return new self($record);
    }

    public function disable_instance(): void {
        global $DB;

        $DB->set_field('communication', 'provider', self::PROVIDER_NONE, ['id' => $this->instancedata->id]);
    }

    public function update_instance(
        string $roomname,
    ): void {
        global $DB;

        $this->instancedata->roomname = $roomname;
        $DB->update_record('communication', $this->instancedata);
        // TODO - Queue the update room task or not?
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

    /**
     * Load the communication instance by its id.
     *
     * @param int $id
     * @param null|string $provider An optional provider name to use to override the configured provider
     * This parameter is required for adhoc tasks as the provider configuration may have change between the task being queued,
     * and the task executing
     * @return null|communication
     */
    public static function load_by_id(int $id, ?string $provider = null): ?self {
        global $DB;

        if ($record = $DB->get_record('communication', ['id' => $id])) {
            if ($provider) {
                // Override the standard provider.
                $record->provider = $provider;
            }
            return new self($record);
        }

        return null;
    }

    /**
     * Load communication instance by instance configuration.
     *
     * @param string $component
     * @param string $instancetype
     * @param int $instanceid
     * @param null|string $provider An optional provider name to use to override the configured provider
     * This parameter is required for adhoc tasks as the provider configuration may have change between the task being queued,
     * and the task executing
     * @return null|communication
     */
    public static function load_by_instance(
        string $component,
        string $instancetype,
        int $instanceid,
        ?string $provider = null,
    ): ?self {
        global $DB;

        $record = $DB->get_record('communication', [
            'instanceid' => $instanceid,
            'component' => $component,
            'instancetype' => $instancetype,
        ]);

        if ($record) {
            if ($provider) {
                // Override the standard provider.
                $record->provider = $provider;
            }
            return new self($record);
        }

        return null;
    }

    public function get_handler(): communication_handler {
        return new communication_handler($this);
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

    public function get_avatar(): ?stored_file {
        $fs = get_file_storage();
        $file = $fs->get_file(
            (\context_system::instance())->id,
            'core_communication',
            'avatar',
            $this->instancedata->id,
            '/',
            $this->instancedata->avatarfilename,
        );

        return $file ? $file : null;
    }

    protected function get_avatar_filerecord(string $filename): stdClass {
        $context = \context_system::instance();
        return (object) [
            'contextid' => $context->id,
            'component' => 'core_communication',
            'filearea' => 'avatar',
            'itemid' => $this->instancedata->id,
            'filepath' => '/',
            'filename' => $filename,
        ];
    }

    public function set_avatar_from_datauri(string $datauri): void {
        global $DB;

        $context = \context_system::instance();
        $filename = "avatar.svg";

        $fs = get_file_storage();
        $fs->delete_area_files(
            $context->id,
            'core_communication',
            'avatar',
            $this->instancedata->id
        );

        $imagedata = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $datauri));
        $fs->create_file_from_string($this->get_avatar_filerecord($filename), $imagedata);
        $DB->set_field('communication', 'avatarfilename', $filename, ['id' => $this->instancedata->id]);
    }

    public function set_avatar_from_filepath(string $filepath): void {
        global $DB;

        $context = \context_system::instance();
        $extension = pathinfo($filepath, PATHINFO_EXTENSION);
        $filename = "avatar.{$extension}";

        $fs = get_file_storage();
        $fs->delete_area_files(
            $context->id,
            'core_communication',
            'avatar',
            $this->instancedata->id
        );

        $fs->create_file_from_pathname($this->get_avatar_filerecord($extension), $filepath);
        $DB->set_field('communication', 'avatarfilename', $filename, ['id' => $this->instancedata->id]);
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
     * Queue a task to create the room from the current instance data.
     */
    public function create_room(): void {
        $this->require_room_features();
        create_room_task::queue($this);
    }

    /**
     * Queue a task to update the room from the current instance data.
     * TODO: Should we rename this to something like update_room_from_instance?
     */
    public function update_room(): void {
        $this->require_room_features();
        update_room_task::queue($this);
    }

    /**
     * Queue a task to delete the room.
     */
    public function delete_room(): void {
        $this->require_room_features();
        delete_room_task::queue($this);
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
     * Queue a task to add the specified users to the room.
     *
     * @param array $userids
     */
    public function add_members(array $userids): void {
        $this->require_room_user_features();
        add_members_to_room_task::queue($this, $userids)''
    }

    /**
     * Queue a task to remove the specified users to the room.
     *
     * @param array $userids
     */
    public function remove_members(array $userids): void {
        $this->require_room_user_features();
        remove_members_from_room_task::queue($this, $userids);
    }
}
