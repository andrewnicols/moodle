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
 * A communication provider for plugins which support room management.
 *
 * Any communication provider that supports management of room must implement this interface.
 * You will also likely want to implement the following related interfaces:
 * - user_provider
 * - room_user_provider
 *
 * @package    core_communication
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
interface room_provider {
    /**
     * Create a room.
     */
    public function create_room(): void;

    /**
     * Update a room within the provider.
     */
    public function update_room(): void;

    /**
     * Delete a provider room when a instance is deleted.
     */
    public function delete_room(): void;

    /**
     * Generate a room url if there is a room.
     *
     * @return string|null
     */
    public function get_room_url(): ?string;
}
