import{default as o}from"./TourComponent.js";import{default as p}from"./UserTours.js";import{default as u}from"./TourStep.js";import{default as s}from"./TourBackdrop.js";import{fetchTour as m,markStepShown as l,markTourComplete as x,resetTourState as i}from"./useTourApi.js";import{eventTypes as S}from"./events.js";export{s as TourBackdrop,u as TourStep,p as UserTours,o as default,S as eventTypes,m as fetchTour,l as markStepShown,x as markTourComplete,i as resetTourState};
/**
 * User Tours React entry point.
 *
 * This module is the default export for the tool_usertours React tour
 * component. It can be used either via the data-react-component autoinit
 * system or mounted manually from the AMD orchestrator using mountReactApp().
 *
 * Re-exports all public components, API functions, and types so consumers can
 * import from a single path:
 *
 *   import UserTour from '@moodle/lms/tool_usertours/tour';
 *   import {fetchTour} from '@moodle/lms/tool_usertours/tour';
 *
 * @module     tool_usertours/tour
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//# sourceMappingURL=tour.js.map
