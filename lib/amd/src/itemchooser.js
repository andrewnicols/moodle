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
 * A type of dialogue used as for choosing modules in a course.
 *
 * @module     core_course/activitychooser
 * @copyright  2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {
    create as createModal,
    types as modalTypes,
} from 'core/modal_factory';
import * as Templates from 'core/templates';

/**
 * @typedef tabConfig
 * @property {string} name
 * @property {function} [filterFunction]
 * @property {function} [visibleFunction]
 * @property {bool} [visible=false] Calculated from visibleFunction if not specified
 */

export default class {
    /**
     * Constructor for a new Item Chooser.
     *
     * @param {object} chooserConfig
     */
    constructor(chooserConfig = {}) {
        this.chooserConfig = chooserConfig;
    }

    /**
     * Fetch the cached data.
     *
     * @returns {Promise<object>}
     */
    get chooserData() {
        if (!this.cachedData) {
            this.cachedData = this.fetchRemoteData();
        }

        return this.cachedData;
    }

    /**
     * Fetch the remote data to display.
     *
     * @returns {Promise<object>}
     */
    get remoteData() {
        return Promise.reject(new Error(`TODO: Implement`));
    }

    /**
     * Get an ordered list of tabs for this chooser.
     *
     * To be extended by the child class.
     *
     * @returns {tabConfig[]}
     */
    get tabList() {
        const itemData = this.data;

        return [
            this.getPopulatedTab(this.allItemsTab, itemData),
            this.getPopulatedTab(this.favouriteTab, itemData),
        ];
    }

    /**
     * Get the data for the all items tab.
     *
     * @returns {tabConfig}
     */
    get allItemsTab() {
        return {
            name: 'all',
            visible: true,
        };
    }

    /**
     * Get the data for the favourite items tab.
     *
     * @returns {tabConfig}
     */
    get favouriteTab() {
        return {
            name: 'favourites',
            filterFunction: item => item.isFavourite,
            visibleFunction: tabConfig => tabConfig.items.length,
        };
    }

    /**
     * Get the populated tab data for the given configuration.
     *
     * @param {tabConfig} tabConfig
     * @param {object[]} itemData
     * @returns {tabConfig}
     */
    getPopulatedTab(
        tabConfig = {
            items: [],
            filterFunction: null,
            visibleFunction: null,
            visible: false,
        },
        itemData = []
    ) {
        tabConfig.items = itemData;
        if (tabConfig.filterFunction) {
            tabConfig.items = tabConfig.items.filter(tabConfig.filterFunction);
        }

        if (tabConfig.visibleFunction) {
            tabConfig.visible = tabConfig.visibleFunction(tabConfig);
        }

        return tabConfig;
    }


    /**
     * Get the list of enabled (active) tabs.
     *
     * @returns {tabConfig[]}
     */
    get enabledTabs() {
        return this.getTabList();
    }

    /**
     * Get the template to use for the body.
     *
     * @returns {string} The template name
     */
    get templateName() {
        return 'core/local/itemchooser/body';
    }

    /**
     * Mark the specified item as a favourite.
     *
     * @param {string} identifier The identifier of the favourite
     * @param {bool} [isFavourited=true]
     */
    setFavouriteState(identifier, isFavourited = true) {
        throw new Error(`TODO: Implement setting favourite state for ${identifier} to ${isFavourited}`);
    }

    /**
     * Get the modal.
     *
     * @returns {Promise}
     */
    getModal() {
        return createModal({
            body: this.chooserBody(),
            footer: this.chooserFooter(),
            large: this.isDialogueLarge(),
            scrollable: this.isDialogueScrollable(),
            templateContext: this.getChooserTemplateContext(),
            title: this.getDialogueTitle(),
            type: modalTypes.DEFAULT,
        });
    }

    /**
     * Get the title for the item chooser dialogue.
     *
     * @returns {Promise<string>}
     */
    get dialogueTitle() {
        return Promise.reject(new Error(`TODO: Implement the title fetcher`));
    }

    /**
     * Get the Chooser body.
     *
     * @returns {Promise<string>}
     */
    get chooserBody() {
        return Templates.render(
            'core_course/activitychooser',
            this.chooserData
        );
    }

    /**
     * Get the Chooser footer.
     *
     * @returns {Promise<string>}
     */
    get chooserFooter() {
        return Promise.resolve();
    }

    /**
     * Whether to make the dialogue large.
     *
     * @returns {boolean}
     */
    isDialogueLarge() {
        return true;
    }

    /**
     * Whether to make the dialogue scrollable.
     *
     * @returns {boolean}
     */
    isDialogueScrollable() {
        return false;
    }

    /**
     * Get any context data for the dialogue.
     *
     * @returns {object}
     */
    get chooserTemplateContext() {
        return {};
    }

    /**
     * Format the data for the item chooser.
     *
     * @returns {object}
     */
    get chooserData() {
        return {
            tabList: this.tabList,
        };
    }

    async show() {
        const modal = this.getModal();
        modal.show();
    }

    async hide() {
        const modal = await this.getModal();
        modal.hide();
    }

    /**
     * Get the chooser dialogue configuration for this chooser.
     *
     * @return {object}
     */
    get chooserConfig() {
        return this.chooseConfig;
    }
}
