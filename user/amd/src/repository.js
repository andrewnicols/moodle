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

import {call as fetchMany} from 'core/ajax';
import fetch from 'core/fetch';

/**
 * Get single user preference
 *
 * @param {String} name Name of the preference
 * @param {Number} userid User ID (defaults to current user)
 * @return {Promise}
 */
export const getUserPreference = (name, userid = 0) => getUserPreferences(name, userid)
    .then((response) => response[name]);

/**
 * Get multiple user preferences
 *
 * @param {String|null} name Name of the preference (omit if you want to retrieve all)
 * @param {Number} userid User ID (defaults to current user)
 * @return {Promise<object<string, string>>}
 */
export const getUserPreferences = (name = null, userid = 0) => {
    const endpoint = ['preferences'];
    if (name) {
        endpoint.push(name);
    }

    const params = {};
    if (userid) {
        params.userid = userid;
    }

    return fetch(
        'core_user',
        endpoint.join('/'),
        params,
    );
};

/**
 * Set single user preference
 *
 * @param {String} name Name of the preference
 * @param {String|null} value Value of the preference (omit if you want to remove the current value)
 * @param {Number} userid User ID (defaults to current user)
 * @return {Promise}
 */
export const setUserPreference = async(name, value = null, userid = 0) => {
    const result = await fetch(
        'core_user',
        `preferences/${name}`,
        {value, userid},
        'POST',
    );

    return result[name];
};

/**
 * Set multiple user preferences
 *
 * @param {Object[]} preferences Array of preferences containing name/value/userid attributes
 * @return {Promise}
 */
export const setUserPreferences = (preferences) => fetch(
    'core_user',
    'preferences',
    {
        preferences,
    },
    'POST',
);

/**
 * Unenrol the user with the specified user enrolmentid ID.
 *
 * @param {Number} userEnrolmentId
 * @return {Promise}
 */
export const unenrolUser = userEnrolmentId => {
    return fetchMany([{
        methodname: 'core_enrol_unenrol_user_enrolment',
        args: {
            ueid: userEnrolmentId,
        },
    }])[0];
};

/**
 * Submit the user enrolment form with the specified form data.
 *
 * @param {String} formdata
 * @return {Promise}
 */
export const submitUserEnrolmentForm = formdata => {
    return fetchMany([{
        methodname: 'core_enrol_submit_user_enrolment_form',
        args: {
            formdata,
        },
    }])[0];
};

export const createNotesForUsers = notes => {
    return fetchMany([{
        methodname: 'core_notes_create_notes',
        args: {
            notes
        }
    }])[0];
};

export const sendMessagesToUsers = messages => {
    return fetchMany([{
        methodname: 'core_message_send_instant_messages',
        args: {messages}
    }])[0];
};
