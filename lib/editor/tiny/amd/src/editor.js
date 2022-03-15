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
 * Utility functions.
 *
 * @module editor_tiny/editor
 * @copyright  2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {
    getTinyMCE,
} from './loader';

const instanceMap = new Map();

/**
 * Require the modules for the named set of TinyMCE plugins.
 *
 * @param {string[]} pluginList The list of plugins
 * @return {Promise[]} A matching set of Promises relating to the requested plugins
 * @private
 */
const importPluginList = pluginList => {
    return pluginList.map(pluginPath => {
        if (pluginPath.indexOf('/') === -1) {
            // A standard TinyMCE Plugin.
            return pluginPath;
        }

        return import(pluginPath);
    });
};

/**
 * Get the TinyMCE instance for the specified Node ID.
 *
 * @param {string} elementId
 * @returns {TinyMCE|undefined}
 */
export const getInstanceForElementId = elementId => getInstanceForElement(document.getElementById(elementId));

/**
 * Get the TinyMCE instance for the specified HTMLElement.
 *
 * @param {HTMLElement} element
 * @returns {TinyMCE|undefined}
 */
export const getInstanceForElement = element => instanceMap.get(element);

/**
 * Set up TinyMCE for the selector at the specified HTML Node id.
 *
 * @param {string} elementId The HTML Node ID
 * @return {Promise<TinyMCE>} The TinyMCE instance
 */
export const setupForElementId = ({elementId}) => {
    return setupForTarget(document.querySelector(`#${elementId}`));
};

getTinyMCE()
.then(tinyMCE => {
    tinyMCE.OEMWindowManager = tinyMCE.WindowManager;
    tinyMCE.WindowManager = function(editor) {
        window.console.log(editor);

        return {
            open: function(args, params) {
                window.console.log(args, params);
                return tinyMCE.OEMWindowManager.open(args, params);
            },

            openUrl: tinyMCE.OEMWindowManager.openUrl,
            alert: tinyMCE.OEMWindowManager.alert,
            confirm: tinyMCE.OEMWindowManager.confirm,
            close: tinyMCE.OEMWindowManager.close,
        };
    };

    tinyMCE.OEMNotificationManager = tinyMCE.NotificationManager;
    tinyMCE.NotificationManager = function(editor) {
        window.console.log(editor);

        return tinyMCE.OEMNotificationManager(editor);
    };

    return tinyMCE;
})
.catch(() => {
    // eslint-disable-line
});

/**
 * Set up TinyMCE for the HTML Element.
 *
 * @param {HTMLElement} target
 * @return {Promise<TinyMCE>} The TinyMCE instance
 */
export const setupForTarget = (target) => {
    if (instanceMap.has(target)) {
        return Promise.resolve(target);
    }

    const pluginList = [
        'anchor',
        'advlist',
        'code',
        'link',
        'image',
        'lists',
        'editor_tiny/testplugin',
        'editor_tiny/insertmedia',
    ];

    return getTinyMCE()
    .then(tinyMCE => Promise.all([tinyMCE, ...importPluginList(pluginList)]))
    .then(([tinyMCE, ...pluginList]) => {
        return tinyMCE.init({
            target,

            // TODO Configure the Language:
            // lang,

            // TODO Configure the toolbar somehow.
            toolbar: [
                //'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
                'formatselect bold italic | bullist numlist outdent indent | link unlink | ' +
                    'tiny_emojipicker/plugin',
                'underline strikethrough subscript superscript | alignleft aligncenter alignright alignjustify | ' +
                    'charmap table | formatpainter table | undo redo | source',
                'editor_tiny/testplugin',
                'editor_tiny/image',
            ],

            menu: {
                file: {
                    title: 'File',
                    items: 'editor_tiny/testplugin',
                },
            },

            // TODO Configure this plugin list somehow.
            plugins: [
                'wordcount',
                ...pluginList,
            ].join(' '),
        });
    })
    .then(tinyMCE => {
        instanceMap.set(target, tinyMCE);
        return tinyMCE;
    });
};
