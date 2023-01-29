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

import sinon from 'sinon';
import MoodleHelpers from './moodle-helpers.mjs';

/**
 * The root hooks to apply before and after each test.
 *
 * https://mocha.org/#defining-a-root-hook-plugin
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
        global.helper = MoodleHelpers;
        // Reset the initial M.cfg values.
        global.M.cfg.iconsystemmodule = 'core/icon_system_fontawesome';
        global.M.cfg = {
            wwwroot: 'https://test.example.com/',
            langrev: -1,
            themerev: -1,
            iconsystemmodule: 'core/icon_system_fontawesome',
        };
        global.M.str = {};
        global.M.yui = {};
        global.M.util.pending_js = [];
        global.M.util.complete_js = [];

        const TemplateLoader = await import('./setup-moodle-template-loader.mjs');

        // await TemplateLoader.mockTemplateLoader();
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
                iconsystemmodule: 'core/icon_system_fontawesome',
            },
            str: {},
            util: {},
            yui: {},
        };

        global.YUI = sinon.stub();
        global.YUI.add = sinon.fake();
        global.YUI.use = sinon.fake();
        global.Y = YUI;
        await import('../../lib/javascript-static.js');
    },
};
