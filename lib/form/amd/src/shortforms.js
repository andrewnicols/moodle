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

import {eventTypes} from './events';

const classList = {
    collapsedFieldset: 'collapsed',
    collapseAll: 'collapse-all',
};

const selectors = {
    collapsableFieldsets: 'fieldset.collapsible',
    toggleAllLink: '[data-action="core_form-shortforms-toggleall"]',
    toggleSectionLink: '[data-action="core_form-shortforms-toggle-section"]',
};

/**
 * Get the nearest form element from a child element.
 *
 * @param {HTMLElement} formChild
 * @returns {HTMLFormElement|null}
 */
const getFormFromChild = formChild => formChild.closest('form');

/**
 * Get the nearest fieldset element from a child element.
 *
 * @param {HTMLElement} fieldsetChild
 * @returns {HTMLFieldSetElement|null}
 */
const getFieldsetFromChild = fieldsetChild => fieldsetChild.closest('fieldset');

/**
 * Set the expanded state for a fieldset based on its nearest child.
 *
 * @param   {HTMLElement} element
 * @param   {bool} open
 */
const setExpandedState = (element, open) => {
    const fieldset = getFieldsetFromChild(element);
    const statusElement = fieldset.form.querySelector(`input[name=mform_isexpanded_${fieldset.id}]`);

    if (open) {
        fieldset.classList.remove(classList.collapsedFieldset);
        fieldset.setAttribute('aria-expanded', 'true');
    } else {
        fieldset.classList.add(classList.collapsedFieldset);
        fieldset.setAttribute('aria-expanded', 'false');
    }

    if (statusElement) {
        statusElement.value = open ? 1 : 0;
    }
};

/**
 * Update the toggle all buttons to reflect the correct state.
 *
 * If any fieldset is currently collapsed, then the text will be updated to expand all.
 * If all fieldsets are expanded, then the toggle will be updated to collapse all.
 *
 * @param   {HTMLElement} element
 */
const updateToggleAllState = element => {
    const form = getFormFromChild(element);

    // If any fieldset is not aria-expanded, then show 'Expand all', otherwise show 'Collapse all'.
    const anyCollapsed = Array.from(form.querySelectorAll(selectors.toggleSectionLink)).some(toggle => {
        return toggle.closest('fieldset').getAttribute('aria-expanded') !== 'true';
    });

    const toggleAllLinks = form.querySelectorAll(selectors.toggleAllLink);

    if (anyCollapsed) {
        form.dataset.toggleState = 'closed';
        toggleAllLinks.forEach(link => {
            link.innerHTML = link.dataset.expandallstring;
            link.classList.remove(classList.collapseAll);
        });

    } else {
        form.dataset.toggleState = 'open';
        toggleAllLinks.forEach(link => {
            link.innerHTML = link.dataset.collapseallstring;
            link.classList.add(classList.collapseAll);
        });
    }
};

/**
 * Set the expanded state for all fieldsets in a form.
 *
 * @param   {HTMLElement} element
 * @param   {bool} open
 */
const setExpandedStates = (element, open) => {
    const form = getFormFromChild(element);

    form.querySelectorAll(selectors.collapsableFieldsets).forEach(fieldset => setExpandedState(fieldset, open));

    // Update all toggle links for this form.
    updateToggleAllState(form);
};

/**
 * Expand all fieldsets in a form.
 *
 * @param   {HTMLElement} form
 * @returns {void}
 */
export const expandForm = form => setExpandedStates(form, true);

/**
 * Collapse all fieldsets in a form.
 *
 * @param   {HTMLElement} form
 * @returns {void}
 */
export const collapseForm = form => setExpandedStates(form, false);

/**
 * Expand the specified fieldset.
 *
 * @param   {HTMLElement} element
 * @returns {void}
 */
export const expandFieldset = element => {
    setExpandedState(element, true);

    // Update all toggle links for this form.
    updateToggleAllState(element);
};

/**
 * Collapse all fieldsets in a form.
 *
 * @param   {HTMLElement} element
 */
export const collapseFieldset = element => {
    setExpandedState(element, false);

    // Update all toggle links for this form.
    updateToggleAllState(element);
};


/**
 * Toggle the state of a specific fieldset.
 *
 * @param   {HTMLElement} element
 */
export const toggleFieldset = element => {
    const fieldset = getFieldsetFromChild(element);
    setExpandedState(fieldset, fieldset.getAttribute('aria-expanded') === 'false');

    // Update all toggle links for this form.
    updateToggleAllState(fieldset);
};


/**
 * The event listener for all shortforms links.
 *
 * @param   {Event} e
 */
const handleToggleClick = e => {
    const toggleAllLink = e.target.closest(selectors.toggleAllLink);
    if (toggleAllLink) {
        const form = getFormFromChild(toggleAllLink);
        if (!form) {
            // This link is not in a form.
            return;
        }

        e.preventDefault();
        if (form.dataset.toggleState === 'open') {
            collapseForm(form);
            form.dataset.toggleState = 'closed';
        } else {
            expandForm(form);
            form.dataset.toggleState = 'open';
        }
    }

    const toggleSectionLink = e.target.closest(selectors.toggleSectionLink);
    if (toggleSectionLink) {
        e.preventDefault();
        toggleFieldset(toggleSectionLink);
        updateToggleAllState(toggleSectionLink);
    }
};

/**
 * The event listener for handling form errors.
 *
 * @param   {Event} e
 */
const handleFormError = e => {
    const element = getFieldsetFromChild(e.target);
    if (element) {
        expandFieldset(element);
        return;
    }
};

let initialised = false;

/**
 * Initialiser for the module.
 *
 * Note: This module can only be initialised once per page load.
 */
export const init = () => {
    if (initialised) {
        return;
    }
    initialised = true;

    document.addEventListener('click', handleToggleClick);
    document.addEventListener(eventTypes.formError, handleFormError);
};
