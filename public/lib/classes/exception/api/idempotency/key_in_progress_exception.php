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
use core\router\response\conflict_response;

/**
 * An exception to describe the case where a request is already being processed for the supplied
 * Idempotency-Key, and so cannot be processed again concurrently.
 *
 * @package    core
 * @copyright  Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class key_in_progress_exception extends moodle_exception implements response_aware_exception {
    /**
     * Constructor for a new Idempotency Key in-progress exception.
     */
    public function __construct() {
        parent::__construct(errorcode: 'idempotencykeyinprogress');
    }

    #[\Override]
    public function get_response_classname(): string {
        return conflict_response::class;
    }
}
