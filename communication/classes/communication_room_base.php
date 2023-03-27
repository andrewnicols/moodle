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
 * Class communication_room_base to manage the room operations of communication providers.
 *
 * Every plugin that supports room operation must implement/extend this class in the plugin.
 *
 * @package    core_communication
 * @copyright  2023 Safat Shahin <safat.shahin@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
abstract class communication_room_base {

    /**
     * @var communication $communication The communicaiton object.
     */
    protected communication $communication;

    /**
     * Communication room constructor to get the communication object.
     *
     * @param communication $communication The communication object
     */
    public function __construct(communication $communication) {
        $this->communication = $communication;
        $this->init();
    }

    /**
     * Function to allow child classes load objects etc.
     *
     * @return void
     */
    protected function init(): void {
    }

    /**
     * Create a provider room when a new instance is created.
     *
     * @return void
     */
    abstract public function create(): void;

    /**
     * Delete a provider room when a instance is deleted.
     *
     * @return void
     */
    abstract public function delete(): void;

    /**
     * Update a provider room when a instance is updated.
     *
     * @return void
     */
    abstract public function update(): void;

    /**
     * Generate a room url if there is a room.
     *
     * @return string|null
     */
    abstract public function generate_room_url(): ?string;

}
