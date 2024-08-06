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
 * The core/fetch module allows you to make web service requests to the Moodle REST API.
 *
 * Most methods are available both statically and via an instance method, for example
 * `Fetch.performGet()` and `(new Fetch()).performGet()`.
 *
 * The static perform methods perform immediate individual requests, whilst instance
 * methods are useful for batching requests.
 *
 * By default a Fetch instance will not automatically execute the batch, but it can be configured to do so
 * by passing a value for the `autoBatchTimeout` parameter.
 *
 * The batcher can be executed manually by calling the {@link Fetch#execute} method.
 *
 * Note: In cases where the batcher is executed with a single request the batch endpoint is _not_ used.
 *
 * A helper method, {@link Fetch.getBatcher}, exists to fetch a singleton instance of the class.
 * This singleton is configured to automatically execute batch requests.
 *
 * @module     core/fetch
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @example <caption>Perform a single GET request</caption>
 * import Fetch from 'core/fetch';
 *
 * const result = Fetch.performGet('mod_example', 'animals', { params: { type: 'mammal' } });
 *
 * result.then((response) => {
 *    // Do something with the Response object.
 * })
 * .catch((error) => {
 *     // Handle the error
 * });
 *
 * @example <caption>Perform a series of requests, automatically batching them</caption>
 * import Fetch from 'core/fetch';
 *
 * // Execute a single request containing three sub requests.
 * const batcher = Fetch.getBatcher();
 * const actions = await Promise.all([
 *     batcher.performGet('mod_example', 'animals', { params: { type: 'mammal' } }),
 *     batcher.performGet('mod_example', 'animals', { params: { type: 'reptile' } }),
 *     batcher.performDelete('mod_example', `animals/${pig.id}`),
 * ]);
 *
 * @example <caption>Perform a series of GET requests, manually batching them</caption>
 * import Fetch from 'core/fetch';
 *
 * const batcher = new Fetch();
 * const actions = Promise.all([
 *     batcher.performGet('mod_example', 'animals', { params: { type: 'mammal' } }),
 *     batcher.performGet('mod_example', 'animals', { params: { type: 'reptile' } }),
 *     batcher.performDelete('mod_example', `animals/${pig.id}`),
 * ]);
 *
 * batcher.execute();
 *
 * await actions;
 */

import config from '@moodle/lms/core/config';
import Pending from '@moodle/lms/core/pending';
import {getGlobalAbortSignal} from './abort';

/** The body types accepted by write-method requests. */
type RequestBody = string | object | FormData;

/** Options for {@link Fetch.request}. */
interface RequestOptions {
    /** Any cache key to use for the request. */
    cachekey?: number | null;
    /** Additional headers to merge with the defaults. */
    headers?: Record<string, string>;
    /** Query-string parameters to append to the URL. */
    params?: Record<string, string>;
    /** The request body (for POST / PUT / PATCH / DELETE). */
    body?: RequestBody | null;
    /** The HTTP method to use. */
    method?: string;
}

/** Options for {@link Fetch#addRequest} (the internal batch queueing method). */
interface AddRequestOptions extends RequestOptions {
    /** The ID of the request within the batch (reserved for future use). */
    id?: string | null;
}

/** Options for read-only convenience methods (GET / HEAD). */
interface ReadRequestOptions {
    /** Any cache key to use for the request. */
    cachekey?: number | null;
    /** Additional headers to merge with the defaults. */
    headers?: Record<string, string>;
    /** Query-string parameters to append to the URL. */
    params?: Record<string, string>;
}

/** Options for write convenience methods (POST / PUT / PATCH). */
interface WriteRequestOptions {
    /** Additional headers to merge with the defaults. */
    headers?: Record<string, string>;
    /** The request body. */
    body: RequestBody;
}

/** Options for the DELETE convenience method. */
interface DeleteRequestOptions {
    /** Additional headers to merge with the defaults. */
    headers?: Record<string, string>;
    /** Query-string parameters to append to the URL. */
    params?: Record<string, string>;
    /** An optional request body. */
    body?: RequestBody | null;
}

/**
 * A wrapper around a {@link Request} that pairs it with a {@link Promise}
 * which is resolved or rejected when the response arrives.
 */
class RequestWrapper {
    #request: Request;
    #promise: Promise<Response>;
    #resolve!: (value: Response) => void;
    #reject!: (reason: string) => void;

    constructor(request: Request) {
        this.#request = request;
        this.#promise = new Promise<Response>((resolve, reject) => {
            this.#resolve = resolve;
            this.#reject = reject;
        });
    }

    get request(): Request {
        return this.#request;
    }

    get promise(): Promise<Response> {
        return this.#promise;
    }

    /** The Promise rejector, exposed so a batch response can reject individual sub-requests. */
    get reject(): (reason: string) => void {
        return this.#reject;
    }

    handleResponse(response: Response): void {
        if (response.ok) {
            this.#resolve(response);
        } else {
            this.#reject(response.statusText);
        }
    }
}

