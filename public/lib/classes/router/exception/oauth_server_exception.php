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

namespace core\router\exception;

use League\OAuth2\Server\Exception\OAuthServerException;

/**
 * An OAuth2 server exception raised by Moodle's own router middleware.
 *
 * This is a thin subclass of the League OAuth2 Server exception used so that Moodle-raised auth
 * failures (for example a user being denied login while completing an API request) can be turned
 * into a standard OAuth2 error response in the same way as errors raised by the League library
 * itself.
 *
 * @package    core
 * @copyright  2026 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class oauth_server_exception extends OAuthServerException {
}
