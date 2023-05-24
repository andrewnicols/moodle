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
 * Usage column selector js.
 *
 * @module     qbank_usage/usage
 * @copyright  2021 Catalyst IT Australia Pty Ltd
 * @author     Safat Shahin <safatshahin@catalyst-au.net>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Fragment from 'core/fragment';
import CancelModal from 'core/modal_cancel';
import Notification from 'core/notification';
import * as Str from 'core/str';

/**
 * Event listeners for the module.
 *
 * @method clickEvent
 * @param {Number} questionId
 * @param {Number} contextId
 */
const usageEvent = (questionId, contextId) => {
    const args = {
        questionid: questionId,
    };

    CancelModal.create({
        title: Str.get_string('usageheader', 'qbank_usage'),
        body: Fragment.loadFragment('qbank_usage', 'question_usage', contextId, args),
        large: true,
        show: true,
    }).then((modal) => {
        const refreshModal = () => modal.setBody(Fragment.loadFragment('qbank_usage', 'question_usage', contextId, args));
        modal.getRoot().on('click', 'a[href].page-link', function(e) {
            e.preventDefault();
            let attr = e.target.getAttribute("href");
            if (attr !== '#') {
                args.querystring = attr;
                refreshModal();
            }
        });
        // Version selection event.
        modal.getRoot().on('change', '#question_usage_version_dropdown', function(e) {
            args.questionid = e.target.value;
            refreshModal();
        });
        return modal;
    }).catch(Notification.exception);
};

/**
 * Entrypoint of the js.
 *
 * @method init
 * @param {string} questionSelector the question usage identifier.
 * @param {Number} contextId the question context id.
 */
export const init = (questionSelector, contextId) => {
    const target = document.querySelector(questionSelector);
    const questionId = target.getAttribute('data-questionid');
    target.addEventListener('click', () => {
        // Call for the event listener to listed for clicks in any usage count row.
        usageEvent(questionId, contextId);
    });
};
