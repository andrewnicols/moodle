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
 * CSS selector client-side filter.
 *
 * Checks whether a CSS selector configured on the tour matches an element
 * on the current page. If no selector is configured, the filter passes.
 *
 * @module     tool_usertours/local/filters/cssselector
 * @copyright  2020 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import FilterBase from './base';
import type {TourDetail} from '../../types';

/**
 * Client-side filter that checks whether a CSS selector matches an element on the page.
 */
class CssSelectorFilter extends FilterBase {
    /**
     * Check whether the configured CSS selector exists on this page.
     *
     * @param tourDetail The tour detail entry including filtervalues from the server.
     * @returns True if the selector matches an element or none is configured.
     */
    filterMatches(tourDetail: TourDetail): boolean {
        const filterValues = tourDetail.filtervalues.cssselector;
        if (filterValues?.[0]) {
            window.console.log("Checking CSS selector filter:", filterValues[0]);
            return !!document.querySelector(filterValues[0]);
        }
        // If there is no CSS selector configured, this page matches.
        return true;
    }
}

export default new CssSelectorFilter();
