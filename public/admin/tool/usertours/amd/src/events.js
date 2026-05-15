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
 * Javascript events for the `tool_usertours` subsystem.
 *
 * This is a backward-compatibility wrapper. The canonical source of truth
 * is the ESM module at `@moodle/lms/tool_usertours/events`.
 *
 * @module tool_usertours/events
 * @copyright 2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @example <caption>Listening to a step rendering event and cancelling it.</caption>
 * import {eventTypes} from 'tool_usertours/events';
 *
 * document.addEventListener(eventTypes.stepRender, e => {
 *     console.log(e.detail.stepConfig);
 *     e.preventDefault();
 * });
 */

import {eventTypes} from '@moodle/lms/tool_usertours/events';

export {eventTypes};
