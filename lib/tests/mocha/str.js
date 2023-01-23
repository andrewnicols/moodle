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

/* eslint-disable no-restricted-properties */

describe('M.util.get_string', () => {
    let consoleSpy;

    beforeEach(() => {
        consoleSpy = sinon.replace(console, 'warn', sinon.fake.returns());
    });

    it('will warn if the string is not in the string cache', () => {
        expect(M.util.get_string('somestring', 'core')).to.equal('[[somestring,core]]');
        expect(consoleSpy.calledOnce).to.be.true;
    });

    it('will return the string if it was found', () => {
        M.str.core = {somestring: 'Found string'};
        expect(M.util.get_string('somestring', 'core')).to.equal('Found string');
        expect(consoleSpy.calledOnce).to.be.false;
    });

    describe('using placeholders', () => {
        const placeholders = [
            {
                name: 'none',
                string: 'The string has {$a} placeholders',
                value: undefined,
                expected: 'The string has {$a} placeholders',
            },
            {
                name: 'numeric',
                string: 'The string has {$a} placeholders',
                value: 42,
                expected: 'The string has 42 placeholders',
            },
            {
                name: 'string',
                string: 'The string has {$a} placeholders',
                value: "forty-two",
                expected: 'The string has forty-two placeholders',
            },
            {
                name: 'multiple mixed type',
                string: 'The {$a->type} has {$a->count} placeholders',
                value: {
                    type: 'string',
                    count: 13,
                },
                expected: 'The string has 13 placeholders',
            },
            {
                name: 'multiple with missing values',
                string: 'The {$a->type} has {$a->count} placeholders',
                value: {
                    count: 13,
                },
                expected: 'The {$a->type} has 13 placeholders',
            },
        ];

        placeholders.forEach((placeholder) => {
            it(`should support ${placeholder.name} placeholders`, () => {
                M.str.core = {somestring: placeholder.string};
                expect(M.util.get_string('somestring', 'core', placeholder.value)).to.equal(placeholder.expected);
                expect(consoleSpy.calledOnce).to.be.false;
            });
        });

        it('should warn if an invalid placeholder type was used', () => {
            M.str.core = {somestring: 'The string has {$a} placeholders'};
            expect(M.util.get_string('somestring', 'core', function () {
                return;
            })).to.equal('The string has {$a} placeholders');
            expect(consoleSpy.calledOnce).to.be.true;

        });

        it('should warn if an invalid object placeholder type was used', () => {
            M.str.core = { somestring: 'The string has {$a->count} placeholders' };
            expect(M.util.get_string('somestring', 'core', {
                count: function () {
                    return;
                },
            })).to.equal('The string has {$a->count} placeholders');
            expect(consoleSpy.calledOnce).to.be.true;

        });
    });
});

describe('M.util.get_string', () => {
    let consoleSpy;

    beforeEach(() => {
        consoleSpy = sinon.replace(console, 'warn', sinon.fake.returns());
    });
    afterEach(() => {
        sinon.restore();
    });

    it('will warn if the string is not in the string cache', () => {
        expect(M.util.get_string('somestring', 'core')).to.equal('[[somestring,core]]');
        expect(consoleSpy.calledOnce).to.be.true;
    });

    it('will return the string if it was found', () => {
        M.str.core = {somestring: 'Found string'};
        expect(M.util.get_string('somestring', 'core')).to.equal('Found string');
        expect(consoleSpy.calledOnce).to.be.false;
    });

    describe('using placeholders', () => {
        const placeholders = [
            {
                name: 'none',
                string: 'The string has {$a} placeholders',
                value: undefined,
                expected: 'The string has {$a} placeholders',
            },
            {
                name: 'numeric',
                string: 'The string has {$a} placeholders',
                value: 42,
                expected: 'The string has 42 placeholders',
            },
            {
                name: 'string',
                string: 'The string has {$a} placeholders',
                value: "forty-two",
                expected: 'The string has forty-two placeholders',
            },
            {
                name: 'multiple mixed type',
                string: 'The {$a->type} has {$a->count} placeholders',
                value: {
                    type: 'string',
                    count: 13,
                },
                expected: 'The string has 13 placeholders',
            },
            {
                name: 'multiple with missing values',
                string: 'The {$a->type} has {$a->count} placeholders',
                value: {
                    count: 13,
                },
                expected: 'The {$a->type} has 13 placeholders',
            },
        ];

        placeholders.forEach((placeholder) => {
            it(`should support ${placeholder.name} placeholders`, () => {
                M.str.core = {somestring: placeholder.string};
                expect(M.util.get_string('somestring', 'core', placeholder.value)).to.equal(placeholder.expected);
                expect(consoleSpy.calledOnce).to.be.false;
            });
        });

        it('should warn if an invalid placeholder type was used', () => {
            M.str.core = {somestring: 'The string has {$a} placeholders'};
            expect(M.util.get_string('somestring', 'core', function () {
                return;
            })).to.equal('The string has {$a} placeholders');
            expect(consoleSpy.calledOnce).to.be.true;

        });

        it('should warn if an invalid object placeholder type was used', () => {
            M.str.core = { somestring: 'The string has {$a->count} placeholders' };
            expect(M.util.get_string('somestring', 'core', {
                count: function () {
                    return;
                },
            })).to.equal('The string has {$a->count} placeholders');
            expect(consoleSpy.calledOnce).to.be.true;

        });
    });
});

describe('Str.get_string', () => {
    beforeEach(() => {
        document.documentElement.lang = 'en';

        // A default empty mock for core/localstorage and core/ajax.
        td.replace(getModulePath('core/localstorage'), ({
            get: sinon.fake.returns(),
            set: sinon.fake.returns(),
        }));
        td.replace(getModulePath('core/ajax'), ({}));
    });

    describe('without a LocalStorage cache', () => {
        it('will fetch a string if not defined', async () => {
            td.replace(getModulePath('core/ajax'), ({
                call: sinon.fake((requests) => {
                    return requests[0].done('Hello world');
                }),
            }));

            const str = await import('core/str');

            const result = await str.get_string('hello', 'core');

            expect(result).to.equal('Hello world');
            expect(global.M.str.core).to.be.an('object');
            expect(global.M.str.core.hello).to.be.a('string');
            expect(global.M.str.core.hello).to.equal('Hello world');
        });

        it('will use a defined string if it already exists', async () => {
            const str = await import('core/str');
            global.M.str.core = {
                hello: 'Hello different world',
            };

            const result = await str.get_string('hello', 'core');

            expect(result).to.equal('Hello different world');
        });
    });

    describe('with a LocalStorage cache', () => {
        it('will return a string from the local storage cache', async () => {
            td.replace(getModulePath('core/localstorage'), ({
                get: sinon.fake(() => {
                    return 'cached value';
                }),
                set: sinon.fake.returns(),
            }));

            const str = await import('core/str');
            expect(await str.get_string('hello', 'core')).to.equal('cached value');
        });
    });

    it('will use the "core" component if no component was specified', async () => {
        td.replace(getModulePath('core/ajax'), ({}));
        const str = await import('core/str');
        global.M.str.core = {
            hello: 'Hello different world',
        };

        const result = await str.get_string('hello');

        expect(result).to.equal('Hello different world');
    });
});
