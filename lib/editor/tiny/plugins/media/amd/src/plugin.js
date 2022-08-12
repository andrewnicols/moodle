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
 * @module      tiny_media/plugin
 * @copyright   2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {getTinyMCE} from 'editor_tiny/loader';
import {
    saveCancel,
} from 'core/notification';
import * as TinyUtils from 'editor_tiny/utils';

import uploadHandler from './upload-handler';

const askTheQuestion = (editor, question) => {
    saveCancel('Title', question, 'Yes', () => {
        editor.setContent('<span data-identifier="SOMEVALUE">' + editor.getContent() + '</span>');
        editor.insertContent('Inserted some content! :)');
    });
};

const isNullable = a => a === null || a === undefined;
const isNonNullable = a => !isNullable(a);
const isPlaceholderImage = (imgElm) => (
    imgElm.nodeName === 'IMG' && (imgElm.hasAttribute('data-mce-object') || imgElm.hasAttribute('data-mce-placeholder'))
);

const getSelectedImage = editor => {
    const imgElm = editor.selection.getNode();
    const figureElm = editor.dom.getParent(imgElm, 'figure.image');
    if (figureElm) {
        return editor.dom.select('img', figureElm)[0];
    }
    if (imgElm && (imgElm.nodeName !== 'IMG' || isPlaceholderImage(imgElm))) {
        return null;
    }
    return imgElm;
};

// Display a dialogue
export default new Promise(async(resolve) => {
    const tinyMCE = await getTinyMCE();

    tinyMCE.PluginManager.add('tiny_media/plugin', (editor) => {
        // Add a button which asks the question.
        editor.ui.registry.addButton('tiny_media/image', {
            icon: 'image',
            text: 'Image...',
            onAction: function() {
                askTheQuestion(editor, 'Did you click the button?');
            }
        });

        // Add a menu item which asks the question.
        editor.ui.registry.addMenuItem('tiny_media/image', {
            icon: 'image',
            text: 'Image...',
            onAction: function() {
                askTheQuestion(editor, 'Did you click the Menu item?');
            }
        });

        editor.ui.registry.addToggleButton('tiny_media/imageimage', {
            icon: 'image',
            tooltip: 'Insert/edit image',
            onAction: () => {
                askTheQuestion(editor, 'Did you click the Menu item?');
            },
            onSetup: (buttonApi) => {
                buttonApi.setActive(isNonNullable(getSelectedImage(editor)));
                return editor.selection.selectorChangedWithUnbind(
                    'img:not([data-mce-object]):not([data-mce-placeholder]),figure.image',
                    buttonApi.setActive
                ).unbind;
            }
        });

        // Add a button which asks the question.
        editor.ui.registry.addButton('tiny_media/video', {
            text: 'Video',
            onAction: function() {
                askTheQuestion(editor, 'Did you click the button?');
            }
        });

        // Add a menu item which asks the question.
        editor.ui.registry.addMenuItem('tiny_media/video', {
            text: 'Insert video',
            onAction: function() {
                askTheQuestion(editor, 'Did you click the Menu item?');
            }
        });

        return {
            name: 'Media plugin',
            url: 'https://moodle.org/'
        };
    });

    resolve(['tiny_media/plugin', {
        configure: () => ({
            // eslint-disable-next-line
            images_upload_handler: (blobInfo, progress) => uploadHandler(tinyMCE.activeEditor, blobInfo, progress),

            // eslint-disable-next-line
            file_picker_callback: async(cb, value, meta) => {
                const editor = tinyMCE.activeEditor;
                const newFile = await TinyUtils.displayFilepicker(editor, meta.filetype);
                cb(newFile.url, {
                    alt: newFile.file,
                });
            },

        })
    }]);

    return tinyMCE;
});
