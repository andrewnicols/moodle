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
 * Unit tests for the Group availability condition plugin form.
 *
 * @module     availability_group/form
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {render, screen, fireEvent} from '@testing-library/react';
import GroupPlugin from '@moodle/lms/availability_group/form';
import type {PluginComponentProps, ConditionJSON} from '@moodle/lms/core_availability/types';
import {AvailabilityPlugin} from '@moodle/lms/core_availability/types';

declare const M: {
    util: {
        get_string: jest.Mock;
    };
};

describe('availability_group/form', () => {
    const mockGroups = [
        {id: 1, name: 'Group A'},
        {id: 2, name: 'Group B'},
        {id: 3, name: 'Group C'},
    ];

    beforeEach(() => {
        mockString('choosedots', 'moodle', 'Choose...');
        mockString('anygroup', 'availability_group', 'Any group');
    });

    describe('GroupPlugin class', () => {
        it('extends AvailabilityPlugin', () => {
            const plugin = new GroupPlugin();
            expect(plugin).toBeInstanceOf(AvailabilityPlugin);
        });

        it('returns a component from getComponent()', () => {
            const plugin = new GroupPlugin();
            const Component = plugin.getComponent();
            expect(Component).toBeDefined();
            expect(typeof Component).toBe('function');
        });

        it('fillValue returns correct JSON without id', () => {
            const plugin = new GroupPlugin();
            const result = plugin.fillValue({type: 'group'});
            expect(result).toEqual({type: 'group'});
        });

        it('fillValue includes id when present', () => {
            const plugin = new GroupPlugin();
            const result = plugin.fillValue({id: 5});
            expect(result).toEqual({type: 'group', id: 5});
        });
    });

    describe('GroupForm component', () => {
        let onChange: jest.Mock;
        let onValidate: jest.Mock;

        function renderForm(json: ConditionJSON = {type: 'group'}, groups = mockGroups) {
            onChange = jest.fn();
            onValidate = jest.fn();
            const props: PluginComponentProps = {
                json,
                onChange,
                onValidate,
                initParams: [groups],
            };
            const plugin = new GroupPlugin();
            const Component = plugin.getComponent();
            return render(<Component {...props} />);
        }

        it('renders a select element', () => {
            renderForm();
            const select = screen.getByRole('combobox');
            expect(select).toBeInTheDocument();
        });

        it('shows "Choose..." as the default option', () => {
            renderForm();
            expect(screen.getByText('Choose...')).toBeInTheDocument();
        });

        it('shows "Any group" option', () => {
            renderForm();
            expect(screen.getByText('Any group')).toBeInTheDocument();
        });

        it('renders all provided groups', () => {
            renderForm();
            expect(screen.getByText('Group A')).toBeInTheDocument();
            expect(screen.getByText('Group B')).toBeInTheDocument();
            expect(screen.getByText('Group C')).toBeInTheDocument();
        });

        it('reports validation error when "Choose..." is selected', () => {
            renderForm();
            expect(onValidate).toHaveBeenCalledWith(['availability_group:error_selectgroup']);
        });

        it('selects the group from existing JSON', () => {
            renderForm({type: 'group', id: 2});
            const select = screen.getByRole('combobox') as HTMLSelectElement;
            expect(select.value).toBe('2');
        });

        it('calls onChange when a group is selected', () => {
            renderForm();

            const select = screen.getByRole('combobox');
            fireEvent.change(select, {target: {value: '1'}});

            expect(onChange).toHaveBeenCalledWith({type: 'group', id: 1});
            expect(onValidate).toHaveBeenCalledWith([]);
        });

        it('calls onChange with no id for "any group"', () => {
            renderForm();

            const select = screen.getByRole('combobox');
            fireEvent.change(select, {target: {value: 'any'}});

            expect(onChange).toHaveBeenCalledWith({type: 'group'});
            expect(onValidate).toHaveBeenCalledWith([]);
        });

        it('renders empty list when no groups provided', () => {
            renderForm({type: 'group'}, []);
            const options = screen.getAllByRole('option');
            // "Choose..." and "Any group" only.
            expect(options).toHaveLength(2);
        });
    });
});
