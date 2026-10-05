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

use core\exception\moodle_exception;
use core\exception\response_aware_exception;
use core\router\response\not_acceptable_response;

/**
 * An exception to describe the case where an Idempotency-Key is reused against a request whose
 * original response was too large to capture for replay.
 *
 * The first request with such a key is still processed and returned to the original caller as
 * normal; only the response body is omitted from storage (see
 * {@see \core\api\repository\idempotency_key_repository::mark_complete()}). Any later request
 * reusing the same key cannot be safely replayed (the server has no copy of the original
 * response to return), so it is rejected rather than silently re-executed without protection.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class response_too_large_exception extends moodle_exception implements response_aware_exception {
    /**
     * Constructor for a new Idempotency Key response-too-large exception.
     */
    public function __construct() {
        parent::__construct(errorcode: 'idempotencykeyresponsetoolarge');
    }

    #[\Override]
    public function get_response_classname(): string {
        return not_acceptable_response::class;
    }
}
