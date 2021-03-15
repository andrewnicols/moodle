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
 * Form Events.
 *
 * @module     core_message/events
 * @package    core_message
 * @class      events
 * @copyright  2021 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      3.11
 */

import {dispatchEvent} from 'core/local/event/dispatcher';

export const eventTypes = {
    // This event is triggered when an mmessage is about to be submitted via javascript.
    createConversationWithUser: 'core_message/createConversationWithUser',

    hideMessageDrawer: 'core_message/hideMessageDrawer',
    messageDrawerShown: 'core_message/messageDrawerShown',

    toggleVisibilty: 'core_message/messageDrawerVisibilityToggled',
};

/**
 * Trigger an event to indicate that a message field contained an error.
 *
 * @method notifyFormError
 * @param {DOMElement} args
 * @returns {CustomEvent}
 */
export const notifyCreateConversationWithUser = args => dispatchEvent(eventTypes.createConversationWithUser, {}, args);

export const notifyHideMessageDrawer = () => dispatchEvent(eventTypes.hideMessageDrawer);

export const notifyMessageDrawerShown = () => dispatchEvent(eventTypes.messageDrawerShown);
