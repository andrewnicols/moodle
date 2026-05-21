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
 * Availability condition: User profile field.
 *
 * @module     availability_profile/form
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useState, useEffect, useCallback} from 'react';
import type {ComponentType} from 'react';
import {AvailabilityPlugin} from '@moodle/lms/core_availability/types';
import type {PluginComponentProps, ConditionJSON} from '@moodle/lms/core_availability/types';

interface FieldOption {
    field: string;
    display: string;
}

type Operator = 'isequalto' | 'contains' | 'doesnotcontain' | 'startswith' | 'endswith' | 'isempty' | 'isnotempty';

const OPERATORS: Operator[] = [
    'isequalto',
    'contains',
    'doesnotcontain',
    'startswith',
    'endswith',
    'isempty',
    'isnotempty',
];

/** Operators that don't require a comparison value. */
const VALUE_NOT_REQUIRED: Set<Operator> = new Set(['isempty', 'isnotempty']);

/**
 * React component for the Profile condition form.
 */
const ProfileForm: ComponentType<PluginComponentProps> = ({json, onChange, onValidate, initParams}) => {
    const standardFields = (initParams[0] ?? []) as FieldOption[];
    const customFields = (initParams[1] ?? []) as FieldOption[];

    // Determine initial field selection from saved JSON.
    const getInitialField = (): string => {
        if (json.sf) {
            return `sf_${json.sf}`;
        }
        if (json.cf) {
            return `cf_${json.cf}`;
        }
        return 'choose';
    };

    const [field, setField] = useState<string>(getInitialField);
    const [operator, setOperator] = useState<Operator>(() => (json.op as Operator) ?? 'isequalto');
    const [value, setValue] = useState<string>(() => (json.v as string) ?? '');

    const needsValue = !VALUE_NOT_REQUIRED.has(operator);

    const validateAndEmit = useCallback(() => {
        const errors: string[] = [];

        if (field === 'choose') {
            errors.push('availability_profile:error_selectfield');
        }

        if (needsValue && value.trim() === '' && field !== 'choose') {
            errors.push('availability_profile:error_setvalue');
        }

        onValidate(errors);

        if (errors.length === 0 && field !== 'choose') {
            const condition: ConditionJSON = {type: 'profile', op: operator};
            if (field.startsWith('sf_')) {
                condition.sf = field.substring(3);
            } else if (field.startsWith('cf_')) {
                condition.cf = field.substring(3);
            }
            if (needsValue) {
                condition.v = value;
            }
            onChange(condition);
        }
    }, [field, operator, value, needsValue, onChange, onValidate]);

    useEffect(() => {
        validateAndEmit();
    }, [validateAndEmit]);

    return (
        <span className="d-inline-flex align-items-center flex-wrap gap-1">
            <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="form-select mx-1"
                style={{width: 'auto'}}
            >
                <option value="choose">{M.util.get_string('choosedots', 'moodle')}</option>
                {standardFields.length > 0 && (
                    <optgroup label={M.util.get_string('standardfields', 'availability_profile')}>
                        {standardFields.map((f) => (
                            <option key={`sf_${f.field}`} value={`sf_${f.field}`}>
                                {f.display}
                            </option>
                        ))}
                    </optgroup>
                )}
                {customFields.length > 0 && (
                    <optgroup label={M.util.get_string('customfields', 'availability_profile')}>
                        {customFields.map((f) => (
                            <option key={`cf_${f.field}`} value={`cf_${f.field}`}>
                                {f.display}
                            </option>
                        ))}
                    </optgroup>
                )}
            </select>

            <select
                value={operator}
                onChange={(e) => setOperator(e.target.value as Operator)}
                className="form-select mx-1"
                style={{width: 'auto'}}
            >
                {OPERATORS.map((op) => (
                    <option key={op} value={op}>
                        {M.util.get_string(`op_${op}`, 'availability_profile')}
                    </option>
                ))}
            </select>

            {needsValue && (
                <input
                    type="text"
                    className="form-control mx-1"
                    style={{width: 'auto', minWidth: '10em'}}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    aria-label={M.util.get_string('conditiontitle', 'availability_profile')}
                />
            )}
        </span>
    );
};

/**
 * Availability plugin: User profile field.
 */
export default class ProfilePlugin extends AvailabilityPlugin {
    getComponent(): ComponentType<PluginComponentProps> {
        return ProfileForm;
    }

    fillValue(formState: Record<string, unknown>): ConditionJSON {
        const condition: ConditionJSON = {type: 'profile', op: formState.op as string};
        if (formState.sf) {
            condition.sf = formState.sf;
        } else if (formState.cf) {
            condition.cf = formState.cf;
        }
        if (formState.v !== undefined) {
            condition.v = formState.v;
        }
        return condition;
    }

    validate(formState: Record<string, unknown>): string[] {
        const errors: string[] = [];
        if (!formState.sf && !formState.cf) {
            errors.push('availability_profile:error_selectfield');
        }
        const op = formState.op as Operator;
        if (!VALUE_NOT_REQUIRED.has(op) && (!formState.v || String(formState.v).trim() === '')) {
            errors.push('availability_profile:error_setvalue');
        }
        return errors;
    }
}
