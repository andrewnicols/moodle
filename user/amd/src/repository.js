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
 * Module to handle AJAX interactions.
 *
 * @module     core_user/repository
 * @copyright  2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {fetchOne} from 'core/fetch';

/**
 * Unenrol the user with the specified user enrolmentid ID.
 *
 * @param {Number} ueid The user enrolment ID
 * @return {Promise}
 */
export const unenrolUser = (ueid) => fetchOne('core_enrol_unenrol_user_enrolment', {ueid});

/**
 * Submit the user enrolment form with the specified form data.
 *
 * @param {String} formdata
 * @return {Promise}
 */
export const submitUserEnrolmentForm = (formdata) => fetchOne('core_enrol_submit_user_enrolment_form', {formdata});

export const createNotesForUsers = (notes) => fetchOne('core_notes_create_notes', {notes});

export const sendMessagesToUsers = (messages) => fetchOne('core_message_send_instant_messages', {messages});
