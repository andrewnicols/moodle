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
    \core\output\named_templatable,
    \core\output\renderable
{
    use login_renderable_trait {
        export_for_template as shared_export_for_template;
    }

    /**
     * Constructor.
     *
     * @param array $authsequence The enabled sequence of authentication plugins.
     * @param string $username The username to display.
     */
    public function __construct(
        /** @var string[] The order of authentication plugins */
        private array $authsequence,
        /** @var string The user name to pre-fill the form with. */
        private string $username = '',
    ) {
    }

    #[\Override]
    public function get_template_name(\core\output\renderer_base $renderer): string {
        return 'core/login_form';
    }

    /**
     * Export data for the template
     *
     * @param \core\output\renderer_base $output
     * @return \stdClass
     */
    public function export_for_template(\core\output\renderer_base $output): \stdClass {
        global $CFG;

        $data = $this->shared_export_for_template($output);

        $data->logintoken = \core\session\manager::get_login_token();

        $data->autofocusform = !empty($CFG->loginpageautofocus);

        $data->canloginasguest = $CFG->guestloginbutton && !isguestuser();
        $data->canloginbyemail = !empty($CFG->authloginviaemail);
        $data->cansignup = $CFG->registerauth == 'email' || !empty($CFG->registerauth);

        $data->cookieshelpicon = $this->get_cookies_help_icon()->export_for_template($output);

        $data->forgotpasswordurl = new url('/login/forgot_password.php');
        $loginurl = new url('/login/index.php');
        $signupurl = new url('/login/signup.php');
        $data->loginurl = $loginurl->out(false);
        $data->signupurl = $signupurl->out(false);

        // Authentication instructions.
        $data->instructions = $CFG->auth_instructions;
        if (\core\di::get(\core\authentication::class)->is_enabled('none')) {
            $data->instructions = get_string('loginstepsnone');
        } else if ($CFG->registerauth == 'email' && empty($data->instructions)) {
            $data->instructions = get_string('logindonthaveaccount');
        }

        // ReCaptcha.
        $data->recaptcha = $this->get_recaptcha();

        // Toggle password visibility icon.
        $data->togglepassword = $this->get_toggle_password();
        $data->smallscreensonly = get_config('core', 'loginpasswordtoggle') == TOGGLE_SENSITIVE_SMALL_SCREENS_ONLY;

        $data->forgotpasswordurl = $data->forgotpasswordurl->out(false);

        // Identity Providers.
        $identityproviders = \auth_plugin_base::get_identity_providers($this->authsequence);
        $data->identityproviders = \auth_plugin_base::prepare_identity_providers_for_output($identityproviders, $output);
        $data->hasidentityproviders = !empty($data->identityproviders);

        // Login instructions.
        [$data->instructions, $data->instructionsformat] = \core_external\util::format_text(
            $data->instructions,
            FORMAT_MOODLE,
            \core\context\system::instance()->id,
        );
        $data->username = $this->username;
        $data->showloginform = get_config('core', 'showloginform') === false || get_config('core', 'showloginform');

        $data->hasauthinstructions = !empty($CFG->auth_instructions);

        return $data;
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
     * Get the help icon for the Cookies helper.
     *
     * @return help_icon
     */
    protected function get_cookies_help_icon(): help_icon {
        global $CFG;

        if ($CFG->rememberusername == 0) {
            return new help_icon('cookiesenabledonlysession', 'core');
        } else {
            return new help_icon('cookiesenabled', 'core');
        }
    }
}
