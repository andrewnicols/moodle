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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

namespace core\router\schema\parameters;

use core\param;
use core\router\schema\referenced_object;

/**
 * The If-Match conditional request header.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class if_match extends header_object implements referenced_object {
    /**
     * Constructor.
     */
    public function __construct() {
        parent::__construct(
            name: 'If-Match',
            type: param::RAW,
            required: false,
            description: implode(' ', [
                'An optional ETag, as previously returned by this resource.',
                'Include the literal double quotes, for example `"abc123"`.',
                'If supplied, the change is only applied if it matches the current ETag of the resource,',
                'otherwise the request fails with a 412 Precondition Failed response.',
                'If omitted, the change is applied unconditionally.',
            ]),
        );
    }
}
