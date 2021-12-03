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

import * as Repository from 'core_course/local/activitychooser/repository';
import ItemChooser from 'core/itemchooser';
import {get_string as getString} from 'core/str';
import {prefetchStrings} from 'core/prefetch';

// Prefetch the strings.
prefetchStrings('core', [
    'addresourceoractivity',
]);

// Module types.
const ACTIVITY = 0;
const RESOURCE = 1;

export default class extends ItemChooser {

    /**
     * Constructor to configure the chooser.
     *
     * @param {Number} courseId
     */
    constructor(courseId) {
        this.courseId = courseId;
    }

    /**
     * Get the title for the item chooser dialogue.
     *
     * @returns {Promise<string>}
     */
    get dialogueTitle() {
        return getString('addresourceoractivity');
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
        const favouriteTab = this.getPopulatedTab(this.favouriteTab, itemData);
        const recommendedTab = this.getPopulatedTab(this.recommendedTab, itemData);
        const allItemsTab = this.getPopulatedTab(this.allItemsTab, itemData);
        const activitiesTab = this.getPopulatedTab(this.allItemsTab, itemData);
        const resourcesTab = this.getPopulatedTab(this.allItemsTab, itemData);

        switch (this.chooserConfig.tabMode) {
            // Favourites, Recommended, All, Activities only, Resources only.
            case 0:
                return [
                    favouriteTab,
                    recommendedTab,
                    allItemsTab,
                    activitiesTab,
                    resourcesTab,
                ];
            // Favourites, Recommended, All, Activities only, Resources only.
            case 1:
                return [
                    favouriteTab,
                    recommendedTab,
                    allItemsTab,
                ];
        }

        // Favourites, Recommended, All, Activities only, Resources only.
        return [
            favouriteTab,
            recommendedTab,
            activitiesTab,
            resourcesTab,
        ];
    }

    /**
     * Get the data for the recommended items tab.
     *
     * @returns {tabConfig}
     */
    get recommendedTab() {
        return {
            name: 'recommended',
            filterFunction: item => item.isRecommended,
            visibleFunction: tabConfig => tabConfig.items.length,
        };
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
            visibleFunction: tabConfig => tabConfig.items.length,
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
            visibleFunction: tabConfig => tabConfig.items.length,
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
    get data() {
        const cachedData = super.fetchData();

        const newData = JSON.parse(JSON.stringify(cachedData));
        newData.content_items.forEach(module => {
            module.link += `&section=${this.currentSectionId}&sr=${this.currentSectionReturnId ?? 0}`;
        });

        return newData;
    }

    /**
     * Fetch the remote data to display.
     *
     * @returns {Promise<object>}
     */
    get remoteData() {
        return Repository.activityModules(this.courseId);
    }

    /**
     * Get the Chooser footer.
     *
     * @returns {Promise<string>}
     */
    get chooserFooter() {
        return Repository.fetchFooterData(this.courseId, this.sectionId);
    }

    openForSection(sectionId) {
        this.currentSectionId = sectionId;

        this.show();
    }
}
