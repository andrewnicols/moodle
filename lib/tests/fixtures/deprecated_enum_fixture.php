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

use \core\deprecated;

/**
 * TODO describe file deprecated_enum_fixture
 *
 * @package    core
 * @copyright  2024 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
enum deprecated_enum_fixture {
    use \core\deprecated_enum;

    case NOT_DEPRECATED;

    #[deprecated(
        'Deprecated with defaults',
    )]
    case DEPRECATED_DEFAULT;

    #[deprecated(
        'Deprecated not final not emit',
        final: false,
        emit: false,
    )]
    case DEPRECATED_NOT_FINAL_NOT_EMIT;

    #[deprecated(
        'Deprecated not final not emit',
        final: false,
    )]
    case DEPRECATED_NOT_FINAL_EMIT;

    #[deprecated(
        'Deprecated not final not emit',
        final: true,
        emit: false,
    )]
    case DEPRECATED_FINAL_NOT_EMIT;

    #[deprecated(
        'Deprecated not final not emit',
        final: true,
        emit: true,
    )]
    case DEPRECATED_FINAL_EMIT;
}
