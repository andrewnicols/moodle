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

import $ from 'jquery';
import CustomEvents from "core/custom_interaction_events";
import * as Templates from 'core/templates';
import {debounce} from 'core/utils';
import Url from 'core/url';

/**
 * The class that manages the state of the user search.
 *
 * @module    gradereport_grader/search/search_class
 * @copyright 2023 Mathew May <mathew.solutions>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// Define our standard lookups.
const selectors = {
    component: '.user-search',
    courseid: '[data-region="courseid"]',
    trigger: '.usersearchwidget',
    input: '[data-action="search"]',
    clearSearch: '[data-action="clearsearch"]',
    dropdown: '.usersearchdropdown',
    resultitems: '[role="option"]',
    viewall: '#select-all',
};

// DOM nodes that persist.
const component = document.querySelector(selectors.component);
const courseID = component.querySelector(selectors.courseid).dataset.courseid;
const searchInput = component.querySelector(selectors.input);
const searchDropdown = component.querySelector(selectors.dropdown);
const $searchButton = $(selectors.trigger);
const clearSearchButton = component.querySelector(selectors.clearSearch);

// Reused variables for the class.
const UP = -1;
const DOWN = 1;
const events = [
    'keydown',
    CustomEvents.events.activate,
    CustomEvents.events.keyboardActivate
];
let dataset = [];

/**
 * Set focus on a given node after parsed through the calling functions.
 *
 * @param {HTMLElement} node The node to set focus upon.
 */
const selectNode = (node) => {
    node.focus({ preventScroll: true });
    searchDropdown.scrollTop = node.offsetTop - (node.clientHeight / 2);
};

/**
 * Set the focus on the first node within the array.
 *
 * @param {Array} nodeArray The array of nodes that we want to specify a member to set focus upon.
 */
const moveToFirstNode = (nodeArray) => {
    if (nodeArray.length > 0) {
        selectNode(nodeArray[0]);
    }
};

/**
 * Set the focus to the final node within the array.
 *
 * @param {Array} nodeArray The array of nodes that we want to specify a member to set focus upon.
 */
const moveToLastNode = (nodeArray) => {
    if (nodeArray.length > 0) {
        selectNode(nodeArray[nodeArray.length - 1]);
    }
};

/**
 * Set focus on any given specified node within the node array.
 *
 * @param {Array} nodeArray The array of nodes that we want to specify a member to set focus upon.
 * @param {Number} index Which item within the array to set focus upon.
 */
const moveToNode = (nodeArray, index) => {
    if (nodeArray.length > 0) {
        selectNode(nodeArray[index]);
    }
};

/**
 * Build up the view all link.
 *
 * @param {String} searchTerm The current users' search term.
 * @param {Null|Number} userID The potential ID of the user selected.
 * @returns {string|*}
 */
const selectAllResultsLink = (searchTerm, userID = null) => {
    const params = {
        id: courseID,
        searchvalue: searchTerm
    };
    if (userID !== null) {
        params.userid = userID;
    }
    return Url.relativeUrl('/grade/report/grader/index.php', params, false);
};

/**
 * Build up the view all link that is dedicated to a particular result.
 *
 * @param {String} searchTerm The current users' search term.
 * @returns {Function|*}
 */
const selectOneLink = (searchTerm) => {
    return (userID = null) => {
        const params = {
            id: courseID,
            searchvalue: searchTerm
        };
        params.userid = userID;
        return Url.relativeUrl('/grade/report/grader/index.php', params, false);
    };
};

export default class GradebookSearchClass {
    // The results from the called filter function.
    matchedResults = [];

    // What did the user search for?
    searchTerm = '';

    // The DOM nodes after the dropdown render.
    resultNodes = [];

    // Where does the user currently have focus?
    currentNode = null;

    // The current node for the view all link.
    currentViewAll = null;

    // The function defined by the caller that'll filter the dataset.
    filterFunction = null;

    // The function defined by the caller that mutates the results to indicate to the user what matched.
    filterFunctionIndicator = null;

