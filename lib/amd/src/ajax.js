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
 * Standard Ajax wrapper for Moodle. It calls the central Ajax script,
 * which can call any existing webservice using the current session.
 * In addition, it can batch multiple requests and return multiple responses.
 *
 * @module     core/ajax
 * @copyright  2015 Damyon Wiese <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      2.9
 */

import jQuery from 'jquery';
import {fetchMany} from './fetch';

/**
 * Deprecation layer for the old ajax module.
 *
 * @param {Request} requests
 * @param {boolean} [async=true]
 * @param {boolean} [loginRequired=true]
 * @param {boolean} [noSessionUpdate=false]
 * @param {Number} [timeout=null]
 * @param {Number} [cacheKey=null]
 * @returns {Promise[]}
 */
const call = (
    requests,
    async = true,
    loginRequired = true,
    noSessionUpdate = false,
    timeout = 0,
    cacheKey = null,
) => {
    window.console.warn(
        `The core/ajax:call function has been deprecated. ` +
        `Please update your call to use either fetchOne, or fetchMany from the core/fetch module.`
    );

    if (!async) {
        throw new Error(`The async flag has been deprecated. Please update your code.`);
    }

    // Perform the new fetch.
    const promises = fetchMany(requests, loginRequired, {
        updateSession: !noSessionUpdate,
        timeout,
        cacheKey,
    });

    // Convert the promises to jQuery promises.
    const jQueryPromises = promises.map((promise) => jQuery.Deferred()
        .resolve(promise)
        .catch(value => jQuery.Deferred().reject(value))
    );

    // Handle the promise.done and promise.fail calls.
    return jQueryPromises.map((promise, index) => {
        if (requests[index].done) {
            window.console.warn(`The use of the done and fail callbacks has been deprecated.`);
            promise.done(requests[index].done);
        }

        if (requests[index].fail) {
            window.console.warn(`The use of the done and fail callbacks has been deprecated.`);
            promise.fail(requests[index].fail);
        }

        return promise;
    });
};

/**
 *
 * @param {Array} args
 * @returns {Promise[]}
 */
export default {
    call,
};
