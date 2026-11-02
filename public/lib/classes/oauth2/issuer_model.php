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

namespace core\oauth2;

use core\model;
use core\model\attribute\field;
use core\model\attribute\table;
use core\param;

/**
 * Example declared-property mapping for an OAuth2 issuer.
 *
 * This opt-in model maps the existing fields, not issuer's database-dependent
 * helpers or lifecycle behaviour. The caller supplies sortorder when inserting.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[table('oauth2_issuer')]
class issuer_model extends model {
    // PHPCS currently misparses property hook expressions as declarations.
    // phpcs:disable PSR2.Classes.PropertyDeclaration, moodle.Commenting.VariableComment, moodle.PHP.MemberVarScope
    /** @var string Issuer name, normalised on assignment. */
    #[field(param::TEXT)]
    public string $name {
        set => trim($value);
    }
    // phpcs:enable

    /** @var string|null Image URL. */
    #[field(param::URL, nullable: true)]
    public ?string $image = null;

    /** @var string OAuth client ID. */
    #[field(param::RAW_TRIMMED)]
    public string $clientid = '';

    /** @var string OAuth client secret. */
    #[field(param::RAW_TRIMMED)]
    public string $clientsecret = '';

    /** @var string Issuer base URL. */
    #[field(param::URL)]
    public string $baseurl = '';

    /** @var bool Whether the issuer is enabled. */
    #[field(param::BOOL)]
    public bool $enabled = true;

    /** @var int Login page and service visibility. */
    #[field(param::INT)]
    public int $showonloginpage = issuer::SERVICEONLY;

    /** @var bool Whether to use HTTP basic authentication. */
    #[field(param::BOOL)]
    public bool $basicauth = false;

    /** @var string|null Scopes supported by the issuer. */
    #[field(param::RAW, nullable: true)]
    public ?string $scopessupported = null;

    /** @var string Scopes requested for login. */
    #[field(param::RAW)]
    public string $loginscopes = 'openid profile email';

    /** @var string Scopes requested for offline login. */
    #[field(param::RAW)]
    public string $loginscopesoffline = 'openid profile email';

    /** @var string Additional login parameters. */
    #[field(param::RAW)]
    public string $loginparams = '';

    /** @var string Additional offline login parameters. */
    #[field(param::RAW)]
    public string $loginparamsoffline = '';

    /** @var string Allowed email domains. */
    #[field(param::RAW)]
    public string $alloweddomains = '';

    /** @var int Display ordering, supplied by the calling application. */
    #[field(param::INT)]
    public int $sortorder = 0;

    /** @var bool Whether account confirmation is required. */
    #[field(param::BOOL)]
    public bool $requireconfirmation = true;

    /** @var string|null Service type identifier. */
    #[field(param::ALPHANUM, nullable: true)]
    public ?string $servicetype = null;

    /** @var string|null Display name on the login page. */
    #[field(param::TEXT, nullable: true)]
    public ?string $loginpagename = null;

    /** @var string|null System account email. */
    #[field(param::EMAIL, nullable: true)]
    public ?string $systememail = null;

    /**
     * Preserve the existing issuer's HTTPS-only base URL validation.
     *
     * @param string $property Field name.
     * @param mixed $value Raw value.
     * @return true|\lang_string Validation result.
     */
    protected function validate_value(string $property, mixed $value): true|\lang_string {
        global $CFG;

        if ($property === 'baseurl' && $value !== '') {
            require_once($CFG->libdir . '/validateurlsyntax.php');
            if (!validateUrlSyntax($value, 'S+')) {
                return new \lang_string('sslonlyaccess', 'error');
            }
        }
        return true;
    }
}
