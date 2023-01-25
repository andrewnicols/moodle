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

import path from 'path';
import {
    getPathFromAMDModuleName,
} from '../components.js';
import * as td from 'testdouble';
import chai from 'chai';
import tdChai from 'testdouble-chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(tdChai(td));
chai.use(sinonChai);

/**
 * A helper to mock modules.
 *
 * The library we use to mock modules (testdouble) uses absolute paths.
 *
 * @param {String} moduleName
 * @returns {testdouble.TestDouble}
 */
global.getModulePath = (moduleName) => {
    const modulePath = getPathFromAMDModuleName(moduleName);
    return path.join(process.cwd(), modulePath);
};

// Add Chai's expect and should to the global scope.
global.expect = chai.expect;
global.should = chai.should;
global.td = td;
global.sinon = sinon;

/**
 * The root hooks to apply before and after each test.
 *
 * https://mochajs.org/#defining-a-root-hook-plugin
 */
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
    async beforeEach () {
        global.M.cfg = {
            langrev: -1,
            themerev: -1,
        };
        global.M.str = {};
        global.M.yui = {};
    },

    /**
     * This hook is called once, before the test run starts.
     */
    async beforeAll () {
        // Initialise the Moodle standard variables.
        // These are only initialised once because we cannot import javascript-static multiple times.
        global.M = {
            cfg: {
                langrev: -1,
                themerev: -1,
            },
            str: {},
            util: {},
            yui: {},
        };
        global.YUI = td.constructor(['use', 'add']);
        global.YUI.add = td.func();
        await import('../../lib/javascript-static.js');
    },


    /**
     * This hook is called after each individual test.
     *
     * We use it to reset spies and mocks.
     */
    afterEach () {
        sinon.restore();
        td.reset();
    },
};
