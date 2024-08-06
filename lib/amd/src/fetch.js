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
 * The core/fetch module allows you to make web service requests to the Moodle API.
 *
 * @module     core/fetch
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Cfg from 'core/config';
import PendingPromise from './pending';

/**
 * Normalise the component name to remove the core_ prefix.
 *
 * @param {string} component
 * @returns {string}
 */
const normaliseComponent = (component) => component.replace(/^core_/, '');

/**
 * Get the Request object for a given API request.
 *
 * @param {string} component The frankenstyle component name
 * @param {string} endpoint The endpoint within the componet to call
 * @param {object} params
 * @param {object} [params.params = {}] The parameters to pass to the API
 * @param {string|Object|FormData} [params.body = null] The HTTP method to use
 * @param {string} [params.method = "GET"] The HTTP method to use
 * @returns {Request}
 */
const getRequest = (
    component,
    endpoint,
    {
        params = {},
        body = null,
        method = 'GET',
    }
) => {
    const url = new URL(`${Cfg.apibase}rest/v2/${component}/${endpoint}`);
    const options = {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

    if (body) {
        if (body instanceof FormData) {
            options.body = body;
        } else if (body instanceof Object) {
            options.body = JSON.stringify(body);
        } else {
            options.body = body;
        }
    }

    const requestWrapper = {
        request: new Request(url, options),
    };

    requestWrapper.promise = new Promise((resolve, reject) => {
        requestWrapper.resolve = resolve;
        requestWrapper.reject = reject;
    });

    return requestWrapper;
};

const getGuid = () => {
    let d = new Date().getTime();
    const guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0; // eslint-disable-line no-bitwise
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16); // eslint-disable-line no-bitwise
    });
    return guid;
};

const handleResponse = (requestWrapper, response) => {
    if (response.ok) {
        requestWrapper.resolve(response);
    } else {
        requestWrapper.reject(response.statusText);
    }
};

/**
 * A class to handle requests to the Moodle REST API.
 *
 * @class Fetch
 */
export default class Fetch {
    /** @var {boolean} Whether the instance has been executed and is therefore locked */
    #locked = false;

    /** @var {Map} A Map of requests to execute */
    #requestMap = new Map();

    /**
     * Get a new instance of the Fetch class to create a batch of requests.
     *
     * @returns {Fetch}
     */
    static newBatch() {
        return new this();
    }

    async #getRequests() {
        const body = [];
        const boundary = getGuid();
        const addBoundaryMarker = () => body.push(`--${boundary}\n`);

        const addRequestHeader = () => {
            addBoundaryMarker();
            body.push(`Content-Type: application/html\n\n`);
        };

