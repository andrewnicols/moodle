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

use core\url;

/**
 * Unit tests for the login_form renderable.
 *
 * @package    core_auth
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(login_form::class)]
final class login_form_test extends \advanced_testcase {
    /**
     * Export the template data for a login_form instance.
     *
     * @param login_form $loginform
     * @return \stdClass
     */
    protected function export(login_form $loginform): \stdClass {
        global $PAGE;

        $renderer = $PAGE->get_renderer('core');
        return $loginform->export_for_template($renderer);
    }

    /**
     * By default, the ability to log in as a guest is calculated from the site settings.
     */
    public function test_canloginasguest_defaults_to_site_setting_when_enabled(): void {
        $this->resetAfterTest();

        global $CFG;
        $CFG->guestloginbutton = 1;

        $loginform = new login_form(new url('/login/index.php'), []);

        $this->assertTrue($this->export($loginform)->canloginasguest);
    }

    /**
     * By default, the ability to log in as a guest is calculated from the site settings.
     */
    public function test_canloginasguest_defaults_to_site_setting_when_disabled(): void {
        $this->resetAfterTest();

        global $CFG;
        $CFG->guestloginbutton = 0;

        $loginform = new login_form(new url('/login/index.php'), []);

        $this->assertFalse($this->export($loginform)->canloginasguest);
    }

    /**
     * Setting an explicit override for guest login takes precedence over the site setting, whether
     * enabling it when the site setting would otherwise disable it, or disabling it when the site
     * setting would otherwise enable it.
     *
     * @param bool $sitesetting The value to configure for $CFG->guestloginbutton.
     * @param bool $override The explicit override to apply.
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('boolean_combination_provider')]
    public function test_canloginasguest_override_takes_precedence(bool $sitesetting, bool $override): void {
        $this->resetAfterTest();

        global $CFG;
        $CFG->guestloginbutton = $sitesetting;

        $loginform = new login_form(new url('/login/index.php'), []);
        $loginform->set_can_login_as_guest($override);

        $this->assertEquals($override, $this->export($loginform)->canloginasguest);
    }

    /**
     * By default, whether signup is available is calculated from the site settings.
     */
    public function test_cansignup_defaults_to_site_setting_when_enabled(): void {
        $this->resetAfterTest();

        global $CFG;
        $CFG->registerauth = 'email';

        $loginform = new login_form(new url('/login/index.php'), []);

        $this->assertTrue($this->export($loginform)->cansignup);
    }

    /**
     * By default, whether signup is available is calculated from the site settings.
     */
    public function test_cansignup_defaults_to_site_setting_when_disabled(): void {
        $this->resetAfterTest();

        global $CFG;
        $CFG->registerauth = '';

        $loginform = new login_form(new url('/login/index.php'), []);

        $this->assertFalse($this->export($loginform)->cansignup);
    }

    /**
     * Setting an explicit override for signup takes precedence over the site setting, whether
     * enabling it when the site setting would otherwise disable it, or disabling it when the site
     * setting would otherwise enable it.
     *
     * @param bool $sitesetting The value to configure for $CFG->registerauth ('email' vs empty).
     * @param bool $override The explicit override to apply.
     */
    #[\PHPUnit\Framework\Attributes\DataProvider('boolean_combination_provider')]
    public function test_cansignup_override_takes_precedence(bool $sitesetting, bool $override): void {
        $this->resetAfterTest();

        global $CFG;
        $CFG->registerauth = $sitesetting ? 'email' : '';

        $loginform = new login_form(new url('/login/index.php'), []);
        $loginform->set_signup_allowed($override);

        $this->assertEquals($override, $this->export($loginform)->cansignup);
    }

    /**
     * Passing null to the override setters restores the default, site-setting-derived, behaviour.
     */
    public function test_overrides_can_be_reset_to_null(): void {
        $this->resetAfterTest();

        global $CFG;
        $CFG->guestloginbutton = 1;
        $CFG->registerauth = 'email';

        $loginform = new login_form(new url('/login/index.php'), []);
        $loginform->set_can_login_as_guest(false);
        $loginform->set_signup_allowed(false);

        // Reset both overrides back to null, which should restore the site-setting-derived values.
        $loginform->set_can_login_as_guest(null);
        $loginform->set_signup_allowed(null);

        $data = $this->export($loginform);
        $this->assertTrue($data->canloginasguest);
        $this->assertTrue($data->cansignup);
    }

    /**
     * Data provider of all combinations of a boolean site setting and a boolean override.
     *
     * @return array
     */
    public static function boolean_combination_provider(): array {
        return [
            'site enabled, override enabled' => [true, true],
            'site enabled, override disabled' => [true, false],
            'site disabled, override enabled' => [false, true],
            'site disabled, override disabled' => [false, false],
        ];
    }
}
