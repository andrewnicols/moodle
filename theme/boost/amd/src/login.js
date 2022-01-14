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
 * Javascript run on the login page.
 *
 * @module     theme_boost/login
 * @copyright  2021 Mathew May <mathew.solutions>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import * as ModalFactory from 'core/modal_factory';
import {get_strings as getStrings} from 'core/str';
import * as Notification from 'core/notification';

/**
 * Set up the login page js.
 *
 * @method init
 */
export const init = async() => {
    registerEventListeners();
};

/**
 * Listen to the page for click events of interest.
 *
 * @method registerEventListeners
 */
const registerEventListeners = () => {
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-toggle="cookie-modal"]')) {
            // Fetch the strings for the cookie modal.
            getStrings([
                {key: 'cookiesenabled', component: 'core'},
                {key: 'cookiesenabled_help_html', component: 'core'},
            ]).then(function(strings) {
                cookieModalBuilder(strings[0], strings[1]);
            }).fail(Notification.exception);
        }
    });
};

/**
 * Given we have to show the cookie notice, build the modal.
 *
 * @method init
 * @param {String} titleStr String title of the modal
 * @param {String} bodyStr String body of the modal
 */
const cookieModalBuilder = (titleStr, bodyStr) => {
    ModalFactory.create({
        type: ModalFactory.types.DEFAULT,
        title: titleStr,
        body: bodyStr,
    }).then(modal => {
        modal.show();
        return modal;
    }).fail(Notification.exception);
};
