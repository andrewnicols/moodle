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
 * A maintenance mode banner shown above the login form.
 *
 * @module     core_auth/local/LoginForm/Maintenance
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import React from 'react';

export interface MaintenanceProps {
    /** A maintenance mode message to display, if the site is in maintenance mode. */
    maintenance?: string | null;
}

export default function Maintenance({maintenance}: MaintenanceProps): React.ReactElement | null {
    if (!maintenance) {
        return null;
    }

    return (
        <div className="alert alert-danger login-maintenance">
            {/* The maintenance message is formatted server-side before storage. */}
            <div dangerouslySetInnerHTML={{__html: maintenance}} />
        </div>
    );
}
