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
 * The main login form, shown in the right-hand panel of the split-screen login layout.
 *
 * @module     core_auth/LoginForm
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import React, {useEffect} from 'react';
import String from '@moodle/lms/core/String';
import Pending from '@moodle/lms/core/pending';

import Logo from '@moodle/lms/core_auth/local/LoginForm/Logo';
import Maintenance from '@moodle/lms/core_auth/local/LoginForm/Maintenance';
import ErrorInfo from '@moodle/lms/core_auth/local/LoginForm/ErrorInfo';
import LoginFields from '@moodle/lms/core_auth/local/LoginForm/LoginFields';
import AuthInstructions from '@moodle/lms/core_auth/local/LoginForm/AuthInstructions';
import SignupInstructions from '@moodle/lms/core_auth/local/LoginForm/SignupInstructions';
import IdentityProviders, {type IdentityProvider} from '@moodle/lms/core_auth/local/LoginForm/IdentityProviders';
import GuestLogin from '@moodle/lms/core_auth/local/LoginForm/GuestLogin';
import LanguageMenu from '@moodle/lms/core_auth/local/LoginForm/LanguageMenu';
import CookiesNotice from '@moodle/lms/core_auth/local/LoginForm/CookiesNotice';

/** Props for the main {@link LoginForm} component. */
export interface LoginFormProps {
    /** The URL of the site logo, or false/undefined if no logo is configured. */
    logoUrl?: string | false | null;
    /** The site name, used as alt text for the logo. */
    siteName: string;
    /** A maintenance mode message to display, if the site is in maintenance mode. */
    maintenance?: string | null;
    /** Whether the standard username/password login form should be shown. */
    showLoginForm: boolean;
    /** Pre-formatted (HTML) authentication instructions for small screens, if configured. */
    authInstructions?: string | null;

    // Error/info banner.
    error?: string | null;
    errorTitle?: string | null;
    info?: string | null;

    // Login fields.
    actionUrl: string;
    username: string;
    canLoginByEmail: boolean;
    loginToken: string;
    forgotPasswordUrl: string;
    recaptchaHtml?: string | null;
    togglePassword: boolean;
    smallScreensOnly: boolean;
    autoFocusForm: boolean;

    // Signup.
    canSignup: boolean;
    signupInstructions?: string | null;
    signupUrl: string;

    // Identity providers / guest login.
    canLoginAsGuest: boolean;
    identityProviders: IdentityProvider[];

    // Language menu — the menu itself is rendered server-side (core/action_menu) and passed
    // through as pre-rendered HTML, since converting core/action_menu is out of scope here.
    languageMenuHtml?: string | null;
}

export default function LoginForm({
    logoUrl,
    siteName,
    maintenance,
    showLoginForm,
    authInstructions,
    error,
    errorTitle,
    info,
    actionUrl,
    username,
    canLoginByEmail,
    loginToken,
    forgotPasswordUrl,
    recaptchaHtml,
    togglePassword,
    smallScreensOnly,
    autoFocusForm,
    canSignup,
    signupInstructions,
    signupUrl,
    canLoginAsGuest,
    identityProviders,
    languageMenuHtml,
}: LoginFormProps): React.ReactElement {
    // Move focus to the username field once the page has settled, so screen readers announce
    // any error/info message first. Mirrors the behaviour of the original Mustache template.
    useEffect(() => {
        const errorMessageDiv = document.getElementById('loginerrormessage');
        const infoMessageDiv = document.getElementById('logininfomessage');
        if (!errorMessageDiv && !infoMessageDiv) {
            return undefined;
        }

        const pendingJs = new Pending('login-move-focus');
        const timeoutId = window.setTimeout(() => {
            // Append a non-breaking space so screen readers announce the message after page load.
            if (errorMessageDiv) {
                errorMessageDiv.innerHTML += '&nbsp;';
                document.getElementById('username')?.focus();
            }
            if (infoMessageDiv) {
                infoMessageDiv.innerHTML += '&nbsp;';
            }
            pendingJs.resolve();
        }, 500);

        return () => window.clearTimeout(timeoutId);
    }, [error, info]);

    return (
        <div className="loginform">
            <Logo logoUrl={logoUrl} siteName={siteName} />
            <h1 className="h2"><String identifier="loginwelcomeback" component="core" /></h1>
            <p className="text-muted mb-4"><String identifier="loginto" component="core" params={siteName} /></p>
            <Maintenance maintenance={maintenance} />
            <ErrorInfo error={error} errorTitle={errorTitle} info={info} />
            {showLoginForm && (
                <LoginFields
                    actionUrl={actionUrl}
                    username={username}
                    canLoginByEmail={canLoginByEmail}
                    loginToken={loginToken}
                    forgotPasswordUrl={forgotPasswordUrl}
                    recaptchaHtml={recaptchaHtml}
                    togglePassword={togglePassword}
                    smallScreensOnly={smallScreensOnly}
                    hasError={Boolean(error)}
                    autoFocusForm={autoFocusForm}
                />
            )}
            <AuthInstructions authInstructions={authInstructions} />
            <SignupInstructions canSignup={canSignup} signupInstructions={signupInstructions} signupUrl={signupUrl} />
            <IdentityProviders canLoginAsGuest={canLoginAsGuest} identityProviders={identityProviders} />
            <GuestLogin canLoginAsGuest={canLoginAsGuest} actionUrl={actionUrl} loginToken={loginToken} />
            <LanguageMenu languageMenuHtml={languageMenuHtml} />
            <CookiesNotice />
        </div>
    );
}
