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
 * Normalisation helpers.
 *
 * @module     core/normalise
 * @copyright  2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import jQuery from 'jquery';

/**
 * Normalise a list of Nodes into an Array of Nodes.
 *
 * @method getList
 * @param {(Array|jQuery|NodeList|HTMLElement|Y.Node|Y.NodeList)} nodes
 * @returns {HTMLElement[]}
 */
export const getList = nodes => {
    if (nodes instanceof HTMLElement) {
        // A single record to conver to a NodeList.
        return [nodes];
    }

    if (nodes instanceof Array) {
        // A single record to conver to a NodeList.
        return nodes;
    }

    if (nodes instanceof NodeList) {
        // Already a NodeList.
        return Array.from(nodes);
    }

    if (nodes instanceof jQuery) {
        // A jQuery object to a NodeList.
        return nodes.get();
    }

    if (nodes instanceof Y.Node) {
        return [nodes.getDOMNode()];
    }

    if (nodes instanceof Y.NodeList) {
        return nodes.getDOMNodes();
    }

    // Fallback to just having a go.
    return Array.from(nodes);
};

/**
 * Get a singlde HTMLElement from a provided arg.
 *
 * @param {(jQuery|Node|Y.Node|HTMLElement)} node
 * @returns {HTMLElement}
 */
export const getNode = node => {
    if (node instanceof HTMLElement) {
        // An HTMLElement already.
        return node;
    }

    if (node instanceof jQuery) {
        // A jQuery object to a NodeList.
        return node.get(0);
    }

    if (node instanceof Y.Node) {
        return node.getDOMNode();
    }

    // Fallback to just having a go.
    return node;
};
