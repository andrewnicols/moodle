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
 * A tab containing a set of items.
 *
 * @module     core/local/itemchooser/tabcontainer
 * @copyright  2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {BaseComponent} from 'core/reactive';

export default class extends BaseComponent {
    create() {
        this.name = 'tabcontainer';

        this.selectors = {
            item: '[data-item-name]',
        };
    }

    getWatchers() {
        return [{
            watch: 'items:updated',
            handler: this._updateItemVisibility,
        }];
    }

    _updateItemVisibility({element}) {
        const item = this.getElement(this.selectors.item, element.id);

        // TODO NULLOP until we work out waht we want to do.
        if (item === element.id) {
            return;
        }

        return;
    }
}
