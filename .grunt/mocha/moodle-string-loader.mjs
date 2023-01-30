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
 * This file is responsible for the setup and configuration of the following for use in our Mocha tests:
 *
 * - The global M object.
 * - Including lib/javascript-static.js
 * - Mocking a global YUI instance.
 *
 * @copyright Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {
    getModulePath,
} from './setup-moodle-helpers.mjs';

import path from 'path';
import {
    fetchComponentData,
} from '../components.js';
import fs from 'fs/promises';

const getComponentDirectory = (component) => {
    const componentList = fetchComponentData().components;
    for (const [componentPath, name] of Object.entries(componentList)) {
        if (name === component) {
            return componentPath;
        }
    }

    return null;
};

const fetchComponentStrings = async (component) => {
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
        .join("\n")
        .replaceAll(/'\] = '/g, '\'] = `')
        .replaceAll(/';\n/g, "`;\n")
        ;

    const $string = {};
    // eslint-disable-next-line no-eval
    eval(langStrings);

    return $string;
};

const mockedGetStrings = async (strings) => {
    const promises = strings.map(({
        key,
        component = 'core',
        // eslint-disable-next-line promise/avoid-new
    }) => new Promise(async (resolve) => {
        try {
            const componentStrings = await fetchComponentStrings(component);
            const stringValue = componentStrings[key];
            if (!stringValue) {
                resolve(`[[${key}},${component}]]`);
            }
            resolve(stringValue);
        } catch {
            resolve(`[[${key},${component}]]`);
        }
    }));

    return promises;
};

/**
 * Mock the template loader.
 */
export const mockStringLoader = async () => {
    // TODO Work out why the transpilation here is wrong.
    const StringHelper = (await import(getModulePath('core/str'))).default;
    StringHelper.resetPromiseCache();

    const originalResolver = StringHelper.getStringResolver();
    StringHelper.setStringResolver(mockedGetStrings);

    return () => {
        StringHelper.setStringResolver(originalResolver);
    };
};

export default {
    mockStringLoader,
};
