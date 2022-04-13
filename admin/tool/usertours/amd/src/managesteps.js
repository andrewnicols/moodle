// This file is part of Moodle - https://moodle.org/
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
 * Step management code.
 *
 * @module     tool_usertours/managesteps
 * @copyright  2016 Andrew Nicols <andrew@nicols.co.uk>
 */
import {prefetchStrings} from 'core/prefetch';
import {get_string as getString} from 'core/str';
import {confirm as confirmModal} from 'core/notification';

/**
 * Handle step management actions.
 *
 * @param   {Event} e
 * @private
 */
const removeStepHandler = e => {
    const deleteButton = e.target.closest('[data-action="delete"]');
    if (deleteButton) {
        e.preventDefault();
        removeStepFromLink(deleteButton.href);
    }
};

/**
 * Handle removal of a step with confirmation.
 *
 * @param {string} targetUrl
 * @private
 */
const removeStepFromLink = targetUrl => {
    confirmModal(
        getString('confirmstepremovaltitle', 'tool_usertours'),
        getString('confirmstepremovalquestion', 'tool_usertours'),
        getString('yes', 'core'),
        getString('no', 'core'),
        () => {
            window.location = targetUrl;
        }
    );
};

/**
 * Set up the step management handlers.
 */
export const setup = () => {
    prefetchStrings('tool_usertours', [
        'confirmstepremovaltitle',
        'confirmstepremovalquestion',
    ]);

    prefetchStrings('core', [
        'yes',
        'no',
    ]);

    document.querySelector('body').addEventListener('click', removeStepHandler);
};
