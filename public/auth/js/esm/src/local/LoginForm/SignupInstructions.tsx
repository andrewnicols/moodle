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
 * Signup instructions and call-to-action link, shown below the login form.
 *
 * @module     core_auth/local/LoginForm/SignupInstructions
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import React from 'react';
import String from '@moodle/lms/core/String';

/** Props for the {@link SignupInstructions} component. */
export interface SignupInstructionsProps {
    /** Whether new users are able to sign up for an account. */
    canSignup: boolean;
    /** Pre-formatted (HTML) signup instructions, if any are configured. */
    signupInstructions?: string | null;
    /** The URL of the signup page. */
    signupUrl: string;
}

export default function SignupInstructions({
    canSignup,
    signupInstructions,
    signupUrl,
}: SignupInstructionsProps): React.ReactElement | null {
    if (canSignup) {
        return (
            <div className="text-center small mb-3">
                {signupInstructions && (
                    <span
                        className="text-muted me-1"
                        // Signup instructions are formatted server-side before storage.
                        dangerouslySetInnerHTML={{__html: signupInstructions}}
                    />
                )}
                <a href={signupUrl}><String identifier="loginstartsignup" component="core" /></a>
            </div>
        );
    }

    if (signupInstructions) {
        return (
            <p
                className="small mb-3"
                // Signup instructions are formatted server-side before storage.
                dangerouslySetInnerHTML={{__html: signupInstructions}}
            />
        );
    }

    return null;
}
