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
 * Delete button for availability conditions and nested sets.
 *
 * @module     core_availability/components/DeleteButton
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

interface DeleteButtonProps {
    /** Callback when the delete button is clicked. */
    onDelete: () => void;
    /** Accessible label for the button. */
    label?: string;
}

export function DeleteButton({onDelete, label = 'Delete condition'}: DeleteButtonProps) {
    return (
        <button
            type="button"
            className="availability-delete btn btn-link p-1 text-danger"
            title={label}
            aria-label={label}
            onClick={onDelete}
        >
            <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
    );
}
