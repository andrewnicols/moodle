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
 * Base class for client-side user tour filters.
 *
 * Each client-side filter must extend this class and implement
 * the filterMatches method. Filter modules are loaded dynamically
 * by the UserTours orchestrator via their AMD module names.
 *
 * @module     tool_usertours/filter_base
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export default class FilterBase {
    /**
     * Check whether the current page matches this filter for the given tour.
     *
     * @param {object} tourConfig The tour configuration including filtervalues.
     * @returns {boolean} True if the tour should be shown on this page.
     */
    filterMatches(tourConfig) { // eslint-disable-line no-unused-vars
        throw new Error('filterMatches() must be implemented by subclasses');
    }
}
