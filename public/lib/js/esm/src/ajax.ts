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
 * @copyright  Meirza <meirza.arson@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {requireAsync} from "@moodle/lms/core/amd";


/** A single web service request descriptor. */
export type AjaxRequest = {
    methodname: string;
    args: Record<string, unknown>;
};

/** Shape of a Moodle web service error rejection. */
export type MoodleAjaxError = {
    message: string;
    errorcode: string;
    link?: string;
    moreinfourl?: string;
    debuginfo?: string;
};

/**
 * Type guard that narrows an unknown catch value to {@link MoodleAjaxError}.
 *
 * @param err The caught value.
 * @returns `true` when `err` has the shape of a Moodle WS error object.
 */
export function isMoodleAjaxError(err: unknown): err is MoodleAjaxError {
    return (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        "errorcode" in err
    );
}

type AmdAjaxModule = {
    call(
        requests: AjaxRequest[],
        async?: boolean,
        loginrequired?: boolean,
        nosessionupdate?: boolean,
        timeout?: number,
        cachekey?: number,
    ): Array<JQuery.Thenable<unknown>>;
};

const ajax = await requireAsync<AmdAjaxModule>("core/ajax");

/** Converts a jQuery-compatible promise into a native Promise. */
function toNativePromise<T>(jqPromise: JQuery.Thenable<unknown>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        jqPromise.then(resolve as (v: unknown) => void, reject);
    });
}

/**
 * Execute a single web service request.
 *
 * @param request         The web service request descriptor.
 * @param isAsync         When `false` the request is made synchronously.
 * @param loginrequired   Pass `false` for functions declared `loginrequired => false`.
 * @param nosessionupdate When `true` the request will not extend the session timer.
 * @returns A Promise that resolves with the web service response data.
 */
export function fetchOne<T = unknown>(
    request: AjaxRequest,
    isAsync = true,
    loginrequired = true,
    nosessionupdate = false,
): Promise<T> {
    const [jqPromise] = ajax.call([request], isAsync, loginrequired, nosessionupdate);
    return toNativePromise<T>(jqPromise);
}

/**
 * Execute multiple web service requests in a single batched HTTP call.
 *
 * `T` applies uniformly to every response. For heterogeneous batches use
 * multiple {@link fetchOne} calls instead.
 *
 * @param requests        Array of web service request descriptors.
 * @param isAsync         When `false` the request is made synchronously.
 * @param loginrequired   Pass `false` for functions declared `loginrequired => false`.
 * @param nosessionupdate When `true` no request in the batch will extend the session timer.
 * @returns A Promise that resolves to an array of responses in the same order as `requests`.
 */
export function fetchMany<T = unknown>(
    requests: AjaxRequest[],
    isAsync = true,
    loginrequired = true,
    nosessionupdate = false,
): Promise<T[]> {
    return Promise.all(
        ajax.call(requests, isAsync, loginrequired, nosessionupdate)
            .map((jqPromise) => toNativePromise<T>(jqPromise)),
    );
}
