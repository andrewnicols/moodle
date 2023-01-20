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
import { jest } from '@jest/globals';

jest.unstable_mockModule('core/ajax', () => ({
    default: {
        call: jest.fn(),
    },
}));

jest.unstable_mockModule('core/localstorage', () => ({
    default: {
        get: jest.fn(),
        set: jest.fn(),
    },
}));

const Str = await import('core/str');

// Fetch the mocked Ajax module.
const Ajax = (await import('core/ajax')).default;

beforeEach(() => {
    // Reset the mocks.
    Ajax.call.mockReset();

    global.M = {
        cfg: {
            langrev: -1,
        },
        str: {},
        util: {
            get_string: jest.fn(),
        },
    };
    document.documentElement.lang = 'en';
});

describe('Str.get_string', () => {
    // Note: This test is messy because:
    // - the Str module still calls the old lib/javascript-static.js function M.util.get_string
    // - it calls this even after fetching the result beacuse this performs the string interpolation
    // - we must therefore mock the M.util.get_string function
    // - we must also mock the Ajax call to the server to check filling of the string cache
    // - we must also mock just the string cache to check usage of it.
    it('will fetch a string if not defined', async() => {
        Ajax.call.mockImplementation((requests) => {
            requests[0].done('Hello world');
        });

        global.M.util.get_string.mockReturnValueOnce(Promise.resolve('Hello world'));
        const result = await Str.get_string('hello', 'core');

        expect(result).toBe('Hello world');
        expect(global.M.str.core).toBeDefined();
        expect(global.M.str.core.hello).toBeDefined();
        expect(global.M.str.core.hello).toBe('Hello world');
    });

    it('will use a defined string if it already exists', async() => {
        global.M.str.core = {
            hello: 'Hello different world',
        };

        global.M.util.get_string.mockReturnValueOnce(Promise.resolve('Hello different world'));
        const result = await Str.get_string('hello', 'core');

        expect(result).toBe('Hello different world');
        expect(Ajax.call).toHaveBeenCalledTimes(0);
    });
});