/**
 * A class to handle requests to the Moodle REST API.
 */
export default class Fetch {
    /** A Map of requests queued for the next batch execution. */
    #requestMap: Map<string, RequestWrapper> = new Map();

    /** The singleton instance of the automatic batcher, created lazily by {@link Fetch.getBatcher}. */
    static #batcher: Fetch | null = null;

    /** The timer handle used to automatically execute the batch after {@link Fetch#autoBatchTimeout}. */
    #delayTimer: ReturnType<typeof setTimeout> | null = null;

    /** Whether requests should be queued and sent as a single batch, per the `batchFetchRequests` config value. */
    #batchRequests: boolean = false;

    /**
     * The delay, in milliseconds, to use for the automatic batch timer.
     * A `null` value disables automatic execution.
     */
    #autoBatchTimeout: number | null = null;

    /**
     * Create a new instance of the Fetch class.
     *
     * When methods are called on an instance, they are queued and executed as a batch.
     *
     * By default a Fetch instance will not automatically execute the batch, but it can be configured to do so
     * by passing a value for the `autoBatchTimeout` parameter.
     *
     * The batcher can be executed manually by calling the {@link Fetch#execute} method.
     *
     * In cases where the batcher is executed with a single request the batch endpoint is _not_ used.
     *
     * @param autoBatchTimeout The amount of time, in milliseconds, to use for the automatic batch timer.
     *                         If null, the autobatcher is disabled.
     */
    constructor(autoBatchTimeout: number | null = null) {
        this.#autoBatchTimeout = autoBatchTimeout;
        this.#batchRequests = config.batchFetchRequests;
    }

    /**
     * Get the singleton instance of the batch processor.
     *
     * Note: The singleton instance is configured to automatically execute the batch 50ms after the final request
     * is added.
     *
     * @returns The singleton {@link Fetch} batcher instance.
     */
    static getBatcher(): Fetch {
        if (!this.#batcher) {
            this.#batcher = new this(50);
        }

        return this.#batcher;
    }

    /**
     * Make a single request to the Moodle API.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   Request options (params, body, method, headers, cachekey).
     * @returns A promise that resolves to the {@link Response}.
     */
    static async request(
        component: string,
        action: string,
        {
            cachekey = null,
            headers = {},
            params = {},
            body = null,
            method = 'GET',
        }: RequestOptions = {},
    ): Promise<Response> {
        const resolvePending = new Pending(`Requesting ${component}/${action} with ${method}`);
        const requestWrapper = Fetch.#getRequest(
            Fetch.#normaliseComponent(component),
            action,
            {headers, params, method, body, cachekey},
        );
        const result = await fetch(requestWrapper.request);

        resolvePending.resolve();
        requestWrapper.handleResponse(result);

