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

namespace core_sms;

/**
 * Class message_status.
 *
 * TODO: Decide if we want this to be an enum, or just a text-based state.
 *
 * @package    core
 * @copyright  2024 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
enum message_status: string {
    case UNKNOWN = 'unkown';

    case NOT_ATTEMPTED = 'not_attempted';

    case GATEWAY_NOT_AVAILABLE = 'gateway_not_available';

    case GATEWAY_QUEUED = 'gateway_queued';

    case GATEWAY_SENT = 'gateway_sent';

    public function is_sent(): bool {
        return in_array($this, [self::GATEWAY_SENT]);
    }
}
