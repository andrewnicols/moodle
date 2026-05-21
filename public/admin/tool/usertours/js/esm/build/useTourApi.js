import{fetchOne as t}from"@moodle/lms/core/ajax";import r from"@moodle/lms/core/config";function s(e){return t({methodname:"tool_usertours_fetch_and_start_tour",args:{tourid:e,context:r.contextid,pageurl:window.location.href}}).then(o=>o.tourconfig??null)}function m(e,o,n){return t({methodname:"tool_usertours_step_shown",args:{tourid:o,stepid:e,stepindex:n,context:r.contextid,pageurl:window.location.href}}).then(()=>{})}function c(e,o,n){return t({methodname:"tool_usertours_complete_tour",args:{stepid:e,stepindex:n,tourid:o,context:r.contextid,pageurl:window.location.href}}).then(()=>{})}function d(e){return window.console.log("Resetting tour state for tour ID",e),t({methodname:"tool_usertours_reset_tour",args:{tourid:e,context:r.contextid,pageurl:window.location.href}}).then(o=>o.startTour??null)}export{s as fetchTour,m as markStepShown,c as markTourComplete,d as resetTourState};
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
//# sourceMappingURL=useTourApi.js.map
