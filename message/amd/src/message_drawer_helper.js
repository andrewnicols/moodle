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
 * Provides some helper functions to trigger actions in the message drawer.
 *
 * @module     core_message/message_drawer_helper
 * @package    message
 * @copyright  2018 Ryan Wyllie <ryan@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import * as PubSub from 'core/pubsub';
import * as MessageDrawerEvents from 'core_message/message_drawer_events';
import * as MessageEvents from 'core_message/events';

/**
 * Trigger an event to create a new conversation in the message drawer.
 *
 * @param {Number} args The user id to start a conversation.
 */
export const createConversationWithUser = args => {
    MessageEvents.notifyCreateConversationWithUser(args);
    PubSub.publish(
        MessageDrawerEvents.CREATE_CONVERSATION_WITH_USER,
        args,
        MessageDrawerEvents.eventTypes.createConversationWithUser
    );
};

/**
 * Trigger an event to hide the message drawer.
 */
export const hide = () => {
    MessageEvents.notifyHideMessageDrawer();
    PubSub.publish(MessageDrawerEvents.HIDE, null, MessageDrawerEvents.eventTypes.hideMessageDrawer);
};

/**
 * Trigger an event to show the message drawer.
 */
export const show = () => {
    MessageEvents.notifyHideMessageDrawer();
    PubSub.publish(MessageDrawerEvents.SHOW, null, MessageDrawerEvents.eventTypes.messageDrawerShown);
};
