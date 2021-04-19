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
 *
 * @package     block_accessreview
 * @author      Max Larkin <max@brickfieldlabs.ie>
 * @copyright   2020 Brickfield Education Labs <max@brickfieldlabs.ie>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {get_strings as getStrings} from 'core/str';
import {call as fetchMany} from 'core/ajax';
import * as Templates from 'core/templates';

/**
 * The number of colours used to represent the heatmap. (Indexed on 0.)
 * @type {number}
 */
const numColours = 2;

/**
 * The toggle state of the heatmap.
 * @type {boolean}
 */
let toggleState = true;

/**
 * The display icon for failing modules/sections.
 * @type {string}
 */
let errorsicon = '';

/**
 * The display icon for passing modules/sections.
 * @type {string}
 */
let passicon = '';

/**
 * The required strings for the module.
 * @type {string[]}
 */
let strings = {};

/**
 * Gets the required strings for the module.
 */
const getModuleStrings = () => {
    let requiredStrings = [
        {key: 'passed', component: 'tool_brickfield'},
        {key: 'failed', component: 'tool_brickfield'},
        {key: 'errors', component: 'block_accessreview'},
        {key: 'percenterrors', component: 'block_accessreview'},
        {key: 'success'},
    ];
    getStrings(requiredStrings).then(values => {
        strings.passed = values[0];
        strings.failed = values[1];
        strings.errors = values[2];
        strings.percenterrors = values[3];
        strings.success = values[4];

        return values;
    })
    .catch();
};

/**
 * Renders the HTML template onto a particular HTML element.
 * @param {HTMLElement} element The element to attach the HTML to.
 * @param {number} numErrors The number of errors on this module/section.
 * @param {number} numChecks The number of checks triggered on this module/section.
 * @param {String} displayFormat
 * @param {Number} minViews
 * @param {Number} viewDelta
 */
const renderTemplate = (element, numErrors, numChecks, displayFormat, minViews, viewDelta) => {
    // TODO Convert this to be an actual proper template.
    let weight = parseInt((numErrors - minViews) / viewDelta * numColours);
    let alertstatus = 'block_accessreview_success';
    if (weight < 1) {
        alertstatus = 'block_accessreview_warning';
    }
    if (weight >= 1) {
        alertstatus = 'block_accessreview_danger';
    }
    if (numErrors == 0) {
        alertstatus = 'block_accessreview_success';
    }
    if (element) {
        if (displayFormat != 'showicons') {
            if (element.className.search("label") >= 1) {
                alertstatus += '_label';
            }
            element.className += ' alert block_accessreview ' + alertstatus;
        }
        if (displayFormat != 'showbackground') {
            let divclass = 'block_accessreview_view';
            if (element.className.search("label") > -1) {
                divclass += ' alert ' + alertstatus;
            }
            let info = '<div class="' + divclass + '">';
            if (numErrors == 0) {
                info += passicon;
                info += strings.passed;
            } else {
                info += errorsicon;
                info += strings.failed;
                info += '&nbsp;&nbsp;';
                info += numErrors;
                info += '&nbsp;' + strings.errors;
                info += '&nbsp;&nbsp;';
                info += Math.round((numErrors / numChecks) * 100);
                info += strings.percenterrors;
            }
            info += '</div>';
            element.insertAdjacentHTML('beforeend', info);
        }
    }
};

/**
 * Applies the template to all sections and modules on the course page.
 *
 * @param {Number} courseId
 * @param {String} displayFormat
 */
const showAccessMap = async(courseId, displayFormat) => {
    // Get error data.
    const [sectionData, moduleData] = await Promise.all(fetchReviewData(courseId));

    // Get total data.
    const {minViews, viewDelta} = getErrorTotals(sectionData, moduleData);

    sectionData.forEach(section => {
        const element = document.querySelector(`#section-${section.section} .summary`);
        if (!element) {
            return;
        }

        renderTemplate(element, section.numerrors, section.numchecks, displayFormat, minViews, viewDelta);
    });

    moduleData.forEach(module => {
        const element = document.getElementById(`module-${module.cmid}`);
        if (!element) {
            return;
        }

        renderTemplate(element, module.numerrors, module.numchecks, displayFormat, minViews, viewDelta);
    });
};


