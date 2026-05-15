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
 * TourBackdrop component for User Tours.
 *
 * Renders a full-viewport overlay with a clip-path cutout that highlights
 * the target element of the current tour step. The cutout has rounded corners
 * drawn with cubic Bézier curves to match the original implementation.
 *
 * @module     tool_usertours/TourBackdrop
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {type FC, useEffect, useState} from 'react';

/** Padding around the target element for the cutout. */
const BUFFER = 10;

/** Border radius for the cutout corners. */
const RADIUS = 10;

interface TourBackdropProps {
    /** The target DOM element to highlight. Null for orphan steps. */
    targetElement: HTMLElement | null;
    /** Whether the backdrop is visible. */
    visible: boolean;
    /** Called when the backdrop itself is clicked (to dismiss the tour). */
    onClick?: () => void;
}

/**
 * Build the SVG clip-path string that creates a viewport-sized backdrop
 * with a rounded rectangular cutout around the target element.
 */
function buildClipPath(target: HTMLElement): string {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const rect = target.getBoundingClientRect();
    const scrollTop = window.scrollY;

    const elementWidth = target.offsetWidth + BUFFER * 2;
    let elementHeight = target.offsetHeight + BUFFER * 2;
    const elementLeft = rect.left + window.scrollX - BUFFER;
    let elementTop = rect.top + scrollTop - BUFFER;

    // Compensate for fixed navbar overlap.
    const scroller = target.closest('[data-usertour="scroller"]');
    if (scroller) {
        const scrollerRect = scroller.getBoundingClientRect();
        const navbarHeight = scrollerRect.top + scrollTop;
        const navbarOverlap = Math.max(Math.ceil(navbarHeight - elementTop), 0);
        elementTop += navbarOverlap;
        elementHeight -= navbarOverlap;
    }

    const bottomRight = {
        x1: elementLeft + elementWidth - RADIUS,
        y1: elementTop + elementHeight,
        x2: elementLeft + elementWidth,
        y2: elementTop + elementHeight - RADIUS,
    };
    const topRight = {
        x1: elementLeft + elementWidth,
        y1: elementTop + RADIUS,
        x2: elementLeft + elementWidth - RADIUS,
        y2: elementTop,
    };
    const topLeft = {
        x1: elementLeft + RADIUS,
        y1: elementTop,
        x2: elementLeft,
        y2: elementTop + RADIUS,
    };
    const bottomLeft = {
        x1: elementLeft,
        y1: elementTop + elementHeight - RADIUS,
        x2: elementLeft + RADIUS,
        y2: elementTop + elementHeight,
    };

    return `path('M 0 0 \
L ${viewportWidth} 0 \
L ${viewportWidth} ${viewportHeight} \
L 0 ${viewportHeight} \
L 0 ${elementTop + elementHeight} \
L ${bottomRight.x1} ${bottomRight.y1} \
C ${bottomRight.x1} ${bottomRight.y1} ${bottomRight.x2} ${bottomRight.y1} ${bottomRight.x2} ${bottomRight.y2} \
L ${topRight.x1} ${topRight.y1} \
C ${topRight.x1} ${topRight.y1} ${topRight.x1} ${topRight.y2} ${topRight.x2} ${topRight.y2} \
L ${topLeft.x1} ${topLeft.y1} \
C ${topLeft.x1} ${topLeft.y1} ${topLeft.x2} ${topLeft.y1} ${topLeft.x2} ${topLeft.y2} \
L ${bottomLeft.x1} ${bottomLeft.y1} \
C ${bottomLeft.x1} ${bottomLeft.y1} ${bottomLeft.x1} ${bottomLeft.y2} ${bottomLeft.x2} ${bottomLeft.y2} \
L 0 ${elementTop + elementHeight} \
Z')`;
}

const TourBackdrop: FC<TourBackdropProps> = ({targetElement, visible, onClick}) => {
    const [clipPath, setClipPath] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!visible || !targetElement) {
            setClipPath(undefined);
            return;
        }

        const updateClipPath = () => {
            setClipPath(buildClipPath(targetElement));
        };

        updateClipPath();

        // Recalculate on scroll and resize.
        window.addEventListener('scroll', updateClipPath, {passive: true});
        window.addEventListener('resize', updateClipPath, {passive: true});

        return () => {
            window.removeEventListener('scroll', updateClipPath);
            window.removeEventListener('resize', updateClipPath);
        };
    }, [visible, targetElement]);

    if (!visible) {
        return null;
    }

    return (
        <div
            data-flexitour="backdrop"
            onClick={onClick}
            style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                clipPath: clipPath,
            }}
        />
    );
};

TourBackdrop.displayName = 'TourBackdrop';
export default TourBackdrop;
