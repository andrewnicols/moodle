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
 * Tests for the core_auth LoginForm React component tree.
 *
 * @copyright  2026 Andrew Nicols <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {render, screen, waitFor, act} from '@testing-library/react';
import LoginForm, {type LoginFormProps} from '@moodle/lms/core_auth/LoginForm';

const defaultProps: LoginFormProps = {
    logoUrl: false,
    siteName: 'Beer & Chips',
    maintenance: null,
    showLoginForm: true,
    authInstructions: null,
    error: null,
    errorTitle: null,
    info: null,
    actionUrl: 'https://example.com/login/index.php',
    username: '',
    canLoginByEmail: false,
    loginToken: 'randomtoken',
    forgotPasswordUrl: 'https://example.com/login/forgot_password.php',
    recaptchaHtml: null,
    togglePassword: false,
    smallScreensOnly: false,
    autoFocusForm: false,
    canSignup: true,
    signupInstructions: null,
    signupUrl: 'https://example.com/login/signup.php',
    canLoginAsGuest: false,
    identityProviders: [],
    languageMenuHtml: null,
};

beforeEach(() => {
    mockString('loginwelcomeback', 'core', 'Welcome!');
    mockString('loginto', 'core', 'Log in to {$a}');
    mockString('username', 'core', 'Username');
    mockString('usernameemail', 'core', 'Username / email');
    mockString('enterusername', 'core', 'Enter your username');
    mockString('loginenterusernameoremail', 'core', 'Enter your username or email');
    mockString('password', 'core', 'Password');
    mockString('loginenterpassword', 'core', 'Enter your password');
    mockString('loginforgotpassword', 'core', 'Forgot your password?');
    mockString('login', 'core', 'Log in');
    mockString('loginasguest', 'core', 'Log in as a guest');
    mockString('loginstartsignup', 'core', 'Create new account');
    mockString('loginseparatoror', 'core', 'or');
    mockString('loginwith', 'core', 'Log in with {$a}');
    mockString('cookiesnotice', 'core', 'Cookies must be enabled in your browser');

    mockAmdModule('core_form/submit', {init: jest.fn()});
    mockAmdModule('core_form/events', {eventTypes: {fieldStructureChanged: 'core_form/fieldStructureChanged'}});
    mockAmdModule('core/togglesensitive', {init: jest.fn()});
});

