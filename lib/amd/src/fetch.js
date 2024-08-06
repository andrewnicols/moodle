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
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Cfg from 'core/config';
import PendingPromise from './pending';

/**
 * A wrapper around the Request, including a Promise that is resolved when the request is complete.
 */
class RequestWrapper {
    /** @var {Request} */
    #request = null;

    /** @var {Promise} */
    #promise = null;

    /** @var {Function} */
    #resolve = null;

    /** @var {Function} */
    #reject = null;

    /**
     * Create a new RequestWrapper.
     *
     * @param {Request} request The request object that is wrapped
     */
    constructor(request) {
        this.#request = request;
        this.#promise = new Promise((resolve, reject) => {
            this.#resolve = resolve;
            this.#reject = reject;
        });
    }

    /**
     * Get the wrapped Request.
     *
     * @returns {Request}
     * @private
     */
    get request() {
        return this.#request;
    }

    /**
     * Get the Promise link to this request.
     *
     * @return {Promise}
     * @private
     */
    get promise() {
        return this.#promise;
    }

    /**
     * Reject the Promise.
     */
    get reject() {
        return this.#reject;
    }

    /**
     * Handle the response from the request.
     *
     * @param {Response} response
     * @private
     */
    handleResponse(response) {
        if (response.ok) {
            this.#resolve(response);
        } else {
            this.#reject(response.statusText);
        }
    }
}

/**
 * The core/fetch module allows you to make web service requests to the Moodle API.
 *
 * Most methods are available both statically and via an instance method, for example
 * `Fetch.performGet()` and `(new Fetch()).performGet()`.
 *
 * The static perform methods perform immediate individual requests, whilst instance
 * methods are useful for batching requests.
 *
 * By default the Fetch instance will not automatically execute the batch, but it can be configured to do so
 * by passing a value for the `autoBatchTimeout` parameter.
 *
 * The batcher can be executed manually by calling the {@linkcode module:core/fetch#execute|execute} method.
 *
 * Note: In cases where the batcher is executed with a single request the batch endpoint is _not_ used.
 *
 * A helper method, {@linkcode module:core/fetch#getBatcher|getBatcher}, exists to fetch a singleton instance
 * of the class. This singleton is configured to automatically execute batch requests.
 *
 * @example <caption>Perform a single GET request</caption>
 * import Fetch from 'core/fetch';
 *
 * // Execute three individual requests.
 * const actions = await Promise.all([
 *     Fetch.performGet('mod_example', 'animals', { params: { type: 'mammal' }),
 *     Fetch.performGet('mod_example', 'animals', { params: { type: 'reptile' }),
 *     Fetch.performDelete('mod_example', `animals/${pig.id}`}),
 * ]);
 *
 * // Print the information about mammals.
 * window.console.log(actions[0]);
 *
 * @example <caption>Perform a series of requests, automatically batching them</caption>
 * import Fetch from 'core/fetch';
 *
 * // Execute a single request containing three sub requests.
 * const batcher = Fetch.getBatcher();
 * const actions = await Promise.all([
 *     batcher.performGet('mod_example', 'animals', { params: { type: 'mammal' }),
 *     batcher.performGet('mod_example', 'animals', { params: { type: 'reptile' }),
 *     batcher.performDelete('mod_example', `animals/${pig.id}`}),
 * ]);
 *
 * // Print the information about mammals.
 * window.console.log(actions[0]);
 *
 * @example <caption>Perform a series of GET request, manually batching them</caption>
 * import Fetch from 'core/fetch';
 *
 * const batcher = new Fetch();
 * const mammals = batcher.performGet('mod_example', 'animals', { params: { type: 'mammal' });
 * const actions = Promise.all([
 *     batcher.performGet('mod_example', 'animals', { params: { type: 'mammal' }),
 *     batcher.performGet('mod_example', 'animals', { params: { type: 'reptile' }),
 *     batcher.performDelete('mod_example', `animals/${pig.id}`}),
 * ]);
 *
 * batcher.execute();
 *
 * await actions;
 *
 * // Print the information about mammals.
 * window.console.log(actions[0]);
 */
export default class Fetch {
    /** @var {Map} #requestMap A Map of requests to execute */
    #requestMap = new Map();

    /** @var {null|self} #batcher The active instance of the batcher */
    static #batcher = null;

    /** @var {null|number} #delayTimer The timeout for the batch processor */
    #delayTimer = null;

    /** @var {Boolean} */
    #batchRequests = false;

