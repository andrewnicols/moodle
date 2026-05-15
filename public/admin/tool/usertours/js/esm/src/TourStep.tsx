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
 * TourStep component for User Tours.
 *
 * Renders a single tour step as an accessible modal dialog, positioned
 * relative to a target element using @popperjs/core. Supports orphan steps
 * (centered on the viewport), backdrop highlighting, step navigation buttons,
 * and keyboard interaction (Escape to close, Tab trapping with backdrop).
 *
 * @module     tool_usertours/TourStep
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {type FC, useRef, useEffect, useCallback, useState} from 'react';
import {createPopper} from '@popperjs/core';
import type {Instance as PopperInstance, Placement as PopperPlacement} from '@popperjs/core';

import String from '@moodle/lms/core/String';
import {Button} from '@moodlehq/design-system';

import TourBackdrop from './TourBackdrop';
import type {StepConfig, VisibleStepInfo} from './types';

/** Minimum spacing from viewport edges. */
const MINSPACING = 10;

/** Padding around the target element. */
const BUFFER = 10;

interface TourStepProps {
    /** The step configuration. */
    stepConfig: StepConfig;
    /** The tour name for generating IDs. */
    tourName: string;
    /** The label for the end tour button (from the tour config). */
    endTourLabel: string;
    /** Whether this is the last visible step. */
    isLastStep: boolean;
    /** Whether to show step numbers on the next button. */
    displayStepNumbers: boolean;
    /** Map of step numbers to visible step info (for step numbering). */
    visibleSteps: Map<number, VisibleStepInfo>;
    /** Total number of visible steps. */
    totalVisibleSteps: number;
    /** Navigate to the next step. */
    onNext: () => void;
    /** End the tour. */
    onEnd: () => void;
}

/**
 * Convert our placement string to a Popper.js placement.
 */
function toPopperPlacement(placement: string): PopperPlacement {
    return `${placement}-start` as PopperPlacement;
}

/**
 * Build the flip fallback order for a given placement.
 */
function getFlipFallbacks(placement: string): PopperPlacement[] {
    switch (placement) {
        case 'left':
            return ['left', 'right', 'top', 'bottom'];
        case 'right':
            return ['right', 'left', 'top', 'bottom'];
        case 'top':
            return ['top', 'bottom', 'right', 'left'];
        case 'bottom':
            return ['bottom', 'top', 'right', 'left'];
        default:
            return ['bottom', 'top', 'right', 'left'];
    }
}

/**
 * Check if a target element is visible in the DOM.
 */
function isElementVisible(el: HTMLElement): boolean {
    if (!el.offsetParent && window.getComputedStyle(el).position !== 'fixed') {
        return false;
    }
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
}

/**
 * Scroll the viewport so the target element is centered.
 */
function scrollToTarget(target: HTMLElement, placement: string): Promise<void> {
    const viewportHeight = window.innerHeight;
    const rect = target.getBoundingClientRect();
    const currentScrollTop = window.scrollY;
    let scrollTop: number;

    // Check for fixed position.
    let el: HTMLElement | null = target;
    while (el) {
        if (window.getComputedStyle(el).position === 'fixed') {
            return Promise.resolve();
        }
        el = el.parentElement;
    }

    if (placement === 'top') {
        scrollTop = rect.top + currentScrollTop - viewportHeight / 2;
    } else if (placement === 'bottom') {
        scrollTop = rect.bottom + currentScrollTop - viewportHeight / 2;
    } else if (target.offsetHeight <= viewportHeight * 0.8) {
        scrollTop = rect.top + currentScrollTop - (viewportHeight - target.offsetHeight) / 2;
    } else {
        scrollTop = rect.top + currentScrollTop - viewportHeight * 0.2;
    }

    scrollTop = Math.max(0, scrollTop);
    scrollTop = Math.min(document.documentElement.scrollHeight - viewportHeight, scrollTop);
    scrollTop = Math.ceil(scrollTop);

    return new Promise((resolve) => {
        window.scrollTo({top: scrollTop, behavior: 'smooth'});
        // Resolve after a reasonable scroll animation duration.
        setTimeout(resolve, 300);
    });
}

