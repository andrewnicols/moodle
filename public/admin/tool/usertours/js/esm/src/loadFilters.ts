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
 * Dynamic loader for client-side tour filter modules.
 *
 * Uses the browser import map to resolve ESM specifiers provided by the
 * PHP layer at runtime.
 *
 * @module     tool_usertours/loadFilters
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import type {TourFilter} from './types';

/**
 * Dynamically load filter modules by their ESM specifiers.
 *
 * Each specifier is resolved via the browser import map at runtime.
 * Returns an array of filter instances (the default export of each module).
 *
 * @param filterNames ESM specifiers for the filter modules.
 * @returns An array of loaded filter instances.
 */
export async function loadFilterModules(filterNames: string[]): Promise<TourFilter[]> {
    const modules = await Promise.all(
        filterNames.map((name) => import(/* WebpackIgnore: true */ name)),
    );
    return modules.map((m) => m.default ?? m) as TourFilter[];
}
