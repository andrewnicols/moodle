/**
 * Step management code.
 *
 * @module     tool_usertours/managesteps
 * @copyright  2016 Andrew Nicols <andrew@nicols.co.uk>
 */
import {fetchOne} from 'core/fetch';
import moodleConfig from 'core/config';

/**
 * Reset the tour state of the specified tour.
 *
 * @param {number} tourid
 * @return {Promise}
 */
export const resetTourState = (tourid) => fetchOne('tool_usertours_reset_tour', {
    tourid,
    context: moodleConfig.contextid,
    pageurl: window.location.href,
});

/**
 * Mark the specified tour as complete.
 *
 * @param {number} stepid
 * @param {number} tourid
 * @param {number} stepindex
 * @return {Promise}
 */
export const markTourComplete = (stepid, tourid, stepindex) => fetchOne('tool_usertours_complete_tour', {
    stepid,
    stepindex: stepindex,
    tourid,
    context: moodleConfig.contextid,
    pageurl: window.location.href,
});

/**
 * Fetch the specified tour.
 *
 * @param {number} tourid
 * @return {Promise}
 */
export const fetchTour = tourid => fetchOne('tool_usertours_fetch_and_start_tour', {
    tourid,
    context: moodleConfig.contextid,
    pageurl: window.location.href,
});

/**
 * Mark the specified step as having been shown.
 *
 * @param {number} stepid
 * @param {number} tourid
 * @param {number} stepindex
 * @return {Promise}
 */
export const markStepShown = (stepid, tourid, stepindex) => fetchOne('tool_usertours_step_shown', {
    tourid,
    stepid,
    stepindex,
    context: moodleConfig.contextid,
    pageurl: window.location.href,
});
