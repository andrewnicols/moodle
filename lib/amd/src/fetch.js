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
 * A wrapper around the browser Fetch API to be used with the Moodle Web Services.
 *
 * @module     core/fetch
 * @copyright  2022 Andrew Lyons < andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      4.2
 */

import config from 'core/config';
import MoodleURL from 'core/url';
import Pending from 'core/pending';

const maxUrlLength = 2000;

// TODO See if we can avoid using the beforeunload event as it has a detremental impact.
let unloading = false;
window.addEventListener('beforeunload', () => {
    unloading = true;
});

const getServiceUrl = (
    loginRequired,
    cacheKey,
) => {
    const serviceUrl = new URL(
        loginRequired ? 'service.php' : 'service-nologin.php',
        `${config.wwwroot}/lib/ajax/`,
    );

    if (loginRequired) {
        // Add the sesskey to the URL.
        serviceUrl.searchParams.set('sesskey', config.sesskey);
    } else if (cacheKey) {
        // A cache key can only be added to public requests.
        serviceUrl.searchParams.set('cachekey', cacheKey);
    }

    return serviceUrl;
};

const getMethod = (loginRequired, cacheKey) => {
    if (!loginRequired && cacheKey) {
        return 'GET';
    }

    return 'POST';
};

const getCacheKey = (cacheKey = null) => {
    if (cacheKey) {
        const key = parseInt(cacheKey);
        if (key <= 0 || !key) {
            return null;
        }

        return key;
    }

    return null;
};

export const fetchOne = (methodname, args, loginRequired = true, options) => fetchMany(
    [{methodname, args}],
    loginRequired,
    options
)[0];

export const fetchMany = (queries, loginRequired = true, {
    updateSession = true,
    timeout = 0,
    cacheKey = null,
} = {}) => {
    const requestData = [];
    const resolvers = new Map();

    const promises = queries.map((request, index) => new Promise((resolve, reject) => {
        const {methodname, args} = request;

        // The request data that we pass to the service includes index, methodname, args.
        requestData.push({
            index,
            methodname,
            args,
        });

        // Store the Promise resolvers for this request against its index.
        resolvers.set(index, {
            resolve,
            reject,
        });
    }));

    // Get the base service URL.
    const serviceUrl = getServiceUrl(loginRequired, getCacheKey(cacheKey));

    if (!updateSession) {
        serviceUrl.searchParams.set('nosessionupdate', true);
    }

    // Set a request summary in the URL to assist in caching.
    serviceUrl.searchParams.set('info', getRequestSummary(queries));

    // Note: Do not await this call, it will be resolved later.
    fetchRequests(serviceUrl, requestData, resolvers, loginRequired, updateSession, timeout, cacheKey);

    return promises;
};

const getAbortController = (timeout) => {
    if (timeout <= 0) {
        return {
            abortTimer: null,
            abortController: null,
        };
    }

    const abortController = new AbortController();
    const abortTimer = setTimeout(() => {
        abortController.abort();
    }, timeout * 1000);

    return {
        abortTimer,
        abortController,
    };
};

const getRequestSummary = (requests) => {
    if (requests.length <= 5) {
        return requests.map((request) => request.methodname).sort().join();
    }

    return `${requests.length}-method-calls`;
};

const fetchRequests = async(serviceUrl, requests, resolvers, loginRequired, updateSession, timeout, cacheKey) => {
    const options = {
        method: getMethod(loginRequired, cacheKey),
        headers: [
            ['Content-Type', 'application/json'],
        ],
    };

    if (options.method === 'GET') {
        serviceUrl.searchParams.set('args', JSON.stringify(requests));
        if (serviceUrl.toString().length > maxUrlLength) {
            options.method = 'POST';
            serviceUrl.searchParams.delete('args');
        }
    }

    if (options.method === 'POST') {
        // It isn't possible to cache POST requests.
        serviceUrl.searchParams.delete('cachekey');

        // TODO Look at whether we can move the sesskey into the body too.

        // This is a POST request so add the data to the body.
        options.body = JSON.stringify(requests);
    }

    // Register the abort controller immediately before the request is made.
    const {abortController, abortTimer} = getAbortController(timeout);
    if (abortController) {
        options.signal = abortController;
    }

    const pendingPromise = new Pending('core/fetch:fetchRequests');
    try {
        const response = await fetch(serviceUrl, options);

        // Clear the abort timer before handling responses otherwise it will apply to responses too.
        clearTimeout(abortTimer);

        // Process the responses and resolve the promises.
        handleResponses(updateSession, response, resolvers);
    } catch (error) {
        // Clear the abort timer before handling responses otherwise it will apply to responses too.
        clearTimeout(abortTimer);

        // Process the responses and reject the promises.
        handleFailure(resolvers, error);
    } finally {
        pendingPromise.resolve();
    }
};

const handleFailure = (resolvers, error) => {
    if (unloading) {
        window.console.error(`Page unloaded - exception ignored: ${error}`);
        return;
    }

    // Reject each promise.
    try {
        resolvers.forEach(({reject}) => reject(error));
    } catch {
        // Pass.
    }
};

const checkLoginRequired = (exception, updateSession) => {
    if (exception.errorcode === 'servicerequireslogin' && updateSession) {
        // The user is not logged in, redirect to the login page.
        window.location = MoodleURL.relativeUrl("/login/index.php");
        return;
    }
};

const handleResponses = async(updateSession, response, resolvers) => {
    const responseData = await response.json();
    if (responseData.error) {
        // Throwing an error here will cause all of the promises to be rejected by the calling code.
        throw new Error(responseData.error);
    }

    // Resolve each of the responses.
    responseData.some((response, index) => {
        if (response.error) {
            // If any response errored then reject this and all remaining promises.
            checkLoginRequired(response.exception, updateSession);
            resolvers.forEach(({reject}) => reject(response.exception));
            return true;
        }

        // Resolve the promise with the response data and continue.
        resolvers.get(index).resolve(response.data);
        // Remove the resolver so that any failures in subsequent keys do not cause it to reject.
        resolvers.delete(index);
        return false;
    });

    return responseData;
};
