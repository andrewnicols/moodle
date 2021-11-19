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
 * Course index keyboard navigation and aria-tree compatibility.
 *
 * Node tree and bootstrap collapsibles don't use the same HTML structure. However,
 * all keybindings and logic is compatible. This class translate the primitive opetations
 * to a bootstrap collapsible structure.
 *
 * @module     core/collapsible_tree
 * @class      core/collapsible_tree
 * @copyright  2021 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Tree from 'core/tree';
// The core/tree uses jQuery to expand all nodes.
import jQuery from 'jquery';
import {getElement} from 'core/normalise';

export default class extends Tree {

    /**
     * Setup the core/tree keyboard navigation.
     *
     * @param {string} root The root of the tree to support
     */
    constructor(root) {
        // Init this value with the parent DOM element.
        super(root);

        // All jQuery events can be replaced when MDL-79179 is integrated.
        this.treeRoot.on('hidden.bs.collapse shown.bs.collapse', () => {
            this.refreshVisibleItemsCache();
        });
    }

    /**
     * Expand a group item.
     *
     * @param {JQuery} item  the jQuery object
     */
    expandGroup(item) {
        super.expandGroup(item);

        const itemElement = getElement(item);
        const collapsible = itemElement.dataset.target ? document.querySelector(itemElement.dataset.target) : null;

        if (collapsible) {
            // Bootstrap 4 uses jQuery to interact with collapsibles.
            jQuery(collapsible).collapse('show');
        }
    }

    /**
     * Collpase a group item.
     *
     * @param {JQuery} item  the jQuery object
     */
    collapseGroup(item) {
        super.collapseGroup(item);

        const itemElement = getElement(item);
        const collapsible = itemElement.dataset.target ? document.querySelector(itemElement.dataset.target) : null;

        if (collapsible) {
            // Bootstrap 4 uses jQuery to interact with collapsibles.
            jQuery(collapsible).collapse('hide');
        }
    }
}
