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
 * This maps identity, name and timezone columns, not the complete user table.
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
    #[field(param::NOTAGS)]
    public string $firstnamephonetic = '';

    /** @var string Phonetic last name. */
    #[field(param::NOTAGS)]
    public string $lastnamephonetic = '';

    /** @var string Middle name. */
    #[field(param::NOTAGS)]
    public string $middlename = '';

    /** @var string Alternate name. */
    #[field(param::NOTAGS)]
    public string $alternatename = '';

    /** @var string Stored timezone, including the server-default sentinel. */
    #[field(param::RAW)]
    public string $timezone = '99';

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
