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
import {get_string as getString} from 'core/str';
import {prefetchStrings} from 'core/prefetch';

import Item from './local/itemchooser/item';
import TabContainer from './local/itemchooser/tabcontainer';
import TabSelector from './local/itemchooser/tabselector';
import ItemMutations from './local/itemchooser/mutations';
import {Reactive} from 'core/reactive';
import * as itemEvents from './local/itemchooser/events';

// Prefetch the strings.
prefetchStrings('core', [
    'all',
    'favourite',
    'recommended',
]);

/**
 * @typedef tabConfig
 * @property {string} name
 * @property {bool} [visible=false]
 */

export default class extends Reactive {
    constructor() {
        super({
            eventName: itemEvents.eventTypes.stateUpdated,
            eventDispatch: itemEvents.notifyStateUpdated,
        });

        this.name = this.constructor.name;

        this.setMutations(new ItemMutations());
    }

    /**
     * @property {string} The name of the itemchooser type.
     */
    static name = 'itemchooser';

    /**
     * Store a reference to the element that opened the item chooser.
     *
     * @param {HTMLElement} callerElement
     */
    setCaller(callerElement) {
        this.caller = callerElement;
    }

    /**
     * Fetch the cached data.
     *
     * @returns {Promise<object>}
     */
    get cachedData() {
        if (!this._cachedData) {
            this._cachedData = this.data;
        }

        return this._cachedData;
    }

    /**
     * Fetch the data to display.
     *
     * @returns {Promise<object>}
     */
    get data() {
        return Promise.reject(new Error(`TODO: Implement`));
    }

    /**
     * Get the tab order.
     *
     * @returns {string[]}
     */
    get tabOrder() {
        // Favourites, All.
        return [
            'recommendedTab',
            'favouriteTab',
            'allItemsTab',
        ];
    }

    /**
     * Get an ordered list of tabs for this chooser.
     *
     * To be extended by the child class.
     *
     * @returns {Promise<tabConfig[]>}
     */
    get tabList() {
        return Promise.all([
            this.getPopulatedTab(this.recommendedTab),
            this.getPopulatedTab(this.allItemsTab),
            this.getPopulatedTab(this.favouriteTab,),
        ]).then(([recommendedTab, allItemsTab, favouriteTab]) => {
            return {
                recommendedTab,
                allItemsTab,
                favouriteTab,
            };
        });
    }

    /**
     * Get the tab visibility controller function for the named tab.
     *
     * @param {string} tabName
     * @return {function|null}
     */
    getTabVisibilityFunction(tabName) {
        switch (tabName) {
            case 'favourites':
            case 'recommended':
                return ({items}) => !!items.length;
            default:
                return null;
        }
    }

    /**
     * Get the tab visibility controller function for the named tab.
     *
     * @param {string} tabName
     * @return {function|null}
     */
    getTabFilterFunction(tabName) {
        switch (tabName) {
            case 'favourites':
                return item => item.favourite;
            case 'recommended':
                return item => item.isRecommended;
            default:
                return null;
        }
    }

