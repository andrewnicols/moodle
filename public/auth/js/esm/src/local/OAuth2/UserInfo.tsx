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
 * The current user's picture and name, shown on the OAuth2 authorization pages.
 *
 * @module     core_auth/local/OAuth2/UserInfo
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import React from 'react';

/** Props for the {@link UserInfo} component. */
export interface UserInfoProps {
    /** Pre-rendered `user_picture` HTML (including the user's name) for the logged-in user. */
    userPictureHtml: string;
}

export default function UserInfo({userPictureHtml}: UserInfoProps): React.ReactElement {
    return (
        <div className="p-1 mt-2 mb-2 w-100 d-flex flex-row">
            <div className="picture">
                {/* The user picture is rendered and trusted server-side. */}
                <div dangerouslySetInnerHTML={{__html: userPictureHtml}} />
            </div>
        </div>
    );
}
