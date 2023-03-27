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
 * Class communication to manage the base operations of the providers.
 *
 * @package    core_communication
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class communication {

    /**
     * @var null|string The url of the instance avatar
     */
    private null|string $instanceavatarurl = null;

    /**
     * @var settings_data $settingsdata The communication settings object
     */
    private settings_data $settingsdata;

    /**
     * @var array $userids The id of the users
     */
    private array $userids;

    /** @var user_provider|room_provider|room_user_provider The provider class */
    private user_provider|room_provider|room_user_provider $provider;

    // TODO: Why is the avatarurl a runtime option instead of a setting stored in the DB??
    /**
     * Communication room constructor to get the communication features.
     *
     * @param int $instanceid The id of the instance
     * @param string $component The component of the instance
     * @param string $instancetype The type of instance for the component
     * @param string|null $instanceavatarurl The url of the avatar for the instance
     * @param string|null $disableprovider The provider to use for associated tasks after disabled
     * @param array $userids The user ids
     */
    public function __construct(
        int $instanceid,
        string $component,
        string $instancetype,
        string $instanceavatarurl = null,
        string $disableprovider = null,
        array $userids = [],
    ) {
        $this->instanceavatarurl = $instanceavatarurl;
        $this->userids = $userids;
        $this->settingsdata = new settings_data($instanceid, $component, $instancetype);
        if ($disableprovider !== null) {
            // WTF is the disableprovider!?
            // What is going on here?
            $this->settingsdata->provider = $disableprovider;
            $this->settingsdata->disableprovider = $disableprovider;
        }

        $provider = $this->settingsdata->get_provider();
        if (!\core\plugininfo\communication::is_plugin_enabled($provider)) {
            throw new \moodle_exception('communicationproviderdisabled', 'core_communication', '', $provider);
        }
        $providerclass = $this->get_classname_for_provider($provider);
        if (!class_exists($providerclass)) {
            throw new \moodle_exception('communicationproviderclassnotfound', 'core_communication', '', $providerclass);
        }

        $this->provider = new $providerclass($this);
    }

    private function get_classname_for_provider(string $component): string {
        return "{$component}\\communication_feature";
    }

    public function get_settings_data(): settings_data {
        return $this->settingsdata;
    }

    public function get_avatar_url(): ?string {
        return $this->instanceavatarurl;
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
        if ($this->settingsdata->disableprovider === null) {
            $this->get_room_provider()->delete_room();

            // Now delete the local communication record after the deletion if done from the plugin.
            $this->settingsdata->delete();
        }
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
    public function add_members(): void {
        $this->get_room_user_provider()->add_members_to_room($this->userids);
    }

    /**
     * Remove members from room.
     */
    public function remove_members(): void {
        $this->get_room_user_provider()->remove_members_from_room($this->userids);
    }
}
