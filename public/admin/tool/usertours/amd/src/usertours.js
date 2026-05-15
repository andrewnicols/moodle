/**
 * User tour control library.
 *
 * @module     tool_usertours/usertours
 * @copyright  2016 Andrew Nicols <andrew@nicols.co.uk>
 */
import Templates from 'core/templates';
import notification from 'core/notification';
import * as tourRepository from './repository';
import Pending from 'core/pending';

import {appendToDom} from 'core/component';

/** The container element holding the currently mounted React tour. */
let tourContainer = null;
let tourId = null;

/**
 * Find the first matching tour.
 *
 * @param {object[]} tourDetails
 * @param {object[]} filters
 * @returns {null|object}
 */
const findMatchingTour = (tourDetails, filters) => {
    return tourDetails.find(tour => filters.some(filter => {
        if (filter && filter.filterMatches) {
            return filter.filterMatches(tour);
        }

        return true;
    }));
};

/**
 * Initialise the user tour for the current page.
 *
 * @method  init
 * @param   {Array}    tourDetails      The matching tours for this page.
 * @param   {Array}    filters          The names of all client side filters.
 */
export const init = async(tourDetails, filters) => {
    const requirements = [];
    filters.forEach((filter) => {
        requirements.push(import(filter));
    });

    const filterPlugins = await Promise.all(requirements);

    const matchingTour = findMatchingTour(tourDetails, filterPlugins);
    if (!matchingTour) {
        return;
    }

    // Only one tour per page is allowed.
    tourId = matchingTour.tourId;

    let startTour = matchingTour.startTour;
    if (typeof startTour === 'undefined') {
        startTour = true;
    }

    if (startTour) {
        // Fetch the tour configuration.
        fetchTour(tourId);
    }

    addResetLink();

    // Watch for the reset link.
    document.querySelector('body').addEventListener('click', e => {
        const resetLink = e.target.closest('#resetpagetour');
        if (resetLink) {
            e.preventDefault();
            resetTourState(tourId);
        }
    });
};

/**
 * Fetch the configuration for the specified tour and mount the React tour component.
 *
 * @method  fetchTour
 * @param   {Number}    tourId      The ID of the tour to start.
 */
const fetchTour = async tourId => {
    const pendingPromise = new Pending(`admin_usertour_fetchTour:${tourId}`);

    try {
        const response = await tourRepository.fetchTour(tourId);
        if (response.hasOwnProperty('tourconfig')) {
            // Remove any previously mounted tour.
            if (tourContainer) {
                tourContainer.remove();
                tourContainer = null;
            }

            appendToDom(
                '@moodle/lms/tool_usertours/TourComponent',
                {
                    tourConfig: response.tourconfig,
                    tourId: tourId,
                },
                document.body,
            );

            // Keep a reference to the container so we can remove it on reset.
            tourContainer = document.body.lastElementChild;
        }
        pendingPromise.resolve();
    } catch (error) {
        pendingPromise.resolve();
        notification.exception(error);
    }
};

const getPreferredResetLocation = () => {
    let location = document.querySelector('.tool_usertours-resettourcontainer');
    if (location) {
        return location;
    }

    location = document.querySelector('.logininfo');
    if (location) {
        return location;
    }

    location = document.querySelector('footer');
    if (location) {
        return location;
    }

    return document.body;
};

/**
 * Add a reset link to the page.
 *
 * @method  addResetLink
 */
const addResetLink = () => {
    const pendingPromise = new Pending('admin_usertour_addResetLink');

    Templates.render('tool_usertours/resettour', {})
    .then(function(html, js) {
        // Append the link to the most suitable place on the page with fallback to legacy selectors and finally the body if
        // there is no better place.
        Templates.appendNodeContents(getPreferredResetLocation(), html, js);

        return;
    })
    .catch()
    .then(pendingPromise.resolve)
    .catch();
};

/**
 * Reset the state, and restart the the tour on the current page.
 *
 * @method  resetTourState
 * @param   {Number}    tourId      The ID of the tour to start.
 * @returns {Promise}
 */
export const resetTourState = tourId => tourRepository.resetTourState(tourId)
.then(response => {
    if (response.startTour) {
        fetchTour(response.startTour);
    }
    return;
}).catch(notification.exception);
