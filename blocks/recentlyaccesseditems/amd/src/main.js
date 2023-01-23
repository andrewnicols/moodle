
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
 * Javascript to initialise the Recently accessed items block.
 *
 * @module     block_recentlyaccesseditems/main
 * @copyright  2018 Victor Deniz <victor@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import $ from 'jquery';
import {getRecentItems} from './repository';
import Notification from 'core/notification';
import Templates from 'core/templates';


const NUM_ITEMS = 9;
// Maximum number of elements to display in the block initially.
const NUM_ITEMS_INIT = 3;

const Selectors = {
    CARDDECK_CONTAINER: '[data-region="recentlyaccesseditems-view"]',
    CARDDECK: '[data-region="recentlyaccesseditems-view-content"]',
    SHOWMORE_LINK: '[data-region="recentlyaccesseditems-view"] [data-action="more-items"]',
};

/**
 * Register event listeners.
 */
const registerEventListeners = () => {
    const showmoreLink = document.querySelector(Selectors.SHOWMORE_LINK);

    // Hide "Show more" link and show additional items.
    showmoreLink.addEventListener('click', () => {
        showmoreLink.classList.add('d-none');

        const hiddenItems = document.querySelector('[data-region="items-list"]').children;
        hiddenItems.forEach(function(hiddenItem) {
            hiddenItem.style = "display: block";
        });
    });
};

/**
 * Render the block content.
 *
 * @method renderItems
 * @param {object} root The root element for the items view.
 * @param {array} items containing array of returned items.
 * @return {promise} Resolved with HTML and JS strings
 */
const renderItems = function(root, items) {
    if (items.length > 0) {
        return Templates.renderForPromise('block_recentlyaccesseditems/view-cards', {
            items,
            hasmoreitems: (items.length > NUM_ITEMS_INIT),
        });
    } else {
        return Templates.renderForPromise('block_recentlyaccesseditems/no-items', {
            noitemsimgurl: root.attr('data-noitemsimgurl'),
        });
    }
};

/**
 * Get and show the recent items into the block.
 *
 * @param {object} root The root element for the items block.
 */
export const init = async (root) =>{
    root = $(root);

    const itemsContainer = root.find(Selectors.CARDDECK_CONTAINER);
    const itemsContent = root.find(Selectors.CARDDECK);

    try {
        const items = await getRecentItems(NUM_ITEMS);
        const {html, js} = await renderItems(itemsContainer, items);

        Templates.replaceNodeContents(itemsContent, html, js);
        if (items.length > 3) {
            registerEventListeners();
        }
    } catch (error) {
        Notification.exception(error);
    }
};
