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
 * Simple API for set/get to localStorage, with cacherev expiration.
 *
 * @module     core/localstorage
 * @copyright  2015 Damyon Wiese <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      2.9
 */

import StorageWrapper from './StorageWrapper';

/** A singleton StorageWrapper instance backed by `window.localStorage`. */
const storage = new StorageWrapper(window.localStorage);

/**
 * Get a value from local storage.
 *
 * @param key The cache key to check.
 * @returns The cached string, or `null` if not found or storage is unsupported.
 */
export const get = (key: string): string | null => storage.get(key);

/**
 * Set a value in local storage.
 *
 * @param key The cache key to set.
 * @param value The value to set.
 * @returns `true` on success, `false` if storage is unsupported or full.
 */
export const set = (key: string, value: string): boolean => storage.set(key, value);

/**
 * Clear all items from local storage.
 */
export const clean = (): void => storage.clean();

export default {get, set, clean};
