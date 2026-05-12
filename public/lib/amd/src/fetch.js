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
 * Backwards-compatibility shim for core/fetch.
 *
 * The real implementation now lives in the ESM module
 * `@moodle/lms/core/fetch`. This AMD wrapper delegates every call to the
 * ESM module so that existing `import Fetch from 'core/fetch'` call-sites
 * continue to work without changes.
 *
 * @module     core/fetch
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import nativeImport from 'core/import';

const {default: Fetch} = await nativeImport('@moodle/lms/core/fetch');

export default Fetch;
