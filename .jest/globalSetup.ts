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

declare global {
    function mockAmdModule(moduleName: string, module: string|object): void;
    function mockString(identifier: string, component: string, resolved: string): void;
    function mockPendingString(identifier: string, component: string): void;
    /** Keys passed to `M.util.js_pending()` since the last reset. */
    var pendingStack: string[];
    /** Keys passed to `M.util.js_complete()` since the last reset. */
    var completeStack: string[];
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

/**
 * @var pendingStack - Tracks keys passed to `M.util.js_pending()` in the current test.
 */
const pendingStack: string[] = [];

/**
 * @var completeStack - Tracks keys passed to `M.util.js_complete()` in the current test.
 */
const completeStack: string[] = [];

(globalThis as any).pendingStack = pendingStack;
(globalThis as any).completeStack = completeStack;

// Provide the global M object with cfg defaults and tracked js_pending/js_complete mocks.
const defaultCfg = {
    wwwroot: 'https://example.com',
    apibase: 'https://example.com',
    homeurl: '/',
    sesskey: 'test-sesskey',
    sessiontimeout: 7200,
    sessiontimeoutwarning: 1200,
    themerev: 1,
    slasharguments: 1,
    theme: 'boost',
    iconsystemmodule: 'core/icon_system_fontawesome',
    jsrev: -1,
    admin: 'admin',
    svgicons: true,
    usertimezone: 'Australia/Perth',
    language: 'en',
    courseId: 0,
    courseContextId: 0,
    contextid: 1,
    contextInstanceId: 0,
    langrev: 1,
    templaterev: 1,
    siteId: 1,
    userId: 2,
    deprecationignorelist: [],
    traceId: 'test-trace-id',
    developerdebug: true,
    batchFetchRequests: false,
};

(globalThis as any).M = {
    cfg: {...defaultCfg},
    util: {
        js_pending: jest.fn((key: string) => {
            pendingStack.push(key);
        }),
        js_complete: jest.fn((key: string) => {
            completeStack.push(key);
        }),
    },
};

// Mock the global functions for mocking AMD modules and strings, making them available in all test files.

jest.mock('@moodle/lms/core/amd');
jest.mock('@moodle/lms/core/String', () => jest.requireActual('@moodle/lms/core/String'));

beforeEach(() => {
    pendingStack.length = 0;
    completeStack.length = 0;
    Object.assign((globalThis as any).M.cfg, defaultCfg);

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
});

afterEach(() => {
    // Clear the mocked modules, strings, and fetch routes after each test to ensure a clean state.
    mockedModules.clear();
    stringMap.clear();
    pendingStringSet.clear();
});
