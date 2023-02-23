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
 * Allow the user to search for learners within the grader report.
 * Have to basically search twice on the dataset to avoid passing around massive csv params whilst allowing debouncing.
 *
 * @module    gradereport_grader/search
 * @copyright 2023 Mathew May <mathew.solutions>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Pending from 'core/pending';
import GradebookSearchClass from 'gradereport_grader/search/search_class';
import * as Repository from 'gradereport_grader/search/repository';
import {get_strings as getStrings} from 'core/str';

const bannedFilterFields = ['profileimageurlsmall', 'profileimageurl', 'id', 'link', 'matchingField', 'matchingFieldName'];
let profilestringmap = null;

/**
 * Given the set of profile fields we can possibly search, fetch their strings,
 * so we can report to screen readers the field that matched.
 *
 * @returns {Promise<void>}
 */
const fetchRequiredStrings = () => {
    const requiredStrings = [
        'username',
        'firstname',
        'lastname',
        'email',
        'city',
        'country',
        'department',
        'institution',
        'idnumber',
        'phone1',
        'phone2',
    ];
    return getStrings(requiredStrings.map((key) => ({key})))
        .then((stringArray) => new Map(
            requiredStrings.map((key, index) => ([key, stringArray[index]]))
        ));
};

/**
 * The hook into this module that calls off to the search component.
 *
 * @returns {Promise<void>}
 */
export const init = async() => {
    const pendingPromise = new Pending();
    profilestringmap = await fetchRequiredStrings();
    new GradebookSearchClass(fetchFilterableData, filter, filterMatchIndicator);
    pendingPromise.resolve();
};

/**
 * Get the data we will be searching against in this component.
 *
 * @param {Number} courseID The ID of the course to fetch users within.
 * @returns {Promise<*>}
 */
const fetchFilterableData = (courseID) => Repository.userFetch(courseID).then((r) => r.users);

/**
 * Dictate to the search component how and what we want to match upon.
 *
 * @param {Array} dataset All of the learners to search within.
 * @param {String} searchTerm The term that the user is searching for.
 * @returns {Array} The users that match the given criteria.
 */
const filter = (dataset, searchTerm) => {
    const preppedSearchTerm = searchTerm.toLowerCase();
    return dataset.filter((user) => Object.keys(user).some((key) => {
        if (user[key] === "" || bannedFilterFields.includes(key)) {
            return false;
        }
        return user[key].toString().toLowerCase().includes(preppedSearchTerm);
    }));
};

/**
 * Given we have a subset of the dataset, set the field that we matched upon to inform the end user.
 *
 * @param {Array} matchedResultsSubset The results we will render out.
 * @param {Function} selectOneLink The individual link to view only this participant.
 * @param {String} searchTerm The term that the user is searching for.
 * @returns {Array} The results with the matched fields inserted.
 */
const filterMatchIndicator = (matchedResultsSubset, selectOneLink, searchTerm) => {
    const preppedSearchTerm = searchTerm.toLowerCase();
    return matchedResultsSubset.map((user) => {
        for (const [key, value] of Object.entries(user)) {
            const valueString = value.toString().toLowerCase();
            if (!valueString.includes(preppedSearchTerm)) {
                continue;
            }
            // Ensure we have a good string, otherwise fallback to the key.
            user.matchingFieldName = profilestringmap.get(key) ?? key;
            user.matchingField = valueString.replace(
                preppedSearchTerm,
                `<span class="font-weight-bold">${searchTerm}</span>`
            );
            user.link = selectOneLink(user.id);
            break;
        }
        return user;
    });
};
