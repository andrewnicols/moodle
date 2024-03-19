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
 * Tiny Premium configuration.
 *
 * @module      tiny_premium/configuration
 * @copyright   2023 David Woloszyn <david.woloszyn@moodle.com>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {
    addToolbarButton,
    addToolbarSection
} from 'editor_tiny/utils';
import {getInitialPluginConfiguration, getPluginOptionName} from 'editor_tiny/options';

const configureToolbar = (toolbar) => {
    // Add premium toolbar sections to house all the plugins with no natural home.
    toolbar = addToolbarSection(toolbar, 'premium_a', 'advanced', true);
    toolbar = addToolbarSection(toolbar, 'premium_b', 'formatting', true);
    return toolbar;
};

export const configure = (instanceConfig, options) => {
    const pluginOptions = getInitialPluginConfiguration(options);
    window.console.log(pluginOptions);
    const enabledPlugins = pluginOptions[getPluginOptionName('tiny_premium/plugin', 'premiumplugins')].split(',');
    window.console.log(enabledPlugins);

    let plugins = instanceConfig.plugins;
    let menu = instanceConfig.menu;
    let toolbar = configureToolbar(instanceConfig.toolbar);
    let contextmenu = instanceConfig.contextmenu;
    let pluginsettings = {};

    if (enabledPlugins.indexOf('typography') !== -1) {
        // Advanced Typography.
        plugins += ` typography`;
        toolbar = addToolbarButton(toolbar, 'premium_b', 'typography');
    }

    if (enabledPlugins.indexOf('casechange') !== -1) {
        // Case Change.
        plugins += ` casechange`;
        toolbar = addToolbarButton(toolbar, 'premium_a', 'casechange');
    }

    if (enabledPlugins.indexOf('checklist') !== -1) {
        // Checklist.
        plugins += ` checklist`;
        toolbar = addToolbarButton(toolbar, 'lists', 'checklist');
    }

    return {
        plugins,
        toolbar,
        menu,
        contextmenu,
        ...pluginsettings
    };
};
