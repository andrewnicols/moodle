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
 * Tiny Autosave plugin for Moodle.
 *
 * @module      tiny_autosave/plugin
 * @copyright   2022 Andrew Lyons <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {getTinyMCE} from 'editor_tiny/loader';
import {get_string as getString} from 'core/str';

import {component, pluginName} from './common';
import * as Options from './options';
import * as Autosaver from './autosaver';
import * as Utils from 'editor_tiny/utils';

// Setup the autosave Plugin.
export default new Promise(async(resolve) => {
    const [tinyMCE, helpLinkText] = await Promise.all([
        getTinyMCE(),
        getString('helplinktext', component),
    ]);

    // Note: The PluginManager.add function does not accept a Promise.
    // Any asynchronous code must be run before this point.
    tinyMCE.PluginManager.add(pluginName, (editor) => {
        // Register options.
        Options.register(editor);

        // Register the Autosaver.
        Autosaver.register(editor);

        return {
            getMetadata: () => ({
                name: helpLinkText,
                url: Utils.getDocumentationLink(pluginName),
            }),
        };
    });

    resolve(pluginName);
});
