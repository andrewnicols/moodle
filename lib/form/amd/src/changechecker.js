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
 * Form Content change detection.
 *
 * @module     core/form/changechecker
 * @package    core
 * @copyright  2020 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {eventTypes} from 'core_editor/events';
import {get_string as getString} from 'core/str';

/** @var {Bool} Whether the change checker has been initialised */
let initialised = false;

/** @var {String} The warning string to show on form  change failure */
let warningString;

/** @var {Array} The list of watched forms */
let watchedForms = [];

/** @var {Bool} Whether the form change checker has been actively disabled */
let formChangeCheckerDisabled = false;

/**
 * Get the nearest form element from a child element.
 *
 * @param {HTMLElement} formChild
 * @returns {HTMLFormElement|null}
 */
const getFormFromChild = formChild => formChild.closest('form');

/**
 * Watch the specified form for changes.
 *
 * @param   {HTMLElement} formNode
 */
export const watchForm = formNode => {
    // Normalise the formNode.
    formNode = getFormFromChild(formNode);

    if (!formNode) {
         // No form found.
         return;
    }

    if (isWatchingForm(formNode)) {
        // This form is already watched.
        return;
    }

    watchedForms.push(formNode);
};

/**
 * Watch the form matching the specified ID for changes.
 *
 * @param   {String} formId
 */
export const watchFormById = formId => {
    watchForm(document.querySelector(`#${formId}`));
};

/**
 * Stop watching the specified form for changes.
 *
 * @param   {HTMLElement} formNode
 */
export const unWatchForm = formNode => {
    // Normalise the formNode.
    formNode = getFormFromChild(formNode);

    if (!formNode) {
         // No form found.
         return;
    }

    watchedForms = watchedForms.filter(watchedForm => !!watchedForm.contains(formNode));
};

/**
 * Reset all form dirty states.
 */
export const resetAllFormDirtyStates = () => {
    watchedForms.forEach(watchedForm => {
        watchedForm.dataset.formSubmitted = "false";
        watchedForm.dataset.formDirty = "false";
    });
};

/**
 * Reset the dirty state of the specified form.
 *
 * @param   {HTMLElement} formNode
 */
export const resetFormDirtyState = formNode => {
    // Normalise the formNode.
    formNode = getFormFromChild(formNode);

    if (!formNode) {
         // No form found.
         return;
    }

    formNode.dataset.formSubmitted = "false";
    formNode.dataset.formDirty = "false";
};

/**
 * Reset the dirty state of the form matching the specified ID..
 *
 * @param   {String} formId
 */
export const resetFormDirtyStateById = formId => {
    resetFormDirtyState(document.querySelector(`#${formId}`));
};

/**
 * Mark all forms as dirty.
 *
 * This function is only for backwards-compliance with the old YUI module and should not beused in any other situation.
 * It will be removed in Moodle 4.3.
 */
export const markAllFormsAsDirty = () => {
    watchedForms.forEach(watchedForm => {
        watchedForm.dataset.formDirty = "true";
    });
};

/**
 * Mark a specific form as dirty.
 *
 * @param   {HTMLElement} formNode
 */
export const markFormAsDirty = formNode => {
    // Normalise the formNode.
    formNode = getFormFromChild(formNode);

    if (!formNode) {
         // No form found.
         return;
    }

    // Mark it as dirty.
    formNode.dataset.formDirty = "true";
};

/**
 * Mark the form matching the specified ID as dirty.
 *
 * @param   {String} formId
 */
export const markFormAsDirtyById = formId => {
    markFormAsDirty(document.querySelector(`#${formId}`));
};

/**
 * Actively disable the form change checker.
 *
 * Please note that it cannot be re-enabled once disabled.
 */
export const disableAllChecks = () => {
    formChangeCheckerDisabled = true;
};

/**
 * Check whether any watched from is dirty.
 *
 * @returns {Bool}
 */
const isAnyWatchedFormDirty = () => {
    if (formChangeCheckerDisabled) {
        // The form change checker is disabled.
        return false;
    }

    const hasSubmittedForm = watchedForms.some(watchedForm => watchedForm.dataset.formSubmitted != "false");
    if (hasSubmittedForm) {
        // Do not warn about submitted forms, ever.
        return false;
    }

    const hasDirtyForm = watchedForms.some(watchedForm => {
        if (!watchedForm.isConnected) {
            // The watched form is not connected to the DOM.
            return false;
        }

        if (watchedForm.dataset.formDirty !== "false") {
            // The form has been marked as dirty.
            return true;
        }

        // Elements currently holding focus will not have triggered change detection.
        // Check whether the value matches the original value upon form load.
        if (document.activeElement && document.activeElement.dataset.propertyIsEnumerable('initialValue')) {
            const isActiveElementWatched = isWatchingForm(document.activeElement);
            const hasValueChanged = document.activeElement.dataset.initialValue !== document.activeElement.value;

            if (isActiveElementWatched && hasValueChanged) {
                return true;
            }
        }

        return false;
    });

    if (hasDirtyForm) {
        // At least one form is dirty.
        return true;
    }

    // Handle TinyMCE editor instances.
    // TinyMCE forms may not have been initialised at the time that startWatching is called.
    // Check whether any tinyMCE editor is dirty.
    if (typeof window.tinyMCE !== 'undefined') {
        if (window.tinyMCE.editors.some(editor => editor.isDirty())) {
            return true;
        }
    }

    // No dirty forms detected.
    return false;
};

/**
 * Get the watched form for the specified target.
 *
 * @param   {HTMLNode} target
 * @returns {HTMLFormElement}
 */
const getFormForNode = target => watchedForms.find(watchedForm => watchedForm.contains(target));

