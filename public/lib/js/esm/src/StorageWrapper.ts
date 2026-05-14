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
 * Wrap an instance of the browser's local or session storage to handle
 * cache expiry, key namespacing and other helpful things.
 *
 * @module     core/storagewrapper
 * @copyright  2017 Ryan Wyllie <ryan@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import config from './config';

/**
 * A wrapper around the browser's Storage API (localStorage / sessionStorage)
 * that adds key namespacing (by site + jsrev) and automatic cache invalidation
 * when the Moodle jsrev changes.
 */
export default class StorageWrapper {
    #storage: Storage;
    #supported: boolean;
    #prefix: string;
    #jsrevPrefix: string;

    /**
     * @param storage The underlying Storage instance (e.g. `window.localStorage`).
     */
    constructor(storage: Storage) {
        this.#storage = storage;
        this.#supported = this.#detectSupport();

        const hashSource = `${config.wwwroot}/${config.jsrev}`;
        this.#prefix = `${StorageWrapper.hashString(hashSource)}/`;
        this.#jsrevPrefix = `${StorageWrapper.hashString(config.wwwroot)}/jsrev`;
        this.#validateCache();
    }

    /**
     * Check if the browser supports the type of storage.
     */
    #detectSupport(): boolean {
        if (config.jsrev === -1) {
            // Disable cache if debugging.
            return false;
        }
        if (typeof this.#storage === 'undefined') {
            return false;
        }
        const testKey = 'test';
        try {
            if (this.#storage === null) {
                return false;
            }
            // MDL-51461 - Some browsers misreport availability of the storage
            // so check it is actually usable.
            this.#storage.setItem(testKey, '1');
            this.#storage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Add a unique prefix to all keys so multiple moodle sites do not share caches.
     */
    #prefixKey(key: string): string {
        return this.#prefix + key;
    }

    /**
     * Check the current jsrev version and clear the cache if it has been bumped.
     */
    #validateCache(): void {
        if (!this.#supported) {
            return;
        }
        const cacheVersion = this.#storage.getItem(this.#jsrevPrefix);
        if (cacheVersion === null) {
            this.#storage.setItem(this.#jsrevPrefix, String(config.jsrev));
            return;
        }

        if (String(config.jsrev) !== cacheVersion) {
            this.#storage.clear();
            this.#storage.setItem(this.#jsrevPrefix, String(config.jsrev));
        }
    }

    /**
     * Hash a string, used to make shorter key prefixes.
     *
     * @param source The string to hash
     * @returns A 32-bit integer hash
     */
    static hashString(source: string): number {
        let hash = 0;
        for (let i = 0; i < source.length; i++) {
            /* eslint-disable no-bitwise */
            hash = ((hash << 5) - hash) + source.charCodeAt(i);
            hash |= 0;
            /* eslint-enable no-bitwise */
        }
        return hash;
    }

    /**
     * Get a value from storage.
     *
     * @param key The cache key to check.
     * @returns The cached string, or `null` if not found or storage is unsupported.
     */
    get(key: string): string | null {
        if (!this.#supported) {
            return null;
        }
        return this.#storage.getItem(this.#prefixKey(key));
    }

    /**
     * Set a value in storage.
     *
     * @param key The cache key to set.
     * @param value The value to set.
     * @returns `true` on success, `false` if storage is unsupported or full.
     */
    set(key: string, value: string): boolean {
        if (!this.#supported) {
            return false;
        }
        try {
            this.#storage.setItem(this.#prefixKey(key), value);
        } catch {
            return false;
        }
        return true;
    }

    /**
     * Clear all items from the underlying storage.
     */
    clean(): void {
        this.#storage.clear();
    }
}
