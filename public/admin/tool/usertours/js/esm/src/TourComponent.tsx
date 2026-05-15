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
 * Tour component — the main orchestrator for rendering a user tour.
 *
 * Manages the tour lifecycle: step navigation, visibility filtering,
 * session storage for resume-on-reload, dispatching DOM events for
 * backward compatibility with AMD listeners, and coordinating the
 * TourStep child component.
 *
 * @module     tool_usertours/TourComponent
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {type FC, useState, useCallback, useMemo, useEffect} from 'react';
import {createPortal} from 'react-dom';

import TourStep from './TourStep';
import {markStepShown, markTourComplete} from './useTourApi';
import {get as sessionGet, set as sessionSet} from '@moodle/lms/core/SessionStorage';
import type {TourProps, StepConfig, VisibleStepInfo} from './types';

/** Custom event names matching the original AMD events module. */
const EVENT_TYPES = {
    stepRender: 'tool_usertours/stepRender',
    stepRendered: 'tool_usertours/stepRendered',
    tourStart: 'tool_usertours/tourStart',
    tourStarted: 'tool_usertours/tourStarted',
    tourEnd: 'tool_usertours/tourEnd',
    tourEnded: 'tool_usertours/tourEnded',
    stepHide: 'tool_usertours/stepHide',
    stepHidden: 'tool_usertours/stepHidden',
} as const;

/**
 * Check if a step target element exists and is visible on the page.
 */
function isStepTargetVisible(step: StepConfig): boolean {
    if (!step.target) {
        return false;
    }
    const el = document.querySelector<HTMLElement>(step.target);
    if (!el) {
        return false;
    }
    // Check basic visibility.
    if (!el.offsetParent && window.getComputedStyle(el).position !== 'fixed') {
        return false;
    }
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
}

/**
 * Check if a step is potentially visible (could be shown to the user).
 */
function isStepPotentiallyVisible(step: StepConfig): boolean {
    if (isStepTargetVisible(step)) {
        return true;
    }
    if (step.orphan) {
        return true;
    }
    if (step.delay) {
        return true;
    }
    return false;
}

/**
 * Dispatch a custom DOM event on document for backward compatibility with
 * AMD event listeners.
 */
function dispatchTourEvent(
    eventName: string,
    detail: Record<string, unknown> = {},
    cancelable = false,
): boolean {
    const event = new CustomEvent(eventName, {
        detail,
        cancelable,
        bubbles: true,
    });
    return document.dispatchEvent(event);
}

/**
 * Normalise a raw step config from the web service into the expected shape.
 */
function normalizeStep(raw: Record<string, unknown>, index: number): StepConfig {
    return {
        stepid: (raw.stepid as number) ?? 0,
        title: (raw.title as string) ?? '',
        body: ((raw.body ?? raw.content) as string) ?? '',
        target: ((raw.target ?? raw.element) as string) ?? '',
        placement: ((raw.placement as StepConfig['placement']) ?? 'top'),
        delay: (raw.delay as number) ?? 0,
        moveOnClick: !!(raw.moveOnClick ?? raw.reflex),
        orphan: !!(raw.orphan),
        backdrop: !!(raw.backdrop),
        stepNumber: index,
    };
}

/**
 * Find the next potentially visible step after a given index.
 */
function getNextVisibleStep(steps: StepConfig[], from: number): number | null {
    for (let i = from + 1; i < steps.length; i++) {
        if (isStepPotentiallyVisible(steps[i])) {
            return i;
        }
    }
    return null;
}

/**
 * Find the previous potentially visible step before a given index.
 */
function getPreviousVisibleStep(steps: StepConfig[], from: number): number | null {
    for (let i = from - 1; i >= 0; i--) {
        if (isStepPotentiallyVisible(steps[i])) {
            return i;
        }
    }
    return null;
}

