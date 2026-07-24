<?php
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

namespace core_auth\output;

use core\output\help_icon;
use core\url;

/**
 * Login renderable class.
 *
 * @package    core_auth
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class login_form implements
    \core\output\react_component_renderable,
    \core\output\renderable
{
    use login_renderable_trait {
        get_react_component_props as shared_get_react_component_props;
    }

    /** @var ?bool Whether login as guest is allowed. If null the value is calculated from site settings */
    protected ?bool $canloginasguest = null;

    /** @var ?bool Whether signup is allowed. If null the value is calcualted from site settings */
    protected ?bool $signupallowed = null;

    /**
     * Constructor.
     *
     * @param url $action The URL to submit the form to.
     * @param array $authsequence The enabled sequence of authentication plugins.
     * @param string $username The username to display.
     */
    public function __construct(
        url $action,
        /** @var string[] The order of authentication plugins */
        private array $authsequence,
        /** @var string The user name to pre-fill the form with. */
        private string $username = '',
    ) {
        $this->set_action_url($action);
    }

    #[\Override]
    public function get_react_component_name(): string {
        return 'core_auth/LoginForm';
    }

    #[\Override]
    public function get_react_component_props(
        \core\output\renderer_base $output,
    ): \stdClass {
        global $CFG;

        $data = $this->shared_get_react_component_props($output);

        $data->loginToken = \core\session\manager::get_login_token();

        $data->autoFocusForm = !empty($CFG->loginpageautofocus);

        $data->canLoginAsGuest = $this->can_login_as_guest();
        $data->canLoginByEmail = !empty($CFG->authloginviaemail);
        $data->canSignup = $this->can_signup();

        $data->forgotPasswordUrl = new url('/login/forgot_password.php');
        $data->signupUrl = (new url('/login/signup.php'))->out(false);

        $this->add_signup_instructions($data);

        // ReCaptcha.
        $data->recaptchaHtml = $this->get_recaptcha();

        // Toggle password visibility icon.
        $data->togglePassword = $this->get_toggle_password();
        $data->smallScreensOnly = get_config('core', 'loginpasswordtoggle') == TOGGLE_SENSITIVE_SMALL_SCREENS_ONLY;

        $data->forgotPasswordUrl = $data->forgotPasswordUrl->out(false);

        // Identity Providers.
        $identityproviders = \auth_plugin_base::get_identity_providers($this->authsequence);
        $data->identityProviders = \auth_plugin_base::prepare_identity_providers_for_output($identityproviders, $output);

        $data->username = $this->username;
        $data->showLoginForm = get_config('core', 'showloginform') === false || get_config('core', 'showloginform');

        return $data;
    }

    /**
     * Get an instance of the legacy login form.
     *
     * @since 5.3
     * @deprecated since 5.3, use \core_auth\output\login_form instead.
     * @return \core_auth\output\login
     */
    #[\core\attribute\deprecated(
        self::class,
        since: '5.3',
        reason: 'The \\core_auth\\output\\login renderable has been replaced '
            . 'with a new version to support a smoother migration to React',
        mdl: 'MDL-89196',
    )]
    public function get_legacy_login_form(): \core_auth\output\login {
        // This method is introduced and deprecated in the same release, so we can support a migration.
        // We want to strongly encourage all theme designers with login form customisations to migrate to the new renderable,
        // and to React.
        \core\deprecation::emit_deprecation(__METHOD__);
        $legacyform = new \core_auth\output\login($this->authsequence, $this->username);

        $legacyform->set_error($this->rawerror, $this->errorcode);
        $legacyform->set_info($this->info);

        return $legacyform;
    }

    /**
     * Can the user toggle password visibility.
     *
     * @return bool
     */
    protected function get_toggle_password(): bool {
        $value = get_config('core', 'loginpasswordtoggle');
        return $value == TOGGLE_SENSITIVE_ENABLED || $value == TOGGLE_SENSITIVE_SMALL_SCREENS_ONLY;
    }

    /**
     * Get the ReCaptcha HTML if enabled.
     *
     * @return string|null
     */
    protected function get_recaptcha(): ?string {
        global $CFG;

        if (login_captcha_enabled()) {
            require_once($CFG->libdir . '/recaptchalib_v2.php');
            return recaptcha_get_challenge_html(RECAPTCHA_API_URL, $CFG->recaptchapublickey);
        }

        return null;
    }

    /**
     * Whether the user can log in as a guest.
     *
     * @return bool
     */
    protected function can_login_as_guest(): bool {
        global $CFG;

        if ($this->canloginasguest !== null) {
            return $this->canloginasguest;
        }

        return $CFG->guestloginbutton && !isguestuser();
    }

    /**
     * Whether the user can register a new account.
     *
     * @return bool|null
     */
    protected function can_signup(): bool {
        global $CFG;

        if ($this->signupallowed !== null) {
            return $this->signupallowed;
        }

        return $CFG->registerauth == 'email' || !empty($CFG->registerauth);
    }

    /**
     * Override the default value for allowing login as guest.
     *
     * @param ?bool $canloginasguest
     */
    public function set_can_login_as_guest(?bool $canloginasguest): void {
        $this->canloginasguest = $canloginasguest;
    }

    /**
     * Override the default value for allowing signup.
     *
     * @param ?bool $allowed
     */
    public function set_signup_allowed(?bool $allowed): void {
        $this->signupallowed = $allowed;
    }

    /**
     * Add the signup instructions to the data.
     *
     * @param \stdClass $data
     */
    protected function add_signup_instructions(\stdClass $data): void {
        global $CFG;

        // Signup instructions.
        $data->signupInstructions = null;
        if ($this->can_signup()) {
            // These instructions are only shown when the user is able to sign up.
            if (\core\di::get(\core\authentication::class)->is_enabled('none')) {
                $data->signupInstructions = get_string('loginstepsnone');
            } else if ($CFG->registerauth == 'email' && empty($data->signupInstructions)) {
                $data->signupInstructions = get_string('logindonthaveaccount');
            }
            [$data->signupInstructions] = \core_external\util::format_text(
                $data->signupInstructions,
                FORMAT_MOODLE,
                \core\context\system::instance()->id,
            );
        }
    }
}