/**
 * Whether the specified target is a watched form.
 *
 * @param   {HTMLNode} target
 * @returns {Bool}
 */
const isWatchingForm = target => watchedForms.some(watchedForm => watchedForm.contains(target));

/**
 * Whether the specified target should ignore changes or not.
 *
 * @param   {HTMLNode} target
 * @returns {Bool}
 */
const shouldIgnoreChangesForNode = target => !!target.closest('.ignoredirty');

/**
 * Mark a form as changed.
 *
 * @param   {HTMLElement} changedNode An element in the form which was changed
 */
export const markFormChangedFromNode = changedNode => {
    if (changedNode.dataset.formChangeCheckerOverride) {
        // Changes to this form node disable the form change checker entirely.
        // This is intended for select fields which cause an immediate redirect.
        disableAllChecks();
        return;
    }

    if (!isWatchingForm(changedNode)) {
        // This form has not been watched.
        return;
    }

    if (shouldIgnoreChangesForNode(changedNode)) {
        // This node ignores changes.
        return;
    }

    const formNode = getFormForNode(changedNode);

    // Mark the form as dirty.
    formNode.dataset.formDirty = "true";
};

/**
 * Mark a form as submitted.
 *
 * @param   {HTMLElement} formNode An element in the form to mark as submitted
 */
export const markFormSubmitted = formNode => {
    // Normalise the formNode.
    formNode = getFormFromChild(formNode);

    if (!formNode) {
         // No form found.
         return;
    }

    formNode.dataset.formSubmitted = "true";
};

/**
 * Handle the beforeunload event.
 *
 * @param   {Event} e
 * @returns {string|null}
 */
const beforeUnloadHandler = e => {
    // Please note: The use of Promises in this function is forbidden.
    // This is an event handler and _cannot_ be asynchronous.
    let warnBeforeUnload = isAnyWatchedFormDirty() && !M.cfg.behatsiterunning;
    if (warnBeforeUnload) {
        // According to the specification, to show the confirmation dialog an event handler should call preventDefault()
        // on the event.
        e.preventDefault();

        // However note that not all browsers support this method, and some instead require the event handler to
        // implement one of two legacy methods:
        // * assigning a string to the event's returnValue property; and
        // * returning a string from the event handler.

        // Assigning a string to the event's returnValue property.
        e.returnValue = warningString;

        // Returning a string from the event handler.
        return e.returnValue;
    }

    // Attaching an event handler/listener to window or document's beforeunload event prevents browsers from using
    // in-memory page navigation caches, like Firefox's Back-Forward cache or WebKit's Page Cache.
    // Remove the handler.
    window.removeEventListener('beforeunload', beforeUnloadHandler);

    return null;
};

/**
 * Start watching for form changes.
 */
export const startWatching = () => {
    if (initialised) {
        return;
    }

    // Add legacy support to provide b/c for the old YUI version.
    addLegacyFunctions();

    document.addEventListener('change', e => {
        if (!isWatchingForm(e.target)) {
            return;
        }

        markFormChangedFromNode(e.target);
    });

    document.addEventListener('click', e => {
        const ignoredButton = e.target.closest('[data-formchangechecker-ignore-submit]');
        if (!ignoredButton) {
            return;
        }

        const ownerForm = getFormFromChild(e.target);
        if (ownerForm) {
            ownerForm.dataset.ignoreSubmission = "true";
        }
    });

    document.addEventListener('focusin', e => {
        if (e.target.matches('input, textarea, select')) {
            if (e.target.dataset.propertyIsEnumerable('initialValue')) {
                // The initial value has already been set.
                return;
            }
            e.target.dataset.initialValue = e.target.value;
        }
    });

    document.addEventListener('submit', e => {
        const formNode = getFormFromChild(e.target);
        if (!formNode) {
            // Weird, but watch for this anyway.
            return;
        }

        if (formNode.dataset.ignoreSubmission) {
            // This form was submitted by a button which requested that the form checked should not mark it as submitted.
            formNode.dataset.ignoreSubmission = "false";
            return;
        }

        markFormSubmitted(formNode);
    });

    document.addEventListener(eventTypes.editorContentRestored, e => {
        if (e.target != document) {
            resetFormDirtyState(e.target);
        } else {
            resetAllFormDirtyStates();
        }
    });

    getString('changesmadereallygoaway', 'moodle')
    .then(changesMadeString => {
        warningString = changesMadeString;
        return;
    })
    .catch();

    window.addEventListener('beforeunload', beforeUnloadHandler);
};

/**
 * Add legacy functions for backwards compatability.
 */
const addLegacyFunctions = () => {
    // Create a curried function to log use of the old function and provide detail on its replacement.
    const getLoggedLegacyFallback = (oldFunctionName, newFunctionName, newFunction) => (...args) => {
        window.console.warn(
            `The moodle-core-formchangechecker has been deprecated ` +
            `and replaced with core_form/changechecker. ` +
            `The ${oldFunctionName} function has been replaced with ${newFunctionName}.`
        );
        newFunction(...args);
    };

    /* eslint-disable */
    window.M.core_formchangechecker = {
        init: getLoggedLegacyFallback('init', 'watchFormById', watchFormById),
        reset_form_dirty_state: getLoggedLegacyFallback('reset_form_dirty_state', 'resetAllFormDirtyStates', resetAllFormDirtyStates),
        set_form_changed: getLoggedLegacyFallback('set_form_changed', 'markAllFormsAsDirty', markAllFormsAsDirty),
        set_form_submitted: getLoggedLegacyFallback('set_form_submitted', 'markFormSubmitted', markFormSubmitted),
    };
    /* eslint-enable */
};

// Configure all event listeners.
startWatching();
