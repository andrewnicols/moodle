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
 * The list of identity provider (e.g. OAuth2) login buttons.
 *
 * @module     core_auth/local/LoginForm/IdentityProviders
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import React from 'react';
import String from '@moodle/lms/core/String';

/** A single identity provider (e.g. an OAuth2 issuer) that can be used to log in. */
export interface IdentityProvider {
    /** The display name of the identity provider. */
    name: string;
    /** The URL to start the login flow with this provider. */
    url: string;
    /** The URL of the provider's icon, if one is configured. */
    iconurl?: string;
}

/** Props for the {@link IdentityProviders} component. */
export interface IdentityProvidersProps {
    /** Whether login as a guest is allowed — used to decide whether to show a separator. */
    canLoginAsGuest: boolean;
    /** The list of identity providers to offer. */
    identityProviders: IdentityProvider[];
}

export default function IdentityProviders({
    canLoginAsGuest,
    identityProviders,
}: IdentityProvidersProps): React.ReactElement {
    const hasIdentityProviders = identityProviders.length > 0;

    return (
        <>
            {(hasIdentityProviders || canLoginAsGuest) && (
                <div className="login-separator my-5"><String identifier="loginseparatoror" component="core" /></div>
            )}
            {hasIdentityProviders && (
                <div className="login-identityproviders">
                    {identityProviders.map((provider) => (
                        <a
                            key={provider.url}
                            className="btn login-identityprovider-btn btn-outline-secondary mb-3"
                            href={provider.url}
                        >
                            {provider.iconurl && (
                                <img src={provider.iconurl} alt="" width="24" height="24" />
                            )}
                            <String identifier="loginwith" component="core" params={provider.name}>
                                {provider.name}
                            </String>
                        </a>
                    ))}
                </div>
            )}
        </>
    );
}
