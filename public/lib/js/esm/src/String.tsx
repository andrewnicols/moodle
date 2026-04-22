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

import {Suspense, type ReactNode} from 'react';
import {requireAsync} from "@moodle/lms/core/amd";

type stringParams = Record<string, string|number> | string | number | null;
type stringRequest = {
    key: string;
    component: string;
    lang: string;
    param: stringParams;
};

interface stringModule {
    get_string: (identifier: string, component?: string, params?: stringParams) => Promise<string>;
    get_strings: (requests: stringRequest[]) => Promise<string>[];
    cache_strings: (strings: stringRequest[]) => void;
}

const str = await requireAsync<stringModule>("core/str");

export interface StringProps {
    identifier: string,
    component?: string,
    params?: string | number | Record<string, string|number>,
}

export const getString = (
    identifier: string,
    component: string = "moodle",
    a?: string|number|Record<string, string|number>
) => str.get_string(identifier, component, a);

export const cacheStrings = (strings: stringRequest[]) => str.cache_strings(strings);

function String({children, ...context}: StringProps) {
    const {identifier, component = "moodle", params} = context;
    const stringValue = getString(identifier, component, params);

    const fallback = children || `${identifier}, ${component}`;

    return (
        <Suspense fallback={fallback}>
            {stringValue}
        </Suspense>
    );
}

export default String;
