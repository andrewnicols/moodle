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
 * The "Continue" / "Cancel" form shown at the bottom of the OAuth2 confirm scopes page.
 *
 * @module     core_auth/local/OAuth2/ConfirmScopesForm
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import React, {useEffect, useState} from 'react';
import {Button} from '@moodlehq/design-system';
import {getString} from '@moodle/lms/core/stringUtils';

/** Props for the {@link ConfirmScopesForm} component. */
export interface ConfirmScopesFormProps {
    /** The URL the form should be submitted to. */
    actionUrl: string;
    /** The session key used to protect the request. */
    sesskey: string;
}

export default function ConfirmScopesForm({actionUrl, sesskey}: ConfirmScopesFormProps): React.ReactElement {
    const [continueLabel, setContinueLabel] = useState('');
    const [cancelLabel, setCancelLabel] = useState('');

    useEffect(() => {
        getString('continue', 'core').then(setContinueLabel);
        getString('cancel', 'core').then(setCancelLabel);
    }, []);

    return (
        <form method="post" action={actionUrl}>
            <input type="hidden" name="sesskey" value={sesskey} />
            <div className="login-form-submit mb-3 mt-3">
                <Button
                    type="submit"
                    size="lg"
                    name="approve"
                    value="1"
                    variant="secondary"
                    className="w-100 mb-3"
                    label={continueLabel}
                />
                <Button
                    type="submit"
                    size="lg"
                    name="approve"
                    value="0"
                    variant="primary"
                    className="w-100 mb-3"
                    label={cancelLabel}
                />
            </div>
        </form>
    );
}