    /**
     *
     * @param {Function} fetchFunc Call the passed function to populate the dataset.
     * @param {Function} filterFunc Call the passed function to filter the dataset.
     * @param {Function} filterMatchIndFunc Call the passed function to allow the caller to indicate how the dataset matched.
     */
    constructor(fetchFunc, filterFunc, filterMatchIndFunc) {
        // Assign the appropriate filter and indicator functions for this search.
        this.filterFunction = filterFunc;
        this.filterFunctionIndicator = filterMatchIndFunc;
        this.searchTerm = component.querySelector(selectors.input).value ?? '';

        // Grab the dataset via the passed in function that dicates what we are filtering.
        this.fetchDataset(fetchFunc);

        // Begin handling the base search component.
        this.registerClickHandlers();
        this.registerKeyHandlers();
        this.registerInputHandlers();
    }

    /**
     * When called, close the dropdown and reset the input field attributes.
     */
    closeSearch() {
        this.toggleDropdown();
        // Hide the "clear" search button search bar.
        clearSearchButton.classList.add('d-none');
        // Clear the entered search query in the search bar and hide the search results container.
        searchInput.value = "";
    }

    /**
     * These class members change when a new result set is rendered. So update for fresh data.
     */
    updateNodes() {
        this.resultNodes = [...component.querySelectorAll(selectors.resultitems)];
        this.currentNode = this.resultNodes.find(r => r.id === document.activeElement.id);
        this.currentViewAll = component.querySelector(selectors.viewall);
    }

    /**
     * Given we have been provided with a caller, grab the data ready to search.
     *
     * @param {Function} fetchFunc Call the curried function to populate the dataset.
     * @returns {Promise<void>}
     */
    async fetchDataset(fetchFunc) {
        dataset = await fetchFunc(courseID);
    }

    /**
     * Register clickable event listeners.
     */
    registerClickHandlers() {
        // Prevent the click triggering the dropdown.
        $searchButton.on('click', () => {
            this.toggleDropdown();
        });

        // Register click events.
        component.addEventListener('click', this.clickHandler.bind(this));

        // Since we are handling dropdowns manually, ensure we can close it when clicking off.
        document.addEventListener('click', (e) => {
            if (!e.target.closest(selectors.component) && searchDropdown.classList.contains('show')) {
                this.toggleDropdown();
            }
        });
    }

    /**
     * Register key event listeners.
     */
    registerKeyHandlers() {
        CustomEvents.define(document, events);

        // Register click events.
        events.forEach((event) => {
            component.addEventListener(event, this.keyHandler.bind(this));
        });
    }

    /**
     * Register input event listener for the text input area.
     */
    registerInputHandlers() {
        // Register & handle the text input.
        searchInput.addEventListener('input', debounce(async() => {
            this.searchTerm = searchInput.value;
            // We can also require a set amount of input before search.
            if (this.searchTerm === '') {
                this.toggleDropdown();
                // Hide the "clear" search button in the search bar.
                clearSearchButton.classList.add('d-none');
            } else {
                // Display the "clear" search button in the search bar.
                clearSearchButton.classList.remove('d-none');
                this.renderAndShow();
            }
        }, 300));
    }

    /**
     * A combo method to take the matching fields and render out the results.
     *
     * @returns {Promise<void>}
     */
    async renderAndShow() {
        // User has given something for us to filter against.
        this.matchedResults = this.filterDataset();
        // Replace the dropdown node contents and show the results.
        await this.renderDropdown(
            this.filterFunctionIndicator(
                this.matchedResults.slice(0, 20),
                selectOneLink(this.searchTerm),
                this.searchTerm
            )
        );
        // Set the dropdown to open.
        this.toggleDropdown(true);
    }

    /**
     * Filter the dataset to find if any of the fields include the string the user is searching for.
     *
     * @returns {Array} The results found for the given search term.
     */
    filterDataset() {
        return this.filterFunction(dataset, this.searchTerm);
    }

    /**
     * Build the content then replace the node.
     *
     * @param {Array} results The results of the dataset having its' matching indicators applied.
     */
    async renderDropdown(results) {
        const {html, js} = await Templates.renderForPromise('gradereport_grader/search/resultset', {
            users: results,
            hasusers: results.length > 0,
            total: dataset.length,
            found: results.length,
            searchterm: this.searchTerm,
            selectall: selectAllResultsLink(this.searchTerm),
        });
        Templates.replaceNodeContents(searchDropdown, html, js);
    }

