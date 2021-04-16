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

define(['jquery', 'core/str', 'core/ajax', 'core/templates'], function ($, str, ajax, templates) {
    /**
     * The error data for all sections in the course.
     * @type {Object[]}
     */
    var sections;
    /**
     * The error data for all modules in the course.
     * @type {Object[]}
     */
    var modules;
    /**
     * The minimum error count for sections/modules.
     * @type {number}
     */
    var mindata;
    /**
     * The difference between the minimum and maximum error count for sections/modules.
     * @type {number}
     */
    var diffdata = 0;
    /**
     * The number of colours used to represent the heatmap. (Indexed on 0.)
     * @type {number}
     */
    var numColours = 2;
    /**
     * The toggle state of the heatmap.
     * @type {boolean}
     */
    var toggleState = true;
    /**
     * The display icon for failing modules/sections.
     * @type {string}
     */
    var errorsicon = '';
    /**
     * The display icon for passing modules/sections.
     * @type {string}
     */
    var passicon = '';
    /**
     * The config information representing the format to display the error data.
     * @type {string}
     */
    let whattoshowdata;
    /**
     * The required strings for the module.
     * @type {string[]}
     */
    let strings = {};

    /**
     * Gets the required strings for the module.
     */
    const getStrings = () => {
        let requiredStrings = [
            { key: 'passed', component: 'tool_brickfield' },
            { key: 'failed', component: 'tool_brickfield' },
            { key: 'errors', component: 'block_accessreview' },
            { key: 'percenterrors', component: 'block_accessreview' },
            { key: 'success' },
        ];
        return str.get_strings(requiredStrings).then((values) => {
            strings.passed = values[0];
            strings.failed = values[1];
            strings.errors = values[2];
            strings.percenterrors = values[3];
            strings.success = values[4];
        });
    };

    /**
     * Renders the HTML template onto a particular HTML element.
     * @param {HTMLElement} element The element to attach the HTML to.
     * @param {number} numerrors The number of errors on this module/section.
     * @param {number} numchecks The number of checks triggered on this module/section.
     */
    function renderTemplate(element, numerrors, numchecks) {
        let weight = parseInt((numerrors - mindata) / diffdata * numColours);
        let alertstatus = 'block_accessreview_success';
        if (weight < 1) { alertstatus = 'block_accessreview_warning'; }
        if (weight >= 1) { alertstatus = 'block_accessreview_danger'; }
        if (numerrors == 0) { alertstatus = 'block_accessreview_success'; }
        if (element) {
            if (whattoshowdata != 'showicons') {
                if (element.className.search("label") >= 1) {
                    alertstatus += '_label';
                }
                element.className += ' alert ' + alertstatus;
            }
            if (whattoshowdata != 'showbackground') {
                var divclass = 'block_accessreview_view';
                if (element.className.search("label") > -1) {
                    divclass += ' alert ' + alertstatus;
                }
                let info = '<div class="' + divclass + '">';
                if (numerrors == 0) {
                    info += passicon;
                    info += strings.passed;
                } else {
                    info += errorsicon;
                    info += strings.failed;
                    info += '&nbsp;&nbsp;';
                    info += numerrors;
                    info += '&nbsp;' + strings.errors;
                    info += '&nbsp;&nbsp;';
                    info += Math.round((numerrors / numchecks) * 100);
                    info += strings.percenterrors;
                }
                info += '</div>';
                element.insertAdjacentHTML('beforeend', info);
            }
        }
    }

    /**
     * Applies the template to all sections and modules on the course page.
     */
    function showAccessmap() {
        sections.forEach((section) => {
            let element = document.getElementById('section-' + section.section).getElementsByClassName("summary")[0];
            if (element !== null) {
                renderTemplate(element, section.numerrors, section.numchecks);
            }
        });
        modules.forEach((module) => {
            let element = document.getElementById('module-' + module.cmid);
            if (element !== null) {
                renderTemplate(element, module.numerrors, module.numchecks);
            }
        });
    }

    /**
     * Hides or removes the templates from the HTML of the current page.
     */
    function hideAccessmap() {
        // Removes the added elements.
        $(".block_accessreview_view").remove();
        // Removes the added classes.
        $("*").removeClass ((_, className) => {
            return (className.match (/(^|\s)alert block_accessreview\S+/g) || []).join(' ');
        });
    }

    /**
     * Toggles the heatmap on/off.
     */
    const toggleAccessmap = async () => {
        if (toggleState) {
            hideAccessmap();
        } else {
            showAccessmap();
        }

        toggleState = !toggleState;

        await ajax.call([{
            methodname: 'block_accessreview_set_toggle_preference',
            args: { toggle: toggleState }
        }])[0];
    };

    /**
     * Parses information on the errors, generating the min, max and totals.
     * @param {Object[]} sectiondata The error data for course sections.
     * @param {Object[]} moduledata The error data for course modules.
     * @returns {Object} An object representing the extra error information.
    */
    function get_error_totals(sectiondata, moduledata) {
        let totals = {
            totalerrors: 0,
            totalusers: 0,
            minviews: 0,
            maxviews: 0
        };

        let data = [];

        Array.prototype.push.apply(data, sectiondata);
        Array.prototype.push.apply(data, moduledata);

        data.forEach((item) => {
            totals.totalerrors += item.numerrors;
            if (item.numerrors < totals.minviews) {
                totals.minviews = item.numerrors;
            }
            if (item.numerrors > totals.maxviews) {
                totals.maxviews = item.numerrors;
            }
            totals.totalusers += item.numchecks;
        });

        return totals;
    }

    return {
        /**
        * Setting up the access review module.
        * @param {number} toggled A number represnting the state of the review toggle.
        * @param {string} whattoshow A string representing the display format for icons.
        * @param {number} courseid The course ID.
        */
        init: async function (toggled, whattoshow, courseid) {
            // Ajax calls.
            let promises = ajax.call([
                {
                    methodname: 'block_accessreview_get_module_data',
                    args: { courseid: courseid }
                },
                {
                    methodname: 'block_accessreview_get_section_data',
                    args: { courseid: courseid }
                }
            ]);
            // Core/str calls.
            let stringpromise = getStrings();
            // Settings vars.
            toggleState = toggled == 1;
            whattoshowdata = whattoshow;
            // Get error data.
            modules = await promises[0];
            sections = await promises[1];
            // Get total data.
            let totals = get_error_totals(sections, modules);
            mindata = totals['minviews'];
            diffdata = totals['maxviews'] - totals['minviews'] + 1;
            // Load strings.
            await stringpromise;
            // Load icons.
            passicon = await templates.renderPix('t/check', 'core', strings.success);
            errorsicon = await templates.renderPix('t/block', 'core', strings.errors);

            if (toggleState) {
                showAccessmap();
            }
            // Apply the click event.
            $('#toggle-accessmap').click(() => {
                toggleAccessmap();
            });
        }
    };
});
