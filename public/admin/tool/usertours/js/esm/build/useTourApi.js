var i=Object.defineProperty;var t=(e,o)=>i(e,"name",{value:o,configurable:!0});import{fetchOne as r}from"@moodle/lms/core/ajax";import n from"@moodle/lms/core/config";function d(e){return r({methodname:"tool_usertours_fetch_and_start_tour",args:{tourid:e,context:n.contextid,pageurl:window.location.href}}).then(o=>o.tourconfig??null)}t(d,"fetchTour");function a(e,o,u){return r({methodname:"tool_usertours_step_shown",args:{tourid:o,stepid:e,stepindex:u,context:n.contextid,pageurl:window.location.href}}).then(()=>{})}t(a,"markStepShown");function f(e,o,u){return r({methodname:"tool_usertours_complete_tour",args:{stepid:e,stepindex:u,tourid:o,context:n.contextid,pageurl:window.location.href}}).then(()=>{})}t(f,"markTourComplete");function p(e){return window.console.log("Resetting tour state for tour ID",e),r({methodname:"tool_usertours_reset_tour",args:{tourid:e,context:n.contextid,pageurl:window.location.href}}).then(o=>o.startTour??null)}t(p,"resetTourState");export{d as fetchTour,a as markStepShown,f as markTourComplete,p as resetTourState};
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
