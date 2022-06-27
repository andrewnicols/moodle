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
 * Tiny Media plugin for Moodle.
 *
 * @module      tiny/media
 * @copyright   2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {getTinyMCE} from 'editor_tiny/loader';
import {
    exception as displayException,
    saveCancel,
} from 'core/notification';

const askTheQuestion = (editor, question) => {
    saveCancel('Title', question, 'Yes', () => {
        editor.setContent('<span data-identifier="SOMEVALUE">' + editor.getContent() + '</span>');
        editor.insertContent('Inserted some content! :)');
    });
};

const plugin = (editor) => {
    // Add a button which asks the question.
    editor.ui.registry.addButton('tiny_media/insertmedia', {
        text: 'My button',
        onAction: function() {
            askTheQuestion(editor, 'Did you click the button?');
        }
    });

    // Add a menu item which asks the question.
    editor.ui.registry.addMenuItem('tiny_media/insertmedia', {
        text: 'Example plugin',
        onAction: function() {
            askTheQuestion(editor, 'Did you click the Menu item?');
        }
    });

    return {
        name: 'Custom plugin',
        url: 'https://example.com/docs/customplugin'
    };
};

export default new Promise((resolve) => {
    getTinyMCE()
    .then(tinyMCE => {
        tinyMCE.PluginManager.add('tiny_media/insertmedia', plugin);

        resolve('tiny_media/insertmedia');

        return tinyMCE;
    })
    .catch(displayException);
});
