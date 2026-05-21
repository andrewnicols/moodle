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
 * Availability condition: Activity completion.
 *
 * @module     availability_completion/form
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useState, useEffect} from 'react';
import type {ComponentType} from 'react';
import {AvailabilityPlugin} from '@moodle/lms/core_availability/types';
import type {PluginComponentProps, ConditionJSON} from '@moodle/lms/core_availability/types';

/** Completion state constants matching core definitions. */
const COMPLETION_INCOMPLETE = 0;
const COMPLETION_COMPLETE = 1;
const COMPLETION_COMPLETE_PASS = 2;
const COMPLETION_COMPLETE_FAIL = 3;

interface CompletionModule {
    id: number;
    name: string;
    completiongradeitemnumber: number | null;
}

/**
 * React component for the Completion condition form.
 */
const CompletionForm: ComponentType<PluginComponentProps> = ({json, onChange, onValidate, initParams}) => {
    const modules = (initParams[0] ?? []) as CompletionModule[];

    const [cmId, setCmId] = useState<string>(() =>
        json.cm !== undefined ? String(json.cm) : '0',
    );
    const [expectedState, setExpectedState] = useState<string>(() =>
        json.e !== undefined ? String(json.e) : String(COMPLETION_COMPLETE),
    );

    // Determine if selected module supports pass/fail.
    const selectedModule = modules.find((m) => m.id === Number(cmId));
    const hasGrade = selectedModule?.completiongradeitemnumber !== null;

    useEffect(() => {
        const errors: string[] = [];
        const id = Number(cmId);
        const state = Number(expectedState);

        if (id === 0) {
            errors.push('availability_completion:error_selectcmid');
        }

        // Pass/fail states require a grade item.
        if (
            id !== 0 &&
            (state === COMPLETION_COMPLETE_PASS || state === COMPLETION_COMPLETE_FAIL) &&
            !hasGrade
        ) {
            errors.push('availability_completion:error_selectcmidpassfail');
        }

        onValidate(errors);

        if (errors.length === 0 && id !== 0) {
            onChange({type: 'completion', cm: id, e: state});
        }
    }, [cmId, expectedState, hasGrade]);

    return (
        <span className="d-inline-flex align-items-center gap-1">
            <select
                value={cmId}
                onChange={(e) => setCmId(e.target.value)}
                className="form-select mx-1"
                style={{width: 'auto'}}
            >
                <option value="0">{M.util.get_string('choosedots', 'moodle')}</option>
                {modules.map((mod) => (
                    <option key={mod.id} value={String(mod.id)}>
                        {mod.name}
                    </option>
                ))}
            </select>

            <select
                value={expectedState}
                onChange={(e) => setExpectedState(e.target.value)}
                className="form-select mx-1"
                style={{width: 'auto'}}
            >
                <option value={String(COMPLETION_COMPLETE)}>
                    {M.util.get_string('option_complete', 'availability_completion')}
                </option>
                <option value={String(COMPLETION_INCOMPLETE)}>
                    {M.util.get_string('option_incomplete', 'availability_completion')}
                </option>
                {hasGrade && (
                    <option value={String(COMPLETION_COMPLETE_PASS)}>
                        {M.util.get_string('option_pass', 'availability_completion')}
                    </option>
                )}
                {hasGrade && (
                    <option value={String(COMPLETION_COMPLETE_FAIL)}>
                        {M.util.get_string('option_fail', 'availability_completion')}
                    </option>
                )}
            </select>
        </span>
    );
};

/**
 * Availability plugin: Activity completion.
 */
export default class CompletionPlugin extends AvailabilityPlugin {
    getComponent(): ComponentType<PluginComponentProps> {
        return CompletionForm;
    }

    fillValue(formState: Record<string, unknown>): ConditionJSON {
        return {
            type: 'completion',
            cm: Number(formState.cm),
            e: Number(formState.e),
        };
    }

    validate(formState: Record<string, unknown>): string[] {
        const errors: string[] = [];
        if (!formState.cm || formState.cm === 0) {
            errors.push('availability_completion:error_selectcmid');
        }
        return errors;
    }
}
