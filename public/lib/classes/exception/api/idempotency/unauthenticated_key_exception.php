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

namespace core\exception\api\idempotency;

use core\exception\invalid_parameter_exception;

/**
 * An exception to describe the case where an Idempotency-Key header has been supplied on an
 * unauthenticated request.
 *
 * Idempotency protection requires an authenticated user: the key is scoped per-user, and without
 * that scoping, unrelated anonymous clients could collide on the same key value and have each
 * other's captured responses replayed to them. Writes are not generally expected to be performed
 * anonymously, so the request is rejected outright rather than silently processed without
 * protection.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class unauthenticated_key_exception extends invalid_parameter_exception {
}
