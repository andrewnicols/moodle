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
 * Custom DOM event types dispatched by the User Tours component.
 *
 * These events are fired on `document` for backward compatibility with
 * the legacy AMD tour implementation. External code can listen for these
 * to react to tour lifecycle changes.
 *
 * @module     tool_usertours/events
 * @copyright  2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @example
 * import {eventTypes} from '@moodle/lms/tool_usertours/events';
 *
 * document.addEventListener(eventTypes.stepRender, (e) => {
 *     console.log(e.detail.stepConfig);
 *     e.preventDefault(); // Cancel the step render.
 * });
 */

/**
 * Event type strings for User Tours lifecycle events.
 *
 * All events are dispatched as `CustomEvent` on `document`.
 * Events marked "cancellable" can be stopped with `preventDefault()`.
 *
 * @constant
 * @property {object} eventTypes
 * @property {String} eventTypes.stepRender See {@link event:tool_usertours/stepRender}
 * @property {String} eventTypes.stepRendered See {@link event:tool_usertours/stepRendered}
 * @property {String} eventTypes.tourStart See {@link event:tool_usertours/tourStart}
 * @property {String} eventTypes.tourStarted See {@link event:tool_usertours/tourStarted}
 * @property {String} eventTypes.tourEnd See {@link event:tool_usertours/tourEnd}
 * @property {String} eventTypes.tourEnded See {@link event:tool_usertours/tourEnded}
 * @property {String} eventTypes.stepHide See {@link event:tool_usertours/stepHide}
 * @property {String} eventTypes.stepHidden See {@link event:tool_usertours/stepHidden}
 */
export const eventTypes = {
    /**
     * An event triggered before a user tour step is rendered.
     *
     * This event is cancellable.
     *
     * @event tool_usertours/stepRender
     * @type {CustomEvent}
     * @property {object} detail
     * @property {object} detail.stepConfig The step configuration object.
     */
    stepRender: 'tool_usertours/stepRender',

    /**
     * An event triggered after a user tour step has been rendered.
     *
     * @event tool_usertours/stepRendered
     * @type {CustomEvent}
     * @property {object} detail
     * @property {object} detail.stepConfig The step configuration object.
     */
    stepRendered: 'tool_usertours/stepRendered',

    /**
     * An event triggered before a user tour starts.
     *
     * This event is cancellable.
     *
     * @event tool_usertours/tourStart
     * @type {CustomEvent}
     * @property {object} detail
     * @property {Number} detail.startAt The step index the tour will start at.
     */
    tourStart: 'tool_usertours/tourStart',

    /**
     * An event triggered after a user tour has started.
     *
     * @event tool_usertours/tourStarted
     * @type {CustomEvent}
     * @property {object} detail
     * @property {Number} detail.startAt The step index the tour started at.
     */
    tourStarted: 'tool_usertours/tourStarted',

    /**
     * An event triggered before a tour ends.
     *
     * This event is cancellable.
     *
     * @event tool_usertours/tourEnd
     * @type {CustomEvent}
     * @property {object} detail
     */
    tourEnd: 'tool_usertours/tourEnd',

    /**
     * An event triggered after a tour has ended.
     *
     * @event tool_usertours/tourEnded
     * @type {CustomEvent}
     * @property {object} detail
     */
    tourEnded: 'tool_usertours/tourEnded',

    /**
     * An event triggered before a step is hidden.
     *
     * @event tool_usertours/stepHide
     * @type {CustomEvent}
     * @property {object} detail
     */
    stepHide: 'tool_usertours/stepHide',

    /**
     * An event triggered after a step has been hidden.
     *
     * @event tool_usertours/stepHidden
     * @type {CustomEvent}
     * @property {object} detail
     */
    stepHidden: 'tool_usertours/stepHidden',
} as const;

export type EventType = typeof eventTypes[keyof typeof eventTypes];
