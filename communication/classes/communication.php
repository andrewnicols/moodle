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
     * @var string|null The url of the instance avatar
     */
    public string|null $instanceavatarurl = null;

    /**
     * @var communication_room_base $communicationroom The communication room object
     */
    private communication_room_base $communicationroom;

    /**
     * @var communication_settings_data $communicationsettings The communication settings object
     */
    public communication_settings_data $communicationsettings;

    /**
     * @var communication_user_base $communicationuser The communication user object
     */
    public communication_user_base $communicationuser;

    /**
     * @var array $userids The id of the users
     */
    protected array $userids;

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
    public function __construct(int $instanceid, string $component, string $instancetype, string $instanceavatarurl = null,
        string $disableprovider = null, array $userids = []) {
        $this->instanceavatarurl = $instanceavatarurl;
        $this->userids = $userids;
        $this->communicationsettings = new communication_settings_data($instanceid, $component, $instancetype);
        if ($disableprovider !== null) {
            $this->communicationsettings->provider = $disableprovider;
            $this->communicationsettings->disableprovider = $disableprovider;
        }
        $this->init_provider();
    }

    /**
     * Initialize provider room operations.
     *
     * @return void
     */
    protected function init_provider(): void {
        $plugins = \core_component::get_plugin_list_with_class('communication', 'communication_feature',
            'communication_feature.php');

        // Unset the inactive plugins.
        foreach ($plugins as $componentname => $plugin) {
            if (!\core\plugininfo\communication::is_plugin_enabled($componentname)) {
                unset($plugins[$componentname]);
            }
        }

        $pluginnames = array_keys($plugins);
        if (in_array($this->communicationsettings->get_provider(), $pluginnames, true)) {
            $pluginentrypoint = new $plugins[$this->communicationsettings->get_provider()] ();
            $communicationroom = $pluginentrypoint->get_provider_room($this);
            if (!empty($communicationroom)) {
                $this->communicationroom = $communicationroom;
            }
            if (!empty($this->userids)) {
                $communicationuser = $pluginentrypoint->get_provider_user($this);
                if (!empty($communicationuser)) {
                    $this->communicationuser = $communicationuser;
                }
            }
        }
    }

    /**
     * Check if the object and method exists and safe to call.
     * This method will ensure that any call to the plugin is safe and available to call.
     *
     * @param string $objectname
     * @param string $method
     * @return bool
     */
    private function check_object_and_method_exist(string $objectname, string $method): bool {
        return !empty($this->$objectname) && method_exists($this->$objectname, $method);
    }

    /**
     * Create operation for the communication api.
     *
     * @return void
     */
    public function create_room(): void {
        if ($this->check_object_and_method_exist('communicationroom', 'create') &&
                $this->communicationsettings->disableprovider === null) {
            $this->communicationroom->create();
        }
    }

    /**
     * Update operation for the communication api.
     *
     * @return void
     */
    public function update_room(): void {
        if ($this->check_object_and_method_exist('communicationroom', 'update') &&
                $this->communicationsettings->disableprovider === null) {
            $this->communicationroom->update();
        }
    }

    /**
     * Delete operation for the communication api.
     *
     * @return void
     */
    public function delete_room(): void {
        if ($this->communicationsettings->disableprovider === null) {
            if ($this->check_object_and_method_exist('communicationroom', 'delete')) {
                $this->communicationroom->delete();
            }
            // Now delete the local communication record after the deletion if done from the plugin.
            $this->communicationsettings->delete();
        }
    }

    /**
     * Get a room url.
     *
     * @return string|null
     */
    public function get_room_url(): ?string {
        if ($this->check_object_and_method_exist('communicationroom', 'generate_room_url')) {
            return $this->communicationroom->generate_room_url();
        }
        return null;
    }

    /**
     * Add members to the room.
     *
     * @return void
     */
    public function add_members(): void {
        if ($this->check_object_and_method_exist('communicationuser', 'add_members_to_room')) {
            $this->communicationuser->add_members_to_room($this->userids);
        }
    }

    /**
     * Remove members from room.
     *
     * @return void
     */
    public function remove_members(): void {
        if ($this->check_object_and_method_exist('communicationuser', 'remove_members_from_room')) {
            $this->communicationuser->remove_members_from_room($this->userids);
        }
    }
}
