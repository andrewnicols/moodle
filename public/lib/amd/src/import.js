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
 * A thin wrapper around the native ESM dynamic import() expression.
 *
 * Babel's AMD transform replaces any `import(specifier)` it sees with a
 * synchronous AMD `require()` call, which breaks for bare ESM specifiers
 * (e.g. `@moodle/lms/...`) that are resolved by the browser import map.
 * Wrapping the expression inside `new Function()` hides it from static
 * analysis so the native `import()` is preserved in the compiled output.
 *
 * @example <caption>Load an ESM React component's default export</caption>
 * import nativeImport from 'core/import';
 *
 * const mod = await nativeImport('@moodle/lms/mod_book/viewer');
 * const ViewerComponent = mod.default; // React function component
 *
 * @example <caption>Import a named export from an ESM utility module</caption>
 * import nativeImport from 'core/import';
 *
 * const {formatDate} = await nativeImport('@moodle/lms/core/dates');
 * const label = formatDate(new Date());
 *
 * @example <caption>Lazy-load a heavy ESM module only when needed</caption>
 * import nativeImport from 'core/import';
 *
 * document.getElementById('open-chart').addEventListener('click', async() => {
 *     const {renderChart} = await nativeImport('@moodle/lms/core/chart');
 *     renderChart(document.getElementById('chart-target'), data);
 * });
 *
 * @module     core/import
 * @copyright  Meirza <meirza.arson@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// eslint-disable-next-line no-new-func
export default new Function('specifier', 'return import(specifier)');
