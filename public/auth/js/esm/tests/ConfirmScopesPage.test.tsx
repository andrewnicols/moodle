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
 * Tests for the core_auth ConfirmScopesPage React component tree.
 *
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {render, screen, act} from '@testing-library/react';
import ConfirmScopesPage, {type ConfirmScopesPageProps} from '@moodle/lms/core_auth/ConfirmScopesPage';

const defaultProps: ConfirmScopesPageProps = {
    logoUrl: false,
    siteName: 'Beer & Chips',
    maintenance: null,
    error: null,
    errorTitle: null,
    info: null,
    clientName: 'Example App',
    clientDescription: null,
    clientPrivacyUrl: null,
    clientTermsUrl: null,
    userPictureHtml: '<img src="https://example.com/pix/u/2/f1" alt="Jane Doe" />',
    userProfileUrl: 'https://example.com/user/profile.php?id=2',
    requestedScopes: [
        {identifier: 'core_user/read', description: 'Read your profile'},
    ],
    actionUrl: 'https://example.com/oauth2/approve',
    sesskey: 'sesskeyvalue',
    languageMenuHtml: null,
};

beforeEach(() => {
    mockString('oauth2:confirmscopes:clientaccesstitle', 'core', '{$a->clientname} wants to access your {$a->sitename} account.');
    mockString('oauth2:confirmscopes:beforelist', 'core', 'When you allow this access, {$a->clientname} will be able to:');
    mockString('oauth2:confirmscopes:makesureyoutrust', 'core', 'Make sure you trust {$a->clientname}.');
    mockString(
        'oauth2:confirmscopes:reviewpolicies',
        'core',
        'Review {$a->clientname} <a href="{$a->clientprivacypolicy}">Privacy Policy</a> and '
            + '<a href="{$a->clienttermsofservice}">Terms of Service</a>.',
    );
    mockString(
        'oauth2:confirmscopes:moodleaccount',
        'core',
        'To make changes at any time, go to your <a href="{$a->profilelink}">{$a->sitename} Account</a>.',
    );
    mockString('continue', 'core', 'Continue');
    mockString('cancel', 'core', 'Cancel');
    mockString('cookiesnotice', 'core', 'Cookies must be enabled in your browser');
});

describe('ConfirmScopesPage', () => {
    it('renders the client access title with the client and site names', async() => {
        await act(async() => {
            render(<ConfirmScopesPage {...defaultProps} />);
        });
        await screen.findByText('Example App wants to access your Beer & Chips account.');
    });

    it('renders the requested scopes', async() => {
        await act(async() => {
            render(<ConfirmScopesPage {...defaultProps} />);
        });
        await screen.findByText('Read your profile');
    });

    it('renders the client description when provided', async() => {
        await act(async() => {
            render(<ConfirmScopesPage {...defaultProps} clientDescription="<p>A useful app</p>" />);
        });
        expect(screen.getByText('A useful app')).toBeInTheDocument();
    });

    it('does not render a client description when none is provided', async() => {
        await act(async() => {
            render(<ConfirmScopesPage {...defaultProps} />);
        });
        await screen.findByText('Read your profile');
        expect(document.querySelector('.alert-primary')).not.toBeInTheDocument();
    });

    it('renders the user picture', async() => {
        await act(async() => {
            render(<ConfirmScopesPage {...defaultProps} />);
        });
        const img = await screen.findByAltText('Jane Doe');
        expect(img).toHaveAttribute('src', 'https://example.com/pix/u/2/f1');
    });

    it('renders the review-policies notice with links when the client has policy URLs', async() => {
        await act(async() => {
            render(
                <ConfirmScopesPage
                    {...defaultProps}
                    clientPrivacyUrl="https://example.com/privacy"
                    clientTermsUrl="https://example.com/terms"
                />,
            );
        });
        const privacyLink = await screen.findByRole('link', {name: 'Privacy Policy'});
        expect(privacyLink).toHaveAttribute('href', 'https://example.com/privacy');
        expect(screen.getByRole('link', {name: 'Terms of Service'})).toHaveAttribute(
            'href',
            'https://example.com/terms',
        );
    });

    it('does not render the review-policies notice when the client has no policy URLs', async() => {
        await act(async() => {
            render(<ConfirmScopesPage {...defaultProps} />);
        });
        await screen.findByText('Read your profile');
        expect(screen.queryByRole('link', {name: 'Privacy Policy'})).not.toBeInTheDocument();
    });

    it('renders the maintenance banner when set', async() => {
        await act(async() => {
            render(<ConfirmScopesPage {...defaultProps} maintenance="<p>Down for maintenance</p>" />);
        });
        expect(screen.getByText('Down for maintenance')).toBeInTheDocument();
    });

    it('renders the confirm/cancel form pointing at the action URL', async() => {
        await act(async() => {
            render(<ConfirmScopesPage {...defaultProps} />);
        });
        const continueButton = await screen.findByRole('button', {name: 'Continue'});
        const form = continueButton.closest('form');
        expect(form).toHaveAttribute('action', 'https://example.com/oauth2/approve');
        expect(screen.getByRole('button', {name: 'Cancel'})).toBeInTheDocument();
    });

    it('renders pre-rendered language menu HTML when provided', async() => {
        await act(async() => {
            render(<ConfirmScopesPage {...defaultProps} languageMenuHtml='<a href="#">English</a>' />);
        });
        expect(screen.getByRole('link', {name: 'English'})).toBeInTheDocument();
    });
});
