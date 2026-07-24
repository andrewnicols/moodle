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
 * The site logo shown above the login form.
 *
 * @module     core_auth/local/LoginForm/Logo
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import React from 'react';

export interface LogoProps {
    /** The URL of the site logo, or false/undefined if no logo is configured. */
    logoUrl?: string | false | null;
    /** The site name, used as alt text for the logo. */
    siteName: string;
}

export default function Logo({logoUrl, siteName}: LogoProps): React.ReactElement | null {
    if (!logoUrl) {
        return null;
    }

    return (
        <div id="loginlogo" className="d-flex justify-content-center mb-4">
            <img id="logoimage" src={logoUrl} className="img-fluid" alt={siteName} />
        </div>
    );
}
