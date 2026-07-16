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
 * The list of scopes requested by an OAuth2 client, and the information the user needs
 * to decide whether to trust that client.
 *
 * @module     core_auth/local/OAuth2/ScopeInformation
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import React, {useEffect, useState} from 'react';
import String from '@moodle/lms/core/String';
import {getString} from '@moodle/lms/core/stringUtils';

/** A single scope requested by the client, described for display to the user. */
export interface RequestedScope {
    /** The unique identifier of the scope. */
    identifier: string;
    /** A human-readable description of what access the scope grants. */
    description: string;
}

/** Props for the {@link ScopeInformation} component. */
export interface ScopeInformationProps {
    /** The name of the OAuth2 client requesting access. */
    clientName: string;
    /** The name of the site. */
    siteName: string;
    /** The scopes the client is requesting. */
    requestedScopes: RequestedScope[];
    /** The URL of the current user's profile page. */
    profileUrl: string;
    /** The client's privacy policy URL, if it has one. */
    clientPrivacyUrl?: string | null;
    /** The client's terms of service URL, if it has one. */
    clientTermsUrl?: string | null;
}

export default function ScopeInformation({
    clientName,
    siteName,
    requestedScopes,
    profileUrl,
    clientPrivacyUrl,
    clientTermsUrl,
}: ScopeInformationProps): React.ReactElement {
    const [reviewPoliciesHtml, setReviewPoliciesHtml] = useState('');
    const [moodleAccountHtml, setMoodleAccountHtml] = useState('');

    useEffect(() => {
        if (clientPrivacyUrl && clientTermsUrl) {
            getString('oauth2:confirmscopes:reviewpolicies', 'core', {
                clientname: clientName,
                clientprivacypolicy: clientPrivacyUrl,
                clienttermsofservice: clientTermsUrl,
            }).then(setReviewPoliciesHtml);
        }
    }, [clientName, clientPrivacyUrl, clientTermsUrl]);

    useEffect(() => {
        getString('oauth2:confirmscopes:moodleaccount', 'core', {
            clientname: clientName,
            profilelink: profileUrl,
            sitename: siteName,
        }).then(setMoodleAccountHtml);
    }, [clientName, profileUrl, siteName]);

    return (
        <>
            <h2 className="h4">
                <String identifier="oauth2:confirmscopes:beforelist" component="core" params={{clientname: clientName}} />
            </h2>

            <ul>
                {requestedScopes.map((scope) => (
                    <li key={scope.identifier}>{scope.description}</li>
                ))}
            </ul>

            <h2 className="h4">
                <String
                    identifier="oauth2:confirmscopes:makesureyoutrust"
                    component="core"
                    params={{clientname: clientName}}
                />
            </h2>

            {clientPrivacyUrl && clientTermsUrl && (
                // The string contains trusted links to the client's own privacy policy/terms.
                <div dangerouslySetInnerHTML={{__html: reviewPoliciesHtml}} />
            )}

            {/* The string contains a trusted link to the user's own profile page. */}
            <div dangerouslySetInnerHTML={{__html: moodleAccountHtml}} />
        </>
    );
}
