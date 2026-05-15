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

import React from 'react';
import {render, screen, act, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserTours from '../src/UserTours';

// Mock the filter loader module.
jest.mock('../src/loadFilters', () => ({
    loadFilterModules: jest.fn().mockResolvedValue([]),
}));

jest.mock('../src/useTourApi');
jest.mock('@popperjs/core', () => ({
    createPopper: jest.fn(() => ({
        update: jest.fn(),
        destroy: jest.fn(),
    })),
}));

import {loadFilterModules} from '../src/loadFilters';
import {useTourApi} from '../src/useTourApi';

const mockFetchTour = jest.fn();
const mockMarkStepShown = jest.fn();
const mockMarkTourComplete = jest.fn();
const mockResetTourState = jest.fn();

(useTourApi as jest.Mock).mockReturnValue({
    fetchTour: mockFetchTour,
    markStepShown: mockMarkStepShown,
    markTourComplete: mockMarkTourComplete,
    resetTourState: mockResetTourState,
});

const tourConfig = {
    name: 'Test Tour',
    endtourlabel: 'Got it',
    displaystepnumbers: false,
    steps: [
        {
            stepid: 1,
            title: 'Step 1',
            body: '<p>Welcome!</p>',
            target: '',
            placement: 'bottom' as const,
            delay: 0,
            moveOnClick: false,
            orphan: true,
            backdrop: false,
            stepNumber: 0,
        },
    ],
};

const tourDetails = [
    {
        tourId: 42,
        startTour: true,
        filtervalues: {cssselector: ['']},
    },
];

describe('UserTours', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFetchTour.mockResolvedValue(tourConfig);
        mockResetTourState.mockResolvedValue(null);
        mockMarkStepShown.mockResolvedValue(undefined);
        mockMarkTourComplete.mockResolvedValue(undefined);
        (loadFilterModules as jest.Mock).mockResolvedValue([]);

        mockString('resettouronpage', 'tool_usertours', 'Reset user tour on this page');
        mockString('nextstep', 'tool_usertours', 'Next');
        mockString('nextstep_sequence', 'tool_usertours', 'Next (1/1)');
        mockString('skip_tour', 'tool_usertours', 'Skip tour');
        mockString('endtour', 'tool_usertours', 'End tour');
    });

    it('renders the reset link when a matching tour is found', async () => {
        await act(async () => {
            render(<UserTours tourDetails={tourDetails} filterNames={[]} />);
        });

        await waitFor(() => {
            expect(screen.getByText('Reset user tour on this page')).toBeInTheDocument();
        });
    });

    it('fetches and renders the tour when startTour is true', async () => {
        await act(async () => {
            render(<UserTours tourDetails={tourDetails} filterNames={[]} />);
        });

        await waitFor(() => {
            expect(mockFetchTour).toHaveBeenCalledWith(42);
        });

        await waitFor(() => {
            expect(screen.getByText('Step 1')).toBeInTheDocument();
        });
    });

    it('does not fetch tour when startTour is false', async () => {
        const noStartDetails = [
            {...tourDetails[0], startTour: false},
        ];

        await act(async () => {
            render(<UserTours tourDetails={noStartDetails} filterNames={[]} />);
        });

        await waitFor(() => {
            expect(screen.getByText('Reset user tour on this page')).toBeInTheDocument();
        });

        expect(mockFetchTour).not.toHaveBeenCalled();
    });

    it('loads and applies client-side filters', async () => {
        const matchingFilter = {
            filterMatches: jest.fn().mockReturnValue(true),
        };
        (loadFilterModules as jest.Mock).mockResolvedValue([matchingFilter]);

        await act(async () => {
            render(
                <UserTours
                    tourDetails={tourDetails}
                    filterNames={['tool_usertours/filter_cssselector']}
                />,
            );
        });

        await waitFor(() => {
            expect(loadFilterModules).toHaveBeenCalledWith(['tool_usertours/filter_cssselector']);
        });

        await waitFor(() => {
            expect(matchingFilter.filterMatches).toHaveBeenCalledWith(tourDetails[0]);
        });
    });

    it('does not render tour when filters reject all tours', async () => {
        const rejectingFilter = {
            filterMatches: jest.fn().mockReturnValue(false),
        };
        (loadFilterModules as jest.Mock).mockResolvedValue([rejectingFilter]);

        await act(async () => {
            render(
                <UserTours
                    tourDetails={tourDetails}
                    filterNames={['tool_usertours/filter_cssselector']}
                />,
            );
        });

        await waitFor(() => {
            expect(rejectingFilter.filterMatches).toHaveBeenCalled();
        });

        expect(mockFetchTour).not.toHaveBeenCalled();
        expect(screen.queryByText('Step 1')).not.toBeInTheDocument();
    });

    it('resets tour state when reset link is clicked', async () => {
        mockResetTourState.mockResolvedValue(42);

        await act(async () => {
            render(<UserTours tourDetails={tourDetails} filterNames={[]} />);
        });

        await waitFor(() => {
            expect(screen.getByText('Reset user tour on this page')).toBeInTheDocument();
        });

        const user = userEvent.setup();
        await user.click(screen.getByText('Reset user tour on this page'));

        await waitFor(() => {
            expect(mockResetTourState).toHaveBeenCalledWith(42);
        });

        // After reset returns a new tourId, it should re-fetch.
        await waitFor(() => {
            expect(mockFetchTour).toHaveBeenCalledTimes(2);
        });
    });

    it('renders nothing when no tours match', async () => {
        const {container} = render(
            <UserTours tourDetails={[]} filterNames={[]} />,
        );

        // Give time for effects to run.
        await act(async () => {});

        expect(mockFetchTour).not.toHaveBeenCalled();
        expect(container.innerHTML).toBe('');
    });

    it('selects the first matching tour from multiple candidates', async () => {
        const multiTours = [
            {tourId: 10, startTour: true, filtervalues: {cssselector: ['.nonexistent']}},
            {tourId: 20, startTour: true, filtervalues: {cssselector: ['']}},
        ];

        // First filter rejects tour 10, accepts tour 20.
        const selectiveFilter = {
            filterMatches: jest.fn().mockImplementation((tour: {tourId: number}) => tour.tourId === 20),
        };
        (loadFilterModules as jest.Mock).mockResolvedValue([selectiveFilter]);

        await act(async () => {
            render(
                <UserTours
                    tourDetails={multiTours}
                    filterNames={['tool_usertours/filter_cssselector']}
                />,
            );
        });

        await waitFor(() => {
            expect(mockFetchTour).toHaveBeenCalledWith(20);
        });
    });
});
