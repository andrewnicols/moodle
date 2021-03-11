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
 * Key Events.
 *
 * @module     core/key_events
 * @package    core
 * @class      key_events
 * @copyright  2021 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      3.11
 */

import jQuery from 'jquery';
import {dispatchEvent} from 'core/local/event/dispatcher';

export const eventTypes = {
  activated: 'core/key_events:activated',
  arrowDownPressed: 'core/key_events:arrowDownPressed',
  arrowUpPressed: 'core/key_events:arrowUpPressed',
  asterixKeyPressed: 'core/key_events:asterixKeyPressed',
  endKeyPressed: 'core/key_events:endKeyPressed',
  enterKeyPressed: 'core/key_events:enterKeyPressed',
  escapeKeyPressed: 'core/key_events:escapeKeyPressed',
  homeKeyPressed: 'core/key_events:homeKeyPressed',
  keyboardActivated: 'core/key_events:keyboardActivated',
  metaPageDown: 'core/key_events:metaPageDown',
  metaPageUp: 'core/key_events:metaPageUp',
  nextKeyPressed: 'core/key_events:nextKeyPressed',
  previousKeyPressed: 'core/key_events:previousKeyPressed',
};

/**
 * Check if any of the modifier keys have been pressed on the event.
 *
 * @method  isModifierPressed
 * @param   {Event} e
 * @returns {bool}
 */
const isModifierPressed = e => {
    return (e.shiftKey || e.metaKey || e.altKey || e.ctrlKey);
};

const eventMap = {
    keydown: [
        {
            // This event is triggered when the escape key key is pressed.
            customEventName: eventTypes.homeKeyPressed,
            filter: e => e.code === 'Home',
        },
        {
            // This event is triggered when the end key key is pressed.
            customEventName: eventTypes.endKeyPressed,
            filter: e => e.code === 'End',
        },
        {
            // This event is triggered when the escape key key is pressed.
            customEventName: eventTypes.escapeKeyPressed,
            filter: e => e.code === 'Escape',
        },
        {
            // This event is triggered when asterix key is pressed.
            customEventName: eventTypes.asterixKeyPressed,
            filter: e => e.key === '*',
        },
        {
            // This event is triggered when enter or space are pressed without a modifier key.
            customEventName: eventTypes.keyboardActivated,
            filter: e => {
                if (isModifierPressed(e)) {
                    return false;
                }

                if (e.code === 'Enter') {
                    return true;
                }

                if (e.code === 'Space') {
                    return true;
                }

                return false;
            },
        },
        {
            // This event is triggered on click.
            customEventName: eventTypes.enterKeyPressed,
            filter: e => {
                return e.code === 'Enter' && !isModifierPressed(e);
            },
        },
        {
            // This event is triggered when down key is pressed without a modifier key.
            customEventName: eventTypes.arrowDownPressed,
            filter: e => {
                return e.code === 'ArrowDown' && !isModifierPressed(e);
            },
        },
        {
            // This event is triggered when up key is pressed without a modifier key.
            customEventName: eventTypes.arrowUpPressed,
            filter: e => {
                return e.code === 'ArrowUp' && !isModifierPressed(e);
            },
        },
        {
            // This event is triggered when left key is pressed without a modifier key.
            filter: e => {
                return e.code === 'ArrowLeft' && !isModifierPressed(e);
            },
            customEventNameFunction: () => {
                if (document.querySelector('html').dir === 'ltr') {
                    return eventTypes.previousKeyPressed;
                } else {
                    return eventTypes.nextKeyPressed;
                }
            },
        },
        {
            // This event is triggered when right key is pressed without a modifier key.
            filter: e => {
                return e.code === 'ArrowRight' && !isModifierPressed(e);
            },
            customEventNameFunction: () => {
                if (document.querySelector('html').dir === 'ltr') {
                    return eventTypes.nextKeyPressed;
                } else {
                    return eventTypes.previousKeyPressed;
                }
            },
        },
        {
            // This event is triggered when PageUp key is pressed with the Control modifier key.
            customEventName: eventTypes.metaPageUp,
            filter: e => {
                if (e.code !== 'PageUp') {
                    return false;
                }

                return e.ctrlKey;
            },
        },
        {
            // This event is triggered when PageDown key is pressed with the Control modifier key.
            customEventName: eventTypes.metaPageDown,
            filter: e => {
                if (e.code !== 'PageDown') {
                    return false;
                }

                return e.ctrlKey;
            },
        },
    ],
    'core/key_events:keyboardActivated': [
        {
            // This event is triggered when enter or space are pressed without a modifier key.
            customEventName: eventTypes.activated,
            filter: () => true,
        },
    ],
    click: [
        {
            // This event is triggered when the keyboardActivated event is triggered.
            customEventName: eventTypes.activated,
            filter: () => true,
        },
    ],
};

export const legacyEventMap = {
    'cie:activate': eventTypes.activated,
    'cie:asterix': eventTypes.asterixKeyPressed,
    'cie:ctrlPageDown': eventTypes.metaPageDown,
    'cie:ctrlPageUp': eventTypes.metaPageUp,
    'cie:down': eventTypes.arrowDownPressed,
    'cie:end': eventTypes.endKeyPressed,
    'cie:enter': eventTypes.enterKeyPressed,
    'cie:escape': eventTypes.escapeKeyPressed,
    'cie:home': eventTypes.homeKeyPressed,
    'cie:keyboardactivate': eventTypes.keyboardActivated,
    'cie:next': eventTypes.nextKeyPressed,
    'cie:previous': eventTypes.previousKeyPressed,
    'cie:up': eventTypes.arrowUpPressed,
};


let eventsRegistered = false;

if (!eventsRegistered) {
    eventsRegistered = true;

    for (const [eventType, eventTypeDetails] of Object.entries(eventMap)) {
        // Only register each event listener once.
        document.addEventListener(eventType, e => {
            eventTypeDetails.forEach(eventDetails => {
                if (!eventDetails.filter(e)) {
                    // This event does not meet the filter requirements.
                    return;
                }

                let customEventName = eventDetails.customEventName;
                if (eventDetails.hasOwnProperty(eventDetails.customEventNameFunction)) {
                    customEventName = eventDetails.customEventNameFunction(e);
                }

                // Fire the custom event.
                const customEvent = dispatchEvent(customEventName, {}, e.target, {
                    cancelable: e.cancelable,
                });

                if (customEvent.defaultPrevented) {
                    e.preventDefault();
                }

                return;
            });
        });
    }
}

export const define = (elementList, legacyEventNames) => {
    if (!legacyEventNames.length) {
        // No events requested.
        return;
    }

    window.console.warn(
        `The custom_interaction_events::define() function has been deprecated. ` +
        `The use of ${legacyEventNames.join(', ')} events should be updated.`
    );

    legacyEventNames.forEach(legacyEventName => {
        if (!legacyEventMap.hasOwnProperty(legacyEventName)) {
            // Unknown event.
            return;
        }

        const newEventName = `${legacyEventMap[legacyEventName]}.cie`;

        jQuery(elementList)

        // Ensure that there is only one listener.
        .off(newEventName)

        // Listen to the new event and trigger the legacy one.
        .on(newEventName, e => {
            jQuery(e.target).trigger(legacyEventName, [{originalEvent: e}]);
        });
    });
};
