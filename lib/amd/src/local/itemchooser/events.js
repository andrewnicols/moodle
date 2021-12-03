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

/**
 * Javascript events for the `itemchooser`.
 *
 * @module core/local/itemchooser/events
 * @copyright 2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since 4.1.0
 */

import {dispatchEvent} from 'core/event_dispatcher';

/**
 * Events for the `itemchooser`.
 *
 * @constant
 * @property {String} stateUpdated See {@link event:core/itemchooser/stateUpdated}
 */
export const eventTypes = {
    /**
     * An event triggered when the reactive state has been updated.
     *
     * @event core/itemchooser/stateUpdated
     * @type {CustomEvent}
     * @property {HTMLElement} target The form field which was changed
     * @property {object} detail An object containing details of the update
     */
    stateUpdated: 'core/itemchooser/stateUpdated',
};

/**
 * Trigger an event to notify that the reactive state was updated.
 *
 * @method
 * @param {object} detail
 * @param {HTMLElement} container
 * @returns {CustomEvent}
 * @fires uploadChanged
 */
export const notifyStateUpdated = (detail, container) => dispatchEvent(
    eventTypes.stateUpdated,
    detail,
    container
);
