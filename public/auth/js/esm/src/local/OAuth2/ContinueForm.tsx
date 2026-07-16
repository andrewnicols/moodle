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
 * The "Continue as this user" / "Change user" form shown on the OAuth2 "continue as" page.
 *
 * @module     core_auth/local/OAuth2/ContinueForm
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import React, {useEffect, useState} from 'react';
import {Button} from '@moodlehq/design-system';
import {getString} from '@moodle/lms/core/stringUtils';

/** Props for the {@link ContinueForm} component. */
export interface ContinueFormProps {
    /** The URL the "continue as this user" form should be submitted to. */
    actionUrl: string;
    /** The URL the "change user" form should be submitted to. */
    logoutUrl: string;
    /** The session key used to protect both requests. */
    sesskey: string;
    /** The full name of the currently logged-in user. */
    fullName: string;
}

export default function ContinueForm({actionUrl, logoutUrl, sesskey, fullName}: ContinueFormProps): React.ReactElement {
    const [continueLabel, setContinueLabel] = useState('');
    const [changeUserLabel, setChangeUserLabel] = useState('');

    useEffect(() => {
        getString('oauth2:contineasuser', 'core', fullName).then(setContinueLabel);
        getString('oauth2:contineasuser:changeuser', 'core').then(setChangeUserLabel);
    }, [fullName]);

    return (
        <div className="d-flex d-inline p-2">
            <form method="post" action={actionUrl} className="w-50 m-1">
                <input type="hidden" name="sesskey" value={sesskey} />
                <input type="hidden" name="currentuser" value="1" />
                <Button
                    type="submit"
                    size="lg"
                    name="approve"
                    value="1"
                    variant="primary"
                    className="w-100"
                    label={continueLabel}
                />
            </form>

            <form method="post" action={logoutUrl} className="w-50 m-1">
                <input type="hidden" name="sesskey" value={sesskey} />
                <input type="hidden" name="currentuser" value="1" />
                <Button
                    type="submit"
                    size="lg"
                    name="approve"
                    value="1"
                    variant="primary"
                    className="w-100"
                    label={changeUserLabel}
                />
            </form>
        </div>
    );
}
