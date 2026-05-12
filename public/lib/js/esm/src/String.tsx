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

import { Suspense, use, type ReactNode } from 'react';
import { requireAsync } from "@moodle/lms/core/amd";

type stringParams = Record<string, string | number> | string | number | null;
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

// Ensures the same Promise instance is returned for the same string key across
// renders. use() requires a stable reference — without this, a new Promise is
// created on every render and the component suspends indefinitely.
const stringPromiseCache = new Map<string, Promise<string>>();

export interface StringProps {
    identifier: string;
    component?: string;
    params?: string | number | Record<string, string | number>;
}

export const getString = (
    identifier: string,
    component: string = "core",
    params?: string | number | Record<string, string | number>,
): Promise<string> => {
    const key = `${component}::${identifier}::${JSON.stringify(params)}`;
    if (!stringPromiseCache.has(key)) {
        stringPromiseCache.set(
            key,
            requireAsync<stringModule>("core/str").then(str => str.get_string(identifier, component, params)),
        );
    }
    return stringPromiseCache.get(key)!;
};

export const resetStringCache = () => stringPromiseCache.clear();

export const cacheStrings = (strings: stringRequest[]) =>
    requireAsync<stringModule>("core/str").then(str => str.cache_strings(strings));

function StringInner({ identifier, component, params }: StringProps) {
    return <>{use(getString(identifier, component, params))}</>;
}

function String({ children, identifier, component = "core", params }: StringProps & { children?: ReactNode }) {
    return (
        <Suspense fallback={children ?? `${identifier}, ${component}`}>
            <StringInner identifier={identifier} component={component} params={params} />
        </Suspense>
    );
}

export default String;