    /**
     * Get the data for the recommended items tab.
     *
     * @returns {tabConfig}
     */
    get recommendedTab() {
        return {
            name: 'recommended',
            titleIdentifier: 'recommended',
        };
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
            titleIdentifier: 'all',
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
            titleIdentifier: 'favourites',
        };
    }

    /**
     * Get the populated tab data for the given configuration.
     *
     * @param {tabConfig} tabConfig
     * @returns {Promise<tabConfig>}
     */
    async getPopulatedTab(tabConfig) {
        tabConfig = Object.assign({
            titleComponent: 'core',
            visible: false,
        }, tabConfig);

        this.validateTabConfiguration(tabConfig);

        tabConfig.title = await getString(tabConfig.titleIdentifier, tabConfig.titleComponent);

        return tabConfig;
    }

    /**
     * Validate the tab configuration to check for required values.
     *
     * @param {tabConfig} tabConfig
     * @throws {Error}
     */
    validateTabConfiguration(tabConfig) {
        if (!tabConfig.name) {
            throw new Error(`Missing name for tab`, tabConfig);
        }

        if (!tabConfig.titleIdentifier || !tabConfig.titleComponent) {
            throw new Error(`Missing title details for ${tabConfig.name}`);
        }
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
     * Get the modal.
     *
     * @returns {Promise}
     */
    getModal() {
        if (!this._modal) {
            this._modal = this._getModal();
        }

        return this._modal;
    }

    _getModal() {
        return createModal({
            body: this.chooserBody,
            footer: this.chooserFooter,
            large: this.isDialogueLarge,
            scrollable: this.isDialogueScrollable,
            templateContext: this.getChooserTemplateContext,
            title: this.dialogueTitle,
            type: modalTypes.DEFAULT,
        })
        .then(modal => this.setupReactiveModal(modal));
    }

    setupReactiveModal(modal) {
        return Promise.all([
            modal,
            modal.getBodyPromise(),
            this.chooserData,
        ])
        .then(([modal, body, {items, tabList, initialTab}]) => {
            this.setInitialState({
                items: items.map(item => {
                    return {
                        ...item,
                        id: item.name,
                    };
                }),
                tabData: tabList.map(data => {
                    return {
                        ...data,
                        id: data.name,
                    };
                })
            });

            new TabSelector({
                element: body[0].querySelector('[role="tablist"]'),
                reactive: this,
            });

            // Set up the tab container, which contains the list of items.
            new TabContainer({
                element: body[0].querySelector('.tab-content'),
                reactive: this,
            });

            // Set the name of the initial tab.
            this.dispatch('selectTab', this, initialTab.name);

            body[0].querySelectorAll('[role="menuitem"]').forEach(element => new Item({element}));

            return modal;
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
        return this.chooserData.then(chooserData => Templates.render(
            'core/itemchooser',
            chooserData
        ));
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
        return Promise.all([this.cachedData, this.orderedTabList])
        .then(([itemData, tabList]) => {
            // Set initial tab visibility state.
            tabList = tabList.map(tabConfig => {
                const visibilityFunction = this.getTabVisibilityFunction(tabConfig.name);
                if (!visibilityFunction) {
                    return tabConfig;
                }

                const filterFunction = this.getTabFilterFunction(tabConfig.name);
                let filteredItems = itemData.concat();
                filteredItems = filteredItems.filter(itemData => {
                    if (filterFunction) {
                        return filterFunction(itemData);
                    }

                    return true;
                });

                let visible = tabConfig.visible;
                if (visibilityFunction) {
                    visible = visibilityFunction({
                        tabConfig,
                        items: filteredItems,
                    });
                }

                return Object.assign({}, tabConfig, {
                    visible,
                });
            });


            // Set initial tab configuration.
            if (!tabList.some(tabData => tabData.isActive && tabData.visible)) {
                tabList.find(tabData => tabData.visible).isActive = true;
            }

            // Unset the isActive so that it will be changed by the reactive component.
            const initialTab = tabList.find(tabData => tabData.isActive);
            initialTab.isActive = false;

            return {
                items: itemData,
                tabList,
                initialTab,
            };
        });
    }

    /**
     * Get the tabs, in their ordered list.
     *
     * @returns {Promise}
     */
    get orderedTabList() {
        return this.tabList.then(tabList => {
            const orderedList = this.tabOrder.map(tabName => {
                return tabList[tabName] ?? false;
            }).filter(value => value);

            return orderedList;
        });
    }

    /**
     * Display the modal.
     */
    async show() {
        const modal = await this.getModal();
        modal.show();
    }

    /**
     * Hide the modal.
     */
    async hide() {
        const modal = await this.getModal();
        modal.hide();
    }

    /**
     * Handle selection of the item.
     *
     * @param {string} itemName
     */
    handleItemSelection(itemName) {
        const item = this.state.items.get(itemName);
        window.location.href = item.link;
    }
}
