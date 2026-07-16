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
 * Tests for the core_auth ContinueAsUserPage React component tree.
 *
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {render, screen, act} from '@testing-library/react';
import ContinueAsUserPage, {type ContinueAsUserPageProps} from '@moodle/lms/core_auth/ContinueAsUserPage';

const defaultProps: ContinueAsUserPageProps = {
    logoUrl: false,
    siteName: 'Beer & Chips',
    maintenance: null,
    error: null,
    errorTitle: null,
    info: null,
    clientName: 'Example App',
    userPictureHtml: '<img src="https://example.com/pix/u/2/f1" alt="Jane Doe" />',
    userFullName: 'Jane Doe',
    actionUrl: 'https://example.com/oauth2/login',
    logoutUrl: 'https://example.com/oauth2/logout',
    sesskey: 'sesskeyvalue',
    languageMenuHtml: null,
};

beforeEach(() => {
    mockString('oauth2:confirmscopes:clientaccesstitle', 'core', '{$a->clientname} wants to access your {$a->sitename} account.');
    mockString('oauth2:continueasuserinfo', 'core', 'You are currently logged in as {$a}');
    mockString('oauth2:contineasuser', 'core', 'Continue as {$a}');
    mockString('oauth2:contineasuser:changeuser', 'core', 'Change user');
    mockString('cookiesnotice', 'core', 'Cookies must be enabled in your browser');
});

describe('ContinueAsUserPage', () => {
    it('renders the client access title with the client and site names', async() => {
        await act(async() => {
            render(<ContinueAsUserPage {...defaultProps} />);
        });
        await screen.findByText('Example App wants to access your Beer & Chips account.');
    });

    it('renders the currently-logged-in-as message', async() => {
        await act(async() => {
            render(<ContinueAsUserPage {...defaultProps} />);
        });
        await screen.findByText('You are currently logged in as Jane Doe');
    });

    it('renders the user picture', async() => {
        await act(async() => {
            render(<ContinueAsUserPage {...defaultProps} />);
        });
        const img = await screen.findByAltText('Jane Doe');
        expect(img).toHaveAttribute('src', 'https://example.com/pix/u/2/f1');
    });

    it('renders the continue-as-user and change-user buttons pointing at the right URLs', async() => {
        await act(async() => {
            render(<ContinueAsUserPage {...defaultProps} />);
        });
        const continueButton = await screen.findByRole('button', {name: 'Continue as Jane Doe'});
        expect(continueButton.closest('form')).toHaveAttribute('action', 'https://example.com/oauth2/login');

        const changeUserButton = await screen.findByRole('button', {name: 'Change user'});
        expect(changeUserButton.closest('form')).toHaveAttribute('action', 'https://example.com/oauth2/logout');
    });

    it('renders the maintenance banner when set', async() => {
        await act(async() => {
            render(<ContinueAsUserPage {...defaultProps} maintenance="<p>Down for maintenance</p>" />);
        });
        expect(screen.getByText('Down for maintenance')).toBeInTheDocument();
    });

    it('renders the error message when set', async() => {
        await act(async() => {
            render(<ContinueAsUserPage {...defaultProps} error="Something went wrong" errorTitle="Oops" />);
        });
        const errorDiv = document.getElementById('loginerrormessage');
        expect(errorDiv).toHaveTextContent('Oops');
        expect(errorDiv).toHaveTextContent('Something went wrong');
    });

    it('renders pre-rendered language menu HTML when provided', async() => {
        await act(async() => {
            render(<ContinueAsUserPage {...defaultProps} languageMenuHtml='<a href="#">English</a>' />);
        });
        expect(screen.getByRole('link', {name: 'English'})).toBeInTheDocument();
    });
});
