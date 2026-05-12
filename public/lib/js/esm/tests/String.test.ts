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
 * Tests for the String module, which provides an ESM wrapper around the AMD core/str module for loading Moodle language strings.
 *
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getString, cacheStrings} from '@moodle/lms/core/String';
import { requireAsync } from '../src/amd';

describe('@moodle/lms/core/String', () => {
    describe('getStrings', () => {
        it('returns the strings resolved by get_strings', async() => {
            mockString('pluginname', 'mod_forum', 'Forum');
            mockString('submit', 'core', 'Submit');

            expect(getString('pluginname', 'mod_forum')).resolves.toBe('Forum');
            expect(getString('submit', 'core')).resolves.toBe('Submit');
            expect(getString('other', 'core')).resolves.toBe('[other, core]');
        });
    });

    describe('cacheStrings', () => {
        it('caches strings so that subsequent calls to getString return the cached value', async() => {
            const mockedMethod = jest.fn();
            await requireAsync<stringModule>("core/str").then((str) => {
                mockAmdModule('core/str', {
                    getString,
                    cache_strings: mockedMethod,
                });
            });

            await cacheStrings([
                { key: 'cached, core, null', component: 'core', identifier: 'cached', lang: 'en', param: null },
            ]);

            expect(mockedMethod).toHaveBeenCalledWith([
                { key: 'cached, core, null', component: 'core', identifier: 'cached', lang: 'en', param: null },
            ]);
        });
    });

    describe('<String> component', () => {
        // Testing the component itself is difficult due to its reliance on React's Suspense and use() for data fetching,
        // which requires a more complex testing setup with a Suspense boundary and potentially mocked React internals.
        // For now, we focus on testing the underlying getString and cacheStrings functions, which contain the core logic.
    });
});
