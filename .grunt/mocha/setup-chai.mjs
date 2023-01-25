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
 * - chai
 * - sinon
 * - testdouble
 *
 * @copyright Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import * as td from 'testdouble';
import chai from 'chai';
import tdChai from 'testdouble-chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(tdChai(td));
chai.use(sinonChai);

export const mochaHooks = {
    async beforeEach () {
        global.expect = chai.expect;
        global.should = chai.should;
        global.td = td;

        global.sinon = sinon;
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

export default {
    chai,
    sinon,
    td,
};
