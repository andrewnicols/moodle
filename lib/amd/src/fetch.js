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
 * TODO describe module fetch
 *
 * @module     core/fetch
 * @copyright  2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Cfg from 'core/config';

const getRequest = (
    component,
    endpoint,
    params,
    method,
) => {
    const url = new URL(`${Cfg.wwwroot}/api/rest/v2/${component}/${endpoint}`);
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

export default async (
    component,
    action,
    params = {},
    method = 'GET',
) => {
    const result = await fetch(
        getRequest(component, action, params, method),
    );

    if (result.ok) {
        return result.json();
    }
};
