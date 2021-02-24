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
 * Helper to watch for a node type to help register a legacy listener.
 *
 * @module     core/local/event/legacylistener
 * @class      legacylistener
 * @package    core
 * @copyright  2021 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Determine whether the browser supports the MutationObserver system.
 *
 * @returns {Bool}
 */
const supportsMutationObservers = () => (MutationObserver && typeof MutationObserver === 'function');

/**
 * @param {String} targetSelector The selector to apply
 * @param {Function} applyCallback The function to call on the found node
 */
export const listen = (targetSelector, applyCallback) => {
    if (supportsMutationObservers()) {
        // Add a MutationObserver to check for new children to the tree.
        const newNodeObserver = new MutationObserver(mutationList => {
            mutationList.forEach(mutation => mutation.addedNodes.forEach(node => {
                if (node instanceof Element && node.matches(targetSelector)) {
                    applyCallback(node);
                }
            }));
        });

        newNodeObserver.observe(document, {childList: true, subtree: true});
    }
};
