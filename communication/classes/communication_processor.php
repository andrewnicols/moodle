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
use stored_file;

/**
 * Class communication_processor to manage the base operations of the providers.
 *
 * This class is responsible for creating, updating, deleting and loading the communication instance, associated actions.
 *
 * @package    core_communication
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class communication_processor {

    /** @var string The magic 'none' provider */
    public const PROVIDER_NONE = 'none';

    /** @var null|communication_provider|user_provider|room_chat_provider|room_user_provider The provider class */
    private communication_provider|user_provider|room_chat_provider|room_user_provider|null $provider = null;

    /**
     * Communication processor constructor.
     *
     * @param stdClass $instancedata The instance data object
     */
    protected function __construct(
        private stdClass $instancedata,
    ) {
        $providercomponent = $this->instancedata->provider;
        if ($providercomponent !== self::PROVIDER_NONE) {
            if (!\core\plugininfo\communication::is_plugin_enabled($providercomponent)) {
                throw new \moodle_exception('communicationproviderdisabled', 'core_communication', '', $providercomponent);
            }
            $providerclass = $this->get_classname_for_provider($providercomponent);
            if (!class_exists($providerclass)) {
                throw new \moodle_exception('communicationproviderclassnotfound', 'core_communication', '', $providerclass);
            }

            if (!is_a($providerclass, communication_provider::class, true)) {
                // At the moment we only have one communication provider interface.
                // In the future, we may have others, at which point we will support the newest first and
                // emit a debugging notice for older ones.
                throw new \moodle_exception('communicationproviderclassinvalid', 'core_communication', '', $providerclass);
            }

            $this->provider = $providerclass::load_for_instance($this);
        }
    }

    /**
     * Create communication instance.
     *
     * @param string $provider The communication provider
     * @param int $instanceid The instance id
     * @param string $component The component name
     * @param string $instancetype The instance type
     * @param string $roomname The room name
     * @return communication_processor
     */
    public static function create_instance(
        string $provider,
        int $instanceid,
        string $component,
        string $instancetype,
        string $roomname,
    ): self {
        global $DB;

        $record = (object) [
            'provider' => $provider,
            'instanceid' => $instanceid,
            'component' => $component,
            'instancetype' => $instancetype,
            'roomname' => $roomname,
            'avatarfilename' => null,
        ];
        $record->id = $DB->insert_record('communication', $record);

        return new self($record);
    }

    /**
     * Update communication instance.
     *
     * @param string $provider The communication provider
     * @param string $roomname The room name
     */
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
     */
    public function delete_instance(): void {
        global $DB;
        $DB->delete_records('communication', ['id' => $this->instancedata->id]);
    }

    /**
     * Get existing instance user ids.
     *
     * @return array
     */
    public function get_existing_instance_users(): array {
        global $DB;
        return $DB->get_fieldset_select('communication_user', 'userid', 'commid = ?', [$this->instancedata->id]);
    }

    /**
     * Create communication user record for mapping and sync.
     *
     * @param array $userids The user ids
     */
    public function create_instance_user_mapping(array $userids): void {
        global $DB;

        // Check if user ids exits in existing user ids.
        $userids = array_diff($userids, $this->get_existing_instance_users());

        foreach ($userids as $userid) {
            $record = (object) [
                'commid' => $this->instancedata->id,
                'userid' => $userid,
            ];
            $DB->insert_record('communication_user', $record);
        }
    }

    /**
     * Update communication user record for mapping and sync.
     *
     * @param array $userids The user ids
     * @param int $synced The synced status
     */
    public function update_instance_user_mapping(array $userids, int $synced = 1): void {
        global $DB;

        foreach ($userids as $userid) {
            // Check if the user exists in the communication_user table.
            $communicationuserdata = $DB->get_record('communication_user', [
                'commid' => $this->instancedata->id,
                'userid' => $userid
            ]);

            // Create the data if not there.
            if (!$communicationuserdata) {
                $this->create_instance_user_mapping([$userid]);
                return;
            }

            $record = (object) [
                'id' => $communicationuserdata->id,
                'synced' => $synced,
            ];
            $DB->update_record('communication_user', $record);
        }
    }

    /**
     * Delete communication user record for userid.
     *
     * @param array $userids The user ids
     */
    public function delete_instance_user_mapping(array $userids): void {
        global $DB;

        foreach ($userids as $userid) {
            $DB->delete_records('communication_user', [
                'commid' => $this->instancedata->id,
                'userid' => $userid
            ]);
        }

    }

    /**
     * Delete communication user record for instance.
     */
    public function delete_user_mappings_for_instance(): void {
        global $DB;
        $DB->delete_records('communication_user', [
            'commid' => $this->instancedata->id,
        ]);
    }

    /**
     * Load communication instance by id.
     *
     * @param int $id The communication instance id
     * @param string|null $provoderoverride The provider override for getting the disabled provider object
     * @return communication_processor|null
     */
    public static function load_by_id(int $id, ?string $provoderoverride = null): ?self {
        global $DB;

        if ($record = $DB->get_record('communication', ['id' => $id])) {

            if ($provoderoverride && $provoderoverride !== self::PROVIDER_NONE) {
                $record->provider = $provoderoverride;
            }

            return new self($record);
        }

        return null;
    }

    /**
     * Load communication instance by instance id.
     *
     * @param string $component The component name
     * @param string $instancetype The instance type
     * @param int $instanceid The instance id
     * @param string|null $provoderoverride The provider override for getting the disabled provider object
     * @return communication_processor|null
     */
    public static function load_by_instance(
        string $component,
        string $instancetype,
        int $instanceid,
        ?string $provoderoverride = null): ?self {

        global $DB;

        $record = $DB->get_record('communication', [
            'instanceid' => $instanceid,
            'component' => $component,
            'instancetype' => $instancetype,
        ]);

        if ($record) {

            if ($provoderoverride && $provoderoverride !== self::PROVIDER_NONE) {
                $record->provider = $provoderoverride;
            }

            return new self($record);
        }

        return null;
    }

    /**
     * Get communication provider class name.
     *
     * @param string $component The component name.
     * @return string
     */
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

    /**
     * Get communication instance id.
     *
     * @return string
     */
    public function get_component(): string {
        return $this->instancedata->component;
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

    /**
     * Get communication instance id.
     *
     * @return room_chat_provider
     */
    public function get_room_provider(): room_chat_provider {
        $this->require_room_features();
        return $this->provider;
    }

    /**
     * Get communication instance id.
     *
     * @return user_provider
     */
    public function get_user_provider(): user_provider {
        $this->require_user_features();
        return $this->provider;
    }

    /**
     * Get communication instance id.
     *
     * @return room_user_provider
     */
    public function get_room_user_provider(): room_user_provider {
        $this->require_room_features();
        $this->require_room_user_features();
        return $this->provider;
    }

    /**
     * Get communication instance id.
     *
     * @return bool
     */
    public function supports_user_features(): bool {
        return ($this->provider instanceof user_provider);
    }

    /**
     * Get communication instance id.
     *
     * @return bool
     */
    public function supports_room_user_features(): bool {
        if (!$this->supports_user_features()) {
            return false;
        }

        if (!$this->supports_room_features()) {
            return false;
        }

        return ($this->provider instanceof room_user_provider);
    }

    /**
     * Get communication instance id.
     */
    public function require_user_features(): void {
        if (!$this->supports_user_features()) {
            throw new \coding_exception('User features are not supported by the provider');
        }
    }

    /**
     * Get communication instance id.
     *
     * @return bool
     */
    public function supports_room_features(): bool {
        return ($this->provider instanceof room_chat_provider);
    }

    /**
     * Get communication instance id.
     */
    public function require_room_features(): void {
        if (!$this->supports_room_features()) {
            throw new \coding_exception('room features are not supported by the provider');
        }
    }

    /**
     * Get communication instance id.
     */
    public function require_room_user_features(): void {
        if (!$this->supports_room_user_features()) {
            throw new \coding_exception('room features are not supported by the provider');
        }
    }

    /**
     * Get communication instance id.
     *
     * @return bool|\stored_file
     */
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

    /**
     * Get a room url.
     *
     * @return string|null
     */
    public function get_room_url(): ?string {
        if ($this->provider) {
            return $this->get_room_provider()->get_chat_room_url();
        }
        return null;
    }
}
