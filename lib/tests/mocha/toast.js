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

describe('core/toast', async () => {
    let Templates;

    it('Should do stuff', async () => {
        Templates = await import('core/templates');
        const result = await Templates.default.render('core/welcome', {
            welcomemessage: "Hello, Andrew!",
        });
        expect(result).to.be.a('string');
    });

    it('Should fetch strings', async () => {
        console.log("Fetching core/str");
        const str = (await import('core/str'));
        console.log(await str.get_strings([
            {
                key: 'pluginname',
                component: 'mod_forum',
            },
            {
                key: 'pluginname',
                component: 'mod_assign',
            },
            {
                key: 'pluginname',
                component: 'mod_asasdsign',
            },
        ]));
    });
});