/**
 * Hides or removes the templates from the HTML of the current page.
 */
const hideAccessMap = () => {
    // Removes the added elements.
    document.querySelectorAll('.block_accessreview_view').forEach(node => node.remove());

    const classList = [
        'alert',
        'block_accessreview',
        'block_accessreview_success',
        'block_accessreview_warning',
        'block_accessreview_danger',
        'block_accessreview_view',
        'block_accessreview_success_label',
        'block_accessreview_warning_label',
        'block_accessreview_danger_label',
        'block_accessreview_view_label',
    ];

    // Removes the added classes.
    document.querySelectorAll('.block_accessreview.alert').forEach(node => node.classList.remove(...classList));
};


/**
 * Toggles the heatmap on/off.
 *
 * @param {Number} courseId
 * @param {String} displayFormat
 */
const toggleAccessMap = (courseId, displayFormat) => {
    if (toggleState) {
        hideAccessMap();
    } else {
        showAccessMap(courseId, displayFormat);
    }

    toggleState = !toggleState;
    fetchMany([{
        methodname: 'block_accessreview_set_toggle_preference',
        args: {toggle: toggleState}
    }]);
};

/**
 * Parses information on the errors, generating the min, max and totals.
 *
 * @param {Object[]} sectionData The error data for course sections.
 * @param {Object[]} moduleData The error data for course modules.
 * @returns {Object} An object representing the extra error information.
*/
const getErrorTotals = (sectionData, moduleData) => {
    const totals = {
        totalErrors: 0,
        totalUsers: 0,
        minViews: 0,
        maxViews: 0,
        viewDelta: 0,
    };

    [].concat(sectionData, moduleData).forEach(item => {
        totals.totalErrors += item.numerrors;
        if (item.numerrors < totals.minViews) {
            totals.minViews = item.numerrors;
        }

        if (item.numerrors > totals.maxViews) {
            totals.maxViews = item.numerrors;
        }
        totals.totalUsers += item.numchecks;
    });

    totals.viewDelta = totals.maxViews - totals.minViews + 1;

    return totals;
};

const registerEventListeners = (courseId, displayFormat) => {
    document.addEventListener('click', e => {
        if (e.target.closest('#toggle-accessmap')) {
            e.preventDefault();
            toggleAccessMap(courseId, displayFormat);
        }
    });
};

/**
 * Fetch the review data.
 *
 * @param   {Number} courseid
 * @returns {Promise[]}
 */
const fetchReviewData = courseid => fetchMany([
    {
        methodname: 'block_accessreview_get_section_data',
        args: {courseid}
    },
    {
        methodname: 'block_accessreview_get_module_data',
        args: {courseid}
    },
]);

/**
 * Setting up the access review module.
 * @param {number} toggled A number represnting the state of the review toggle.
 * @param {string} displayFormat A string representing the display format for icons.
 * @param {number} courseId The course ID.
 */
export const init = async(toggled, displayFormat, courseId) => {
    // Settings consts.
    //
    toggleState = toggled == 1;

    // TODO: Replace all of this with a template...
    // __None__ of this should be stored as instance vars.
    // The over-use of await is a bad thing here because _none_ of these are being checked for errors.
    // async promise use should usually be in a try/catch, and none of the ones here are necessary.

    // Core/str calls.
    let stringpromise = getModuleStrings();

    // Load strings.
    await stringpromise;

    // Load icons.
    passicon = await Templates.renderPix('t/check', 'core', strings.success);
    errorsicon = await Templates.renderPix('t/block', 'core', strings.errors);

    if (toggleState) {
        showAccessMap(courseId, displayFormat);
    }

    registerEventListeners(courseId, displayFormat);
};
