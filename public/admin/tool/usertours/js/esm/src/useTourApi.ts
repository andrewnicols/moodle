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
 * React hook for User Tours web service API calls.
 *
 * Provides functions to communicate with the tool_usertours external API
 * for fetching tours, tracking step visibility, and managing tour state.
 *
 * @module     tool_usertours/useTourApi
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useCallback, useRef} from 'react';
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
 * Hook that returns stable callback functions for User Tours API operations.
 *
 * Each function performs a single web service call using the current page context and URL.
 */
export function useTourApi() {
    const contextId = useRef(config.contextid);

    const getPageUrl = useCallback(() => window.location.href, []);

    const fetchTour = useCallback(async(tourId: number): Promise<TourConfig | null> => {
        const [promise] = performFetch([{
            methodname: 'tool_usertours_fetch_and_start_tour',
            args: {
                tourid: tourId,
                context: contextId.current,
                pageurl: getPageUrl(),
            },
        }]);

        const response = await promise as FetchTourResponse;
        return response.tourconfig ?? null;
    }, [getPageUrl]);

    const markStepShown = useCallback(async(
        stepId: number,
        tourId: number,
        stepIndex: number,
    ): Promise<void> => {
        const [promise] = performFetch([{
            methodname: 'tool_usertours_step_shown',
            args: {
                tourid: tourId,
                stepid: stepId,
                stepindex: stepIndex,
                context: contextId.current,
                pageurl: getPageUrl(),
            },
        }]);
        await promise;
    }, [getPageUrl]);

    const markTourComplete = useCallback(async(
        stepId: number,
        tourId: number,
        stepIndex: number,
    ): Promise<void> => {
        const [promise] = performFetch([{
            methodname: 'tool_usertours_complete_tour',
            args: {
                stepid: stepId,
                stepindex: stepIndex,
                tourid: tourId,
                context: contextId.current,
                pageurl: getPageUrl(),
            },
        }]);
        await promise;
    }, [getPageUrl]);

    const resetTourState = useCallback(async(tourId: number): Promise<number | null> => {
        const [promise] = performFetch([{
            methodname: 'tool_usertours_reset_tour',
            args: {
                tourid: tourId,
                context: contextId.current,
                pageurl: getPageUrl(),
            },
        }]);

        const response = await promise as ResetTourResponse;
        return response.startTour ?? null;
    }, [getPageUrl]);

    return {fetchTour, markStepShown, markTourComplete, resetTourState};
}
