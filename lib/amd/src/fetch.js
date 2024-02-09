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
 * The core/fetch module allows you to make web service requests to the Moodle API.
 *
 * @module     core/fetch
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Cfg from 'core/config';

/**
 * Normalise the component name to remove the core_ prefix.
 *
 * @param {string} component
 * @returns {string}
 */
const normaliseComponent = (component) => component.replace(/^core_/, '');

/**
 * Get the Request object for a given API request.
 *
 * @param {string} component The frankenstyle component name
 * @param {string} endpoint The endpoint within the componet to call
 * @param {object} params The parameters to pass to the API
 * @param {string} method The HTTP method to use
 * @returns 
 */
const getRequest = (
    component,
    endpoint,
    params,
    method,
) => {
    const url = new URL(`${Cfg.apibase}rest/v2/${component}/${endpoint}`);
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (method === 'GET') {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }
    if (method === 'POST') {
        options.body = JSON.stringify(params);
    }

    return new Request(url, options);
};

/**
 * Make a request to the Moodle API.
 *
 * @param {string} component The frankenstyle component name
 * @param {string} action The component action to perform
 * @param {object} params The parameters to pass to the API
 * @param {string} method The HTTP method to use
 * @returns {Promise<object>}
 */
export default async (
    component,
    action,
    params = {},
    method = 'GET',
) => {
    const result = await fetch(
        getRequest(
            normaliseComponent(component),
            action,
            params,
            method,
        ),
    );

    if (result.ok) {
        return result.json();
    }

    throw new Error(result.statusText);
};
