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
 * Tests for the Tour React component.
 *
 * @module     tool_usertours/Tour.test
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tour from '../src/TourComponent';
import type {TourConfig} from '../src/types';

// Mock useTourApi — the component calls these internally.
const mockMarkStepShown = jest.fn().mockResolvedValue(undefined);
const mockMarkTourComplete = jest.fn().mockResolvedValue(undefined);

jest.mock('../src/useTourApi', () => ({
    markStepShown: (...args: unknown[]) => mockMarkStepShown(...args),
    markTourComplete: (...args: unknown[]) => mockMarkTourComplete(...args),
}));

beforeEach(() => {
    mockString('nextstep', 'tool_usertours', 'Next');
    mockString('nextstep_sequence', 'tool_usertours', 'Next ({$a->position}/{$a->total})');
    mockString('skip_tour', 'tool_usertours', 'Skip tour');
    mockMarkStepShown.mockClear();
    mockMarkTourComplete.mockClear();
});

// Mock @popperjs/core.
jest.mock('@popperjs/core', () => ({
    createPopper: jest.fn(() => ({
        destroy: jest.fn(),
        update: jest.fn(),
        forceUpdate: jest.fn(),
        setOptions: jest.fn(),
        state: {},
    })),
}));

const baseTourConfig: TourConfig = {
    name: 'test_tour',
    endtourlabel: 'Got it',
    displaystepnumbers: false,
    steps: [
        {
            stepid: 1,
            title: 'Step 1 Title',
            body: 'Step 1 body content',
            target: '',
            placement: 'bottom',
            delay: 0,
            moveOnClick: false,
            orphan: true,
            backdrop: false,
            stepNumber: 0,
        },
        {
            stepid: 2,
            title: 'Step 2 Title',
            body: 'Step 2 body content',
            target: '',
            placement: 'top',
            delay: 0,
            moveOnClick: false,
            orphan: true,
            backdrop: false,
            stepNumber: 1,
        },
    ],
};

describe('Tour', () => {
    beforeEach(() => {
        // Clear session storage before each test.
        window.sessionStorage.clear();
    });

    it('renders the first step on mount', async () => {
        await act(async () => {
            render(<Tour tourConfig={baseTourConfig} tourId={1} />);
        });

        // Allow string fetching to resolve.
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });

        expect(screen.getByText('Step 1 Title')).toBeTruthy();
        expect(screen.getByText('Step 1 body content')).toBeTruthy();
    });

    it('renders with correct ARIA attributes', async () => {
        await act(async () => {
            render(<Tour tourConfig={baseTourConfig} tourId={1} />);
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });

        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeTruthy();
        expect(dialog.getAttribute('aria-labelledby')).toBe('tour-step-test_tour-0-title');
        expect(dialog.getAttribute('aria-describedby')).toBe('tour-step-test_tour-0-body');
    });

    it('calls markTourComplete when end button is clicked', async () => {
        await act(async () => {
            render(
                <Tour
                    tourConfig={baseTourConfig}
                    tourId={1}
                />,
            );
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });

        const endButton = screen.getByRole('button', {name: /skip tour|got it/i});
        await userEvent.click(endButton);

        expect(mockMarkTourComplete).toHaveBeenCalled();
    });

    it('advances to next step when next button is clicked', async () => {
        await act(async () => {
            render(<Tour tourConfig={baseTourConfig} tourId={1} />);
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });

        // Should show step 1 initially.
        expect(screen.getByText('Step 1 Title')).toBeTruthy();

        // Click next.
        const nextButton = screen.getByRole('button', {name: /next/i});
        await userEvent.click(nextButton);

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });

        // Should now show step 2.
        expect(screen.getByText('Step 2 Title')).toBeTruthy();
    });

    it('dispatches custom DOM events', async () => {
        const tourStartHandler = jest.fn();
        const tourStartedHandler = jest.fn();

        document.addEventListener('tool_usertours/tourStart', tourStartHandler);
        document.addEventListener('tool_usertours/tourStarted', tourStartedHandler);

        await act(async () => {
            render(<Tour tourConfig={baseTourConfig} tourId={1} />);
        });

        expect(tourStartHandler).toHaveBeenCalled();
        expect(tourStartedHandler).toHaveBeenCalled();

        document.removeEventListener('tool_usertours/tourStart', tourStartHandler);
        document.removeEventListener('tool_usertours/tourStarted', tourStartedHandler);
    });

    it('closes on Escape key', async () => {
        await act(async () => {
            render(<Tour tourConfig={baseTourConfig} tourId={1} />);
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });

        await userEvent.keyboard('{Escape}');

        expect(mockMarkTourComplete).toHaveBeenCalled();
    });

    it('starts at a specific step number', async () => {
        await act(async () => {
            render(<Tour tourConfig={baseTourConfig} tourId={1} startAt={1} />);
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });

        expect(screen.getByText('Step 2 Title')).toBeTruthy();
    });

    it('shows step numbers when displaystepnumbers is true', async () => {
        const config: TourConfig = {
            ...baseTourConfig,
            displaystepnumbers: true,
        };

        await act(async () => {
            render(<Tour tourConfig={config} tourId={1} />);
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));
        });

        // The next button should show "Next (1/2)" for the first step.
        expect(screen.getByText('Next (1/2)')).toBeTruthy();
    });

    it('shows endtourlabel on the last step', async () => {
        const singleStepConfig: TourConfig = {
            ...baseTourConfig,
            steps: [baseTourConfig.steps[0]],
        };

        await act(async () => {
            render(<Tour tourConfig={singleStepConfig} tourId={1} />);
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
        });

        expect(screen.getByText('Got it')).toBeTruthy();
    });
});
