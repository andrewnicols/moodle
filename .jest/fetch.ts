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
 * Jest setup for mocking the core/fetch ESM module.
 *
 * Provides a `mockFetchResponse` global helper that registers canned responses
 * for specific component/action routes. Any call to a fetch method whose route
 * has not been mocked will throw a descriptive error.
 *
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import * as fetchModule from '@moodle/lms/core/fetch';

declare global {
    function mockFetchResponse(
        component: string,
        action: string,
        data: unknown,
        options?: {status?: number; statusText?: string},
    ): void;
}

jest.mock('@moodle/lms/core/fetch');

const {
    request: fetchRequest,
    performGet,
    performHead,
    performPost,
    performPut,
    performPatch,
    performDelete,
} = fetchModule;

/** Shape of a mocked fetch route entry. */
interface MockedFetchRoute {
    data: unknown;
    status: number;
    statusText: string;
}

/**
 * @var fetchRouteMap - A map to store mocked fetch responses keyed as 'component:action'.
 */
const fetchRouteMap = new Map<string, MockedFetchRoute>();

/**
 * Build a Response-like object from a mocked fetch route entry.
 *
 * @param route The stored route data.
 * @returns A plain object with ok, status, statusText, json(), text(), and headers.
 */
function buildMockResponse(route: MockedFetchRoute): Record<string, unknown> {
    const body = typeof route.data === 'string' ? route.data : JSON.stringify(route.data);
    return {
        ok: route.status >= 200 && route.status < 300,
        status: route.status,
        statusText: route.statusText,
        headers: new Map<string, string>([['content-type', 'application/json']]),
        json: () => Promise.resolve(route.data),
        text: () => Promise.resolve(body),
    };
}

/**
 * Generic mock implementation for any fetch convenience method.
 * Looks up the route in fetchRouteMap and returns the mocked response, or throws.
 *
 * @param methodName Display name of the method (for error messages).
 * @param component The frankenstyle component name.
 * @param action The component action.
 * @returns A Promise resolving to the mocked Response-like object.
 */
function fetchMethodMock(methodName: string, component: string, action: string): Promise<Record<string, unknown>> {
    const key = `${component}:${action}`;
    if (fetchRouteMap.has(key)) {
        const route = fetchRouteMap.get(key)!;
        const response = buildMockResponse(route);
        if (response.ok) {
            return Promise.resolve(response);
        }
        return Promise.reject(response.statusText);
    }
    throw new Error(`Unexpected call to ${methodName} with route: ${component}/${action}`);
}

beforeEach(() => {
    // Wire up mock implementations for the fetch module.
    (fetchRequest as jest.Mock).mockImplementation(
        (component: string, action: string) => fetchMethodMock('request', component, action),
    );
    (performGet as jest.Mock).mockImplementation(
        (component: string, action: string) => fetchMethodMock('performGet', component, action),
    );
    (performHead as jest.Mock).mockImplementation(
        (component: string, action: string) => fetchMethodMock('performHead', component, action),
    );
    (performPost as jest.Mock).mockImplementation(
        (component: string, action: string) => fetchMethodMock('performPost', component, action),
    );
    (performPut as jest.Mock).mockImplementation(
        (component: string, action: string) => fetchMethodMock('performPut', component, action),
    );
    (performPatch as jest.Mock).mockImplementation(
        (component: string, action: string) => fetchMethodMock('performPatch', component, action),
    );
    (performDelete as jest.Mock).mockImplementation(
        (component: string, action: string) => fetchMethodMock('performDelete', component, action),
    );

    /**
     * Register a mocked fetch response for a specific component/action route.
     *
     * @param component The frankenstyle component name.
     * @param action The component action.
     * @param data The response data (will be returned by json() and stringified for text()).
     * @param options Optional status code and status text overrides.
     */
    (global as any).mockFetchResponse = (
        component: string,
        action: string,
        data: unknown,
        options?: {status?: number; statusText?: string},
    ): void => {
        const status = options?.status ?? 200;
        const statusText = options?.statusText ?? 'OK';
        fetchRouteMap.set(`${component}:${action}`, {data, status, statusText});
    };
});

afterEach(() => {
    fetchRouteMap.clear();
});
