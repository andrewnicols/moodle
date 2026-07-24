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
 * The "Log in as a guest" button and form.
 *
 * @module     core_auth/local/LoginForm/GuestLogin
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import React, {useEffect, useState} from 'react';
import {Button} from '@moodlehq/design-system';
import {getString} from '@moodle/lms/core/stringUtils';
import {requireAsync} from '@moodle/lms/core/amd';

/** Props for the {@link GuestLogin} component. */
export interface GuestLoginProps {
    /** Whether login as a guest is allowed. */
    canLoginAsGuest: boolean;
    /** The URL the guest login form should be submitted to. */
    actionUrl: string;
    /** The random token used to protect the login request. */
    loginToken: string;
}

export default function GuestLogin({
    canLoginAsGuest,
    actionUrl,
    loginToken,
}: GuestLoginProps): React.ReactElement | null {
    const [label, setLabel] = useState('');

    useEffect(() => {
        if (canLoginAsGuest) {
            getString('loginasguest').then(setLabel);
        }
    }, [canLoginAsGuest]);

    // Disable the submit button once it has been used, to prevent double submission.
    useEffect(() => {
        if (!canLoginAsGuest) {
            return;
        }

        requireAsync<{init:(elementId: string) => void}>('core_form/submit').then((submit) => {
            submit.init('loginguestbtn');
            return;
        });
    }, [canLoginAsGuest]);

    if (!canLoginAsGuest) {
        return null;
    }

    return (
        <form action={actionUrl} method="post" id="guestlogin" className="mb-4">
            <input type="hidden" name="logintoken" value={loginToken} />
            <input type="hidden" name="username" value="guest" />
            <input type="hidden" name="password" value="guest" />
            <Button
                type="submit"
                id="loginguestbtn"
                variant="outline-secondary"
                className="w-100"
                startIcon={<i className="fa fa-user me-2" aria-hidden="true" />}
                label={label}
                size="lg"
            />
        </form>
    );
}
