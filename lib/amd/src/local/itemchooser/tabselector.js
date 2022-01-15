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
 * The navigation item for the tabs.
 *
 * @module     core/local/itemchooser/tabselector
 * @copyright  2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {BaseComponent} from 'core/reactive';

export default class extends BaseComponent {
    create() {
        this.name = 'tabselector';

        this.selectors = {
            tab: '[data-tab-name]',
        };
    }

    stateReady() {
        this.addEventListener(
            this.getElement(),
            'click',
            this._selectTab,
        );
    }

    _selectTab(e) {
        const selectedTab = e.target.closest(this.selectors.tab);
        if (!selectedTab) {
            return;
        }

        e.preventDefault();
        this.reactive.dispatch('selectTab', this.reactive, selectedTab.dataset.tabName);
    }

    getWatchers() {
        return [{
            watch: 'items:updated',
            handler: this._updateItemVisibility,
        }, {
            watch: 'tabData:updated',
            handler: this._updateTabVisibility,
        }];
    }

    _updateItemVisibility() {
        this.reactive.dispatch('setTabVisibilities', this.reactive);
    }

    _updateTabVisibility({element}) {
        const tab = this.getElement(this.selectors.tab, element.id);
        tab.classList.toggle('d-none', !element.visible);
    }
}
