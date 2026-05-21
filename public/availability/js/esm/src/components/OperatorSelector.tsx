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
 * Operator selector component for availability condition lists.
 *
 * Renders a dropdown allowing the user to choose how sibling conditions
 * are combined (AND, OR, NOT-AND, NOT-OR).
 *
 * @module     core_availability/components/OperatorSelector
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import type {TreeOperator} from '../types';

interface OperatorSelectorProps {
    /** Current operator value. */
    value: TreeOperator;
    /** Callback when the operator changes. */
    onChange: (op: TreeOperator) => void;
    /** Whether the selector is disabled (e.g. single-child lists). */
    disabled?: boolean;
}

const OPERATOR_LABELS: Record<TreeOperator, string> = {
    '&': 'must match all',
    '|': 'must match any',
    '!&': 'must not match all',
    '!|': 'must not match any',
};

export function OperatorSelector({value, onChange, disabled}: OperatorSelectorProps) {
    return (
        <select
            className="availability-operator-select form-select"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value as TreeOperator)}
            aria-label="Restriction combination type"
        >
            {Object.entries(OPERATOR_LABELS).map(([op, label]) => (
                <option key={op} value={op}>
                    {label}
                </option>
            ))}
        </select>
    );
}