    /**
     * The delay timer to use for the autobatcher.
     * A `null` value disables automatic execution
     * @var {boolean|Number} #autoBatchTimeout
     */
    #autoBatchTimeout = null;

    /**
     * Create a new instance of the Fetch Class.
     *
     * When methods are called on an Instance, they are queued and executed as a batch.
     *
     * By default the Fetch instance will not automatically execute the batch, but it can be configured to do so
     * by passing a value for the `autoBatchTimeout` parameter.
     *
     * The batcher can be executed manually by calling the {@link module:core/fetch:execute} method.
     * The batcher can be executed manually by calling the {@link class:core/fetch:execute} method.
     *
     * In cases where the batcher is executed with a single request the batch endpoint is _not_ used.
     *
     * @param {Number|null} [autoBatchTimeout=null] The amount of time to use when applying the automatic batch timer.
     *                                       If null, the autobatcher is disabled.
     */
    constructor(autoBatchTimeout = null) {
        this.#autoBatchTimeout = autoBatchTimeout;

        this.#batchRequests = Cfg.batchFetchRequests;
    }

    /**
     * Get the singleton instance of batch processor.
     *
     * Note: The singleton instance is configured to automatically execute the batch 50ms after the final request is added.
     *
     * @returns {Fetch}
     */
    static getBatcher() {
        if (!this.#batcher) {
            this.#batcher = new this(50);
        }

        return this.#batcher;
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
     * @returns {Promise<Response>} A promise that resolves to the Response object for the request
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
        const requestWrapper = Fetch.#getRequest(
            Fetch.#normaliseComponent(component),
            action,
            { params, method, body },
        );
        const result = await fetch(requestWrapper.request);

        pending.resolve();

        requestWrapper.handleResponse(result);

