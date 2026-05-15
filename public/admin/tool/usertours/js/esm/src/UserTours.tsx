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
 * Top-level User Tours orchestrator component.
 *
 * Replaces the AMD-side init logic: loads client-side filters, finds the
 * first matching tour, fetches its configuration from the server, and
 * renders the Tour component. Also renders the "Reset user tour on this
 * page" link and handles tour reset.
 *
 * @module     tool_usertours/UserTours
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {type FC, useState, useEffect, useCallback} from 'react';
import {createPortal} from 'react-dom';
import String from '@moodle/lms/core/String';

import Tour from './TourComponent';
import {useTourApi} from './useTourApi';
import {loadFilterModules} from './loadFilters';
import type {UserToursProps, TourDetail, TourFilter, TourConfig} from './types';

/**
 * Find the first tour whose client-side filters all match the current page.
 *
 * When no filters are loaded, every tour is considered a match (no client-side
 * filtering is needed).
 */
function findMatchingTour(
    tourDetails: TourDetail[],
    filters: TourFilter[],
): TourDetail | null {
    if (filters.length === 0) {
        return tourDetails[0] ?? null;
    }
    return tourDetails.find((tour) =>
        filters.some((filter) => {
            if (filter && filter.filterMatches) {
                return filter.filterMatches(tour);
            }
            // If a filter module doesn't expose filterMatches, treat it as passing.
            return true;
        }),
    ) ?? null;
}

/**
 * Find the preferred DOM element for the reset link.
 */
function getResetContainer(): HTMLElement {
    return (
        document.querySelector<HTMLElement>('.tool_usertours-resettourcontainer') ??
        document.querySelector<HTMLElement>('.logininfo') ??
        document.querySelector<HTMLElement>('footer') ??
        document.body
    );
}

/**
 * Reset link component rendered via a portal into the preferred page location.
 */
const ResetLink: FC<{onClick: () => void}> = ({onClick}) => {
    const container = getResetContainer();

    return createPortal(
        <div className="usertour">
            <a
                id="resetpagetour"
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    onClick();
                }}
            >
                <String identifier="resettouronpage" component="tool_usertours" />
            </a>
        </div>,
        container,
    );
};

const UserTours: FC<UserToursProps> = ({tourDetails, filterNames}) => {
    const [tourConfig, setTourConfig] = useState<TourConfig | null>(null);
    const [matchedTourId, setMatchedTourId] = useState<number | null>(null);
    const [filtersLoaded, setFiltersLoaded] = useState(false);
    const [filters, setFilters] = useState<TourFilter[]>([]);
    const {fetchTour, resetTourState} = useTourApi();

    // Load client-side filter modules.
    useEffect(() => {
        if (filterNames.length === 0) {
            setFiltersLoaded(true);
            return;
        }

        loadFilterModules(filterNames).then((loaded) => {
            setFilters(loaded);
            setFiltersLoaded(true);
        });
    }, [filterNames]);

    // Find matching tour and fetch its config.
    useEffect(() => {
        if (!filtersLoaded) {
            return;
        }

        const match = findMatchingTour(tourDetails, filters);
        if (!match) {
            return;
        }

        setMatchedTourId(match.tourId);

        // Only fetch if the tour should be started for this user.
        if (match.startTour !== false) {
            fetchTour(match.tourId).then((config) => {
                if (config) {
                    setTourConfig(config);
                }
            });
        }
    }, [filtersLoaded, tourDetails, filters, fetchTour]);

    // Handle reset: clear current tour, request reset from server, re-fetch.
    const handleReset = useCallback(() => {
        if (matchedTourId === null) {
            return;
        }

        setTourConfig(null);

        resetTourState(matchedTourId).then((restartTourId) => {
            if (restartTourId) {
                setMatchedTourId(restartTourId);
                fetchTour(restartTourId).then((config) => {
                    if (config) {
                        setTourConfig(config);
                    }
                });
            }
        });
    }, [matchedTourId, resetTourState, fetchTour]);

    return (
        <>
            {matchedTourId !== null && (
                <ResetLink onClick={handleReset} />
            )}
            {tourConfig && matchedTourId !== null && (
                <Tour
                    tourConfig={tourConfig}
                    tourId={matchedTourId}
                />
            )}
        </>
    );
};

UserTours.displayName = 'UserTours';
export default UserTours;