const Tour: FC<TourProps> = ({
    tourConfig,
    tourId,
    startAt = 0,
}) => {
    const [currentStepNumber, setCurrentStepNumber] = useState<number | null>(null);
    const [tourRunning, setTourRunning] = useState(false);
    const storageKey = `tourstate_${tourConfig.name}`;

    // Normalise steps once.
    const steps = useMemo(
        () => tourConfig.steps.map((s, i) => normalizeStep(s as unknown as Record<string, unknown>, i)),
        [tourConfig.steps],
    );

    // Calculate potentially visible steps.
    const {visibleStepsMap, totalVisibleSteps} = useMemo(() => {
        const map = new Map<number, VisibleStepInfo>();
        let position = 1;
        for (let i = 0; i < steps.length; i++) {
            if (isStepPotentiallyVisible(steps[i])) {
                map.set(i, {stepId: steps[i].stepid, position});
                position++;
            }
        }
        return {visibleStepsMap: map, totalVisibleSteps: map.size};
    }, [steps]);

    /**
     * End the tour.
     */
    const endTour = useCallback(() => {
        const result = dispatchTourEvent(EVENT_TYPES.tourEnd, {}, true);
        if (!result) {
            return; // Event was cancelled.
        }

        // Notify the server about tour completion.
        if (currentStepNumber !== null) {
            const step = steps[currentStepNumber];
            if (step) {
                markTourComplete(step.stepid, tourId, currentStepNumber);
            }
        }

        setCurrentStepNumber(null);
        setTourRunning(false);

        dispatchTourEvent(EVENT_TYPES.tourEnded);
    }, [currentStepNumber, steps, tourId]);

    /**
     * Go to a specific step.
     */
    const gotoStep = useCallback(
        (stepNumber: number | null, direction: 1 | -1 = 1) => {
            if (stepNumber === null || stepNumber < 0 || stepNumber >= steps.length) {
                endTour();
                return;
            }

            const step = steps[stepNumber];

            // Handle delay.
            if (step.delay && !step.delayed) {
                step.delayed = true;
                setTimeout(() => gotoStep(stepNumber, direction), step.delay);
                return;
            }

            // If target isn't visible and not orphan, skip to next/previous.
            if (!step.orphan && !isStepTargetVisible(step)) {
                const nextStep = direction === -1
                    ? getPreviousVisibleStep(steps, stepNumber)
                    : getNextVisibleStep(steps, stepNumber);
                gotoStep(nextStep, direction);
                return;
            }

            // Dispatch stepRender event (cancelable).
            const renderAllowed = dispatchTourEvent(
                EVENT_TYPES.stepRender,
                {stepConfig: step},
                true,
            );
            if (!renderAllowed) {
                return;
            }

            // Dispatch stepHide for the previous step.
            if (currentStepNumber !== null) {
                dispatchTourEvent(EVENT_TYPES.stepHide);
            }

            setCurrentStepNumber(stepNumber);
            sessionSet(storageKey, String(stepNumber));

            // Notify the server about the step being shown.
            markStepShown(step.stepid, tourId, stepNumber);

            dispatchTourEvent(EVENT_TYPES.stepRendered, {stepConfig: step});
        },
        [steps, endTour, currentStepNumber, tourId, storageKey],
    );

    /**
     * Navigate to the next step.
     */
    const next = useCallback(() => {
        if (currentStepNumber === null) {
            return;
        }
        gotoStep(getNextVisibleStep(steps, currentStepNumber));
    }, [currentStepNumber, steps, gotoStep]);

    // Start the tour on mount.
    useEffect(() => {
        let resolvedStartAt = startAt;

        // Check session storage for a resume position.
        const stored = sessionGet(storageKey);
        if (stored !== null) {
            const parsed = parseInt(stored, 10);
            if (!isNaN(parsed) && parsed >= 0 && parsed < steps.length) {
                resolvedStartAt = parsed;
            }
        }

        const startAllowed = dispatchTourEvent(
            EVENT_TYPES.tourStart,
            {startAt: resolvedStartAt},
            true,
        );
        if (!startAllowed) {
            return;
        }

        setTourRunning(true);
        gotoStep(resolvedStartAt);

        dispatchTourEvent(EVENT_TYPES.tourStarted, {startAt: resolvedStartAt});
    }, []);

    // Handle window resize: restart at current step.
    useEffect(() => {
        let resizeTimer: ReturnType<typeof setTimeout> | undefined;

        const handleResize = () => {
            if (!tourRunning) {
                return;
            }
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (currentStepNumber !== null) {
                    gotoStep(currentStepNumber);
                }
            }, 250);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', handleResize);
        };
    }, [tourRunning, currentStepNumber, gotoStep]);

    // Nothing to render if tour isn't running or no step is selected.
    if (!tourRunning || currentStepNumber === null) {
        return null;
    }

    const currentStep = steps[currentStepNumber];
    if (!currentStep) {
        return null;
    }

    return createPortal(
        <TourStep
            stepConfig={currentStep}
            tourName={tourConfig.name}
            endTourLabel={tourConfig.endtourlabel}
            isLastStep={getNextVisibleStep(steps, currentStepNumber) === null}
            displayStepNumbers={tourConfig.displaystepnumbers}
            visibleSteps={visibleStepsMap}
            totalVisibleSteps={totalVisibleSteps}
            onNext={next}
            onEnd={endTour}
        />,
        document.body,
    );
};

Tour.displayName = 'Tour';
export default Tour;