        await Promise.all(this.#requestMap.entries().map(async([id, {request}]) => {
            addRequestHeader();
            body.push(`${request.method} ${request.url}\n`);
            body.push(`Content-Type: ${request.headers.get('Content-Type')}\n`);
            body.push(`Content-ID: ${id}\n`);

            if (request.body) {
                body.push(`\n`);
                const requestBody = await request.text();
                body.push(requestBody);
            }
            body.push(`\n`);
        }));

        addBoundaryMarker();

        return new Request(
            `${M.cfg.apibase}$batch`,
            {
                body: body.join(""),
                method: "POST",
                headers: {
                    "Content-Type": `multipart/mixed;boundary=${boundary}`,
                },
            },
        );
    }

    /**
     * Execute the batch.
     *
     * @returns {Promise<void>}
     */
    async execute() {
        if (this.#locked) {
            throw new Error('Batch has already been executed.');
        }

        this.#locked = true;

        const response = await fetch(await this.#getRequests());
        if (!response.ok) {
            this.#requestMap.forEach(({reject}) => reject(response.statusText));
            return;
        }

        const responses = await this.processBatchResponse(response);

        // TODO: Use the request-id and map it to the request/response.
        let index = 0;
        this.#requestMap.forEach((requestWrapper) => {
            if (responses[index]) {
                const result = this.getResponseFromText(responses[index]);
                handleResponse(requestWrapper, result);
            } else {
                requestWrapper.reject("Request failed");
            }
            index++;
        });
    }

    getResponseFromText(text) {
        // Parts are:
        // - Boundary
        // - Headers
        // - Any body (optional)
        // - Boundary
        const parts = text.split(`\n\n`).map((part) => part.trim());

        // Remove the boundaries
        parts.shift();
        parts.pop();

        // Add an extra part on to simplify header/body extractiona
        parts.push(null);

        const [headerText, body] = parts;
        const headers = headerText.split(`\n`);

        // Extract the status from the rest of the headers.
        const statusLine = headers.shift();
        const [, status, statusText] = statusLine.split(` `);

        const headerList = headers.map((header) => header.split(":", 2).map((value) => value.trim()));

        return new Response(body, {
            status,
            statusText,
            headers: new Headers(headerList),
        });
    }

    async processBatchResponse(response) {
        // Handle the response type.
        const contentType = response.headers.get('Content-Type');
        if (contentType.startsWith('multipart/mixed')) {
            const [, boundaryPart] = contentType.split(';').map((part) => part.trim());
            const boundary = boundaryPart.replace('boundary=', '').trim();

            // Handle HTML response.
            const responseBody = await response.text();

            return responseBody.split(`--${boundary}`).filter((value) => !!value.length);
        } else if (contentType === 'application/json') {
            // Handle JSON response
            return await response.json();
        }

        throw new Error(
            `Unknown response type '${contentType}'`,
        );
    }

    /**
     * Make a single request to the Moodle API.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} action The component action to perform
     * @param {object} params
     * @param {object} [params.params = {}] The parameters to pass to the API
     * @param {string|Object|FormData} [params.body = null] The HTTP method to use
     * @param {string} [params.method = "GET"] The HTTP method to use
     * @returns {Promise<object>}
     */
    static async request(
        component,
        action,
        {
            params = {},
            body = null,
            method = 'GET',
        } = {},
    ) {
        const pending = new PendingPromise(`Requesting ${component}/${action} with ${method}`);
        const requestWrapper = getRequest(
            normaliseComponent(component),
            action,
            { params, method, body },
        );
        const result = await fetch(requestWrapper.request);

        pending.resolve();

        handleResponse(requestWrapper, result);
        return requestWrapper.promise;
    }

    #addRequest(
        component,
        action,
        {
            params = {},
            body = null,
            method = 'GET',
            id = null,
        } = {},
    ) {
        if (this.#locked) {
            throw new Error('Batch has already been executed. Unable to add additional requests.');
        }

        if (id) {
            if (this.#requestMap.has(id)) {
                throw new Error(`Request with ID ${id} already exists.`);
            }
        } else {
            do {
                id = getGuid();
            } while (this.#requestMap.has(id));
        }

        const request = getRequest(
            normaliseComponent(component),
            action,
            { params, method, body },
        );

        this.#requestMap.set(id, request);

        return request.promise;
    }

    /**
     * Make a request to the Moodle API.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} action The component action to perform
     * @param {object} params
     * @param {object} [params.params = {}] The parameters to pass to the API
     * @returns {Promise<object>}
     */
    performGet(
        component,
        action,
        {
            params = {},
        } = {},
    ) {
        return this.#addRequest(
            component,
            action,
            { params, method: 'GET' },
        );
    }

    /**
     * Make a request to the Moodle API.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} action The component action to perform
     * @param {object} params
     * @param {object} [params.params = {}] The parameters to pass to the API
     * @returns {Promise<object>}
     */
    performHead(
        component,
        action,
        {
            params = {},
        } = {},
    ) {
        return this.#addRequest(
            component,
            action,
            { params, method: 'HEAD' },
        );
    }

    /**
     * Make a request to the Moodle API.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} action The component action to perform
     * @param {object} params
     * @param {string|Object|FormData} params.body The HTTP method to use
     * @returns {Promise<object>}
     */
    performPost(
        component,
        action,
        {
            body,
        } = {},
    ) {
        return this.#addRequest(
            component,
            action,
            { body, method: 'POST' },
        );
    }

    /**
     * Make a request to the Moodle API.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} action The component action to perform
     * @param {object} params
     * @param {string|Object|FormData} params.body The HTTP method to use
     * @returns {Promise<object>}
     */
    performPut(
        component,
        action,
        {
            body,
        } = {},
    ) {
        return this.#addRequest(
            component,
            action,
            { body, method: 'POST' },
        );
    }

    /**
     * Make a request to the Moodle API.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} action The component action to perform
     * @param {object} params
     * @param {object} [params.params = {}] The parameters to pass to the API
     * @param {string|Object|FormData} [params.body = null] The HTTP method to use
     * @returns {Promise<object>}
     */
    performDelete(
        component,
        action,
        {
            params = {},
            body = null,
        } = {},
    ) {
        return this.#addRequest(
            component,
            action,
            {
                body,
                params,
                method: 'DELETE',
            },
        );
    }

    /**
     * Make a request to the Moodle API.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} action The component action to perform
     * @param {object} params
     * @param {object} [params.params = {}] The parameters to pass to the API
     * @returns {Promise<object>}
     */
    static performGet(
        component,
        action,
        {
            params = {},
        } = {},
    ) {
        return this.request(
            component,
            action,
            { params, method: 'GET' },
        );
    }

    /**
     * Make a request to the Moodle API.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} action The component action to perform
     * @param {object} params
     * @param {object} [params.params = {}] The parameters to pass to the API
     * @returns {Promise<object>}
     */
    static performHead(
        component,
        action,
        {
            params = {},
        } = {},
    ) {
        return this.request(
            component,
            action,
            { params, method: 'HEAD' },
        );
    }

    /**
     * Make a request to the Moodle API.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} action The component action to perform
     * @param {object} params
     * @param {string|Object|FormData} params.body The HTTP method to use
     * @returns {Promise<object>}
     */
    static performPost(
        component,
        action,
        {
            body,
        } = {},
    ) {
        return this.request(
            component,
            action,
            { body, method: 'POST' },
        );
    }

    /**
     * Make a request to the Moodle API.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} action The component action to perform
     * @param {object} params
     * @param {string|Object|FormData} params.body The HTTP method to use
     * @returns {Promise<object>}
     */
    static performPut(
        component,
        action,
        {
            body,
        } = {},
    ) {
        return this.request(
            component,
            action,
            { body, method: 'POST' },
        );
    }

    /**
     * Make a request to the Moodle API.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} action The component action to perform
     * @param {object} params
     * @param {object} [params.params = {}] The parameters to pass to the API
     * @param {string|Object|FormData} [params.body = null] The HTTP method to use
     * @returns {Promise<object>}
     */
    static performDelete(
        component,
        action,
        {
            params = {},
            body = null,
        } = {},
    ) {
        return this.request(
            component,
            action,
            {
                body,
                params,
                method: 'DELETE',
            },
        );
    }
}
