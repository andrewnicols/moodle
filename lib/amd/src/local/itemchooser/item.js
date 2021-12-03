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
 * @module     core_course/local/modchooser/item
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
        };
    }

    stateReady() {
        this.addEventListener(
            this.getElement(),
            'click',
            this._toggleFavourite,
        );
    }

    getItemName() {
        return this.getElement().dataset.itemName;
    }

    isFavouriteButton(target) {
        return target.closest(this.selectors.favourite);
    }

    /**
     * @param {Event} e The click event
     */
    _toggleFavourite(e) {
        const favouriteButton = this.isFavouriteButton(e.target);
        if (favouriteButton) {
            e.preventDefault();

            const wasFavourite = favouriteButton.dataset.favourited === 'true';
            this.reactive.dispatch(
                'toggleFavourite',
                this.getItemName(),
                wasFavourite,
            );
        }
    }

    getWatchers() {
        return [
            {
                watch: 'items:updated',
                handler: this._refreshItem,
            },
        ];
    }

    _refreshItem({element, state}) {
        // There must be a better way of doing this!
        const target = this.getElement();
        if (target.dataset.id !== element.id) {
            return;
        }

        const targetState = state.items.get(element.id);

        this._updateFavouriteState(targetState, target);
        this._updateVisibility(targetState, target);
    }

    _updateFavouriteState(targetState, target) {
        const favouriteButton = target.querySelector(this.selectors.favourite);
        const icon = favouriteButton.querySelector(`i`);
        if (targetState.favourite) {
            // TODO Fix this because it's minging.
            icon.classList.add('fa-star');
            icon.classList.remove('fa-star-o');
            favouriteButton.classList.add('text-primary');
            favouriteButton.classList.remove('text-muted');
            favouriteButton.dataset.favourited = true;
            favouriteButton.ariaPressed = true;
        } else {
            icon.classList.remove('fa-star');
            icon.classList.add('fa-star-o');
            favouriteButton.classList.add('text-muted');
            favouriteButton.classList.remove('text-primary');
            favouriteButton.dataset.favourited = false;
            favouriteButton.ariaPressed = false;
        }
    }

    _updateVisibility(targetState, target) {
        if (targetState.visible) {
            target.classList.remove('d-none');
        } else {
            target.classList.add('d-none');
        }
    }
}
