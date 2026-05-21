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
 * Availability condition: Group membership.
 *
 * @module     availability_group/form
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useState, useEffect} from 'react';
import type {ComponentType} from 'react';
import {AvailabilityPlugin} from '@moodle/lms/core_availability/types';
import type {PluginComponentProps, ConditionJSON} from '@moodle/lms/core_availability/types';

interface GroupItem {
    id: number;
    name: string;
}

/**
 * React component for the Group condition form.
 */
const GroupForm: ComponentType<PluginComponentProps> = ({json, onChange, onValidate, initParams}) => {
    const groups = (initParams[0] ?? []) as GroupItem[];
    const [selectedId, setSelectedId] = useState<string>(() => {
        if (json.id !== undefined) {
            return String(json.id);
        }
        return 'choose';
    });

    useEffect(() => {
        if (selectedId === 'choose') {
            onValidate(['availability_group:error_selectgroup']);
        } else {
            onValidate([]);
            const condition: ConditionJSON = {type: 'group'};
            if (selectedId !== 'any') {
                condition.id = Number(selectedId);
            }
            onChange(condition);
        }
    }, [selectedId]);

    return (
        <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="form-select mx-1"
        >
            <option value="choose">{M.util.get_string('choosedots', 'moodle')}</option>
            <option value="any">{M.util.get_string('anygroup', 'availability_group')}</option>
            {groups.map((group) => (
                <option key={group.id} value={String(group.id)}>
                    {group.name}
                </option>
            ))}
        </select>
    );
};

/**
 * Availability plugin: Group membership.
 */
export default class GroupPlugin extends AvailabilityPlugin {
    getComponent(): ComponentType<PluginComponentProps> {
        return GroupForm;
    }

    fillValue(formState: Record<string, unknown>): ConditionJSON {
        const result: ConditionJSON = {type: 'group'};
        if (formState.id !== undefined) {
            result.id = formState.id;
        }
        return result;
    }

    validate(formState: Record<string, unknown>): string[] {
        if (formState.id === undefined && formState.type === 'group') {
            // "any group" is valid
            return [];
        }
        return [];
    }
}
