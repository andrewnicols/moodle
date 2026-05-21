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
 * Eye icon (visibility toggle) for availability conditions.
 *
 * Toggles whether a condition is shown greyed out or completely hidden
 * when the student does not meet the requirement.
 *
 * @module     core_availability/components/EyeIcon
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

interface EyeIconProps {
    /** Whether the condition is visible (shown greyed out) to students. */
    visible: boolean;
    /** Callback when the visibility is toggled. */
    onToggle: (visible: boolean) => void;
}

export function EyeIcon({visible, onToggle}: EyeIconProps) {
    const title = visible
        ? 'Displayed greyed-out if student does not meet this condition'
        : 'Completely hidden if student does not meet this condition';

    const iconClass = visible ? 'bi-eye' : 'bi-eye-slash';

    return (
        <button
            type="button"
            className="availability-eye btn btn-link p-1"
            title={title}
            aria-label={title}
            aria-pressed={visible}
            onClick={() => onToggle(!visible)}
        >
            <i className={`bi ${iconClass}`} aria-hidden="true" />
        </button>
    );
}
