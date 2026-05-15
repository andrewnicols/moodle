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

export {default} from './TourComponent';
export {default as UserTours} from './UserTours';
export {default as TourStep} from './TourStep';
export {default as TourBackdrop} from './TourBackdrop';
export {fetchTour, markStepShown, markTourComplete, resetTourState} from './useTourApi';
export {eventTypes} from './events';
export type {
    TourConfig, TourProps, StepConfig, Placement, VisibleStepInfo,
    TourDetail, TourFilter, UserToursProps,
} from './types';
