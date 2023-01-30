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
    let Toast;

    beforeEach(async () => {
        Toast = await import('core/toast');
    });

    describe('addToastRegion', () => {
        it('Should not do anything if no parent is provided', async () => {
            await Toast.addToastRegion();
            expect(document.querySelector('.toast-wrapper')).to.be.null;
        });
        it('Should add a toast region to the specified parent', async () => {
            await Toast.addToastRegion(document.body);
            expect(document.querySelector('.toast-wrapper')).to.be.an.instanceof(HTMLElement);
        });
    });

    describe('add', () => {
        describe('configuration:type', () => {
            it('Should use a default type of info', async () => {
                await Toast.add('Hello, World!');
                const generatedToast = document.querySelector('.toast-wrapper .toast');
                expect(generatedToast).to.be.an.instanceof(HTMLElement);
                expect(generatedToast.classList.contains('toast-info')).to.be.true;
            });

            it('Should use accept an alternative type', async () => {
                await Toast.add('Hello, World!', {type: 'error'});
                const generatedToast = document.querySelector('.toast-wrapper .toast');
                expect(generatedToast).to.be.an.instanceof(HTMLElement);
                expect(generatedToast.classList.contains('toast-error')).to.be.true;
                expect(generatedToast.classList.contains('toast-info')).to.be.false;
            });
        });

        describe('configuration:closeButton', () => {
            it('Should not have a closeButton as standard', async () => {
                await Toast.add('Hello, World!');
                const generatedToast = document.querySelector('.toast-wrapper .toast');
                expect(generatedToast).to.be.an.instanceof(HTMLElement);
                expect(generatedToast.querySelector('button.close')).to.be.null;
            });
            it('Will add a close button if requested', async () => {
                await Toast.add('Hello, World!', {closeButton: true});
                const generatedToast = document.querySelector('.toast-wrapper .toast');
                expect(generatedToast).to.be.an.instanceof(HTMLElement);
                expect(generatedToast.querySelector('button.close')).to.be.an.instanceof(HTMLElement);
            });
            it('Accepts a forced false option', async () => {
                await Toast.add('Hello, World!', {closeButton: false});
                const generatedToast = document.querySelector('.toast-wrapper .toast');
                expect(generatedToast).to.be.an.instanceof(HTMLElement);
                expect(generatedToast.querySelector('button.close')).to.be.null;
            });
        });
    });

    it.skip('Should do stuff', async () => {
        Templates = await import('core/templates');
        const result = await Templates.default.render('core/welcome', {
            welcomemessage: "Hello, Andrew!",
        });
        expect(result).to.be.a('string');
    });

    it.skip('Should fetch strings', async () => {
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

describe('core/modal', async () => {
    it('should foo', async () => {
        const Notification = (await import('core/notification')).default;
        console.log(Notification);
        await Notification.alert('Hello, World!');
    });

});
