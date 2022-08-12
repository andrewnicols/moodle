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
 * Option helper for TinyMCE Editor Manager.
 *
 * @module editor_tiny/options
 * @copyright  2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

const optionsMoodleAll = 'moodle:options';
const optionContextId = 'moodle:contextid';
const optionDraftItemId = 'moodle:draftitemid';
const filePickers = 'moodle:filepickers';
const optionsMoodleLang = 'moodle:language';

export const register = (editor, options) => {
    const registerOption = editor.options.register;
    const setOption = editor.options.set;

    // TODO Decide if we want to keep this or not.
    registerOption(optionsMoodleAll, {
        processor: 'object',
        "default": {},
    });
    setOption(optionsMoodleAll, options);

    registerOption(optionContextId, {
        processor: 'number',
        "default": 0,
    });
    setOption(optionContextId, options.context);

    registerOption(filePickers, {
        processor: 'object',
        "default": {},
    });
    setOption(filePickers, options.filepicker);

    registerOption(optionDraftItemId, {
        processor: 'number',
        "default": 0,
    });
    setOption(optionDraftItemId, options.draftitemid);

    // TODO Figure out a way that plugin can register options via PHP lib (Like Atto plugin lib.php).
    registerOption(optionsMoodleLang, {
        processor: 'object',
        "default": {},
    });
    setOption(optionsMoodleLang, options.moodlelang);
};

export const getContextId = (editor) => editor.options.get(optionContextId);
export const getDraftItemId = (editor) => editor.options.get(optionDraftItemId);
export const getFilepickers = (editor) => editor.options.get(filePickers);
export const getFilePicker = (editor, type) => getFilepickers(editor)[type];
export const getMoodleLang = (editor) => editor.options.get(optionsMoodleLang);

/**
 * Get a set of namespaced options for all defined plugins.
 *
 * @param {object} options
 * @returns {object}
 */
export const getInitialPluginConfiguration = (options) => {
    const config = {};

    Object.entries(options.plugins).forEach(([pluginName, pluginConfig]) => {
        const values = Object.entries(pluginConfig.config ?? {});
        values.forEach(([optionName, value]) => {
            config[getPluginOptionName(pluginName, optionName)] = value;
        });
    });

    return config;
};

/**
 * Get the namespaced option name for a plugin.
 *
 * @param {string} pluginName
 * @param {string} optionName
 * @returns {string}
 */
export const getPluginOptionName = (pluginName, optionName) => `${pluginName}:${optionName}`;
