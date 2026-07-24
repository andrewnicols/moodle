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
 * Error and informational banners shown above the login form.
 *
 * The accompanying "move focus to the error / info message, then to the username field"
 * behaviour is handled by the parent {@link module:core_auth/LoginForm} component, since it
 * needs to coordinate with the login fields themselves.
 *
 * @module     core_auth/local/LoginForm/ErrorInfo
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import React from 'react';

/** Props for the {@link ErrorInfo} component. */
export interface ErrorInfoProps {
    /** The error message to display, if any. */
    error?: string | null;
    /** An optional bold heading shown above the error message. */
    errorTitle?: string | null;
    /** An informational message to display, if any. */
    info?: string | null;
}

export default function ErrorInfo({error, errorTitle, info}: ErrorInfoProps): React.ReactElement {
    return (
        <>
            {error && (
                <div className="alert alert-danger" id="loginerrormessage" role="alert">
                    {errorTitle && <strong className="d-block mb-1">{errorTitle}</strong>}
                    {error}
                </div>
            )}
            {info && (
                <div className="alert alert-info" id="logininfomessage" role="status">{info}</div>
            )}
        </>
    );
}
