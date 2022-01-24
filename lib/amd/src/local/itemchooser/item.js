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
 * An individual item.
 *
 * @module     core/local/itemchooser/item
 * @copyright  2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {BaseComponent} from 'core/reactive';

export default class Item extends BaseComponent {
    create() {
        this.name = 'item';

        this.selectors = {
            favourite: '[data-toggle="favourite"]',

            // TODO Fix this to not use menuitem.
            items: '[role="menuitem"]',

            // TODO Rename chooser to itemchooser.
            addLink: '[data-action="add-chooser-option"]',

            helpButton: '[data-action="show-option-summary"]',
        };

        this.id = this.element.dataset.id;
    }

    stateReady() {
        this.addEventListener(
            this.getElement(),
            'click',
            this._handleResponse,
        );
    }

    _handleResponse(e) {
        const itemName = this.getItemName();

        const addButton = this.getAddButton(e.target);
        if (addButton) {
            this.reactive.handleItemSelection(itemName);
            e.preventDefault();
            return;
        }

        const favouriteButton = this.getFavouriteButton(e.target);
        if (favouriteButton) {
            this.reactive.dispatch('toggleFavourite', itemName);
            e.preventDefault();
            return;
        }

        const helpButton = this.getHelpButton(e.target);
        if (helpButton) {
            this.reactive.dispatch('setPanel', 'help', itemName);
            e.preventDefault();
            return;
        }
    }

    getItemName() {
        return this.getElement().dataset.itemName;
    }

    getFavouriteButton(target) {
        return target.closest(this.selectors.favourite);
    }

    getAddButton(target) {
        return target.closest(this.selectors.addLink);
    }

    getHelpButton(target) {
        return target.closest(this.selectors.helpButton);
    }

    getWatchers() {
        return [
            {
                watch: `items[${this.id}]:updated`,
                handler: this._refreshItem,
            },
        ];
    }

    _refreshItem({element}) {
        // There must be a better way of doing this!
        const target = this.getElement();

        this._updateFavouriteState(element, target);
        this._updateVisibility(element, target);
    }

    _updateFavouriteState(targetState, target) {
        const favouriteButton = target.querySelector(this.selectors.favourite);
        const icon = favouriteButton.querySelector(`i`);

        icon.classList.toggle('fa-star', targetState.favourite);
        icon.classList.toggle('fa-star-o', !targetState.favourite);
        favouriteButton.classList.toggle('text-primary', targetState.favourite);
        favouriteButton.classList.toggle('text-muted', !targetState.favourite);
        favouriteButton.dataset.favourited = targetState.favourite;
        favouriteButton.ariaPressed = targetState.favourite;
    }

    _updateVisibility(targetState, target) {
        target.classList.toggle('d-none', !targetState.visible);
    }
}
