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
 * Javascript popover for the `core_calendar` subsystem.
 *
 * @module core_calendar/popover
 * @copyright 2021 Huong Nguyen <huongnv13@gmail.com>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since 4.0
 */

import 'theme_boost/popover';
import jQuery from 'jquery';
import * as CalendarSelectors from 'core_calendar/selectors';

/**
 * Check if we are allowing to enable the popover or not.
 * @param {Element} dateContainer
 * @returns {boolean}
 */
const isPopoverAvailable = (dateContainer) => {
    return window.getComputedStyle(dateContainer.querySelector(CalendarSelectors.elements.dateContent)).display === 'none';
};

/**
 * Register events for date container.
 */
const registerEventListeners = () => {
    document.addEventListener('mouseover', e => {
        const dateContainer = e.target.closest(CalendarSelectors.elements.dateContainer);
        if (dateContainer) {
            e.preventDefault();
            if (isPopoverAvailable(dateContainer)) {
                jQuery(dateContainer).popover('show');
            }
            dateContainer.addEventListener('mouseleave', e => {
                e.preventDefault();
                jQuery(dateContainer).popover('hide');
            });
        }
    });
};

/**
 * Init the popover init for calendar.
 * @param {String} instanceId Block element id.
 */
const initPopover = (instanceId) => {
    const blockNode = document.querySelector('[data-instance-id="' + instanceId + '"]');
    const dates = blockNode.querySelectorAll(CalendarSelectors.elements.dateContainer);
    dates.forEach((date) => {
        const dateEle = jQuery(date);
        dateEle.popover({
            trigger: 'manual',
            placement: 'top',
            html: true,
            content: () => {
                const source = dateEle.find(CalendarSelectors.elements.dateContent);
                const content = jQuery('<div>');
                if (source.length) {
                    const temptContent = source.find('.hidden').clone(false);
                    content.html(temptContent.html());
                }
                return content.html();
            }
        });
    });
};

/**
 * Initialises popover.
 *
 * @param {String} instanceId Block element id.
 */
export const init = (instanceId) => {
    initPopover(instanceId);
    registerEventListeners();
};
