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

namespace core\router\middleware;

/**
 * An attribute to indicate that a route must never be protected by Idempotency-Key replay (see
 * {@see idempotency_key_middleware}).
 *
 * Captured responses are persisted (encrypted at rest) so that they can be replayed to a client
 * which retries a request. For most endpoints that is exactly what is wanted, but some endpoints
 * return sensitive data which must never be written to storage at all, even encrypted - for
 * example, an endpoint which mints a new Personal Access Token: the token itself must only ever
 * exist in the single response it was issued in, not persisted a second time for later replay.
 *
 * A request carrying the Idempotency-Key header for a route marked with this attribute is
 * rejected outright with a 400 Bad Request (see
 * {@see \core\exception\api\idempotency\idempotency_unsupported_exception}), rather than the
 * header being silently ignored: a client relying on the header for duplicate-request protection
 * should be told plainly that this endpoint cannot provide it, rather than believing it has
 * protection it does not have.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\Attribute(\Attribute::TARGET_METHOD)]
final class idempotency_unsupported {
}
