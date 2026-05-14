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
 * Tests for the LocalStorage ESM module.
 *
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import { get, set, clean } from '@moodle/lms/core/LocalStorage';

describe('LocalStorage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    // Note: The LocalStorage singleton is created at module load time with the
    // initial M.cfg values. Since globalM.ts sets jsrev=-1 (developer mode),
    // the StorageWrapper has caching disabled. The actual get/set/clean logic
    // is fully tested in StorageWrapper.test.ts. These tests verify the module
    // exports the correct functions that delegate to the underlying wrapper.

    it('exports get as a function', () => {
        expect(typeof get).toBe('function');
    });

    it('exports set as a function', () => {
        expect(typeof set).toBe('function');
    });

    it('exports clean as a function', () => {
        expect(typeof clean).toBe('function');
    });

    it('get returns null when caching is disabled (jsrev=-1)', () => {
        expect(get('anykey')).toBeNull();
    });

    it('set returns false when caching is disabled (jsrev=-1)', () => {
        expect(set('anykey', 'value')).toBe(false);
    });

    it('clean delegates to storage.clear()', () => {
        localStorage.setItem('something', 'value');
        clean();
        expect(localStorage.length).toBe(0);
    });
});
