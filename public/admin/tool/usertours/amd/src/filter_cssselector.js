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
 * CSS selector client side filter.
 *
 * @module     tool_usertours/filter_cssselector
 * @copyright 2020 The Open University
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import FilterBase from './filter_base';

/**
 * Client-side filter that checks whether a CSS selector matches an element on the page.
 */
export class CssSelectorFilter extends FilterBase {
    /**
     * Checks whether the configured CSS selector exists on this page.
     *
     * @param {object} tourConfig The tour configuration including filtervalues.
     * @returns {boolean} True if the selector matches or none is configured.
     */
    filterMatches(tourConfig) {
        const filterValues = tourConfig.filtervalues.cssselector;
        if (filterValues[0]) {
            return !!document.querySelector(filterValues[0]);
        }
        // If there is no CSS selector configured, this page matches.
        return true;
    }
}

// Export a singleton instance as the default so that requireManyAsync
// returns an object with a filterMatches method — matching the interface
// expected by the UserTours orchestrator.
export default new CssSelectorFilter();

// Also export filterMatches as a named export for backward compatibility.
const instance = new CssSelectorFilter();
export const filterMatches = (tourConfig) => instance.filterMatches(tourConfig);
