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
 * This file is responsible for the setup and configuration of jsdom for use in our Mocha tests.
 *
 * @copyright Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import jsdom from 'jsdom-global';

jsdom(
    // The HTML to use for the DOM.
    // An undefined value will cause jsdom to use its default content.
    undefined,

    // Configuration.
    // See https://github.com/jsdom/jsdom#customizing-jsdom for further information.
    {
        url: 'https://test.example.com/',
    }
);

// Setup some standard Moodleisms found on the DOM.

export const mochaHooks = {
    async beforeEach() {
        // We set the current language.
        document.documentElement.lang = 'en';
    },
};
