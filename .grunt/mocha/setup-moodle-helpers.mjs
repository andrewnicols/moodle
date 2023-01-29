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

import path from 'path';
import {
    fetchComponentData,
    getPathFromAMDModuleName,
} from '../components.js';
import fs from 'fs/promises';
import * as td from 'testdouble';

/**
 * This file contains Moodle-specific helpers for use in our tests.
 *
 * Note: This helper is not included via mocha.
 *
 * - The global M object.
 * - Including lib/javascript-static.js
 * - Mocking a global YUI instance.
 *
 * @copyright Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Mock the data response from a standard Moodle web service.
 * This helper is responsible for creating the data object in a valid format that you may use to send as a response.
 *
 * Please note that this function will not send the data.
 *
 * @see respondWith
 * @param {Object} data
 * @param {Number} errorcode
 * @param {object} [extra={}]} Any other values besides the data
 * @returns {object}
 */
export const getMockResponse = (
    data,
    errorcode = 0,
    extra = {},
) => {
    const error = errorcode === 0 ? false : true;

    return {
        data,
        ...extra,
        error,
        errorcode,
    };
};

/**
 * Respond to a request with the given data.
 *
 * @param {sinon.SinonFakeServer} server The Sinon Fake Server
 * @param {object[]} responses A set of responses to send.
 */
export const respondWith = (
    server,
    responses,
) => {
    server.respondWith(JSON.stringify(responses));
};

/**
 * Get the path to an AMD module from its module name.
 *
 * @param {string} moduleName The name of the Moodle AMD module
 * @returns {string} The path on disk to the module
 */
export const getModulePath = (moduleName) => {
    const modulePath = getPathFromAMDModuleName(moduleName);
    return path.join(process.cwd(), `${modulePath}.js`);
};

/**
 * Set up a fake server on the global and window scopes for use in tests.
 *
 * @returns {sinon.SinonFakeServer}
 */
export const setupFakeServer = () => {
    const server = global.sinon.fakeServer.create({
        respondImmediately: true,
    });

    // Set the fake XMLHttpRequest on both the 'global' and 'window' objects.
    global.XMLHttpRequest = window.XMLHttpRequest = server.xhr;

    return server;
};

const getComponentDirectory = (component) => {
    const componentList = fetchComponentData().components;
    for (const [componentPath, name] of Object.entries(componentList)) {
        if (name === component) {
            return componentPath;
        }
    }

    return null;
};

export const fetchComponentStrings = async (component) => {
    const componentDirectory = getComponentDirectory(component);
    if (!componentDirectory) {
        throw new Error(`Invalid component '${component}'`);
    }

    const getLangStringFileName = (component) => {
        if (component.startsWith('core_')) {
            return component.replace('core_', '');
        }

        if (component.startsWith('mod_')) {
            return component.replace('mod_', '');
        }

        return component;
    };

    const langStringPath = path.join(
        componentDirectory,
        'lang',
        'en',
        `${getLangStringFileName(component)}.php`,
    );

    if (!await fs.stat(langStringPath)) {
        throw new Error(`No strings found for component '${component}'`);
    }

    const langStrings = await (await fs.readFile(langStringPath, 'utf8'))
        .split("\n")
        .slice(1)
        .join("\n");

    const $string = {};
    eval(langStrings);

    return $string;
};

export const mockedGetString = (strings) => {
    return strings.map(({
        key,
        component = 'core',
        param,
        lang = 'en',
    }) => {
        const componentStrings = fetchComponentStrings(component);
        const string = componentStrings[key];

        if (!string) {
            return `[[${key}},${component}]]`;
        }

        global.M.str[component] = {
            ...M.str[component],
            [key]: str,
        };

        return M.util.get_string(key, component, param);
    });
};

export const mockStringFetcher = () => {
    console.log("MOCK");
    td.replace(getModulePath('core/str'), 'get_strings', mockedGetString);
};

const helpers = {
    getMockResponse,
    respondWith,
    getModulePath,
    setupFakeServer,
    mockStringFetcher,
};

export default helpers;

export const mochaHooks = {
    // Note: The ESM cache currently cannot be reset between tests.
    // This is a known issue with Mocha with ESM because NodeJS does not support clearing the cache.
    // This is noted in https://github.com/mochajs/mocha/issues/4374#issuecomment-658060627.

    /**
     * This hook is called before each individual test.
     *
     * Ideally we should re-include javascript-static.js here but this is currently not possible due to the
     * cache issue mentioned above.
     */
    async beforeEach() {
        global.helper = helpers;
    },
};
