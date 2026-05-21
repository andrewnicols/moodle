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
 * Availability condition: Date restriction.
 *
 * The date condition uses server-rendered HTML for the date/time selectors
 * (to support calendar types and timezones), which is passed via initParams.
 *
 * @module     availability_date/form
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useState, useEffect, useRef, useCallback} from 'react';
import type {ComponentType} from 'react';
import {AvailabilityPlugin} from '@moodle/lms/core_availability/types';
import type {PluginComponentProps, ConditionJSON} from '@moodle/lms/core_availability/types';

type Direction = '>=' | '<';

/**
 * Extract the timestamp from the date/time select elements within a container.
 *
 * The server-rendered HTML contains selects with name patterns like:
 * x[year], x[month], x[day], x[hour], x[minute].
 */
function getTimestampFromSelects(container: HTMLElement): number {
    const getVal = (name: string): number => {
        const el = container.querySelector<HTMLSelectElement>(`select[name="x[${name}]"]`);
        return el ? Number(el.value) : 0;
    };

    const year = getVal('year');
    const month = getVal('month') - 1; // JS months are 0-based.
    const day = getVal('day');
    const hour = getVal('hour');
    const minute = getVal('minute');

    // Build a UTC timestamp (the PHP side handles timezone conversion).
    const date = new Date(Date.UTC(year, month, day, hour, minute, 0));
    return Math.floor(date.getTime() / 1000);
}

/**
 * Set the select values in a container from a Unix timestamp.
 */
function setSelectsFromTimestamp(container: HTMLElement, timestamp: number): void {
    const date = new Date(timestamp * 1000);
    const setVal = (name: string, value: number): void => {
        const el = container.querySelector<HTMLSelectElement>(`select[name="x[${name}]"]`);
        if (el) {
            el.value = String(value);
        }
    };

    setVal('year', date.getUTCFullYear());
    setVal('month', date.getUTCMonth() + 1);
    setVal('day', date.getUTCDate());
    setVal('hour', date.getUTCHours());
    setVal('minute', date.getUTCMinutes());
}

/**
 * React component for the Date condition form.
 */
const DateForm: ComponentType<PluginComponentProps> = ({json, onChange, onValidate, initParams}) => {
    const html = (initParams[0] ?? '') as string;
    const defaultTime = (initParams[1] ?? 0) as number;

    const dateContainerRef = useRef<HTMLDivElement>(null);
    const [direction, setDirection] = useState<Direction>(() => (json.d as Direction) ?? '>=');
    const [timestamp, setTimestamp] = useState<number>(() => (json.t as number) ?? defaultTime);
    const initialised = useRef(false);

    // Inject the server-rendered date HTML once.
    useEffect(() => {
        if (dateContainerRef.current && html && !initialised.current) {
            initialised.current = true;
            dateContainerRef.current.innerHTML = html;
            // If we have a saved timestamp, set the selects.
            if (json.t) {
                setSelectsFromTimestamp(dateContainerRef.current, json.t as number);
            }
            // Attach change listeners to all selects.
            const selects = dateContainerRef.current.querySelectorAll('select');
            const handleChange = () => {
                if (dateContainerRef.current) {
                    setTimestamp(getTimestampFromSelects(dateContainerRef.current));
                }
            };
            selects.forEach((sel) => sel.addEventListener('change', handleChange));
        }
    }, [html]);

    const emitValue = useCallback(() => {
        // Date conditions are always valid (they always have a value selected).
        onValidate([]);
        onChange({type: 'date', d: direction, t: timestamp});
    }, [direction, timestamp, onChange, onValidate]);

    useEffect(() => {
        emitValue();
    }, [emitValue]);

    return (
        <span className="d-inline-flex align-items-center gap-1">
            <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as Direction)}
                className="form-select mx-1"
                style={{width: 'auto'}}
            >
                <option value=">=">{M.util.get_string('direction_from', 'availability_date')}</option>
                <option value="<">{M.util.get_string('direction_until', 'availability_date')}</option>
            </select>

            <span ref={dateContainerRef} className="availability-date-selects" />
        </span>
    );
};

/**
 * Availability plugin: Date restriction.
 */
export default class DatePlugin extends AvailabilityPlugin {
    getComponent(): ComponentType<PluginComponentProps> {
        return DateForm;
    }

    fillValue(formState: Record<string, unknown>): ConditionJSON {
        return {
            type: 'date',
            d: (formState.d as string) ?? '>=',
            t: Number(formState.t) || 0,
        };
    }

    validate(_formState: Record<string, unknown>): string[] {
        // Date always has a valid default.
        return [];
    }
}
