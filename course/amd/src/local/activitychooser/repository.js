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
 *
 * @module     core_course/repository
 * @copyright  2019 Mathew May <mathew.solutions>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {fetchOne} from 'core/fetch';

/**
 * Fetch all the information on modules we'll need in the activity chooser.
 *
 * @method activityModules
 * @param {Number} courseid What course to fetch the modules for
 * @return {Promise}
 */
export const activityModules = (courseid) => fetchOne('core_course_get_course_content_items', {
    courseid,
});

/**
 * Given a module name, module ID & the current course we want to specify that the module
 * is a users' favourite.
 *
 * @method favouriteModule
 * @param {String} componentname Frankenstyle name of the component to add favourite
 * @param {Number} contentitemid ID of the module. Mainly for LTI cases where they have same / similar names
 * @return {Promise}
 */
export const favouriteModule = (componentname, contentitemid) => fetchOne('core_course_add_content_item_to_user_favourites', {
    componentname,
    contentitemid,
});

/**
 * Given a module name, module ID & the current course we want to specify that the module
 * is no longer a users' favourite.
 *
 * @method unfavouriteModule
 * @param {String} componentname Frankenstyle name of the component to add favourite
 * @param {Number} contentitemid ID of the module. Mainly for LTI cases where they have same / similar names
 * @return {Promise}
 */
export const unfavouriteModule = (componentname, contentitemid) => fetchOne(
    'core_course_remove_content_item_from_user_favourites',
    {
        componentname,
        contentitemid,
    }
);

/**
 * Fetch all the information on modules we'll need in the activity chooser.
 *
 * @method fetchFooterData
 * @param {Number} courseid What course to fetch the data for
 * @param {Number} sectionid What section to fetch the data for
 * @return {Promise}
 */
export const fetchFooterData = (courseid, sectionid) => fetchOne('core_course_get_activity_chooser_footer', {
    courseid,
    sectionid,
});
