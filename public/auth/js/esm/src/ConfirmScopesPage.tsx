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
 * The OAuth2 "confirm scopes" page, asking the user to approve or reject the access
 * requested by an OAuth2 client.
 *
 * @module     core_auth/ConfirmScopesPage
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import React from 'react';
import String from '@moodle/lms/core/String';

import Logo from '@moodle/lms/core_auth/local/LoginForm/Logo';
import Maintenance from '@moodle/lms/core_auth/local/LoginForm/Maintenance';
import ErrorInfo from '@moodle/lms/core_auth/local/LoginForm/ErrorInfo';
import LanguageMenu from '@moodle/lms/core_auth/local/LoginForm/LanguageMenu';
import CookiesNotice from '@moodle/lms/core_auth/local/LoginForm/CookiesNotice';

import UserInfo from '@moodle/lms/core_auth/local/OAuth2/UserInfo';
import ClientDescription from '@moodle/lms/core_auth/local/OAuth2/ClientDescription';
import ScopeInformation, {type RequestedScope} from '@moodle/lms/core_auth/local/OAuth2/ScopeInformation';
import ConfirmScopesForm from '@moodle/lms/core_auth/local/OAuth2/ConfirmScopesForm';

/** Props for the {@link ConfirmScopesPage} component. */
export interface ConfirmScopesPageProps {
    /** The URL of the site logo, or false/undefined if no logo is configured. */
    logoUrl?: string | false | null;
    /** The site name. */
    siteName: string;
    /** A maintenance mode message to display, if the site is in maintenance mode. */
    maintenance?: string | null;

    // Error/info banner.
    error?: string | null;
    errorTitle?: string | null;
    info?: string | null;

    // The requesting OAuth2 client.
    clientName: string;
    clientDescription?: string | null;
    clientPrivacyUrl?: string | null;
    clientTermsUrl?: string | null;

    // The current user.
    userPictureHtml: string;
    userProfileUrl: string;

    // The scopes being requested.
    requestedScopes: RequestedScope[];

    // The confirm/cancel form.
    actionUrl: string;
    sesskey: string;

    // Language menu — see core_auth/LoginForm for why this is pre-rendered HTML.
    languageMenuHtml?: string | null;
}

export default function ConfirmScopesPage({
    logoUrl,
    siteName,
    maintenance,
    error,
    errorTitle,
    info,
    clientName,
    clientDescription,
    clientPrivacyUrl,
    clientTermsUrl,
    userPictureHtml,
    userProfileUrl,
    requestedScopes,
    actionUrl,
    sesskey,
    languageMenuHtml,
}: ConfirmScopesPageProps): React.ReactElement {
    return (
        <div className="login_form">
            <Logo logoUrl={logoUrl} siteName={siteName} />

            <h2>
                <String
                    identifier="oauth2:confirmscopes:clientaccesstitle"
                    component="core"
                    params={{clientname: clientName, sitename: siteName}}
                />
            </h2>

            <UserInfo userPictureHtml={userPictureHtml} />
            <ClientDescription clientDescription={clientDescription} />
            <Maintenance maintenance={maintenance} />
            <ErrorInfo error={error} errorTitle={errorTitle} info={info} />
            <ScopeInformation
                clientName={clientName}
                siteName={siteName}
                requestedScopes={requestedScopes}
                profileUrl={userProfileUrl}
                clientPrivacyUrl={clientPrivacyUrl}
                clientTermsUrl={clientTermsUrl}
            />
            <ConfirmScopesForm actionUrl={actionUrl} sesskey={sesskey} />
            <LanguageMenu languageMenuHtml={languageMenuHtml} />
            <CookiesNotice />
        </div>
    );
}
