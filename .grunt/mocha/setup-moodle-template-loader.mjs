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

import {mockTemplateLoader} from './moodle-template-loader.mjs';

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
        global.restoreDefaultTemplateLoader = await mockTemplateLoader();
    },

    afterEach () {
        global.restoreDefaultTemplateLoader();
    }
};
