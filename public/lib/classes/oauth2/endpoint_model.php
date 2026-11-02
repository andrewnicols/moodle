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
 * Example declared-property mapping for an OAuth2 endpoint.
 *
 * This opt-in model does not replace the existing endpoint persistent.
 *
 * @package    core
 * @copyright  2026 Andrew Nicols
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[table('oauth2_endpoint')]
class endpoint_model extends model {
    /** @var int Issuer owning the endpoint. */
    #[field(param::INT)]
    public int $issuerid;

    // PHPCS currently misparses property hook expressions as declarations.
    // phpcs:disable PSR2.Classes.PropertyDeclaration, moodle.Commenting.VariableComment, moodle.PHP.MemberVarScope
    /** @var string Endpoint name, normalised on assignment. */
    #[field(param::ALPHANUMEXT)]
    public string $name {
        set => trim($value);
    }
    // phpcs:enable

    /** @var string Endpoint URL. */
    #[field(param::URL)]
    public string $url;
}
