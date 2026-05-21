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
 * Availability condition: Grouping membership.
 *
 * @module     availability_grouping/form
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useState, useEffect} from 'react';
import type {ComponentType} from 'react';
import {AvailabilityPlugin} from '@moodle/lms/core_availability/types';
import type {PluginComponentProps, ConditionJSON} from '@moodle/lms/core_availability/types';

interface GroupingItem {
    id: number;
    name: string;
}

/**
 * React component for the Grouping condition form.
 */
const GroupingForm: ComponentType<PluginComponentProps> = ({json, onChange, onValidate, initParams}) => {
    const groupings = (initParams[0] ?? []) as GroupingItem[];
    const [selectedId, setSelectedId] = useState<string>(() => {
        if (json.id !== undefined) {
            return String(json.id);
        }
        return 'choose';
    });

    useEffect(() => {
        if (selectedId === 'choose') {
            onValidate(['availability_grouping:error_selectgrouping']);
        } else {
            onValidate([]);
            onChange({type: 'grouping', id: Number(selectedId)});
        }
    }, [selectedId]);

    return (
        <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="form-select mx-1"
        >
            <option value="choose">{M.util.get_string('choosedots', 'moodle')}</option>
            {groupings.map((grouping) => (
                <option key={grouping.id} value={String(grouping.id)}>
                    {grouping.name}
                </option>
            ))}
        </select>
    );
};

/**
 * Availability plugin: Grouping membership.
 */
export default class GroupingPlugin extends AvailabilityPlugin {
    getComponent(): ComponentType<PluginComponentProps> {
        return GroupingForm;
    }

    fillValue(formState: Record<string, unknown>): ConditionJSON {
        return {type: 'grouping', id: Number(formState.id)};
    }

    validate(formState: Record<string, unknown>): string[] {
        if (!formState.id) {
            return ['availability_grouping:error_selectgrouping'];
        }
        return [];
    }
}
