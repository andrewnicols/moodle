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
 * The language selector menu.
 *
 * The menu itself is a `core/action_menu`, which is rendered server-side and passed through
 * as pre-rendered HTML — converting `core/action_menu` to React is out of scope here.
 *
 * @module     core_auth/local/LoginForm/LanguageMenu
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import React from 'react';

export interface LanguageMenuProps {
    /** Pre-rendered `core/action_menu` HTML for the language selector, if there is more than one language. */
    languageMenuHtml?: string | null;
}

export default function LanguageMenu({languageMenuHtml}: LanguageMenuProps): React.ReactElement | null {
    if (!languageMenuHtml) {
        return null;
    }

    return (
        <div className="login-languagemenu d-flex justify-content-center my-5">
            {/* The action menu is rendered and trusted server-side. */}
            <div dangerouslySetInnerHTML={{__html: languageMenuHtml}} />
        </div>
    );
}
