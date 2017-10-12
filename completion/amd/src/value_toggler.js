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
 * Value toggler.
 *
 * @package    core_completion
 * @copyright  2017 Frédéric Massart <fred@branchup.tech>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define(['jquery'], function($) {
    function nextValue(values, after) {
        var idx = values.indexOf(after);
        if (idx >= values.length - 1) {
            idx = -1;
        }
        return values[idx + 1];
    }

    /**
     * Init.
     *
     * @param {String} triggerselector The CSS selector for the click trigger.
     * @param {String} selector The CSS selector for the fields to set the value on.
     * @param {Array} values Array of values to toggle between.
     * @return {Void}
     */
    var init = function(triggerselector, selector, values) {
        var lastValue;

        $(triggerselector).click(function(e) {
            e.preventDefault();
            var newValue = nextValue(values, lastValue);
            $(selector).val(newValue);
            lastValue = newValue;
        });
    };

    return {
        init: init
    };
});
