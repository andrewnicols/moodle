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
 * A javascript module to handle user ajax actions.
 *
 * @module     block_recentlyaccesseditems/repository
 * @copyright  2018 Victor Deniz <victor@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {fetchOne} from 'core/fetch';

/**
 * Get the list of items that the user has most recently accessed.
 *
 * @method getRecentItems
 * @param {Number} limit Only return this many results
 * @return {Promise} Resolved with an array of items
 */
export const getRecentItems = (limit) => {
    const args = {};
    if (limit) {
        args.limit = limit;
    }

    return fetchOne(
        'block_recentlyaccesseditems_get_recent_items',
        args
    );
};
