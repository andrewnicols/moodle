// This file is part of Moodle - http://moodle.org/ //
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
 * Core Events.
 *
 * @module     core/events
 * @copyright  2021 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      3.11
 */

import {dispatchEvent} from 'core/local/event/dispatcher';

/**
 * The list of defined event types.
 *
 * @public
 * @readonly
 * @constant
 * @property {string} drawerShown This event is triggered when a drawer was shown.
 * @property {string} drawerHidden This event is triggered when a drawer was hidden.
 * @property {string} checkboxToggleToggled This event is triggered when a checkbox-toggleall is toggled.
 */
export const eventTypes = {
    drawerShown: 'core/drawerShown',
    drawerHidden: 'core/drawerHidden',
    checkboxToggleToggled: 'core/checkboxToggleToggled',
};

/**
 * Trigger an event to indicate that a drawer was shown.
 *
 * @method notifyDrawerShown
 * @public
 * @param {HTMLElement} element The HTMLElement containing the drawer.
 * @returns {CustomEvent}
 */
export const notifyDrawerShown = element => dispatchEvent(eventTypes.drawerShown, {}, element);

/**
 * Trigger an event to indicate that a drawer was hidden.
 *
 * @method notifyDrawerHidden
 * @public
 * @param {HTMLElement} element The HTMLElement containing the drawer.
 * @returns {CustomEvent}
 */
export const notifyDrawerHidden = element => dispatchEvent(eventTypes.drawerHidden, {}, element);

/**
 * Trigger an event to indicate that a checkbox-toggleall was toggled.
 *
 * @method notifyCheckboxToggleToggled
 * @public
 * @param {HTMLElement} element The HTMLElement containing the drawer.
 * @returns {CustomEvent}
 */
export const notifyCheckboxToggleToggled = element => dispatchEvent(eventTypes.checkboxToggleToggled, {}, element);
