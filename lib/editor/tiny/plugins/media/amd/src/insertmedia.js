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

const plugin = class {
    constructor(editor) {
        // Add a button which asks the question.
        editor.ui.registry.addButton('editor_tiny/image', {
            text: 'Insert image',
            onAction: function() {
                askTheQuestion(editor, 'Did you click the button?');
            }
        });

        // Add a menu item which asks the question.
        editor.ui.registry.addMenuItem('editor_tiny/image', {
            text: 'Insert image',
            onAction: function() {
                askTheQuestion(editor, 'Did you click the Menu item?');
            }
        });

        return {
            getMetadata: function() {
                return {
                    name: 'Moodle Media plugin',
                    url: 'https://docs.moodle.org/410/en/tiny_media'
                };
            }
        };
    }

    getDialogue() {
        return;
    }
};

export default new Promise((resolve) => {
    getTinyMCE()
    .then(tinyMCE => {
        tinyMCE.PluginManager.add('editor_tiny/insertmedia', plugin);

        resolve('editor_tiny/insertmedia');

        return tinyMCE;
    })
    .catch(displayException);
});
