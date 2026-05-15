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
 * User Tours web service API functions.
 *
 * Provides functions to communicate with the tool_usertours external API
 * for fetching tours, tracking step visibility, and managing tour state.
 *
 * @module     tool_usertours/useTourApi
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {performFetch} from '@moodle/lms/core/ajax';
import config from '@moodle/lms/core/config';

import type {TourConfig} from './types';

/** Response shape from the fetch tour endpoint. */
interface FetchTourResponse {
    tourconfig?: TourConfig;
}

/** Response shape from the reset tour endpoint. */
interface ResetTourResponse {
    startTour?: number;
}

/**
 * Fetch the full tour configuration from the server.
 *
 * @param tourId The database ID of the tour.
 * @returns The tour configuration, or null if none was returned.
 */
export async function fetchTour(tourId: number): Promise<TourConfig | null> {
    const [promise] = performFetch([{
        methodname: 'tool_usertours_fetch_and_start_tour',
        args: {
            tourid: tourId,
            context: config.contextid,
            pageurl: window.location.href,
        },
    }]);

    const response = await promise as FetchTourResponse;
    return response.tourconfig ?? null;
}

/**
 * Notify the server that a step has been shown to the user.
 *
 * @param stepId The database ID of the step.
 * @param tourId The database ID of the tour.
 * @param stepIndex The zero-based index of the step.
 */
export async function markStepShown(
    stepId: number,
    tourId: number,
    stepIndex: number,
): Promise<void> {
    const [promise] = performFetch([{
        methodname: 'tool_usertours_step_shown',
        args: {
            tourid: tourId,
            stepid: stepId,
            stepindex: stepIndex,
            context: config.contextid,
            pageurl: window.location.href,
        },
    }]);
    await promise;
}

/**
 * Mark the tour as complete on the server.
 *
 * @param stepId The database ID of the final step.
 * @param tourId The database ID of the tour.
 * @param stepIndex The zero-based index of the final step.
 */
export async function markTourComplete(
    stepId: number,
    tourId: number,
    stepIndex: number,
): Promise<void> {
    const [promise] = performFetch([{
        methodname: 'tool_usertours_complete_tour',
        args: {
            stepid: stepId,
            stepindex: stepIndex,
            tourid: tourId,
            context: config.contextid,
            pageurl: window.location.href,
        },
    }]);
    await promise;
}

/**
 * Reset the tour state so it can be replayed.
 *
 * @param tourId The database ID of the tour.
 * @returns The ID of the tour to restart, or null.
 */
export async function resetTourState(tourId: number): Promise<number | null> {
    const [promise] = performFetch([{
        methodname: 'tool_usertours_reset_tour',
        args: {
            tourid: tourId,
            context: config.contextid,
            pageurl: window.location.href,
        },
    }]);

    const response = await promise as ResetTourResponse;
    return response.startTour ?? null;
}
