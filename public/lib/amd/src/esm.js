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
 * An AMD loader plugin that bridges AMD modules to native ESM modules.
 *
 * This plugin allows AMD modules to synchronously import ESM modules using
 * the RequireJS loader plugin syntax `core/esm!{component}/{name}`. The
 * plugin resolves the corresponding `@moodle/lms/{component}/{name}` ESM
 * module and returns its full namespace object (including `default` and any
 * named exports).
 *
 * This is primarily used in backward-compatibility shims — the original AMD
 * module is replaced with a thin wrapper that delegates to the ESM module
 * via this plugin.
 *
 * @module     core/esm
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @example <caption>Re-export a default export from an ESM module</caption>
 * import Module from 'core/esm!core/config';
 *
 * export default Module.default;
 *
 * @example <caption>Re-export default and named exports</caption>
 * import Module from 'core/esm!core/fetch';
 *
 * export default Module.default;
 * export const request = Module.request;
 * export const performGet = Module.performGet;
 */

import nativeImport from 'core/import';

export default {
    // eslint-disable-next-line no-unused-vars
    load: function (name, req, onload, config) {
        // Dynamically require the target module containing the promise
        nativeImport(`@moodle/lms/${name}`)
            .then(function (resolvedValue) {
                onload(resolvedValue);
            })
            .catch(function (error) {
                onload.error(error);
            });
    },
};
