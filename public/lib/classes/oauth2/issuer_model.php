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
 * Database-dependent helpers and sort-order preparation belong to issuer_model_manager.
 * This is not a subtype of the legacy issuer: integrations requiring that concrete
 * type still need an explicit adapter.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[table('oauth2_issuer')]
class issuer_model extends model {
    /** @var int Creation time. */
    #[field(param::INT)]
    protected int $timecreated = 0;

    /** @var int Modification time. */
    #[field(param::INT)]
    protected int $timemodified = 0;

    /** @var int Modifying user ID. */
    #[field(param::INT)]
    protected int $usermodified = 0;

    /** @var string Issuer name. */
    #[field(param::TEXT)]
    public string $name;

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

    /** @var int|null Display ordering, prepared by the manager before validation. */
    #[field(param::INT)]
    public ?int $sortorder = 0;

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
     * Match the legacy issuer's allowed-domain rules.
     *
     * @param string $email Email address.
     * @return bool Whether the domain is allowed.
     */
    public function is_valid_login_domain(string $email): bool {
        if (empty($this->get('alloweddomains'))) {
            return true;
        }
        $parts = explode('@', $email, 2);
        return \core\ip_utils::is_domain_in_allowed_list(
            $parts[1] ?? '',
            explode(',', $this->get('alloweddomains')),
        );
    }

    /**
     * Whether both cleaned credential fields are present.
     *
     * @return bool Configuration status.
     */
    public function is_configured(): bool {
        return !empty($this->get('clientid')) && !empty($this->get('clientsecret'));
    }

    /**
     * Format the configured display name with the system context.
     *
     * @return string Display name.
     */
    public function get_display_name(): string {
        return format_string(
            $this->get('loginpagename') ?: $this->get('name'),
            options: ['context' => \core\context\system::instance()],
        );
    }

    /**
     * Get the system account email, treating an empty string as absent.
     *
     * @return string|null Email address.
     */
    public function get_system_email(): ?string {
        return $this->get('systememail') ?: null;
    }

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
