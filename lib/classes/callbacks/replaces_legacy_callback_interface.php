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

namespace core\callbacks;

/**
 * An interface to indicate that this callback object should replace a legacy callback.
 *
 * This interface should be implemented by any callback object class that is intended to replace a legacy callback.
 *
 * The call_legacy_callback method should be implemented in the callback object class with the code required to call
 * the legacy callback on the specified component.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
interface replaces_legacy_callback_interface {
    /**
     * Call the legacy callback on the specified component.
     *
     * Note: The callback object should be updated as required.
     *
     * No value may be returned from this method.
     *
     * @param string $component The component to call the callback on.
     * @return bool True if the legacy callback was called, false otherwise.
     */
    public function call_legacy_callback(
        string $component,
    ): bool;
}
