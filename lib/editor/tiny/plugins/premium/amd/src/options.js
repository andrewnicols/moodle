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
 * Options helper for the Moodle Tiny Premium plugin.
 *
 * @module     tiny_premium/options
 * @copyright  2024 David Woloszyn <david.woloszyn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {pluginName} from './common';
import {getPluginOptionName} from 'editor_tiny/options';

const premiumPlugins = getPluginOptionName(pluginName, 'premiumplugins');

export const register = (editor) => {
    const registerOption = editor.options.register;
    registerOption(premiumPlugins, {
        processor: 'string',
        "default": '',
    });
};

/**
 * Get the list of enabled TinyMCE Premium plugins.
 *
 * @param {TinyMCE} editor
 * @returns {string}
 */
export const getPremiumPlugins = (editor) => editor.options.get(premiumPlugins);