describe('LoginForm', () => {
    it('renders the welcome heading and site name', async() => {
        await act(async() => {
            render(<LoginForm {...defaultProps} />);
        });
        await screen.findByText('Welcome!');
        await screen.findByText('Log in to Beer & Chips');
    });

    it('does not render a logo when none is configured', async() => {
        await act(async() => {
            render(<LoginForm {...defaultProps} />);
        });
        await screen.findByText('Welcome!');
        expect(document.getElementById('loginlogo')).not.toBeInTheDocument();
    });

    it('renders a logo when one is configured', async() => {
        await act(async() => {
            render(<LoginForm {...defaultProps} logoUrl="https://example.com/logo.png" />);
        });
        await screen.findByText('Welcome!');
        const logo = document.getElementById('logoimage') as HTMLImageElement;
        expect(logo).toBeInTheDocument();
        expect(logo.src).toBe('https://example.com/logo.png');
        expect(logo.alt).toBe('Beer & Chips');
    });

    it('renders the maintenance banner when a maintenance message is set', async() => {
        await act(async() => {
            render(<LoginForm {...defaultProps} maintenance="<p>Down for maintenance</p>" />);
        });
        await screen.findByText('Welcome!');
        expect(screen.getByText('Down for maintenance')).toBeInTheDocument();
    });

    it('renders the error message with an optional title, and does not render an info message', async() => {
        await act(async() => {
            render(<LoginForm {...defaultProps} error="Bad login" errorTitle="Try again" />);
        });
        await screen.findByText('Welcome!');
        const errorDiv = document.getElementById('loginerrormessage');
        expect(errorDiv).toHaveTextContent('Try again');
        expect(errorDiv).toHaveTextContent('Bad login');
        expect(document.getElementById('logininfomessage')).not.toBeInTheDocument();
    });

    it('renders an info message', async() => {
        await act(async() => {
            render(<LoginForm {...defaultProps} info="You have been logged out" />);
        });
        await screen.findByText('Welcome!');
        expect(document.getElementById('logininfomessage')).toHaveTextContent('You have been logged out');
    });

    it('renders the username/password fields when showLoginForm is true', async() => {
        await act(async() => {
            render(<LoginForm {...defaultProps} />);
        });
        expect(document.getElementById('username')).toBeInTheDocument();
        expect(document.getElementById('password')).toBeInTheDocument();
        await waitFor(() => expect(screen.getByRole('button', {name: 'Log in'})).toBeInTheDocument());
    });

    it('does not render the login fields when showLoginForm is false', async() => {
        await act(async() => {
            render(<LoginForm {...defaultProps} showLoginForm={false} />);
        });
        await screen.findByText('Welcome!');
        expect(document.getElementById('login')).not.toBeInTheDocument();
    });

    it('uses email-aware labels and placeholders when canLoginByEmail is true', async() => {
        await act(async() => {
            render(<LoginForm {...defaultProps} canLoginByEmail />);
        });
        await screen.findByText('Username / email');
        expect(screen.getByPlaceholderText('Enter your username or email')).toBeInTheDocument();
    });

    it('renders the guest login form only when canLoginAsGuest is true', async() => {
        let rerender: ReturnType<typeof render>['rerender'];
        await act(async() => {
            ({rerender} = render(<LoginForm {...defaultProps} />));
        });
        await screen.findByText('Welcome!');
        expect(document.getElementById('guestlogin')).not.toBeInTheDocument();

        await act(async() => {
            rerender(<LoginForm {...defaultProps} canLoginAsGuest />);
        });
        expect(document.getElementById('guestlogin')).toBeInTheDocument();
        await waitFor(() => expect(screen.getByRole('button', {name: 'Log in as a guest'})).toBeInTheDocument());
    });

    it('renders identity provider buttons with their icon and label', async() => {
        await act(async() => {
            render(
                <LoginForm
                    {...defaultProps}
                    identityProviders={[
                        {name: 'Example SSO', url: 'https://example.com/auth/sso', iconurl: 'https://example.com/sso.png'},
                    ]}
                />,
            );
        });
        const link = await screen.findByRole('link', {name: /Log in with Example SSO/});
        expect(link).toHaveAttribute('href', 'https://example.com/auth/sso');
        expect(link.querySelector('img')).toHaveAttribute('src', 'https://example.com/sso.png');
    });

    it('renders signup instructions and a call to action when signup is allowed', async() => {
        await act(async() => {
            render(<LoginForm {...defaultProps} canSignup signupInstructions="<p>Please sign up</p>" />);
        });
        expect(screen.getByText('Please sign up')).toBeInTheDocument();
        expect(await screen.findByRole('link', {name: 'Create new account'})).toHaveAttribute(
            'href',
            'https://example.com/login/signup.php',
        );
    });

    it('renders signup instructions as plain text (no CTA) when signup is not allowed', async() => {
        await act(async() => {
            render(<LoginForm {...defaultProps} canSignup={false} signupInstructions="<p>Contact your admin</p>" />);
        });
        await screen.findByText('Welcome!');
        expect(screen.getByText('Contact your admin')).toBeInTheDocument();
        expect(screen.queryByRole('link', {name: 'Create new account'})).not.toBeInTheDocument();
    });

    it('renders the cookies notice button', async() => {
        await act(async() => {
            render(<LoginForm {...defaultProps} />);
        });
        const button = await screen.findByRole('button', {name: 'Cookies must be enabled in your browser'});
        expect(button).toHaveAttribute('data-modal', 'alert');
    });

    it('renders pre-rendered language menu HTML when provided', async() => {
        await act(async() => {
            render(<LoginForm {...defaultProps} languageMenuHtml='<a href="#">English</a>' />);
        });
        await screen.findByText('Welcome!');
        expect(screen.getByRole('link', {name: 'English'})).toBeInTheDocument();
    });

    it('initialises the submit-lock AMD module for the login button', async() => {
        const submitModule = {init: jest.fn()};
        mockAmdModule('core_form/submit', submitModule);

        await act(async() => {
            render(<LoginForm {...defaultProps} />);
        });
        await waitFor(() => expect(submitModule.init).toHaveBeenCalledWith('loginbtn'));
    });

    it('initialises the password toggle AMD module when togglePassword is enabled', async() => {
        const toggleModule = {init: jest.fn()};
        mockAmdModule('core/togglesensitive', toggleModule);

        await act(async() => {
            render(<LoginForm {...defaultProps} togglePassword smallScreensOnly />);
        });
        await waitFor(() => expect(toggleModule.init).toHaveBeenCalledWith('password', true));
    });
});
