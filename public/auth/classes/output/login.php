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

/**
 * Login renderable.
 *
 * @package    core_auth
 * @copyright  2016 Frédéric Massart - FMCorz.net
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace core_auth\output;

use context_system;
use help_icon;
use moodle_url;
use renderable;
use renderer_base;
use stdClass;
use templatable;

/**
 * Login renderable class.
 *
 * @package    core_auth
 * @copyright  2016 Frédéric Massart - FMCorz.net
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class login implements renderable, templatable {
    use \core_auth\output\login_renderable_trait;

    /** @var bool Whether to auto focus the form fields. */
    public $autofocusform;
    /** @var bool Whether we can login as guest. */
    public $canloginasguest;
    /** @var bool Whether we can login by e-mail. */
    public $canloginbyemail;
    /** @var bool Whether we can sign-up. */
    public $cansignup;
    /** @var help_icon The cookies help icon. */
    public $cookieshelpicon;
    /** @var moodle_url Forgot password URL. */
    public $forgotpasswordurl;
    /** @var array Additional identify providers, contains the keys 'url', 'name' and 'icon'. */
    public $identityproviders;
    /** @var string Login instructions, if any. */
    public $instructions;
    /** @var moodle_url The form action login URL. */
    public $loginurl;
    /** @var moodle_url The sign-up URL. */
    public $signupurl;
    /** @var string The user name to pre-fill the form with. */
    public $username;
    /** @var string The csrf token to limit login to requests that come from the login form. */
    public $logintoken;
    /** @var string ReCaptcha element HTML. */
    public $recaptcha;
    /** @var bool Toggle the password visibility icon. */
    public $togglepassword;
    /** @var bool Toggle the password visibility icon for small screens only. */
    public $smallscreensonly;

    /**
     * Constructor.
     *
     * @param array $authsequence The enabled sequence of authentication plugins.
     * @param string $username The username to display.
     */
    public function __construct(array $authsequence, $username = '') {
        global $CFG, $OUTPUT, $PAGE;

        $this->username = $username;

        $languagedata = new \core\output\language_menu($PAGE);

        $this->canloginasguest = $CFG->guestloginbutton && !isguestuser();
        $this->canloginbyemail = !empty($CFG->authloginviaemail);
        $this->cansignup = $CFG->registerauth == 'email' || !empty($CFG->registerauth);
        if ($CFG->rememberusername == 0) {
            $this->cookieshelpicon = new help_icon('cookiesenabledonlysession', 'core');
        } else {
            $this->cookieshelpicon = new help_icon('cookiesenabled', 'core');
        }

        $this->autofocusform = !empty($CFG->loginpageautofocus);

        $this->forgotpasswordurl = new moodle_url('/login/forgot_password.php');
        $this->loginurl = new moodle_url('/login/index.php');
        $this->signupurl = new moodle_url('/login/signup.php');

        // Authentication instructions.
        $this->instructions = $CFG->auth_instructions;
        if (is_enabled_auth('none')) {
            $this->instructions = get_string('loginstepsnone');
        } else if ($CFG->registerauth == 'email' && empty($this->instructions)) {
            $this->instructions = get_string('logindonthaveaccount');
        }

        // Identity providers.
        $this->identityproviders = \auth_plugin_base::get_identity_providers($authsequence);
        $this->logintoken = \core\session\manager::get_login_token();

        // ReCaptcha.
        if (login_captcha_enabled()) {
            require_once($CFG->libdir . '/recaptchalib_v2.php');
            $this->recaptcha = recaptcha_get_challenge_html(RECAPTCHA_API_URL, $CFG->recaptchapublickey);
        }

        // Toggle password visibility icon.
        $this->togglepassword = get_config('core', 'loginpasswordtoggle') == TOGGLE_SENSITIVE_ENABLED ||
            get_config('core', 'loginpasswordtoggle') == TOGGLE_SENSITIVE_SMALL_SCREENS_ONLY;
        $this->smallscreensonly = get_config('core', 'loginpasswordtoggle') == TOGGLE_SENSITIVE_SMALL_SCREENS_ONLY;
    }

    #[\Override]
    public function export_for_template(renderer_base $output) {

        $identityproviders = \auth_plugin_base::prepare_identity_providers_for_output($this->identityproviders, $output);

        $data = new stdClass();
        $data->autofocusform = $this->autofocusform;
        $data->canloginasguest = $this->canloginasguest;
        $data->canloginbyemail = $this->canloginbyemail;
        $data->cansignup = $this->cansignup;
        $data->cookieshelpicon = $this->cookieshelpicon->export_for_template($output);
        $data->error = $this->get_error();
        $data->errortitle = $this->get_error_title();
        $data->info = $this->get_info();
        $data->forgotpasswordurl = $this->forgotpasswordurl->out(false);
        $data->hasidentityproviders = !empty($this->identityproviders);
        $data->identityproviders = $identityproviders;
        list($data->instructions, $data->instructionsformat) = \core_external\util::format_text($this->instructions, FORMAT_MOODLE,
            context_system::instance()->id);
        $data->loginurl = $this->loginurl->out(false);
        $data->signupurl = $this->signupurl->out(false);
        $data->username = $this->username;
        $data->logintoken = $this->logintoken;
        $data->maintenance = format_text($this->get_maintenance(), FORMAT_MOODLE);
        $data->languagemenu = $this->get_language_menu($output);
        $data->recaptcha = $this->recaptcha;
        $data->togglepassword = $this->togglepassword;
        $data->smallscreensonly = $this->smallscreensonly;
        $data->showloginform = get_config('core', 'showloginform') === false || get_config('core', 'showloginform');

        return $data;
    }
}
