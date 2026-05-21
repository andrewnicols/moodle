var e={stepRender:"tool_usertours/stepRender",stepRendered:"tool_usertours/stepRendered",tourStart:"tool_usertours/tourStart",tourStarted:"tool_usertours/tourStarted",tourEnd:"tool_usertours/tourEnd",tourEnded:"tool_usertours/tourEnded",stepHide:"tool_usertours/stepHide",stepHidden:"tool_usertours/stepHidden"};export{e as eventTypes};
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
//# sourceMappingURL=events.js.map
