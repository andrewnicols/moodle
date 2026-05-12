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
 * By default the Fetch instance will not automatically execute the batch, but it can be configured to do so
 * by passing a value for the `autoBatchTimeout` parameter.
 *
 * The batcher can be executed manually by calling the {@link Fetch.execute} method.
 *
 * Note: In cases where the batcher is executed with a single request the batch endpoint is _not_ used.
 *
 * A helper method, {@link Fetch.getBatcher}, exists to fetch a singleton instance
 * of the class. This singleton is configured to automatically execute batch requests.
 *
 * @module     core/fetch
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import config from '@moodle/lms/core/config';
import Pending from '@moodle/lms/core/pending';

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
 * The core/fetch module allows you to make web service requests to the Moodle API.
 *
 * @see module:core/fetch
 */
export default class Fetch {
    #requestMap = new Map<string, RequestWrapper>();
    static #batcher: Fetch | null = null;
    #delayTimer: ReturnType<typeof setTimeout> | null = null;
    #batchRequests = false;
    #autoBatchTimeout: number | null = null;

    /**
     * Create a new instance of the Fetch Class.
     *
     * When methods are called on an Instance, they are queued and executed as a batch.
     *
     * By default the Fetch instance will not automatically execute the batch, but it can be configured to do so
     * by passing a value for the `autoBatchTimeout` parameter.
     *
     * In cases where the batcher is executed with a single request the batch endpoint is _not_ used.
     *
     * @param autoBatchTimeout The amount of time (ms) to use when applying the automatic batch timer.
     *                         If null, the autobatcher is disabled.
     */
    constructor(autoBatchTimeout: number | null = null) {
        this.#autoBatchTimeout = autoBatchTimeout;
        this.#batchRequests = !!config.batchFetchRequests;
    }

    /**
     * Get the singleton instance of batch processor.
     *
     * The singleton instance is configured to automatically execute the batch 50ms after the final request is added.
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

    // ── Instance methods (batched) ────────────────────────────────────────

    /**
     * Queue a GET request in the batch.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   Optional query-string parameters.
     */
    performGet(
        component: string,
        action: string,
        {cachekey = null, headers = {}, params = {}}: ReadRequestOptions = {},
    ): Promise<Response> {
        return this.#addRequest(component, action, {cachekey, headers, params, method: 'GET'});
    }

    /**
     * Queue a HEAD request in the batch.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   Optional query-string parameters.
     */
    performHead(
        component: string,
        action: string,
        {headers = {}, params = {}}: ReadRequestOptions = {},
    ): Promise<Response> {
        return this.#addRequest(component, action, {headers, params, method: 'HEAD'});
    }

    /**
     * Queue a POST request in the batch.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   The request body and optional headers.
     */
    performPost(
        component: string,
        action: string,
        {headers = {}, body}: WriteRequestOptions,
    ): Promise<Response> {
        return this.#addRequest(component, action, {headers, body, method: 'POST'});
    }

    /**
     * Queue a PUT request in the batch.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   The request body and optional headers.
     */
    performPut(
        component: string,
        action: string,
        {headers = {}, body}: WriteRequestOptions,
    ): Promise<Response> {
        return this.#addRequest(component, action, {headers, body, method: 'PUT'});
    }

    /**
     * Queue a PATCH request in the batch.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   The request body and optional headers.
     */
    performPatch(
        component: string,
        action: string,
        {headers = {}, body}: WriteRequestOptions,
    ): Promise<Response> {
        return this.#addRequest(component, action, {headers, body, method: 'PATCH'});
    }

    /**
     * Queue a DELETE request in the batch.
     *
     * @param component The frankenstyle component name.
     * @param action    The component action to perform.
     * @param options   Optional query-string parameters and/or body.
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
     * If there is only one queued request the batch endpoint is _not_ used.
     */
    async execute(): Promise<void> {
        const requestMap = this.#requestMap;
        this.#requestMap = new Map();

        if (requestMap.size === 0) {
            return;
        }

        if (requestMap.size === 1) {
            const requestWrapper = requestMap.values().next().value!;
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

        responses.forEach((responseData: string) => {
            const resp = this.#getResponseFromText(responseData);
            const id = resp.headers.get('Content-ID');
            if (id) {
                responseMap.set(id, resp);
            }
        });

        requestMap.forEach((requestWrapper, key) => {
            if (responseMap.has(key)) {
                requestWrapper.handleResponse(responseMap.get(key)!);
            } else {
                requestWrapper.reject(`Request failed. No response provided for request ${key} by provider`);
            }
        });
    }

    // ── Private helpers ───────────────────────────────────────────────────

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
     * @param options   Request options.
     * @returns A promise that resolves to the {@link Response}.
     */
    #addRequest(
        component: string,
        endpoint: string,
        {
            headers = {},
            params = {},
            body = null,
            method = 'GET',
            cachekey = null,
        }: RequestOptions = {},
    ): Promise<Response> {
        if (this.#requestMap.size > 20) {
            this.execute();
        }

        let id: string;
        do {
            id = Fetch.#getGuid();
        } while (this.#requestMap.has(id));

        const requestWrapper = Fetch.#getRequest(
            Fetch.#normaliseComponent(component),
            endpoint,
            {headers, params, method, body, cachekey},
        );

        this.#requestMap.set(id, requestWrapper);

        if (!this.#batchRequests) {
            this.execute();
        } else if (this.#autoBatchTimeout) {
            this.#queueExecution();
        }

        return requestWrapper.promise;
    }

