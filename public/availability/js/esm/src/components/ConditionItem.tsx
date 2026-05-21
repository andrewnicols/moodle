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
 * Single condition item component.
 *
 * Wraps a plugin's React component and provides eye icon, delete button,
 * and error display. Handles graceful failure if a plugin is not found.
 *
 * @module     core_availability/components/ConditionItem
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useState, useCallback, useRef, useEffect} from 'react';
import type {ConditionJSON} from '../types';
import {useAvailability} from './AvailabilityContext';
import {EyeIcon} from './EyeIcon';
import {DeleteButton} from './DeleteButton';

interface ConditionItemProps {
    /** The condition JSON value. */
    condition: ConditionJSON;
    /** Path to the parent list in the tree (array of child indices). */
    path: number[];
    /** Index of this item within the parent list. */
    index: number;
    /** Whether this condition is shown to students (eye icon state). */
    visible: boolean;
    /** Whether this is a newly added item that should receive focus. */
    isNew?: boolean;
}

export function ConditionItem({condition, path, index, visible, isNew}: ConditionItemProps) {
    const {plugins, dispatch} = useAvailability();
    const [errors, setErrors] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const registration = plugins.get(condition.type);

    // Focus after add.
    useEffect(() => {
        if (isNew && containerRef.current && registration) {
            registration.plugin.focusAfterAdd(containerRef.current);
        }
    }, [isNew, registration]);

    const handleChange = useCallback((value: ConditionJSON) => {
        dispatch({type: 'UPDATE_CONDITION', path, index, condition: value});
    }, [dispatch, path, index]);

    const handleValidate = useCallback((newErrors: string[]) => {
        setErrors(newErrors);
    }, []);

    const handleDelete = useCallback(() => {
        dispatch({type: 'REMOVE_CONDITION', path, index});
    }, [dispatch, path, index]);

    const handleVisibilityToggle = useCallback((show: boolean) => {
        dispatch({type: 'SET_VISIBILITY', path, index, show});
    }, [dispatch, path, index]);

    // Plugin not found — render a warning but don't break the form.
    if (!registration) {
        return (
            <div className="availability-item availability-item-unknown alert alert-warning" role="alert">
                <span>Unknown condition type: <code>{condition.type}</code></span>
                <DeleteButton onDelete={handleDelete} />
            </div>
        );
    }

    const PluginComponent = registration.plugin.getComponent();

    return (
        <div
            className="availability-item d-flex align-items-start gap-2 mb-2"
            ref={containerRef}
            data-condition-type={condition.type}
        >
            <EyeIcon visible={visible} onToggle={handleVisibilityToggle} />

            <div className="availability-item-content flex-grow-1">
                <PluginComponent
                    json={condition}
                    onChange={handleChange}
                    onValidate={handleValidate}
                    initParams={registration.initParams}
                />

                {errors.length > 0 && (
                    <div className="availability-errors mt-1" role="alert" aria-live="polite">
                        {errors.map((error, i) => (
                            <div key={i} className="text-danger small">
                                {error}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <DeleteButton onDelete={handleDelete} />
        </div>
    );
}
