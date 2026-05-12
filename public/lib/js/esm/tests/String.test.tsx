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

import {render, screen, act} from '@testing-library/react';
import {getString, cacheStrings} from '@moodle/lms/core/String';
import String from '@moodle/lms/core/String';

describe('@moodle/lms/core/String', () => {
    describe('getString', () => {
        it('returns the default value for an unmocked string', async() => {
            await expect(getString('other', 'core')).resolves.toBe('[other, core]');
        });

        it('returns the default value using core component when no component is specified', async() => {
            await expect(getString('save')).resolves.toBe('[save, core]');
        });

        it('returns the mocked value when a string has been mocked', async() => {
            mockString('pluginname', 'mod_forum', 'Forum');
            mockString('submit', 'core', 'Submit');

            await expect(getString('pluginname', 'mod_forum')).resolves.toBe('Forum');
            await expect(getString('submit', 'core')).resolves.toBe('Submit');
        });

        it('returns the default for strings not matching any mock', async() => {
            mockString('submit', 'core', 'Submit');

            await expect(getString('cancel', 'core')).resolves.toBe('[cancel, core]');
        });

        it('returns a stable promise reference for the same key', () => {
            const promise1 = getString('stable', 'core');
            const promise2 = getString('stable', 'core');

            expect(promise1).toBe(promise2);
        });
    });

    describe('cacheStrings', () => {
        it('delegates to the AMD module cache_strings method', async() => {
            const mockedCacheStrings = jest.fn();
            mockAmdModule('core/str', {
                get_string: jest.fn(),
                cache_strings: mockedCacheStrings,
            });

            const strings = [
                {key: 'cached', component: 'core', identifier: 'cached', lang: 'en', param: null},
            ];

            await cacheStrings(strings);

            expect(mockedCacheStrings).toHaveBeenCalledWith(strings);
        });
    });

    describe('<String> component', () => {
        it('renders the resolved string', async() => {
            mockString('greeting', 'core', 'Hello World');

            await act(async () => {
                render(<String identifier="greeting" component="core" />);
            });

            expect(screen.getByText('Hello World')).toBeInTheDocument();
        });

        it('renders the default fallback while suspended', () => {
            render(<String identifier="loading" component="mod_quiz" />);

            expect(screen.getByText('loading, mod_quiz')).toBeInTheDocument();
        });

        it('renders custom children as fallback while suspended', () => {
            render(
                <String identifier="loading" component="core">
                    <span>Loading...</span>
                </String>,
            );

            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });

        it('defaults component to core', async() => {
            mockString('save', 'core', 'Save');

            await act(async () => {
                render(<String identifier="save" />);
            });

            expect(screen.getByText('Save')).toBeInTheDocument();
        });
    });
});
