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

import Config from 'core/config';

export default class StorageWrapper {

    static cacheRevisionValue;

    /**
     * Constructor.
     *
     * @param {Storage} storage An instance of either window.localStorage or window.sessionStorage
     */
    constructor(storage) {
        this.storage = storage;

        this.hashSource = `${Config.wwwroot}/${this.cacheRevision}`;
        this.hash = this.hashString(this.hashSource);
        this.prefix = `${this.hash}`;
        this.jsrevPrefix = `${this.hashString(Config.wwwroot)}/jsrev`;
        this.validateCache();
    }

    /**
     * Get the cache revision.
     *
     * @private
     * @return {string}
     */
    get cacheRevision() {
        if (!this.cacheRevisionValue) {
            if (Config.jsrev !== -1) {
                // If the jsrev is -1, then use the jsrev.
                this.cacheRevisionValue = Config.jsrev;
                return Config.jsrev;
            }

            // Use the current timestamp, rounded down to the nearest 10 seconds.
            // This gives a short cache time, but allows the cache to have some effect and be tested.
            this.cacheRevisionValue = 0 - Math.floor((Date.now() / 1000) / 10) * 10;
        }

        return this.cacheRevisionValue;
    }

    /**
     * Check if the browser supports the type of storage.
     *
     * @return {boolean} Whether the browser supports storage.
     * @private
     */
    get supported() {
        if (typeof (this.storage) === "undefined") {
            return false;
        }
        return this.storage !== null;
    }

    /**
     * Add a unique prefix to all keys so multiple moodle sites do not share caches.
     *
     * @param {string} key The cache key to prefix.
     * @return {string} The new key
     * @private
     */
    prefixKey(key) {
        return this.prefix + key;
    }

    /**
     * Check the current jsrev version and clear the cache if it has been bumped.
     * @private
     */
    validateCache() {
        if (!this.supported) {
            return;
        }
        const cacheVersion = this.storage.getItem(this.jsrevPrefix);
        if (cacheVersion === null) {
            this.storage.setItem(this.jsrevPrefix, this.cacheRevision);
            return;
        }

        const moodleVersion = this.cacheRevision;
        if (moodleVersion != cacheVersion) {
            this.storage.clear();
            this.storage.setItem(this.jsrevPrefix, this.cacheRevision);
        }
    }

    /**
     * Hash a string, used to make shorter key prefixes.
     *
     * @param {String} source The string to hash
     * @return {Number}
     * @private
     */
    hashString(source) {
        // From http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery.
        /* eslint no-bitwise: "off" */
        let hash = 0;
        if (source.length === 0) {
            return hash;
        }
        let i;
        for (i = 0; i < source.length; i++) {
            hash = ((hash << 5) - hash) + source.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer.
        }
        return hash;
    }

    /**
     * Get a value from local storage. Remember - all values must be strings.
     *
     * @param {string} key The cache key to check.
     * @return {boolean|string} False if the value is not in the cache, or some other error - a string otherwise.
     */
    get(key) {
        if (!this.supported) {
            return false;
        }

        return this.storage.getItem(this.prefixKey(key));
    }

    /**
     * Get a value from the storage mechanism.
     *
     * @param {string} key The cache key to check.
     * @returns {false|string} The value of the key or false if the value is not in the cache.
     */
    static get(key) {
        const storage = new this();
        return storage.get(key);
    }

    /**
     * Set a value to local storage. Remember - all values must be strings.
     *
     * @param {string} key The cache key to set.
     * @param {string} value The value to set.
     * @return {boolean} False if the value can't be saved in the cache, or some other error - true otherwise.
     */
    set(key, value) {
        if (!this.supported) {
            return false;
        }

        // This can throw exceptions when the storage limit is reached.
        try {
            this.storage.setItem(
                this.prefixKey(key),
                value,
            );
        } catch (e) {
            window.console.warn(`Error saving to storage: ${e.message}`);
            return false;
        }
        return true;
    }

    /**
     * Set a value to the storage mechanism.
     *
     * @param {string} key The cache key to set.
     * @param {string} value The value to set.
     * @returns {boolean} True if the value was saved, false otherwise.
     */
    static set(key, value) {
        const storage = new this();
        return storage.set(key, value);
    }
}
