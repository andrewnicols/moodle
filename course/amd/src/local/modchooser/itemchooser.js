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
 * A type of itemchooser used as for choosing modules in a course.
 *
 * @module     core_course/local/modchooser/itemchooser
 * @copyright  2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import ItemChooser from 'core/itemchooser';
import {get_string as getString} from 'core/str';
import {prefetchStrings} from 'core/prefetch';
import {
    activityModules as getModuleData,
    fetchFooterData,
} from 'core_course/local/activitychooser/repository';

// Prefetch the strings.
prefetchStrings('core', [
    'activities',
    'addresourceoractivity',
    'resources',
]);

// Module types.
const ACTIVITY = 0;
const RESOURCE = 1;

export default class extends ItemChooser {

    /**
     * @property {string} The name of the itemchooser type.
     */
    static name = 'coursechooser';

    /**
     * Constructor to configure the chooser.
     *
     * @param {Number} courseId
     */
    constructor(courseId) {
        super();

        this.courseId = courseId;
    }

    /**
     * Set the tab mode.
     *
     * @param {number} tabMode
     */
    set tabMode(tabMode) {
        this._tabMode = tabMode;
    }

    /**
     * Get the tab mode.
     *
     * @return {number}
     */
    get tabMode() {
        return this._tabMode;
    }

    /**
     * Get the id of the section.
     *
     * @return {null|number}
     */
    get sectionId() {
        return this.caller?.dataset.sectionid;
    }


    /**
     * Get the title for the item chooser dialogue.
     *
     * @returns {Promise<string>}
     */
    get dialogueTitle() {
        return getString('addresourceoractivity', 'core');
    }

    /**
     * Get a list of named tabs for this chooser, which match the tab order.
     *
     * To be extended by the child class.
     *
     * @returns {Promise<tabConfig>}
     */
    get tabList() {
        return super.tabList.then(async tabList => {
            return {
                ...tabList,
                activitiesTab: await this.getPopulatedTab(this.activitiesTab),
                resourcesTab: await this.getPopulatedTab(this.resourcesTab),
            };
        });
    }

    /**
     * Get the tab order.
     *
     * @returns {string[]}
     */
    get tabOrder() {
        if (this.tabMode == "0") {
            // Favourites, Recommended, All, Activities only, Resources only.
            return [
                'favouriteTab',
                'recommendedTab',
                'allItemsTab',
                'activitiesTab',
                'resourcesTab',
            ];
        }

        if (this.tabMode == "1") {
            // Favourites, Recommended, All, Activities only, Resources only.
            return [
                'favouriteTab',
                'recommendedTab',
                'allItemsTab',
            ];
        }

        // Favourites, Recommended, All, Activities only, Resources only.
        return [
            'favouriteTab',
            'recommendedTab',
            'activitiesTab',
            'resourcesTab',
        ];
    }

    /**
     * Get the data for the recommended items tab.
     *
     * @returns {tabConfig}
     */
    get activitiesTab() {
        return {
            name: 'activities',
            filterFunction: item => item.archetype === ACTIVITY,
            titleIdentifier: 'activities',
            titleComponent: 'core',
        };
    }

    /**
     * Get the data for the recommended items tab.
     *
     * @returns {tabConfig}
     */
    get resourcesTab() {
        return {
            name: 'resources',
            filterFunction: item => item.archetype === RESOURCE,
            titleIdentifier: 'resources',
            titleComponent: 'core',
        };
    }

    /**
     * Get any context data for the dialogue.
     *
     * @returns {object}
     */
    get chooserTemplateContext() {
        return {
            classes: 'modchooser',
        };
    }

    /**
     * Fetch the cached data.
     *
     * @returns {Promise<object>}
     */
    get cachedData() {
        return super.cachedData.then(data => JSON.parse(JSON.stringify(data)))
        .then(data => {
            data.content_items.forEach(module => {
                if (this.sectionId) {
                    module.link += `&section=${this.sectionId}`;
                }

                module.link += `&sr=${this.sectionReturnId ?? 0}`;
            });

            return data.content_items;
        });
    }

    /**
     * Fetch the data to display.
     *
     * @returns {Promise<object>}
     */
    get data() {
        return getModuleData(this.courseId);
    }

    /**
     * Get the Chooser footer.
     *
     * @returns {Promise<string>}
     */
    get chooserFooter() {
        if (this.sectionId) {
            return fetchFooterData(this.courseId, this.sectionId);
        }
        return Promise.resolve('');
    }

    /**
     * Get the tab visibility controller function for the named tab.
     *
     * @param {string} tabName
     * @return {function|null}
     */
    getTabVisibilityFunction(tabName) {
        switch (tabName) {
            case 'activities':
            case 'resources':
                return ({items}) => !!items.length;
            default:
                return super.getTabVisibilityFunction(tabName);
        }
    }
}
