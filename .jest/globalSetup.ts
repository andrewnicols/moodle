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
 * Global setup for Jest tests, providing utilities for mocking AMD modules and strings.
 *
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {
    requireAsync,
    requireManyAsync,
} from '@moodle/lms/core/amd';
import {resetStringCache} from '@moodle/lms/core/String';
import * as fetchModule from '@moodle/lms/core/fetch';

declare global {
    function mockAmdModule(moduleName: string, module: string|object): void;
    function mockString(identifier: string, component: string, resolved: string): void;
    function mockPendingString(identifier: string, component: string): void;
    function mockFetchResponse(
        component: string,
        action: string,
        data: unknown,
        options?: {status?: number; statusText?: string},
    ): void;
}

/**
 * @var mockedModules - A map to store mocked AMD modules by their name.
*/
const mockedModules = new Map<string, any>();

/**
 * @var stringMap - A map to store mocked strings with keys in the format 'component:identifier'.
 */
const stringMap = new Map<string, string>();

/**
 * @var pendingStringSet - A set of string keys that should return a never-resolving promise.
 */
const pendingStringSet = new Set<string>();

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

// Mock the global functions for mocking AMD modules and strings, making them available in all test files.

jest.mock('@moodle/lms/core/amd');
jest.mock('@moodle/lms/core/String', () => jest.requireActual('@moodle/lms/core/String'));
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
    resetStringCache();

    // Provide a mock implementation for requireAsync to return mocked modules when requested.
    // If a module is not mocked, it throws an error to indicate an unexpected call.
    (requireAsync as jest.Mock).mockImplementation((name: string) => {
        if (mockedModules.has(name)) {
            return Promise.resolve(mockedModules.get(name));
        }

        throw new Error(`Unexpected call to requireAsync with module name: ${name}`);
    });

    // Provide a mock implementation for requireManyAsync to return mocked modules in the order requested.
    (requireManyAsync as jest.Mock).mockImplementation((names: string[]) => {
        const modules = names.map(name => {
            if (mockedModules.has(name)) {
                return mockedModules.get(name);
            }

            throw new Error(`Unexpected call to requireManyAsync with module name: ${name}`);
        });

        return Promise.resolve(modules);
    });

    /**
     * Mocks an AMD module for testing purposes.
     *
     * @param moduleName The name of the AMD module to mock
     * @param module The module implementation to use for mocking
     */
    (global as any).mockAmdModule = (moduleName: string, module: string|object) => {
        mockedModules.set(moduleName, module);
    };

    // Mocks the 'core/str' AMD module to return predefined strings for testing purposes.
    // The mock implementation checks the stringMap for a matching key and returns the corresponding value.
    // If no match is found, it returns a default string in the format '[identifier, component]'.
    (global as any).mockAmdModule('core/str', {
        get_string: jest.fn((identifier: string, component?: string, params?: any) => {
            const key = `${component}:${identifier}`;
            if (pendingStringSet.has(key)) {
                return new Promise(() => {});
            }
            if (stringMap.has(key)) {
                return Promise.resolve(stringMap.get(key));
            }
            return Promise.resolve(`[${identifier}, ${component}]`);
        }),
    });

    /**
     * Provide a value for a mocked string.
     *
     * @param identifier The string identifier (key) to mock.
     * @param component The component the string belongs to.
     * @param resolved The value that should be returned when the string is requested.
     */
    (global as any).mockString = (identifier: string, component: string, resolved: string): void => {
        stringMap.set(`${component}:${identifier}`, resolved);
    };

    /**
     * Mock a string so that it remains permanently pending (never resolves).
     * Useful for testing Suspense fallback rendering.
     *
     * @param identifier The string identifier (key) to mock.
     * @param component The component the string belongs to.
     */
    (global as any).mockPendingString = (identifier: string, component: string): void => {
        pendingStringSet.add(`${component}:${identifier}`);
    };

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
    // Clear the mocked modules, strings, and fetch routes after each test to ensure a clean state.
    mockedModules.clear();
    stringMap.clear();
    pendingStringSet.clear();
    fetchRouteMap.clear();
});