        return requestWrapper.promise;
    }

    /**
     * Make a request to the Moodle API.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} action The component action to perform
     * @param {object} params
     * @param {object} [params.params = {}] The parameters to pass to the API
     * @returns {Promise<Response>} A promise that resolves to the Response object for the request
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
     * @returns {Promise<Response>} A promise that resolves to the Response object for the request
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
     * @returns {Promise<Response>} A promise that resolves to the Response object for the request
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
     * @returns {Promise<Response>} A promise that resolves to the Response object for the request
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
            { body, method: 'PUT' },
        );
    }

    /**
     * Make a PATCH request to the Moodle API.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} action The component action to perform
     * @param {object} params
     * @param {string|Object|FormData} params.body The HTTP method to use
     * @returns {Promise<Response>} A promise that resolves to the Response object for the request
     */
    static performPatch(
        component,
        action,
        {
            body,
        } = {},
    ) {
        return this.request(
            component,
            action,
            { body, method: 'PATCH' },
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
     * @returns {Promise<Response>} A promise that resolves to the Response object for the request
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

    /**
     * Make a request to the Moodle API.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} action The component action to perform
     * @param {object} params
     * @param {object} [params.params = {}] The parameters to pass to the API
     * @returns {Promise<Response>} A promise that resolves to the Response object for the request
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
     * @returns {Promise<Response>} A promise that resolves to the Response object for the request
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
     * @returns {Promise<Response>} A promise that resolves to the Response object for the request
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
     * @returns {Promise<Response>} A promise that resolves to the Response object for the request
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
            { body, method: 'PUT' },
        );
    }

    /**
     * Make a PATCH request to the Moodle API.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} action The component action to perform
     * @param {object} params
     * @param {string|Object|FormData} params.body The HTTP method to use
     * @returns {Promise<Response>} A promise that resolves to the Response object for the request
     */
    performPatch(
        component,
        action,
        {
            body,
        } = {},
    ) {
        return this.#addRequest(
            component,
            action,
            { body, method: 'PATCH' },
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
     * @returns {Promise<Response>} A promise that resolves to the Response object for the request
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
     * Execute the batch request.
     *
     * @returns {Promise<void>}
     */
    async execute() {
        const requestMap = this.#requestMap;
        this.#requestMap = new Map();

        if (requestMap.size === 0) {
            return Promise.resolve();
        }

        if (requestMap.size === 1) {
            const requestWrapper = requestMap.values().next().value;
            const result = await fetch(requestWrapper.request);

            requestWrapper.handleResponse(result);

            return;
        }

        const response = await fetch(await this.#getRequests(requestMap));
        if (!response.ok) {
            requestMap.forEach((requestWrapper) => requestWrapper.reject(response.statusText));
            return;
        }

        const responses = await this.#processBatchResponse(response);

        // TODO: Use the request-id and map it to the request/response.
        let index = 0;
        requestMap.forEach((requestWrapper) => {
            if (responses[index]) {
                const result = this.#getResponseFromText(responses[index]);
                requestWrapper.handleResponse(result);
            } else {
                requestWrapper.reject("Request failed");
            }
            index++;
        });
    }

    /**
     * Normalise the component name to remove the core_ prefix.
     *
     * @param {string} component
     * @returns {string}
     */
    static #normaliseComponent(component) {
        return component.replace(/^core_/, '');
    }

    /**
     * Add a request to the batch queue.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} endpoint The endpoint within the componet to call
     * @param {object} params
     * @param {object} [params.params = {}] The parameters to pass to the API
     * @param {string|Object|FormData} [params.body = null] The HTTP method to use
     * @param {string} [params.method = "GET"] The HTTP method to use
     * @param {string} [params.id = null] The ID of the request (Reserved for future use)
     * @returns {Promise}
     */
    #addRequest(
        component,
        endpoint,
        {
            params = {},
            body = null,
            method = 'GET',
            id = null,
        } = {},
    ) {
        if (this.#requestMap.length > 20) {
            this.execute();
        }

        if (id) {
            if (this.#requestMap.has(id)) {
                throw new Error(`Request with ID ${id} already exists.`);
            }
        } else {
            do {
                id = this.#getGuid();
            } while (this.#requestMap.has(id));
        }

        const request = Fetch.#getRequest(
            Fetch.#normaliseComponent(component),
            endpoint,
            { params, method, body },
        );

        this.#requestMap.set(id, request);

        if (!this.#batchRequests) {
            this.execute();
        } else if (this.#autoBatchTimeout) {
            this.#queueExecution();
        }

        return request.promise;
    }

    /**
     * Queue the execution of the batch request.
     */
    #queueExecution() {
        if (this.#delayTimer) {
            clearTimeout(this.#delayTimer);
        }
        this.#delayTimer = setTimeout(() => this.execute(), this.#autoBatchTimeout);
    }

    /**
     * Get the Request for a given API request.
     *
     * @param {string} component The frankenstyle component name
     * @param {string} endpoint The endpoint within the componet to call
     * @param {object} params
     * @param {object} [params.params = {}] The parameters to pass to the API
     * @param {string|Object|FormData} [params.body = null] The HTTP method to use
     * @param {string} [params.method = "GET"] The HTTP method to use
     * @returns {RequestWrapper}
     */
    static #getRequest(
        component,
        endpoint,
        {
            params = {},
            body = null,
            method = 'GET',
        }
    ) {
        const url = new URL(`${Cfg.apibase}/rest/v2/${component}/${endpoint}`);
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

        return new RequestWrapper(new Request(url, options));
    }

    /**
     * Get the Compiled batch Request.
     *
     * @param {Map<Object>} requestMap
     * @returns {Promise<Request>}
     */
    async #getRequests(requestMap) {
        const boundary = this.#getGuid();
        const getBoundaryMarker = () => `--${boundary}\n`;

        const getRequestHeader = () => ([
            getBoundaryMarker(),
            `Content-Type: application/html\n\n`,
        ]);

        const [...requestBodies] = await Promise.all(requestMap.entries().map(async ([id, { request }]) => {
            const thisBody = [];
            thisBody.push(...getRequestHeader());
            thisBody.push(`${request.method} ${request.url}\n`);
            thisBody.push(`Content-Type: ${request.headers.get('Content-Type')}\n`);
            thisBody.push(`Content-ID: ${id}\n`);

            if (request.body) {
                thisBody.push(`\n`);
                thisBody.push(await request.text());
            }

            thisBody.push(`\n`);
            return thisBody;
        }));

        const body = [
            ...requestBodies.map((requestBody) => requestBody.join("")),
            getBoundaryMarker(),
        ];

        return new Request(
            `${M.cfg.apibase}/$batch`,
            {
                body: body.join(""),
                method: "POST",
                headers: {
                    "Content-Type": `multipart/mixed;boundary=${boundary}`,
                },
            },
        );
    }

    #getResponseFromText(text) {
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

    async #processBatchResponse(response) {
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

    #getGuid() {
        let d = new Date().getTime();
        const guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = (d + Math.random() * 16) % 16 | 0; // eslint-disable-line no-bitwise
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16); // eslint-disable-line no-bitwise
        });
        return guid;
    }
}
