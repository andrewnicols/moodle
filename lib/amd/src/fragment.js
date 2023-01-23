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
 * A way to call HTML fragments to be inserted as required via JavaScript.
 *
 * @module     core/fragment
 * @copyright  2016 Adrian Greeve <adrian@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @since      3.1
 */
import $ from 'jquery';
import {fetchOne} from 'core/fetch';
import {getList} from 'core/normalise';

const formatParams = (params) => {
    if (params === null) {
        return [];
    }

    if (typeof params === 'object') {
        return Array.from(Object.entries(params));
    }

    return [];
};

/**
 * Loads an HTML fragment through a callback.
 *
 * @param {string} component Component where callback is located.
 * @param {string} callback Callback function name.
 * @param {integer} contextid Context ID of the fragment.
 * @param {object} params Parameters for the callback.
 * @return {Promise} JQuery promise object resolved when the fragment has been loaded.
 */
const innerLoadFragment = (component, callback, contextid, params) => {
    // Change params into required webservice format.
    const args = formatParams(params).map(([name, value]) => ({
        name,
        value,
    }));

    return fetchOne('core_get_fragment', {
        component,
        callback,
        contextid,
        args,
    });
};

/**
 * Converts the JS that was received from collecting JS requirements on the $PAGE so it can be added to the existing page
 *
 * @param {string} js
 * @returns {string}
 */
const processCollectedJavascript = (js) => {
    const nodes = getList($(js));
    return nodes.map((scriptNode) => {
        const tagName = scriptNode.tagName?.toLowerCase();
        if (!tagName || tagName !== 'script') {
            return null;
        }

        if (!scriptNode.hasAttribute('src')) {
            return scriptNode.text;
        }

        const anyScriptMatches = () => {
            return Array.from([...document.querySelectorAll('script')]).some((script) => {
                return script.getAttribute('src') === scriptNode.getAttribute('src');
            });
        };

        if (anyScriptMatches()) {
            return null;
        }
        return `{
            node = document.createElement('script');
            node.type = 'text/javascript';
            node.src = decodeURI("${encodeURI(scriptNode.getAttribute('src'))}");
            document.getElementsByTagName('head')[0].appendChild(node);
        }`;
    })
    .filter((script) => !!script)
    .join(' ');
};

/**
 * Appends HTML and JavaScript fragments to specified nodes.
 * Callbacks called by this AMD module are responsible for doing the appropriate security checks
 * to access the information that is returned. This only does minimal validation on the context.
 *
 * @method fragmentAppend
 * @param {string} component Component where callback is located.
 * @param {string} callback Callback function name.
 * @param {integer} contextid Context ID of the fragment.
 * @param {object} params Parameters for the callback.
 * @return {Deferred} new promise that is resolved with the html and js.
 */
const loadFragment = (component, callback, contextid, params) => {
    const promise = $.Deferred();

    innerLoadFragment(component, callback, contextid, params)
    .then(({html, javascript}) => {
        return promise.resolve(html, processCollectedJavascript(javascript));
    })
    .catch((error) => {
        promise.reject(error);
    });

    return promise.promise();
};

export default {
    processCollectedJavascript,
    loadFragment,
};