        return requestWrapper.promise;
    }

    /**
     * Perform a GET request.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   Optional query-string parameters.
     */
    static performGet(
        component: string,
        action: string,
        {cachekey = null, headers = {}, params = {}}: ReadRequestOptions = {},
    ): Promise<Response> {
        return this.request(component, action, {cachekey, headers, params, method: 'GET'});
    }

    /**
     * Perform a HEAD request.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   Optional query-string parameters.
     */
    static performHead(
        component: string,
        action: string,
        {headers = {}, params = {}}: ReadRequestOptions = {},
    ): Promise<Response> {
        return this.request(component, action, {headers, params, method: 'HEAD'});
    }

    /**
     * Perform a POST request.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   The request body and optional headers.
     */
    static performPost(
        component: string,
        action: string,
        {headers = {}, body}: WriteRequestOptions,
    ): Promise<Response> {
        return this.request(component, action, {headers, body, method: 'POST'});
    }

    /**
     * Perform a PUT request.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   The request body and optional headers.
     */
    static performPut(
        component: string,
        action: string,
        {headers = {}, body}: WriteRequestOptions,
    ): Promise<Response> {
        return this.request(component, action, {headers, body, method: 'PUT'});
    }

    /**
     * Perform a PATCH request.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   The request body and optional headers.
     */
    static performPatch(
        component: string,
        action: string,
        {headers = {}, body}: WriteRequestOptions,
    ): Promise<Response> {
        return this.request(component, action, {headers, body, method: 'PATCH'});
    }

    /**
     * Perform a DELETE request.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   Optional query-string parameters and/or body.
     */
    static performDelete(
        component: string,
        action: string,
        {headers = {}, params = {}, body = null}: DeleteRequestOptions = {},
    ): Promise<Response> {
        return this.request(component, action, {headers, body, params, method: 'DELETE'});
    }

    /**
     * Queue a GET request to be sent as part of a batch.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   Optional query-string parameters.
     * @returns A promise that resolves to the {@link Response} for this request within the batch.
     */
    performGet(
        component: string,
        action: string,
        {cachekey = null, headers = {}, params = {}}: ReadRequestOptions = {},
    ): Promise<Response> {
        return this.#addRequest(component, action, {cachekey, headers, params, method: 'GET'});
    }

    /**
     * Queue a HEAD request to be sent as part of a batch.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   Optional query-string parameters.
     * @returns A promise that resolves to the {@link Response} for this request within the batch.
     */
    performHead(
        component: string,
        action: string,
        {headers = {}, params = {}}: ReadRequestOptions = {},
    ): Promise<Response> {
        return this.#addRequest(component, action, {headers, params, method: 'HEAD'});
    }

    /**
     * Queue a POST request to be sent as part of a batch.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   The request body and optional headers.
     * @returns A promise that resolves to the {@link Response} for this request within the batch.
     */
    performPost(
        component: string,
        action: string,
        {headers = {}, body}: WriteRequestOptions,
    ): Promise<Response> {
        return this.#addRequest(component, action, {headers, body, method: 'POST'});
    }

    /**
     * Queue a PUT request to be sent as part of a batch.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   The request body and optional headers.
     * @returns A promise that resolves to the {@link Response} for this request within the batch.
     */
    performPut(
        component: string,
        action: string,
        {headers = {}, body}: WriteRequestOptions,
    ): Promise<Response> {
        return this.#addRequest(component, action, {headers, body, method: 'PUT'});
    }

    /**
     * Queue a PATCH request to be sent as part of a batch.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   The request body and optional headers.
     * @returns A promise that resolves to the {@link Response} for this request within the batch.
     */
    performPatch(
        component: string,
        action: string,
        {headers = {}, body}: WriteRequestOptions,
    ): Promise<Response> {
        return this.#addRequest(component, action, {headers, body, method: 'PATCH'});
    }

    /**
     * Queue a DELETE request to be sent as part of a batch.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   Optional query-string parameters and/or body.
     * @returns A promise that resolves to the {@link Response} for this request within the batch.
     */
    performDelete(
        component: string,
        action: string,
        {headers = {}, params = {}, body = null}: DeleteRequestOptions = {},
    ): Promise<Response> {
        return this.#addRequest(component, action, {headers, body, params, method: 'DELETE'});
    }

    /**
     * Execute the batch request.
     *
     * If only a single request has been queued, it is sent directly rather than wrapped in a batch request.
     */
    async execute(): Promise<void> {
        const requestMap = this.#requestMap;
        this.#requestMap = new Map();

        if (requestMap.size === 0) {
            return;
        }

        if (requestMap.size === 1) {
            const requestWrapper = requestMap.values().next().value as RequestWrapper;
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
        const responseMap = new Map<string, Response>();

        responses.forEach((responseData) => {
            const subResponse = this.#getResponseFromText(responseData);
            const id = subResponse.headers.get('Content-ID') ?? '';
            responseMap.set(id, subResponse);
        });

        requestMap.forEach((requestWrapper, key) => {
            if (responseMap.has(key)) {
                requestWrapper.handleResponse(responseMap.get(key) as Response);
            } else {
                requestWrapper.reject(`Request failed. No response provided for request ${key} by provider`);
            }
        });
    }

    /**
     * Normalise a component name by stripping the `core_` prefix.
     */
    static #normaliseComponent(component: string): string {
        return component.replace(/^core_/, '');
    }

    /**
     * Add a request to the batch queue.
     *
     * @param component The frankenstyle component name.
     * @param endpoint  The endpoint within the component to call.
     * @param options   Request options, including the optional batch request `id`.
     * @returns A promise that resolves to the {@link Response} for this request within the batch.
     */
    #addRequest(
        component: string,
        endpoint: string,
        {
            cachekey = null,
            headers = {},
            params = {},
            body = null,
            method = 'GET',
            id = null,
        }: AddRequestOptions,
    ): Promise<Response> {
        if (this.#requestMap.size > 20) {
            this.execute();
        }

        let requestId: string;
        if (id) {
            if (this.#requestMap.has(id)) {
                throw new Error(`Request with ID ${id} already exists.`);
            }
            requestId = id;
        } else {
            do {
                requestId = this.#getGuid();
            } while (this.#requestMap.has(requestId));
        }

        const request = Fetch.#getRequest(
            Fetch.#normaliseComponent(component),
            endpoint,
            {cachekey, headers, params, method, body},
        );

        this.#requestMap.set(requestId, request);

        if (!this.#batchRequests) {
            this.execute();
        } else if (this.#autoBatchTimeout) {
            this.#queueExecution();
        }

        return request.promise;
    }

    /**
     * Queue the execution of the batch request after {@link Fetch#autoBatchTimeout} milliseconds.
     */
    #queueExecution(): void {
        if (this.#delayTimer) {
            clearTimeout(this.#delayTimer);
        }
        this.#delayTimer = setTimeout(() => this.execute(), this.#autoBatchTimeout as number);
    }

    /**
     * Build a {@link RequestWrapper} for a given API call.
     *
     * @param component The normalised component name.
     * @param endpoint  The endpoint within the component.
     * @param options   Request options.
     * @returns A new {@link RequestWrapper}.
     */
    static #getRequest(
        component: string,
        endpoint: string,
        {
            cachekey = null,
            headers = {},
            params = {},
            body = null,
            method = 'GET',
        }: RequestOptions,
    ): RequestWrapper {
        const urlParts: string[] = ['rest', 'v2'];
        if (cachekey && cachekey > 1) {
            urlParts.push(`cachekey:${cachekey}`);
        }
        urlParts.push(component, endpoint);

        const url = new URL(`${config.apibase}/${urlParts.join('/').replaceAll('//', '/')}`);
        const options: RequestInit & {headers: Record<string, string>} = {
            method,
            headers: {
                ...headers,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'pageparent': config.traceId || '',
            },
            signal: getGlobalAbortSignal(),
        };

        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        if (body) {
            if (body instanceof FormData) {
                options.body = body;
            } else if (typeof body === 'object') {
                options.body = JSON.stringify(body);
            } else {
                options.body = body;
            }
        }

        return new RequestWrapper(new Request(url, options));
    }

    /**
     * Build the compiled batch {@link Request}.
     *
     * Batch requests are formatted in a format as close as possible to ODATA 4.0.
     *
     * @param requestMap The map of request IDs to {@link RequestWrapper}s to include in the batch.
     * @returns A promise that resolves to the compiled batch {@link Request}.
     */
    async #getRequests(requestMap: Map<string, RequestWrapper>): Promise<Request> {
        const boundary = this.#getGuid();
        const getBoundaryMarker = (finalDelimiter: boolean = false): string => `--${boundary}${finalDelimiter ? '--' : ''}\n`;

        const getRequestHeader = (): string[] => ([
            getBoundaryMarker(),
            `Content-Type: application/http\n\n`,
        ]);

        const requestBodies = await Promise.all([...requestMap.entries()].map(async([id, {request}]) => {
            const thisBody: string[] = [];
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
            ...requestBodies.map((requestBody) => requestBody.join('')),
            getBoundaryMarker(true),
        ];

        return new Request(
            `${config.apibase}/$batch`,
            {
                body: body.join(''),
                method: 'POST',
                headers: {
                    'Content-Type': `multipart/mixed;boundary=${boundary}`,
                },
                signal: getGlobalAbortSignal(),
            },
        );
    }

    /**
     * Parse a single sub-response's raw text and return a {@link Response} object for it.
     *
     * @param text The raw text of the sub-response, as extracted from the batch response body.
     * @returns The parsed {@link Response}.
     */
    #getResponseFromText(text: string): Response {
        // Each sub-response part is in the format:
        //
        //   Content-Type: application/http
        //
        //   HTTP/1.1 200 OK
        //   Content-Type: application/json
        //   Content-ID: id
        //
        //   {body} (optional)
        //
        // The leading "Content-Type: application/http" envelope line is discarded, and any remaining
        // sections (there may be more than one if the body itself contains blank lines) are rejoined
        // to reconstruct the body.
        const [, headerText, ...bodyParts] = text.split(`\n\n`).map((part) => part.trim());
        const body = bodyParts.length ? bodyParts.join('\n\n').trim() : null;

        const headers = headerText.split(`\n`);

        // Extract the status from the rest of the headers.
        const statusLine = headers.shift() ?? '';
        const [, status, statusText] = statusLine.split(' ');

        const headerList: Array<[string, string]> = headers
            .filter((header) => header.length > 0)
            .map((header) => header.split(':', 2).map((value) => value.trim()) as [string, string]);

        return new Response(body, {
            status: Number(status),
            statusText,
            headers: new Headers(headerList),
        });
    }

    /**
     * Process the raw batch {@link Response} into a list of per-request response text, or a parsed JSON object.
     *
     * @param response The raw batch {@link Response}.
     * @returns The list of raw per-request response text (for `multipart/mixed` responses).
     */
    async #processBatchResponse(response: Response): Promise<string[]> {
        // Handle the response type.
        const contentType = response.headers.get('Content-Type') ?? '';
        if (contentType.startsWith('multipart/mixed')) {
            const [, boundaryPart] = contentType.split(';').map((part) => part.trim());
            const boundary = boundaryPart.replace('boundary=', '').trim();

            // Handle the multipart response.
            // An ODATA Batch response is in the format:
            // --[boundary]
            // [Content-Type]
            //
            // [Headers]
            //
            // [Body]
            //
            // It ends in a trailing `--`.
            const responseBody = await response.text();

            return responseBody.split(new RegExp(`(?:--${boundary}(?:--)?\n?)`, 'gm'))
                // Filter empty values (first and last).
                .filter((value) => !!value.length);
        } else if (contentType === 'application/json') {
            // Handle JSON response.
            return await response.json();
        }

        throw new Error(
            `Unknown response type '${contentType}'`,
        );
    }

    /**
     * Generate a GUID.
     *
     * Note: This is not a true GUID, but is random enough for our purposes.
     *
     * @returns A pseudo-random GUID string.
     */
    #getGuid(): string {
        let d = new Date().getTime();
        const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (d + Math.random() * 16) % 16 | 0; // eslint-disable-line no-bitwise
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); // eslint-disable-line no-bitwise
        });
        return guid;
    }
}
