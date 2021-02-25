// This file is part of Moodle - http://moodle.org/ //
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
 * Global registry of core events that can be triggered/listened for.
 *
 * @module     core/event
 * @package    core
 * @class      event
 * @copyright  2015 Damyon Wiese <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      3.0
 */

import {dispatchEvent} from 'core/local/event/dispatcher';
import {notifyEditorContentRestored} from 'core_editor/events';
import {notifyFilterContentUpdated} from 'core_filters/events';
import {notifyFormSubmittedByJavascript} from 'core_form/events';

// These are only imported for legacy.
import $ from 'jquery';
import Y from 'core/yui';

// These are AMD only events - no backwards compatibility for new things.
// Note: No new events should be created here.
const Events = {
    FORM_FIELD_VALIDATION: "core_form-field-validation"
};

/**
 * Load the legacy YUI module which defines events in M.core.event and return it.
 *
 * @method getLegacyEvents
 * @return {Promise}
 * @deprecated
 */
const getLegacyEvents = () => {
    window.console.warn("The getLegacyEvents function has been deprecated. Please update your code to use native events.");

    var result = $.Deferred();
    Y.use('event', 'moodle-core-event', function() {
        result.resolve(window.M.core.event);
    });
    return result.promise();
};

/**
 * Get a curried function to warn that a function has been moved and renamed
 *
 * @param   {string} oldFunctionName
 * @param   {string} newModule
 * @param   {string} newFunctionName
 * @param   {Function} newFunctionRef
 * @returns {Function}
 */
const getCurriedRenamedFunction = (oldFunctionName, newModule, newFunctionName, newFunctionRef) => (...args) => {
    window.console.warn(
        `The core/event::${oldFunctionName}() function has been moved to ${newModule}::${newFunctionName}. ` +
        `Please update your code to use the new module.`
    );

    return newFunctionRef(...args);
};

export default {
    Events,
    dispatchEvent,
    getLegacyEvents,

    notifyEditorContentRestored: getCurriedRenamedFunction(
        'notifyEditorContentRestored',
        'core_editor/events',
        'notifyEditorContentRestored',
        notifyEditorContentRestored
    ),

    notifyFilterContentUpdated: getCurriedRenamedFunction(
        'notifyFilterContentUpdated',
        'core_filters/events',
        'notifyFilterContentUpdated',
        notifyFilterContentUpdated
    ),

    notifyFormSubmitAjax: getCurriedRenamedFunction(
        'notifyFormSubmitAjax',
        'core_form/events',
        'notifyFormSubmittedByJavascript',
        notifyFormSubmittedByJavascript
    ),
};
