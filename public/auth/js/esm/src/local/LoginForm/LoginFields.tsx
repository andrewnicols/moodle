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
 * The username/password login form fields.
 *
 * @module     core_auth/local/LoginForm/LoginFields
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import React, {useEffect, useRef, useState} from 'react';
import {Button} from '@moodlehq/design-system';
import String from '@moodle/lms/core/String';
import {getStrings} from '@moodle/lms/core/stringUtils';
import {requireAsync, requireManyAsync} from '@moodle/lms/core/amd';

/** Props for the {@link LoginFields} component (the actual username/password form). */
export interface LoginFieldsProps {
    /** The URL the login form should be submitted to. */
    actionUrl: string;
    /** The username to prefill the form with. */
    username: string;
    /** Whether login by email address is allowed, changing labels/placeholders. */
    canLoginByEmail: boolean;
    /** The random token used to protect the login request. */
    loginToken: string;
    /** The URL of the "forgot password" page. */
    forgotPasswordUrl: string;
    /** Pre-rendered ReCaptcha HTML, if ReCaptcha is enabled. */
    recaptchaHtml?: string | null;
    /** Whether the password field should offer a show/hide toggle. */
    togglePassword: boolean;
    /** Whether the show/hide toggle should only be offered on small screens. */
    smallScreensOnly: boolean;
    /** Whether there is currently a login error being displayed. */
    hasError: boolean;
    /** Whether the username (or password) field should be automatically focused. */
    autoFocusForm: boolean;
}

/** Language strings needed by this component, keyed for readability. */
interface Strings {
    usernamePlaceholder: string;
    passwordPlaceholder: string;
    login: string;
}

export default function LoginFields({
    actionUrl,
    username,
    canLoginByEmail,
    loginToken,
    forgotPasswordUrl,
    recaptchaHtml,
    togglePassword,
    smallScreensOnly,
    hasError,
    autoFocusForm,
}: LoginFieldsProps): React.ReactElement {
    const anchorRef = useRef<HTMLInputElement>(null);
    const [strings, setStrings] = useState<Strings | null>(null);

    useEffect(() => {
        getStrings([
            {key: canLoginByEmail ? 'loginenterusernameoremail' : 'enterusername', component: 'core'},
            {key: 'loginenterpassword', component: 'core'},
            {key: 'login', component: 'core'},
        ]).then(([
            usernamePlaceholder,
            passwordPlaceholder,
            login,
        ]) => {
            setStrings({usernamePlaceholder, passwordPlaceholder, login});
            return;
        });
    }, [canLoginByEmail]);

    // Preserve the URL hash across the form submission (e.g. deep links into a course).
    useEffect(() => {
        if (anchorRef.current) {
            anchorRef.current.value = location.hash;
        }
    }, []);

    // Disable the submit button once it has been used, to prevent double submission.
    useEffect(() => {
        requireAsync<{init:(elementId: string) => void}>('core_form/submit').then((submit) => {
            submit.init('loginbtn');
            return;
        });
    }, []);

    // Move focus into the username/password field, unless there is an error being displayed.
    useEffect(() => {
        if (hasError || !autoFocusForm) {
            return undefined;
        }

        type FormEvents = {eventTypes: {fieldStructureChanged: string}};

        let formEvents: FormEvents | null = null;

        const autoFocus = () => {
            const userNameField = document.getElementById('username') as HTMLInputElement | null;
            const passwordField = document.getElementById('password');
            if (userNameField && userNameField.value.length === 0) {
                userNameField.focus();
            } else {
                passwordField?.focus();
            }
        };

        requireAsync<FormEvents>('core_form/events').then((events) => {
            formEvents = events;
            autoFocus();
            window.addEventListener(events.eventTypes.fieldStructureChanged, autoFocus);
            return;
        });

        return () => {
            if (formEvents) {
                window.removeEventListener(formEvents.eventTypes.fieldStructureChanged, autoFocus);
            }
        };
    }, [hasError, autoFocusForm]);

    // Offer a show/hide toggle on the password field, if enabled.
    useEffect(() => {
        if (!togglePassword) {
            return;
        }

        requireManyAsync(['core/togglesensitive']).then(([toggleSensitive]) => {
            (toggleSensitive as {init: (elementId: string, smallScreensOnly: boolean) => void}).init(
                'password',
                smallScreensOnly,
            );
            return;
        });
    }, [togglePassword, smallScreensOnly]);

    return (
        <form className="login-form" action={actionUrl} method="post" id="login">
            <input ref={anchorRef} id="anchor" type="hidden" name="anchor" defaultValue="" />
            <input type="hidden" name="logintoken" value={loginToken} />
            <div className="login-form-username mb-3">
                <label htmlFor="username" className="form-label">
                    <String identifier={canLoginByEmail ? 'usernameemail' : 'username'} component="core" />
                </label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    className="form-control"
                    defaultValue={username}
                    placeholder={strings?.usernamePlaceholder ?? ''}
                    autoComplete="username"
                />
            </div>
            <div className="login-form-password mb-3">
                <label htmlFor="password" className="form-label">
                    <String identifier="password" component="core" />
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    defaultValue=""
                    className="form-control"
                    placeholder={strings?.passwordPlaceholder ?? ''}
                    autoComplete="current-password"
                />
            </div>
            <div className="text-end mb-3">
                <a href={forgotPasswordUrl}><String identifier="loginforgotpassword" component="core" /></a>
            </div>
            {recaptchaHtml && (
                <div className="login-form-recaptcha mb-3">
                    {/* ReCaptcha markup is generated and trusted server-side. */}
                    <div dangerouslySetInnerHTML={{__html: recaptchaHtml}} />
                </div>
            )}
            <div className="login-form-submit mb-3">
                <Button
                    type="submit"
                    id="loginbtn"
                    variant="primary"
                    className="w-100"
                    label={strings?.login ?? ''}
                    size="lg"
                    />
            </div>
        </form>
    );
}
