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
 * @module     core/fetch
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

declare const M: {
    cfg: {
        apibase: string;
        traceId?: string;
    };
    util: {
        js_pending(key: string): void;
        js_complete(key: string): void;
    };
};

/** The body types accepted by write-method requests. */
type RequestBody = string | object | FormData;

/** Options for {@link request}. */
interface RequestOptions {
    /** Query-string parameters to append to the URL. */
    params?: Record<string, string>;
    /** The request body (for POST / PUT / PATCH / DELETE). */
    body?: RequestBody | null;
    /** The HTTP method to use. */
    method?: string;
}

/** Options for read-only convenience methods (GET / HEAD). */
interface ReadRequestOptions {
    /** Query-string parameters to append to the URL. */
    params?: Record<string, string>;
}

/** Options for write convenience methods (POST / PUT / PATCH). */
interface WriteRequestOptions {
    /** The request body. */
    body: RequestBody;
}

/** Options for the DELETE convenience method. */
interface DeleteRequestOptions {
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

    handleResponse(response: Response): void {
        if (response.ok) {
            this.#resolve(response);
        } else {
            this.#reject(response.statusText);
        }
    }
}

/**
 * Register a pending operation with Moodle's Behat integration.
 *
 * Returns a callback that marks the operation complete.
 *
 * @param key A descriptive identifier for debugging.
 * @returns A function that resolves the pending operation.
 */
function markPending(key: string): () => void {
    M.util.js_pending(key);
    return () => M.util.js_complete(key);
}

/**
 * Normalise a component name by stripping the `core_` prefix.
 */
function normaliseComponent(component: string): string {
    return component.replace(/^core_/, '');
}

/**
 * Build a {@link RequestWrapper} for a given API call.
 */
function getRequest(
    component: string,
    endpoint: string,
    {params = {}, body = null, method = 'GET'}: RequestOptions,
): RequestWrapper {
    const url = new URL(`${M.cfg.apibase}/rest/v2/${component}/${endpoint}`);
    const options: RequestInit & {headers: Record<string, string>} = {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'pageparent': M.cfg.traceId || '',
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
 * Make a single request to the Moodle REST API.
 *
 * @param component The frankenstyle component name.
 * @param action    The component action to perform.
 * @param options   Request options (params, body, method).
 * @returns A promise that resolves to the {@link Response}.
 */
export async function request(
    component: string,
    action: string,
    {params = {}, body = null, method = 'GET'}: RequestOptions = {},
): Promise<Response> {
    const resolvePending = markPending(`Requesting ${component}/${action} with ${method}`);
    const wrapper = getRequest(
        normaliseComponent(component),
        action,
        {params, method, body},
    );
    const result = await fetch(wrapper.request);

    resolvePending();
    wrapper.handleResponse(result);

    return wrapper.promise;
}

/**
 * Perform a GET request.
 *
 * @param component The frankenstyle component name.
 * @param action    The component action to perform.
 * @param options   Optional query-string parameters.
 */
export function performGet(
    component: string,
    action: string,
    {params = {}}: ReadRequestOptions = {},
): Promise<Response> {
    return request(component, action, {params, method: 'GET'});
}

/**
 * Perform a HEAD request.
 *
 * @param component The frankenstyle component name.
 * @param action    The component action to perform.
 * @param options   Optional query-string parameters.
 */
export function performHead(
    component: string,
    action: string,
    {params = {}}: ReadRequestOptions = {},
): Promise<Response> {
    return request(component, action, {params, method: 'HEAD'});
}

/**
 * Perform a POST request.
 *
 * @param component The frankenstyle component name.
 * @param action    The component action to perform.
 * @param options   The request body.
 */
export function performPost(
    component: string,
    action: string,
    {body}: WriteRequestOptions,
): Promise<Response> {
    return request(component, action, {body, method: 'POST'});
}

/**
 * Perform a PUT request.
 *
 * @param component The frankenstyle component name.
 * @param action    The component action to perform.
 * @param options   The request body.
 */
export function performPut(
    component: string,
    action: string,
    {body}: WriteRequestOptions,
): Promise<Response> {
    return request(component, action, {body, method: 'PUT'});
}

/**
 * Perform a PATCH request.
 *
 * @param component The frankenstyle component name.
 * @param action    The component action to perform.
 * @param options   The request body.
 */
export function performPatch(
    component: string,
    action: string,
    {body}: WriteRequestOptions,
): Promise<Response> {
    return request(component, action, {body, method: 'PATCH'});
}

/**
 * Perform a DELETE request.
 *
 * @param component The frankenstyle component name.
 * @param action    The component action to perform.
 * @param options   Optional query-string parameters and/or body.
 */
export function performDelete(
    component: string,
    action: string,
    {params = {}, body = null}: DeleteRequestOptions = {},
): Promise<Response> {
    return request(component, action, {body, params, method: 'DELETE'});
}

/**
 * A class-based API that mirrors the original AMD module interface.
 *
 * All methods delegate to the standalone exported functions. This default
 * export preserves backwards compatibility for consumers that use
 * `import Fetch from 'core/fetch'` and call static methods on the class.
 */
export default class Fetch {
    static request = request;
    static performGet = performGet;
    static performHead = performHead;
    static performPost = performPost;
    static performPut = performPut;
    static performPatch = performPatch;
    static performDelete = performDelete;
}
