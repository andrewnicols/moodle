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

import {type FC, useState, useEffect} from 'react';
import {getString} from '@moodle/lms/core/String';

import Tour from './TourComponent';
import {fetchTour, resetTourState} from './useTourApi';
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
 * Reset link component.
 *
 * Creates the link imperatively so the text is available synchronously
 * for the footer popover (which copies innerHTML). Uses document-level
 * event delegation so clicks on any copy of the link are handled.
 */
const ResetLink: FC<{onClick: () => void}> = ({onClick}) => {
    // Create the DOM element imperatively with pre-resolved text.
    useEffect(() => {
        const container = getResetContainer();
        const wrapper = document.createElement('div');
        wrapper.className = 'usertour';

        const link = document.createElement('a');
        link.id = 'resetpagetour';
        link.href = '#';
        wrapper.appendChild(link);
        container.appendChild(wrapper);

        getString('resettouronpage', 'tool_usertours').then((text) => {
            link.textContent = text;
            return undefined;
        });

        return () => {
            wrapper.remove();
        };
    }, []);

    // Document-level delegation catches clicks on the original and any copies.
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest('#resetpagetour');
            if (!target) {
                return;
            }
            e.preventDefault();
            onClick();
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, [onClick]);

    return null;
};

const UserTours: FC<UserToursProps> = ({tourDetails, filterNames}) => {
    const [tourConfig, setTourConfig] = useState<TourConfig | null>(null);
    const [matchedTourId, setMatchedTourId] = useState<number | null>(null);
    const [filtersLoaded, setFiltersLoaded] = useState(false);
    const [filters, setFilters] = useState<TourFilter[]>([]);

    // Load client-side filter modules.
    useEffect(() => {
        if (filterNames.length === 0) {
            setFiltersLoaded(true);
            return;
        }

        loadFilterModules(filterNames).then((loaded) => {
            setFilters(loaded);
            setFiltersLoaded(true);
            return undefined;
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
                return undefined;
            });
        }
    }, [filtersLoaded, tourDetails, filters]);

    // Handle reset: clear current tour, request reset from server, re-fetch.
    const handleReset = async() => {
        if (matchedTourId === null) {
            return;
        }

        setTourConfig(null);

        const restartTourId = await resetTourState(matchedTourId);
        if (restartTourId) {
            setMatchedTourId(restartTourId);
            const config = await fetchTour(restartTourId);
            if (config) {
                setTourConfig(config);
            }
        }
    };

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
