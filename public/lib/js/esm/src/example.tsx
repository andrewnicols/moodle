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
 * ESM wrapper for the core/ajax AMD module.
 *
 * @module     core/ajax
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Fetch from '@moodle/lms/core/fetch';
import String from '@moodle/lms/core/String';

export const getUserPreferences = (name: string|null = null, userid: number = 0) => {
    const endpoint = ['current', 'preferences'];

    if (name) {
        endpoint.push(name);
    }

    return Fetch.performGet('core_user', endpoint.join('/')).then((response) => response.json());
};

export default function Example() {
    return (
        <>
            <div id="example">
                <String identifier={"activityclipboard"}></String>
                <String identifier={"activityclipboard"} params={"Here!!!"}></String>
                <String identifier={"allowstealthmodules_help"}>
                    Some help content would go here.
                </String>
            </div>
        </>
    );
}
