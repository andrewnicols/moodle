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
 * Shared types for the User Tours React components.
 *
 * @module     tool_usertours/types
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/** The placement of a tour step relative to its target element. */
export type Placement = 'top' | 'bottom' | 'left' | 'right';

/** Configuration for a single tour step as returned by the web service. */
export interface StepConfig {
    /** The step ID from the database. */
    stepid: number;
    /** The step title (HTML). */
    title: string;
    /** The step body content (HTML). */
    body: string;
    /** CSS selector for the target element. */
    target: string;
    /** Preferred placement relative to the target. */
    placement: Placement;
    /** Delay in milliseconds before showing the step. */
    delay: number;
    /** Whether to advance the tour when the target element is clicked. */
    moveOnClick: boolean;
    /** Whether this step should display without a target element. */
    orphan: boolean;
    /** Whether to show a backdrop highlighting the target. */
    backdrop: boolean;
    /** The zero-based index of this step within the tour. */
    stepNumber: number;
    /** Whether the delay has already been applied. */
    delayed?: boolean;
    /** Whether this step is rendered as an orphan (no target found). */
    isOrphan?: boolean;
}

/** Tour configuration as returned by the web service. */
export interface TourConfig {
    /** The tour name identifier. */
    name: string;
    /** The label for the end tour button. */
    endtourlabel: string;
    /** Whether to display step numbers (e.g. "Next (2/5)"). */
    displaystepnumbers: boolean;
    /** The tour steps. */
    steps: StepConfig[];
}

/** Props for the Tour component. */
export interface TourProps {
    /** The tour configuration from the web service. */
    tourConfig: TourConfig;
    /** The database ID of the tour. */
    tourId: number;
    /** The step number to start at (zero-indexed). */
    startAt?: number;
}

/** Information about a potentially visible step. */
export interface VisibleStepInfo {
    /** The step ID from the database. */
    stepId: number;
    /** The one-based position among visible steps. */
    position: number;
}
