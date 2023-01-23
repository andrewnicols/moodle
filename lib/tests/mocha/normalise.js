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

import {getList} from 'core/normalise';
import jquery from 'jquery';

describe('getList', () => {
    document.body.innerHTML = `
        <div class="test1"></div>
        <div class="test2"></div>
        <span>
            <button />
        </span>
    `;

    it('returns an empty array when an empty array is passed', () => {
        expect([]).to.deep.equal([]);
        expect(getList([])).to.deep.equal([]);
    });

    describe('when working with an HTMLElement', () => {
        it('returns a single HTMLElement if one was passed', () => {
            expect(
                getList(document.querySelector('span'))
            ).to.deep.equal(
                [document.querySelector('span')]
            );
        });
    });

    describe('when working with a jQuery input', () => {
        it('returns an empty array when no jquery match is found', () => {
            expect(getList(jquery('#notfound'))).to.deep.equal([]);
        });

        it('handles jQuery to DOM Transformations', () => {
            expect(
                getList(jquery('button'))
            ).to.deep.equal(
                [
                    document.querySelector('button'),
                ]
            );
        });
    });
});
