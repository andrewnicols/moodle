// This file is part of Moodle - https://moodle.org/
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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Tiny tiny_native for Moodle.
 *
 * @module      plugintype_pluginname/plugin
 * @copyright   2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// eslint-disable-next-line no-unused-vars
import {getTinyMCE, baseUrl} from 'editor_tiny/loader';
import {getPluginMetadata} from 'editor_tiny/utils';

import {component, pluginName} from './common';

// Setup the tiny_native Plugin.
export default new Promise(async(resolve) => {
    // Note: The PluginManager.add function does not support asynchronous configuration.
    // Perform any asynchronous configuration here, and then call the PluginManager.add function.
    const [
        tinyMCE,
        pluginMetadata,
    ] = await Promise.all([
        getTinyMCE(),
        getPluginMetadata(component, pluginName),
    ]);

    // tinyMCE.PluginManager.load('BootstrapTools', `${baseUrl}/plugins/tiny_native/bootstraptools/plugin.js`);

    // Reminder: Any asynchronous code must be run before this point.
    tinyMCE.PluginManager.add(pluginName, () => {
        // Return the pluginMetadata object. This is used by TinyMCE to display a help link for your plugin.
        return pluginMetadata;
    });

    resolve([pluginName, {
        configure: (instanceConfig, options) => {
            const nativePlugins = [];
            const pluginFiles = options.plugins['tiny_native/plugin']?.config?.pluginfiles;
            if (!pluginFiles) {
                return {};
            }
            Object.entries(pluginFiles).forEach(([pluginName, pluginUrl]) => {
                tinyMCE.PluginManager.load(pluginName, pluginUrl);
                nativePlugins.push(pluginName);
            });

            return {
                plugins: [].concat(instanceConfig.plugins, ...nativePlugins),
            };
        },
    }]);
});
