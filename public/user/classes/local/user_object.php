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

namespace core_user\local;

use core\model\attribute\expose;
use core\model\representation;
use core\param;

/**
 * An exposed user view, constructed only from visibility-filtered user details.
 *
 * This is a representation, not a writable mapping of the user table. In particular,
 * a visible full name must not be reconstructed from potentially hidden name parts.
 *
 * @package    core_user
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class user_object {
    /** @var int User ID. */
    #[expose(param::INT)]
    public int $id;

    /** @var string|null Username. */
    #[expose(param::USERNAME, nullable: true)]
    public ?string $username = null;

    /** @var string|null External ID. */
    #[expose(param::RAW, nullable: true)]
    public ?string $idnumber = null;

    // PHPCS currently misparses property hook expressions as declarations.
    // phpcs:disable PSR2.Classes.PropertyDeclaration, moodle.Commenting.VariableComment, moodle.PHP.MemberVarScope
    /** @var string Viewer-authorised full name. */
    #[expose(param::NOTAGS, name: 'fullName', description: 'The full name formatted for the current viewer.')]
    public string $fullname {
        get => $this->visiblefullname;
    }
    // phpcs:enable

    /** @var string|null First name. */
    #[expose(param::NOTAGS, name: 'firstName', nullable: true)]
    public ?string $firstname = null;

    /** @var string|null Last name. */
    #[expose(param::NOTAGS, name: 'lastName', nullable: true)]
    public ?string $lastname = null;

    /** @var string|null Phonetic first name. */
    #[expose(param::NOTAGS, name: 'firstNamePhonetic', nullable: true)]
    public ?string $firstnamephonetic = null;

    /** @var string|null Phonetic last name. */
    #[expose(param::NOTAGS, name: 'lastNamePhonetic', nullable: true)]
    public ?string $lastnamephonetic = null;

    /** @var string|null Middle name. */
    #[expose(param::NOTAGS, name: 'middleName', nullable: true)]
    public ?string $middlename = null;

    /** @var string|null Alternate name. */
    #[expose(param::NOTAGS, name: 'alternateName', nullable: true)]
    public ?string $alternatename = null;

    /** @var string|null Email address. */
    #[expose(param::EMAIL, nullable: true)]
    public ?string $email = null;

    /** @var string|null City. */
    #[expose(param::TEXT, nullable: true)]
    public ?string $city = null;

    /** @var string|null Country code. */
    #[expose(param::ALPHA, nullable: true)]
    public ?string $country = null;

    /** @var string|null Institution. */
    #[expose(param::TEXT, nullable: true)]
    public ?string $institution = null;

    /** @var string|null Department. */
    #[expose(param::TEXT, nullable: true)]
    public ?string $department = null;

    /** @var string|null Phone number. */
    #[expose(param::NOTAGS, name: 'phone', nullable: true)]
    public ?string $phone1 = null;

    /** @var string|null Mobile phone number. */
    #[expose(param::NOTAGS, name: 'mobilePhone', nullable: true)]
    public ?string $phone2 = null;

    /** @var string|null Address. */
    #[expose(param::TEXT, nullable: true)]
    public ?string $address = null;

    /** @var string|null Description, including formatted HTML. */
    #[expose(param::RAW, nullable: true)]
    public ?string $description = null;

    /** @var int|null Description format. */
    #[expose(param::INT, name: 'descriptionFormat', nullable: true)]
    public ?int $descriptionformat = null;

    /** @var string|null Language preference. */
    #[expose(param::LANG, name: 'language', nullable: true)]
    public ?string $lang = null;

    /** @var string|null Calendar preference. */
    #[expose(param::PLUGIN, name: 'calendarType', nullable: true)]
    public ?string $calendartype = null;

    /** @var bool|null Whether the account is confirmed. */
    #[expose(param::BOOL, nullable: true)]
    public ?bool $confirmed = null;

    /** @var string|null Authentication method. */
    #[expose(param::AUTH, name: 'authenticationMethod', nullable: true)]
    public ?string $auth = null;

    /** @var string|null Profile image URL. */
    #[expose(param::URL, name: 'profileImageUrl', nullable: true)]
    public ?string $profileimageurl = null;

    /** @var string|null Small profile image URL. */
    #[expose(param::URL, name: 'profileImageUrlSmall', nullable: true)]
    public ?string $profileimageurlsmall = null;

    /** @var string|null Profile image alternate text. */
    #[expose(param::TEXT, name: 'profileImageAlt', nullable: true)]
    public ?string $imagealt = null;

    // phpcs:disable PSR2.Classes.PropertyDeclaration, moodle.Commenting.VariableComment, moodle.PHP.MemberVarScope
    /** @var string|null Effective timezone, hidden when the stored preference is hidden. */
    #[expose(
        param::TIMEZONE,
        name: 'timeZone',
        nullable: true,
        description: 'Effective IANA timezone, including the server default.',
    )]
    public ?string $effectivetimezone {
        get => $this->timezone === null ? null : \core_date::get_user_timezone((object) ['timezone' => $this->timezone]);
    }

    /** @var string|null Explicit preference; null also means follow the server timezone. */
    #[expose(
        param::TIMEZONE,
        name: 'timeZonePreference',
        nullable: true,
        description: 'Explicit IANA timezone preference, or null for the server default.',
    )]
    public ?string $timezonepreference {
        get => in_array($this->timezone, [null, '', '99'], true) ? null : \core_date::normalise_timezone($this->timezone);
    }
    // phpcs:enable

    /** @var bool|null Whether the account is suspended. */
    #[expose(param::BOOL, nullable: true)]
    public ?bool $suspended = null;

    /** @var bool Whether the account is deleted. */
    #[expose(param::BOOL)]
    public bool $deleted;

    /** @var string Full name already formatted for the authorised viewer. */
    private string $visiblefullname;

    /** @var string|null Visible stored timezone, not itself exposed. */
    private ?string $timezone;

    /**
     * Build from core user details after its visibility and formatting decisions.
     *
     * @param array $details Result of core\user::get_user_details(), never a raw user record.
     */
    public function __construct(array $details) {
        $this->id = (int) $details['id'];
        $this->deleted = (bool) $details['deleted'];
        $this->visiblefullname = $details['fullname'];
        $this->timezone = isset($details['timezone']) ? (string) $details['timezone'] : null;
        foreach (
            [
                'username', 'idnumber', 'firstname', 'lastname', 'firstnamephonetic',
                'lastnamephonetic', 'middlename', 'alternatename', 'email', 'city', 'country',
                'institution', 'department', 'phone1', 'phone2', 'address', 'description',
                'lang', 'calendartype', 'auth', 'profileimageurl', 'profileimageurlsmall', 'imagealt',
            ] as $name
        ) {
            $this->{$name} = $details[$name] ?? null;
        }
        $this->descriptionformat = isset($details['descriptionformat']) ? (int) $details['descriptionformat'] : null;
        $this->confirmed = isset($details['confirmed']) ? (bool) $details['confirmed'] : null;
        $this->suspended = isset($details['suspended']) ? (bool) $details['suspended'] : null;
    }

    /**
     * Export only attributed fields for the existing REST payload container.
     *
     * @return array User representation.
     */
    public function to_array(): array {
        return representation::to_array($this);
    }
}