    /**
     * When called, update the dropdown fields.
     *
     * @param {Boolean} on Flag to toggle hiding or showing values.
     */
    toggleDropdown(on = false) {
        $(component).dropdown('toggle');
        $searchButton.attr('aria-expanded', on);
        if (on) {
            searchDropdown.classList.add('show');
            $(searchDropdown).show();
        } else {
            searchDropdown.classList.remove('show');
            $(searchDropdown).hide();
        }
    }

    /**
     * Set the current focus either on the preceding or next result item.
     *
     * @param {Number} direction Is the user moving up or down the resultset?
     * @param {Event} e The JS event from the event handler.
     */
    keyUpDown(direction, e) {
        e.preventDefault();
        // Stop Bootstrap from being clever.
        e.stopPropagation();
        // Current focus is on the input box so depending on direction, go to the top or the bottom of the displayed results.
        if (document.activeElement === searchInput && this.resultNodes.length > 0) {
            if (direction === UP) {
                moveToLastNode(this.resultNodes);
            } else {
                moveToFirstNode(this.resultNodes);
            }
        }
        const index = this.resultNodes.indexOf(this.currentNode);
        if (this.currentNode) {
            if (direction === UP) {
                if (index === 0) {
                    moveToLastNode(this.resultNodes);
                } else {
                    moveToNode(this.resultNodes, index - 1);
                }
            } else {
                if (index + 1 >= this.resultNodes.length) {
                    moveToFirstNode(this.resultNodes);
                } else {
                    moveToNode(this.resultNodes, index + 1);
                }
            }
        }
    }

    /**
     * The handler for when a user interacts with the component.
     *
     * @param {Event} e The triggering event that we are working with.
     */
    clickHandler(e) {
        this.updateNodes();

        // Prevent normal key presses activating this.
        if (e.target.closest('.dropdown-item') && e.button === 0) {
            window.location = e.target.closest('.dropdown-item').href;
        }
        if (e.target === this.currentViewAll && e.button === 0) {
            window.location = selectAllResultsLink(this.searchTerm);
        }
        // The "clear search" button is triggered.
        if (e.target.closest(selectors.clearSearch) && e.button === 0) {
            this.closeSearch();
            searchInput.focus({preventScroll: true});
        }

        // User may have accidentally clicked off the dropdown and wants to reopen it.
        if (e.target.closest(selectors.input) && this.searchTerm !== '' && e.button === 0) {
            this.renderAndShow();
        }
    }

    /**
     * The handler for when a user presses a key within the component.
     *
     * @param {Event} e The triggering event that we are working with.
     */
    keyHandler(e) {
        this.updateNodes();

        if (e.target === this.currentViewAll && (e.key === 'Enter' || e.key === 'Space')) {
            window.location = selectAllResultsLink(this.searchTerm);
        }

        // Switch the key presses to handle keyboard nav.
        switch (e.key) {
            case 'ArrowUp':
                this.keyUpDown(UP, e);
                break;
            case 'ArrowDown':
                this.keyUpDown(DOWN, e);
                break;
            case 'Home':
                e.preventDefault();
                moveToFirstNode(this.resultNodes);
                break;
            case 'End':
                e.preventDefault();
                moveToLastNode(this.resultNodes);
                break;
            case 'Escape':
                this.toggleDropdown();
                searchInput.focus({preventScroll: true});
                break;
            case 'Enter':
            case ' ':
                if (document.activeElement === searchInput) {
                    if (e.key === ' ') {
                        break;
                    } else {
                        window.location = selectAllResultsLink(this.searchTerm);
                        break;
                    }
                }
                if (document.activeElement === clearSearchButton) {
                    this.closeSearch();
                    break;
                }
                e.preventDefault();
                window.location = e.target.closest('.dropdown-item').href;
                break;
            case 'Tab':
                // If the current focus is on clear search, then check if viewall exists then around tab to it.
                if (e.target.closest(selectors.clearSearch)) {
                    if (this.currentViewAll) {
                        e.preventDefault();
                        this.currentViewAll.focus({preventScroll: true});
                    } else {
                        this.closeSearch();
                    }
                }
                // If the current focus is on the view all link, then close the widget then set focus on the next tert nav item.
                if (e.target.closest(selectors.viewall)) {
                    this.closeSearch();
                }
                break;
        }
    }
}
