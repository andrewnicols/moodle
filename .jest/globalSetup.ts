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

declare global {
    function mockAmdModule(moduleName: string, module: string|object): void;
    function mockString(identifier: string, component: string, resolved: string): void;
}

/**
 * @var mockedModules - A map to store mocked AMD modules by their name.
*/
const mockedModules = new Map<string, any>();

/**
 * @var stringMap - A map to store mocked strings with keys in the format 'component:identifier'.
 */
const stringMap = new Map<string, string>();

// Mock the global functions for mocking AMD modules and strings, making them available in all test files.

jest.mock('@moodle/lms/core/amd');

beforeEach(() => {

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
});

afterEach(() => {
    // Clear the mocked modules and strings after each test to ensure a clean state for the next test.
    mockedModules.clear();
    stringMap.clear();
});
