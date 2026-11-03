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

namespace core_user;

use core\model;
use core\model\attribute\expose;
use core\model\attribute\field;
use core\param;

/**
 * Read-only database projection demonstrating model-backed user exposure.
 *
 * Maps user-table columns for the existing profile visibility and formatting APIs.
 * No table attribute is provided: generic manager writes are intentionally disabled.
 * In-memory edits are supported; user persistence must use the existing user APIs.
 *
 * Exposure is not permission checking. Do not serialize this raw projection into
 * public REST responses; use local\user_representation for viewer-filtered details.
 *
 * @package    core_user
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class user_model extends model {
    /** @var int User ID. */
    #[field(param::INT)]
    #[expose(param::INT, readonly: true)]
    public int $id = 0;

    /** @var int Creation time. */
    #[field(param::INT)]
    protected int $timecreated = 0;

    /** @var int Modification time. */
    #[field(param::INT)]
    protected int $timemodified = 0;

    /** @var string Username. */
    #[field(param::USERNAME)]
    #[expose(param::USERNAME)]
    public string $username;

    /** @var string First name. */
    #[field(param::NOTAGS)]
    #[expose(param::NOTAGS, name: 'firstName')]
    public string $firstname = '';

    /** @var string Last name. */
    #[field(param::NOTAGS)]
    #[expose(param::NOTAGS, name: 'lastName')]
    public string $lastname = '';

    /** @var string Phonetic first name. */
    #[field(param::NOTAGS, nullable: true)]
    public ?string $firstnamephonetic = '';

    /** @var string Phonetic last name. */
    #[field(param::NOTAGS, nullable: true)]
    public ?string $lastnamephonetic = '';

    /** @var string Middle name. */
    #[field(param::NOTAGS, nullable: true)]
    public ?string $middlename = '';

    /** @var string Alternate name. */
    #[field(param::NOTAGS, nullable: true)]
    public ?string $alternatename = '';

    /** @var string Stored timezone, including the server-default sentinel. */
    #[field(param::RAW)]
    public string $timezone = '99';

    /** @var string Authentication plugin. */
    #[field(param::RAW)]
    public string $auth = 'manual';
    /** @var int Confirmation flag, kept in database form for legacy callbacks. */
    #[field(param::INT)]
    public int $confirmed = 0;
    /** @var int Policy acceptance flag. */
    #[field(param::INT)]
    public int $policyagreed = 0;
    /** @var int Deletion flag. */
    #[field(param::INT)]
    public int $deleted = 0;
    /** @var int Suspension flag. */
    #[field(param::INT)]
    public int $suspended = 0;
    /** @var int MNet host. */
    #[field(param::INT)]
    public int $mnethostid = 0;
    /** @var string Password hash, never exposed in the representation. */
    #[field(param::RAW)]
    protected string $password = '';
    /** @var string External identifier. */
    #[field(param::RAW)]
    public string $idnumber = '';
    /** @var string Email address. */
    #[field(param::RAW)]
    public string $email = '';
    /** @var int Email delivery disabled flag. */
    #[field(param::INT)]
    public int $emailstop = 0;
    /** @var string Phone number. */
    #[field(param::RAW)]
    public string $phone1 = '';
    /** @var string Alternate phone number. */
    #[field(param::RAW)]
    public string $phone2 = '';
    /** @var string Institution. */
    #[field(param::RAW)]
    public string $institution = '';
    /** @var string Department. */
    #[field(param::RAW)]
    public string $department = '';
    /** @var string Address. */
    #[field(param::RAW)]
    public string $address = '';
    /** @var string City. */
    #[field(param::RAW)]
    public string $city = '';
    /** @var string Country. */
    #[field(param::RAW)]
    public string $country = '';
    /** @var string Language preference. */
    #[field(param::RAW)]
    public string $lang = 'en';
    /** @var string Calendar preference. */
    #[field(param::RAW)]
    public string $calendartype = 'gregorian';
    /** @var string Theme preference. */
    #[field(param::RAW)]
    public string $theme = '';
    /** @var int First access time. */
    #[field(param::INT)]
    public int $firstaccess = 0;
    /** @var int Last access time. */
    #[field(param::INT)]
    public int $lastaccess = 0;
    /** @var int Previous login time. */
    #[field(param::INT)]
    public int $lastlogin = 0;
    /** @var int Current login time. */
    #[field(param::INT)]
    public int $currentlogin = 0;
    /** @var string Last IP address. */
    #[field(param::RAW)]
    public string $lastip = '';
    /** @var string Account secret, never exposed in the representation. */
    #[field(param::RAW)]
    protected string $secret = '';
    /** @var int Profile picture revision. */
    #[field(param::INT)]
    public int $picture = 0;
    /** @var string|null Profile description. */
    #[field(param::RAW, nullable: true)]
    public ?string $description = null;
    /** @var int Description format. */
    #[field(param::INT)]
    public int $descriptionformat = 1;
    /** @var int Mail format. */
    #[field(param::INT)]
    public int $mailformat = 1;
    /** @var int Mail digest preference. */
    #[field(param::INT)]
    public int $maildigest = 0;
    /** @var int Email visibility preference. */
    #[field(param::INT)]
    public int $maildisplay = 2;
    /** @var int Forum subscription preference. */
    #[field(param::INT)]
    public int $autosubscribe = 1;
    /** @var int Forum tracking preference. */
    #[field(param::INT)]
    public int $trackforums = 0;
    /** @var int Trust flags. */
    #[field(param::INT)]
    public int $trustbitmask = 0;
    /** @var string|null Picture alternate text. */
    #[field(param::RAW, nullable: true)]
    public ?string $imagealt = null;

    // PHPCS currently misparses property hook expressions as declarations.
    // phpcs:disable PSR2.Classes.PropertyDeclaration, moodle.Commenting.VariableComment, moodle.PHP.MemberVarScope
    /** @var string Name computed from current fields and Moodle name-format settings. */
    #[expose(param::NOTAGS, name: 'fullName')]
    public string $fullname {
        get => \core\user::get_fullname($this->to_record());
    }

    /** @var string Effective timezone, including forced and server settings. */
    #[expose(param::TIMEZONE, name: 'timeZone')]
    public string $effectivetimezone {
        get => \core_date::get_user_timezone($this->to_record());
    }

    /** @var string|null Explicit preference, independent of forced/server timezone. */
    #[expose(param::TIMEZONE, name: 'timeZonePreference', nullable: true)]
    public ?string $timezonepreference {
        get => in_array($this->timezone, ['', '99'], true) ? null : \core_date::normalise_timezone($this->timezone);
    }
    // phpcs:enable
}
