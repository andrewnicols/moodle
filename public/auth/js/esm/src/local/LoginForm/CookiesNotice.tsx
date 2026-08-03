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
 * The "Cookies must be enabled" notice, which opens a help modal when clicked.
 *
 * The modal itself is opened by a global delegated click handler for `data-modal`
 * attributes (see `core/utility`), so no additional JavaScript is required here.
 *
 * @module     core_auth/local/LoginForm/CookiesNotice
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {Button} from '@moodlehq/design-system';
import React, {useEffect, useState} from 'react';
import {getString} from '@moodle/lms/core/stringUtils';

export default function CookiesNotice(): React.ReactElement {
    const [label, setLabel] = useState('');

    useEffect(() => {
        getString('cookiesnotice').then(setLabel);
    }, []);

    return (
        <div className="login-cookiesnotice text-center">
            <Button
                variant="ghost"
                label={label}
                data-modal="alert"
                data-modal-title-str={JSON.stringify(['cookiesenabled', 'core'])}
                data-modal-content-str={JSON.stringify(['cookiesenabled_help_html', 'core'])}
            />
        </div>
    );
}
