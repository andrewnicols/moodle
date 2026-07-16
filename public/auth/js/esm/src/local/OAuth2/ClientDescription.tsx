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
 * The OAuth2 client's description, shown on the OAuth2 authorization pages.
 *
 * @module     core_auth/local/OAuth2/ClientDescription
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import React from 'react';

/** Props for the {@link ClientDescription} component. */
export interface ClientDescriptionProps {
    /** The client's description, pre-formatted (HTML) server-side. */
    clientDescription?: string | null;
}

export default function ClientDescription({clientDescription}: ClientDescriptionProps): React.ReactElement | null {
    if (!clientDescription) {
        return null;
    }

    return (
        <div className="alert alert-primary d-flex align-items-center" role="alert">
            <i className="icon fa fa-info-circle" aria-hidden="true" />
            {/* The description is formatted server-side before storage. */}
            <div dangerouslySetInnerHTML={{__html: clientDescription}} />
        </div>
    );
}