const TourStep: FC<TourStepProps> = ({
    stepConfig,
    tourName,
    endTourLabel,
    isLastStep,
    displayStepNumbers,
    visibleSteps,
    totalVisibleSteps,
    onNext,
    onEnd,
}) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const popperRef = useRef<PopperInstance | null>(null);
    const [visible, setVisible] = useState(false);
    const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
    const originalAriaRef = useRef<Map<HTMLElement, {describedby?: string; tabindex?: string}>>(new Map());

    const stepId = `tour-step-${tourName}-${stepConfig.stepNumber}`;
    const isOrphan = stepConfig.orphan && !targetElement;

    // Resolve the target element from the CSS selector.
    useEffect(() => {
        if (stepConfig.target) {
            const el = document.querySelector<HTMLElement>(stepConfig.target);
            if (el && isElementVisible(el)) {
                setTargetElement(el);
                return;
            }
        }

        if (stepConfig.orphan) {
            setTargetElement(null);
        }
    }, [stepConfig.target, stepConfig.orphan]);

    // Resolve step position info for step number display.
    const stepInfo = visibleSteps.get(stepConfig.stepNumber);

    // Set up ARIA attributes on the target.
    useEffect(() => {
        if (!targetElement) {
            return undefined;
        }

        const originals = new Map<HTMLElement, {describedby?: string; tabindex?: string}>();
        originals.set(targetElement, {
            describedby: targetElement.getAttribute('aria-describedby') ?? undefined,
            tabindex: targetElement.getAttribute('tabindex') ?? undefined,
        });

        if (!targetElement.getAttribute('tabindex')) {
            targetElement.setAttribute('tabindex', '0');
        }
        targetElement.setAttribute('aria-describedby', `${stepId}-body`);
        targetElement.setAttribute('data-flexitour', 'highlight');

        originalAriaRef.current = originals;

        return () => {
            originals.forEach((attrs, el) => {
                if (attrs.describedby !== undefined) {
                    el.setAttribute('aria-describedby', attrs.describedby);
                } else {
                    el.removeAttribute('aria-describedby');
                }
                if (attrs.tabindex !== undefined) {
                    el.setAttribute('tabindex', attrs.tabindex);
                } else {
                    // Delay removal to prevent the browser from re-adding it.
                    setTimeout(() => el.removeAttribute('tabindex'), 400);
                }
                el.removeAttribute('data-flexitour');
            });
        };
    }, [targetElement, stepId]);

    // Accessibility: hide siblings from screen readers.
    useEffect(() => {
        if (!containerRef.current) {
            return undefined;
        }

        const hidden: HTMLElement[] = [];
        const stateAttr = 'data-has-hidden';

        const hideNode = (node: HTMLElement) => {
            if (node.dataset.flexitour) {
                return;
            }
            if (!node.getAttribute('aria-hidden')) {
                node.setAttribute(stateAttr, 'true');
                node.setAttribute('aria-hidden', 'true');
                hidden.push(node);
            }
        };

        // Hide siblings of the container and its ancestors.
        const container = containerRef.current;
        Array.from(container.parentElement?.children ?? []).forEach((sibling) => {
            if (sibling !== container && sibling instanceof HTMLElement) {
                hideNode(sibling);
            }
        });

        let ancestor: Element | null = container.parentElement;
        while (ancestor && ancestor !== document.body) {
            const current = ancestor;
            Array.from(current.parentElement?.children ?? []).forEach((sibling) => {
                if (sibling !== current && sibling instanceof HTMLElement) {
                    hideNode(sibling);
                }
            });
            ancestor = current.parentElement;
        }

        return () => {
            hidden.forEach((node) => {
                node.removeAttribute(stateAttr);
                node.removeAttribute('aria-hidden');
            });
        };
    }, [visible]);

    // Position with Popper and reveal.
    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return undefined;
        }

        const doPosition = async() => {
            // Clean up any previous popper.
            if (popperRef.current) {
                popperRef.current.destroy();
                popperRef.current = null;
            }

            if (targetElement && !isOrphan) {
                // Scroll to target first.
                await scrollToTarget(targetElement, stepConfig.placement);

                const fallbacks = getFlipFallbacks(stepConfig.placement);
                popperRef.current = createPopper(targetElement, container, {
                    placement: toPopperPlacement(stepConfig.placement),
                    modifiers: [
                        {
                            name: 'flip',
                            options: {
                                fallbackPlacements: fallbacks,
                            },
                        },
                        {
                            name: 'arrow',
                            options: {
                                element: container.querySelector('[data-role="arrow"]'),
                            },
                        },
                        {
                            name: 'offset',
                            options: {
                                offset: stepConfig.backdrop ? [-BUFFER, BUFFER] : [0, BUFFER],
                            },
                        },
                        {
                            name: 'preventOverflow',
                            options: {
                                padding: MINSPACING,
                            },
                        },
                    ],
                });
            } else {
                // Orphan step: center in viewport.
                container.style.position = 'fixed';
                const stepHeight = container.offsetHeight;
                const stepWidth = container.offsetWidth;
                const viewportHeight = window.innerHeight;
                const viewportWidth = window.innerWidth;

                let top = MINSPACING;
                if (viewportHeight >= stepHeight + MINSPACING * 2) {
                    top = Math.ceil((viewportHeight - stepHeight) / 2);
                }
                const left = Math.ceil((viewportWidth - stepWidth) / 2);

                container.style.top = `${top}px`;
                container.style.left = `${left}px`;
            }

            setVisible(true);

            // Focus the step dialog for accessibility.
            requestAnimationFrame(() => {
                container.focus();
                // Double-focus workaround for JAWS screen reader.
                setTimeout(() => container.focus(), 100);
            });
        };

        doPosition();

        return () => {
            if (popperRef.current) {
                popperRef.current.destroy();
                popperRef.current = null;
            }
        };
    }, [targetElement, isOrphan, stepConfig.placement, stepConfig.backdrop]);

    // Keyboard handler.
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onEnd();
                return;
            }

            if (e.key === 'Tab' && stepConfig.backdrop) {
                const container = containerRef.current;
                if (!container) {
                    return;
                }

                const tabbableSelector =
                    'a[href], [draggable=true], [contenteditable=true], ' +
                    'input:enabled, select:enabled, textarea:enabled, button:enabled, [tabindex]';

                // Build the set of tabbable nodes within the step and target.
                let tabbableNodes = Array.from(container.querySelectorAll<HTMLElement>(tabbableSelector));
                if (targetElement) {
                    const targetTabbable = Array.from(
                        targetElement.querySelectorAll<HTMLElement>(tabbableSelector),
                    );
                    if (targetElement.matches(tabbableSelector)) {
                        targetTabbable.unshift(targetElement);
                    }
                    tabbableNodes = [...targetTabbable, ...tabbableNodes];
                }

                // Filter hidden/disabled.
                tabbableNodes = tabbableNodes.filter(
                    (n) => !n.hidden && n.offsetParent !== null && !n.matches(':disabled'),
                );

                if (tabbableNodes.length === 0) {
                    e.preventDefault();
                    return;
                }

                const activeIndex = tabbableNodes.indexOf(document.activeElement as HTMLElement);
                const direction = e.shiftKey ? -1 : 1;
                let nextIndex = activeIndex + direction;

                if (nextIndex < 0 || nextIndex >= tabbableNodes.length) {
                    // Wrap around: focus the step container or target.
                    e.preventDefault();
                    if (e.shiftKey) {
                        tabbableNodes[tabbableNodes.length - 1].focus();
                    } else if (isOrphan) {
                        container.focus();
                    } else if (targetElement) {
                        targetElement.focus();
                    }
                    return;
                }

                e.preventDefault();
                tabbableNodes[nextIndex].focus();
            }
        },
        [onEnd, stepConfig.backdrop, targetElement, isOrphan],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // MoveOnClick: advance when target is clicked.
    useEffect(() => {
        if (!stepConfig.moveOnClick || !targetElement) {
            return undefined;
        }

        const handler = (e: MouseEvent) => {
            // Ignore clicks inside the tour step container.
            const container = containerRef.current;
            if (container && container.contains(e.target as Node)) {
                return;
            }
            setTimeout(onNext, 500);
        };

        targetElement.addEventListener('click', handler);
        return () => targetElement.removeEventListener('click', handler);
    }, [stepConfig.moveOnClick, targetElement, onNext]);

    // Memoize the step config's end tour label or fallback.
    // For the last step, the end button shows the tour's endTourLabel.
    // For non-last steps, the end button shows "Skip tour".

    return (
        <>
            <TourBackdrop
                targetElement={targetElement}
                visible={!!stepConfig.backdrop}
                onClick={onEnd}
            />
            <span
                ref={containerRef}
                data-flexitour="container"
                className={isOrphan ? 'orphan' : undefined}
                role="dialog"
                tabIndex={0}
                aria-labelledby={`${stepId}-title`}
                aria-describedby={`${stepId}-body`}
                id={stepId}
                style={{
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 0.15s ease-in',
                }}
            >
                <div className="modal">
                    <div className="modal-dialog" role="document" data-role="flexitour-step">
                        <div className="modal-content">
                            <div className="tooltip-arrow" data-role="arrow" />
                            <div className="modal-header">
                                <h5
                                    className="modal-title"
                                    id={`${stepId}-title`}
                                    dangerouslySetInnerHTML={{__html: stepConfig.title}}
                                />
                            </div>
                            <div
                                className="modal-body"
                                id={`${stepId}-body`}
                                role="document"
                                aria-labelledby={`${stepId}-body`}
                                dangerouslySetInnerHTML={{__html: stepConfig.body}}
                            />
                            <div className="modal-footer">
                                {!isLastStep && (
                                    <Button
                                        variant="secondary"
                                        data-role="skip"
                                        onClick={onEnd}
                                        label={
                                            <String
                                                identifier="skip_tour"
                                                component="tool_usertours"
                                            /> as unknown as string
                                        }
                                    />
                                )}
                                {!isLastStep && (
                                    <Button
                                        variant="primary"
                                        data-role="next"
                                        onClick={onNext}
                                        label={
                                            displayStepNumbers && stepInfo ? (
                                                <String
                                                    identifier="nextstep_sequence"
                                                    component="tool_usertours"
                                                    params={{
                                                        position: stepInfo.position,
                                                        total: totalVisibleSteps,
                                                    }}
                                                /> as unknown as string
                                            ) : (
                                                <String
                                                    identifier="nextstep"
                                                    component="tool_usertours"
                                                /> as unknown as string
                                            )
                                        }
                                    />
                                )}
                                {isLastStep && (
                                    <Button
                                        variant="primary"
                                        data-role="end"
                                        onClick={onEnd}
                                        label={endTourLabel}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        </>
    );
};

TourStep.displayName = 'TourStep';
export default TourStep;