    /**
     * Queue the execution of the batch request.
     */
    #queueExecution(): void {
        if (this.#delayTimer) {
            clearTimeout(this.#delayTimer);
        }
        this.#delayTimer = setTimeout(() => this.execute(), this.#autoBatchTimeout!);
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
            },
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
     * Get the compiled batch Request formatted as ODATA 4.0 multipart/mixed.
     *
     * @param requestMap The map of requests to batch.
     * @returns A {@link Request} for the batch endpoint.
     */
    async #getRequests(requestMap: Map<string, RequestWrapper>): Promise<Request> {
        const boundary = Fetch.#getGuid();
        const getBoundaryMarker = (finalDelimiter: boolean): string => `--${boundary}${finalDelimiter ? '--' : ''}\n`;

        const getRequestHeader = (): string[] => [
            getBoundaryMarker(false),
            'Content-Type: application/http\n\n',
        ];

        const requestBodies = await Promise.all(
            Array.from(requestMap.entries()).map(async ([id, {request}]) => {
                const thisBody: string[] = [];
                thisBody.push(...getRequestHeader());
                thisBody.push(`${request.method} ${request.url}\n`);
                thisBody.push(`Content-Type: ${request.headers.get('Content-Type')}\n`);
                thisBody.push(`Content-ID: ${id}\n`);

                if (request.body) {
                    thisBody.push('\n');
                    thisBody.push(await request.text());
                }

                thisBody.push('\n');
                return thisBody;
            }),
        );

        const body = [
            // Add a prologue to aid debugging.
            ...Array.from(requestMap.values()).map(
                (wrapper) => `# Requesting ${wrapper.request.method} ${wrapper.request.url}\n`,
            ),
            // Now add the actual request bodies.
            ...requestBodies.map((requestBody) => requestBody.join('')),
            // The final boundary marker.
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
            },
        );
    }

    /**
     * Process a body text and return a Response object.
     *
     * @param text The raw text of a single response within the batch.
     * @returns A reconstructed {@link Response}.
     */
    #getResponseFromText(text: string): Response {
        const parts: (string | null)[] = text.split('\n\n').map((part) => part.trim());

        // Remove the boundaries.
        parts.shift();
        parts.pop();

        // Add an extra part to simplify header/body extraction.
        parts.push(null);

        const [headerText, body] = parts as [string, string | null];
        const headers = headerText.split('\n');

        // Extract the status from the rest of the headers.
        const statusLine = headers.shift()!;
        const matches = statusLine.match(/HTTP\/(?<protocol>[^ ]*) (?<status>\d{3}) (?<statusText>.*)$/);
        const status = Number(matches?.groups?.status ?? 500);
        const statusText = matches?.groups?.statusText ?? 'Internal Server Error';

        const headerList: [string, string][] = headers.map((header) => {
            const [key, ...rest] = header.split(':');
            return [key.trim(), rest.join(':').trim()];
        });

        return new Response(body, {
            status,
            statusText,
            headers: new Headers(headerList),
        });
    }

    /**
     * Process the batch response.
     *
     * @param response The batch Response from the server.
     * @returns An array of raw response text segments.
     */
    async #processBatchResponse(response: Response): Promise<string[]> {
        const contentType = response.headers.get('Content-Type') ?? '';
        if (contentType.startsWith('multipart/mixed')) {
            const [, boundaryPart] = contentType.split(';').map((part) => part.trim());
            const boundary = boundaryPart.replace('boundary=', '').trim();

            const responseBody = await response.text();

            return responseBody
                .split(new RegExp(`(?:--${boundary}(?:--)?\n?)`, 'gm'))
                .filter((value) => !!value.length);
        } else if (contentType === 'application/json') {
            return response.json();
        }

        throw new Error(`Unknown response type '${contentType}'`);
    }

    /**
     * Generate a GUID.
     *
     * Note: This is not a true GUID, but is random enough for our purposes.
     */
    static #getGuid(): string {
        let d = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}

// ── Named exports (delegate to static methods) ──────────────────────────

export const request = Fetch.request.bind(Fetch);
export const performGet = Fetch.performGet.bind(Fetch);
export const performHead = Fetch.performHead.bind(Fetch);
export const performPost = Fetch.performPost.bind(Fetch);
export const performPut = Fetch.performPut.bind(Fetch);
export const performPatch = Fetch.performPatch.bind(Fetch);
export const performDelete = Fetch.performDelete.bind(Fetch);
